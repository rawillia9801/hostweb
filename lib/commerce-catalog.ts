export type CatalogProduct = {
  id: string;
  category: "shared" | "wordpress" | "woocommerce" | "vps" | "cloud" | "email" | "addon";
  name: string;
  description: string;
  priceLabel: string;
  monthlyPrice?: number;
  setupPrice?: number;
  features: string[];
  href: string;
  badge?: string;
};

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "shared-starter",
    category: "shared",
    name: "Starter",
    description: "A clean entry plan for a single business or personal website.",
    priceLabel: "$7.99/mo",
    monthlyPrice: 7.99,
    features: ["1 website", "10 GB SSD webspace", "5 mailboxes", "5 MySQL databases", "SSL + CDN", "Backups", "SSH + Git"],
    href: "/signup?plan=starter",
  },
  {
    id: "shared-business",
    category: "shared",
    name: "Business",
    description: "Our recommended shared plan for growing businesses and multi-site customers.",
    priceLabel: "$12.99/mo",
    monthlyPrice: 12.99,
    features: ["Up to 5 websites", "25 GB SSD webspace", "25 mailboxes", "25 MySQL databases", "SSL + CDN", "Backups", "SSH + Git"],
    href: "/signup?plan=business",
    badge: "Most popular",
  },
  {
    id: "shared-pro",
    category: "shared",
    name: "Pro",
    description: "Higher-capacity shared hosting for developers, stores, and larger site portfolios.",
    priceLabel: "$21.99/mo",
    monthlyPrice: 21.99,
    features: ["Up to 15 websites", "50 GB SSD webspace", "50 mailboxes", "50 MySQL databases", "SSL + CDN", "Backups", "SSH + Git"],
    href: "/signup?plan=pro",
  },
  {
    id: "shared-agency",
    category: "shared",
    name: "Agency",
    description: "Commercial shared-hosting limits for agencies managing a larger customer portfolio.",
    priceLabel: "$39.99/mo",
    monthlyPrice: 39.99,
    features: ["Up to 30 websites", "100 GB SSD webspace", "100 mailboxes", "100 MySQL databases", "SSL + CDN", "Backups", "SSH + Git"],
    href: "/signup?plan=agency",
  },
  {
    id: "wp-starter",
    category: "wordpress",
    name: "WordPress Starter",
    description: "Managed WordPress hosting for a single site with staging, backups, security, and CDN.",
    priceLabel: "$9.99/mo",
    monthlyPrice: 9.99,
    features: ["1 WordPress site", "Staging", "Managed updates", "SSL + CDN", "Backups", "Malware protection"],
    href: "/signup?product=wp-starter",
  },
  {
    id: "wp-business",
    category: "wordpress",
    name: "WordPress Business",
    description: "Managed WordPress for businesses that need more sites, storage, and operational headroom.",
    priceLabel: "$17.99/mo",
    monthlyPrice: 17.99,
    features: ["Up to 5 WordPress sites", "Staging", "Managed updates", "SSL + CDN", "Backups", "Developer tools"],
    href: "/signup?product=wp-business",
    badge: "Recommended",
  },
  {
    id: "wp-pro",
    category: "wordpress",
    name: "WordPress Pro",
    description: "A larger managed WordPress tier for agencies, publishers, and demanding business sites.",
    priceLabel: "$29.99/mo",
    monthlyPrice: 29.99,
    features: ["Up to 15 WordPress sites", "Staging", "Managed updates", "SSL + CDN", "Backups", "Priority support"],
    href: "/signup?product=wp-pro",
  },
  {
    id: "woo-store",
    category: "woocommerce",
    name: "WooCommerce Store",
    description: "Managed WordPress commerce hosting for small and growing online stores.",
    priceLabel: "$24.99/mo",
    monthlyPrice: 24.99,
    features: ["1 WooCommerce store", "Staging", "SSL + CDN", "Backups", "Security tools", "Performance tuning"],
    href: "/signup?product=woo-store",
  },
  {
    id: "woo-store-pro",
    category: "woocommerce",
    name: "WooCommerce Store Pro",
    description: "More headroom and support for established stores with heavier traffic or catalog workloads.",
    priceLabel: "$39.99/mo",
    monthlyPrice: 39.99,
    features: ["1 high-traffic store", "Staging", "SSL + CDN", "Backups", "Priority support", "Performance add-ons available"],
    href: "/signup?product=woo-store-pro",
  },
  {
    id: "vps-1",
    category: "vps",
    name: "VPS 1",
    description: "Entry virtual server for APIs, workers, development environments, and custom stacks.",
    priceLabel: "From $19.99/mo",
    monthlyPrice: 19.99,
    features: ["1 vCPU class", "Private server resources", "Root-level control", "Custom software stack", "Upgrade path available"],
    href: "/signup?product=vps-1",
  },
  {
    id: "vps-2",
    category: "vps",
    name: "VPS 2",
    description: "A balanced virtual server tier for production applications and busier workloads.",
    priceLabel: "From $29.99/mo",
    monthlyPrice: 29.99,
    features: ["2 vCPU class", "Private server resources", "Root-level control", "Custom software stack", "Upgrade path available"],
    href: "/signup?product=vps-2",
    badge: "Best value",
  },
  {
    id: "vps-4",
    category: "vps",
    name: "VPS 4",
    description: "Higher-capacity virtual server hosting for larger applications and services.",
    priceLabel: "From $49.99/mo",
    monthlyPrice: 49.99,
    features: ["4 vCPU class", "Private server resources", "Root-level control", "Custom software stack", "Upgrade path available"],
    href: "/signup?product=vps-4",
  },
  {
    id: "cloud-managed",
    category: "cloud",
    name: "Managed Cloud",
    description: "Dedicated managed cloud resources sized to the application instead of forcing it into shared hosting.",
    priceLabel: "Custom configuration",
    features: ["20iCloud / AWS / GCP options", "Managed platform", "Dedicated resources", "WordPress / PHP / Magento options", "Redis / Elasticsearch options"],
    href: "/hosting/cloud",
  },
  {
    id: "business-email",
    category: "email",
    name: "Business Email",
    description: "Professional domain email sold independently from website hosting.",
    priceLabel: "From $2.99/mailbox/mo",
    monthlyPrice: 2.99,
    features: ["Custom-domain mailbox", "Webmail", "Spam filtering", "Independent from website storage", "Storage upgrades available"],
    href: "/signup?product=business-email",
  },
  {
    id: "website-turbo",
    category: "addon",
    name: "Website Turbo",
    description: "Optional performance uplift for websites that need additional compute and speed.",
    priceLabel: "From $7.99/mo",
    monthlyPrice: 7.99,
    features: ["Performance add-on", "Faster dynamic workloads", "Pairs with qualifying hosting"],
    href: "/products/website-turbo",
  },
  {
    id: "timeline-backups",
    category: "addon",
    name: "Timeline Backups Pro",
    description: "Extended recovery history for customers who want deeper restore coverage.",
    priceLabel: "Optional add-on",
    features: ["Extended restore history", "Snapshot-style recovery", "Pairs with qualifying hosting"],
    href: "/products/timeline-backups",
  },
  {
    id: "premium-ssl",
    category: "addon",
    name: "Premium SSL",
    description: "Paid certificate options for customers that need more than the included SSL layer.",
    priceLabel: "Optional add-on",
    features: ["Paid certificate options", "Standard SSL remains included with hosting"],
    href: "/products/premium-ssl",
  },
];

export const PRODUCT_BY_ID = Object.fromEntries(CATALOG_PRODUCTS.map((product) => [product.id, product])) as Record<string, CatalogProduct>;

export function getCatalogProduct(id: string | null | undefined) {
  return id ? PRODUCT_BY_ID[id] ?? null : null;
}

export function getConfiguredProductCheckoutUrl(productId: string) {
  const envKey = `HOSTMYWEB_PRODUCT_${productId.toUpperCase().replace(/-/g, "_")}_URL`;
  return process.env[envKey]?.trim() || null;
}
