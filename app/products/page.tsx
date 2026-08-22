import type { Metadata } from "next";
import { ProductHero, SiteFrame } from "@/components/hostmyweb-site-chrome";

export const metadata: Metadata = {
  title: "Products & Add-ons",
  description: "Browse HostMyWeb hosting, domains, email, WordPress, cloud, VPS, security, backup, performance, migration, and website service products.",
};

type Product = {
  code: string;
  title: string;
  text: string;
  status: string;
  href: string;
};

type ProductGroup = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
};

const groups: ProductGroup[] = [
  {
    id: "hosting",
    eyebrow: "HOSTING & SERVERS",
    title: "Hosting for websites, stores, applications, and larger workloads.",
    description: "Start with managed website hosting or move into dedicated cloud and virtual-server products when the workload needs more control or isolation.",
    products: [
      { code: "SHARED", title: "Shared Cloud Hosting", text: "Autoscaling shared-cloud hosting with published SSD, website, mailbox, and database limits.", status: "From $7.99/mo", href: "/hosting/shared" },
      { code: "WP", title: "Managed WordPress", text: "WordPress-focused hosting with staging, management, backup, security, and developer workflows.", status: "Available", href: "/hosting/wordpress" },
      { code: "STORE", title: "WooCommerce Hosting", text: "A WordPress commerce path for online stores that need stronger caching, backup, and growth options.", status: "Available by configuration", href: "/hosting/woocommerce" },
      { code: "AGENCY", title: "Agency Multi-site Hosting", text: "Higher-capacity shared hosting for agencies, designers, and customers managing larger site portfolios.", status: "$39.99/mo shared plan", href: "/hosting/shared" },
      { code: "CLOUD", title: "Managed Cloud Servers", text: "Dedicated managed cloud resources for larger ecommerce, high-traffic sites, databases, and application workloads.", status: "Configured to order", href: "/hosting/cloud" },
      { code: "VPS", title: "VPS Hosting", text: "Private virtual-server resources for custom applications, software stacks, workers, APIs, and server-level control.", status: "Configured to order", href: "/hosting/vps" },
    ],
  },
  {
    id: "performance",
    eyebrow: "PERFORMANCE, SECURITY & RECOVERY",
    title: "Add speed, stronger certificates, and deeper recovery options.",
    description: "Core SSL, CDN, backups, and security remain part of hosting. These products are for customers who need more than the standard included layer.",
    products: [
      { code: "TURBO", title: "Website Turbo", text: "High-frequency hosting acceleration for demanding or traffic-sensitive sites that need additional compute performance.", status: "Performance add-on", href: "/products/website-turbo" },
      { code: "SSL+", title: "Premium SSL Certificates", text: "Paid certificate options for customers who need a certificate product beyond standard included HTTPS.", status: "Optional add-on", href: "/products/premium-ssl" },
      { code: "BACKUP+", title: "Timeline Backups Pro", text: "Extended snapshot-style recovery for customers who want a deeper backup history and additional restore flexibility.", status: "Optional add-on", href: "/products/timeline-backups" },
      { code: "CLEAN", title: "Malware Cleanup & Recovery", text: "Hands-on assistance when a site needs investigation, cleanup, restoration, or recovery after a security incident.", status: "Request service", href: "/products/malware-cleanup" },
      { code: "CARE", title: "Website Care", text: "Ongoing help with routine website maintenance, updates, recovery planning, and operational upkeep.", status: "Request service", href: "/products/website-care" },
      { code: "CDN", title: "Global CDN", text: "Content delivery and caching for hosted sites; included with qualifying hosting and available as part of performance configurations.", status: "Included with hosting", href: "/security" },
    ],
  },
  {
    id: "domains-email",
    eyebrow: "DOMAINS & EMAIL",
    title: "The identity and communications layer around the website.",
    description: "Keep domain registration, DNS, transfers, and professional email under the same customer relationship without forcing them into a larger hosting plan.",
    products: [
      { code: "DOMAIN", title: "Domain Registration", text: "Search and register domains with registration and renewal pricing displayed before purchase.", status: "From $14.99/yr", href: "/domains" },
      { code: "TRANSFER", title: "Domain Transfers", text: "Move eligible registrar management into HostMyWeb while keeping website migration as a separate operation.", status: "Available", href: "/domains#transfer" },
      { code: "DNS", title: "DNS Management", text: "Manage website, email, verification, and service records for domains connected to HostMyWeb.", status: "Available", href: "/domains" },
      { code: "MAIL", title: "Business Email", text: "Professional domain email with mailbox service separated from website SSD storage.", status: "Available", href: "/email" },
      { code: "MAIL+", title: "Mailbox Storage Upgrades", text: "Add mailbox storage when a customer needs more email capacity without upgrading website hosting.", status: "Optional add-on", href: "/products/mailbox-storage" },
      { code: "MIGRATE-M", title: "Mailbox Migration", text: "Move eligible mailbox data through supported migration workflows when switching email service.", status: "Supported sources", href: "/websites/migration" },
    ],
  },
  {
    id: "websites",
    eyebrow: "WEBSITE SERVICES",
    title: "Products for customers who need more than raw hosting.",
    description: "HostMyWeb can sell the build, move, launch, and ongoing operating services around a website instead of relying on hosting subscriptions alone.",
    products: [
      { code: "AI BUILD", title: "AI Website Builder", text: "A guided website creation workflow that turns a business description into a site structure that can be refined and published.", status: "Available", href: "/websites/ai-builder" },
      { code: "MOVE", title: "Standard Website Migration", text: "Move a supported website and database into HostMyWeb without a separate standard migration charge.", status: "Included with hosting", href: "/websites/migration" },
      { code: "MOVE+", title: "Complex Manual Migration", text: "Hands-on migration for unsupported, unusual, multi-site, or reconstruction-heavy moves.", status: "From $49", href: "/websites/migration" },
      { code: "SETUP", title: "Website Setup & Care", text: "Assisted setup and ongoing help for customers who do not want to manage every technical detail themselves.", status: "Request service", href: "/products/website-care" },
      { code: "ECOM", title: "WooCommerce & Ecommerce Setup", text: "Store-focused hosting and launch configuration with a growth path from WordPress into performance and cloud products.", status: "Available by configuration", href: "/hosting/woocommerce" },
      { code: "CUSTOM", title: "Custom Infrastructure Setup", text: "A sales and engineering path for projects that combine hosting, DNS, email, cloud, VPS, or unusual deployment requirements.", status: "Request quote", href: "/support" },
    ],
  },
];

export default function ProductsPage() {
  return (
    <SiteFrame>
      <ProductHero
        eyebrow="Products"
        title="More than a hosting"
        accent="subscription."
        description="HostMyWeb offers hosting, servers, domains, email, performance upgrades, backups, security products, migrations, website tools, and hands-on services through one product catalog."
      >
        <div className="hmw-subnav">
          <a href="#hosting">Hosting & Servers</a>
          <a href="#performance">Performance & Security</a>
          <a href="#domains-email">Domains & Email</a>
          <a href="#websites">Website Services</a>
        </div>
      </ProductHero>

      <section className="hmw-product-catalog-intro">
        <div>
          <span className="hmw-storefront-kicker">HOSTMYWEB PRODUCT CATALOG</span>
          <h2>Build the account around what the customer actually needs.</h2>
          <p>Some products are ready for direct purchase, some are included with hosting, and infrastructure products that require provider sizing remain configured to order instead of showing invented prices.</p>
        </div>
        <a className="hmw-button" href="/support">Need help choosing?</a>
      </section>

      {groups.map((group) => (
        <section className="hmw-catalog-section" id={group.id} key={group.id}>
          <div className="hmw-catalog-heading">
            <span>{group.eyebrow}</span>
            <h2>{group.title}</h2>
            <p>{group.description}</p>
          </div>
          <div className="hmw-product-card-grid">
            {group.products.map((product) => (
              <a className="hmw-product-card" href={product.href} key={`${group.id}-${product.title}`}>
                <div className="hmw-product-card-top"><small>{product.code}</small><span>{product.status}</span></div>
                <h3>{product.title}</h3>
                <p>{product.text}</p>
                <b>View product →</b>
              </a>
            ))}
          </div>
        </section>
      ))}

      <section className="hmw-product-catalog-cta">
        <div><span>DON'T SEE THE EXACT CONFIGURATION?</span><h2>HostMyWeb can quote the workload instead of forcing the wrong plan.</h2><p>Use the custom service path for managed cloud sizing, VPS requirements, large migrations, ecommerce, or mixed hosting and domain projects.</p></div>
        <a className="hmw-button" href="/support">Request a custom setup</a>
      </section>
    </SiteFrame>
  );
}
