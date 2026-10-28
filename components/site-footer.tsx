import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer"><div className="shell">
      <div className="footer-main">
        <div>
          <Link href="/" className="footer-brand">Almost Lore<span aria-hidden="true">✳</span></Link>
          <p>For the stories that fell<br />between the history books.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/#stories">The stories</Link>
          <Link href="/about">Our approach</Link>
          <Link href="/now">At the editorial desk</Link>
          <Link href="/dossier">The working file</Link>
          <Link href="/contact">Contact & corrections</Link>
          <a href="/feed.xml">Follow via RSS ↗</a>
        </nav>
        <div className="footer-note">
          <p className="kicker">Stay curious</p>
          <p>Every story starts with a record.<br />Every good record raises a question.</p>
          <Link href="/support" className="text-link">Send us a lead <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.publisher} · An independent publication</span>
        <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/friends">Friends of the journal</Link></div>
      </div>
    </div></footer>
  );
}
