import type { Metadata } from "next";
import { ProductHero, SiteFrame } from "@/components/hostmyweb-site-chrome";

export const metadata: Metadata = {
  title: "Products | HostMyWeb",
  description:
    "Browse HostMyWeb hosting, WordPress, ecommerce, cloud, VPS, domains, business email, SSL, backups, performance, migration, and website services.",
};

type Product = {
  code: string;
  title: string;
  text: string;
  status: string;
  href: string;
  featured?: boolean;
};

type ProductGroup = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
};

const featuredProducts: Product[] = [
  {
    code: "HOST",
    title: "Shared Cloud Hosting",
    text: "Fast, autoscaling hosting for business sites, portfolios, blogs, landing pages, and growing web projects.",
    status: "From $7.99/mo",
    href: "/hosting/shared",
    featured: true,
  },
  {
    code: "WP",
    title: "Managed WordPress",
    text: "WordPress hosting with staging, cloning, management tools, CDN, backups, security, SSH, Git, and WP-CLI workflows.",
    status: "WordPress optimized",
    href: "/hosting/wordpress",
    featured: true,
  },
  {
    code: "TURBO",
    title: "Website Turbo",
    text: "A performance upgrade with high-frequency compute, global CDN pre-caching, and expanded MySQL capacity.",
    status: "Performance upgrade",
    href: "/products/website-turbo",
    featured: true,
  },
  {
    code: "CLOUD",
    title: "Managed Cloud",
    text: "Dedicated managed cloud resources for high-traffic sites, ecommerce, databases, and application workloads.",
    status: "Custom configuration",
    href: "/hosting/cloud",
    featured: true,
  },
];

const groups: ProductGroup[] = [
  {
    id: "hosting",
    eyebrow: "HOSTING & APPLICATION PLATFORMS",
    title: "A hosting path for everything from one website to serious application workloads.",
    description:
      "Start on autoscaling shared cloud, choose an optimized application platform, or move into dedicated cloud and virtual-server resources as your workload grows.",
    products: [
      {
        code: "SHARED",
        title: "Shared Cloud Hosting",
        text: "Autoscaling shared-cloud hosting with clear website, storage, mailbox, and database allowances for each HostMyWeb plan.",
        status: "From $7.99/mo",
        href: "/hosting/shared",
      },
      {
        code: "WP",
        title: "Managed WordPress",
        text: "A WordPress-optimized platform with staging, cloning, WordPress Manager, edge caching, backups, security, and developer tools.",
        status: "Available",
        href: "/hosting/wordpress",
      },
      {
        code: "STORE",
        title: "WooCommerce Hosting",
        text: "Store-focused WordPress hosting with a growth path into higher-frequency compute and dedicated cloud resources.",
        status: "Ecommerce ready",
        href: "/hosting/woocommerce",
      },
      {
        code: "MAGENTO",
        title: "Managed Magento Hosting",
        text: "Managed cloud hosting for Magento stores that need stronger compute, caching, search, and database performance.",
        status: "Custom configuration",
        href: "/hosting/cloud",
      },
      {
        code: "CLOUD",
        title: "Managed Cloud Servers",
        text: "Dedicated managed cloud capacity for larger websites, ecommerce, databases, APIs, and application stacks.",
        status: "Custom configuration",
        href: "/hosting/cloud",
      },
      {
        code: "AWS",
        title: "Managed AWS",
        text: "AWS-backed managed cloud infrastructure for projects that need Amazon Web Services while keeping day-to-day server management simple.",
        status: "Custom configuration",
        href: "/hosting/cloud",
      },
      {
        code: "GCP",
        title: "Managed Google Cloud",
        text: "Google Cloud-backed managed infrastructure for applications and sites that benefit from Google\'s global network and cloud footprint.",
        status: "Custom configuration",
        href: "/hosting/cloud",
      },
      {
        code: "VPS",
        title: "VPS Hosting",
        text: "Private virtual-server resources for custom applications, APIs, workers, development environments, and server-level control.",
        status: "Multiple configurations",
        href: "/hosting/vps",
      },
      {
        code: "AGENCY",
        title: "Agency & Multi-site Hosting",
        text: "Higher-capacity hosting for agencies, designers, developers, and customers managing a larger portfolio of websites.",
        status: "From $39.99/mo",
        href: "/hosting/shared",
      },
    ],
  },
  {
    id: "performance",
    eyebrow: "PERFORMANCE, SECURITY & RECOVERY",
    title: "Turn up performance and recovery without rebuilding the whole account.",
    description:
      "HostMyWeb hosting already includes the essentials. These upgrades add more speed, stronger certificate choices, deeper backup coverage, or hands-on recovery when a site needs more.",
    products: [
      {
        code: "TURBO",
        title: "Website Turbo",
        text: "High-frequency compute, global CDN pre-caching, and increased MySQL capacity for sites that need an extra performance tier.",
        status: "Performance upgrade",
        href: "/products/website-turbo",
      },
      {
        code: "SSL",
        title: "Premium SSL Certificates",
        text: "Optional Simple, Wildcard, and Extended Validation certificate products for organizations that need more than standard included HTTPS.",
        status: "Optional add-on",
        href: "/products/premium-ssl",
      },
      {
        code: "BACKUP+",
        title: "Timeline Backups Pro",
        text: "Extended backup history with deeper database retention and email backup coverage for businesses that want a wider recovery window.",
        status: "Optional add-on",
        href: "/products/timeline-backups",
      },
      {
        code: "SNAP",
        title: "VPS Snapshot Backups",
        text: "Automated snapshot protection for VPS environments where fast whole-server rollback is valuable.",
        status: "VPS add-on",
        href: "/hosting/vps",
      },
      {
        code: "CDN",
        title: "Global CDN",
        text: "Global content delivery and edge caching help hosted websites serve visitors quickly from locations around the world.",
        status: "Included with hosting",
        href: "/security",
      },
      {
        code: "WAF",
        title: "WAF & DDoS Protection",
        text: "Integrated web-application and network protection helps filter malicious traffic before it reaches hosted websites.",
        status: "Included with hosting",
        href: "/security",
      },
      {
        code: "SCAN",
        title: "Malware Scanning",
        text: "Automatic and on-demand malware scanning helps identify compromised files and suspicious website activity.",
        status: "Included with hosting",
        href: "/security",
      },
      {
        code: "CLEAN",
        title: "Malware Cleanup & Recovery",
        text: "Hands-on assistance when a website needs investigation, cleanup, restoration, or recovery after a security incident.",
        status: "Request service",
        href: "/products/malware-cleanup",
      },
    ],
  },
  {
    id: "domains-email",
    eyebrow: "DOMAINS & BUSINESS EMAIL",
    title: "Keep the domain, DNS, and business inboxes together.",
    description:
      "Register and transfer domains, manage DNS, create professional email addresses, and expand mailbox capacity without forcing a website onto a larger hosting plan.",
    products: [
      {
        code: "DOMAIN",
        title: "Domain Registration",
        text: "Search and register a domain with registration and renewal pricing shown before purchase.",
        status: "From $14.99/yr",
        href: "/domains",
      },
      {
        code: "TRANSFER",
        title: "Domain Transfers",
        text: "Move eligible domain registration and DNS management into HostMyWeb while keeping the website online during the transition.",
        status: "Available",
        href: "/domains#transfer",
      },
      {
        code: "DNS",
        title: "DNS Management",
        text: "Manage website, mail, verification, and service records from one place for domains connected to HostMyWeb.",
        status: "Available",
        href: "/domains",
      },
      {
        code: "MAIL",
        title: "Business Email",
        text: "Professional domain email on a dedicated mail platform, separate from website storage and website compute resources.",
        status: "Available",
        href: "/email",
      },
      {
        code: "MAIL+",
        title: "Mailbox Storage Upgrades",
        text: "Increase mailbox capacity in 10 GB increments when an inbox needs more room without changing the website hosting plan.",
        status: "Expandable storage",
        href: "/products/mailbox-storage",
      },
      {
        code: "MIGRATE-M",
        title: "Mailbox Migration",
        text: "Move supported mailbox data into HostMyWeb when switching email providers or consolidating business services.",
        status: "Migration available",
        href: "/websites/migration",
      },
    ],
  },
  {
    id: "services",
    eyebrow: "MIGRATION & WEBSITE SERVICES",
    title: "Need more than the platform? We can help with the move, setup, and ongoing work too.",
    description:
      "Hosting should not require every customer to become a systems administrator. HostMyWeb can help move, recover, configure, and maintain the website around the infrastructure.",
    products: [
      {
        code: "MOVE",
        title: "Standard Website Migration",
        text: "Move a supported website, database, and eligible email data into HostMyWeb with the standard migration included with hosting.",
        status: "Included with hosting",
        href: "/websites/migration",
      },
      {
        code: "MOVE+",
        title: "Complex Manual Migration",
        text: "Hands-on migration for unusual platforms, multi-site projects, broken source environments, or moves that need reconstruction work.",
        status: "From $49",
        href: "/websites/migration",
      },
      {
        code: "AI BUILD",
        title: "AI Website Builder",
        text: "A guided website creation workflow that turns a business description into a starting structure that can be refined and published.",
        status: "Available",
        href: "/websites/ai-builder",
      },
      {
        code: "CARE",
        title: "Website Care",
        text: "Ongoing help with routine website maintenance, updates, recovery planning, and operational upkeep.",
        status: "Request service",
        href: "/products/website-care",
      },
      {
        code: "SETUP",
        title: "Website Setup Assistance",
        text: "Hands-on help connecting domains, publishing a site, configuring email, SSL, DNS, and the pieces needed for launch.",
        status: "Request service",
        href: "/support",
      },
      {
        code: "CUSTOM",
        title: "Custom Infrastructure Setup",
        text: "A tailored path for projects that combine hosting, DNS, email, cloud, VPS, ecommerce, or application requirements.",
        status: "Request a quote",
        href: "/support",
      },
    ],
  },
];

const capabilityStrip = [
  "Autoscaling cloud hosting",
  "Managed WordPress",
  "Managed cloud",
  "VPS",
  "Domains & DNS",
  "Business email",
  "Premium SSL",
  "Backups & recovery",
] as const;

export default function ProductsPage() {
  return (
    <SiteFrame>
      <ProductHero
        eyebrow="HostMyWeb Products"
        title="Everything around your website."
        accent="One place to manage it."
        description="Choose hosting, WordPress, ecommerce, cloud, VPS, domains, email, security, backups, performance upgrades, migration, and website services without stitching together a pile of unrelated providers."
      >
        <div className="hmw-subnav">
          <a href="#hosting">Hosting</a>
          <a href="#performance">Performance & Security</a>
          <a href="#domains-email">Domains & Email</a>
          <a href="#services">Website Services</a>
        </div>
      </ProductHero>

      <section className="hmw-market-capability-strip" aria-label="HostMyWeb capabilities">
        {capabilityStrip.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="hmw-product-catalog-intro hmw-product-catalog-intro--stacked">
        <div>
          <span className="hmw-storefront-kicker">START WITH WHAT YOU NEED TODAY</span>
          <h2>Small site now. Bigger workload later. You do not have to change hosting companies to grow.</h2>
          <p>
            HostMyWeb can start with straightforward shared hosting and grow into higher-performance WordPress,
            ecommerce, managed cloud, or VPS infrastructure. Add email, domains, backup depth, certificates, and
            performance upgrades as the project changes.
          </p>
        </div>
        <div className="hmw-market-intro-actions">
          <a className="hmw-button" href="/hosting/shared">View hosting plans</a>
          <a className="hmw-button hmw-button--secondary" href="/support">Help me choose</a>
        </div>
      </section>

      <section className="hmw-featured-products">
        <div className="hmw-catalog-heading">
          <span>POPULAR PRODUCTS</span>
          <h2>Four good places to start.</h2>
          <p>Pick the platform that fits the job now. The account can grow without rebuilding everything around it.</p>
        </div>
        <div className="hmw-featured-products-grid">
          {featuredProducts.map((product) => (
            <a className="hmw-featured-product" href={product.href} key={product.title}>
              <div className="hmw-featured-product-top">
                <small>{product.code}</small>
                <span>{product.status}</span>
              </div>
              <h3>{product.title}</h3>
              <p>{product.text}</p>
              <b>Explore {product.title} →</b>
            </a>
          ))}
        </div>
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
                <div className="hmw-product-card-top">
                  <small>{product.code}</small>
                  <span>{product.status}</span>
                </div>
                <h3>{product.title}</h3>
                <p>{product.text}</p>
                <b>View product →</b>
              </a>
            ))}
          </div>
        </section>
      ))}

      <section className="hmw-product-catalog-cta">
        <div>
          <span>NEED SOMETHING BIGGER?</span>
          <h2>We can size the infrastructure around the workload.</h2>
          <p>
            For high-traffic ecommerce, managed cloud, AWS, Google Cloud, VPS, Magento, larger migrations, or mixed
            infrastructure projects, tell us what you are running and what you expect it to do.
          </p>
        </div>
        <a className="hmw-button" href="/support">Talk through the project</a>
      </section>
    </SiteFrame>
  );
}
