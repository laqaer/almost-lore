import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/#stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/dossier", label: "Working file" },
];

function Compass() {
  return (
    <svg className="compass" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" />
      <path d="M24 7.5 L26.4 22.2 H21.6 Z" fill="currentColor" />
      <path d="M24 40.5 L21.6 25.8 H26.4 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M8 24 H16 M32 24 H40" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header>
      <div className="site-plate">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="plate-running">
            {site.publisher} · an editorial archive
          </p>
          <div className="plate-mast">
            <Compass />
            <Link className="masthead" href="/">
              {site.name}
            </Link>
            <p className="mast-tagline">{site.tagline}</p>
          </div>
          <nav aria-label="Primary" className="plate-nav">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="plate-edge" aria-hidden="true" />
    </header>
  );
}
