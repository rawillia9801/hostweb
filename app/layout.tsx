import type { Metadata } from "next";
import "./globals.css";
import "./storefront.css";
import "./architectural.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hostmyweb.co"),
  title: {
    default: "HostMyWeb | Hosting, Domains, Email & Shared Business Infrastructure",
    template: "%s | HostMyWeb",
  },
  description: "Straightforward web hosting, fair domain pricing, business email, AI-assisted website building, and a shared service layer for connected business software—without teaser pricing or renewal gimmicks.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HostMyWeb | Straightforward Hosting & Shared Business Infrastructure",
    description: "Hosting, domains, business email, site creation, and the shared service layer behind connected products—with clear pricing and fair renewals.",
    url: "https://hostmyweb.co",
    siteName: "HostMyWeb",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}