import type { Metadata } from "next";
import { PasswordRecovery } from "@/components/password-recovery";

export const metadata: Metadata = {
  title: "Recover Account",
  robots: { index: false, follow: false },
};

export default function RecoverPage() {
  return <PasswordRecovery />;
}
