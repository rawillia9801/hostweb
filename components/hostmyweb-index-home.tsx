import { DomainSearch } from "@/components/domain-search";
import { SiteFrame } from "@/components/hostmyweb-site-chrome";
import { HOSTING_PLAN_SLUGS, HOSTING_PLANS } from "@/lib/hosting-plans";

const included = [
  { icon: "◈", title: "Free standard migration", text: "Move a supported existing website to HostMyWeb without adding a migration charge." },
  { icon: "⌁", title: "SSL + global CDN", text: "HTTPS and global content delivery are included with shared hosting." },
  { icon: "↗", title: "SSH + Git access", text: "Developer tools are available across the shared-hosting family." },
  { icon: "✦", title: "Backups + security", text: "Hosting includes backup and security tooling for day-to-day website operation." },
  { icon: "@", title: "Business email", text: "Every shared plan includes professional mailboxes with 10 GB per mailbox." },
  { icon: "∞", title: "Unlimited bandwidth", text: "Shared plans do not meter normal website traffic by a monthly bandwidth allowance." },
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
          <span className="hmw-storefront-kicker">WEB HOSTING FOR SMALL BUSINESS, CREATORS & GROWING SITES</span>
          <h1>Web hosting that stays <em>straightforward.</em></h1>
          <p>Fast shared-cloud hosting with domains, business email, SSL, backups, developer tools, migration help, and a clear path to Managed Cloud or VPS when you outgrow shared hosting.</p>
          <div className="hmw-hero-checks">
            <span>✓ No promotional renewal jump</span>
            <span>✓ Unlimited bandwidth</span>
            <span>✓ SSL + global CDN included</span>
            <span>✓ SSH + Git available</span>
          </div>
          <div className="hmw-actions hmw-storefront-actions">
            <a className="hmw-button" href="/hosting/shared">View Hosting Plans</a>
            <a className="hmw-button secondary" href="/domains">Find a Domain</a>
          </div>
          <small className="hmw-hero-fineprint">Monthly billing. No multi-year prepayment required to receive the advertised shared-hosting rate.</small>
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
        <div><b>$0</b><span>renewal-price jump</span></div>
        <div><b>4</b><span>shared hosting plans</span></div>
        <div><b>10–100 GB</b><span>published SSD webspace</span></div>
        <div><b>Cloud + VPS</b><span>upgrade path</span></div>
      </section>

      <section className="hmw-section hmw-plans-home" id="plans">
        <div className="hmw-section-head hmw-centered-head">
          <div>
            <span className="hmw-storefront-kicker">WEB HOSTING PLANS</span>
            <h2>Pick a plan. Know the price now and later.</h2>
            <p>Every shared plan publishes the website, SSD storage, mailbox, and database limits before you buy.</p>
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
          <h2>Find the name for your next website.</h2>
          <p>Search live availability, see registration pricing before checkout, and keep hosting and domain management together when that makes sense for you.</p>
          <div className="hmw-domain-prices"><span><b>.com</b> $17.99/yr</span><span><b>.org</b> $17.99/yr</span><span><b>.net</b> $19.99/yr</span><span><b>.us</b> $14.99/yr</span></div>
        </div>
        <div className="hmw-domain-home-search"><DomainSearch /></div>
      </section>

      <section className="hmw-section hmw-included-home">
        <div className="hmw-section-head hmw-centered-head"><div><span className="hmw-storefront-kicker">INCLUDED WITH HOSTING</span><h2>The things a web host should actually provide.</h2><p>Hosting is more than disk space. These are the everyday tools that keep a site running, secure, movable, and manageable.</p></div></div>
        <div className="hmw-included-grid">
          {included.map((item) => <article key={item.title}><span>{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}
        </div>
      </section>

      <section className="hmw-migration-band">
        <div>
          <span className="hmw-storefront-kicker light">MOVING FROM ANOTHER HOST?</span>
          <h2>Bring your website with you.</h2>
          <p>Standard supported website migrations are included. Complex or unusual configurations that require hands-on reconstruction can be quoted separately before work begins.</p>
        </div>
        <a className="hmw-button" href="/websites/migration">See Migration Options</a>
      </section>

      <section className="hmw-section hmw-scale-home">
        <div className="hmw-section-head"><div><span className="hmw-storefront-kicker">HOSTING THAT CAN GROW WITH YOU</span><h2>Start shared. Move up when the workload changes.</h2><p>You should not have to leave your hosting company just because your website or application grows.</p></div><a className="hmw-text-link" href="/hosting">Compare hosting types →</a></div>
        <div className="hmw-scale-cards-home">
          <article><small>01</small><h3>Shared Cloud Hosting</h3><p>For business websites, WordPress, portfolios, blogs, and normal ecommerce workloads.</p><b>From $7.99/mo</b><a href="/hosting/shared">View shared hosting →</a></article>
          <article><small>02</small><h3>Managed Cloud</h3><p>Dedicated cloud resources for higher traffic, larger ecommerce, and workloads needing more isolation.</p><b>Configured to order</b><a href="/hosting/cloud">Explore managed cloud →</a></article>
          <article><small>03</small><h3>VPS Hosting</h3><p>Private virtual-server resources for custom applications, software stacks, and server-level control.</p><b>Configured to order</b><a href="/hosting/vps">Explore VPS hosting →</a></article>
        </div>
      </section>

      <section className="hmw-bottom-cta">
        <div><span>READY TO GET ONLINE?</span><h2>Hosting starts at $7.99/month.</h2><p>Choose a shared plan, search for a domain, or ask for help selecting the right setup.</p></div>
        <div className="hmw-actions"><a className="hmw-button" href="/hosting/shared">Choose Hosting</a><a className="hmw-button secondary" href="/support">Talk to HostMyWeb</a></div>
      </section>
    </SiteFrame>
  );
}
