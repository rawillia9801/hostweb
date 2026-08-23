import { DomainSearch } from "@/components/domain-search";
import { SiteFrame } from "@/components/hostmyweb-site-chrome";
import { HOSTING_PLAN_SLUGS, HOSTING_PLANS } from "@/lib/hosting-plans";

const included = [
  { icon: "↗", title: "Standard migration included", text: "Move a supported existing website to HostMyWeb without adding a standard migration charge." },
  { icon: "◆", title: "SSL + global CDN", text: "HTTPS and global content delivery are included with shared hosting." },
  { icon: "⌘", title: "SSH + Git access", text: "Developer tools are available across the shared-hosting family." },
  { icon: "✦", title: "Backups + security", text: "Backup, restore, malware scanning, WAF, and DDoS protection tools help keep sites protected." },
  { icon: "@", title: "Business email", text: "Shared plans include professional mailboxes with 10 GB of storage per mailbox." },
  { icon: "∞", title: "Unlimited bandwidth", text: "Shared plans do not meter normal website traffic against a monthly bandwidth allowance." },
] as const;

const moreProducts = [
  { code: "WP", title: "Managed WordPress", text: "WordPress-focused hosting with staging, management, backup, and developer workflows.", href: "/hosting/wordpress" },
  { code: "FAST", title: "Website Turbo", text: "Performance acceleration for demanding or traffic-sensitive websites.", href: "/products#performance" },
  { code: "SSL", title: "Premium SSL", text: "Optional certificate products for businesses that need more than standard included HTTPS.", href: "/products#performance" },
  { code: "BK", title: "Timeline Backups Pro", text: "Extended snapshot-style recovery for customers who want a deeper backup history.", href: "/products#performance" },
  { code: "MAIL", title: "Mailbox Upgrades", text: "Increase email capacity without forcing the website onto a larger hosting plan.", href: "/products#domains-email" },
  { code: "CLD", title: "Managed Cloud", text: "Dedicated managed cloud resources for larger ecommerce, traffic, data, and application workloads.", href: "/hosting/cloud" },
  { code: "VPS", title: "VPS Hosting", text: "Private virtual-server resources for custom applications and server-level control.", href: "/hosting/vps" },
  { code: "HELP", title: "Website Care & Setup", text: "Migration, setup, recovery, maintenance, and custom infrastructure help when you need a human hand.", href: "/products#websites" },
] as const;

const trustPoints = [
  { title: "Price Lock", text: "No promotional renewal jump on the base shared-hosting rate." },
  { title: "SSL + CDN", text: "Core security and global delivery are included." },
  { title: "Migration", text: "Standard supported website migration is included." },
  { title: "Room to grow", text: "Move from shared hosting to Managed Cloud or VPS when needed." },
] as const;

export function HostMyWebIndexHome() {
  const starter = HOSTING_PLANS.starter;

  return (
    <SiteFrame>
      <div className="hmw-promo-bar hmw-home-promo">
        <span>HOSTMYWEB PRICE LOCK</span>
        <b>Shared hosting from $7.99/mo with the same base rate at renewal.</b>
        <a href="/hosting/shared">See plans →</a>
      </div>

      <section className="hmw-home-hero">
        <div className="hmw-home-hero-inner">
          <div className="hmw-home-hero-copy">
            <span className="hmw-home-kicker">DOMAINS · HOSTING · EMAIL · WORDPRESS · CLOUD</span>
            <h1>Find your domain.<br /><em>Build something worth visiting.</em></h1>
            <p>Search your name first, then put it online with fast shared-cloud hosting, business email, WordPress tools, SSL, backups, security, and a clear path to cloud or VPS hosting as you grow.</p>
          </div>

          <div className="hmw-home-domain-panel" aria-label="Search for a domain name">
            <div className="hmw-home-domain-heading">
              <div><span>START HERE</span><h2>What should your website be called?</h2></div>
              <a href="/domains">Domain pricing →</a>
            </div>
            <div className="hmw-home-domain-search"><DomainSearch /></div>
            <div className="hmw-home-domain-prices" aria-label="Popular domain prices">
              <span><b>.com</b><strong>$17.99/yr</strong></span><span><b>.org</b><strong>$17.99/yr</strong></span><span><b>.net</b><strong>$19.99/yr</strong></span><span><b>.us</b><strong>$14.99/yr</strong></span>
            </div>
          </div>

          <div className="hmw-home-hero-actions"><a className="hmw-home-primary" href="/hosting/shared">Explore Hosting Plans</a><a className="hmw-home-secondary" href="/products">Browse Products & Services</a></div>
        </div>
      </section>

      <section className="hmw-home-trust" aria-label="Why choose HostMyWeb">{trustPoints.map((point,index)=><article key={point.title}><span>{String(index+1).padStart(2,"0")}</span><div><b>{point.title}</b><p>{point.text}</p></div></article>)}</section>

      <section className="hmw-home-offer-section">
        <div className="hmw-home-offer-copy"><span className="hmw-storefront-kicker">START SIMPLE</span><h2>A real hosting plan at a normal monthly price.</h2><p>Starter gives a business, portfolio, blog, or personal site the essentials without requiring years of prepayment to unlock the advertised rate.</p><div className="hmw-home-offer-checks"><span>✓ {starter.webspaceGb} GB SSD webspace</span><span>✓ {starter.mailboxes} business mailboxes</span><span>✓ {starter.databases} MySQL databases</span><span>✓ Unlimited bandwidth</span><span>✓ SSL + global CDN</span><span>✓ Backups + security tools</span></div></div>
        <aside className="hmw-home-offer-card" aria-label="Starter hosting offer"><div className="hmw-home-offer-top"><span>STARTER</span><b>PRICE LOCKED</b></div><div className="hmw-home-offer-price"><sup>$</sup>{starter.monthlyPrice.toFixed(2)}<span>/month</span></div><p>Same base monthly rate at renewal while the same plan remains continuously active.</p><a href="/signup?plan=starter">Get Starter Hosting <span>→</span></a><small>No multi-year prepayment required.</small></aside>
      </section>

      <section className="hmw-section hmw-plans-home" id="plans">
        <div className="hmw-section-head hmw-centered-head"><div><span className="hmw-storefront-kicker">SHARED CLOUD HOSTING</span><h2>Choose the space your website needs.</h2><p>Every plan clearly lists websites, SSD storage, mailboxes, databases, bandwidth, and included tools before checkout.</p></div></div>
        <div className="hmw-plan-grid-real hmw-home-plan-grid">{HOSTING_PLAN_SLUGS.map((slug)=>{const plan=HOSTING_PLANS[slug];return <article className={slug==="business"?"hmw-plan-real featured hmw-home-plan":"hmw-plan-real hmw-home-plan"} key={slug}>{slug==="business"&&<div className="hmw-plan-badge">MOST POPULAR</div>}<small className="hmw-home-plan-code">{plan.code}</small><h3>{plan.name}</h3><p className="hmw-plan-for">{slug==="starter"?"One business or personal website":slug==="business"?"Growing businesses and multiple sites":slug==="pro"?"Larger projects and multi-site owners":"Agencies and larger site portfolios"}</p><div className="hmw-plan-price-real">${plan.monthlyPrice.toFixed(2)}<span>/mo</span></div><small className="hmw-same-renewal">Same base rate at renewal</small><ul><li>{plan.websites===1?"1 website":`Up to ${plan.websites} websites`}</li><li>{plan.webspaceGb} GB SSD webspace</li><li>{plan.mailboxes} mailboxes × {plan.mailboxStorageGb} GB</li><li>{plan.databases} MySQL databases</li><li>Unlimited bandwidth</li><li>SSL + global CDN</li><li>SSH + Git available</li></ul><a className="hmw-button" href={`/signup?plan=${slug}`}>Choose {plan.name}</a></article>})}</div>
      </section>

      <section className="hmw-home-product-section"><div className="hmw-home-section-heading"><div><span className="hmw-storefront-kicker">MORE THAN HOSTING</span><h2>Everything around your website can live here too.</h2><p>Domains, email, WordPress, performance, recovery, cloud resources, VPS hosting, and hands-on website help are available from the same account.</p></div><a href="/products">View the full catalog →</a></div><div className="hmw-home-product-grid">{moreProducts.map((product)=><a href={product.href} key={product.title}><span>{product.code}</span><h3>{product.title}</h3><p>{product.text}</p><b>Explore <i>→</i></b></a>)}</div></section>

      <section className="hmw-section hmw-included-home"><div className="hmw-section-head hmw-centered-head"><div><span className="hmw-storefront-kicker">INCLUDED WITH HOSTING</span><h2>The everyday tools your website needs.</h2><p>Security, delivery, backups, developer access, email, and migration support are built into the hosting experience.</p></div></div><div className="hmw-included-grid">{included.map((item)=><article key={item.title}><span>{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></section>

      <section className="hmw-home-migration-band"><div><span>MOVING FROM ANOTHER HOST?</span><h2>Bring your website with you.</h2><p>Standard supported migrations are included. If a move needs custom hands-on work, you can see the scope and price before that work begins.</p></div><a href="/websites/migration">See Migration Options →</a></section>

      <section className="hmw-home-scale-section"><div className="hmw-home-section-heading"><div><span className="hmw-storefront-kicker">GROW WITHOUT MOVING AWAY</span><h2>Start where you are. Scale when you need to.</h2><p>Most websites are a great fit for shared hosting. Larger workloads can move into dedicated cloud resources or a VPS without changing providers.</p></div><a href="/hosting">Compare hosting types →</a></div><div className="hmw-home-scale-grid"><article><small>01</small><h3>Shared Cloud</h3><p>For business websites, WordPress, portfolios, blogs, and normal ecommerce workloads.</p><b>From $7.99/mo</b><a href="/hosting/shared">View shared hosting →</a></article><article><small>02</small><h3>Managed Cloud</h3><p>Dedicated managed resources for higher traffic, larger ecommerce, and more demanding applications.</p><b>Custom plans</b><a href="/hosting/cloud">Explore managed cloud →</a></article><article><small>03</small><h3>VPS Hosting</h3><p>Private virtual-server resources for custom software, specialized stacks, and server-level control.</p><b>Custom plans</b><a href="/hosting/vps">Explore VPS hosting →</a></article></div></section>

      <section className="hmw-home-bottom-cta"><div><span>READY WHEN YOU ARE</span><h2>Find the name. Choose the plan. Put it online.</h2><p>Start with a domain search or go directly to hosting plans and build from there.</p></div><div><a className="hmw-home-primary" href="/domains">Search Domains</a><a className="hmw-home-secondary light" href="/hosting/shared">View Hosting</a></div></section>
    </SiteFrame>
  );
}
