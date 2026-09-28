import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/#stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/dossier", label: "Working file" },
];

export function SiteHeader() {
  return (
    <header className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="border-b border-rule py-3 text-center text-[11px] uppercase text-ink-faint">
          {site.publisher} · an editorial archive
        </p>
        <div className="py-7 text-center">
          <Link
            className="font-display text-5xl text-ink hover:text-rust sm:text-6xl"
            href="/"
          >
            {site.name}
          </Link>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft">{site.tagline}</p>
        </div>
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-t border-rule py-3 text-xs uppercase text-ink-soft"
        >
          {nav.map((item) => (
            <Link key={item.href} className="hover:text-rust" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
