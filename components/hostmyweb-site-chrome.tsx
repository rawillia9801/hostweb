import type { ReactNode } from "react";

const hostingLinks = [
  ["Shared Cloud Hosting", "/hosting/shared", "Fast managed hosting for business websites"],
  ["Managed WordPress", "/hosting/wordpress", "WordPress-focused hosting and tools"],
  ["WooCommerce Hosting", "/hosting/woocommerce", "Store-ready WordPress hosting"],
  ["Managed Cloud", "/hosting/cloud", "Dedicated managed cloud resources"],
  ["VPS Hosting", "/hosting/vps", "Private virtual servers for custom workloads"],
] as const;

export function SiteHeader() {
  return (
    <>
      <div className="hmw-utility-bar">
        <div><span>HostMyWeb</span><span>Hosting without the renewal trap.</span></div>
        <div><a href="/support">Sales & Support</a><a href="/support/urgent">Report an outage</a><a href="/account">Customer Login</a></div>
      </div>
      <header className="hmw-top">
        <a className="brand" href="/" aria-label="HostMyWeb home">
          <span className="hmw-logo" aria-hidden="true"><i /><i /><i /></span>
          <span><b>HostMyWeb</b><small>WEB HOSTING · DOMAINS · SERVERS</small></span>
        </a>
        <nav className="hmw-nav" aria-label="Main navigation">
          <details className="hmw-nav-menu">
            <summary>Hosting <span>⌄</span></summary>
            <div className="hmw-mega-menu">
              <div className="hmw-mega-main">
                <small>HOSTING</small>
                {hostingLinks.map(([title, href, text]) => <a href={href} key={title}><b>{title}</b><span>{text}</span></a>)}
              </div>
              <div className="hmw-mega-side">
                <small>POPULAR</small>
                <a href="/hosting/shared"><b>Hosting from $7.99/mo</b><span>Same base price at renewal</span></a>
                <a href="/products"><b>Browse all products</b><span>Security, backup, email, performance & more</span></a>
              </div>
            </div>
          </details>
          <a href="/domains">Domains</a>
          <a href="/email">Email</a>
          <a href="/websites">Websites</a>
          <a href="/products">Products</a>
          <a href="/security">Security</a>
          <a href="/support">Support</a>
        </nav>
        <div className="hmw-top-actions"><a href="/account">Log In</a><a className="cta" href="/hosting/shared">Get Hosting</a></div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="hmw-footer-real">
      <div className="hmw-footer-lead">
        <div><span className="hmw-logo"><i /><i /><i /></span><div><b>HostMyWeb</b><p>Hosting, domains, email, websites, security and server infrastructure with straightforward pricing.</p></div></div>
        <div className="hmw-footer-lead-actions"><a href="/hosting/shared">View hosting plans</a><a href="/support">Talk to HostMyWeb</a></div>
      </div>
      <div className="hmw-footer-grid">
        <div><h4>Web Hosting</h4><a href="/hosting/shared">Shared Cloud Hosting</a><a href="/hosting/wordpress">Managed WordPress</a><a href="/hosting/woocommerce">WooCommerce Hosting</a><a href="/hosting/cloud">Managed Cloud</a><a href="/hosting/vps">VPS Hosting</a><a href="/products">All Hosting Products</a></div>
        <div><h4>Domains & Email</h4><a href="/domains">Domain Search</a><a href="/domains#pricing">Domain Pricing</a><a href="/domains#transfer">Domain Transfers</a><a href="/email">Business Email</a><a href="/products/mailbox-storage">Mailbox Upgrades</a></div>
        <div><h4>Website Services</h4><a href="/websites">Website Services</a><a href="/websites/ai-builder">AI Website Builder</a><a href="/websites/migration">Website Migration</a><a href="/products/website-care">Website Care</a><a href="/products/malware-cleanup">Malware Cleanup</a></div>
        <div><h4>Security & Performance</h4><a href="/security">Security Overview</a><a href="/products/website-turbo">Website Turbo</a><a href="/products/premium-ssl">Premium SSL</a><a href="/products/timeline-backups">Timeline Backups</a><a href="/products">All Add-ons</a></div>
        <div><h4>Customer</h4><a href="/account">Customer Account</a><a href="/signup">Create Account</a><a href="/support">Support Center</a><a href="/support/urgent">Urgent Hosting Issue</a><a href="/products">Product Catalog</a></div>
      </div>
      <div className="hmw-footer-bottom"><span>© {new Date().getFullYear()} HostMyWeb.co. All rights reserved.</span><span>Price Lock applies to the base shared-hosting subscription while the same plan remains continuously active; taxes, domains, optional add-ons, usage charges, and plan changes are separate.</span></div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: ReactNode }) {
  return <main className="hmw-site"><SiteHeader />{children}<SiteFooter /></main>;
}

export function ProductHero({ eyebrow, title, accent, description, children }: { eyebrow: string; title: string; accent?: string; description: string; children?: ReactNode }) {
  return (
    <section className="hmw-product-hero">
      <div className="hmw-product-hero-inner">
        <div className="hmw-breadcrumb"><a href="/">HOME</a><span>/</span><span>{eyebrow.toUpperCase()}</span></div>
        <span className="hmw-eyebrow">{eyebrow.toUpperCase()}</span>
        <h1>{title}{accent ? <> <em>{accent}</em></> : null}</h1>
        <p>{description}</p>
        {children}
      </div>
    </section>
  );
}
