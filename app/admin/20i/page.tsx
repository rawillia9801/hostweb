import type { Metadata } from "next";
import { TwentyISetup } from "@/components/twentyi-setup";

export const metadata: Metadata = {
  title: "20i Infrastructure Setup",
  robots: { index: false, follow: false },
};

export default function TwentyIAdminPage() {
  return <TwentyISetup />;
}
