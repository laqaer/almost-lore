import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header shell">
      <div className="masthead-top">
        <span>An independent journal of curious history</span>
        <a href="/feed.xml">Follow the journal <span aria-hidden="true">↗</span></a>
      </div>
      <div className="masthead">
        <Link href="/" aria-label="Almost Lore home">Almost<span className="brand-star" aria-hidden="true">✳</span>Lore</Link>
        <p>Too strange to forget.<br /> Too true to be folklore.</p>
      </div>
      <nav aria-label="Primary" className="primary-nav">
        <div>
          <Link href="/#stories">The stories</Link>
          <Link href="/about">Our approach</Link>
          <Link href="/dossier">The working file</Link>
          <Link href="/contact">Get in touch</Link>
        </div>
        <Link href="/#editors-picks" className="nav-pick">A good place to start <span aria-hidden="true">↘</span></Link>
      </nav>
    </header>
  );
}
