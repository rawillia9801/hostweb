import { ContactForm } from "@/components/contact-form";
import { DomainSearch } from "@/components/domain-search";

const products = [
  { icon: "▦", title: "Web Hosting", price: "From $7.99/mo", text: "Fast hosting with SSL, backups, DNS tools, and a customer account that keeps routine service work organized.", href: "#pricing" },
  { icon: "◎", title: "Domains & DNS", price: "From $14.99/yr", text: "Search, register, renew, and manage domains with straightforward year-to-year pricing.", href: "#domains" },
  { icon: "✉", title: "Business Email", price: "From $2.99/mo", text: "Professional email on your own domain, connected to the same HostMyWeb account.", href: "/signup?product=email" },
  { icon: "✦", title: "AI Website Builder", price: "AI-assisted site creation", text: "Describe what you need, refine the structure and content, then connect the finished site to your hosting and domain.", href: "#ai-builder" },
  { icon: "W", title: "Managed WordPress", price: "From $9.99/mo", text: "WordPress-ready hosting with SSL, backups, and a cleaner way to keep the technical side under control.", href: "#pricing" },
  { icon: "↗", title: "Migrations & Support", price: "Assisted moves from $49", text: "Move an existing website or request structured help without turning every task into an open-ended project.", href: "#custom" },
] as const;

const plans = [
  { name: "Starter", price: "$7.99", unit: "/mo", description: "A simple home for one business website.", features: ["1 website", "SSL included", "5 business mailboxes", "Backups", "Customer account"], href: "/signup?plan=starter", popular: false },
  { name: "Business", price: "$12.99", unit: "/mo", description: "For established businesses with multiple sites and email users.", features: ["Up to 5 websites", "SSL included", "25 business mailboxes", "Daily backups", "Customer account"], href: "/signup?plan=business", popular: true },
  { name: "Pro", price: "$21.99", unit: "/mo", description: "More room for larger sites and multiple projects.", features: ["Up to 15 websites", "SSL included", "50 business mailboxes", "Daily backups", "Priority support queue"], href: "/signup?plan=pro", popular: false },
  { name: "Agency", price: "$39.99", unit: "/mo", description: "For agencies, operators, and multi-site businesses.", features: ["Up to 30 websites", "Multi-site organization", "100 business mailboxes", "Daily backups", "Priority support queue"], href: "/signup?plan=agency", popular: false },
] as const;

const domainPrices = [
  { tld: ".com", price: "$17.99", note: "registration & renewal" },
  { tld: ".org", price: "$17.99", note: "registration & renewal" },
  { tld: ".net", price: "$19.99", note: "registration & renewal" },
  { tld: ".us", price: "$14.99", note: "registration & renewal" },
] as const;

const solutions = [
  { mark: "S", title: "Small Businesses", text: "Hosting, domains, email, and website tools without unnecessary complexity." },
  { mark: "V", title: "Service Businesses", text: "A dependable online foundation for local and professional service companies." },
  { mark: "O", title: "Online Stores", text: "Hosting and domain infrastructure for commerce sites and product businesses." },
  { mark: "C", title: "Creators", text: "Websites, domains, and email for creators who want a professional home online." },
  { mark: "A", title: "Agencies", text: "Multi-site hosting and account organization for teams managing client work." },
  { mark: "B", title: "Breeders", text: "Hosting plus a connected software ecosystem built around breeder operations." },
] as const;

const ecosystemProducts = [
  { name: "HostMyWeb", type: "Infrastructure Foundation", text: "Hosting, domains, email, account services, and the infrastructure layer underneath the connected product family.", href: "#top", foundation: true, mark: "H" },
  { name: "MyDogPortal", type: "Breeder Operating System", text: "Operations, applications, buyers, litters, puppies, portals, communications, and breeder workflows.", href: "https://mydogportal.site", foundation: false, mark: "M" },
  { name: "DogBreederWeb", type: "Breeder Website Platform", text: "Breeder websites, BreederWeb Designer, custom domains, publishing, and connected breeder records.", href: "https://dogbreederweb.site", foundation: false, mark: "W" },
  { name: "DogBreederDocs", type: "Breeder Document Platform", text: "Reusable breeder documents, agreements, editing, sending, and e-signature workflows.", href: "https://dogbreederdocs.online", foundation: false, mark: "D" },
] as const;

export default function HomePage() {
  return (
    <main id="top">
      <header className="site-header storefront-header architectural-header">
        <a className="brand" href="#top" aria-label="HostMyWeb home">
          <span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#pricing">Hosting</a>
          <a href="#domains">Domains</a>
          <a href="#products">Email</a>
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
          <span className="architecture-kicker">HOST MY WEB</span>
          <h1>Straightforward Pricing.<br /><em>No Gimmicks.</em></h1>
          <p>Reliable hosting, fair domain pricing, business email, and connected software—without teaser rates, hidden catches, or confusing plans.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#pricing">View Pricing <span>→</span></a>
            <a className="secondary-button" href="#domains">Search Domains</a>
          </div>
          <div className="hero-price-line">
            <span>Hosting from <b>$7.99/mo</b></span>
            <i />
            <span>.com <b>$17.99/yr</b></span>
            <i />
            <span><b>Same fair renewal pricing</b></span>
          </div>
          <div className="proof-row architectural-proof">
            <span><b>✓</b> Transparent renewals</span>
            <span><b>✓</b> Secure infrastructure</span>
            <span><b>✓</b> Customer self-service</span>
            <span><b>✓</b> Human support when needed</span>
          </div>
        </div>

        <div className="architecture-visual" aria-label="HostMyWeb infrastructure architecture">
          <div className="architecture-glow" />
          <div className="architecture-grid-lines" />
          <div className="architecture-core">
            <span className="brand-mark architecture-mark"><i /><i /><i /></span>
            <small>INFRASTRUCTURE LAYER</small>
            <strong>HostMyWeb</strong>
            <p>One foundation for the services and software your business uses.</p>
          </div>
          <div className="architecture-node node-hosting"><span>▦</span><div><b>Web Hosting</b><small>Fast, secure hosting</small></div></div>
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
          <h2>One infrastructure layer.<br />Multiple purpose-built solutions.</h2>
          <p>HostMyWeb is a complete hosting company on its own—and the infrastructure foundation behind specialized software built for specific workflows.</p>
        </div>
        <div className="ecosystem-flow">
          {ecosystemProducts.map((product, index) => (
            <a
              className={`ecosystem-node-card ${product.foundation ? "foundation" : ""}`}
              href={product.href}
              key={product.name}
              target={product.foundation ? undefined : "_blank"}
              rel={product.foundation ? undefined : "noreferrer"}
            >
              <span className="ecosystem-node-mark">{product.mark}</span>
              <small>{product.type}</small>
              <h3>{product.name}</h3>
              <p>{product.text}</p>
              <b>{product.foundation ? "You are here" : "Explore product →"}</b>
              {index < ecosystemProducts.length - 1 && <i className="ecosystem-connector" aria-hidden="true" />}
            </a>
          ))}
        </div>
      </section>

      <section className="section plans-section architectural-pricing" id="pricing">
        <header className="section-heading">
          <span>STRAIGHTFORWARD HOSTING PRICING</span>
          <h2>Pick the plan that fits.</h2>
          <p>Clear monthly hosting prices, SSL included, and room to upgrade when your actual usage calls for it.</p>
        </header>
        <div className="plan-grid">
          {plans.map((plan) => (
            <article className={plan.popular ? "featured-plan" : ""} key={plan.name}>
              {plan.popular && <em>MOST POPULAR</em>}
              <h3>{plan.name}</h3>
              <div className="live-price"><b>{plan.price}</b><span>{plan.unit}</span></div>
              <p>{plan.description}</p>
              <ul>{plan.features.map((item) => <li key={item}>✓ {item}</li>)}</ul>
              <a href={plan.href}>Choose {plan.name}</a>
            </article>
          ))}
        </div>
        <div className="pricing-note">
          <b>No teaser pricing.</b>
          <span>No inflated domain renewal surprise. No reason to upgrade the underlying infrastructure until customer usage requires it.</span>
        </div>
      </section>

      <section className="section products-section architectural-products" id="products">
        <header className="section-heading">
          <span>HOSTMYWEB PRODUCTS</span>
          <h2>The essentials, connected.</h2>
          <p>Hosting, domains, email, site creation, WordPress, and support stay part of one customer relationship instead of becoming six separate chores.</p>
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
          <h2>Start with what your business needs. Refine from there.</h2>
          <p>Describe your business, shape the structure, refine the content, connect your domain, and publish when the site is ready.</p>
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
            <p>“Create a clean website for a local accounting firm with services, team, resources, and a consultation request.”</p>
            <button type="button">Generate structure ✦</button>
          </div>
          <div className="ai-output-grid">
            <article><span>01</span><b>Home</b><small>Clear value proposition</small></article>
            <article><span>02</span><b>Services</b><small>Structured service pages</small></article>
            <article><span>03</span><b>About</b><small>Team and trust signals</small></article>
            <article><span>04</span><b>Contact</b><small>Conversion-ready form</small></article>
          </div>
        </div>
      </section>

      <section className="hosting-section storefront-account-section architectural-account" id="hosting">
        <div className="hosting-copy">
          <span>CUSTOMER CONTROL</span>
          <h2>Your services should not require a support ticket to understand.</h2>
          <p>Your HostMyWeb account keeps hosting, domains, orders, renewals, and support history together so routine account work stays self-service.</p>
          <div className="hosting-checks">
            <span>✓ View services</span><span>✓ Track domains</span><span>✓ View orders</span>
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
          <p>Use the core hosting company as-is, or move into a purpose-built product when your workflow needs something more specialized.</p>
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
            <span>✓ Complex migrations</span><span>✓ Multi-site moves</span>
            <span>✓ Custom infrastructure</span><span>✓ Business email migrations</span>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer className="site-footer storefront-footer architectural-footer">
        <div className="footer-brand">
          <a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b></a>
          <p>Straightforward hosting, domains, email, and connected infrastructure.</p>
        </div>
        <div><b>Products</b><a href="#pricing">Web Hosting</a><a href="#domains">Domains &amp; DNS</a><a href="#products">Business Email</a><a href="#ai-builder">AI Website Builder</a><a href="#products">Managed WordPress</a></div>
        <div><b>Ecosystem</b><a href="https://mydogportal.site" target="_blank" rel="noreferrer">MyDogPortal</a><a href="https://dogbreederweb.site" target="_blank" rel="noreferrer">DogBreederWeb</a><a href="https://dogbreederdocs.online" target="_blank" rel="noreferrer">DogBreederDocs</a><a href="#ecosystem">Architecture</a></div>
        <div><b>Account</b><a href="/account">Log In</a><a href="/signup">Create Account</a><a href="/account">Services</a><a href="/account">Domains</a><a href="/account">Support Tickets</a></div>
        <div><b>Support</b><a href="#support">Support</a><a href="#custom">Migrations</a><a href="#custom">Custom Setup</a><a href="#domains">Domain Search</a></div>
        <small>© 2026 HostMyWeb.co. All rights reserved.</small>
      </footer>
    </main>
  );
}
