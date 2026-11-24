"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#case-studies", label: "Case studies" },
  { href: "/#demo", label: "Inbox demo" },
  { href: "/#debug", label: "Debug demo" },
  { href: "/#playbook", label: "Playbook" },
  { href: "/#open", label: "In the open" },
  { href: "/changelog", label: "Changelog" },
] as const;

function closeMobileMenu() {
  const menu = document.querySelector(".nav-mobile");
  if (menu instanceof HTMLDetailsElement) menu.open = false;
}

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <ul className={className}>
      {NAV.map((item) => {
        const current = item.href === "/changelog" && pathname === "/changelog";
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
