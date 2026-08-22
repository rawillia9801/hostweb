import type { Metadata } from "next";
import "./globals.css";
import "./storefront.css";
import "./architectural.css";
import "./hosting-refresh.css";
import "./product-clarity.css";
import "./scale-path.css";
import "./resource-transparency.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hostmyweb.co"),
  title: {
    default: "HostMyWeb | Autoscaling Web Hosting, Cloud, VPS, Domains & Email",
    template: "%s | HostMyWeb",
  },
  description: "Autoscaling shared-cloud web hosting with published SSD, website, mailbox and database limits, SSH and Git access, included standard migration, transparent Price Lock pricing, domains, email, managed cloud and VPS scale paths.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HostMyWeb | Hosting Without the Renewal Trap",
    description: "Autoscaling shared-cloud hosting with transparent renewals, published plan resources, included standard migration, global delivery, domains, email, and a clear path into managed cloud and VPS infrastructure.",
    url: "https://hostmyweb.co",
    siteName: "HostMyWeb",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
