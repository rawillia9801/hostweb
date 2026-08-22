import type { ReactNode } from "react";

export function SiteHeader() {
  return (
    <header className="hmw-top">
      <a className="brand" href="/" aria-label="HostMyWeb home">
        <span className="hmw-logo"><i /><i /><i /></span>
        <span><b>HostMyWeb</b><small>WEB HOSTING & INFRASTRUCTURE</small></span>
      </a>
      <nav className="hmw-nav" aria-label="Main navigation">
        <a href="/hosting">Hosting</a>
        <a href="/domains">Domains</a>
        <a href="/email">Email</a>
        <a href="/websites">Websites</a>
        <a href="/security">Security</a>
        <a href="/support">Support</a>
      </nav>
      <div className="hmw-top-actions"><a href="/account">Log In</a><a className="cta" href="/signup">Get Started</a></div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="hmw-footer-real">
      <div className="hmw-footer-grid">
        <div>
          <a className="brand" href="/" style={{ color: "white", textDecoration: "none" }}><span className="hmw-logo"><i /><i /><i /></span><span><b>HostMyWeb</b><small>WEB HOSTING & INFRASTRUCTURE</small></span></a>
          <p>Real hosting, domains, email, website tools, and scalable infrastructure with transparent pricing and customer account controls.</p>
        </div>
        <div><h4>Hosting</h4><a href="/hosting/shared">Shared Cloud</a><a href="/hosting/wordpress">Managed WordPress</a><a href="/hosting/cloud">Managed Cloud</a><a href="/hosting/vps">VPS Hosting</a></div>
        <div><h4>Domains & Email</h4><a href="/domains">Domain Search</a><a href="/domains#pricing">Domain Pricing</a><a href="/domains#transfer">Transfers</a><a href="/email">Business Email</a></div>
        <div><h4>Website Services</h4><a href="/websites">Website Services</a><a href="/websites/ai-builder">AI Website Builder</a><a href="/websites/migration">Website Migration</a><a href="/security">Security & Backups</a></div>
        <div><h4>Customer</h4><a href="/account">Account</a><a href="/signup">Create Account</a><a href="/support">Support</a><a href="/support/urgent">Urgent Hosting Issue</a></div>
      </div>
      <div className="hmw-footer-bottom">© {new Date().getFullYear()} HostMyWeb.co. All rights reserved. Price Lock applies to the base shared-hosting subscription while the same plan remains continuously active; taxes, domains, optional add-ons, usage charges, and plan changes are separate.</div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: ReactNode }) {
  return <main className="hmw-site"><SiteHeader />{children}<SiteFooter /></main>;
}

export function ProductHero({ eyebrow, title, accent, description, children }: { eyebrow: string; title: string; accent?: string; description: string; children?: ReactNode }) {
  return (
    <section className="hmw-product-hero">
      <div className="hmw-breadcrumb"><a href="/">HOME</a><span>/</span><span>{eyebrow.toUpperCase()}</span></div>
      <div><span className="hmw-eyebrow"><i /> {eyebrow.toUpperCase()}</span><h1>{title}{accent ? <> <em>{accent}</em></> : null}</h1><p>{description}</p>{children}</div>
    </section>
  );
}
