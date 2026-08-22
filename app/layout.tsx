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
import "./product-marketplace.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hostmyweb.co"),
  title: {
    default: "HostMyWeb | Hosting, Domains, Email, Cloud, VPS & Website Services",
    template: "%s | HostMyWeb",
  },
  description: "HostMyWeb provides shared cloud hosting, managed WordPress, managed cloud, VPS hosting, domains, business email, premium SSL, backup and performance add-ons, migration, website tools, and customer services with transparent pricing.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HostMyWeb | Hosting and Website Services Without the Renewal Trap",
    description: "Hosting, domains, email, WordPress, cloud, VPS, security, backups, performance products, migration, and website services with transparent pricing.",
    url: "https://hostmyweb.co",
    siteName: "HostMyWeb",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
