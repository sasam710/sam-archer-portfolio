import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="wrap page page-miss" tabIndex={-1}>
      <p className="eyebrow">404</p>
      <h1>That page is not here.</h1>
      <p className="lede">The site has a home page and a changelog.</p>
      <Link className="button button-primary" href="/">
        Back to the home page
      </Link>
    </main>
  );
}
