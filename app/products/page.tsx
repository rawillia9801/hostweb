import type { Metadata } from "next";
import { ProductHero, SiteFrame } from "@/components/hostmyweb-site-chrome";
import { CATALOG_PRODUCTS } from "@/lib/commerce-catalog";

export const metadata: Metadata = {
  title: "Products & Add-ons",
  description: "Browse HostMyWeb shared hosting, WordPress, WooCommerce, VPS, cloud, email, domain, backup, SSL, and performance products.",
};

const groups = [
  { id: "shared", eyebrow: "SHARED HOSTING", title: "Straightforward hosting with clear commercial limits.", description: "Four retail tiers backed by the 20i reseller platform, with limits chosen to create useful customer upgrade paths." },
  { id: "wordpress", eyebrow: "MANAGED WORDPRESS", title: "WordPress plans for businesses and agencies.", description: "Managed WordPress with staging, updates, backups, security, CDN, and developer workflows." },
  { id: "woocommerce", eyebrow: "WOOCOMMERCE", title: "Store-focused hosting with room to grow.", description: "A clearer ecommerce path for customers who need WordPress commerce, stronger performance, and upgrade options." },
  { id: "vps", eyebrow: "VPS", title: "Private virtual servers for custom workloads.", description: "Retail VPS tiers for applications, APIs, workers, and customers that need server-level control." },
  { id: "cloud", eyebrow: "MANAGED CLOUD", title: "Dedicated resources without self-managing the whole stack.", description: "Managed cloud options for larger websites, stores, databases, and application workloads." },
  { id: "email", eyebrow: "BUSINESS EMAIL", title: "Professional email without forcing a hosting upgrade.", description: "Sell mailbox service independently from website storage and hosting plans." },
  { id: "addon", eyebrow: "ADD-ONS", title: "Performance, recovery, and security upgrades.", description: "Optional add-ons that increase order value while keeping standard hosting features clear." },
] as const;

export default function ProductsPage() {
  return (
    <SiteFrame>
      <ProductHero
        eyebrow="Products"
        title="A real hosting catalog,"
        accent="not four placeholder plans."
        description="HostMyWeb now separates shared hosting, WordPress, WooCommerce, VPS, managed cloud, business email, domains, and add-ons into a commercial product catalog with realistic retail positioning."
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
          <h2>Retail packages built around what customers actually buy.</h2>
          <p>Shared-plan quotas are HostMyWeb commercial limits, not claims that the underlying 20i platform is restricted to those totals. Products that require a specific 20i HostShop Product Link become direct checkout products as soon as that exact URL is configured.</p>
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
          <h2>Search, register, transfer, and manage domains through the branded HostShop flow.</h2>
          <p>Availability is checked live before checkout, popular alternatives are suggested automatically, and registration/renewal pricing is displayed before handoff.</p>
        </div>
        <div className="hmw-product-card-grid">
          <a className="hmw-product-card" href="/domains"><div className="hmw-product-card-top"><small>DOMAIN</small><span>Live search</span></div><h3>Domain Registration</h3><p>Search available domains, compare alternatives, then complete the registration in branded checkout.</p><b>Search domains →</b></a>
          <a className="hmw-product-card" href="/domains#transfer"><div className="hmw-product-card-top"><small>TRANSFER</small><span>Available</span></div><h3>Domain Transfer</h3><p>Move an existing eligible domain into the HostMyWeb relationship while keeping website migration separate.</p><b>Transfer a domain →</b></a>
          <a className="hmw-product-card" href="/domains"><div className="hmw-product-card-top"><small>DNS</small><span>Included</span></div><h3>DNS Management</h3><p>Manage website, email, verification, and service records for domains connected to HostMyWeb.</p><b>View domain services →</b></a>
        </div>
      </section>
    </SiteFrame>
  );
}
