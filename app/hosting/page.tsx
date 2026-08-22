import type { Metadata } from "next";
import { ProductHero, SiteFrame } from "@/components/hostmyweb-site-chrome";

export const metadata: Metadata = { title: "Web Hosting", description: "Compare HostMyWeb shared cloud, managed WordPress, managed cloud, and VPS hosting options." };

const options = [
  { title: "Shared Cloud Hosting", text: "For most business websites, WordPress sites, portfolios, service businesses, and normal ecommerce workloads.", meta: "From $7.99/mo", href: "/hosting/shared" },
  { title: "Managed WordPress", text: "WordPress-focused hosting with common management, security, backup, and publishing workflows together.", meta: "From $9.99/mo", href: "/hosting/wordpress" },
  { title: "Managed Cloud", text: "Dedicated cloud resources for higher-traffic websites, ecommerce, larger databases, and heavier workloads.", meta: "Configured to order", href: "/hosting/cloud" },
  { title: "VPS Hosting", text: "Virtual private servers for developers and applications that require broader operating-system and software control.", meta: "Configured to order", href: "/hosting/vps" },
] as const;

export default function HostingIndexPage() {
  return <SiteFrame><ProductHero eyebrow="Hosting" title="Hosting for the workload" accent="you actually have." description="Start with managed shared cloud hosting when that fits. Move into managed cloud or VPS only when the application genuinely needs dedicated resources or server-level control."><div className="hmw-subnav"><a href="/hosting/shared">Shared Cloud</a><a href="/hosting/wordpress">WordPress</a><a href="/hosting/cloud">Managed Cloud</a><a href="/hosting/vps">VPS</a></div></ProductHero><section className="hmw-product-shell"><div className="hmw-index-grid">{options.map((item) => <a className="hmw-index-link" href={item.href} key={item.title}><div><small>{item.meta}</small><h3>{item.title}</h3><p>{item.text}</p></div><span>→</span></a>)}</div></section><section className="hmw-section dark"><div className="hmw-section-head"><div><span className="hmw-eyebrow"><i /> SCALE PATH</span><h2>Shared Cloud → Managed Cloud → VPS</h2><p>HostMyWeb does not force every customer into the most expensive environment. Each hosting type has a job. The site explains those jobs separately instead of piling every configuration onto one sales page.</p></div></div><div className="hmw-proof-grid"><article><small>01</small><b>Shared Cloud</b><p>Managed, autoscaling website hosting with published plan quotas.</p></article><article><small>02</small><b>Managed WordPress</b><p>A WordPress-focused operating path for customers who want that workflow.</p></article><article><small>03</small><b>Managed Cloud</b><p>Dedicated cloud capacity with managed infrastructure controls.</p></article><article><small>04</small><b>VPS</b><p>Server-level flexibility for custom applications and software stacks.</p></article></div></section></SiteFrame>;
}
