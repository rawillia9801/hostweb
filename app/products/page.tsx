import type { Metadata } from "next";
import { ProductHero, SiteFrame } from "@/components/hostmyweb-site-chrome";
import { CATALOG_PRODUCTS } from "@/lib/commerce-catalog";

export const metadata: Metadata = {
  title: "Products & Add-ons",
  description: "Browse HostMyWeb shared hosting, WordPress, WooCommerce, VPS, cloud, email, domain, backup, SSL, and performance products.",
};

const groups = [
  { id: "shared", eyebrow: "SHARED HOSTING", title: "Simple hosting plans for websites of every size.", description: "Choose the plan that fits your site today, with clear storage, mailbox, database, and website limits." },
  { id: "wordpress", eyebrow: "MANAGED WORDPRESS", title: "WordPress hosting that is ready to use.", description: "Launch and manage WordPress with staging, backups, security, CDN, and developer tools included." },
  { id: "woocommerce", eyebrow: "WOOCOMMERCE", title: "Hosting built for online stores.", description: "Run WooCommerce with the performance, recovery, and scaling options an ecommerce site needs." },
  { id: "vps", eyebrow: "VPS", title: "Private virtual servers for custom workloads.", description: "Choose VPS hosting when you need server-level control for applications, APIs, workers, or custom software." },
  { id: "cloud", eyebrow: "MANAGED CLOUD", title: "Dedicated resources with managed support.", description: "A stronger fit for busy websites, larger stores, databases, and applications that need dedicated capacity." },
  { id: "email", eyebrow: "BUSINESS EMAIL", title: "Professional email for your domain.", description: "Create business mailboxes for your domain without changing your website hosting plan." },
  { id: "addon", eyebrow: "ADD-ONS", title: "Extra performance, security, and recovery when you need it.", description: "Add faster performance, extended backups, premium certificates, or more email storage without changing your core hosting plan." },
] as const;

export default function ProductsPage() {
  return (
    <SiteFrame>
      <ProductHero
        eyebrow="Products"
        title="Everything you need to"
        accent="run your website."
        description="Choose hosting, WordPress, ecommerce, VPS, managed cloud, business email, domains, backups, security, and performance upgrades from one place."
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
          <h2>Choose the service that fits what you are building.</h2>
          <p>Start with hosting and a domain, then add email, backups, security, performance, or more server power as your website grows.</p>
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
          <h2>Find the right domain and keep everything together.</h2>
          <p>Search live availability, compare popular alternatives, see pricing before checkout, or transfer a domain you already own.</p>
        </div>
        <div className="hmw-product-card-grid">
          <a className="hmw-product-card" href="/domains"><div className="hmw-product-card-top"><small>DOMAIN</small><span>Live search</span></div><h3>Domain Registration</h3><p>Search available domains, compare alternatives, and register the name that fits your business.</p><b>Search domains →</b></a>
          <a className="hmw-product-card" href="/domains#transfer"><div className="hmw-product-card-top"><small>TRANSFER</small><span>Available</span></div><h3>Domain Transfer</h3><p>Transfer an eligible domain to HostMyWeb and manage it alongside your other services.</p><b>Transfer a domain →</b></a>
          <a className="hmw-product-card" href="/domains"><div className="hmw-product-card-top"><small>DNS</small><span>Included</span></div><h3>DNS Management</h3><p>Manage the records that connect your domain to websites, email, and other online services.</p><b>View domain services →</b></a>
        </div>
      </section>
    </SiteFrame>
  );
}
