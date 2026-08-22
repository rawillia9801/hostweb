import { ContactForm } from "@/components/contact-form";
import { DomainSearch } from "@/components/domain-search";
import { TrueCostCheck } from "@/components/true-cost-check";

const plans = [
  {
    name: "Starter",
    price: "$7.99",
    unit: "/mo",
    code: "HMW-01",
    fit: "Single business site",
    description: "A clean starting point for one business website with generous storage and the core hosting, developer, and security tools included.",
    resources: {
      websites: "1 website",
      webspace: "10 GB SSD",
      bandwidth: "Unlimited",
      mailboxes: "5 × 10 GB",
      databases: "5 MySQL",
    },
    features: ["SSL + global CDN", "Backups + restore tools", "Malware scanning", "WAF & DDoS protection", "SSH + Git available", "DNS & file tools"],
    href: "/signup?plan=starter",
    popular: false,
  },
  {
    name: "Business",
    price: "$12.99",
    unit: "/mo",
    code: "HMW-05",
    fit: "Growing business",
    description: "For established businesses managing several sites, more storage, more included mailboxes, and additional database capacity.",
    resources: {
      websites: "Up to 5",
      webspace: "25 GB SSD",
      bandwidth: "Unlimited",
      mailboxes: "25 × 10 GB",
      databases: "25 MySQL",
    },
    features: ["SSL + global CDN", "Backups + restore tools", "Malware scanning", "WAF & DDoS protection", "SSH + Git available", "Database management"],
    href: "/signup?plan=business",
    popular: true,
  },
  {
    name: "Pro",
    price: "$21.99",
    unit: "/mo",
    code: "HMW-15",
    fit: "Larger projects",
    description: "For larger sites and multiple projects that need substantially more webspace while keeping the same shared-cloud operating model.",
    resources: {
      websites: "Up to 15",
      webspace: "50 GB SSD",
      bandwidth: "Unlimited",
      mailboxes: "50 × 10 GB",
      databases: "50 MySQL",
    },
    features: ["SSL + global CDN", "Backups + restore tools", "Malware scanning", "WAF & DDoS protection", "SSH + Git available", "Priority support queue"],
    href: "/signup?plan=pro",
    popular: false,
  },
  {
    name: "Agency",
    price: "$39.99",
    unit: "/mo",
    code: "HMW-30",
    fit: "Multi-site operations",
    description: "For agencies, operators, and multi-site businesses that need a large shared-cloud allocation without jumping straight to a server product.",
    resources: {
      websites: "Up to 30",
      webspace: "100 GB SSD",
      bandwidth: "Unlimited",
      mailboxes: "100 × 10 GB",
      databases: "100 MySQL",
    },
    features: ["SSL + global CDN", "Backups + restore tools", "Malware scanning", "WAF & DDoS protection", "SSH + Git available", "Priority support queue"],
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
  { mark: "CDN", title: "Global CDN", text: "Serve cached content through a distributed delivery layer for faster visitor access around the world.", status: "Included" },
  { mark: "SEC", title: "Malware scanning", text: "Hosting security tools help identify malicious files and suspicious website activity.", status: "Protected" },
  { mark: "WAF", title: "WAF & DDoS protection", text: "Network and application-layer protections help reduce common automated and denial-of-service threats.", status: "Protected" },
  { mark: "BK", title: "Backup & restore", text: "Use backup and restore tooling to recover website data when something goes wrong.", status: "Included" },
  { mark: "1×", title: "One-click applications", text: "Launch common web applications without manually building every installation from scratch.", status: "Available" },
  { mark: "WP", title: "WordPress tools", text: "Manage WordPress sites with hosting controls built around common maintenance tasks.", status: "Available" },
  { mark: "FM", title: "File management", text: "Work with website files through browser-based tools plus supported transfer access.", status: "Available" },
  { mark: "DB", title: "Database management", text: "Create and manage MySQL databases with familiar administration tools.", status: "Available" },
  { mark: "DNS", title: "DNS management", text: "Manage the records that connect domains, websites, email, and other services.", status: "Available" },
  { mark: "DEV", title: "SSH & Git", text: "SSH access and Git version-control workflows are available across HostMyWeb shared-cloud plans instead of being reserved for an expensive tier.", status: "Available" },
  { mark: "MAIL", title: "Email controls", text: "Manage business mailboxes, forwarding, aliases, spam controls, and related email settings.", status: "Available" },
] as const;

const products = [
  { mark: "WEB", title: "Shared Web Hosting", outcome: "A dependable home for your website.", meta: "From $7.99/mo", text: "Autoscaling shared-cloud hosting with SSD webspace, unlimited bandwidth, SSL, CDN, backups, security tools, SSH, Git, DNS controls, and account management together.", href: "#pricing" },
  { mark: "DNS", title: "Domains & DNS", outcome: "Your business name on the web.", meta: "From $14.99/yr", text: "Search, register, renew, and manage your domain with the registration and renewal price visible before checkout.", href: "#domains" },
  { mark: "MAIL", title: "Business Email", outcome: "Professional email @ your domain.", meta: "From $2.99/mo", text: "Use an address like you@yourcompany.com and keep business email connected to the same HostMyWeb account.", href: "/signup?product=email" },
  { mark: "WP", title: "Managed WordPress", outcome: "WordPress without wrestling with the hosting.", meta: "From $9.99/mo", text: "WordPress-ready hosting with SSL, backups, security tools, and common management controls together.", href: "#pricing" },
  { mark: "AI", title: "AI Website Builder", outcome: "Go from an idea to a live website.", meta: "Guided creation", text: "Describe what you need, shape the structure, refine the content, connect the domain, and publish when it is ready.", href: "#ai-builder" },
] as const;

const websiteFlow = ["Domain", "Hosting", "SSL + Security", "Business Email", "Backups", "Account"] as const;
const growthFlow = ["AI Website Builder", "WordPress", "Included Migration", "Support"] as const;

const scalePaths = [
  { code: "01", title: "Autoscaling Shared Cloud", status: "AVAILABLE NOW", bestFor: "Most business websites, WordPress, portfolios, service sites, and normal ecommerce workloads.", resource: "Load-balanced shared-cloud platform", control: "Managed hosting environment", action: "View shared plans", href: "#pricing" },
  { code: "02", title: "Managed Cloud", status: "CONFIGURED TO ORDER", bestFor: "High-traffic websites, larger ecommerce stores, databases, and workloads that need dedicated capacity.", resource: "Dedicated cloud resources", control: "Managed server + hosting controls", action: "Request managed cloud", href: "#custom" },
  { code: "03", title: "Virtual Private Server", status: "CONFIGURED TO ORDER", bestFor: "Custom applications, developers, special software stacks, and workloads that need server-level freedom.", resource: "Private virtual machine", control: "Self-managed OS and software", action: "Request a VPS", href: "#custom" },
] as const;

const resourceFacts = [
  { label: "Compute model", value: "Autoscaling cloud", note: "Shared sites are not sold with a fixed VPS-style CPU/RAM slice." },
  { label: "CPU / RAM policy", value: "No fixed LVE limits", note: "The shared-cloud platform distributes demand instead of imposing traditional per-account LVE caps." },
  { label: "Bandwidth", value: "Unlimited", note: "No metered monthly transfer allowance on the shared plans." },
  { label: "Storage", value: "SSD · plan quota", note: "10 GB, 25 GB, 50 GB, or 100 GB of webspace depending on plan." },
  { label: "Mailbox storage", value: "10 GB each", note: "Mailbox storage is separate from website storage; the number included varies by plan." },
  { label: "MySQL", value: "Up to 1 GB / database", note: "The number of databases included varies by HostMyWeb plan." },
  { label: "Developer tools", value: "SSH + Git", note: "Available across the shared-cloud plan family." },
  { label: "Dedicated resources", value: "Cloud / VPS", note: "Move to Managed Cloud or VPS when a project genuinely needs dedicated server resources." },
] as const;

const solutions = [
  { mark: "01", title: "Small Businesses", text: "Hosting, domains, email, and website tools without unnecessary complexity." },
  { mark: "02", title: "Service Businesses", text: "A dependable online foundation for local and professional service companies." },
  { mark: "03", title: "Online Stores", text: "Hosting and domain infrastructure for commerce sites and product businesses." },
  { mark: "04", title: "Creators", text: "Websites, domains, and email for creators who want a professional home online." },
  { mark: "05", title: "Agencies", text: "Multi-site hosting and account organization for teams managing client work." },
  { mark: "06", title: "Vertical Software", text: "A shared service layer that can sit underneath purpose-built business platforms." },
] as const;

const ecosystemProducts = [
  { name: "HostMyWeb", type: "Hosting Foundation", text: "Hosting, domains, DNS, email, provisioning, account services, billing support, and reusable infrastructure.", href: "#top", mark: "HMW", status: "CORE", current: true },
  { name: "DogBreederOS", type: "Flagship Vertical Platform", text: "A complete operating environment for modern dog breeding programs, powered by connected services and infrastructure.", href: "https://dogbreederos.com", mark: "DBOS", status: "CONNECTED", current: false },
  { name: "DogBreederWeb", type: "Connected Website Capability", text: "Breeder websites, guided creation, custom domains, publishing, and connected breeder records.", href: "https://dogbreederweb.site", mark: "DBW", status: "CONNECTED", current: false },
  { name: "DogBreederDocs", type: "Connected Document Capability", text: "Reusable breeder documents, agreements, editing, sending, and e-signature workflows.", href: "https://dogbreederdocs.online", mark: "DBD", status: "CONNECTED", current: false },
] as const;

const footerColumns = [
  { title: "Hosting", links: [["Shared Web Hosting", "#pricing"], ["Plan Resources", "#resources"], ["Managed Cloud", "#scale"], ["VPS Hosting", "#scale"], ["Managed WordPress", "#products"], ["Global Infrastructure", "#network"]] },
  { title: "Domains & Email", links: [["Domain Search", "#domains"], ["Domain Pricing", "#domains"], ["Business Email", "#products"], ["DNS Management", "#hosting-features"], ["Email Controls", "#hosting-features"]] },
  { title: "Infrastructure", links: [["Autoscaling Cloud", "#network"], ["Load Balancing", "#network"], ["Global CDN", "#network"], ["Backups & Restore", "#hosting-features"], ["WAF & DDoS Protection", "#hosting-features"], ["SSH & Git", "#hosting-features"]] },
  { title: "Website Services", links: [["AI Website Builder", "#ai-builder"], ["Standard Migration — Included", "#switching"], ["Complex / Manual Migration", "#switching"], ["Custom Setup", "#custom"], ["Multi-Site Moves", "#custom"]] },
  { title: "Ecosystem", links: [["DogBreederOS", "https://dogbreederos.com"], ["DogBreederWeb", "https://dogbreederweb.site"], ["DogBreederDocs", "https://dogbreederdocs.online"], ["Shared Architecture", "#ecosystem"], ["Who We Serve", "#solutions"]] },
  { title: "Account & Support", links: [["Log In", "/account"], ["Create Account", "/signup"], ["Service Management", "/account"], ["Support Tickets", "/account#support"], ["Urgent Hosting Issue", "/support/urgent"], ["Custom Help", "#custom"]] },
] as const;

export function HostMyWebHome() {
  return (
    <main id="top" className="hmw-page">
      <header className="site-header hmw-header">
        <a className="brand hmw-brand" href="#top" aria-label="HostMyWeb home"><span className="brand-mark"><i /><i /><i /></span><span><b>HostMyWeb</b><small>HOSTING OPERATIONS</small></span></a>
        <nav aria-label="Primary navigation"><a href="#pricing">Hosting</a><a href="#resources">Resources</a><a href="#scale">Scale</a><a href="#products">Products</a><a href="#network">Network</a><a href="#support">Support</a></nav>
        <div className="header-actions"><a className="login-link" href="/account">Log In</a><a className="nav-cta" href="/signup">Get Started</a></div>
      </header>

      <section className="hmw-command-hero">
        <div className="hmw-hero-copy">
          <div className="hmw-status-label"><i /> HOSTMYWEB MISSION CONTROL <span>PUBLIC HOSTING NETWORK</span></div>
          <h1>Web hosting without the <em>renewal trap.</em></h1>
          <p>Autoscaling shared-cloud hosting, domains, business email, website services, and account controls in one operational layer—with a base hosting price that does not jump because an introductory period ended.</p>
          <div className="hmw-hero-actions"><a className="primary-button" href="#pricing">View Shared Hosting <span>→</span></a><a className="hmw-outline-button" href="#resources">See Plan Resources</a></div>
          <div className="hmw-price-callout"><div><small>STARTER HOSTING</small><strong>$7.99<span>/mo</span></strong></div><div><small>RENEWAL RATE</small><strong>$7.99<span>/mo</span></strong></div><div><small>PRICE JUMP</small><strong>$0</strong></div></div>
          <small className="hmw-hero-note">$7.99 billed monthly. No 12-, 24-, 36-, or 48-month prepayment is required to get the advertised rate.</small>
        </div>
        <div className="hmw-control-board" aria-label="HostMyWeb service operations overview">
          <div className="hmw-console-topbar"><div><i /><span>HOSTMYWEB CONTROL</span></div><div><b>SYSTEM ONLINE</b><span>●</span></div></div>
          <div className="hmw-console-grid">
            <article className="hmw-console-card hmw-console-card-core"><div className="hmw-console-mark">H</div><small>CORE SERVICE LAYER</small><h2>HostMyWeb</h2><p>Autoscaling hosting, domains, email, account, and support services in one foundation.</p><div className="hmw-core-status"><span>Hosting</span><span>Domains</span><span>Email</span><span>Support</span></div></article>
            <article className="hmw-console-card"><span className="hmw-module-code">WEB</span><small>HOSTING</small><b>Shared Cloud</b><em>ONLINE</em></article>
            <article className="hmw-console-card"><span className="hmw-module-code">CDN</span><small>DELIVERY</small><b>Global CDN</b><em>ACTIVE</em></article>
            <article className="hmw-console-card"><span className="hmw-module-code">DEV</span><small>DEVELOPER</small><b>SSH + Git</b><em>AVAILABLE</em></article>
            <article className="hmw-console-card"><span className="hmw-module-code">MAIL</span><small>MESSAGING</small><b>Business Email</b><em>READY</em></article>
            <article className="hmw-console-card"><span className="hmw-module-code">CLD</span><small>SCALE PATH</small><b>Managed Cloud</b><em>ON REQUEST</em></article>
            <article className="hmw-console-card"><span className="hmw-module-code">VPS</span><small>SERVER CONTROL</small><b>Virtual Server</b><em>ON REQUEST</em></article>
          </div>
          <div className="hmw-console-footer"><span><i /> NETWORK STATUS: NORMAL</span><span>AUTOSCALING: ACTIVE</span><span>PRICE LOCK: ACTIVE</span></div>
        </div>
      </section>

      <section className="hmw-telemetry-bar" aria-label="HostMyWeb hosting telemetry"><div className="hmw-telemetry-lead"><i /> SYSTEM ONLINE</div><div><small>HOSTING MODEL</small><b>AUTOSCALING</b></div><div><small>STARTER RATE</small><b>$7.99/MO</b></div><div><small>BANDWIDTH</small><b>UNLIMITED</b></div><div><small>DEV TOOLS</small><b>SSH + GIT</b></div><div><small>SCALE PATH</small><b>CLOUD + VPS</b></div></section>

      <section className="hmw-network-section" id="network">
        <div className="hmw-section-intro hmw-section-intro-light"><div className="hmw-section-kicker"><i /> HOSTING ARCHITECTURE</div><h2>Shared hosting.<br /><em>Not the old single-server model.</em></h2><p>HostMyWeb shared plans run on an autoscaling, load-balanced cloud hosting platform. Websites are not pinned to one traditional shared server, and demand can be distributed across the hosting layer as traffic changes.</p></div>
        <div className="hmw-network-console"><div className="hmw-workstation-head"><div><i /> NETWORK OPERATIONS</div><span>AUTOSCALING CLOUD</span></div><div className="hmw-network-grid"><article><small>COMPUTE</small><b>Autoscaling</b><span>Capacity adapts as site demand changes.</span><em>ACTIVE</em></article><article><small>TRAFFIC</small><b>Load balanced</b><span>Requests are distributed across the hosting platform.</span><em>ACTIVE</em></article><article><small>RESOURCE MODEL</small><b>No fixed LVE limits</b><span>Shared plans are not sold as tiny fixed CPU/RAM slices.</span><em>ACTIVE</em></article><article><small>DELIVERY</small><b>Global CDN</b><span>Cached content can be delivered through a worldwide edge network.</span><em>AVAILABLE</em></article></div><div className="hmw-region-strip"><div><small>ORIGIN OPTIONS</small><b>Choose closer to your audience</b></div><span><i /> USA</span><span><i /> UNITED KINGDOM</span><span><i /> SINGAPORE</span><em>Origin availability is selected during service setup and can depend on the product configuration.</em></div></div>
      </section>

      <section className="hmw-domain-section" id="domains"><div className="hmw-section-intro hmw-section-intro-light"><div className="hmw-section-kicker"><i /> DOMAIN ACQUISITION</div><h2>Find the right domain.<br /><em>See the renewal before you buy.</em></h2><p>Search current availability, then create an account to complete registration. HostMyWeb shows the registration and renewal price together instead of using a temporary “free domain” offer to hide what the domain costs later.</p><div className="hmw-mini-telemetry"><span><b>01</b> Search availability</span><span><b>02</b> See registration price</span><span><b>03</b> See renewal price</span></div></div><div className="hmw-domain-workstation"><div className="hmw-workstation-head"><div><i /> DOMAIN CONTROL</div><span>LIVE SEARCH</span></div><div className="hmw-domain-search-shell"><DomainSearch /></div><div className="hmw-domain-price-grid">{domainPrices.map((item) => <article key={item.tld}><div><small>TLD</small><b>{item.tld}</b></div><strong>{item.price}<span>/yr</span></strong><p>{item.note}</p><em>PRICE VISIBLE</em></article>)}</div></div></section>

      <section className="hmw-pricing-section" id="pricing">
        <div className="hmw-section-heading-row"><div className="hmw-section-intro"><div className="hmw-section-kicker"><i /> AUTOSCALING SHARED CLOUD PLANS</div><h2>Pick the capacity.<br /><em>Keep the price.</em></h2><p>The product is shared web hosting, but the underlying platform is autoscaling and load balanced rather than a traditional single-server shared environment. Each plan has one real monthly hosting rate and an explicit SSD webspace quota.</p></div><div className="hmw-price-lock-panel"><small>HOSTMYWEB PRICE LOCK</small><strong>The price you sign up for is the price you keep.</strong><p>The base hosting subscription stays at the same monthly rate while you continuously keep that same plan active.</p><a href="#price-lock">Review Price Lock →</a></div></div>
        <div className="hmw-plan-grid">{plans.map((plan) => <article className={plan.popular ? "hmw-plan-card hmw-plan-featured" : "hmw-plan-card"} key={plan.name}><div className="hmw-plan-head"><span>{plan.code}</span><em>{plan.popular ? "RECOMMENDED" : "PRICE LOCKED"}</em></div><small>{plan.fit}</small><h3>{plan.name}</h3><div className="hmw-plan-price"><b>{plan.price}</b><span>{plan.unit}</span></div><div className="hmw-plan-renewal"><span>Today</span><b>{plan.price}</b><i /> <span>Renewal</span><b>{plan.price}</b></div>{plan.name === "Starter" ? <div className="hmw-checkout-anchor"><small>CHECKOUT TRANSPARENCY</small><b>Due today: $7.99</b><span>No multi-year prepayment required for this rate.</span></div> : null}<p>{plan.description}</p><div className="hmw-plan-resource-grid"><span><small>WEBSITES</small><b>{plan.resources.websites}</b></span><span><small>SSD WEBSPACE</small><b>{plan.resources.webspace}</b></span><span><small>BANDWIDTH</small><b>{plan.resources.bandwidth}</b></span><span><small>MAILBOXES</small><b>{plan.resources.mailboxes}</b></span><span><small>DATABASES</small><b>{plan.resources.databases}</b></span></div><ul>{plan.features.map((item) => <li key={item}><i />{item}</li>)}</ul><div className="hmw-plan-mail-note">Need more email? Add business mailboxes separately without changing your hosting plan.</div><a href={plan.href}>Choose {plan.name} <span>→</span></a></article>)}</div>
      </section>

      <section className="hmw-resource-section" id="resources">
        <div className="hmw-section-heading-row hmw-resource-heading"><div className="hmw-section-intro hmw-section-intro-light"><div className="hmw-section-kicker"><i /> RESOURCE TRANSPARENCY</div><h2>No mystery limits.<br /><em>Here is the hosting model.</em></h2><p>Shared-cloud hosting should not be described like a VPS when it is not one. HostMyWeb publishes the quotas that actually vary by plan and explains which resources are handled by the autoscaling platform.</p></div><div className="hmw-resource-badge"><span><i /> RESOURCE POLICY</span><b>DISCLOSED</b><small>SSD quotas + mailbox counts + database counts + developer access</small></div></div>
        <div className="hmw-resource-fact-grid">{resourceFacts.map((fact) => <article key={fact.label}><small>{fact.label}</small><b>{fact.value}</b><p>{fact.note}</p></article>)}</div>
        <div className="hmw-resource-matrix" aria-label="HostMyWeb shared hosting resource limits">
          <div className="hmw-resource-matrix-head"><span>PLAN</span><span>SSD WEBSPACE</span><span>WEBSITES</span><span>MAILBOXES</span><span>MYSQL DATABASES</span><span>SSH + GIT</span></div>
          {plans.map((plan) => <div className="hmw-resource-matrix-row" key={plan.name}><strong>{plan.name}</strong><span>{plan.resources.webspace}</span><span>{plan.resources.websites}</span><span>{plan.resources.mailboxes}</span><span>{plan.resources.databases}</span><span>Available</span></div>)}
        </div>
        <p className="hmw-resource-fineprint">Shared-cloud plans use an autoscaling platform and are not sold with a fixed VPS-style RAM allocation. “No fixed LVE limits” does not mean infinite resources or that every workload belongs on shared hosting; unusually intensive or custom server workloads can be moved to Managed Cloud or VPS.</p>
      </section>

      <section className="hmw-scale-section" id="scale"><div className="hmw-section-heading-row"><div className="hmw-section-intro hmw-section-intro-light"><div className="hmw-section-kicker"><i /> GROW WITHOUT LEAVING HOSTMYWEB</div><h2>Start shared.<br /><em>Move up when the workload changes.</em></h2><p>Shared hosting is the right fit for most websites. When a project needs dedicated capacity or server-level control, HostMyWeb has a clear path into managed cloud or virtual private server configurations.</p></div><div className="hmw-scale-readout"><span><i /> SCALE PATH AVAILABLE</span><div><small>LEVEL 1</small><b>SHARED CLOUD</b></div><div><small>LEVEL 2</small><b>MANAGED CLOUD</b></div><div><small>LEVEL 3</small><b>VPS</b></div></div></div><div className="hmw-scale-grid">{scalePaths.map((path, index) => <article key={path.title} className={index === 0 ? "hmw-scale-card hmw-scale-card-active" : "hmw-scale-card"}><div className="hmw-scale-card-head"><span>{path.code}</span><em>{path.status}</em></div><h3>{path.title}</h3><p>{path.bestFor}</p><dl><div><dt>Resources</dt><dd>{path.resource}</dd></div><div><dt>Control</dt><dd>{path.control}</dd></div></dl><a href={path.href}>{path.action} <span>→</span></a></article>)}</div><div className="hmw-scale-note"><b>Why the tiers are different:</b><span>Shared cloud is optimized for managed website hosting. Managed Cloud adds dedicated capacity. VPS adds server-level flexibility for custom software and operating-system requirements.</span></div></section>

      <section className="hmw-price-lock-section" id="price-lock"><div className="hmw-price-lock-copy"><div className="hmw-section-kicker hmw-kicker-green"><i /> PRICE POLICY / ACTIVE</div><h2>$7.99 means <em>$7.99.</em></h2><p>If Starter is $7.99 per month when you sign up, the base hosting rate remains $7.99 per month while you continuously keep that same plan active. No artificial expiration date is attached to the advertised hosting price.</p><div className="hmw-lock-timeline"><article><small>MONTH 1</small><b>$7.99</b><span>Base monthly rate</span></article><i>→</i><article><small>YEAR 1</small><b>$7.99/mo</b><span>No renewal jump</span></article><i>→</i><article><small>YEAR 10</small><b>$7.99/mo</b><span>Same base rate</span></article></div><small className="hmw-lock-legal">Price Lock applies to the base hosting subscription while the same plan remains continuously active. Taxes, government-mandated fees, domains, optional add-ons, usage-based charges, and customer-requested plan changes are separate.</small></div><TrueCostCheck /></section>

      <section className="hmw-products-section hmw-products-clarified" id="products"><div className="hmw-section-intro"><div className="hmw-section-kicker"><i /> WHAT YOU CAN BUY</div><h2>Start with what you need.<br /><em>See exactly what it does.</em></h2><p>Products are separated from the infrastructure included with hosting and the services that help you build, move, and manage a website.</p></div><div className="hmw-service-map" aria-label="How HostMyWeb services fit together"><div className="hmw-service-map-panel"><div className="hmw-service-map-head"><span>YOUR WEBSITE</span><b>Core service path</b></div><div className="hmw-service-flow">{websiteFlow.map((item, index) => <div className="hmw-service-flow-step" key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b>{index < websiteFlow.length - 1 ? <i>→</i> : null}</div>)}</div></div><div className="hmw-service-map-panel hmw-service-map-growth"><div className="hmw-service-map-head"><span>BUILD & GROW</span><b>Optional services and help</b></div><div className="hmw-growth-flow">{growthFlow.map((item) => <span key={item}><i />{item}</span>)}</div></div></div><div className="hmw-product-grid hmw-product-grid-clarified">{products.map((product) => <article key={product.title}><div className="hmw-product-head"><span>{product.mark}</span><em>AVAILABLE</em></div><small>{product.meta}</small><h3>{product.title}</h3><strong className="hmw-product-outcome">{product.outcome}</strong><p>{product.text}</p><a href={product.href}>Explore {product.title} <span>→</span></a></article>)}</div><div className="hmw-included-summary"><div><span>WHAT COMES WITH HOSTING</span><h3>The infrastructure is part of the plan—not another product you have to decode.</h3></div><div className="hmw-included-summary-grid"><span><b>SSL</b> encrypted connections</span><span><b>CDN</b> distributed delivery</span><span><b>BACKUPS</b> recovery tools</span><span><b>SECURITY</b> malware + WAF/DDoS tools</span><span><b>SSH + GIT</b> developer workflows</span><span><b>ACCOUNT</b> service and support management</span></div><a href="#hosting-features">See all hosting features →</a></div></section>

      <section className="hmw-infrastructure-section" id="hosting-features"><div className="hmw-section-heading-row hmw-infrastructure-heading"><div className="hmw-section-intro hmw-section-intro-light"><div className="hmw-section-kicker"><i /> WHAT COMES WITH HOSTING</div><h2>See what sits behind<br /><em>the hosting plan.</em></h2><p>The important hosting capabilities should be visible before checkout. Storage, website, mailbox, and database quotas vary by plan; core shared-cloud tooling such as SSH and Git does not require a Pro upgrade.</p></div><div className="hmw-infra-readout"><span><i /> CORE SERVICES NOMINAL</span><div><small>SECURITY</small><b>ACTIVE</b></div><div><small>BACKUPS</small><b>READY</b></div><div><small>SSH + GIT</small><b>AVAILABLE</b></div><div><small>EMAIL</small><b>AVAILABLE</b></div></div></div><div className="hmw-infrastructure-grid">{hostingFeatures.map((feature) => <article key={feature.title}><div className="hmw-feature-top"><span>{feature.mark}</span><em><i />{feature.status}</em></div><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></section>

      <section className="hmw-switching-section" id="switching"><div className="hmw-migration-console hmw-migration-console-compact"><div><div className="hmw-section-kicker hmw-kicker-green"><i /> SWITCH TO HOSTMYWEB</div><h3>Already have a website? Standard migration is included.</h3><p>Supported automated migrations can move website files, MySQL databases, and eligible mailboxes without an additional migration charge. More unusual configurations that require hands-on manual work are handled separately.</p></div><article className="hmw-migration-included"><small>STANDARD MIGRATION</small><b>Included</b><strong>Supported website transfer</strong><span>For supported cPanel, Plesk, DirectAdmin, Fasthosts, Heart Internet, and WordPress/FTP moves. Eligible data is transferred through the automated migration system.</span></article><article><small>COMPLEX / MANUAL</small><b>From $49</b><strong>Hands-on migration</strong><span>For unusual configurations, manual reconstruction, complex DNS transitions, multi-site coordination, or migrations outside the supported automated paths.</span></article></div><p className="hmw-migration-note">Domain-name registration or transfer is separate from website migration. WordPress migrations performed only from FTP credentials may not include mailbox migration.</p></section>

      <section className="hmw-ai-section" id="ai-builder"><div className="hmw-ai-copy"><div className="hmw-section-kicker hmw-kicker-green"><i /> AI WEBSITE BUILDER</div><h2>Go from an idea<br /><em>to a live website.</em></h2><p>Describe the business, shape the page structure, organize services and the contact journey, refine the content, connect the domain, and publish when the site is ready.</p><div className="hmw-ai-steps"><span><b>01</b>Describe</span><span><b>02</b>Structure</span><span><b>03</b>Refine</span><span><b>04</b>Publish</span></div><a className="primary-button" href="/signup?product=ai-builder">Create an account →</a></div><div className="hmw-ai-console"><div className="hmw-workstation-head"><div><i /> BUILD CONTROL</div><span>AI ASSISTED</span></div><div className="hmw-ai-prompt"><small>MISSION INPUT</small><p>“Create a clean website for a local accounting firm with services, team, resources, location details, and a consultation request.”</p><button type="button">Generate structure ✦</button></div><div className="hmw-ai-output"><article><span>01</span><b>Home</b><small>Value proposition</small></article><article><span>02</span><b>Services</b><small>Service pages</small></article><article><span>03</span><b>Business Info</b><small>Team + location</small></article><article><span>04</span><b>Contact</b><small>Conversion route</small></article></div><div className="hmw-console-footer"><span><i /> STRUCTURE READY</span><span>DOMAIN: PENDING</span><span>PUBLISH: MANUAL</span></div></div></section>

      <section className="hmw-account-section" id="hosting"><div className="hmw-account-console"><div className="hmw-workstation-head"><div><i /> CUSTOMER CONTROL</div><span>SECURE SESSION</span></div><div className="hmw-account-overview"><div className="hmw-account-sidebar"><b>HostMyWeb</b><span className="active">Overview</span><span>Hosting</span><span>Domains</span><span>Email</span><span>Orders</span><span>Support</span></div><div className="hmw-account-main"><div className="hmw-account-title"><div><small>ACCOUNT OVERVIEW</small><h3>Operations Center</h3></div><em><i /> ALL SERVICES NORMAL</em></div><div className="hmw-account-stats"><article><small>HOSTING</small><b>Active</b><span>Service status</span></article><article><small>DOMAINS</small><b>Managed</b><span>Renewal visibility</span></article><article><small>SUPPORT</small><b>Tracked</b><span>Ticket history</span></article></div><div className="hmw-account-list"><article><i /> Hosting plans and service status <b>VIEW →</b></article><article><i /> Domains and renewal dates <b>VIEW →</b></article><article><i /> Orders and payment history <b>VIEW →</b></article><article><i /> Support requests and status <b>VIEW →</b></article></div></div></div></div><div className="hmw-account-copy"><div className="hmw-section-kicker hmw-kicker-green"><i /> CUSTOMER ACCOUNT</div><h2>Everyday control without waiting on support.</h2><p>Manage routine hosting, domain, order, and account tasks directly from your HostMyWeb account. When you need help, your support history and service context stay connected to the request.</p><div className="hmw-account-checks"><span>✓ View hosting services</span><span>✓ Track domains</span><span>✓ View orders</span><span>✓ Keep ticket history</span><span>✓ Add services</span><span>✓ Request human help</span></div><a className="primary-button" href="/signup">Create your account →</a></div></section>

      <section className="hmw-ecosystem-section" id="ecosystem"><div className="hmw-section-intro hmw-section-intro-light"><div className="hmw-section-kicker"><i /> CONNECTED ECOSYSTEM</div><h2>Infrastructure built to power<br /><em>more than a brochure website.</em></h2><p>The same HostMyWeb service foundation used for everyday business hosting also supports connected software platforms. That makes the ecosystem a visible proof point for how hosting, domains, DNS, email, security, backups, and account services fit together underneath real applications.</p></div><div className="hmw-ecosystem-proof"><div><small>HOSTMYWEB INFRASTRUCTURE CORE</small><b>One reusable service foundation</b><span>Hosting · Domains · DNS · Email · Security · Backups · Account Services</span></div><i>→</i><div className="hmw-ecosystem-proof-apps"><small>CONNECTED APPLICATIONS</small><b>Purpose-built software on top</b><span>DogBreederOS · DogBreederWeb · DogBreederDocs</span></div></div><div className="hmw-ecosystem-grid">{ecosystemProducts.map((product) => <a className={product.current ? "hmw-ecosystem-card hmw-ecosystem-current" : "hmw-ecosystem-card"} href={product.href} key={product.name} target={product.current ? undefined : "_blank"} rel={product.current ? undefined : "noreferrer"}><div className="hmw-ecosystem-head"><span>{product.mark}</span><em><i />{product.status}</em></div><small>{product.type}</small><h3>{product.name}</h3><p>{product.text}</p><b>{product.current ? "INFRASTRUCTURE CORE" : "Open product →"}</b></a>)}</div></section>

      <section className="hmw-solutions-section" id="solutions"><div className="hmw-section-intro"><div className="hmw-section-kicker"><i /> WHO HOSTMYWEB SERVES</div><h2>Built for businesses<br /><em>that want less friction.</em></h2><p>Use HostMyWeb directly for web hosting and related services, then move into cloud or VPS configurations if the workload outgrows a managed shared environment.</p></div><div className="hmw-solution-grid">{solutions.map((solution) => <article key={solution.title}><span>{solution.mark}</span><div><h3>{solution.title}</h3><p>{solution.text}</p></div></article>)}</div></section>

      <section className="hmw-support-section" id="support"><div className="hmw-support-heading"><div className="hmw-section-kicker hmw-kicker-green"><i /> SUPPORT BUILT AROUND RESOLUTION</div><h2>Easy self-service.<br /><em>Real help when you need it.</em></h2><p>Handle everyday hosting, domains, and account tasks immediately from your account. When service is actually down, use the urgent incident route so an outage is separated from normal account and billing requests.</p><div className="hmw-support-actions"><a className="primary-button" href="/account#support">Open normal support</a><a className="hmw-urgent-button" href="/support/urgent">Report urgent hosting issue →</a></div></div><div className="hmw-support-grid"><article><span>01</span><b>Account tools</b><p>See services, domains, orders, and account details immediately without opening a support request.</p><em>INSTANT</em></article><article><span>02</span><b>Human support</b><p>Submit the issue with the right category and context so the request can be handled with less back-and-forth.</p><em>AVAILABLE</em></article><article className="hmw-support-urgent-card"><span>03</span><b>Urgent incident route</b><p>Use the priority route for website-down, DNS, SSL, email, or other service-impacting incidents.</p><em>PRIORITY</em></article></div></section>

      <section className="hmw-custom-section" id="custom"><div className="hmw-custom-copy"><div className="hmw-section-kicker"><i /> CUSTOM OPERATIONS REQUEST</div><h2>Need managed cloud, a VPS, complex migration, or an unusual setup?</h2><p>Use this request channel for configurations that need capacity planning, server choices, manual migration work, or human review.</p><div className="hmw-custom-checks"><span>✓ Managed cloud</span><span>✓ Virtual private servers</span><span>✓ Complex migrations</span><span>✓ Custom infrastructure</span></div></div><div className="hmw-contact-shell"><div className="hmw-workstation-head"><div><i /> REQUEST INTAKE</div><span>HUMAN REVIEW</span></div><ContactForm /></div></section>

      <footer className="hmw-footer"><div className="hmw-footer-command"><div><div className="hmw-section-kicker hmw-kicker-green"><i /> HOSTMYWEB PRICE LOCK</div><h2>Start small. Know your limits. Scale without leaving.</h2><p>Transparent shared-cloud hosting with published SSD, website, mailbox, and database limits—plus managed cloud and VPS paths when the project needs a different kind of infrastructure.</p></div><div className="hmw-footer-actions"><a className="primary-button" href="#pricing">View Shared Hosting →</a><a className="hmw-outline-button hmw-outline-light" href="#resources">See Resources</a></div></div><div className="hmw-footer-status"><div className="hmw-footer-brand"><a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span><span><b>HostMyWeb</b><small>HOSTING OPERATIONS</small></span></a><p>Autoscaling shared-cloud hosting, domains, email, website services, and a clear path into managed cloud and VPS infrastructure.</p></div><div className="hmw-footer-telemetry"><article><small>PRICE LOCK</small><b>ACTIVE</b><span>Base shared-hosting rate stays the same</span></article><article><small>RESOURCE LIMITS</small><b>PUBLISHED</b><span>SSD, sites, mailboxes and databases disclosed</span></article><article><small>SCALE PATH</small><b>READY</b><span>Shared cloud → managed cloud → VPS</span></article></div></div><div className="hmw-footer-links">{footerColumns.map((column) => <div key={column.title}><b>{column.title}</b>{column.links.map(([label, href]) => <a href={href} key={label} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{label}</a>)}</div>)}</div><div className="hmw-footer-bottom"><span>© {new Date().getFullYear()} HostMyWeb.co. All rights reserved.</span><div><b><i /> SYSTEM ONLINE</b><span>Price Lock active</span><span>Standard migration included</span><span>SSH + Git available</span></div></div></footer>
    </main>
  );
}
