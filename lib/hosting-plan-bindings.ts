import { getConfiguredPackageTypeRef, getHostShopCheckoutUrl, type HostingPlanSlug } from "@/lib/hosting-plans";
import { supabaseRpc } from "@/lib/supabase-rpc";

export type ProviderPlanBinding = {
  provider?: string;
  plan_slug?: HostingPlanSlug;
  package_type_ref?: string | null;
  package_type_name?: string | null;
  checkout_url?: string | null;
  active?: boolean;
  metadata?: Record<string, unknown>;
};

export async function getTwentyIPlanBinding(plan: HostingPlanSlug): Promise<ProviderPlanBinding | null> {
  try {
    const binding = await supabaseRpc<ProviderPlanBinding>("get_hostmyweb_provider_plan_binding", {
      p_provider: "20i",
      p_plan_slug: plan,
    });
    return binding && Object.keys(binding).length ? binding : null;
  } catch {
    return null;
  }
}

export async function getEffectivePackageTypeRef(plan: HostingPlanSlug): Promise<string | null> {
  const envRef = getConfiguredPackageTypeRef(plan);
  if (envRef) return envRef;
  const binding = await getTwentyIPlanBinding(plan);
  return binding?.package_type_ref?.trim() || null;
}

export async function getEffectiveHostShopCheckoutUrl(plan: HostingPlanSlug): Promise<string | null> {
  const envOrDefault = getHostShopCheckoutUrl(plan);
  const binding = await getTwentyIPlanBinding(plan);

  // Explicit environment variables are operational overrides. Database bindings
  // are the normal admin-configurable source. Starter/Business code defaults are
  // kept as a final fallback so existing checkout links cannot disappear.
  const envKey = `HOSTMYWEB_HOSTSHOP_${plan.toUpperCase()}_URL`;
  const envValue = process.env[envKey]?.trim();
  if (envValue) return envValue;
  if (binding?.checkout_url?.trim()) return binding.checkout_url.trim();
  return envOrDefault;
}
