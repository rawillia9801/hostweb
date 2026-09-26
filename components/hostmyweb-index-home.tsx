import { DomainSearch } from "@/components/domain-search";
import { SiteFrame } from "@/components/hostmyweb-site-chrome";
import { HOSTING_PLAN_SLUGS, HOSTING_PLANS } from "@/lib/hosting-plans";

const included = [
  { icon: "◈", title: "Free standard migration", text: "Move a supported existing website to HostMyWeb without adding a migration charge." },
  { icon: "⌁", title: "SSL + global CDN", text: "HTTPS and global content delivery are included with shared hosting." },
  { icon: "↗", title: "SSH + Git access", text: "Developer tools are available across the shared-hosting family." },
  { icon: "✦", title: "Backups + security", text: "Hosting includes backup and security tools for everyday website protection and recovery." },
  { icon: "@", title: "Business email", text: "Every shared plan includes professional mailboxes with 10 GB per mailbox." },
  { icon: "∞", title: "Unlimited bandwidth", text: "Shared plans do not meter normal website traffic with a monthly bandwidth allowance." },
] as const;

const moreProducts = [
  { code: "WORDPRESS", title: "Managed WordPress", text: "WordPress hosting with staging, backups, security, and developer tools included.", href: "/hosting/wordpress" },
  { code: "PERFORMANCE", title: "Website Turbo", text: "Extra performance for demanding or traffic-sensitive websites.", href: "/products#addon" },
  { code: "SECURITY", title: "Premium SSL", text: "Optional certificate products for sites that need more than standard included HTTPS.", href: "/products#addon" },
  { code: "RECOVERY", title: "Timeline Backups Pro", text: "Extended recovery options with a deeper backup history.", href: "/products#addon" },
  { code: "EMAIL", title: "Mailbox Storage Upgrades", text: "Add more email capacity without changing your hosting plan.", href: "/products#email" },
  { code: "SERVERS", title: "Managed Cloud", text: "Dedicated managed cloud resources for larger websites, stores, and applications.", href: "/hosting/cloud" },
  { code: "DEVELOPER", title: "VPS Hosting", text: "Private virtual-server resources for custom applications and server-level control.", href: "/hosting/vps" },
  { code: "SERVICES", title: "Website Care & Setup", text: "Migration, setup, recovery, maintenance, and hands-on website help.", href: "/products" },
] as const;

export function HostMyWebIndexHome() {
  const starter = HOSTING_PLANS.starter;

  return (
    <SiteFrame>
      <div className="hmw-promo-bar">
        <span>HOSTMYWEB PRICE LOCK</span>
        <b>Hosting from $7.99/mo — same base price at renewal.</b>
        <a href="/hosting/shared">See plans →</a>
      </div>

      <section className="hmw-storefront-hero">
        <div className="hmw-storefront-copy">
          <span className="hmw-storefront-kicker">WEB HOSTING, DOMAINS, EMAIL & WEBSITE SERVICES</span>
          <h1>Reliable web hosting without <em>surprise renewal prices.</em></h1>
          <p>Launch your website with hosting from $7.99 per month. SSL, CDN, backups, business email, and unlimited bandwidth are included, with WordPress, domains, VPS, and managed cloud options available when you need more.</p>
          <div className="hmw-hero-checks">
            <span>✓ Same base hosting price at renewal</span>
            <span>✓ Unlimited bandwidth</span>
            <span>✓ SSL + global CDN included</span>
            <span>✓ Free standard website migration</span>
          </div>
          <div className="hmw-actions hmw-storefront-actions">
            <a className="hmw-button" href="/hosting/shared">View Hosting Plans</a>
            <a className="hmw-button secondary" href="/domains">Search a Domain</a>
          </div>
          <small className="hmw-hero-fineprint">Monthly billing available. No multi-year prepayment required to receive the advertised shared-hosting rate.</small>
        </div>

        <aside className="hmw-hero-offer" aria-label="Starter hosting offer">
          <div className="hmw-offer-topline"><span>STARTER HOSTING</span><b>PRICE LOCK</b></div>
          <div className="hmw-offer-price"><sup>$</sup>{starter.monthlyPrice.toFixed(2)}<span>/month</span></div>
          <p className="hmw-offer-renewal">Renews at <b>${starter.monthlyPrice.toFixed(2)}/mo</b> while the same plan remains continuously active.</p>
          <ul>
            <li><b>{starter.webspaceGb} GB SSD</b> webspace</li>
            <li><b>{starter.websites}</b> website</li>
            <li><b>{starter.mailboxes}</b> business mailboxes</li>
            <li><b>{starter.databases}</b> MySQL databases</li>
            <li><b>Unlimited</b> bandwidth</li>
            <li><b>SSL, CDN, backups</b> included</li>
          </ul>
          <a className="hmw-offer-cta" href="/signup?plan=starter">Get Starter Hosting</a>
          <a className="hmw-offer-link" href="/hosting/shared">Compare all four plans →</a>
        </aside>
      </section>

      <section className="hmw-trust-row" aria-label="HostMyWeb hosting highlights">
        <div><b>$7.99</b><span>hosting from / month</span></div>
        <div><b>Unlimited</b><span>bandwidth on shared plans</span></div>
        <div><b>SSL + CDN</b><span>included with hosting</span></div>
        <div><b>Free</b><span>standard website migration</span></div>
      </section>

      <section className="hmw-section hmw-plans-home" id="plans">
        <div className="hmw-section-head hmw-centered-head">
          <div>
            <span className="hmw-storefront-kicker">WEB HOSTING PLANS</span>
            <h2>Choose a plan that fits your website.</h2>
            <p>Every plan shows exactly how many websites, how much storage, how many mailboxes, and how many databases are included.</p>
          </div>
        </div>
        <div className="hmw-plan-grid-real hmw-home-plan-grid">
          {HOSTING_PLAN_SLUGS.map((slug) => {
            const plan = HOSTING_PLANS[slug];
            return (
              <article className={slug === "business" ? "hmw-plan-real featured hmw-home-plan" : "hmw-plan-real hmw-home-plan"} key={slug}>
                {slug === "business" && <div className="hmw-plan-badge">MOST POPULAR</div>}
                <h3>{plan.name}</h3>
                <p className="hmw-plan-for">{slug === "starter" ? "A single business or personal site" : slug === "business" ? "Small businesses and growing sites" : slug === "pro" ? "Multi-site owners and developers" : "Agencies and larger site portfolios"}</p>
                <div className="hmw-plan-price-real">${plan.monthlyPrice.toFixed(2)}<span>/mo</span></div>
                <small className="hmw-same-renewal">Same base rate at renewal</small>
                <ul>
                  <li>{plan.websites === 1 ? "1 website" : `Up to ${plan.websites} websites`}</li>
                  <li>{plan.webspaceGb} GB SSD webspace</li>
                  <li>{plan.mailboxes} mailboxes × {plan.mailboxStorageGb} GB</li>
                  <li>{plan.databases} MySQL databases</li>
                  <li>Unlimited bandwidth</li>
                  <li>SSL + global CDN</li>
                  <li>SSH + Git available</li>
                </ul>
                <a className="hmw-button" href={`/signup?plan=${slug}`}>Choose {plan.name}</a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="hmw-domain-home">
        <div className="hmw-domain-home-copy">
          <span className="hmw-storefront-kicker">DOMAIN NAMES</span>
          <h2>Find the right domain for your website.</h2>
          <p>Search live availability, compare popular extensions, and see pricing before you register.</p>
          <div className="hmw-domain-prices"><span><b>.com</b> $17.99/yr</span><span><b>.org</b> $17.99/yr</span><span><b>.net</b> $19.99/yr</span><span><b>.us</b> $14.99/yr</span></div>
        </div>
        <div className="hmw-domain-home-search"><DomainSearch /></div>
      </section>

      <section className="hmw-section hmw-included-home">
        <div className="hmw-section-head hmw-centered-head"><div><span className="hmw-storefront-kicker">INCLUDED WITH HOSTING</span><h2>Everything you need to keep your site online.</h2><p>Everyday essentials such as SSL, CDN, backups, email, migration help, and developer access are included across the shared-hosting lineup.</p></div></div>
        <div className="hmw-included-grid">
          {included.map((item) => <article key={item.title}><span>{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}
        </div>
      </section>

      <section className="hmw-section hmw-marketplace-preview">
        <div className="hmw-section-head">
          <div>
            <span className="hmw-storefront-kicker">MORE FROM HOSTMYWEB</span>
            <h2>More hosting and website services when you need them.</h2>
            <p>Choose WordPress hosting, business email, backups, security upgrades, VPS hosting, managed cloud, and website support as your needs grow.</p>
          </div>
          <a className="hmw-text-link" href="/products">Browse all products →</a>
        </div>
        <div className="hmw-marketplace-preview-grid">
          {moreProducts.map((product) => (
            <a className="hmw-marketplace-preview-card" href={product.href} key={product.title}>
              <small>{product.code}</small>
              <h3>{product.title}</h3>
              <p>{product.text}</p>
              <b>Learn more →</b>
            </a>
          ))}
        </div>
      </section>

      <section className="hmw-migration-band">
        <div>
          <span className="hmw-storefront-kicker light">MOVING FROM ANOTHER HOST?</span>
          <h2>Bring your website with you.</h2>
          <p>Standard supported website migrations are included. If your move is unusually complex, we will explain any extra work before it begins.</p>
        </div>
        <a className="hmw-button" href="/websites/migration">See Migration Options</a>
      </section>

      <section className="hmw-section hmw-scale-home">
        <div className="hmw-section-head"><div><span className="hmw-storefront-kicker">HOSTING THAT CAN GROW WITH YOU</span><h2>Start with what you need today.</h2><p>Move to WordPress, managed cloud, or VPS hosting when your website or application needs more power or control.</p></div><a className="hmw-text-link" href="/hosting">Compare hosting types →</a></div>
        <div className="hmw-scale-cards-home">
          <article><small>01</small><h3>Shared Cloud Hosting</h3><p>Fast, affordable hosting for business websites, blogs, portfolios, and everyday ecommerce.</p><b>From $7.99/mo</b><a href="/hosting/shared">View shared hosting →</a></article>
          <article><small>02</small><h3>Managed Cloud</h3><p>Dedicated cloud resources for busier websites, larger stores, and applications that need more capacity.</p><b>Managed dedicated resources</b><a href="/hosting/cloud">Explore managed cloud →</a></article>
          <article><small>03</small><h3>VPS Hosting</h3><p>Private virtual servers for applications, APIs, custom software, and server-level control.</p><b>Flexible VPS options</b><a href="/hosting/vps">Explore VPS hosting →</a></article>
        </div>
      </section>

      <section className="hmw-bottom-cta">
        <div><span>READY TO GET STARTED?</span><h2>Choose hosting or search for your domain.</h2><p>Start with a hosting plan, find a domain name, or contact HostMyWeb if you need help choosing the right service.</p></div>
        <div className="hmw-actions"><a className="hmw-button" href="/hosting/shared">View Hosting Plans</a><a className="hmw-button secondary" href="/domains">Search Domains</a></div>
      </section>
    </SiteFrame>
  );
}
