import { SiteFrame } from "@/components/hostmyweb-site-chrome";

const categories = [
  { code: "HOSTING", title: "Web Hosting", text: "Shared cloud, managed WordPress, managed cloud, and VPS options for different workloads.", href: "/hosting" },
  { code: "DOMAINS", title: "Domains", text: "Search, register, renew, transfer, and manage domains with renewal pricing shown up front.", href: "/domains" },
  { code: "EMAIL", title: "Business Email", text: "Professional mailbox service for your domain, separate from your website storage allocation.", href: "/email" },
  { code: "WEBSITES", title: "Website Services", text: "AI-assisted site creation, WordPress options, and migration help for getting online or moving over.", href: "/websites" },
] as const;

const proof = [
  { code: "01", title: "$0 renewal jump", text: "The base shared-hosting rate does not change merely because an introductory period ended." },
  { code: "02", title: "Published resources", text: "Storage, website, mailbox, and database limits are shown before checkout instead of hidden behind vague plan names." },
  { code: "03", title: "Autoscaling platform", text: "Shared hosting runs on a load-balanced cloud platform rather than a single traditional shared server." },
  { code: "04", title: "Room to grow", text: "Move from shared hosting into managed cloud or VPS infrastructure when the workload genuinely needs it." },
] as const;

export function HostMyWebIndexHome() {
  return (
    <SiteFrame>
      <section className="hmw-hero-index">
        <span className="hmw-eyebrow"><i /> HOSTMYWEB / WEB HOSTING & INFRASTRUCTURE</span>
        <h1>Hosting that tells you <em>what it costs.</em></h1>
        <p>HostMyWeb is a real web-hosting company offering shared cloud hosting, domains, business email, website tools, managed cloud, VPS infrastructure, and customer account services without building the entire business into one endless landing page.</p>
        <div className="hmw-actions"><a className="hmw-button" href="/hosting/shared">View Shared Hosting</a><a className="hmw-button secondary" href="/domains">Search Domains</a></div>
      </section>

      <section className="hmw-home-strip" aria-label="Popular HostMyWeb services">
        <a href="/hosting/shared"><small>SHARED CLOUD</small><b>From $7.99/mo</b><span>Four published plans →</span></a>
        <a href="/domains"><small>DOMAINS</small><b>From $14.99/yr</b><span>Search & pricing →</span></a>
        <a href="/email"><small>BUSINESS EMAIL</small><b>From $2.99/mo</b><span>Mailbox options →</span></a>
        <a href="/hosting/cloud"><small>SCALE UP</small><b>Cloud + VPS</b><span>Dedicated resources →</span></a>
      </section>

      <section className="hmw-section alt">
        <div className="hmw-section-head"><div><span className="hmw-eyebrow"><i /> PRODUCT INDEX</span><h2>Choose the service you actually need.</h2><p>The homepage is the front door. Each product has its own page, its own details, its own pricing context, and its own path to purchase or request service.</p></div></div>
        <div className="hmw-category-grid">{categories.map((item) => <a className="hmw-category-card" href={item.href} key={item.title}><small>{item.code}</small><h3>{item.title}</h3><p>{item.text}</p><b>Explore {item.title} →</b></a>)}</div>
      </section>

      <section className="hmw-section dark">
        <div className="hmw-section-head"><div><span className="hmw-eyebrow"><i /> WHY HOSTMYWEB</span><h2>Transparent where hosting companies are usually vague.</h2><p>Price Lock is one reason to look. Published resource limits, real migration options, developer access, and a clear infrastructure upgrade path are the reasons to keep looking.</p></div><a className="hmw-button secondary" href="/hosting">Compare hosting types</a></div>
        <div className="hmw-proof-grid">{proof.map((item) => <article key={item.title}><small>{item.code}</small><b>{item.title}</b><p>{item.text}</p></article>)}</div>
      </section>

      <section className="hmw-section alt">
        <div className="hmw-section-head"><div><span className="hmw-eyebrow"><i /> BUILT ON THE SAME SERVICE LAYER</span><h2>Infrastructure that powers more than brochure sites.</h2><p>The same HostMyWeb service foundation can support ordinary business websites and connected software platforms. That includes DogBreederOS, DogBreederWeb, and DogBreederDocs without turning HostMyWeb itself into a breeder-only company.</p></div></div>
        <div className="hmw-index-grid"><a className="hmw-index-link" href="https://dogbreederos.com"><div><h3>DogBreederOS</h3><p>Connected vertical software using shared hosting, domain, account, and infrastructure services.</p></div><span>↗</span></a><a className="hmw-index-link" href="https://dogbreederweb.site"><div><h3>DogBreederWeb</h3><p>Website capability connected to the broader breeder-software ecosystem.</p></div><span>↗</span></a><a className="hmw-index-link" href="https://dogbreederdocs.online"><div><h3>DogBreederDocs</h3><p>Document workflows using the same broader service architecture.</p></div><span>↗</span></a><a className="hmw-index-link" href="/support"><div><h3>Need help choosing?</h3><p>Use the support and sales path instead of guessing which hosting product fits the workload.</p></div><span>→</span></a></div>
      </section>
    </SiteFrame>
  );
}
