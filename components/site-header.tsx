import Link from "next/link";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-rule bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-4 px-4 py-5 sm:px-6">
        <Link href="/" className="font-display text-2xl text-ink tracking-tight">
          {site.shortName}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
          <Link className="hover:text-rust" href="/#stories">
            Stories
          </Link>
          <Link className="hover:text-rust" href="/friends">
            Friends
          </Link>
        </nav>
      </div>
    </header>
  );
}
