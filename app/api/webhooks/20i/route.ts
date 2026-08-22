import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseRpc } from "@/lib/supabase-rpc";
import { readTwentyIInventory } from "@/lib/twentyi-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type UnknownRecord = Record<string, unknown>;

type RecordedEvent = {
  accepted: boolean;
  event_id: string;
  duplicate: boolean;
};

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as UnknownRecord) : null;
}

function firstString(record: UnknownRecord | null, keys: string[]) {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return null;
}

function eventTypeFrom(payload: unknown, request: NextRequest) {
  const record = asRecord(payload);
  return (
    request.headers.get("x-20i-event") ||
    request.headers.get("x-webhook-event") ||
    firstString(record, ["event", "eventType", "event_type", "type", "notification", "category"]) ||
    "20i.notification"
  );
}

function eventKeyFrom(payload: unknown, raw: string, request: NextRequest) {
  const record = asRecord(payload);
  const explicit =
    request.headers.get("x-request-id") ||
    request.headers.get("x-webhook-id") ||
    firstString(record, ["eventId", "event_id", "notificationId", "notification_id", "id", "uuid"]);
  if (explicit) return explicit;
  return createHash("sha256").update(raw || JSON.stringify(payload ?? {})).digest("hex");
}

function webhookSecret(request: NextRequest) {
  return request.nextUrl.searchParams.get("key")?.trim() || request.headers.get("x-hostmyweb-webhook-secret")?.trim() || null;
}

export async function POST(request: NextRequest) {
  const secret = webhookSecret(request);
  if (!secret) return NextResponse.json({ error: "Webhook secret required." }, { status: 401 });

  const raw = await request.text();
  let payload: unknown = {};
  if (raw.trim()) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = { raw };
    }
  }

  const eventType = eventTypeFrom(payload, request);
  const eventKey = eventKeyFrom(payload, raw, request);

  let event: RecordedEvent;
  try {
    event = await supabaseRpc<RecordedEvent>("record_hostmyweb_provider_event", {
      p_provider: "20i",
      p_secret: secret,
      p_event_key: eventKey,
      p_event_type: eventType,
      p_payload: payload,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook authentication failed.";
    return NextResponse.json({ error: "Webhook rejected.", detail: message }, { status: 401 });
  }

  try {
    const inventory = await readTwentyIInventory();
    const synced = await supabaseRpc<{ synced: number }>("sync_hostmyweb_twentyi_inventory", {
      p_secret: secret,
      p_packages: inventory,
    });

    await supabaseRpc<boolean>("mark_hostmyweb_provider_event_processed", {
      p_provider: "20i",
      p_secret: secret,
      p_event_key: eventKey,
      p_error: null,
    });

    return NextResponse.json({
      ok: true,
      duplicate: event.duplicate,
      eventId: event.event_id,
      eventType,
      inventoryCount: inventory.length,
      synced: synced.synced,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "20i inventory reconciliation failed.";
    await supabaseRpc<boolean>("mark_hostmyweb_provider_event_processed", {
      p_provider: "20i",
      p_secret: secret,
      p_event_key: eventKey,
      p_error: message.slice(0, 1000),
    }).catch(() => false);

    // The notification was authenticated and stored. A 202 prevents a provider retry
    // storm while preserving the reconciliation error for an administrator to inspect.
    return NextResponse.json({
      ok: true,
      accepted: true,
      reconciled: false,
      duplicate: event.duplicate,
      eventId: event.event_id,
      warning: message,
    }, { status: 202 });
  }
}
