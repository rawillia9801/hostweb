import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type UnknownRecord = Record<string, unknown>;

type AvailabilityResult = {
  domain: string;
  available: boolean;
  source: "reseller" | "registry";
};

function normalizeDomain(input: string) {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  if (!value.includes(".")) value = `${value}.com`;
  return value;
}

function isValidDomain(domain: string) {
  if (domain.length < 3 || domain.length > 253) return false;
  if (!/^[a-z0-9.-]+$/.test(domain)) return false;
  const labels = domain.split(".");
  if (labels.length < 2) return false;
  return labels.every((label) => label.length > 0 && label.length <= 63 && !label.startsWith("-") && !label.endsWith("-"));
}

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as UnknownRecord) : null;
}

function domainFromRecord(record: UnknownRecord) {
  for (const key of ["domain", "domainName", "domain_name", "fqdn", "name"]) {
    const value = record[key];
    if (typeof value === "string" && value.includes(".")) return value.toLowerCase();
  }
  return null;
}

function availabilityFromRecord(record: UnknownRecord): boolean | null {
  const positiveBooleanKeys = ["available", "isAvailable", "is_available", "canRegister", "can_register", "registerable", "registrable", "canBuy", "canPurchase", "free"];
  for (const key of positiveBooleanKeys) {
    if (typeof record[key] === "boolean") return record[key] as boolean;
  }

  const negativeBooleanKeys = ["registered", "isRegistered", "is_registered", "taken", "unavailable"];
  for (const key of negativeBooleanKeys) {
    if (typeof record[key] === "boolean") return !(record[key] as boolean);
  }

  for (const key of ["status", "availability", "state"]) {
    const value = record[key];
    if (typeof value !== "string") continue;
    const status = value.trim().toLowerCase();
    if (["available", "free", "registerable", "registrable", "can_register", "can-register"].includes(status)) return true;
    if (["registered", "taken", "unavailable", "not_available", "not-available"].includes(status)) return false;
  }

  return null;
}

function parseTwentyIAvailability(payload: unknown, domain: string): boolean | null {
  const queue: Array<{ value: unknown; depth: number }> = [{ value: payload, depth: 0 }];
  const fallbackSignals: boolean[] = [];

  while (queue.length) {
    const current = queue.shift();
    if (!current || current.depth > 7) continue;

    if (Array.isArray(current.value)) {
      for (const item of current.value) queue.push({ value: item, depth: current.depth + 1 });
      continue;
    }

    const record = asRecord(current.value);
    if (!record) continue;

    for (const [key, value] of Object.entries(record)) {
      if (key.toLowerCase() === domain && asRecord(value)) {
        const exactByKey = availabilityFromRecord(asRecord(value)!);
        if (exactByKey !== null) return exactByKey;
      }
    }

    const candidateDomain = domainFromRecord(record);
    const candidateAvailability = availabilityFromRecord(record);

    if (candidateDomain === domain && candidateAvailability !== null) return candidateAvailability;
    if (candidateAvailability !== null) fallbackSignals.push(candidateAvailability);

    for (const value of Object.values(record)) {
      if (value !== null && typeof value === "object") queue.push({ value, depth: current.depth + 1 });
    }
  }

  const uniqueSignals = [...new Set(fallbackSignals)];
  return uniqueSignals.length === 1 ? uniqueSignals[0] : null;
}

async function searchTwentyI(domain: string): Promise<AvailabilityResult | null> {
  const apiKey = process.env.TWENTYI_GENERAL_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const bearer = Buffer.from(apiKey, "utf8").toString("base64");
    const response = await fetch(`https://api.20i.com/domain-search/${encodeURIComponent(domain)}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${bearer}`,
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("Reseller domain search returned a non-success status", response.status);
      return null;
    }

    const payload: unknown = await response.json();
    const available = parseTwentyIAvailability(payload, domain);
    if (available === null) {
      console.error("Reseller domain search returned an unrecognized response shape");
      return null;
    }

    return { domain, available, source: "reseller" };
  } catch (error) {
    console.error("Reseller domain search failed", error instanceof Error ? error.message : "unknown error");
    return null;
  }
}

async function searchRegistry(domain: string): Promise<AvailabilityResult> {
  const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
    cache: "no-store",
    redirect: "follow",
    headers: { Accept: "application/rdap+json, application/json" },
    signal: AbortSignal.timeout(7000),
  });

  if (response.status === 404) return { domain, available: true, source: "registry" };
  if (response.ok) return { domain, available: false, source: "registry" };
  throw new Error("Registry lookup did not return a usable result.");
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("domain") || "";
  const domain = normalizeDomain(input);

  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain name, such as yourbrand.com." }, { status: 400 });
  }

  const resellerResult = await searchTwentyI(domain);
  if (resellerResult) {
    return NextResponse.json(resellerResult, { headers: { "cache-control": "no-store" } });
  }

  try {
    const registryResult = await searchRegistry(domain);
    return NextResponse.json(registryResult, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Domain search is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
