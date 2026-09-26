import type { Metadata } from "next";
import { ProductHero, SiteFrame } from "@/components/hostmyweb-site-chrome";
import { CATALOG_PRODUCTS } from "@/lib/commerce-catalog";

export const metadata: Metadata = {
  title: "Products & Add-ons",
  description: "Browse HostMyWeb shared hosting, WordPress, WooCommerce, VPS, cloud, email, domain, backup, SSL, and performance products.",
};

const groups = [
  { id: "shared", eyebrow: "SHARED HOSTING", title: "Straightforward hosting with clear limits.", description: "Four shared-hosting tiers for everything from a single website to larger multi-site portfolios, with easy upgrade paths as your needs grow." },
  { id: "wordpress", eyebrow: "MANAGED WORDPRESS", title: "WordPress plans for businesses and agencies.", description: "Managed WordPress with staging, updates, backups, security, CDN, and developer workflows." },
  { id: "woocommerce", eyebrow: "WOOCOMMERCE", title: "Store-focused hosting with room to grow.", description: "A stronger ecommerce path for customers who need WordPress commerce, faster performance, dependable recovery, and room to scale." },
  { id: "vps", eyebrow: "VPS", title: "Private virtual servers for custom workloads.", description: "VPS options for applications, APIs, workers, development environments, and customers who need server-level control." },
  { id: "cloud", eyebrow: "MANAGED CLOUD", title: "Dedicated resources without self-managing the whole stack.", description: "Managed cloud options for larger websites, stores, databases, and application workloads that need dedicated capacity." },
  { id: "email", eyebrow: "BUSINESS EMAIL", title: "Professional email that grows with your business.", description: "Use professional mailboxes on your domain with options that can grow independently from your website hosting." },
  { id: "addon", eyebrow: "ADD-ONS", title: "Performance, recovery, and security upgrades.", description: "Add extra speed, deeper backup coverage, stronger certificate options, and other services when your website needs more." },
] as const;

export default function ProductsPage() {
  return (
    <SiteFrame>
      <ProductHero
        eyebrow="Products"
        title="Everything you need to"
        accent="build, run, and grow online."
        description="Choose from shared hosting, WordPress, WooCommerce, VPS, managed cloud, business email, domains, backups, security, performance upgrades, and website services — all under one HostMyWeb account."
      >
        <div className="hmw-subnav">
          <a href="#shared">Shared</a>
          <a href="#wordpress">WordPress</a>
          <a href="#woocommerce">WooCommerce</a>
          <a href="#vps">VPS</a>
          <a href="#cloud">Managed Cloud</a>
          <a href="#email">Email</a>
          <a href="#addon">Add-ons</a>
        </div>
      </ProductHero>

      <section className="hmw-product-catalog-intro">
        <div>
          <span className="hmw-storefront-kicker">HOSTMYWEB PRODUCT CATALOG</span>
          <h2>Choose what fits today. Upgrade when you need more.</h2>
          <p>Every HostMyWeb product is designed around a clear use case, straightforward pricing, and an easy path to more capacity, performance, or control as your website or application grows.</p>
        </div>
        <a className="hmw-button" href="/domains">Search a domain</a>
      </section>

      {groups.map((group) => {
        const products = CATALOG_PRODUCTS.filter((product) => product.category === group.id);
        if (!products.length) return null;
        return (
          <section className="hmw-catalog-section" id={group.id} key={group.id}>
            <div className="hmw-catalog-heading">
              <span>{group.eyebrow}</span>
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </div>
            <div className="hmw-product-card-grid">
              {products.map((product) => (
                <article className="hmw-product-card" key={product.id}>
                  <div className="hmw-product-card-top">
                    <small>{product.category.toUpperCase()}</small>
                    <span>{product.badge || product.priceLabel}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <ul>
                    {product.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <div className="hmw-product-card-top"><strong>{product.priceLabel}</strong></div>
                  <a className="hmw-button" href={product.href}>Choose {product.name}</a>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <section className="hmw-catalog-section" id="domains">
        <div className="hmw-catalog-heading">
          <span>DOMAINS</span>
          <h2>Search, register, transfer, and manage your domains.</h2>
          <p>Check availability in real time, compare popular alternatives, see pricing before purchase, and keep your domain and hosting services together.</p>
        </div>
        <div className="hmw-product-card-grid">
          <a className="hmw-product-card" href="/domains"><div className="hmw-product-card-top"><small>DOMAIN</small><span>Live search</span></div><h3>Domain Registration</h3><p>Search available domains, compare alternatives, and register the name that fits your business.</p><b>Search domains →</b></a>
          <a className="hmw-product-card" href="/domains#transfer"><div className="hmw-product-card-top"><small>TRANSFER</small><span>Available</span></div><h3>Domain Transfer</h3><p>Move an eligible domain to HostMyWeb and manage it alongside your hosting and email services.</p><b>Transfer a domain →</b></a>
          <a className="hmw-product-card" href="/domains"><div className="hmw-product-card-top"><small>DNS</small><span>Included</span></div><h3>DNS Management</h3><p>Manage website, email, verification, and service records for domains connected to HostMyWeb.</p><b>View domain services →</b></a>
        </div>
      </section>
    </SiteFrame>
  );
}
