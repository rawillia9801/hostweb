import { DomainSearch } from "@/components/domain-search";
import { SiteFrame } from "@/components/hostmyweb-site-chrome";
import { HOSTING_PLAN_SLUGS, HOSTING_PLANS } from "@/lib/hosting-plans";

const productFamilies = [
  { icon: "▣", title: "Web Hosting", text: "Fast shared-cloud hosting for business sites, blogs, portfolios and everyday ecommerce.", meta: "From $7.99/mo", href: "/hosting/shared" },
  { icon: "W", title: "Managed WordPress", text: "WordPress-focused hosting with migration, backup, security and management tools.", meta: "WordPress ready", href: "/hosting/wordpress" },
  { icon: "◆", title: "WooCommerce", text: "A store-focused WordPress path with room to grow into stronger infrastructure.", meta: "Store hosting", href: "/hosting/woocommerce" },
  { icon: "☁", title: "Managed Cloud", text: "Dedicated managed cloud resources for traffic-heavy sites and larger applications.", meta: "Configured to order", href: "/hosting/cloud" },
  { icon: "⌘", title: "VPS Hosting", text: "Private virtual servers for custom software, APIs and server-level workloads.", meta: "Configured to order", href: "/hosting/vps" },
  { icon: "▤", title: "Dedicated Infrastructure", text: "Custom server and infrastructure sourcing for workloads that do not fit standard plans.", meta: "Request a quote", href: "/support" },
  { icon: "@", title: "Business Email", text: "Professional email at your domain, with mailbox capacity separate from website storage.", meta: "Available separately", href: "/email" },
  { icon: ".com", title: "Domains", text: "Search, register, renew, transfer and manage domains with pricing shown up front.", meta: "From $14.99/yr", href: "/domains" },
] as const;

const included = [
  { title: "SSL certificates", text: "Standard HTTPS for hosted websites without turning basic encryption into a surprise add-on." },
  { title: "Global CDN", text: "Distributed delivery for cacheable website content." },
  { title: "Backups & restore", text: "Recovery tooling when a website change or incident needs to be rolled back." },
  { title: "SSH + Git", text: "Developer workflows available across the shared-hosting family." },
  { title: "Business email", text: "Professional mailboxes included with shared plans, with separate upgrade paths." },
  { title: "Standard migration", text: "Supported website migration included with hosting; complex manual work quoted separately." },
] as const;

const addOns = [
  { title: "Website Turbo", label: "Performance", text: "Additional acceleration for eligible demanding or traffic-sensitive websites.", href: "/products/website-turbo" },
  { title: "Premium SSL", label: "Security", text: "Optional paid certificate products for customers who need more than standard HTTPS.", href: "/products/premium-ssl" },
  { title: "Timeline Backups Pro", label: "Recovery", text: "Deeper snapshot-style recovery and extended restore history.", href: "/products/timeline-backups" },
  { title: "Malware Cleanup", label: "Security Service", text: "Hands-on investigation, cleanup, restore and relaunch assistance after an incident.", href: "/products/malware-cleanup" },
  { title: "Website Care", label: "Managed Service", text: "Ongoing maintenance help for customers who do not want every technical task on their plate.", href: "/products/website-care" },
  { title: "Mailbox Upgrades", label: "Email", text: "Increase email capacity without forcing the website onto a larger hosting plan.", href: "/products/mailbox-storage" },
] as const;

const faqs = [
  ["Why is HostMyWeb $7.99/month when other hosts advertise $2 or $3?", "Many low advertised rates are introductory prices tied to long prepayment terms and higher renewal pricing. HostMyWeb Starter is $7.99 per month with the same base rate at renewal while the same plan remains continuously active."],
  ["Do I have to prepay for several years?", "No multi-year prepayment is required to receive the advertised shared-hosting base rate."],
  ["Can HostMyWeb move my existing website?", "Supported standard website migrations are included with hosting. Unusual, unsupported or reconstruction-heavy migrations can require a separate manual migration quote."],
  ["Do shared plans include developer access?", "SSH and Git are available across the shared-hosting family, alongside the normal managed website controls."],
  ["What happens if I outgrow shared hosting?", "HostMyWeb has a scale path into Managed Cloud and VPS hosting, with custom infrastructure available for workloads that need a different environment."],
  ["Are domains included free for the first year?", "HostMyWeb does not use a temporary free-domain headline to hide a different renewal bill. Domain registration and renewal pricing are shown separately before purchase."],
] as const;

const compareRows = [
  ["Websites", "1", "5", "15", "30"],
  ["SSD webspace", "10 GB", "25 GB", "50 GB", "100 GB"],
  ["Bandwidth", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
  ["Business mailboxes", "5", "25", "50", "100"],
  ["Mailbox storage", "10 GB each", "10 GB each", "10 GB each", "10 GB each"],
  ["MySQL databases", "5", "25", "50", "100"],
  ["SSL + global CDN", "Included", "Included", "Included", "Included"],
  ["SSH + Git", "Available", "Available", "Available", "Available"],
  ["Backups + security", "Included", "Included", "Included", "Included"],
  ["Standard migration", "Included", "Included", "Included", "Included"],
] as const;

function HeroInfrastructureVisual() {
  return (
    <div className="hmw-hero-visual" aria-hidden="true">
      <div className="hmw-visual-glow" />
      <div className="hmw-browser-mock">
        <div className="hmw-browser-top"><span /><span /><span /><b>hostmyweb.co</b></div>
        <div className="hmw-browser-body">
          <div className="hmw-browser-sidebar"><i /><i /><i /><i /><i /></div>
          <div className="hmw-browser-content">
            <div className="hmw-browser-status"><span>YOUR WEBSITE</span><b>Online</b></div>
            <div className="hmw-browser-chart"><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="hmw-browser-stats"><span><b>SSL</b><small>Active</small></span><span><b>CDN</b><small>Enabled</small></span><span><b>Backup</b><small>Ready</small></span></div>
          </div>
        </div>
      </div>
      <div className="hmw-server-card hmw-server-one"><span>SSL</span><b>Secured</b></div>
      <div className="hmw-server-card hmw-server-two"><span>CDN</span><b>Global</b></div>
      <div className="hmw-server-card hmw-server-three"><span>PRICE</span><b>$7.99</b></div>
    </div>
  );
}

export function HostMyWebIndexHome() {
  const starter = HOSTING_PLANS.starter;

  return (
    <SiteFrame>
      <div className="hmw-promo-bar"><b>PRICE LOCK:</b><span>Starter hosting is $7.99/mo today and $7.99/mo at renewal.</span><a href="/hosting/shared">Compare plans</a></div>

      <section className="hmw-v2-hero">
        <div className="hmw-v2-hero-copy">
          <span className="hmw-v2-kicker">WEB HOSTING BUILT FOR REAL BUSINESSES</span>
          <h1>Fast web hosting without the <em>renewal-price ambush.</em></h1>
          <p>Launch a website, move an existing one, run WordPress, manage domains and business email, then scale into cloud or VPS infrastructure when your workload grows.</p>
          <div className="hmw-v2-checks"><span>✓ Monthly billing</span><span>✓ Unlimited bandwidth</span><span>✓ SSL + global CDN</span><span>✓ Standard migration included</span></div>
          <div className="hmw-v2-hero-actions"><a className="hmw-v2-primary" href="/hosting/shared">See hosting plans</a><a className="hmw-v2-secondary" href="/domains">Search a domain</a></div>
          <div className="hmw-v2-proof"><span><b>$0</b> promotional renewal jump</span><span><b>10–100 GB</b> published SSD storage</span><span><b>Cloud + VPS</b> scale path</span></div>
        </div>
        <div className="hmw-v2-hero-side">
          <HeroInfrastructureVisual />
          <div className="hmw-v2-offer">
            <div className="hmw-v2-offer-heading"><span>STARTER WEB HOSTING</span><b>PRICE LOCK</b></div>
            <div className="hmw-v2-offer-price"><sup>$</sup>{starter.monthlyPrice.toFixed(2)}<small>/mo</small></div>
            <p>Same base rate at renewal while the same plan remains continuously active.</p>
            <div className="hmw-v2-offer-grid"><span><b>{starter.webspaceGb} GB</b> SSD</span><span><b>{starter.websites}</b> website</span><span><b>{starter.mailboxes}</b> mailboxes</span><span><b>Unlimited</b> bandwidth</span></div>
            <a href="/signup?plan=starter">Get Starter Hosting</a>
          </div>
        </div>
      </section>

      <section className="hmw-v2-product-strip">
        <div className="hmw-v2-section-intro"><span>HOSTMYWEB PRODUCTS</span><h2>More than one kind of hosting.</h2><p>Choose the product that matches the job instead of trying to force every customer into the same plan.</p></div>
        <div className="hmw-v2-product-grid">{productFamilies.map((item) => <a href={item.href} key={item.title}><span className="hmw-v2-product-icon">{item.icon}</span><div><small>{item.meta}</small><h3>{item.title}</h3><p>{item.text}</p><b>Explore →</b></div></a>)}</div>
        <div className="hmw-v2-products-link"><a href="/products">Browse the complete HostMyWeb product catalog →</a></div>
      </section>

      <section className="hmw-v2-plans" id="plans">
        <div className="hmw-v2-section-intro centered"><span>SHARED CLOUD HOSTING</span><h2>Pick the plan that fits now.</h2><p>Clear resource limits, monthly pricing and the same base rate at renewal.</p></div>
        <div className="hmw-v2-plan-grid">
          {HOSTING_PLAN_SLUGS.map((slug) => {
            const plan = HOSTING_PLANS[slug];
            return <article className={slug === "business" ? "featured" : ""} key={slug}>
              {slug === "business" && <div className="hmw-v2-plan-ribbon">MOST POPULAR</div>}
              <small>{slug === "starter" ? "FOR ONE SITE" : slug === "business" ? "FOR GROWING BUSINESS" : slug === "pro" ? "FOR DEVELOPERS" : "FOR MULTI-SITE"}</small>
              <h3>{plan.name}</h3>
              <div className="hmw-v2-plan-price"><sup>$</sup>{plan.monthlyPrice.toFixed(2)}<span>/month</span></div>
              <p className="hmw-v2-renew">Renews at the same ${plan.monthlyPrice.toFixed(2)}/mo base rate.</p>
              <ul><li><b>{plan.websites === 1 ? "1 website" : `${plan.websites} websites`}</b></li><li><b>{plan.webspaceGb} GB SSD</b> webspace</li><li><b>{plan.mailboxes}</b> business mailboxes</li><li><b>{plan.databases}</b> MySQL databases</li><li>Unlimited bandwidth</li><li>SSL + CDN + backups</li><li>SSH + Git available</li></ul>
              <a href={`/signup?plan=${slug}`}>Choose {plan.name}</a>
            </article>;
          })}
        </div>
        <div className="hmw-v2-compare-wrap">
          <div className="hmw-v2-compare-head"><div><span>PLAN COMPARISON</span><h3>Compare what is actually included.</h3></div><a href="/hosting/shared">Full hosting details →</a></div>
          <div className="hmw-v2-table-scroll"><table className="hmw-v2-compare"><thead><tr><th>Feature</th><th>Starter</th><th>Business</th><th>Pro</th><th>Agency</th></tr></thead><tbody>{compareRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell}>{cell}</th> : <td key={`${row[0]}-${cell}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>
        </div>
      </section>

      <section className="hmw-v2-domain">
        <div className="hmw-v2-domain-copy"><span>DOMAIN NAMES</span><h2>Your website needs a name.</h2><p>Search live availability and see registration pricing before checkout. No temporary “free domain” headline hiding next year’s bill.</p><div className="hmw-v2-tlds"><i><b>.com</b>$17.99/yr</i><i><b>.org</b>$17.99/yr</i><i><b>.net</b>$19.99/yr</i><i><b>.us</b>$14.99/yr</i></div></div>
        <div className="hmw-v2-domain-search"><DomainSearch /></div>
      </section>

      <section className="hmw-v2-included">
        <div className="hmw-v2-section-intro centered"><span>INCLUDED WITH HOSTING</span><h2>The essentials should not feel like add-on roulette.</h2><p>Start with the day-to-day tools a hosted website actually needs.</p></div>
        <div className="hmw-v2-included-grid">{included.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>

      <section className="hmw-v2-performance">
        <div className="hmw-v2-performance-visual">
          <div className="hmw-network-orbit orbit-a" /><div className="hmw-network-orbit orbit-b" /><div className="hmw-network-core">HMW<span>GLOBAL DELIVERY</span></div>
          <i className="node n1">USA</i><i className="node n2">UK</i><i className="node n3">SG</i><i className="node n4">CDN</i>
        </div>
        <div className="hmw-v2-performance-copy"><span>PERFORMANCE & INFRASTRUCTURE</span><h2>Built to serve websites, not just store files.</h2><p>Shared hosting runs on an autoscaling, load-balanced cloud platform with global content delivery. When a workload needs dedicated resources or server-level control, HostMyWeb can move it into Managed Cloud or VPS infrastructure.</p><div className="hmw-v2-performance-points"><div><b>Autoscaling shared cloud</b><small>Managed website hosting without a traditional single-server resource model.</small></div><div><b>Global CDN</b><small>Distributed delivery for cacheable content closer to visitors.</small></div><div><b>Managed Cloud</b><small>Dedicated managed resources for larger traffic and data workloads.</small></div><div><b>VPS</b><small>Private virtual servers for custom applications and software stacks.</small></div></div><a href="/hosting">Compare hosting types →</a></div>
      </section>

      <section className="hmw-v2-marketplace">
        <div className="hmw-v2-section-intro"><span>ADD-ONS & SERVICES</span><h2>Build the hosting account around the customer.</h2><p>Performance, recovery, email, security and hands-on services can be added without turning the shared plan cards into a wall of upsells.</p></div>
        <div className="hmw-v2-addon-grid">{addOns.map((item) => <a href={item.href} key={item.title}><small>{item.label}</small><h3>{item.title}</h3><p>{item.text}</p><b>Learn more →</b></a>)}</div>
        <a className="hmw-v2-catalog-link" href="/products">See all products and services</a>
      </section>

      <section className="hmw-v2-wordpress">
        <div className="hmw-v2-wordpress-copy"><span>WORDPRESS & ECOMMERCE</span><h2>Launch WordPress. Grow into more when you need it.</h2><p>Use a WordPress-focused hosting path for publishing and a WooCommerce path for online stores. Migration, security, backup and domain services stay connected to the same HostMyWeb relationship.</p><div><a href="/hosting/wordpress">Managed WordPress</a><a href="/hosting/woocommerce">WooCommerce Hosting</a></div></div>
        <div className="hmw-site-builder-mock" aria-hidden="true"><div className="top"><i /><i /><i /><b>Website preview</b></div><div className="body"><aside><span /><span /><span /><span /></aside><main><div className="hero"><small>YOUR BUSINESS</small><b>Build something customers remember.</b><i /></div><div className="cards"><span /><span /><span /></div></main></div></div>
      </section>

      <section className="hmw-v2-migration">
        <div><span>SWITCHING HOSTS?</span><h2>Bring the website with you.</h2><p>Supported standard website migration is included with hosting. Complex, unusual or reconstruction-heavy moves can be quoted separately before work begins.</p></div><div><a href="/websites/migration">See migration options</a><a href="/support">Ask about your site</a></div>
      </section>

      <section className="hmw-v2-why">
        <div className="hmw-v2-section-intro centered"><span>WHY HOSTMYWEB</span><h2>A web host should make the buying decision easier.</h2><p>Clear prices, visible resources, a broader product lineup and somewhere to grow when the website changes.</p></div>
        <div className="hmw-v2-why-grid"><article><b>No renewal-price bait</b><p>The advertised shared-hosting base rate does not jump simply because an introductory period ended.</p></article><article><b>Published plan resources</b><p>Website count, SSD storage, mailboxes and databases are shown before checkout.</p></article><article><b>Real product breadth</b><p>Hosting, WordPress, WooCommerce, domains, email, performance, security, cloud, VPS and website services.</p></article><article><b>A path beyond shared hosting</b><p>Move into Managed Cloud, VPS or custom infrastructure when the workload actually requires it.</p></article></div>
      </section>

      <section className="hmw-v2-faq">
        <div className="hmw-v2-faq-title"><span>FAQ</span><h2>Questions people ask before moving a website.</h2><p>Need something specific? Use support and sales instead of guessing.</p><a href="/support">Contact HostMyWeb →</a></div>
        <div className="hmw-v2-faq-list">{faqs.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div>
      </section>

      <section className="hmw-v2-final"><div><span>READY TO HOST SOMETHING?</span><h2>Start at $7.99/month. Scale when the workload earns it.</h2><p>Choose hosting, search a domain, or browse the wider HostMyWeb product lineup.</p></div><div><a href="/hosting/shared">View hosting plans</a><a href="/products">Browse products</a></div></section>
    </SiteFrame>
  );
}
