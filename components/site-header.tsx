import Link from "next/link";

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
    <header className="site-header shell">
      <div className="masthead-top">
        <span>An independent journal of curious history</span>
        <a href="/feed.xml">Follow the journal <span aria-hidden="true">↗</span></a>
      </div>
      <div className="masthead">
        <Link href="/" aria-label="Almost Lore home">Almost<span className="brand-compass"><Compass /></span>Lore</Link>
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
      <div className="plate-edge" aria-hidden="true" />
    </header>
  );
}
