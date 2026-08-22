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
import "./hosting-storefront-v2.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hostmyweb.co"),
  title: {
    default: "HostMyWeb | Web Hosting, WordPress, Domains, Email, Cloud & VPS",
    template: "%s | HostMyWeb",
  },
  description: "Web hosting from $7.99/month with transparent renewal pricing, plus WordPress, WooCommerce, domains, business email, security, backup, Managed Cloud, VPS and website services.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HostMyWeb | Web Hosting Without the Renewal-Price Ambush",
    description: "Shared cloud hosting, WordPress, domains, email, website services, security, Managed Cloud and VPS with straightforward pricing and a clear path to scale.",
    url: "https://hostmyweb.co",
    siteName: "HostMyWeb",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
