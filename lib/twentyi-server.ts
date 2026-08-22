import {
  getConfiguredPackageTypeRef,
  HOSTING_PLANS,
  HOSTING_PLAN_SLUGS,
  inferHostingPlanSlug,
  type HostingPlanSlug,
} from "@/lib/hosting-plans";

type UnknownRecord = Record<string, unknown>;

export type TwentyIPackageType = {
  id: string;
  name: string;
  platform: string;
};

export type TwentyIPackage = UnknownRecord;

export type NormalizedTwentyIService = {
  provider_ref: string;
  service_type: "web_hosting";
  plan_slug: HostingPlanSlug | null;
  plan_name: string | null;
  domain_name: string | null;
  package_type_ref: string | null;
  package_type_name: string | null;
  customer_email: string | null;
  provider_user_refs: string[];
  status: "active" | "suspended";
  metadata: Record<string, unknown>;
};

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as UnknownRecord) : null;
}

function firstString(record: UnknownRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return null;
}

function firstBoolean(record: UnknownRecord, keys: string[]): boolean | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const normalized = value.toLowerCase().trim();
      if (["1", "true", "yes", "enabled", "active"].includes(normalized)) return true;
      if (["0", "false", "no", "disabled", "suspended"].includes(normalized)) return false;
    }
  }
  return null;
}

function normalizeDomain(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .replace(/\.$/, "");
  return /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?)+$/.test(normalized)
    ? normalized
    : null;
}

function findDomain(record: UnknownRecord): string | null {
  for (const key of ["domain_name", "domainName", "domain", "name", "primaryDomain", "hostname"]) {
    const direct = record[key];
    if (typeof direct === "string") {
      const domain = normalizeDomain(direct);
      if (domain) return domain;
    }
  }

  const queue: Array<{ value: unknown; depth: number }> = Object.values(record).map((value) => ({ value, depth: 0 }));
  while (queue.length) {
    const current = queue.shift();
    if (!current || current.depth > 4) continue;
    if (typeof current.value === "string") {
      const domain = normalizeDomain(current.value);
      if (domain) return domain;
      continue;
    }
    if (Array.isArray(current.value)) {
      current.value.forEach((value) => queue.push({ value, depth: current.depth + 1 }));
      continue;
    }
    const nested = asRecord(current.value);
    if (nested) Object.values(nested).forEach((value) => queue.push({ value, depth: current.depth + 1 }));
  }
  return null;
}

function providerRefFrom(record: UnknownRecord): string | null {
  return firstString(record, ["id", "ref", "packageId", "package_id", "packageRef", "package_ref", "webId", "web_id"]);
}

function packageTypeRefFrom(record: UnknownRecord): string | null {
  return firstString(record, ["typeRef", "type_ref", "packageTypeId", "package_type_id", "webTypeRef", "type"]);
}

function packageTypeNameFrom(record: UnknownRecord): string | null {
  return firstString(record, ["packageTypeName", "package_type_name", "typeName", "type_name", "platformName", "planName"]);
}

function stackUserRefsFrom(record: UnknownRecord): string[] {
  const refs = new Set<string>();
  const candidates = [record.stackUsers, record.stack_users, record.users, record.userRefs];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      for (const item of candidate) {
        if (typeof item === "string" || typeof item === "number") refs.add(String(item));
        else {
          const nested = asRecord(item);
          if (nested) {
            const id = firstString(nested, ["id", "ref", "stackUser", "stack_user", "user"]);
            if (id) refs.add(id);
          }
        }
      }
    } else if (typeof candidate === "string" || typeof candidate === "number") {
      refs.add(String(candidate));
    }
  }
  return [...refs];
}

function looksLikePackage(record: UnknownRecord) {
  return Boolean(
    providerRefFrom(record) &&
      (findDomain(record) || packageTypeRefFrom(record) || packageTypeNameFrom(record) || stackUserRefsFrom(record).length),
  );
}

function collectPackageRecords(payload: unknown): TwentyIPackage[] {
  const results = new Map<string, TwentyIPackage>();
  const queue: Array<{ value: unknown; depth: number }> = [{ value: payload, depth: 0 }];

  while (queue.length) {
    const current = queue.shift();
    if (!current || current.depth > 7) continue;

    if (Array.isArray(current.value)) {
      current.value.forEach((value) => queue.push({ value, depth: current.depth + 1 }));
      continue;
    }

    const record = asRecord(current.value);
    if (!record) continue;

    if (looksLikePackage(record)) {
      const id = providerRefFrom(record);
      if (id) results.set(id, record);
    }

    for (const value of Object.values(record)) {
      if (value && typeof value === "object") queue.push({ value, depth: current.depth + 1 });
    }
  }

  return [...results.values()];
}

function collectStackUserEmails(payload: unknown): Map<string, string> {
  const result = new Map<string, string>();
  const queue: Array<{ value: unknown; key?: string; depth: number }> = [{ value: payload, depth: 0 }];

  while (queue.length) {
    const current = queue.shift();
    if (!current || current.depth > 8) continue;

    if (Array.isArray(current.value)) {
      current.value.forEach((value) => queue.push({ value, depth: current.depth + 1 }));
      continue;
    }

    const record = asRecord(current.value);
    if (!record) continue;

    const email = firstString(record, ["email", "emailAddress", "email_address", "contactEmail", "contact_email"]);
    const explicitId = firstString(record, ["id", "ref", "stackUser", "stack_user", "userRef", "user_ref", "username"]);
    const id = explicitId || current.key || null;
    if (id && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) result.set(id, email.toLowerCase());

    for (const [key, value] of Object.entries(record)) {
      if (value && typeof value === "object") queue.push({ value, key, depth: current.depth + 1 });
    }
  }

  return result;
}

export function packageTypesFrom(payload: unknown): TwentyIPackageType[] {
  const results = new Map<string, TwentyIPackageType>();
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
    const directId = firstString(record, ["id", "ref", "type", "typeRef", "packageTypeId", "package_type_id", "webTypeRef"]);
    const fallbackId = current.key && /^[\w:-]+$/.test(current.key) ? current.key : null;
    const id = directId || fallbackId;
    const name = firstString(record, ["name", "packageTypeName", "label", "title", "displayName", "display_name"]);
    const platform = firstString(record, ["platform", "platformName", "platform_name", "family", "serviceType"]);

    if (id && (name || platform)) {
      results.set(id, { id, name: name || `Package type ${id}`, platform: platform || "Web hosting" });
    }

    for (const [key, value] of Object.entries(record)) {
      if (value && typeof value === "object") queue.push({ value, key, depth: current.depth + 1 });
    }
  }

  return [...results.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function twentyIBearer() {
  const apiKey = process.env.TWENTYI_GENERAL_API_KEY?.trim();
  if (!apiKey) throw new Error("20i API is not configured. Set TWENTYI_GENERAL_API_KEY in the production environment.");
  return Buffer.from(apiKey, "utf8").toString("base64");
}

export class TwentyIRequestError extends Error {
  constructor(public path: string, public status: number, detail?: string) {
    super(`20i ${path} failed with status ${status}${detail ? `: ${detail}` : "."}`);
    this.name = "TwentyIRequestError";
  }
}

export async function twentyIRequest<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.20i.com${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${twentyIBearer()}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    const detail = raw.replace(/\s+/g, " ").trim().slice(0, 320);
    throw new TwentyIRequestError(path, response.status, detail || undefined);
  }

  return response.json() as Promise<T>;
}

export async function getTwentyIPackages() {
  return twentyIRequest<unknown>("/package");
}

export async function getTwentyIPackageTypes() {
  return twentyIRequest<unknown>("/packageTypes");
}

export async function getTwentyIStackUsers() {
  return twentyIRequest<unknown>("/reseller/*/susers");
}

export function packagesFrom(payload: unknown) {
  return collectPackageRecords(payload);
}

export function normalizeTwentyIInventory(packagesPayload: unknown, stackUsersPayload: unknown): NormalizedTwentyIService[] {
  const users = collectStackUserEmails(stackUsersPayload);
  const packages = collectPackageRecords(packagesPayload);

  return packages.flatMap((record) => {
    const providerRef = providerRefFrom(record);
    if (!providerRef) return [];

    const domain = findDomain(record);
    const packageTypeRef = packageTypeRefFrom(record);
    const packageTypeName = packageTypeNameFrom(record);
    const planSlug = inferHostingPlanSlug(packageTypeName, packageTypeRef);
    const stackUsers = stackUserRefsFrom(record);
    const customerEmail = stackUsers.map((ref) => users.get(ref)).find(Boolean) || null;
    const enabled = firstBoolean(record, ["enabled", "active", "isEnabled", "is_enabled", "suspended"]);
    const explicitStatus = firstString(record, ["status", "state"]);
    const suspended = explicitStatus ? /suspend|disabled|inactive|cancel/i.test(explicitStatus) : enabled === false;

    return [{
      provider_ref: providerRef,
      service_type: "web_hosting" as const,
      plan_slug: planSlug,
      plan_name: planSlug ? HOSTING_PLANS[planSlug].name : packageTypeName,
      domain_name: domain,
      package_type_ref: packageTypeRef,
      package_type_name: packageTypeName,
      customer_email: customerEmail,
      provider_user_refs: stackUsers,
      status: suspended ? "suspended" as const : "active" as const,
      metadata: {
        enabled: enabled ?? undefined,
        provider_status: explicitStatus,
        label: firstString(record, ["label", "description"]),
      },
    }];
  });
}

export function findPackageForDomain(packagesPayload: unknown, domain: string): TwentyIPackage | null {
  const target = normalizeDomain(domain);
  if (!target) return null;
  return collectPackageRecords(packagesPayload).find((record) => findDomain(record) === target) || null;
}

export function packageProviderRef(record: TwentyIPackage): string | null {
  return providerRefFrom(record);
}

export function packageDomain(record: TwentyIPackage): string | null {
  return findDomain(record);
}

export function packageTypeRef(record: TwentyIPackage): string | null {
  return packageTypeRefFrom(record);
}

export function packageTypeName(record: TwentyIPackage): string | null {
  return packageTypeNameFrom(record);
}

export async function resolvePackageTypeForPlan(plan: HostingPlanSlug): Promise<TwentyIPackageType> {
  const payload = await getTwentyIPackageTypes();
  const types = packageTypesFrom(payload);
  const configuredRef = getConfiguredPackageTypeRef(plan);

  if (configuredRef) {
    const exact = types.find((type) => type.id === configuredRef);
    if (exact) return exact;
    throw new Error(`Configured 20i package type ${configuredRef} for ${HOSTING_PLANS[plan].name} was not returned by /packageTypes.`);
  }

  const target = HOSTING_PLANS[plan];
  const matches = types.filter((type) => {
    const text = `${type.name} ${type.platform}`.toLowerCase();
    const planMatch = text.includes(plan) || text.includes(target.code.toLowerCase());
    const brandMatch = text.includes("hostmyweb") || text.includes("hmw");
    return planMatch && brandMatch;
  });

  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    throw new Error(`Multiple 20i package types look like ${target.name}. Set HOSTMYWEB_20I_PACKAGE_TYPE_${plan.toUpperCase()} to the exact type reference.`);
  }

  throw new Error(`No 20i package type is bound to ${target.name}. Create/rename the package type in My20i or set HOSTMYWEB_20I_PACKAGE_TYPE_${plan.toUpperCase()}.`);
}

export async function provisionTwentyIHosting(input: {
  plan: HostingPlanSlug;
  domain: string;
  stackUser?: string | null;
}) {
  const domain = normalizeDomain(input.domain);
  if (!domain) throw new Error("Enter a valid domain name before provisioning hosting.");

  const existingPayload = await getTwentyIPackages();
  const existing = findPackageForDomain(existingPayload, domain);
  if (existing) {
    return {
      created: false,
      packageId: packageProviderRef(existing),
      domain,
      packageTypeRef: packageTypeRef(existing),
      packageTypeName: packageTypeName(existing),
    };
  }

  const type = await resolvePackageTypeForPlan(input.plan);
  const body: Record<string, string> = {
    domain_name: domain,
    type: type.id,
    label: `HostMyWeb ${HOSTING_PLANS[input.plan].name} - ${domain}`,
  };
  if (input.stackUser?.trim()) body.stackUser = input.stackUser.trim();

  const result = await twentyIRequest<unknown>("/reseller/*/addWeb", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const resultRecord = asRecord(result);
  const packageId = resultRecord
    ? firstString(resultRecord, ["result", "id", "ref", "packageId", "package_id"])
    : typeof result === "string" || typeof result === "number"
      ? String(result)
      : null;

  if (!packageId) throw new Error("20i accepted the provisioning request but did not return a package reference.");

  return {
    created: true,
    packageId,
    domain,
    packageTypeRef: type.id,
    packageTypeName: type.name,
  };
}

export async function readTwentyIInventory() {
  const [packagesPayload, stackUsersPayload] = await Promise.all([
    getTwentyIPackages(),
    getTwentyIStackUsers().catch(() => ({})),
  ]);
  return normalizeTwentyIInventory(packagesPayload, stackUsersPayload);
}

export function hostingPlanBindingsFromPackageTypes(typesPayload: unknown) {
  const types = packageTypesFrom(typesPayload);
  return HOSTING_PLAN_SLUGS.map((slug) => {
    const configured = getConfiguredPackageTypeRef(slug);
    const inferred = types.filter((type) => {
      const text = `${type.name} ${type.platform}`.toLowerCase();
      return (text.includes(slug) || text.includes(HOSTING_PLANS[slug].code.toLowerCase())) && (text.includes("hostmyweb") || text.includes("hmw"));
    });
    return {
      slug,
      configuredRef: configured,
      resolved: configured ? types.find((type) => type.id === configured) || null : inferred.length === 1 ? inferred[0] : null,
      candidates: configured ? [] : inferred,
    };
  });
}
