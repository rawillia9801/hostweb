import { ContactForm } from "@/components/contact-form";
import { DomainSearch } from "@/components/domain-search";

const plans = [
  {
    name: "Starter",
    price: "$7.99",
    unit: "/mo",
    code: "HMW-01",
    fit: "Single business site",
    description: "A clean starting point for one business website with the core hosting and security tools included.",
    features: ["1 website", "SSL + CDN included", "5 business mailboxes included", "Backups", "Malware scanning", "DNS & file tools"],
    href: "/signup?plan=starter",
    popular: false,
  },
  {
    name: "Business",
    price: "$12.99",
    unit: "/mo",
    code: "HMW-05",
    fit: "Growing business",
    description: "For established businesses managing several sites, more included mailboxes, and day-to-day database work.",
    features: ["Up to 5 websites", "SSL + CDN included", "25 business mailboxes included", "Daily backups", "Security tools", "Database management"],
    href: "/signup?plan=business",
    popular: true,
  },
  {
    name: "Pro",
    price: "$21.99",
    unit: "/mo",
    code: "HMW-15",
    fit: "Larger projects",
    description: "More room for larger sites and multiple projects, with developer-oriented tools and priority support.",
    features: ["Up to 15 websites", "SSL + CDN included", "50 business mailboxes included", "Daily backups", "SSH & Git tools", "Priority support queue"],
    href: "/signup?plan=pro",
    popular: false,
  },
  {
    name: "Agency",
    price: "$39.99",
    unit: "/mo",
    code: "HMW-30",
    fit: "Multi-site operations",
    description: "For agencies, operators, and multi-site businesses that need more organization and higher account capacity.",
    features: ["Up to 30 websites", "Multi-site organization", "100 business mailboxes included", "Daily backups", "Advanced hosting tools", "Priority support queue"],
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
  { mark: "SSL", title: "SSL certificates", text: "Keep websites encrypted without turning basic security into a separate add-on.", status: "Included" },
  { mark: "CDN", title: "Content delivery network", text: "Serve site assets through a distributed delivery layer for faster visitor access.", status: "Active" },
  { mark: "SEC", title: "Malware scanning", text: "Hosting security tools help identify malicious files and suspicious website activity.", status: "Protected" },
  { mark: "WAF", title: "WAF & DDoS protection", text: "Network and application-layer protections help reduce common automated and denial-of-service threats.", status: "Protected" },
  { mark: "BK", title: "Backup & restore", text: "Keep recoverable copies of website data and restore when something goes wrong.", status: "Ready" },
  { mark: "1×", title: "One-click applications", text: "Launch common web applications without manually building every installation from scratch.", status: "Available" },
  { mark: "WP", title: "WordPress tools", text: "Manage WordPress sites with hosting controls built around common maintenance tasks.", status: "Available" },
  { mark: "FM", title: "File management", text: "Work with website files through browser-based tools plus supported transfer access.", status: "Available" },
  { mark: "DB", title: "Database management", text: "Create and manage site databases with familiar administration tools.", status: "Available" },
  { mark: "DNS", title: "DNS management", text: "Manage the records that connect domains, websites, email, and other services.", status: "Available" },
  { mark: "DEV", title: "SSH & Git", text: "Developer-oriented access and version-control workflows are available where the selected package supports them.", status: "By plan" },
  { mark: "MAIL", title: "Email controls", text: "Manage business mailboxes, forwarding, aliases, spam controls, and related email settings.", status: "Available" },
] as const;

const products = [
  {
    mark: "WEB",
    title: "Shared Web Hosting",
    outcome: "A dependable home for your website.",
    meta: "From $7.99/mo",
    text: "Hosting, SSL, CDN, backups, security tools, DNS controls, and account management in one service relationship.",
    href: "#pricing",
  },
  {
    mark: "DNS",
    title: "Domains & DNS",
    outcome: "Your business name on the web.",
    meta: "From $14.99/yr",
    text: "Search, register, renew, and manage your domain with the registration and renewal price visible before checkout.",
    href: "#domains",
  },
  {
    mark: "MAIL",
    title: "Business Email",
    outcome: "Professional email @ your domain.",
    meta: "From $2.99/mo",
    text: "Use an address like you@yourcompany.com and keep business email connected to the same HostMyWeb account.",
    href: "/signup?product=email",
  },
  {
    mark: "WP",
    title: "Managed WordPress",
    outcome: "WordPress without wrestling with the hosting.",
    meta: "From $9.99/mo",
    text: "WordPress-ready hosting with SSL, backups, security tools, and common management controls together.",
    href: "#pricing",
  },
  {
    mark: "AI",
    title: "AI Website Builder",
    outcome: "Go from an idea to a live website.",
    meta: "Guided creation",
    text: "Describe what you need, shape the structure, refine the content, connect the domain, and publish when it is ready.",
    href: "#ai-builder",
  },
] as const;

const websiteFlow = ["Domain", "Hosting", "SSL + Security", "Business Email", "Backups", "Account"] as const;
const growthFlow = ["AI Website Builder", "WordPress", "Migration", "Support"] as const;

const solutions = [
  { mark: "01", title: "Small Businesses", text: "Hosting, domains, email, and website tools without unnecessary complexity." },
  { mark: "02", title: "Service Businesses", text: "A dependable online foundation for local and professional service companies." },
  { mark: "03", title: "Online Stores", text: "Hosting and domain infrastructure for commerce sites and product businesses." },
  { mark: "04", title: "Creators", text: "Websites, domains, and email for creators who want a professional home online." },
  { mark: "05", title: "Agencies", text: "Multi-site hosting and account organization for teams managing client work." },
  { mark: "06", title: "Vertical Software", text: "A shared service layer that can sit underneath purpose-built business platforms." },
] as const;

const ecosystemProducts = [
  {
    name: "HostMyWeb",
    type: "Shared Hosting Foundation",
    text: "Hosting, domains, DNS, email, provisioning, account services, billing support, and reusable infrastructure.",
    href: "#top",
    mark: "HMW",
    status: "CORE",
    current: true,
  },
  {
    name: "DogBreederOS",
    type: "Flagship Vertical Platform",
    text: "A complete operating environment for modern dog breeding programs, powered by connected services and infrastructure.",
    href: "https://dogbreederos.com",
    mark: "DBOS",
    status: "CONNECTED",
    current: false,
  },
  {
    name: "DogBreederWeb",
    type: "Connected Website Capability",
    text: "Breeder websites, guided creation, custom domains, publishing, and connected breeder records.",
    href: "https://dogbreederweb.site",
    mark: "DBW",
    status: "CONNECTED",
    current: false,
  },
  {
    name: "DogBreederDocs",
    type: "Connected Document Capability",
    text: "Reusable breeder documents, agreements, editing, sending, and e-signature workflows.",
    href: "https://dogbreederdocs.online",
    mark: "DBD",
    status: "CONNECTED",
    current: false,
  },
] as const;

const footerColumns = [
  {
    title: "Hosting",
    links: [
      ["Shared Web Hosting", "#pricing"],
      ["Starter Hosting", "/signup?plan=starter"],
      ["Business Hosting", "/signup?plan=business"],
      ["Pro Hosting", "/signup?plan=pro"],
      ["Agency Hosting", "/signup?plan=agency"],
      ["Managed WordPress", "#products"],
    ],
  },
  {
    title: "Domains & Email",
    links: [
      ["Domain Search", "#domains"],
      ["Domain Pricing", "#domains"],
      ["Business Email", "#products"],
      ["DNS Management", "#hosting-features"],
      ["Email Controls", "#hosting-features"],
    ],
  },
  {
    title: "Infrastructure",
    links: [
      ["SSL Certificates", "#hosting-features"],
      ["CDN", "#hosting-features"],
      ["Backups & Restore", "#hosting-features"],
      ["Malware Scanning", "#hosting-features"],
      ["WAF & DDoS Protection", "#hosting-features"],
      ["SSH & Git", "#hosting-features"],
    ],
  },
  {
    title: "Website Services",
    links: [
      ["AI Website Builder", "#ai-builder"],
      ["Website Migration", "#switching"],
      ["Done-for-You Migration", "#switching"],
      ["Custom Setup", "#custom"],
      ["Multi-Site Moves", "#custom"],
    ],
  },
  {
    title: "Ecosystem",
    links: [
      ["DogBreederOS", "https://dogbreederos.com"],
      ["DogBreederWeb", "https://dogbreederweb.site"],
      ["DogBreederDocs", "https://dogbreederdocs.online"],
      ["Shared Architecture", "#ecosystem"],
      ["Who We Serve", "#solutions"],
    ],
  },
  {
    title: "Account & Support",
    links: [
      ["Log In", "/account"],
      ["Create Account", "/signup"],
      ["Service Management", "/account"],
      ["Support Tickets", "/account"],
      ["Support", "#support"],
      ["Custom Help", "#custom"],
    ],
  },
] as const;

export default function HomePage() {
  return (
    <main id="top" className="hmw-page">
      <header className="site-header hmw-header">
        <a className="brand hmw-brand" href="#top" aria-label="HostMyWeb home">
          <span className="brand-mark"><i /><i /><i /></span>
          <span><b>HostMyWeb</b><small>HOSTING OPERATIONS</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#pricing">Hosting</a>
          <a href="#products">Products</a>
          <a href="#hosting-features">Included</a>
          <a href="#domains">Domains</a>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#support">Support</a>
        </nav>
        <div className="header-actions">
          <a className="login-link" href="/account">Log In</a>
          <a className="nav-cta" href="/signup">Get Started</a>
        </div>
      </header>

      <section className="hmw-command-hero">
        <div className="hmw-hero-copy">
          <div className="hmw-status-label"><i /> HOSTMYWEB MISSION CONTROL <span>PUBLIC HOSTING NETWORK</span></div>
          <h1>Web hosting without the <em>renewal trap.</em></h1>
          <p>Shared web hosting, domains, business email, website services, and account controls in one operational layer—with a base hosting price that does not jump because an introductory period ended.</p>
          <div className="hmw-hero-actions">
            <a className="primary-button" href="#pricing">View Shared Hosting <span>→</span></a>
            <a className="hmw-outline-button" href="#products">See What HostMyWeb Does</a>
          </div>
          <div className="hmw-price-callout">
            <div><small>STARTER HOSTING</small><strong>$7.99<span>/mo</span></strong></div>
            <div><small>RENEWAL RATE</small><strong>$7.99<span>/mo</span></strong></div>
            <div><small>PRICE JUMP</small><strong>$0</strong></div>
          </div>
          <small className="hmw-hero-note">No long-term contract is required to get the advertised hosting price.</small>
        </div>

        <div className="hmw-control-board" aria-label="HostMyWeb service operations overview">
          <div className="hmw-console-topbar">
            <div><i /><span>HOSTMYWEB CONTROL</span></div>
            <div><b>SYSTEM ONLINE</b><span>●</span></div>
          </div>
          <div className="hmw-console-grid">
            <article className="hmw-console-card hmw-console-card-core">
              <div className="hmw-console-mark">H</div>
              <small>CORE SERVICE LAYER</small>
              <h2>HostMyWeb</h2>
              <p>Shared infrastructure with customer-facing control.</p>
              <div className="hmw-core-status"><span>Hosting</span><span>Domains</span><span>Email</span><span>Support</span></div>
            </article>
            <article className="hmw-console-card"><span className="hmw-module-code">WEB</span><small>HOSTING</small><b>Shared Web Hosting</b><em>ONLINE</em></article>
            <article className="hmw-console-card"><span className="hmw-module-code">DNS</span><small>DOMAIN LAYER</small><b>Domains & DNS</b><em>READY</em></article>
            <article className="hmw-console-card"><span className="hmw-module-code">MAIL</span><small>MESSAGING</small><b>Business Email</b><em>READY</em></article>
            <article className="hmw-console-card"><span className="hmw-module-code">AI</span><small>BUILD SYSTEM</small><b>AI Site Builder</b><em>READY</em></article>
            <article className="hmw-console-card"><span className="hmw-module-code">SEC</span><small>PROTECTION</small><b>Security Layer</b><em>ACTIVE</em></article>
            <article className="hmw-console-card"><span className="hmw-module-code">ACC</span><small>CONTROL</small><b>Customer Account</b><em>SECURE</em></article>
          </div>
          <div className="hmw-console-footer"><span><i /> NETWORK STATUS: NORMAL</span><span>PRICE LOCK: ACTIVE</span><span>ACCOUNT CONTROL: AVAILABLE</span></div>
        </div>
      </section>

      <section className="hmw-telemetry-bar" aria-label="HostMyWeb hosting telemetry">
        <div className="hmw-telemetry-lead"><i /> SYSTEM ONLINE</div>
        <div><small>PRICE POLICY</small><b>LOCKED</b></div>
        <div><small>STARTER RATE</small><b>$7.99/MO</b></div>
        <div><small>INTRO RATE</small><b>NONE</b></div>
        <div><small>RENEWAL SURGE</small><b>NONE</b></div>
        <div><small>LONG CONTRACT</small><b>NOT REQUIRED</b></div>
      </section>

      <section className="hmw-domain-section" id="domains">
        <div className="hmw-section-intro hmw-section-intro-light">
          <div className="hmw-section-kicker"><i /> DOMAIN ACQUISITION</div>
          <h2>Find the right domain.<br /><em>See the renewal before you buy.</em></h2>
          <p>Search current availability through the domain platform, then create an account to complete registration. HostMyWeb shows the registration and renewal price together so a first-year promotion does not hide what the domain costs later.</p>
          <div className="hmw-mini-telemetry">
            <span><b>01</b> Search availability</span>
            <span><b>02</b> See registration price</span>
            <span><b>03</b> See renewal price</span>
          </div>
        </div>
        <div className="hmw-domain-workstation">
          <div className="hmw-workstation-head"><div><i /> DOMAIN CONTROL</div><span>LIVE SEARCH</span></div>
          <div className="hmw-domain-search-shell"><DomainSearch /></div>
          <div className="hmw-domain-price-grid">
            {domainPrices.map((item) => (
              <article key={item.tld}>
                <div><small>TLD</small><b>{item.tld}</b></div>
                <strong>{item.price}<span>/yr</span></strong>
                <p>{item.note}</p>
                <em>PRICE VISIBLE</em>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hmw-pricing-section" id="pricing">
        <div className="hmw-section-heading-row">
          <div className="hmw-section-intro">
            <div className="hmw-section-kicker"><i /> SHARED HOSTING PLANS</div>
            <h2>Pick the capacity.<br /><em>Keep the price.</em></h2>
            <p>Each plan has one real monthly hosting rate. You do not need to prepay for years to unlock the number shown on the card.</p>
          </div>
          <div className="hmw-price-lock-panel">
            <small>HOSTMYWEB PRICE LOCK</small>
            <strong>The price you sign up for is the price you keep.</strong>
            <p>The base hosting subscription stays at the same monthly rate while you continuously keep that same plan active.</p>
            <a href="#price-lock">Review Price Lock →</a>
          </div>
        </div>

        <div className="hmw-plan-grid">
          {plans.map((plan) => (
            <article className={plan.popular ? "hmw-plan-card hmw-plan-featured" : "hmw-plan-card"} key={plan.name}>
              <div className="hmw-plan-head">
                <span>{plan.code}</span>
                <em>{plan.popular ? "RECOMMENDED" : "PRICE LOCKED"}</em>
              </div>
              <small>{plan.fit}</small>
              <h3>{plan.name}</h3>
              <div className="hmw-plan-price"><b>{plan.price}</b><span>{plan.unit}</span></div>
              <div className="hmw-plan-renewal"><span>Today</span><b>{plan.price}</b><i /> <span>Renewal</span><b>{plan.price}</b></div>
              <p>{plan.description}</p>
              <ul>{plan.features.map((item) => <li key={item}><i />{item}</li>)}</ul>
              <div className="hmw-plan-mail-note">Need more email? Add business mailboxes separately without changing your hosting plan.</div>
              <a href={plan.href}>Choose {plan.name} <span>→</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="hmw-price-lock-section" id="price-lock">
        <div className="hmw-price-lock-copy">
          <div className="hmw-section-kicker hmw-kicker-green"><i /> PRICE POLICY / ACTIVE</div>
          <h2>$7.99 means <em>$7.99.</em></h2>
          <p>If Starter is $7.99 per month when you sign up, the base hosting rate remains $7.99 per month while you continuously keep that same plan active. No artificial expiration date is attached to the advertised hosting price.</p>
          <div className="hmw-lock-timeline">
            <article><small>MONTH 1</small><b>$7.99</b><span>Base monthly rate</span></article>
            <i>→</i>
            <article><small>YEAR 1</small><b>$7.99/mo</b><span>No renewal jump</span></article>
            <i>→</i>
            <article><small>YEAR 10</small><b>$7.99/mo</b><span>Same base rate</span></article>
          </div>
          <small className="hmw-lock-legal">Price Lock applies to the base hosting subscription while the same plan remains continuously active. Taxes, government-mandated fees, domains, optional add-ons, usage-based charges, and customer-requested plan changes are separate.</small>
        </div>
        <div className="hmw-comparison-console">
          <div className="hmw-comparison-head"><span>PRICING TELEMETRY</span><b>HostMyWeb vs. intro-rate hosting</b><em>LIVE POLICY</em></div>
          <div className="hmw-comparison-row hmw-comparison-label"><span>EVENT</span><b>HOSTMYWEB</b><i>TYPICAL INTRO MODEL</i></div>
          <div className="hmw-comparison-row"><span>Advertised rate</span><b>Real ongoing rate</b><i>Promotional rate</i></div>
          <div className="hmw-comparison-row"><span>Renewal</span><b>Same base price</b><i>Often higher</i></div>
          <div className="hmw-comparison-row"><span>Long contract required</span><b>No</b><i>Often</i></div>
          <div className="hmw-comparison-row"><span>Renewal price jump</span><b>$0</b><i>Common</i></div>
          <div className="hmw-comparison-foot"><i /> HOSTMYWEB PRICE LOCK ACTIVE</div>
        </div>
      </section>

      <section className="hmw-products-section hmw-products-clarified" id="products">
        <div className="hmw-section-intro">
          <div className="hmw-section-kicker"><i /> WHAT YOU CAN BUY</div>
          <h2>Start with what you need.<br /><em>See exactly what it does.</em></h2>
          <p>HostMyWeb separates the products you buy from the infrastructure included with hosting and the services that help you build, move, and manage a website.</p>
        </div>

        <div className="hmw-service-map" aria-label="How HostMyWeb services fit together">
          <div className="hmw-service-map-panel">
            <div className="hmw-service-map-head"><span>YOUR WEBSITE</span><b>Core service path</b></div>
            <div className="hmw-service-flow">
              {websiteFlow.map((item, index) => (
                <div className="hmw-service-flow-step" key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{item}</b>
                  {index < websiteFlow.length - 1 ? <i>→</i> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="hmw-service-map-panel hmw-service-map-growth">
            <div className="hmw-service-map-head"><span>BUILD & GROW</span><b>Optional services and help</b></div>
            <div className="hmw-growth-flow">
              {growthFlow.map((item) => <span key={item}><i />{item}</span>)}
            </div>
          </div>
        </div>

        <div className="hmw-product-grid hmw-product-grid-clarified">
          {products.map((product) => (
            <article key={product.title}>
              <div className="hmw-product-head"><span>{product.mark}</span><em>AVAILABLE</em></div>
              <small>{product.meta}</small>
              <h3>{product.title}</h3>
              <strong className="hmw-product-outcome">{product.outcome}</strong>
              <p>{product.text}</p>
              <a href={product.href}>Explore {product.title} <span>→</span></a>
            </article>
          ))}
        </div>

        <div className="hmw-included-summary">
          <div><span>WHAT COMES WITH HOSTING</span><h3>The infrastructure is part of the plan—not another product you have to decode.</h3></div>
          <div className="hmw-included-summary-grid">
            <span><b>SSL</b> encrypted connections</span>
            <span><b>CDN</b> distributed delivery</span>
            <span><b>BACKUPS</b> recovery tools</span>
            <span><b>SECURITY</b> malware + WAF/DDoS tools</span>
            <span><b>DNS</b> domain record controls</span>
            <span><b>ACCOUNT</b> service and support management</span>
          </div>
          <a href="#hosting-features">See all hosting features →</a>
        </div>
      </section>

      <section className="hmw-infrastructure-section" id="hosting-features">
        <div className="hmw-section-heading-row hmw-infrastructure-heading">
          <div className="hmw-section-intro hmw-section-intro-light">
            <div className="hmw-section-kicker"><i /> WHAT COMES WITH HOSTING</div>
            <h2>See what sits behind<br /><em>the hosting plan.</em></h2>
            <p>The important hosting capabilities should be visible before checkout. Package limits and advanced-tool access can vary by plan, but the platform should never feel like a mystery box.</p>
          </div>
          <div className="hmw-infra-readout">
            <span><i /> CORE SERVICES NOMINAL</span>
            <div><small>SECURITY</small><b>ACTIVE</b></div>
            <div><small>BACKUPS</small><b>READY</b></div>
            <div><small>DNS</small><b>AVAILABLE</b></div>
            <div><small>EMAIL</small><b>AVAILABLE</b></div>
          </div>
        </div>
        <div className="hmw-infrastructure-grid">
          {hostingFeatures.map((feature) => (
            <article key={feature.title}>
              <div className="hmw-feature-top"><span>{feature.mark}</span><em><i />{feature.status}</em></div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hmw-switching-section" id="switching">
        <div className="hmw-migration-console hmw-migration-console-compact">
          <div>
            <div className="hmw-section-kicker hmw-kicker-green"><i /> SWITCH TO HOSTMYWEB</div>
            <h3>Already have a website? Switching shouldn&apos;t be the hard part.</h3>
            <p>Move an existing site using the migration tools available with hosting. Have a larger, unusual, or multi-site move? Done-for-you migration is available when you want HostMyWeb to handle the transition.</p>
          </div>
          <article><small>SELF-SERVICE TRANSFER</small><b>Included</b><strong>Migration tools</strong><span>For standard moves you want to handle yourself.</span></article>
          <article><small>ASSISTED MIGRATION</small><b>From $49</b><strong>Done-for-you migration</strong><span>Hands-on migration, configuration, DNS transition, and verification for more involved moves.</span></article>
        </div>
      </section>

      <section className="hmw-ai-section" id="ai-builder">
        <div className="hmw-ai-copy">
          <div className="hmw-section-kicker hmw-kicker-green"><i /> AI WEBSITE BUILDER</div>
          <h2>Go from an idea<br /><em>to a live website.</em></h2>
          <p>Describe the business, shape the page structure, organize services and the contact journey, refine the content, connect the domain, and publish when the site is ready.</p>
          <div className="hmw-ai-steps"><span><b>01</b>Describe</span><span><b>02</b>Structure</span><span><b>03</b>Refine</span><span><b>04</b>Publish</span></div>
          <a className="primary-button" href="/signup?product=ai-builder">Create an account →</a>
        </div>
        <div className="hmw-ai-console">
          <div className="hmw-workstation-head"><div><i /> BUILD CONTROL</div><span>AI ASSISTED</span></div>
          <div className="hmw-ai-prompt"><small>MISSION INPUT</small><p>“Create a clean website for a local accounting firm with services, team, resources, location details, and a consultation request.”</p><button type="button">Generate structure ✦</button></div>
          <div className="hmw-ai-output"><article><span>01</span><b>Home</b><small>Value proposition</small></article><article><span>02</span><b>Services</b><small>Service pages</small></article><article><span>03</span><b>Business Info</b><small>Team + location</small></article><article><span>04</span><b>Contact</b><small>Conversion route</small></article></div>
          <div className="hmw-console-footer"><span><i /> STRUCTURE READY</span><span>DOMAIN: PENDING</span><span>PUBLISH: MANUAL</span></div>
        </div>
      </section>

      <section className="hmw-account-section" id="hosting">
        <div className="hmw-account-console">
          <div className="hmw-workstation-head"><div><i /> CUSTOMER CONTROL</div><span>SECURE SESSION</span></div>
          <div className="hmw-account-overview">
            <div className="hmw-account-sidebar">
              <b>HostMyWeb</b><span className="active">Overview</span><span>Hosting</span><span>Domains</span><span>Email</span><span>Orders</span><span>Support</span>
            </div>
            <div className="hmw-account-main">
              <div className="hmw-account-title"><div><small>ACCOUNT OVERVIEW</small><h3>Operations Center</h3></div><em><i /> ALL SERVICES NORMAL</em></div>
              <div className="hmw-account-stats"><article><small>HOSTING</small><b>Active</b><span>Service status</span></article><article><small>DOMAINS</small><b>Managed</b><span>Renewal visibility</span></article><article><small>SUPPORT</small><b>Tracked</b><span>Ticket history</span></article></div>
              <div className="hmw-account-list"><article><i /> Hosting plans and service status <b>VIEW →</b></article><article><i /> Domains and renewal dates <b>VIEW →</b></article><article><i /> Orders and payment history <b>VIEW →</b></article><article><i /> Support requests and status <b>VIEW →</b></article></div>
            </div>
          </div>
        </div>
        <div className="hmw-account-copy">
          <div className="hmw-section-kicker hmw-kicker-green"><i /> CUSTOMER ACCOUNT</div>
          <h2>Everyday control without waiting on support.</h2>
          <p>Manage routine hosting, domain, order, and account tasks directly from your HostMyWeb account. When you need help, your support history and service context stay connected to the request.</p>
          <div className="hmw-account-checks"><span>✓ View hosting services</span><span>✓ Track domains</span><span>✓ View orders</span><span>✓ Keep ticket history</span><span>✓ Add services</span><span>✓ Request human help</span></div>
          <a className="primary-button" href="/signup">Create your account →</a>
        </div>
      </section>

      <section className="hmw-ecosystem-section" id="ecosystem">
        <div className="hmw-section-intro hmw-section-intro-light">
          <div className="hmw-section-kicker"><i /> CONNECTED ECOSYSTEM</div>
          <h2>Shared infrastructure underneath.<br /><em>Purpose-built software on top.</em></h2>
          <p>HostMyWeb is a general-purpose hosting company first. The same reusable service layer can also sit underneath specialized products where the workflow needs something more focused.</p>
        </div>
        <div className="hmw-ecosystem-grid">
          {ecosystemProducts.map((product) => (
            <a className={product.current ? "hmw-ecosystem-card hmw-ecosystem-current" : "hmw-ecosystem-card"} href={product.href} key={product.name} target={product.current ? undefined : "_blank"} rel={product.current ? undefined : "noreferrer"}>
              <div className="hmw-ecosystem-head"><span>{product.mark}</span><em><i />{product.status}</em></div>
              <small>{product.type}</small>
              <h3>{product.name}</h3>
              <p>{product.text}</p>
              <b>{product.current ? "INFRASTRUCTURE CORE" : "Open product →"}</b>
            </a>
          ))}
        </div>
      </section>

      <section className="hmw-solutions-section" id="solutions">
        <div className="hmw-section-intro">
          <div className="hmw-section-kicker"><i /> WHO HOSTMYWEB SERVES</div>
          <h2>Built for businesses<br /><em>that want less friction.</em></h2>
          <p>Use HostMyWeb directly for shared web hosting and related services, or let it operate quietly underneath a purpose-built platform.</p>
        </div>
        <div className="hmw-solution-grid">
          {solutions.map((solution) => (
            <article key={solution.title}><span>{solution.mark}</span><div><h3>{solution.title}</h3><p>{solution.text}</p></div></article>
          ))}
        </div>
      </section>

      <section className="hmw-support-section" id="support">
        <div className="hmw-support-heading">
          <div className="hmw-section-kicker hmw-kicker-green"><i /> SUPPORT BUILT AROUND RESOLUTION</div>
          <h2>Easy self-service.<br /><em>Real help when you need it.</em></h2>
          <p>Handle everyday hosting, domains, and account tasks immediately from your account. When you need help, a structured request carries the relevant details to the right place without making you start over.</p>
        </div>
        <div className="hmw-support-grid">
          <article><span>01</span><b>Account tools</b><p>See services, domains, orders, and account details immediately without opening a support request.</p><em>INSTANT</em></article>
          <article><span>02</span><b>Human support</b><p>Submit the issue with the right category and context so the request can be handled with less back-and-forth.</p><em>AVAILABLE</em></article>
          <article><span>03</span><b>Ticket history</b><p>Keep support requests, updates, and status organized inside your customer account.</p><em>TRACKED</em></article>
        </div>
      </section>

      <section className="hmw-custom-section" id="custom">
        <div className="hmw-custom-copy">
          <div className="hmw-section-kicker"><i /> CUSTOM OPERATIONS REQUEST</div>
          <h2>Need a multi-site move, unusual setup, or something outside the standard plans?</h2>
          <p>Use this request channel for work that genuinely needs a custom setup or human review.</p>
          <div className="hmw-custom-checks"><span>✓ Done-for-you migrations</span><span>✓ Multi-site moves</span><span>✓ Custom infrastructure</span><span>✓ Business email migrations</span></div>
        </div>
        <div className="hmw-contact-shell"><div className="hmw-workstation-head"><div><i /> REQUEST INTAKE</div><span>HUMAN REVIEW</span></div><ContactForm /></div>
      </section>

      <footer className="hmw-footer">
        <div className="hmw-footer-command">
          <div><div className="hmw-section-kicker hmw-kicker-green"><i /> HOSTMYWEB PRICE LOCK</div><h2>The price you see is the price you keep.</h2><p>No teaser hosting rate. No inflated renewal. No multi-year commitment just to get the number printed on the page.</p></div>
          <div className="hmw-footer-actions"><a className="primary-button" href="#pricing">View Shared Hosting →</a><a className="hmw-outline-button hmw-outline-light" href="#products">See Products</a></div>
        </div>

        <div className="hmw-footer-status">
          <div className="hmw-footer-brand"><a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span><span><b>HostMyWeb</b><small>HOSTING OPERATIONS</small></span></a><p>Shared hosting, domains, email, website services, and connected infrastructure with pricing designed to remain understandable after checkout.</p></div>
          <div className="hmw-footer-telemetry"><article><small>PRICE LOCK</small><b>ACTIVE</b><span>Base hosting rate stays the same</span></article><article><small>TEASER RATES</small><b>NONE</b><span>The advertised hosting price is real</span></article><article><small>SUPPORT</small><b>AVAILABLE</b><span>Self-service plus human help when needed</span></article></div>
        </div>

        <div className="hmw-footer-links">
          {footerColumns.map((column) => (
            <div key={column.title}><b>{column.title}</b>{column.links.map(([label, href]) => <a href={href} key={label} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{label}</a>)}</div>
          ))}
        </div>

        <div className="hmw-footer-bottom"><span>© {new Date().getFullYear()} HostMyWeb.co. All rights reserved.</span><div><b><i /> SYSTEM ONLINE</b><span>Price Lock active</span><span>No teaser hosting rates</span><span>Transparent renewals</span></div></div>
      </footer>
    </main>
  );
}
