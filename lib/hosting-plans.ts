export const HOSTING_PLAN_SLUGS = ["starter", "business", "pro", "agency"] as const;

export type HostingPlanSlug = (typeof HOSTING_PLAN_SLUGS)[number];

export type HostingPlanDefinition = {
  slug: HostingPlanSlug;
  name: string;
  code: string;
  monthlyPrice: number;
  monthlyCents: number;
  websites: number;
  webspaceGb: number;
  mailboxes: number;
  mailboxStorageGb: number;
  databases: number;
  bandwidth: "unlimited";
};

export const HOSTING_PLANS: Record<HostingPlanSlug, HostingPlanDefinition> = {
  starter: {
    slug: "starter",
    name: "Starter",
    code: "HMW-01",
    monthlyPrice: 7.99,
    monthlyCents: 799,
    websites: 1,
    webspaceGb: 10,
    mailboxes: 5,
    mailboxStorageGb: 10,
    databases: 5,
    bandwidth: "unlimited",
  },
  business: {
    slug: "business",
    name: "Business",
    code: "HMW-05",
    monthlyPrice: 12.99,
    monthlyCents: 1299,
    websites: 5,
    webspaceGb: 25,
    mailboxes: 25,
    mailboxStorageGb: 10,
    databases: 25,
    bandwidth: "unlimited",
  },
  pro: {
    slug: "pro",
    name: "Pro",
    code: "HMW-15",
    monthlyPrice: 21.99,
    monthlyCents: 2199,
    websites: 15,
    webspaceGb: 50,
    mailboxes: 50,
    mailboxStorageGb: 10,
    databases: 50,
    bandwidth: "unlimited",
  },
  agency: {
    slug: "agency",
    name: "Agency",
    code: "HMW-30",
    monthlyPrice: 39.99,
    monthlyCents: 3999,
    websites: 30,
    webspaceGb: 100,
    mailboxes: 100,
    mailboxStorageGb: 10,
    databases: 100,
    bandwidth: "unlimited",
  },
};

const DEFAULT_HOSTSHOP_URLS: Partial<Record<HostingPlanSlug, string>> = {
  starter: "https://cp.hostmyweb.co/domain-required?p=300451-1-dfw&t=1",
  business: "https://cp.hostmyweb.co/domain-required?p=300471-1-dfw&t=1",
};

const HOSTSHOP_ENV_KEYS: Record<HostingPlanSlug, string> = {
  starter: "HOSTMYWEB_HOSTSHOP_STARTER_URL",
  business: "HOSTMYWEB_HOSTSHOP_BUSINESS_URL",
  pro: "HOSTMYWEB_HOSTSHOP_PRO_URL",
  agency: "HOSTMYWEB_HOSTSHOP_AGENCY_URL",
};

const PACKAGE_TYPE_ENV_KEYS: Record<HostingPlanSlug, string> = {
  starter: "HOSTMYWEB_20I_PACKAGE_TYPE_STARTER",
  business: "HOSTMYWEB_20I_PACKAGE_TYPE_BUSINESS",
  pro: "HOSTMYWEB_20I_PACKAGE_TYPE_PRO",
  agency: "HOSTMYWEB_20I_PACKAGE_TYPE_AGENCY",
};

export function isHostingPlanSlug(value: string | null | undefined): value is HostingPlanSlug {
  return typeof value === "string" && (HOSTING_PLAN_SLUGS as readonly string[]).includes(value);
}

export function getHostingPlan(value: string | null | undefined) {
  return isHostingPlanSlug(value) ? HOSTING_PLANS[value] : null;
}

export function getHostShopCheckoutUrl(plan: HostingPlanSlug): string | null {
  const envValue = process.env[HOSTSHOP_ENV_KEYS[plan]]?.trim();
  return envValue || DEFAULT_HOSTSHOP_URLS[plan] || null;
}

export function getConfiguredPackageTypeRef(plan: HostingPlanSlug): string | null {
  return process.env[PACKAGE_TYPE_ENV_KEYS[plan]]?.trim() || null;
}

export function inferHostingPlanSlug(packageTypeName?: string | null, typeRef?: string | null): HostingPlanSlug | null {
  const normalizedRef = typeRef?.trim();
  if (normalizedRef) {
    for (const slug of HOSTING_PLAN_SLUGS) {
      const configured = getConfiguredPackageTypeRef(slug);
      if (configured && configured === normalizedRef) return slug;
    }
  }

  const name = packageTypeName?.toLowerCase() || "";
  for (const slug of HOSTING_PLAN_SLUGS) {
    const plan = HOSTING_PLANS[slug];
    if (name.includes(slug) && (name.includes("hostmyweb") || name.includes("hmw") || name === slug)) return slug;
    if (name.includes(plan.code.toLowerCase())) return slug;
  }
  return null;
}

export function hostingPlanOperationalState(plan: HostingPlanSlug) {
  return {
    plan: HOSTING_PLANS[plan],
    checkoutConfigured: Boolean(getHostShopCheckoutUrl(plan)),
    packageTypeConfigured: Boolean(getConfiguredPackageTypeRef(plan)),
  };
}
