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
  notice,
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
  return <SiteFrame><ProductHero eyebrow={eyebrow} title={title} accent={accent} description={description}>{primaryHref || secondaryHref ? <div className="hmw-actions">{primaryHref ? <a className="hmw-button" href={primaryHref}>{primaryLabel || "Get Started"}</a> : null}{secondaryHref ? <a className="hmw-button secondary" href={secondaryHref}>{secondaryLabel || "Learn More"}</a> : null}</div> : null}</ProductHero><section className="hmw-product-shell"><div className="hmw-section-head"><div><span className="hmw-eyebrow"><i /> PRODUCT DETAILS</span><h2>{sectionTitle}</h2><p>{sectionText}</p></div></div><div className="hmw-feature-list">{features.map((item) => <article key={item.title}><small>{item.label}</small><b>{item.title}</b><p>{item.text}</p></article>)}</div>{notice ? <p className="hmw-notice" style={{ marginTop: 24 }}>{notice}</p> : null}</section>{links?.length ? <section className="hmw-section alt"><div className="hmw-section-head"><div><span className="hmw-eyebrow"><i /> RELATED SERVICES</span><h2>Keep moving.</h2></div></div><div className="hmw-index-grid">{links.map((item) => <a className="hmw-index-link" href={item.href} key={item.title}><div>{item.meta ? <small>{item.meta}</small> : null}<h3>{item.title}</h3><p>{item.text}</p></div><span>→</span></a>)}</div></section> : null}</SiteFrame>;
}
