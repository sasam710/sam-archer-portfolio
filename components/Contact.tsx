import { links } from "@/lib/links";

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title">Contact</h2>
        <p className="lede">Open to remote or Austin product support roles. Central time.</p>
        <p>US green card holder. No sponsorship needed.</p>
        <div className="actions">
          <a className="button button-primary" href={links.email}>
            Email
          </a>
          <a className="button button-ghost" href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <a className="button button-ghost" href={links.resume}>
            Resume
          </a>
        </div>
      </div>
    </section>
  );
}
