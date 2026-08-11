import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerAccount } from "@/components/customer-account";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

const hostShopCheckout = {
  starter: "https://cp.hostmyweb.co/domain-required?p=300451-1-dfw&t=1",
  business: "https://cp.hostmyweb.co/domain-required?p=300471-1-dfw&t=1",
} as const;

type SignupPageProps = {
  searchParams: Promise<{
    plan?: string;
    product?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const plan = params.plan?.trim().toLowerCase();

  if (plan && plan in hostShopCheckout) {
    redirect(hostShopCheckout[plan as keyof typeof hostShopCheckout]);
  }

  return <CustomerAccount initialMode="signup" />;
}
