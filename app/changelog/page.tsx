import type { Metadata } from "next";
import Link from "next/link";
import { changelog } from "@/lib/changelog";
import { links } from "@/lib/links";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What has changed on Sam Archer's portfolio site.",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPage() {
  return (
    <main id="content" className="wrap page changelog" tabIndex={-1}>
      <p className="eyebrow">Built in the open</p>
      <h1>Changelog</h1>
      <p className="lede">
        Notable changes to this site. The same notes live in CHANGELOG.md. GitHub issues are the
        roadmap.
      </p>
      <p className="changelog-links">
        <a className="text-link" href={links.issues} target="_blank" rel="noreferrer">
          Open issues
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
        <Link className="text-link" href="/">
          Back to the portfolio
        </Link>
      </p>
      <ol className="changelog-list">
        {changelog.map((entry) => (
          <li key={entry.version}>
            <h2>
              {entry.version} <span className="muted">{entry.date}</span>
            </h2>
            <ul>
              {entry.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </main>
  );
}
