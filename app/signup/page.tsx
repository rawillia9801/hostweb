import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerAccount } from "@/components/customer-account";
import { getEffectiveHostShopCheckoutUrl } from "@/lib/hosting-plan-bindings";
import { isHostingPlanSlug } from "@/lib/hosting-plans";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

type SignupPageProps = {
  searchParams: Promise<{
    plan?: string;
    product?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const plan = params.plan?.trim().toLowerCase();

  if (isHostingPlanSlug(plan)) {
    const checkoutUrl = await getEffectiveHostShopCheckoutUrl(plan);
    if (checkoutUrl) redirect(checkoutUrl);
  }

  // Plans without a configured HostShop product fall back to the HostMyWeb
  // account flow instead of guessing a provider product ID. Saving a checkout
  // URL in the infrastructure plan bindings activates the existing public plan
  // link immediately, with no source-code change required.
  return <CustomerAccount initialMode="signup" />;
}
