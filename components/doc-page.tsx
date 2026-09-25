import Link from "next/link";

/** Interior page shell: kicker, big wood title, dated, prose on a paper sheet. */
export function DocPage({
  kicker,
  title,
  dek,
  updated,
  children,
  aside,
}: {
  kicker: string;
  title: string;
  dek?: string;
  updated?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <hr className="rule-double" />
          <div className="page-kicker">
            <span className="mono-s">{kicker}</span>
            {updated ? <span className="mono-s">· Updated {updated}</span> : null}
          </div>
          <h1 className="wood page-title">
            <span className="mis" data-t={title}>
              {title}
            </span>
          </h1>
          {dek ? <p className="page-dek">{dek}</p> : null}
        </div>
      </header>
      <div className="doc">
        <div className="wrap doc-grid">
          <aside className="doc-aside mono-s">
            {aside ?? (
              <>
                <Link className="link" href="/play">
                  Play today&apos;s docket
                </Link>
                <Link className="link" href="/rules">
                  The rules
                </Link>
                <Link className="link" href="/about">
                  About
                </Link>
              </>
            )}
          </aside>
          <div className="paper">
            <div className="prose">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
