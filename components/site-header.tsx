import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { EditionDate, EditionNumber } from "@/components/edition";
import { Hand } from "@/components/icons";

const NAV = [
  { href: "/play", label: "Today's docket" },
  { href: "/case-files", label: "Case files" },
  { href: "/test", label: "Gullibility test" },
  { href: "/halloween", label: "Halloween" },
  { href: "/shop", label: "Shop" },
];

export function SiteHeader() {
  return (
    <>
      <div className="ticker" role="note" aria-label="Edition">
        <div className="wrap">
          <span className="mono-s">
            <b>
              <EditionNumber fallback="Today" />
            </b>
          </span>
          <span className="mono-s hide-xs">
            <EditionDate />
          </span>
          <span className="mono-s hide-s">
            Five claims <span className="sep">/</span> one trap <span className="sep">/</span> no mercy
          </span>
          <span className="mono-s hide-s">Printed at your midnight in three inks and one lie</span>
          <span className="mono-s push">
            Next edition <b><Countdown /></b>
          </span>
        </div>
      </div>
      <nav className="nav" aria-label="Main">
        <div className="wrap">
          <Link className="logo" href="/" aria-label="Almost Lore, home">
            <Hand />
            <span className="wood mis" data-t="Almost Lore">
              Almost Lore
            </span>
            <span className="tag">
              A daily almanac
              <br />
              of near-misses
            </span>
          </Link>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <Link className="btn play" href="/play">
            Play
            <span className="long">
              {" "}
              <EditionNumber />
            </span>
            <Hand bg="var(--ink)" />
          </Link>
          <details className="menu">
            <summary className="btn ghost" aria-label="Open the index">
              Index
            </summary>
            <div className="menu-panel">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label} <span aria-hidden="true">→</span>
                </Link>
              ))}
              <Link href="/answers">
                The archive <span aria-hidden="true">→</span>
              </Link>
              <Link href="/rules">
                The rules <span aria-hidden="true">→</span>
              </Link>
            </div>
          </details>
        </div>
      </nav>
    </>
  );
}
