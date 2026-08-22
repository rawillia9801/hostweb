import { getTwentyIPlanBinding } from "@/lib/hosting-plan-bindings";
import { HOSTING_PLANS, HOSTING_PLAN_SLUGS, type HostingPlanSlug } from "@/lib/hosting-plans";
import {
  findPackageForDomain,
  getTwentyIPackages,
  getTwentyIPackageTypes,
  packageProviderRef,
  packageTypeName,
  packageTypeRef,
  packageTypesFrom,
  provisionTwentyIHosting,
  twentyIRequest,
  type NormalizedTwentyIService,
} from "@/lib/twentyi-server";

function normalizeDomain(value: string) {
  const normalized = value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].replace(/\.$/, "");
  return /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?)+$/.test(normalized)
    ? normalized
    : null;
}

function providerResultRef(result: unknown): string | null {
  if (typeof result === "string" || typeof result === "number") return String(result);
  if (!result || typeof result !== "object" || Array.isArray(result)) return null;
  const record = result as Record<string, unknown>;
  for (const key of ["result", "id", "ref", "packageId", "package_id"]) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return null;
}

export async function applyConfiguredPlanBindings(inventory: NormalizedTwentyIService[]) {
  const entries = await Promise.all(
    HOSTING_PLAN_SLUGS.map(async (slug) => [slug, await getTwentyIPlanBinding(slug)] as const),
  );
  const byPackageType = new Map<string, HostingPlanSlug>();
  for (const [slug, binding] of entries) {
    if (binding?.package_type_ref) byPackageType.set(binding.package_type_ref, slug);
  }

  return inventory.map((service) => {
    if (service.plan_slug || !service.package_type_ref) return service;
    const plan = byPackageType.get(service.package_type_ref);
    if (!plan) return service;
    return { ...service, plan_slug: plan, plan_name: HOSTING_PLANS[plan].name };
  });
}

export async function provisionConfiguredTwentyIHosting(input: {
  plan: HostingPlanSlug;
  domain: string;
  stackUser?: string | null;
}) {
  const binding = await getTwentyIPlanBinding(input.plan);
  const boundRef = binding?.package_type_ref?.trim();

  // Environment bindings and branded package-type-name inference remain valid
  // fallbacks, but the database binding is the normal no-redeploy admin path.
  if (!boundRef) return provisionTwentyIHosting(input);

  const domain = normalizeDomain(input.domain);
  if (!domain) throw new Error("Enter a valid domain name before provisioning hosting.");

  const packagesPayload = await getTwentyIPackages();
  const existing = findPackageForDomain(packagesPayload, domain);
  if (existing) {
    return {
      created: false,
      packageId: packageProviderRef(existing),
      domain,
      packageTypeRef: packageTypeRef(existing),
      packageTypeName: packageTypeName(existing),
    };
  }

  const types = packageTypesFrom(await getTwentyIPackageTypes());
  const type = types.find((item) => item.id === boundRef);
  if (!type) {
    throw new Error(`The saved 20i package type ${boundRef} for ${HOSTING_PLANS[input.plan].name} is no longer available. Update the plan binding in HostMyWeb infrastructure settings.`);
  }

  const requestBody: Record<string, string> = {
    domain_name: domain,
    type: type.id,
    label: `HostMyWeb ${HOSTING_PLANS[input.plan].name} - ${domain}`,
  };
  if (input.stackUser?.trim()) requestBody.stackUser = input.stackUser.trim();

  const result = await twentyIRequest<unknown>("/reseller/*/addWeb", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
  const packageId = providerResultRef(result);
  if (!packageId) throw new Error("20i accepted the provisioning request but did not return a package reference.");

  return {
    created: true,
    packageId,
    domain,
    packageTypeRef: type.id,
    packageTypeName: type.name,
  };
}
