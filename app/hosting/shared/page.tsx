import type { Metadata } from "next";
import { ProductHero, SiteFrame } from "@/components/hostmyweb-site-chrome";
import { HOSTING_PLAN_SLUGS, HOSTING_PLANS } from "@/lib/hosting-plans";

export const metadata: Metadata = { title: "Shared Cloud Hosting", description: "HostMyWeb shared cloud hosting plans with published SSD, website, mailbox, database, SSH, Git, SSL, CDN, backup and migration entitlements." };

const rows = [
  ["Monthly base price", "$7.99", "$12.99", "$21.99", "$39.99"],
  ["Renewal base price", "$7.99", "$12.99", "$21.99", "$39.99"],
  ["Websites", "1", "5", "15", "30"],
  ["SSD webspace", "10 GB", "25 GB", "50 GB", "100 GB"],
  ["Bandwidth", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
  ["Business mailboxes", "5", "25", "50", "100"],
  ["Mailbox storage", "10 GB each", "10 GB each", "10 GB each", "10 GB each"],
  ["MySQL databases", "5", "25", "50", "100"],
  ["Standard SSL", "Included", "Included", "Included", "Included"],
  ["Global CDN", "Included", "Included", "Included", "Included"],
  ["Backups", "Included", "Included", "Included", "Included"],
  ["Security tools", "Included", "Included", "Included", "Included"],
  ["SSH access", "Available", "Available", "Available", "Available"],
  ["Git workflows", "Available", "Available", "Available", "Available"],
  ["Standard migration", "Included", "Included", "Included", "Included"],
] as const;

const common = [
  ["Autoscaling cloud platform", "Shared hosting runs on a load-balanced cloud hosting layer rather than pinning every customer to one traditional shared server."],
  ["Developer-friendly shared hosting", "SSH and Git are available across the shared-hosting family instead of being artificially reserved for the highest plan."],
  ["Standard migration included", "Eligible website and database migrations use the supported standard migration path without a separate migration charge."],
  ["Global content delivery", "SSL and global CDN capability are part of the normal hosted website stack."],
  ["Clear upgrade path", "Managed Cloud and VPS products are available when a project genuinely needs dedicated resources or server-level control."],
  ["No forced multi-year prepayment", "The advertised shared-hosting base rate does not require a 12-, 24-, 36- or 48-month prepayment."],
] as const;

export default function SharedHostingPage() {
  return (
    <SiteFrame>
      <ProductHero eyebrow="Hosting / Shared Cloud" title="Straightforward web hosting with" accent="published limits." description="Choose from four shared-cloud plans with visible storage, website, mailbox and database allocations — plus SSL, CDN, backups, SSH, Git and supported migration.">
        <div className="hmw-actions"><a className="hmw-button" href="#plans">See Plans</a><a className="hmw-button secondary" href="#compare">Compare Features</a></div>
      </ProductHero>

      <section id="plans" className="hmw-product-shell">
        <div className="hmw-section-head"><div><span className="hmw-storefront-kicker">SHARED CLOUD PLANS</span><h2>Four plans. Same pricing philosophy.</h2><p>The base monthly rate shown is also the base renewal rate while the same plan remains continuously active.</p></div></div>
        <div className="hmw-plan-grid-real">{HOSTING_PLAN_SLUGS.map((slug) => { const plan = HOSTING_PLANS[slug]; return <article className={slug === "business" ? "hmw-plan-real featured" : "hmw-plan-real"} key={slug}><small>{slug === "business" ? "MOST POPULAR" : "PRICE LOCK"}</small><h3>{plan.name}</h3><div className="hmw-plan-price-real">${plan.monthlyPrice.toFixed(2)}<span>/mo</span></div><p className="hmw-same-renewal">Renews at the same ${plan.monthlyPrice.toFixed(2)}/mo base rate</p><ul><li>{plan.websites === 1 ? "1 website" : `Up to ${plan.websites} websites`}</li><li>{plan.webspaceGb} GB SSD webspace</li><li>Unlimited bandwidth</li><li>{plan.mailboxes} mailboxes × {plan.mailboxStorageGb} GB</li><li>{plan.databases} MySQL databases</li><li>SSH + Git available</li><li>SSL + global CDN</li><li>Backups + security tools</li><li>Supported standard migration</li></ul><a className="hmw-button" href={`/signup?plan=${slug}`}>Choose {plan.name}</a></article>; })}</div>
      </section>

      <section id="compare" className="hmw-section alt">
        <div className="hmw-section-head"><div><span className="hmw-storefront-kicker">FULL PLAN COMPARISON</span><h2>Compare the details before checkout.</h2><p>No vague plan names standing in for the resources that actually vary.</p></div></div>
        <div className="hmw-v2-table-scroll"><table className="hmw-v2-compare"><thead><tr><th>Feature</th><th>Starter</th><th>Business</th><th>Pro</th><th>Agency</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell}>{cell}</th> : <td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>
      </section>

      <section className="hmw-section">
        <div className="hmw-section-head"><div><span className="hmw-storefront-kicker">INCLUDED ACROSS THE FAMILY</span><h2>Hosting tools that should not require detective work.</h2><p>These capabilities explain what HostMyWeb means by shared cloud hosting and where the product boundary sits.</p></div></div>
        <div className="hmw-feature-list">{common.map(([title,text]) => <article key={title}><small>INCLUDED</small><b>{title}</b><p>{text}</p></article>)}</div>
      </section>

      <section className="hmw-v2-migration"><div><span>ALREADY HAVE A WEBSITE?</span><h2>Move it instead of rebuilding it.</h2><p>Supported standard migrations are included with hosting. Complex or unusual migrations that need hands-on reconstruction can be quoted separately before work begins.</p></div><div><a href="/websites/migration">Migration options</a><a href="/support">Ask about your site</a></div></section>
    </SiteFrame>
  );
}
