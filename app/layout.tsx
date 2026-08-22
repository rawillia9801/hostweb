import type { Metadata } from "next";
import "./globals.css";
import "./storefront.css";
import "./architectural.css";
import "./hosting-refresh.css";
import "./product-clarity.css";
import "./scale-path.css";
import "./resource-transparency.css";
import "./price-transparency.css";
import "./commercial-site.css";
import "./hosting-storefront.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hostmyweb.co"),
  title: {
    default: "HostMyWeb | Web Hosting, Domains, Email, Cloud & VPS",
    template: "%s | HostMyWeb",
  },
  description: "HostMyWeb provides shared cloud hosting, managed WordPress, managed cloud, VPS hosting, domains, business email, website services, security tools, migration, and customer account services with transparent pricing.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HostMyWeb | Real Web Hosting Without the Renewal Trap",
    description: "Web hosting, domains, email, website services, cloud and VPS infrastructure with transparent pricing and published resource limits.",
    url: "https://hostmyweb.co",
    siteName: "HostMyWeb",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
