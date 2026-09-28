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
    <footer className="mt-20 border-t border-rule bg-paper-deep">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-ink">{site.name}</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">{site.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <h2 className="kicker">Sections</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-1">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link className="text-teal hover:text-rust" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a className="text-teal hover:text-rust" href="/feed.xml">
                  RSS feed
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="kicker">Contact</h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
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
