import type { Metadata } from "next";
import "./globals.css";
import "./storefront.css";
import "./architectural.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hostmyweb.co"),
  title: {
    default: "HostMyWeb | Straightforward Hosting, Domains & Email",
    template: "%s | HostMyWeb",
  },
  description: "Straightforward web hosting, fair domain pricing, business email, AI-assisted website building, and connected infrastructure without teaser pricing or renewal gimmicks.",
  openGraph: {
    title: "HostMyWeb | Straightforward Pricing. No Gimmicks.",
    description: "Web hosting, domains, business email, and connected infrastructure with clear pricing and fair renewals.",
    url: "https://hostmyweb.co",
    siteName: "HostMyWeb",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
