import type { Metadata } from "next";
import "./globals.css";
import "./storefront.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hostmyweb.co"),
  title: {
    default: "HostMyWeb | Web Hosting, Domains & Business Email",
    template: "%s | HostMyWeb",
  },
  description: "Web hosting, domains, business email, DNS, SSL, customer accounts, and connected infrastructure for real brands.",
  openGraph: {
    title: "HostMyWeb",
    description: "Web hosting, domains & business email — built for real brands.",
    url: "https://hostmyweb.co",
    siteName: "HostMyWeb",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
