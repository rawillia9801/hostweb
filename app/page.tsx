import { ContactForm } from "@/components/contact-form";
import { DomainSearch } from "@/components/domain-search";

const products = [
  { icon: "▦", title: "Shared Web Hosting", price: "From $7.99/mo", text: "Fast shared hosting with SSL, CDN, backups, security tools, DNS controls, and a customer account that keeps routine service work organized.", href: "#pricing" },
  { icon: "◎", title: "Domains & DNS", price: "From $14.99/yr", text: "Search, register, renew, and manage domains with straightforward year-to-year pricing.", href: "#domains" },
  { icon: "✉", title: "Business Email", price: "From $2.99/mo", text: "Professional email on your own domain, connected to the same HostMyWeb account.", href: "/signup?product=email" },
  { icon: "✦", title: "AI Website Builder", price: "AI-assisted site creation", text: "Describe what you need, refine the structure and content, then connect the finished site to your hosting and domain.", href: "#ai-builder" },
  { icon: "W", title: "Managed WordPress", price: "From $9.99/mo", text: "WordPress-ready hosting with SSL, backups, security tools, and a cleaner way to keep the technical side under control.", href: "#pricing" },
  { icon: "↗", title: "Migrations & Support", price: "Migration tools included", text: "Use included migration tools yourself, or choose done-for-you migration and structured setup help from $49.", href: "#custom" },
] as const;

const plans = [
  {
    name: "Starter",
    price: "$7.99",
    unit: "/mo",
    description: "A simple home for one business website.",
    features: ["1 website", "SSL + CDN", "5 business mailboxes", "Backups", "Malware scanning", "DNS & file tools"],
    href: "/signup?plan=starter",
    popular: false,
  },
  {
    name: "Business",
    price: "$12.99",
    unit: "/mo",
    description: "For established businesses with multiple sites and email users.",
    features: ["Up to 5 websites", "SSL + CDN", "25 business mailboxes", "Daily backups", "Security tools", "Database management"],
    href: "/signup?plan=business",
    popular: true,
  },
  {
    name: "Pro",
    price: "$21.99",
    unit: "/mo",
    description: "More room for larger sites and multiple projects.",
    features: ["Up to 15 websites", "SSL + CDN", "50 business mailboxes", "Daily backups", "SSH & Git tools", "Priority support queue"],
    href: "/signup?plan=pro",
    popular: false,
  },
  {
    name: "Agency",
    price: "$39.99",
    unit: "/mo",
    description: "For agencies, operators, and multi-site businesses.",
    features: ["Up to 30 websites", "Multi-site organization", "100 business mailboxes", "Daily backups", "Advanced hosting tools", "Priority support queue"],
    href: "/signup?plan=agency",
    popular: false,
  },
] as const;

const domainPrices = [
  { tld: ".com", price: "$17.99", note: "registration & renewal" },
  { tld: ".org", price: "$17.99", note: "registration & renewal" },
  { tld: ".net", price: "$19.99", note: "registration & renewal" },
  { tld: ".us", price: "$14.99", note: "registration & renewal" },
] as const;

const hostingFeatures = [
  { mark: "SSL", title: "SSL certificates", text: "Keep websites encrypted without turning basic security into a separate add-on." },
  { mark: "CDN", title: "Content delivery network", text: "Serve site assets through a distributed delivery layer for faster visitor access." },
  { mark: "SEC", title: "Malware scanning", text: "Hosting security tools help identify malicious files and suspicious website activity." },
  { mark: "WAF", title: "WAF & DDoS protection", text: "Network and application-layer protections help reduce common automated and denial-of-service threats." },
  { mark: "BK", title: "Backup & restore", text: "Keep recoverable copies of website data and restore when something goes wrong." },
  { mark: "1×", title: "One-click applications", text: "Launch common web applications without manually building every installation from scratch." },
  { mark: "W", title: "WordPress tools", text: "Manage WordPress sites with hosting controls built around common maintenance tasks." },
  { mark: "FM", title: "File management", text: "Work with website files through browser-based tools plus supported transfer access." },
  { mark: "DB", title: "Database management", text: "Create and manage site databases with familiar administration tools." },
  { mark: "DNS", title: "DNS management", text: "Manage the records that connect domains, websites, email, and other services." },
  { mark: "DEV", title: "SSH & Git", text: "Developer-oriented access and version-control workflows are available where the selected package supports them." },
  { mark: "MAIL", title: "Email controls", text: "Manage business mailboxes, forwarding, aliases, spam controls, and related email settings." },
] as const;

const solutions = [
  { mark: "S", title: "Small Businesses", text: "Hosting, domains, email, and website tools without unnecessary complexity." },
  { mark: "V", title: "Service Businesses", text: "A dependable online foundation for local and professional service companies." },
  { mark: "O", title: "Online Stores", text: "Hosting and domain infrastructure for commerce sites and product businesses." },
  { mark: "C", title: "Creators", text: "Websites, domains, and email for creators who want a professional home online." },
  { mark: "A", title: "Agencies", text: "Multi-site hosting and account organization for teams managing client work." },
  { mark: "B", title: "Vertical Software", text: "A shared service layer that can sit quietly underneath purpose-built business platforms." },
] as const;

const ecosystemProducts = [
  {
    name: "HostMyWeb",
    type: "Shared Hosting Foundation",
    text: "Shared web hosting, domains, DNS, email, provisioning, account services, billing support, and the reusable service layer underneath connected products.",
    href: "#top",
    foundation: true,
    spotlight: false,
    mark: "H",
    action: "Shared foundation",
  },
  {
    name: "DogBreederOS",
    type: "Flagship Vertical Platform",
    text: "The operating system for running a modern dog breeding program—dogs, breeding, litters, buyers, applications, documents, websites, voice, payments, and portals.",
    href: "https://dogbreederos.com",
    foundation: false,
    spotlight: true,
    mark: "OS",
    action: "Explore DogBreederOS →",
  },
  {
    name: "DogBreederWeb",
    type: "Connected Website Capability",
    text: "Breeder websites, guided site creation, custom domains, publishing, and connected breeder records—available as part of the breeder ecosystem or on its own.",
    href: "https://dogbreederweb.site",
    foundation: false,
    spotlight: false,
    mark: "W",
    action: "Explore DogBreederWeb →",
  },
  {
    name: "DogBreederDocs",
    type: "Connected Document Capability",
    text: "Reusable breeder documents, agreements, editing, sending, and e-signature workflows—connected to the same broader breeder operating model.",
    href: "https://dogbreederdocs.online",
    foundation: false,
    spotlight: false,
    mark: "D",
    action: "Explore DogBreederDocs →",
  },
] as const;

export default function HomePage() {
  return (
    <main id="top">
      <header className="site-header storefront-header architectural-header">
        <a className="brand" href="#top" aria-label="HostMyWeb home">
          <span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#pricing">Shared Hosting</a>
          <a href="#hosting-features">Features</a>
          <a href="#domains">Domains</a>
          <a href="#ai-builder">AI Website Builder</a>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#support">Support</a>
        </nav>
        <div className="header-actions">
          <a className="login-link" href="/account">Log In</a>
          <a className="nav-cta" href="/signup">Get Started</a>
        </div>
      </header>

      <section className="hero storefront-hero architectural-hero">
        <div className="hero-copy architectural-copy">
          <span className="architecture-kicker">SHARED WEB HOSTING WITHOUT THE GOTCHA</span>
          <h1>Straightforward Pricing.<br /><em>No Gimmicks.</em></h1>
          <p>Shared web hosting, fair domain pricing, business email, and connected website services—without teaser rates, inflated renewal pricing, or a long contract just to get the advertised price.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#pricing">View Shared Hosting <span>→</span></a>
            <a className="secondary-button" href="#domains">Search Domains</a>
          </div>
          <div className="hero-price-line">
            <span>Shared hosting from <b>$7.99/mo</b></span>
            <i />
            <span><b>$7.99 today. $7.99 at renewal.</b></span>
            <i />
            <span><b>No multi-year contract required</b></span>
          </div>
          <div className="proof-row architectural-proof">
            <span><b>✓</b> HostMyWeb Price Lock</span>
            <span><b>✓</b> No teaser rates</span>
            <span><b>✓</b> Security & backup tools</span>
            <span><b>✓</b> Human support when needed</span>
          </div>
        </div>

        <div className="architecture-visual" aria-label="HostMyWeb service architecture">
          <div className="architecture-glow" />
          <div className="architecture-grid-lines" />
          <div className="architecture-core">
            <span className="brand-mark architecture-mark"><i /><i /><i /></span>
            <small>SHARED HOSTING FOUNDATION</small>
            <strong>HostMyWeb</strong>
            <p>Shared hosting, domains, email, provisioning, account, and support services in one foundation.</p>
          </div>
          <div className="architecture-node node-hosting"><span>▦</span><div><b>Shared Hosting</b><small>Fast, secure hosting</small></div></div>
          <div className="architecture-node node-domains"><span>◎</span><div><b>Domains</b><small>Registration & DNS</small></div></div>
          <div className="architecture-node node-email"><span>✉</span><div><b>Email</b><small>Business mailboxes</small></div></div>
          <div className="architecture-node node-ai"><span>✦</span><div><b>AI Builder</b><small>Guided site creation</small></div></div>
          <div className="architecture-node node-account"><span>○</span><div><b>Account</b><small>Services & billing</small></div></div>
          <div className="architecture-node node-support"><span>?</span><div><b>Support</b><small>Structured help</small></div></div>
          <svg className="architecture-links" viewBox="0 0 720 520" aria-hidden="true">
            <path d="M360 260 C255 230 220 145 145 125" />
            <path d="M360 260 C250 260 210 260 115 260" />
            <path d="M360 260 C255 305 220 390 150 408" />
            <path d="M360 260 C465 230 500 145 575 125" />
            <path d="M360 260 C470 260 510 260 605 260" />
            <path d="M360 260 C465 305 500 390 570 408" />
          </svg>
        </div>
      </section>

      <section className="price-lock-ribbon" aria-label="HostMyWeb Price Lock">
        <div>
          <span>HOSTMYWEB PRICE LOCK</span>
          <strong>The price you sign up for is the price you keep.</strong>
        </div>
        <p>No introductory rate. No renewal-rate increase. No long-term contract required to get the advertised hosting price.</p>
        <a href="#price-lock">See how Price Lock works →</a>
      </section>

      <section className="domain-band storefront-domain architectural-domain" id="domains">
        <div className="domain-band-copy">
          <span>FAIR DOMAIN PRICING</span>
          <h2>Find the right domain.</h2>
          <p>Search current availability and see the renewal price before you buy. Common extensions keep the same HostMyWeb price at renewal.</p>
        </div>
        <div>
          <DomainSearch />
          <div className="domain-price-grid">
            {domainPrices.map((item) => (
              <article key={item.tld}>
                <b>{item.tld}</b>
                <strong>{item.price}<small>/yr</small></strong>
                <span>{item.note}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ecosystem-architecture" id="ecosystem">
        <div className="ecosystem-heading">
          <span>CONNECTED ECOSYSTEM</span>
          <h2>Shared hosting underneath.<br />Purpose-built software on top.</h2>
          <p>HostMyWeb is a general-purpose shared hosting company first. The same reusable infrastructure can also sit underneath connected products such as DogBreederOS, DogBreederWeb, and DogBreederDocs where a specialized workflow makes sense.</p>
        </div>
        <div className="ecosystem-flow">
          {ecosystemProducts.map((product) => (
            <a
              className={`ecosystem-node-card ${product.foundation ? "foundation" : ""} ${product.spotlight ? "spotlight" : ""}`}
              href={product.href}
              key={product.name}
              target={product.foundation ? undefined : "_blank"}
              rel={product.foundation ? undefined : "noreferrer"}
            >
              <span className="ecosystem-node-mark">{product.mark}</span>
              <small>{product.type}</small>
              <h3>{product.name}</h3>
              <p>{product.text}</p>
              <b>{product.action}</b>
            </a>
          ))}
        </div>
      </section>

      <section className="section plans-section architectural-pricing" id="pricing">
        <header className="section-heading">
          <span>SHARED WEB HOSTING</span>
          <h2>Pick the plan that fits.</h2>
          <p>One real monthly price. Pay month-to-month, keep it for a year, or keep it for ten years—the base monthly hosting rate does not jump at renewal.</p>
        </header>
        <div className="plan-grid">
          {plans.map((plan) => (
            <article className={plan.popular ? "featured-plan" : ""} key={plan.name}>
              {plan.popular && <em>MOST POPULAR</em>}
              <h3>{plan.name}</h3>
              <div className="live-price"><b>{plan.price}</b><span>{plan.unit}</span></div>
              <div className="plan-lock"><b>PRICE LOCKED</b><span>Not an introductory rate</span></div>
              <p>{plan.description}</p>
              <ul>{plan.features.map((item) => <li key={item}>✓ {item}</li>)}</ul>
              <a href={plan.href}>Choose {plan.name}</a>
            </article>
          ))}
        </div>
        <div className="pricing-note">
          <b>No teaser pricing.</b>
          <span>Your base hosting subscription does not get more expensive because a promotional period ended.</span>
        </div>
      </section>

      <section className="price-lock-section" id="price-lock">
        <div className="price-lock-copy">
          <span>THE HOSTMYWEB PRICE LOCK</span>
          <h2>$7.99 means $7.99.</h2>
          <p>If Starter is $7.99 per month when you sign up, the base hosting rate remains $7.99 per month while you continuously keep that same plan active. You do not have to prepay for years to earn the advertised rate.</p>
          <div className="price-lock-examples">
            <article><small>MONTH 1</small><b>$7.99</b><span>Same monthly rate</span></article>
            <article><small>YEAR 1</small><b>$7.99/mo</b><span>No renewal jump</span></article>
            <article><small>YEAR 10</small><b>$7.99/mo</b><span>Still the same base rate</span></article>
          </div>
          <small className="price-lock-legal">Price Lock applies to the base hosting subscription while the same plan remains continuously active. Taxes, government-mandated fees, domains, optional add-ons, usage-based charges, and customer-requested plan changes are separate.</small>
        </div>

        <div className="price-comparison" aria-label="HostMyWeb pricing comparison">
          <div className="comparison-head">
            <span>PRICING COMPARISON</span>
            <h3>No renewal surprise.</h3>
          </div>
          <div className="comparison-row comparison-labels">
            <b>What happens?</b><strong>HostMyWeb</strong><span>Typical intro pricing</span>
          </div>
          <div className="comparison-row">
            <b>Advertised monthly rate</b><strong>Real ongoing rate</strong><span>Promotional rate</span>
          </div>
          <div className="comparison-row">
            <b>Renewal</b><strong>Same base price</strong><span>Often higher</span>
          </div>
          <div className="comparison-row">
            <b>Long contract required</b><strong>No</strong><span>Often</span>
          </div>
          <div className="comparison-row">
            <b>Renewal price jump</b><strong>$0</strong><span>Common</span>
          </div>
        </div>
      </section>

      <section className="section hosting-features-section" id="hosting-features">
        <header className="section-heading">
          <span>SHARED HOSTING FEATURES</span>
          <h2>The hosting tools should be visible before you buy.</h2>
          <p>HostMyWeb now explains the infrastructure and controls behind the plans instead of hiding the important details behind a generic “hosting” label. Package limits and advanced-tool access can vary by plan.</p>
        </header>
        <div className="hosting-feature-grid">
          {hostingFeatures.map((feature) => (
            <article key={feature.title}>
              <span>{feature.mark}</span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="migration-feature-strip">
          <div>
            <span>MIGRATIONS</span>
            <h3>Move it yourself or let us handle it.</h3>
            <p>Migration tools are included with hosting. If you want HostMyWeb to handle the move, configuration, DNS transition, and verification, done-for-you migration starts at $49.</p>
          </div>
          <div className="migration-options">
            <article><b>Included</b><strong>Migration tools</strong><span>For customers who want to move their own site.</span></article>
            <article><b>From $49</b><strong>Done-for-you migration</strong><span>Structured human-assisted migration and transition support.</span></article>
          </div>
        </div>
      </section>

      <section className="section products-section architectural-products" id="products">
        <header className="section-heading">
          <span>HOSTMYWEB PRODUCTS</span>
          <h2>The essentials, connected.</h2>
          <p>Shared hosting, domains, email, site creation, WordPress, and support stay part of one customer relationship instead of becoming six separate chores.</p>
        </header>
        <div className="product-grid storefront-product-grid">
          {products.map((product) => (
            <article className={product.title === "AI Website Builder" ? "ai-product-card" : ""} key={product.title}>
              <span className="product-icon">{product.icon}</span>
              <small>{product.price}</small>
              <h3>{product.title}</h3>
              <p>{product.text}</p>
              <a href={product.href}>Explore <span>→</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-builder-spotlight" id="ai-builder">
        <div className="ai-builder-copy">
          <span>AI WEBSITE BUILDER</span>
          <h2>Start with structure. Refine the experience from there.</h2>
          <p>Describe the business, shape the page structure, organize the services and contact journey, refine the content, connect the domain, and publish when the site is ready.</p>
          <div className="ai-builder-steps">
            <span><b>1</b> Describe</span>
            <span><b>2</b> Structure</span>
            <span><b>3</b> Refine</span>
            <span><b>4</b> Publish</span>
          </div>
          <a className="primary-button" href="/signup?product=ai-builder">Create an account →</a>
        </div>
        <div className="ai-builder-panel" aria-label="AI website builder workflow preview">
          <div className="ai-panel-head"><b>AI Website Builder</b><span>Connected to HostMyWeb</span></div>
          <div className="ai-prompt">
            <small>DESCRIBE THE SITE</small>
            <p>“Create a clean website for a local accounting firm with services, team, resources, location details, and a consultation request.”</p>
            <button type="button">Generate structure ✦</button>
          </div>
          <div className="ai-output-grid">
            <article><span>01</span><b>Home</b><small>Clear value proposition</small></article>
            <article><span>02</span><b>Services</b><small>Structured service pages</small></article>
            <article><span>03</span><b>Business Info</b><small>Team and local details</small></article>
            <article><span>04</span><b>Contact</b><small>Conversion-ready route</small></article>
          </div>
        </div>
      </section>

      <section className="hosting-section storefront-account-section architectural-account" id="hosting">
        <div className="hosting-copy">
          <span>CUSTOMER CONTROL</span>
          <h2>Your services should not require a support ticket to understand.</h2>
          <p>Your HostMyWeb account keeps hosting, domains, orders, renewals, and support history together so routine account work stays self-service.</p>
          <div className="hosting-checks">
            <span>✓ View hosting services</span><span>✓ Track domains</span><span>✓ View orders</span>
            <span>✓ Keep ticket history</span><span>✓ Add services</span><span>✓ Structured support</span>
          </div>
          <a className="primary-button" href="/signup">Create your account →</a>
        </div>
        <div className="hosting-console">
          <div className="console-head"><div><b>HostMyWeb Account</b><span>One place for the services you use</span></div><em>● Secure</em></div>
          <div className="account-feature-list">
            <article><b>Hosting</b><span>Plans and service status</span></article>
            <article><b>Domains</b><span>Domain status and renewals</span></article>
            <article><b>Email</b><span>Business email services</span></article>
            <article><b>Orders</b><span>Order and payment history</span></article>
            <article><b>Support</b><span>Structured tickets and history</span></article>
            <article><b>Account</b><span>Secure customer access</span></article>
          </div>
        </div>
      </section>

      <section className="section architectural-solutions" id="solutions">
        <header className="section-heading">
          <span>WHO HOSTMYWEB SERVES</span>
          <h2>Built for businesses that want less friction.</h2>
          <p>Use HostMyWeb directly for shared web hosting and related services, or let it operate quietly underneath a purpose-built platform when the workflow needs something more specialized.</p>
        </header>
        <div className="solution-chip-grid">
          {solutions.map((solution) => (
            <article key={solution.title}>
              <span>{solution.mark}</span>
              <div><h3>{solution.title}</h3><p>{solution.text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="support-section storefront-support" id="support">
        <div><span>SUPPORT WITHOUT THE RUNAROUND</span><h2>Self-service first. Human help when something actually needs a person.</h2></div>
        <div className="support-cards">
          <article><b>Account tools</b><p>See services, domains, orders, and account details without starting a support request.</p></article>
          <article><b>Structured support</b><p>Choose a category for hosting, domains, DNS, email, billing, migrations, or account help.</p></article>
          <article><b>Ticket history</b><p>Keep support requests and their status organized inside your customer account.</p></article>
        </div>
      </section>

      <section className="section contact-section storefront-custom" id="custom">
        <div className="contact-copy">
          <span className="eyebrow"><i /> CUSTOM &amp; COMPLEX WORK</span>
          <h2>Need a migration, multi-site setup, or something outside the standard plans?</h2>
          <p>Use this form for work that genuinely needs a custom setup or human review.</p>
          <div className="contact-points">
            <span>✓ Done-for-you migrations</span><span>✓ Multi-site moves</span>
            <span>✓ Custom infrastructure</span><span>✓ Business email migrations</span>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer className="site-footer storefront-footer architectural-footer">
        <div className="footer-promise">
          <div>
            <span>STRAIGHTFORWARD HOSTING</span>
            <h2>The price you see is the price you keep.</h2>
            <p>No teaser rate. No inflated hosting renewal. No multi-year commitment just to get the number printed on the page.</p>
          </div>
          <div className="footer-promise-actions">
            <a className="primary-button" href="#pricing">View Shared Hosting →</a>
            <a className="footer-secondary" href="#domains">Search Domains</a>
          </div>
        </div>

        <div className="footer-brand-row">
          <div className="footer-brand">
            <a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b></a>
            <p>Shared web hosting, domains, email, website services, and connected infrastructure with pricing designed to stay understandable after checkout.</p>
          </div>
          <div className="footer-trust">
            <span><b>PRICE LOCKED</b> Base hosting rate stays the same</span>
            <span><b>NO TEASER RATES</b> The advertised price is the real price</span>
            <span><b>SELF-SERVICE + HUMAN HELP</b> Use the account first; reach a person when needed</span>
          </div>
        </div>

        <div className="footer-link-grid">
          <div>
            <b>Hosting</b>
            <a href="#pricing">Shared Web Hosting</a>
            <a href="/signup?plan=starter">Starter Hosting</a>
            <a href="/signup?plan=business">Business Hosting</a>
            <a href="/signup?plan=pro">Pro Hosting</a>
            <a href="/signup?plan=agency">Agency Hosting</a>
            <a href="#products">Managed WordPress</a>
          </div>
          <div>
            <b>Domains &amp; Email</b>
            <a href="#domains">Domain Search</a>
            <a href="#domains">Domain Pricing</a>
            <a href="#products">Business Email</a>
            <a href="#hosting-features">DNS Management</a>
            <a href="#hosting-features">Email Controls</a>
          </div>
          <div>
            <b>Hosting Features</b>
            <a href="#hosting-features">SSL Certificates</a>
            <a href="#hosting-features">CDN</a>
            <a href="#hosting-features">Backups &amp; Restore</a>
            <a href="#hosting-features">Malware Scanning</a>
            <a href="#hosting-features">WAF &amp; DDoS Protection</a>
            <a href="#hosting-features">SSH &amp; Git</a>
          </div>
          <div>
            <b>Website Services</b>
            <a href="#ai-builder">AI Website Builder</a>
            <a href="#custom">Migration Tools</a>
            <a href="#custom">Done-for-You Migration</a>
            <a href="#custom">Custom Setup</a>
            <a href="#custom">Multi-Site Moves</a>
          </div>
          <div>
            <b>Ecosystem</b>
            <a href="https://dogbreederos.com" target="_blank" rel="noreferrer">DogBreederOS</a>
            <a href="https://dogbreederweb.site" target="_blank" rel="noreferrer">DogBreederWeb</a>
            <a href="https://dogbreederdocs.online" target="_blank" rel="noreferrer">DogBreederDocs</a>
            <a href="#ecosystem">Shared Architecture</a>
            <a href="#solutions">Who We Serve</a>
          </div>
          <div>
            <b>Account &amp; Support</b>
            <a href="/account">Log In</a>
            <a href="/signup">Create Account</a>
            <a href="/account">Service Management</a>
            <a href="/account">Support Tickets</a>
            <a href="#support">Support</a>
            <a href="#custom">Custom Help</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} HostMyWeb.co. All rights reserved.</span>
          <div><b>Price Lock</b><i />No teaser hosting rates<i />Transparent renewals</div>
        </div>
      </footer>
    </main>
  );
}
