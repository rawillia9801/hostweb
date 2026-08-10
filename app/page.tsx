import { ContactForm } from "@/components/contact-form";
import { DomainSearch } from "@/components/domain-search";

const products = [
  { icon: "▦", title: "Web Hosting", kicker: "Fast, managed hosting", text: "Reliable hosting for business websites with SSL, backups, DNS assistance, migrations, and support built into the service.", points: ["Managed setup", "SSL included", "Migration help"] },
  { icon: "W", title: "Managed WordPress", kicker: "WordPress without the babysitting", text: "A cleaner home for WordPress sites with managed infrastructure, security-minded setup, updates, backups, and migration support.", points: ["WordPress-ready", "Backup options", "Performance help"] },
  { icon: "◎", title: "Domains & DNS", kicker: "Your brand starts with the name", text: "Search, register, connect, renew, and manage domains while keeping DNS organized and understandable.", points: ["Domain search", "DNS management", "Renewal support"] },
  { icon: "✉", title: "Business Email", kicker: "Email on your own domain", text: "Professional mailboxes for your business so customers see your brand instead of a free consumer email address.", points: ["Custom-domain email", "Mailbox setup", "Migration assistance"] },
  { icon: "◇", title: "SSL & Security", kicker: "Secure by default", text: "HTTPS, certificate management, DNS hygiene, security controls, and practical guidance for protecting your web presence.", points: ["SSL certificates", "HTTPS setup", "Security support"] },
  { icon: "↗", title: "Website Migrations", kicker: "Move without the chaos", text: "Bring an existing website, domain, or business email setup to HostMyWeb with a migration plan built around minimizing interruption.", points: ["Website moves", "DNS cutovers", "Email planning"] },
] as const;

const plans = [
  { name: "Starter", subtitle: "One business website", description: "For a local business, creator, or professional launching a dependable web presence.", features: ["1 managed website", "SSL & HTTPS", "Domain connection", "Business email options", "Migration assistance"], cta: "Choose Starter", popular: false },
  { name: "Business", subtitle: "Growing brands", description: "For businesses that need more resources, more email, and room for a second site or campaign.", features: ["Multiple website support", "More storage & resources", "Business email", "Backup options", "Priority setup assistance"], cta: "Choose Business", popular: true },
  { name: "Pro", subtitle: "Busy & advanced sites", description: "For established sites that need stronger resource allocation and more hands-on technical support.", features: ["Higher resource allocation", "Multi-site management", "Advanced DNS assistance", "Priority technical support", "Migration planning"], cta: "Choose Pro", popular: false },
  { name: "Agency", subtitle: "Multiple brands or clients", description: "For operators managing several websites, brands, client properties, or purpose-built solutions.", features: ["Multi-brand hosting", "Centralized management", "White-label-friendly workflows", "Scalable infrastructure", "Migration coordination"], cta: "Talk to sales", popular: false },
] as const;

const solutions = [
  { mark: "B", title: "Breeders", text: "Managed hosting, domains, email, and connected infrastructure for professional breeding businesses." },
  { mark: "L", title: "Local Businesses", text: "A credible website, branded email, and the infrastructure needed to keep your local presence dependable." },
  { mark: "S", title: "Online Shops", text: "Hosting and domain infrastructure for product brands and stores that need speed, uptime, and room to grow." },
  { mark: "P", title: "Service Brands", text: "A polished web presence for consultants, professionals, agencies, and specialized service companies." },
] as const;

const ecosystem = [
  { name: "HostMyWeb", type: "Infrastructure", text: "Hosting, domains, email, DNS, SSL, and the infrastructure layer underneath the product family.", href: "https://hostmyweb.co", current: true },
  { name: "MyDogPortal", type: "Breeder Operating System", text: "Run the breeding program, families, puppies, communications, portals, and business workflow.", href: "https://mydogportal.site", current: false },
  { name: "DogBreederWeb", type: "Breeder Website Platform", text: "Build and operate purpose-built breeder websites that connect with breeder records and applications.", href: "https://dogbreederweb.site", current: false },
  { name: "DogBreederDocs", type: "Breeder Document Platform", text: "Create, manage, send, and complete professional breeder paperwork and document packets.", href: "https://dogbreederdocs.online", current: false },
] as const;

export default function HomePage() {
  return (
    <main id="top">
      <div className="utility-bar">
        <div><span>HostMyWeb</span><b>Managed infrastructure for real businesses</b></div>
        <div><a href="#support">Support</a><a href="#contact">Sales</a><span className="status-pill">● Systems operational</span></div>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="HostMyWeb home"><span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b></a>
        <nav aria-label="Primary navigation">
          <a href="#hosting">Hosting</a>
          <a href="#domains">Domains</a>
          <a href="#products">Products</a>
          <a href="#solutions">Solutions</a>
          <a href="#ecosystem">Company</a>
          <a href="#support">Support</a>
        </nav>
        <div className="header-actions"><a className="login-link" href="#contact">Log in</a><a className="nav-cta" href="#plans">Get Started</a></div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><i /> Reliable infrastructure. Real support. Built for growth.</span>
          <h1>Managed Hosting,<br />Domains &amp; Business Email —<br /><em>Built for Real Brands</em></h1>
          <p>HostMyWeb gives small businesses, creators, online shops, service brands, and specialized companies one organized place for the infrastructure behind their online presence.</p>
          <div className="hero-actions"><a className="primary-button" href="#plans">See hosting plans <span>→</span></a><a className="secondary-button" href="#products">Explore products</a></div>
          <div className="proof-row"><span><b>✓</b> Managed setup</span><span><b>✓</b> Migration help</span><span><b>✓</b> Business email</span><span><b>✓</b> Human support</span></div>
        </div>

        <div className="dashboard-shell" aria-label="HostMyWeb infrastructure dashboard preview">
          <div className="dashboard-windowbar"><span /><span /><span /><div>portal.hostmyweb.co</div></div>
          <div className="dashboard-top"><div className="mini-brand"><span className="mini-mark">H</span><b>HostMyWeb</b></div><div className="account-chip">My Brand Co.⌄</div></div>
          <div className="dashboard-body">
            <aside><b>Overview</b><span>Hosting</span><span>Domains</span><span>Email</span><span>Websites</span><span>Security</span><span>DNS</span><span>Billing</span><span>Support</span></aside>
            <section>
              <header><div><small>OVERVIEW</small><h2>Everything looks good.</h2></div><span className="online-dot">● Live</span></header>
              <div className="metric-grid">
                <article><small>DOMAIN</small><b>mybrand.co</b><em>Active</em><span>Renewal protected</span></article>
                <article><small>WEB HOSTING</small><b>Business Plan</b><em>Active</em><span>Site online</span></article>
                <article><small>BUSINESS EMAIL</small><b>5 mailboxes</b><em>Healthy</em><span>All systems operational</span></article>
                <article><small>WEBSITE</small><b>Published</b><em>Online</em><span>Production connected</span></article>
                <article><small>SSL CERTIFICATE</small><b>Secure</b><em>Active</em><span>HTTPS enabled</span></article>
                <article><small>DNS</small><b>Connected</b><em>Healthy</em><span>A · MX · CNAME · TXT</span></article>
              </div>
              <div className="dashboard-lower"><article><b>Resource usage</b><label>Storage <span>38%</span></label><i><span style={{width:"38%"}} /></i><label>Bandwidth <span>42%</span></label><i><span style={{width:"42%"}} /></i></article><article><b>Quick actions</b><span>Add a domain →</span><span>Create email account →</span><span>Manage DNS records →</span><span>Request migration →</span></article></div>
            </section>
          </div>
        </div>
      </section>

      <section className="domain-band" id="domains">
        <div className="domain-band-copy"><span>YOUR NAME ONLINE</span><h2>Find the domain your business should own.</h2><p>Search first, then build the hosting, email, and website setup around the right name.</p></div>
        <DomainSearch />
      </section>

      <section className="trust-strip" aria-label="HostMyWeb service highlights">
        <span><b>99.9%</b> uptime-minded infrastructure</span><span><b>SSL</b> secure connections</span><span><b>DNS</b> setup assistance</span><span><b>Email</b> on your domain</span><span><b>Moves</b> migration help</span>
      </section>

      <section className="section products-section" id="products">
        <header className="section-heading"><span>HOSTMYWEB PRODUCTS</span><h2>Everything you expect from a real web hosting company.</h2><p>Hosting is only one piece. HostMyWeb brings domains, email, security, migrations, DNS, and website infrastructure together under one service brand.</p></header>
        <div className="product-grid">{products.map((product) => <article key={product.title}><span className="product-icon">{product.icon}</span><small>{product.kicker}</small><h3>{product.title}</h3><p>{product.text}</p><ul>{product.points.map(point => <li key={point}>✓ {point}</li>)}</ul><a href="#contact">Learn more <span>→</span></a></article>)}</div>
      </section>

      <section className="hosting-section" id="hosting">
        <div className="hosting-copy"><span>MANAGED WEB HOSTING</span><h2>Hosting that feels managed — because it is.</h2><p>You should not have to become a server administrator just to keep your company online. HostMyWeb is designed around an organized service relationship: your website, domain, SSL, DNS, email, migrations, and support all have a clear home.</p><div className="hosting-checks"><span>✓ Setup assistance</span><span>✓ Domain connection</span><span>✓ SSL &amp; HTTPS</span><span>✓ Business email options</span><span>✓ Migration planning</span><span>✓ Human support</span></div><a className="primary-button" href="#plans">Compare plans →</a></div>
        <div className="hosting-console"><div className="console-head"><div><b>mybrand.co</b><span>Production website</span></div><em>● Online</em></div><div className="console-stats"><article><span>Uptime</span><b>99.99%</b><i><span style={{width:"99%"}} /></i></article><article><span>SSL</span><b>Secure</b><i><span style={{width:"100%"}} /></i></article><article><span>Backups</span><b>Current</b><i><span style={{width:"92%"}} /></i></article></div><div className="console-list"><span><i>✓</i> DNS records connected</span><span><i>✓</i> HTTPS certificate active</span><span><i>✓</i> Email routing healthy</span><span><i>✓</i> Latest backup completed</span></div></div>
      </section>

      <section className="section plans-section" id="plans">
        <header className="section-heading centered"><span>WEB HOSTING PLANS</span><h2>Choose the level that fits the business.</h2><p>Plan names and product structure are ready now. Retail pricing can be finalized against the production hosting platform so the published rates are sustainable and accurate.</p></header>
        <div className="plan-grid">{plans.map((plan) => <article className={plan.popular ? "featured-plan" : ""} key={plan.name}>{plan.popular && <em>MOST POPULAR</em>}<small>{plan.subtitle}</small><h3>{plan.name}</h3><p>{plan.description}</p><div className="price-placeholder"><span>Launch pricing</span><b>Finalizing</b><small>based on production resources</small></div><ul>{plan.features.map(item => <li key={item}>✓ {item}</li>)}</ul><a href="#contact">{plan.cta}</a></article>)}</div>
        <p className="plan-footnote">Need WordPress, several domains, a larger migration, or a multi-brand setup? We can build the plan around the actual environment instead of forcing the business into the wrong package.</p>
      </section>

      <section className="section solutions-section" id="solutions">
        <header className="section-heading centered"><span>SOLUTIONS FOR GROWING BRANDS</span><h2>Built for more than one niche.</h2><p>The infrastructure should adapt to the business — not force every customer into the same generic website package.</p></header>
        <div className="audience-grid">{solutions.map((solution, index) => <article key={solution.title}><div className={`audience-visual visual-${index+1}`}><span>{solution.mark}</span><div className="visual-lines"><i /><i /><i /></div></div><small>HOSTMYWEB SOLUTION</small><h3>{solution.title}</h3><p>{solution.text}</p><a href="#contact">Explore solution →</a></article>)}</div>
      </section>

      <section className="ecosystem section" id="ecosystem">
        <header className="section-heading centered"><span>PART OF THE HOSTMYWEB FAMILY</span><h2>Powering purpose-built solutions.</h2><p>HostMyWeb is a complete hosting brand on its own, and it can also provide the web infrastructure underneath focused products that solve very specific business problems.</p></header>
        <div className="ecosystem-grid">{ecosystem.map((product) => <a className={product.current ? "ecosystem-card current" : "ecosystem-card"} href={product.href} key={product.name} target={product.current ? undefined : "_blank"} rel={product.current ? undefined : "noreferrer"}><span className="ecosystem-logo">{product.name.slice(0,1)}</span><small>{product.type}</small><h3>{product.name}</h3><p>{product.text}</p><b>{product.current ? "You are here" : "Visit product →"}</b></a>)}</div>
        <div className="ecosystem-note"><b>Different tools. One thoughtful ecosystem.</b><p>Each product has one clear job. HostMyWeb provides the infrastructure layer without limiting the hosting company to one industry.</p></div>
      </section>

      <section className="support-section" id="support">
        <div><span>SUPPORT THAT SPEAKS HUMAN</span><h2>Domains, DNS, email, hosting and migrations can get technical. You should still get a clear answer.</h2></div>
        <div className="support-cards"><article><b>Migration help</b><p>Planning for websites, DNS, email, and cutover timing.</p></article><article><b>Domain &amp; DNS help</b><p>Assistance connecting records and getting services pointed where they belong.</p></article><article><b>Hosting support</b><p>Help understanding the environment instead of being handed a generic control-panel article.</p></article></div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="contact-copy"><span className="eyebrow"><i /> LET’S BUILD THE RIGHT SETUP</span><h2>Tell us what needs to be hosted, moved, connected, or cleaned up.</h2><p>Whether you need one website, a portfolio of brands, a new domain, business email, or a migration away from a provider you have outgrown, start with the actual situation. We’ll organize the infrastructure around it.</p><div className="contact-points"><span>✓ Websites &amp; migrations</span><span>✓ Domains &amp; DNS</span><span>✓ Business email</span><span>✓ Multi-site &amp; agency needs</span></div></div>
        <ContactForm />
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b></a><p>Reliable infrastructure. Real support. Hosting, domains, email, security, and migrations for brands that want their online presence handled thoughtfully.</p><span className="footer-status">● Systems operational</span></div>
        <div><b>Products</b><a href="#hosting">Web Hosting</a><a href="#products">Managed WordPress</a><a href="#domains">Domains &amp; DNS</a><a href="#products">Business Email</a><a href="#products">SSL &amp; Security</a></div>
        <div><b>Solutions</b><a href="#solutions">Breeders</a><a href="#solutions">Local Businesses</a><a href="#solutions">Online Shops</a><a href="#solutions">Service Brands</a><a href="#plans">Agencies</a></div>
        <div><b>Company</b><a href="#ecosystem">Our ecosystem</a><a href="#support">Support</a><a href="#plans">Plans</a><a href="#contact">Contact sales</a></div>
        <div><b>Get started</b><p>Have a site, domain, email setup, or migration you need help with?</p><a className="footer-cta" href="#contact">Start your setup →</a></div>
        <small>© 2026 HostMyWeb.co. All rights reserved.</small>
      </footer>
    </main>
  );
}
