import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <strong>Sam Archer</strong>
          <span>Product support</span>
        </Link>
        <nav className="nav-desktop" aria-label="Primary">
          <NavLinks className="nav-list" />
        </nav>
        <details className="nav-mobile">
          <summary>Menu</summary>
          <nav aria-label="Mobile">
            <NavLinks className="nav-list" />
          </nav>
        </details>
      </div>
    </header>
  );
}
