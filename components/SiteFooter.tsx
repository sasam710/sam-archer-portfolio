import Link from "next/link";
import { links } from "@/lib/links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-name">Sam Archer</p>
          <p>
            Product support specialist at Fyxer. Austin, TX. Central time. Originally from London.
          </p>
          <p>US green card holder. No sponsorship needed.</p>
        </div>
        <ul className="footer-links">
          <li>
            <a href={links.email}>Email</a>
          </li>
          <li>
            <a href={links.resume}>Resume</a>
          </li>
          <li>
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={links.github} target="_blank" rel="noreferrer">
              GitHub
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <Link href="/changelog">Changelog</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
