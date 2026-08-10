import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type UnknownRecord = Record<string, unknown>;
type PackageTypeSummary = { id: string; name: string; platform: string };

const BRAND_DOMAIN = "hostmyweb.co";

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as UnknownRecord) : null;
}

async function requireAdmin(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.toLowerCase().startsWith("bearer ")) return null;

  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    cache: "no-store",
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: authorization },
  });
  if (!userResponse.ok) return null;

  const user = (await userResponse.json()) as { id?: string; email?: string };
  if (!user.id) return null;

  const adminResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_hostmyweb_admin`, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  if (!adminResponse.ok || (await adminResponse.json()) !== true) return null;
  return user;
}

function twentyIBearer() {
  const apiKey = process.env.TWENTYI_GENERAL_API_KEY?.trim();
  if (!apiKey) throw new Error("20i API is not configured in Vercel.");
  return Buffer.from(apiKey, "utf8").toString("base64");
}

async function twentyI(path: string, init?: RequestInit) {
  const response = await fetch(`https://api.20i.com${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${twentyIBearer()}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) throw new Error(`20i request failed with status ${response.status}.`);
  return response.json() as Promise<unknown>;
}

function packageTypesFrom(payload: unknown): PackageTypeSummary[] {
  const results = new Map<string, PackageTypeSummary>();
  const queue: Array<{ value: unknown; key?: string; depth: number }> = [{ value: payload, depth: 0 }];

  while (queue.length) {
    const current = queue.shift();
    if (!current || current.depth > 7) continue;

    if (Array.isArray(current.value)) {
      current.value.forEach((value) => queue.push({ value, depth: current.depth + 1 }));
      continue;
    }

    const record = asRecord(current.value);
    if (!record) continue;

    const directId = ["id", "ref", "type", "packageTypeId", "package_type_id", "webTypeRef"]
      .map((key) => record[key])
      .find((value) => typeof value === "string" || typeof value === "number");
    const fallbackId = current.key && /^\d+$/.test(current.key) ? current.key : undefined;
    const id = String(directId ?? fallbackId ?? "");

    const nameValue = ["name", "label", "title", "displayName", "display_name"]
      .map((key) => record[key])
      .find((value) => typeof value === "string") as string | undefined;
    const platformValue = ["platform", "platformName", "platform_name", "family", "serviceType"]
      .map((key) => record[key])
      .find((value) => typeof value === "string") as string | undefined;

    if (id && (nameValue || platformValue)) {
      results.set(id, {
        id,
        name: nameValue || `Package type ${id}`,
        platform: platformValue || "Web hosting",
      });
    }

    for (const [key, value] of Object.entries(record)) {
      if (value !== null && typeof value === "object") queue.push({ value, key, depth: current.depth + 1 });
    }
  }

  return [...results.values()].sort((a, b) => {
    const aScore = /linux/i.test(`${a.name} ${a.platform}`) && !/wordpress/i.test(`${a.name} ${a.platform}`) ? 0 : 1;
    const bScore = /linux/i.test(`${b.name} ${b.platform}`) && !/wordpress/i.test(`${b.name} ${b.platform}`) ? 0 : 1;
    return aScore - bScore || a.name.localeCompare(b.name);
  });
}

function containsDomain(payload: unknown, domain: string) {
  const target = domain.toLowerCase();
  const queue: Array<{ value: unknown; depth: number }> = [{ value: payload, depth: 0 }];

  while (queue.length) {
    const current = queue.shift();
    if (!current || current.depth > 8) continue;
    if (typeof current.value === "string") {
      const normalized = current.value.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
      if (normalized === target) return true;
      continue;
    }
    if (Array.isArray(current.value)) {
      current.value.forEach((value) => queue.push({ value, depth: current.depth + 1 }));
      continue;
    }
    const record = asRecord(current.value);
    if (!record) continue;
    Object.values(record).forEach((value) => queue.push({ value, depth: current.depth + 1 }));
  }
  return false;
}

function countPackages(payload: unknown) {
  if (Array.isArray(payload)) return payload.length;
  const record = asRecord(payload);
  if (!record) return null;
  for (const key of ["packages", "result", "data"]) if (Array.isArray(record[key])) return (record[key] as unknown[]).length;
  return null;
}

function countStackUsers(payload: unknown) {
  const record = asRecord(payload);
  if (!record) return null;
  const contacts = asRecord(record.contact);
  return contacts ? Object.keys(contacts).length : null;
}

export async function GET(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  try {
    const [typesPayload, packagesPayload, stackUsersPayload] = await Promise.all([
      twentyI("/packageTypes"),
      twentyI("/package"),
      twentyI("/reseller/*/susers").catch(() => null),
    ]);

    return NextResponse.json({
      connected: true,
      brandDomain: BRAND_DOMAIN,
      brandReferenceExists: containsDomain(packagesPayload, BRAND_DOMAIN),
      packageTypes: packageTypesFrom(typesPayload),
      packageCount: countPackages(packagesPayload),
      stackUserCount: stackUsersPayload ? countStackUsers(stackUsersPayload) : null,
    }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to read the 20i account." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as { action?: string; packageTypeId?: string } | null;
  if (body?.action !== "ensure_brand_reference") return NextResponse.json({ error: "Unsupported setup action." }, { status: 400 });

  try {
    const typesPayload = await twentyI("/packageTypes");
    const types = packageTypesFrom(typesPayload);
    const chosenType = types.find((type) => type.id === String(body.packageTypeId || ""));
    if (!chosenType) return NextResponse.json({ error: "Choose one of the package types returned by your 20i account." }, { status: 400 });

    const packagesPayload = await twentyI("/package");
    if (containsDomain(packagesPayload, BRAND_DOMAIN)) {
      return NextResponse.json({ ok: true, alreadyExists: true, message: `${BRAND_DOMAIN} already exists in your 20i hosting account.` });
    }

    const result = await twentyI("/reseller/*/addWeb", {
      method: "POST",
      body: JSON.stringify({
        domain_name: BRAND_DOMAIN,
        type: chosenType.id,
        label: "HostMyWeb brand domain reference",
      }),
    });

    const resultRecord = asRecord(result);
    return NextResponse.json({
      ok: true,
      alreadyExists: false,
      packageType: chosenType,
      packageId: resultRecord?.result ?? null,
      message: `${BRAND_DOMAIN} was added to 20i as a hosting/domain reference.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create the HostMyWeb brand reference." }, { status: 502 });
  }
}
