import Link from "next/link";
import { links } from "@/lib/links";

export function OpenWork() {
  return (
    <section className="section open-band" id="open" aria-labelledby="open-title">
      <div className="wrap">
        <h2 id="open-title">Built in the open</h2>
        <p className="lede">
          This site lives in a public repo. The changelog is the record of what shipped. Issues are
          the roadmap. If a resume link, a triage rule, or a paragraph should change, it should be an
          issue someone can point at.
        </p>
        <ul className="open-links">
          <li>
            <a className="button button-primary" href={links.github} target="_blank" rel="noreferrer">
              GitHub repo
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a className="button button-ghost" href={links.issues} target="_blank" rel="noreferrer">
              Issues
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <Link className="button button-ghost" href="/changelog">
              Changelog
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
