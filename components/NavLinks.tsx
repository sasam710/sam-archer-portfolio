"use client";

import Link from "next/link";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#case-studies", label: "Case studies" },
  { href: "/#demo", label: "Inbox demo" },
  { href: "/#debug", label: "Debug demo" },
  { href: "/#playbook", label: "Playbook" },
  { href: "/#open", label: "In the open" },
] as const;

function closeMobileMenu() {
  const menu = document.querySelector(".nav-mobile");
  if (menu instanceof HTMLDetailsElement) menu.open = false;
}

export function NavLinks({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {NAV.map((item) => (
        <li key={item.href}>
          <Link href={item.href} onClick={closeMobileMenu}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
