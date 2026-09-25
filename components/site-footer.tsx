import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <p className="motto">It almost happened. We have the paperwork.</p>
            <p className="who">
              Published by {site.publisher}. Researched and fact-checked by an AI editorial team under a public
              rubric; a human publisher answers for every verdict.
            </p>
          </div>
          <div>
            <span className="mono-s">Play</span>
            <ul>
              <li><Link href="/play">Today&apos;s docket</Link></li>
              <li><Link href="/answers">The archive</Link></li>
              <li><Link href="/test">Gullibility Test</Link></li>
              <li><Link href="/halloween">Halloween Edition</Link></li>
              <li><a href="/class">Projector mode</a></li>
            </ul>
          </div>
          <div>
            <span className="mono-s">Read</span>
            <ul>
              <li><Link href="/case-files">Case Files</Link></li>
              <li><Link href="/rules">The rules</Link></li>
              <li><Link href="/corrections">Corrections</Link></li>
              <li><Link href="/newsletter">The Sunday Docket</Link></li>
            </ul>
          </div>
          <div>
            <span className="mono-s">Shop</span>
            <ul>
              <li><Link href="/shop/party-pack">Party Pack · $12</Link></li>
              <li><Link href="/shop/classroom-pack">Classroom Pack · $15</Link></li>
              <li><Link href="/halloween">Halloween Pack · $7</Link></li>
              <li><Link href="/shop#deck">The boxed deck</Link></li>
            </ul>
          </div>
          <div>
            <span className="mono-s">Masthead</span>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><a href={`mailto:${site.email}`}>Contact</a></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms &amp; refunds</Link></li>
            </ul>
          </div>
        </div>
        <div className="wood bigmark" aria-hidden="true">
          <span className="mis" data-t="Almost Lore">
            Almost Lore
          </span>
        </div>
        <div className="colophon mono-s">
          <span>
            © {year} {site.publisher} · {site.domain}
          </span>
          <span>Printed daily in fluoro pink, riso blue &amp; sunflower on bone</span>
          <span>Archival images: public domain, credited where used</span>
        </div>
      </div>
    </footer>
  );
}
