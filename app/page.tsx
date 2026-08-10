import { ContactForm } from "@/components/contact-form";

const services = [
  ["▦", "Managed Hosting", "Fast, secure hosting with backups, monitoring, and the infrastructure work handled for you."],
  ["◎", "Domain Management", "Register, connect, renew, and manage the domains that represent your brand online."],
  ["✉", "Business Email", "Professional email on your own domain, with mailbox setup that fits the way your team works."],
  ["◇", "SSL & Security", "SSL, DNS hygiene, security controls, and practical protection for the sites that matter to your business."],
  ["▣", "Website Publishing", "Launch and maintain polished websites without turning hosting operations into a second job."],
  ["◉", "Human Support", "Real help for migrations, DNS, email, publishing, and the infrastructure questions that slow businesses down."],
] as const;

const audiences = [
  ["Breeders", "Websites, domains, business email, portals, and infrastructure for responsible breeding businesses."],
  ["Local Businesses", "A professional online presence with the domain, hosting, email, and support to keep it dependable."],
  ["Online Shops", "Infrastructure for stores and product brands that need speed, reliability, and room to grow."],
  ["Service Brands", "Managed web infrastructure for consultants, agencies, professionals, and specialized service companies."],
] as const;

const products = [
  ["HostMyWeb", "Infrastructure foundation", "Hosting, domains, email, DNS, SSL, and the web operations underneath the ecosystem.", "https://hostmyweb.co"],
  ["MyDogPortal", "Breeder operating system", "Connected breeder operations, family workflows, puppy portals, and business management.", "https://mydogportal.site"],
  ["DogBreederWeb", "Breeder website platform", "Purpose-built breeder websites and website tools designed to connect with the operating system.", "https://dogbreederweb.site"],
  ["DogBreederDocs", "Breeder document platform", "Professional breeder documents, editable packets, signatures, and connected paperwork workflows.", "https://dogbreederdocs.online"],
] as const;

const plans = [
  ["Starter", "For one growing website", ["Managed website hosting", "SSL and DNS support", "Business email options", "Migration assistance"]],
  ["Business", "For growing brands", ["More storage and resources", "Multiple website support", "Business email", "Daily backup options", "Priority setup help"]],
  ["Pro", "For busy or advanced sites", ["Higher resource allocation", "Multi-site management", "Advanced DNS support", "Priority technical support", "Migration planning"]],
  ["Agency", "For multi-brand operators", ["Multiple client or brand sites", "Centralized management", "White-label-friendly workflows", "Scalable infrastructure", "Migration coordination"]],
] as const;

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="HostMyWeb home"><span className="brand-mark">H</span><b>HostMyWeb</b></a>
        <nav aria-label="Primary navigation">
          <a href="#services">Hosting</a>
          <a href="#services">Domains</a>
          <a href="#services">Business Email</a>
          <a href="#solutions">Solutions</a>
          <a href="#ecosystem">Company</a>
        </nav>
        <a className="nav-cta" href="#contact">Get Started</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow"><i /> Reliable infrastructure. Real support. Built for growth.</span>
          <h1>Managed Hosting,<br />Domains &amp; Business Email —<br /><em>Built for Real Brands</em></h1>
          <p>HostMyWeb powers websites, domains, business email, DNS, and the online infrastructure behind small businesses, creators, specialized brands, and purpose-built software.</p>
          <div className="hero-actions"><a className="primary-button" href="#contact">Start Your Setup <span>→</span></a><a className="secondary-button" href="#plans">See Plans</a></div>
          <div className="proof-row"><span><b>✓</b> Managed setup</span><span><b>✓</b> Migration help</span><span><b>✓</b> Real support</span></div>
        </div>

        <div className="dashboard-shell" aria-label="HostMyWeb infrastructure dashboard preview">
          <div className="dashboard-top"><div className="mini-brand"><span>H</span><b>HostMyWeb</b></div><div className="account-chip">My Brand Co.⌄</div></div>
          <div className="dashboard-body">
            <aside><b>Overview</b><span>Hosting</span><span>Domains</span><span>Email</span><span>Websites</span><span>Security</span><span>DNS</span><span>Billing</span><span>Support</span></aside>
            <section>
              <header><div><small>OVERVIEW</small><h2>Everything looks good.</h2></div><span className="online-dot">● Live</span></header>
              <div className="metric-grid">
                <article><small>DOMAIN</small><b>mybrand.co</b><em>Active</em><span>Renewal protected</span></article>
                <article><small>WEB HOSTING</small><b>Business Plan</b><em>Active</em><span>Site online</span></article>
                <article><small>BUSINESS EMAIL</small><b>5 mailboxes</b><em>Healthy</em><span>All systems operational</span></article>
                <article><small>SSL CERTIFICATE</small><b>Secure</b><em>Active</em><span>HTTPS enabled</span></article>
                <article><small>DNS</small><b>Connected</b><em>Healthy</em><span>A · MX · CNAME · TXT</span></article>
                <article><small>BACKUPS</small><b>Protected</b><em>Current</em><span>Latest snapshot complete</span></article>
              </div>
              <div className="dashboard-lower"><article><b>Resource usage</b><label>Storage <span>38%</span></label><i><span style={{width:"38%"}} /></i><label>Bandwidth <span>42%</span></label><i><span style={{width:"42%"}} /></i></article><article><b>Quick actions</b><span>Add a domain →</span><span>Create email account →</span><span>Request migration →</span><span>Manage DNS →</span></article></div>
            </section>
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <header className="section-heading"><span>HOSTING &amp; WEB INFRASTRUCTURE</span><h2>Everything your brand needs underneath the website.</h2><p>HostMyWeb is designed to make infrastructure feel organized, understandable, and managed — not like another control panel you have to babysit.</p></header>
        <div className="service-grid">{services.map(([icon,title,text]) => <article key={title}><span className="service-icon">{icon}</span><h3>{title}</h3><p>{text}</p><a href="#contact">Learn more <span>→</span></a></article>)}</div>
      </section>

      <section className="section solutions-section" id="solutions">
        <header className="section-heading centered"><span>SOLUTIONS FOR GROWING BRANDS</span><h2>Built for more than one niche.</h2><p>The infrastructure should adapt to the business — not force every business into the same generic box.</p></header>
        <div className="audience-grid">{audiences.map(([title,text], index) => <article key={title}><div className={`audience-visual visual-${index+1}`}><span>{title.slice(0,1)}</span></div><small>HOSTMYWEB SOLUTION</small><h3>{title}</h3><p>{text}</p><a href="#contact">Explore solution →</a></article>)}</div>
      </section>

      <section className="ecosystem section" id="ecosystem">
        <header className="section-heading centered"><span>PART OF THE HOSTMYWEB FAMILY</span><h2>Powering purpose-built solutions.</h2><p>HostMyWeb can stand on its own as a hosting company while also providing the infrastructure foundation for focused software and web products.</p></header>
        <div className="ecosystem-grid">{products.map(([name,label,text,url], index) => <a className={index === 0 ? "ecosystem-card current" : "ecosystem-card"} href={url} key={name} target={index === 0 ? undefined : "_blank"} rel={index === 0 ? undefined : "noreferrer"}><span className="ecosystem-logo">{name.slice(0,1)}</span><small>{label}</small><h3>{name}</h3><p>{text}</p><b>{index === 0 ? "You are here" : "Visit product →"}</b></a>)}</div>
        <div className="ecosystem-note"><b>Different tools. One thoughtful ecosystem.</b><p>Each product has one clear job. HostMyWeb powers the infrastructure underneath them without limiting the hosting company to a single industry.</p></div>
      </section>

      <section className="section plans-section" id="plans">
        <header className="section-heading centered"><span>SIMPLE, CLEAR PLAN STRUCTURE</span><h2>Plans that grow with you.</h2><p>We’re finalizing launch pricing around the production infrastructure so the published rates are real, sustainable, and easy to understand.</p></header>
        <div className="plan-grid">{plans.map(([name,position,items], index) => <article className={index === 1 ? "featured-plan" : ""} key={name}>{index === 1 && <em>MOST POPULAR</em>}<small>{position}</small><h3>{name}</h3><p className="launch-price">Launch pricing<br/><b>coming with service release</b></p><ul>{items.map(item => <li key={item}>✓ {item}</li>)}</ul><a href="#contact">Request launch details</a></article>)}</div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="contact-copy"><span className="eyebrow"><i /> LET’S BUILD THE RIGHT SETUP</span><h2>Tell us what needs to be hosted, moved, connected, or cleaned up.</h2><p>Whether you need one website, a portfolio of brands, business email, domain management, or a migration away from a provider you’ve outgrown, start with the actual situation. We’ll organize the infrastructure around it.</p><div className="contact-points"><span>✓ Websites &amp; migrations</span><span>✓ Domains &amp; DNS</span><span>✓ Business email</span><span>✓ Multi-site &amp; agency needs</span></div></div>
        <ContactForm />
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark">H</span><b>HostMyWeb</b></a><p>Reliable infrastructure. Real support. Everything you need to build, host, and grow online.</p></div>
        <div><b>Products</b><a href="#services">Hosting</a><a href="#services">Domains</a><a href="#services">Business Email</a><a href="#services">Websites</a><a href="#services">SSL &amp; Security</a></div>
        <div><b>Solutions</b><a href="#solutions">Breeders</a><a href="#solutions">Local Businesses</a><a href="#solutions">Online Shops</a><a href="#solutions">Service Brands</a><a href="#solutions">Agencies</a></div>
        <div><b>Company</b><a href="#ecosystem">Our ecosystem</a><a href="#contact">Contact</a><a href="#plans">Plans</a></div>
        <div><b>Get started</b><p>Have a site, domain, or email setup you need help with?</p><a className="footer-cta" href="#contact">Start your setup →</a></div>
        <small>© 2026 HostMyWeb.co. All rights reserved.</small>
      </footer>
    </main>
  );
}
