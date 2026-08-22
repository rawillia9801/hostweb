import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerAccount } from "@/components/customer-account";
import { getHostShopCheckoutUrl, isHostingPlanSlug } from "@/lib/hosting-plans";

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
    const checkoutUrl = getHostShopCheckoutUrl(plan);
    if (checkoutUrl) redirect(checkoutUrl);
  }

  // Plans without a configured HostShop product fall back to the HostMyWeb
  // account flow instead of guessing a provider product ID. As soon as a
  // checkout URL is configured, the same public plan link begins redirecting
  // to the real HostShop checkout automatically.
  return <CustomerAccount initialMode="signup" />;
}
