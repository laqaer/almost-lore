import Link from "next/link";
import { site } from "@/lib/site";

const sections = [
  { href: "/#stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/dossier", label: "Working file" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="foot-name">{site.name}</p>
            <p className="mt-2 max-w-sm text-base leading-6 text-ink-soft">{site.tagline}</p>
          </div>
          <nav aria-label="Footer" className="foot-links">
            <h2 className="foot-label">Sections</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <a href="/feed.xml">RSS feed</a>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="foot-label">Contact</h2>
            <p className="mt-3 text-base leading-6 text-ink-soft">
              Questions, corrections, and source notes:{" "}
              <Link className="text-teal hover:text-rust" href="/contact">
                the contact page
              </Link>
              .
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-rule pt-6 text-sm text-ink-faint">
          © {new Date().getFullYear()} {site.publisher}. {site.name} publishes original longform
          essays.
        </p>
      </div>
    </footer>
  );
}
