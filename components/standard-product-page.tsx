import { ProductHero, SiteFrame } from "@/components/hostmyweb-site-chrome";

type Feature = { label: string; title: string; text: string };
type LinkCard = { title: string; text: string; meta?: string; href: string };

export function StandardProductPage({
  eyebrow,
  title,
  accent,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  features,
  sectionTitle,
  sectionText,
  links,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  features: Feature[];
  sectionTitle: string;
  sectionText: string;
  links?: LinkCard[];
  notice?: string;
}) {
  return (
    <SiteFrame>
      <ProductHero eyebrow={eyebrow} title={title} accent={accent} description={description}>
        {(primaryHref || secondaryHref) && (
          <div className="hmw-actions hmw-product-actions">
            {primaryHref && <a className="hmw-button" href={primaryHref}>{primaryLabel || "Get Started"}</a>}
            {secondaryHref && <a className="hmw-button secondary" href={secondaryHref}>{secondaryLabel || "Learn More"}</a>}
          </div>
        )}
      </ProductHero>

      <section className="hmw-product-value-strip" aria-label="HostMyWeb product benefits">
        <article><span>01</span><div><b>Clear product scope</b><p>Know what the service is designed to do before you order.</p></div></article>
        <article><span>02</span><div><b>Connected account</b><p>Keep related hosting, domains, email, orders, and support together.</p></div></article>
        <article><span>03</span><div><b>Human help available</b><p>Get help choosing or configuring the service when the workload needs it.</p></div></article>
      </section>

      <section className="hmw-product-detail-shell">
        <div className="hmw-product-detail-intro">
          <span className="hmw-storefront-kicker">WHAT YOU GET</span>
          <h2>{sectionTitle}</h2>
          <p>{sectionText}</p>
        </div>

        <div className="hmw-product-feature-grid">
          {features.map((item, index) => (
            <article key={item.title}>
              <div className="hmw-product-feature-top"><span>{String(index + 1).padStart(2, "0")}</span><small>{item.label}</small></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hmw-product-confidence-band">
        <div>
          <span>HOSTMYWEB SERVICE EXPERIENCE</span>
          <h2>One product page. One clear next step.</h2>
          <p>Choose the service directly when it fits, compare related options when you are still deciding, or contact HostMyWeb when the project needs a custom configuration.</p>
        </div>
        <div className="hmw-product-confidence-cards">
          <article><b>Transparent</b><span>Features and service scope shown before checkout.</span></article>
          <article><b>Connected</b><span>Products work alongside domains, email, hosting, and support.</span></article>
          <article><b>Scalable</b><span>Move into larger hosting or infrastructure when the workload changes.</span></article>
        </div>
      </section>

      {links?.length ? (
        <section className="hmw-product-related-section">
          <div className="hmw-product-related-heading">
            <span className="hmw-storefront-kicker">RELATED SERVICES</span>
            <h2>Build around what you need.</h2>
            <p>These services work naturally alongside this product and give you a clear path if your needs change.</p>
          </div>
          <div className="hmw-product-related-grid">
            {links.map((item) => (
              <a href={item.href} key={item.title}>
                {item.meta ? <small>{item.meta}</small> : <small>HOSTMYWEB</small>}
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <b>Explore service <span>→</span></b>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="hmw-product-final-cta">
        <div>
          <span>READY TO MOVE FORWARD?</span>
          <h2>{primaryLabel || "Get started with HostMyWeb."}</h2>
          <p>Choose the product now or compare your options before making a decision.</p>
        </div>
        <div>
          {primaryHref && <a className="hmw-product-final-primary" href={primaryHref}>{primaryLabel || "Get Started"}</a>}
          {secondaryHref && <a className="hmw-product-final-secondary" href={secondaryHref}>{secondaryLabel || "Compare Options"}</a>}
        </div>
      </section>
    </SiteFrame>
  );
}
