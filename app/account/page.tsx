import type { Metadata } from "next";
import { CustomerAccount } from "@/components/customer-account";

export const metadata: Metadata = {
  title: "Customer Account",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <CustomerAccount initialMode="login" />;
}
