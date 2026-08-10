import type { Metadata } from "next";
import { CustomerAccount } from "@/components/customer-account";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <CustomerAccount initialMode="signup" />;
}
