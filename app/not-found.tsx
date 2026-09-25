import Link from "next/link";
import { Hand } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="lost">
      <div className="wrap">
        <hr className="rule-double" />
        <p className="mono-s" style={{ margin: "18px 0" }}>
          Error 404 · filed under: missing
        </p>
        <h1 className="wood page-title">
          This page is <span className="mis" data-t="lore.">lore.</span>
        </h1>
        <p className="page-dek">
          Widely rumoured, never documented. Either it never existed, or it isn&apos;t open yet — future dockets stay sealed
          until their day.
        </p>
        <div className="btnrow" style={{ marginTop: 28 }}>
          <Link className="btn" href="/play">
            Play today&apos;s docket <Hand bg="var(--ink)" />
          </Link>
          <Link className="btn ghost" href="/">
            Back to the front page
          </Link>
        </div>
      </div>
    </section>
  );
}
