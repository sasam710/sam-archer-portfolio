import { links } from "@/lib/links";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="intro-title">
      <div className="wrap hero-grid">
        <div>
          <p className="eyebrow">Product support</p>
          <h1 id="intro-title">Support specialist who turns queues into systems.</h1>
          <p className="lede">
            I am Sam Archer, a product support specialist at Fyxer, an AI email assistant. I came
            from Klaviyo, where I led a support pod, coached new specialists, and built a small
            plugin so quiet threads stayed visible.
          </p>
          <div className="actions">
            <a className="button button-primary" href={links.cv}>
              View CV
            </a>
            <a className="button button-ghost" href={links.linkedin}>
              LinkedIn
            </a>
          </div>
        </div>
        <aside className="now-card" aria-label="Current role">
          <p className="eyebrow">Now</p>
          <p className="now-role">Product Support Specialist</p>
          <p className="now-company">Fyxer</p>
          <p>AI email assistant</p>
          <p className="muted">October 2026 to present</p>
          <dl className="facts">
            <dt>Based</dt>
            <dd>Austin, TX</dd>
            <dt>Hours</dt>
            <dd>Central time</dd>
            <dt>From</dt>
            <dd>London</dd>
          </dl>
        </aside>
      </div>
    </section>
  );
}
