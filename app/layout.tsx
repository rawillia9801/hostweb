import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hostmyweb.co"),
  title: {
    default: "HostMyWeb | Managed Hosting, Domains & Business Email",
    template: "%s | HostMyWeb",
  },
  description: "Managed hosting, domains, business email, DNS, SSL, migrations, and website infrastructure for real brands.",
  openGraph: {
    title: "HostMyWeb",
    description: "Managed hosting, domains & business email — built for real brands.",
    url: "https://hostmyweb.co",
    siteName: "HostMyWeb",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
