import type { Metadata } from "next";
import "./globals.css";
import "./storefront.css";
import "./architectural.css";
import "./hosting-refresh.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hostmyweb.co"),
  title: {
    default: "HostMyWeb | Shared Web Hosting, Domains, Email & Website Services",
    template: "%s | HostMyWeb",
  },
  description: "Straightforward shared web hosting, fair domain pricing, business email, AI-assisted website building, security tools, and a HostMyWeb Price Lock—without teaser hosting rates or renewal gimmicks.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HostMyWeb | Shared Web Hosting Without Renewal Gimmicks",
    description: "Shared hosting, domains, business email, site creation, security tools, and the HostMyWeb Price Lock—with no teaser hosting rates or inflated renewal pricing.",
    url: "https://hostmyweb.co",
    siteName: "HostMyWeb",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
