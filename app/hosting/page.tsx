import type { Metadata } from "next";
import { ProductHero, SiteFrame } from "@/components/hostmyweb-site-chrome";

export const metadata: Metadata = { title: "Web Hosting", description: "Compare HostMyWeb shared cloud, managed WordPress, WooCommerce, managed cloud, and VPS hosting options." };

const options = [
  { title: "Shared Cloud Hosting", text: "Affordable hosting for business websites, portfolios, blogs, and everyday web projects.", meta: "From $7.99/mo", href: "/hosting/shared" },
  { title: "Managed WordPress", text: "WordPress hosting with staging, backups, security, CDN, and management tools included.", meta: "WordPress ready", href: "/hosting/wordpress" },
  { title: "WooCommerce Hosting", text: "Hosting for online stores that need stronger performance, recovery, and room to grow.", meta: "For online stores", href: "/hosting/woocommerce" },
  { title: "Managed Cloud", text: "Dedicated cloud resources for high-traffic websites, larger stores, databases, and applications.", meta: "Custom cloud plans", href: "/hosting/cloud" },
  { title: "VPS Hosting", text: "Private virtual servers for developers, applications, APIs, and custom software stacks.", meta: "VPS plans", href: "/hosting/vps" },
] as const;

export default function HostingIndexPage() {
  return <SiteFrame><ProductHero eyebrow="Hosting" title="Choose the hosting that" accent="fits your website." description="Start with shared hosting for most websites, choose WordPress or WooCommerce for application-focused hosting, or move to Managed Cloud and VPS when you need dedicated resources or more server control."><div className="hmw-subnav"><a href="/hosting/shared">Shared Cloud</a><a href="/hosting/wordpress">WordPress</a><a href="/hosting/woocommerce">WooCommerce</a><a href="/hosting/cloud">Managed Cloud</a><a href="/hosting/vps">VPS</a></div></ProductHero><section className="hmw-product-shell"><div className="hmw-index-grid">{options.map((item) => <a className="hmw-index-link" href={item.href} key={item.title}><div><small>{item.meta}</small><h3>{item.title}</h3><p>{item.text}</p></div><span>→</span></a>)}</div></section><section className="hmw-section dark"><div className="hmw-section-head"><div><span className="hmw-eyebrow"><i /> HOSTING OPTIONS</span><h2>Start simple. Upgrade when you need more.</h2><p>Most websites can begin on shared hosting. WordPress and WooCommerce plans add tools for those platforms, while Managed Cloud and VPS provide more power and control for demanding workloads.</p></div><a className="hmw-button secondary" href="/products">Browse all products</a></div><div className="hmw-proof-grid"><article><small>01</small><b>Shared Cloud</b><p>Fast, managed hosting for most websites and small businesses.</p></article><article><small>02</small><b>WordPress & Stores</b><p>Hosting tailored to WordPress publishing and WooCommerce stores.</p></article><article><small>03</small><b>Managed Cloud</b><p>Dedicated cloud resources with managed hosting support.</p></article><article><small>04</small><b>VPS</b><p>Private server resources for custom applications and software.</p></article></div></section></SiteFrame>;
}
