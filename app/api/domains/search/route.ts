import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type UnknownRecord = Record<string, unknown>;
type AvailabilityResult = { domain: string; available: boolean; source: "reseller" | "registry"; availabilityConfirmed: boolean };
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
  if (record.suggestion === true || record.type === "suggestion" || record.can === "suggestion") return null;
  // 20i's documented domain-search response uses `can`, not `available`.
  if (record.can === "register") return true;
  if (record.can === "transfer") return false;
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
    if (record.suggestion === true || record.type === "suggestion" || record.can === "suggestion") continue;
    const candidateDomain = domainFromRecord(record);
    const candidateAvailability = availabilityFromRecord(record);
    if (candidateDomain === domain && candidateAvailability !== null) return candidateAvailability;

    for (const value of Object.values(record)) if (value !== null && typeof value === "object") queue.push({ value, depth: current.depth + 1 });
  }
  return null;
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
    const raw = await response.text();
    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      // Also accept newline-delimited result packets.
      payload = raw.split(/\r?\n/).filter((line) => line.trim()).map((line) => JSON.parse(line));
    }
    const available = parseTwentyIAvailability(payload, domain);
    if (available === null) {
      console.error("20i domain search returned an unrecognized response shape");
      return null;
    }
    return { domain, available, source: "reseller", availabilityConfirmed: true };
  } catch (error) {
    console.error("20i domain search failed", error instanceof Error ? error.message : "unknown error");
    return null;
  }
}

// Direct registry endpoints from https://data.iana.org/rdap/dns.json.
// Avoid the additional rdap.org redirect for the extensions it covers here.
const REGISTRY_BASES: Record<string, string> = {
  com: "https://rdap.verisign.com/com/v1/",
  net: "https://rdap.verisign.com/net/v1/",
  org: "https://rdap.publicinterestregistry.org/rdap/",
  info: "https://rdap.identitydigital.services/rdap/",
  biz: "https://rdap.nic.biz/",
};

async function searchRegistry(domain: string): Promise<AvailabilityResult> {
  const base = REGISTRY_BASES[domain.split(".").pop() || ""];
  const response = await fetch(`${base || "https://rdap.org/"}domain/${encodeURIComponent(domain)}`, {
    cache: "no-store",
    redirect: "follow",
    headers: { Accept: "application/rdap+json, application/json" },
    signal: AbortSignal.timeout(10000),
  });
  const payload = asRecord(await response.json());
  // A registry miss is not proof a reserved or premium name can be registered.
  // Require an RDAP error body, not an arbitrary proxy/web-server 404.
  if (response.status === 404 && payload?.errorCode === 404) {
    return { domain, available: true, source: "registry", availabilityConfirmed: false };
  }
  if (response.ok && payload?.objectClassName === "domain" &&
      typeof payload.ldhName === "string" && payload.ldhName.toLowerCase() === domain) {
    return { domain, available: false, source: "registry", availabilityConfirmed: true };
  }
  console.error("Registry domain search returned an unusable response", response.status);
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
    const [result, suggestions] = await Promise.all([lookup(domain), buildSuggestions(domain)]);
    return NextResponse.json(
      { ...toOffer(result), suggestions },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("Domain availability lookup failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Domain search is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
