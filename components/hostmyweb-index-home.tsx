import { DomainSearch } from "@/components/domain-search";
import { SiteFrame } from "@/components/hostmyweb-site-chrome";
import { HOSTING_PLAN_SLUGS, HOSTING_PLANS } from "@/lib/hosting-plans";

const services = [
  { number: "01", title: "Shared cloud", detail: "For your first website. And your next.", href: "/hosting/shared", tag: "FROM $7.99 / MO" },
  { number: "02", title: "WordPress", detail: "Build, stage, and manage your WordPress sites.", href: "/hosting/wordpress", tag: "BUILT FOR WORDPRESS" },
  { number: "03", title: "Managed cloud", detail: "Dedicated resources for bigger ambitions.", href: "/hosting/cloud", tag: "ROOM TO SCALE" },
  { number: "04", title: "Virtual servers", detail: "Your applications. Your server configuration.", href: "/hosting/vps", tag: "MORE CONTROL" },
];

function HostingDiagram() {
  return <div className="tech-diagram" aria-label="Hosting includes SSL, a global CDN, SSD storage, backups, and business email">
    <div className="tech-diagram-heading"><span>THE HOSTMYWEB STACK</span><span>01 / CLOUD HOSTING</span></div>
    <div className="tech-orbit" aria-hidden="true">
      <svg viewBox="0 0 600 430" fill="none">
        <defs><linearGradient id="network-line"><stop stopColor="#63edff"/><stop offset="1" stopColor="#78ffb3"/></linearGradient></defs>
        <g stroke="#254250" strokeWidth="1"><ellipse cx="300" cy="225" rx="250" ry="120"/><ellipse cx="300" cy="225" rx="180" ry="85"/><path d="M50 225H550M300 60V390M100 105L500 345M100 345L500 105"/></g>
        <g stroke="url(#network-line)" strokeWidth="2"><path d="M300 215L120 125M300 215L480 125M300 215L120 325M300 215L480 325"/></g>
        <g className="tech-pulses" fill="#75f7df"><circle cx="210" cy="170" r="4"/><circle cx="390" cy="170" r="4"/><circle cx="210" cy="270" r="4"/><circle cx="390" cy="270" r="4"/></g>
      </svg>
      <div className="tech-core"><span>H / W</span><small>YOUR WEBSITE</small></div>
      <div className="tech-node node-a"><span>01</span><b>SSL + CDN</b></div>
      <div className="tech-node node-b"><span>02</span><b>SSD storage</b></div>
      <div className="tech-node node-c"><span>03</span><b>Backups</b></div>
      <div className="tech-node node-d"><span>04</span><b>Business email</b></div>
    </div>
    <div className="tech-diagram-foot"><span>ONE HOME FOR YOUR WEBSITE</span><b>Ready for what’s next.</b></div>
  </div>;
}

export function HostMyWebIndexHome() {
  return <SiteFrame><div className="tech-home">
    <section className="tech-hero">
      <div className="tech-hero-copy">
        <div className="tech-eyebrow"><span className="tech-index">H / W</span> HOSTING. WITHOUT THE HOLDUPS.</div>
        <h1>Your next big thing.<br/><em>Built on a<br/>better home.</em></h1>
        <p>Cloud hosting for websites that mean business. SSL, backups, email, and a global CDN—already included.</p>
        <div className="tech-actions"><a className="tech-button" href="#plans">Find your hosting <span>↗</span></a><a className="tech-link" href="/hosting">Explore the platform <span>↗</span></a></div>
        <div className="tech-hero-price"><strong>$7.99<span>/mo</span></strong><div>Start small. Build from here.<br/><b>Same base price at renewal.</b></div></div>
      </div>
      <HostingDiagram />
      <div className="tech-hero-footer"><span>THE ESSENTIALS. ALREADY CONNECTED.</span><div><span>SSL certificates</span><span>Global CDN</span><span>SSH + Git</span><span>Unlimited bandwidth</span></div></div>
    </section>

    <section className="tech-services" aria-label="Hosting services">
      {services.map(service=><a href={service.href} key={service.number}><div><span className="tech-number">{service.number}</span><span className="tech-arrow">↗</span></div><h2>{service.title}</h2><p>{service.detail}</p><small>{service.tag}</small></a>)}
    </section>

    <section className="tech-domain" id="domains"><div><span className="tech-eyebrow">YOUR NEXT IDEA STARTS HERE</span><h2>Make a name<br/>for yourself.</h2><p>Find your domain. Give your next project a place on the web.</p><div className="tech-domain-prices"><span><b>.com</b> $17.99/yr</span><span><b>.net</b> $19.99/yr</span><span><b>.org</b> $17.99/yr</span></div></div><DomainSearch /></section>

    <section className="tech-plans" id="plans">
      <div className="tech-section-heading"><div><span className="tech-eyebrow">01 / CHOOSE YOUR FOUNDATION</span><h2>More capability.<br/><em>Less complication.</em></h2></div><p>Four plans. Clear limits. The same base subscription price at renewal while your plan stays continuously active.</p></div>
      <div className="tech-plan-grid">{HOSTING_PLAN_SLUGS.map((slug,index)=>{const plan=HOSTING_PLANS[slug];return <article className={`tech-plan ${slug==='business'?'tech-plan-featured':''}`} key={slug}><div className="tech-plan-top"><span>0{index+1} / {plan.code}</span>{slug==='business'&&<b>FOR GROWING BUSINESSES</b>}</div><h3>{plan.name}</h3><p>{slug==='starter'?'One site. A solid start.':slug==='business'?'Your business, with room to grow.':slug==='pro'?'More sites. More possibilities.':'A home for your client portfolio.'}</p><div className="tech-plan-price">${plan.monthlyPrice.toFixed(2)}<span>/mo</span></div><small>Same base rate at renewal</small><a href={`/signup?plan=${slug}`} className="tech-button">Choose {plan.name}<span>↗</span></a><ul><li><b>{plan.websites}</b> {plan.websites===1?'website':'websites'}</li><li><b>{plan.webspaceGb} GB</b> SSD storage</li><li><b>{plan.mailboxes}</b> business mailboxes</li><li><b>{plan.mailboxStorageGb} GB</b> per mailbox</li><li><b>{plan.databases}</b> MySQL databases</li></ul></article>;})}</div>
      <div className="tech-plan-included"><strong>Every plan includes</strong><span>Unlimited bandwidth</span><span>SSL + global CDN</span><span>Backups</span><span>SSH + Git</span><span>Standard migration</span></div>
    </section>

    <section className="tech-capabilities"><div className="tech-section-heading"><div><span className="tech-eyebrow">02 / BEYOND THE BASICS</span><h2>The tools behind<br/><em>your next move.</em></h2></div><a className="tech-link" href="/products">Explore all products ↗</a></div><div className="tech-capability-grid"><a href="/security" className="tech-capability-security"><span className="tech-number">PROTECT</span><div className="tech-symbol" aria-hidden="true">[ / ]</div><h3>Keep your focus.<br/>Keep your site protected.</h3><p>SSL, backup options, and security products for the website you’re building.</p><b>Explore security ↗</b></a><a href="/email"><span className="tech-number">CONNECT</span><div className="tech-symbol" aria-hidden="true">@</div><h3>Your business.<br/>Your email address.</h3><p>Professional mailboxes that put your domain on every conversation.</p><b>Explore business email ↗</b></a><a href="/websites/migration"><span className="tech-number">MOVE FORWARD</span><div className="tech-symbol" aria-hidden="true">↗</div><h3>A fresh start.<br/>Without starting over.</h3><p>Standard supported website migrations are included. Ask us about your move.</p><b>Plan your migration ↗</b></a></div></section>

    <section className="tech-closing"><span className="tech-eyebrow">BUILT FOR YOUR NEXT CHAPTER</span><h2>Go build<br/><em>something great.</em></h2><div><a className="tech-button" href="#plans">Choose your hosting <span>↗</span></a><a className="tech-link" href="/support">Let’s talk about your project ↗</a></div></section>
  </div></SiteFrame>;
}
