import { ContactForm } from "@/components/contact-form";
import { DomainSearch } from "@/components/domain-search";

const products = [
  { icon: "▦", title: "Web Hosting", price: "From $7.99/mo", text: "Fast hosting for business websites with SSL, backups, email options, DNS tools, and a customer account.", href: "#pricing" },
  { icon: "W", title: "WordPress Hosting", price: "From $9.99/mo", text: "WordPress-ready hosting with SSL, backups, and a straightforward place to keep service details organized.", href: "#pricing" },
  { icon: "◎", title: "Domains", price: "From $14.99/yr", text: "Search domains with fair renewal pricing and keep registered domains organized in your HostMyWeb account.", href: "#domains" },
  { icon: "✉", title: "Business Email", price: "From $2.99/mo", text: "Professional mailbox options for businesses that want email on their own domain.", href: "/signup?product=email" },
  { icon: "◇", title: "SSL & Security", price: "Free SSL included", text: "HTTPS and SSL options for hosted websites, with clear service status in your account.", href: "/signup?product=hosting" },
  { icon: "↗", title: "Website Migrations", price: "Assisted moves from $49", text: "Move an existing website with a defined migration service instead of an open-ended support request.", href: "#custom" },
] as const;

const plans = [
  { name: "Starter", price: "$7.99", unit: "/mo", description: "A simple home for one business website.", features: ["1 website", "SSL included", "5 business mailboxes", "Backups", "Customer account"], href: "/signup?plan=starter", popular: false },
  { name: "Business", price: "$12.99", unit: "/mo", description: "For growing businesses with multiple sites and email users.", features: ["Up to 5 websites", "SSL included", "25 business mailboxes", "Daily backups", "Customer account"], href: "/signup?plan=business", popular: true },
  { name: "Pro", price: "$21.99", unit: "/mo", description: "More room for established sites and multiple projects.", features: ["Up to 15 websites", "SSL included", "50 business mailboxes", "Daily backups", "Priority support queue"], href: "/signup?plan=pro", popular: false },
  { name: "Agency", price: "$39.99", unit: "/mo", description: "For agencies, operators, and multi-brand businesses.", features: ["Up to 30 websites", "Multi-site service organization", "100 business mailboxes", "Daily backups", "Priority support queue"], href: "/signup?plan=agency", popular: false },
] as const;

const domainPrices = [
  { tld: ".com", price: "$17.99", note: "registration & renewal" },
  { tld: ".org", price: "$17.99", note: "registration & renewal" },
  { tld: ".net", price: "$19.99", note: "registration & renewal" },
  { tld: ".us", price: "$14.99", note: "registration & renewal" },
] as const;

const solutions = [
  { mark: "B", title: "Breeders", text: "Hosting, websites, portals, and connected tools for professional breeding businesses." },
  { mark: "L", title: "Local Businesses", text: "Web hosting, domains, and business email for a dependable local presence." },
  { mark: "S", title: "Online Shops", text: "Hosting and domain infrastructure for product brands and growing stores." },
  { mark: "P", title: "Service Brands", text: "A polished online foundation for professionals, consultants, and service companies." },
] as const;

const specializedProducts = [
  { name: "MyDogPortal", type: "Breeder Operating System", text: "Manage breeders, puppies, families, portals, communications, and day-to-day operations.", href: "https://mydogportal.site" },
  { name: "DogBreederWeb", type: "Breeder Website Platform", text: "Build breeder websites that connect applications, customer journeys, and business workflows.", href: "https://dogbreederweb.site" },
  { name: "DogBreederDocs", type: "Breeder Document Platform", text: "Create, manage, send, and complete professional breeder documents and agreements.", href: "https://dogbreederdocs.online" },
] as const;

export default function HomePage() {
  return (
    <main id="top">
      <header className="site-header storefront-header">
        <a className="brand" href="#top" aria-label="HostMyWeb home"><span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b></a>
        <nav aria-label="Primary navigation"><a href="#hosting">Hosting</a><a href="#domains">Domains</a><a href="#products">Products</a><a href="#solutions">Solutions</a><a href="#pricing">Pricing</a></nav>
        <div className="header-actions"><a className="login-link" href="/account">Log In</a><a className="nav-cta" href="/signup">Create Account</a></div>
      </header>

      <section className="hero storefront-hero">
        <div className="hero-copy">
          <span className="eyebrow"><i /> Hosting that is simple to understand and easy to manage.</span>
          <h1>Web Hosting,<br />Domains &amp; Business Email —<br /><em>Built for Real Brands</em></h1>
          <p>HostMyWeb gives businesses one account for services, domains, orders, renewals, and support so routine account work stays organized in one place.</p>
          <div className="hero-actions"><a className="primary-button" href="#pricing">View Hosting Plans <span>→</span></a><a className="secondary-button" href="#domains">Search Domains</a></div>
          <div className="proof-row"><span><b>✓</b> Customer accounts</span><span><b>✓</b> Live domain search</span><span><b>✓</b> Clear renewal pricing</span><span><b>✓</b> Human help when needed</span></div>
        </div>

        <div className="dashboard-shell" aria-label="HostMyWeb customer dashboard preview">
          <div className="dashboard-windowbar"><span /><span /><span /><div>account.hostmyweb.co</div></div>
          <div className="dashboard-top"><div className="mini-brand"><span className="mini-mark">H</span><b>HostMyWeb</b></div><div className="account-chip">My Brand Co.⌄</div></div>
          <div className="dashboard-body">
            <aside><b>Overview</b><span>Services</span><span>Domains</span><span>Orders</span><span>Billing</span><span>Support</span></aside>
            <section>
              <header><div><small>ACCOUNT OVERVIEW</small><h2>Everything in one place.</h2></div><span className="online-dot">● Secure</span></header>
              <div className="metric-grid">
                <article><small>DOMAIN</small><b>mybrand.com</b><em>Active</em><span>Renewal tracked</span></article>
                <article><small>WEB HOSTING</small><b>Business</b><em>Active</em><span>Website service</span></article>
                <article><small>BUSINESS EMAIL</small><b>5 mailboxes</b><em>Active</em><span>Email service</span></article>
                <article><small>ORDERS</small><b>3 orders</b><em>Current</em><span>Order history</span></article>
                <article><small>SUPPORT</small><b>No open issues</b><em>Clear</em><span>Ticket history</span></article>
                <article><small>ACCOUNT</small><b>Verified</b><em>Secure</em><span>Customer access</span></article>
              </div>
              <div className="dashboard-lower"><article><b>Account snapshot</b><label>Services <span>3</span></label><i><span style={{width:"65%"}} /></i><label>Domains <span>2</span></label><i><span style={{width:"42%"}} /></i></article><article><b>Quick links</b><span>View services →</span><span>View domains →</span><span>Order history →</span><span>Open support ticket →</span></article></div>
            </section>
          </div>
        </div>
      </section>

      <section className="domain-band storefront-domain" id="domains">
        <div className="domain-band-copy"><span>DOMAINS</span><h2>Find the domain your business should own.</h2><p>Search live availability and see straightforward year-to-year pricing before you create your HostMyWeb account.</p></div>
        <div><DomainSearch /><div className="domain-price-grid">{domainPrices.map((item) => <article key={item.tld}><b>{item.tld}</b><strong>{item.price}<small>/yr</small></strong><span>{item.note}</span></article>)}</div></div>
      </section>

      <section className="section products-section" id="products">
        <header className="section-heading centered"><span>HOSTMYWEB PRODUCTS</span><h2>Everything you expect from a real hosting company.</h2><p>Choose the service you need, create an account, and keep your HostMyWeb services together.</p></header>
        <div className="product-grid storefront-product-grid">{products.map((product) => <article key={product.title}><span className="product-icon">{product.icon}</span><small>{product.price}</small><h3>{product.title}</h3><p>{product.text}</p><a href={product.href}>View product <span>→</span></a></article>)}</div>
      </section>

      <section className="hosting-section storefront-account-section" id="hosting">
        <div className="hosting-copy"><span>YOUR HOSTMYWEB ACCOUNT</span><h2>A customer account first. Support when you actually need it.</h2><p>Your account keeps services, domains, orders, renewals, and support together so routine account work does not have to begin with a support request.</p><div className="hosting-checks"><span>✓ View services</span><span>✓ Track domains</span><span>✓ View orders</span><span>✓ Keep ticket history</span><span>✓ Add services</span><span>✓ Structured support</span></div><a className="primary-button" href="/signup">Create your account →</a></div>
        <div className="hosting-console"><div className="console-head"><div><b>Your account</b><span>One place for the services you use</span></div><em>● Secure</em></div><div className="account-feature-list"><article><b>Hosting</b><span>Plans and service status</span></article><article><b>Domains</b><span>Domain status and renewals</span></article><article><b>Email</b><span>Business email services</span></article><article><b>Orders</b><span>Order and payment history</span></article><article><b>Support</b><span>Structured tickets and history</span></article><article><b>Account</b><span>Secure customer access</span></article></div></div>
      </section>

      <section className="section plans-section" id="pricing">
        <header className="section-heading centered"><span>WEB HOSTING</span><h2>Simple plans with straightforward monthly pricing.</h2><p>SSL is included. Upgrade when your business needs more sites, mailboxes, or support capacity.</p></header>
        <div className="plan-grid">{plans.map((plan) => <article className={plan.popular ? "featured-plan" : ""} key={plan.name}>{plan.popular && <em>MOST POPULAR</em>}<h3>{plan.name}</h3><div className="live-price"><b>{plan.price}</b><span>{plan.unit}</span></div><p>{plan.description}</p><ul>{plan.features.map(item => <li key={item}>✓ {item}</li>)}</ul><a href={plan.href}>Choose {plan.name}</a></article>)}</div>
        <div className="pricing-note"><b>No teaser domain pricing.</b><span>Common domain extensions are priced to stay reasonable at registration and renewal instead of jumping sharply in year two.</span></div>
      </section>

      <section className="section solutions-section" id="solutions">
        <header className="section-heading centered"><span>SOLUTIONS FOR GROWING BRANDS</span><h2>Built for more than one niche.</h2><p>Use HostMyWeb for an ordinary business website or explore a purpose-built platform designed around a specialized workflow.</p></header>
        <div className="audience-grid">{solutions.map((solution, index) => <article key={solution.title}><div className={`audience-visual visual-${index+1}`}><span>{solution.mark}</span><div className="visual-lines"><i /><i /><i /></div></div><small>HOSTMYWEB SOLUTION</small><h3>{solution.title}</h3><p>{solution.text}</p><a href="/signup">Get started →</a></article>)}</div>
      </section>

      <section className="ecosystem section" id="ecosystem">
        <header className="section-heading centered"><span>SPECIALIZED PLATFORMS</span><h2>Powering purpose-built solutions.</h2><p>Explore focused software products built for businesses with specialized workflows.</p></header>
        <div className="ecosystem-grid specialized-grid">{specializedProducts.map((product) => <a className="ecosystem-card" href={product.href} key={product.name} target="_blank" rel="noreferrer"><span className="ecosystem-logo">{product.name.slice(0,1)}</span><small>{product.type}</small><h3>{product.name}</h3><p>{product.text}</p><b>Visit product →</b></a>)}</div>
      </section>

      <section className="support-section storefront-support" id="support">
        <div><span>SUPPORT WITHOUT THE RUNAROUND</span><h2>Keep common account work organized. Send a ticket when something actually needs a person.</h2></div>
        <div className="support-cards"><article><b>Account tools</b><p>See services, domains, orders, and account details without starting a support request.</p></article><article><b>Structured support</b><p>Choose a category for hosting, domains, DNS, email, billing, migrations, or account help.</p></article><article><b>Ticket history</b><p>Keep support requests and their status organized inside your customer account.</p></article></div>
      </section>

      <section className="section contact-section storefront-custom" id="custom">
        <div className="contact-copy"><span className="eyebrow"><i /> CUSTOM &amp; COMPLEX WORK</span><h2>Need a migration, multi-site setup, or something outside the standard plans?</h2><p>Use this form for work that genuinely needs a custom setup or human review.</p><div className="contact-points"><span>✓ Complex migrations</span><span>✓ Multi-site moves</span><span>✓ Custom infrastructure</span><span>✓ Business email migrations</span></div></div>
        <ContactForm />
      </section>

      <footer className="site-footer storefront-footer">
        <div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b></a><p>Web hosting, domains, business email, and connected infrastructure for real businesses.</p></div>
        <div><b>Products</b><a href="#pricing">Web Hosting</a><a href="#products">WordPress Hosting</a><a href="#domains">Domains</a><a href="#products">Business Email</a><a href="#products">SSL &amp; Security</a></div>
        <div><b>Account</b><a href="/account">Log In</a><a href="/signup">Create Account</a><a href="/account">Services</a><a href="/account">Domains</a><a href="/account">Support Tickets</a></div>
        <div><b>Solutions</b><a href="#solutions">Local Businesses</a><a href="#solutions">Online Shops</a><a href="#solutions">Service Brands</a><a href="#ecosystem">Specialized Platforms</a></div>
        <div><b>Support</b><a href="#support">Support</a><a href="#custom">Migrations</a><a href="#custom">Custom Setup</a><a href="#domains">Domain Search</a></div>
        <small>© 2026 HostMyWeb.co. All rights reserved.</small>
      </footer>
    </main>
  );
}
