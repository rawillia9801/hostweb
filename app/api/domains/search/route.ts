import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type UnknownRecord = Record<string, unknown>;
type AvailabilityResult = { domain: string; available: boolean; source: "reseller" | "registry" };
type DomainOffer = AvailabilityResult & {
  price?: number;
  renewalPrice?: number;
  transferPrice?: number;
  currency?: string;
  checkoutUrl: string;
};

const RETAIL_DOMAIN_PRICES: Record<string, { registration: number; renewal: number; transfer: number }> = {
  com: { registration: 17.99, renewal: 17.99, transfer: 17.99 },
  org: { registration: 17.99, renewal: 17.99, transfer: 17.99 },
  net: { registration: 19.99, renewal: 19.99, transfer: 19.99 },
  us: { registration: 14.99, renewal: 14.99, transfer: 14.99 },
  co: { registration: 29.99, renewal: 29.99, transfer: 29.99 },
  io: { registration: 49.99, renewal: 49.99, transfer: 49.99 },
  info: { registration: 24.99, renewal: 24.99, transfer: 24.99 },
  biz: { registration: 24.99, renewal: 24.99, transfer: 24.99 },
};

const SUGGESTION_TLDS = ["com", "net", "org", "us", "co", "io"];

function normalizeDomain(input: string) {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].split("?")[0].split("#")[0];
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

function getBaseName(domain: string) {
  return domain.split(".")[0] || domain;
}

function retailPricing(domain: string) {
  const tld = domain.split(".").pop() || "";
  const pricing = RETAIL_DOMAIN_PRICES[tld];
  return pricing
    ? { price: pricing.registration, renewalPrice: pricing.renewal, transferPrice: pricing.transfer, currency: "USD" }
    : {};
}

function hostShopDomainUrl(domain: string) {
  const base = (process.env.HOSTMYWEB_HOSTSHOP_BASE_URL || "https://cp.hostmyweb.co").replace(/\/$/, "");
  return `${base}/domain-search?domain=${encodeURIComponent(domain)}`;
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
  for (const key of positiveBooleanKeys) if (typeof record[key] === "boolean") return record[key] as boolean;
  const negativeBooleanKeys = ["registered", "isRegistered", "is_registered", "taken", "unavailable"];
  for (const key of negativeBooleanKeys) if (typeof record[key] === "boolean") return !(record[key] as boolean);
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
      const nested = asRecord(value);
      if (key.toLowerCase() === domain && nested) {
        const exactByKey = availabilityFromRecord(nested);
        if (exactByKey !== null) return exactByKey;
      }
    }
    const candidateDomain = domainFromRecord(record);
    const candidateAvailability = availabilityFromRecord(record);
    if (candidateDomain === domain && candidateAvailability !== null) return candidateAvailability;
    if (candidateAvailability !== null) fallbackSignals.push(candidateAvailability);
    for (const value of Object.values(record)) if (value !== null && typeof value === "object") queue.push({ value, depth: current.depth + 1 });
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
      headers: { Accept: "application/json", Authorization: `Bearer ${bearer}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("20i domain search returned a non-success status", response.status);
      return null;
    }
    const payload: unknown = await response.json();
    const available = parseTwentyIAvailability(payload, domain);
    if (available === null) {
      console.error("20i domain search returned an unrecognized response shape");
      return null;
    }
    return { domain, available, source: "reseller" };
  } catch (error) {
    console.error("20i domain search failed", error instanceof Error ? error.message : "unknown error");
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

async function lookup(domain: string): Promise<AvailabilityResult> {
  return (await searchTwentyI(domain)) ?? searchRegistry(domain);
}

function toOffer(result: AvailabilityResult): DomainOffer {
  return {
    ...result,
    ...retailPricing(result.domain),
    checkoutUrl: hostShopDomainUrl(result.domain),
  };
}

async function buildSuggestions(domain: string) {
  const base = getBaseName(domain);
  const currentTld = domain.split(".").pop();
  const candidates = SUGGESTION_TLDS.filter((tld) => tld !== currentTld)
    .map((tld) => `${base}.${tld}`)
    .slice(0, 5);

  const settled = await Promise.allSettled(candidates.map((candidate) => lookup(candidate)));
  return settled
    .filter((entry): entry is PromiseFulfilledResult<AvailabilityResult> => entry.status === "fulfilled")
    .map((entry) => toOffer(entry.value))
    .filter((entry) => entry.available)
    .slice(0, 4);
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("domain") || "";
  const domain = normalizeDomain(input);
  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain name, such as yourbrand.com." }, { status: 400 });
  }

  try {
    const result = await lookup(domain);
    const suggestions = await buildSuggestions(domain);
    return NextResponse.json(
      { ...toOffer(result), suggestions },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("Domain availability lookup failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Domain search is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
