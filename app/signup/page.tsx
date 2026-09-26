import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerAccount } from "@/components/customer-account";
import { getEffectiveHostShopCheckoutUrl } from "@/lib/hosting-plan-bindings";
import { isHostingPlanSlug } from "@/lib/hosting-plans";
import { getCatalogProduct, getConfiguredProductCheckoutUrl } from "@/lib/commerce-catalog";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

type SignupPageProps = {
  searchParams: Promise<{
    plan?: string;
    product?: string;
    domain?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const plan = params.plan?.trim().toLowerCase();
  const productId = params.product?.trim().toLowerCase();
  const domain = params.domain?.trim().toLowerCase();

  if (isHostingPlanSlug(plan)) {
    const checkoutUrl = await getEffectiveHostShopCheckoutUrl(plan);
    if (checkoutUrl) redirect(checkoutUrl);
  }

  if (productId && getCatalogProduct(productId)) {
    const checkoutUrl = getConfiguredProductCheckoutUrl(productId);
    if (checkoutUrl) redirect(checkoutUrl);
  }

  if (domain) {
    const hostShopBase = (process.env.HOSTMYWEB_HOSTSHOP_BASE_URL || "https://cp.hostmyweb.co").replace(/\/$/, "");
    redirect(`${hostShopBase}/domain-search?domain=${encodeURIComponent(domain)}`);
  }

  return <CustomerAccount initialMode="signup" />;
}
