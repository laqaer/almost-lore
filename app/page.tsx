import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { EditionNumber } from "@/components/edition";
import { DocketBacks, HeroTicket } from "@/components/game/today";
import { Glyph, Hand, Slab } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { BuyButton } from "@/components/shop/buy-button";
import { ClassStage, PartyStage } from "@/components/shop/product-art";
import { getClaim, getSet } from "@/lib/game/content";
import { checkoutMode } from "@/lib/checkout";
import { getProduct } from "@/lib/products";
import { gameJsonLd } from "@/lib/schema";
import { getStory, readingMinutes } from "@/lib/stories";

const EXAMPLES = {
  happened: "cleopatra-closer-to-moon-landing",
  almost: "seed-greenland-1946",
  lore: "seed-viking-helmets",
} as const;

export default function HomePage() {
  const poyais = getStory("poyais-invented-country");
  const beach = getStory("forgotten-scheme");
  const fashoda = getStory("fashoda-incident-1898");
  const balloon = getStory("balloon-almost-atlantic");
  const partyCount = getSet("partyPack").length;
  const classCount = getSet("classroom").length;
  const party = getProduct("party-pack")!;
  const classroom = getProduct("classroom-pack")!;
  const examples = {
    happened: getClaim(EXAMPLES.happened),
    almost: getClaim(EXAMPLES.almost),
    lore: getClaim(EXAMPLES.lore),
  };

  return (
    <>
      <JsonLd data={gameJsonLd()} />

      {/* ============ HERO ============ */}
      <header className="hero">
        <div className="wrap">
          <hr className="rule-double" />
          <h1 className="headline wood" aria-label="Happened, almost, or lore?">
            <span className="h1 mis" data-t="Happened.">
              Happened.
            </span>
            <span className="h2">Almost.</span>
            <span className="h3 mis" data-t="Or lore?">
              Or lore?
            </span>
          </h1>
          <div className="strap">
            <p className="lede">Five history claims a day, written as plain fact. You stamp them. We open the record.</p>
            <span className="mono-s">About two minutes</span>
            <span className="mono-s">Every verdict sourced</span>
          </div>

          <div className="hero-grid">
            <HeroTicket />
            <figure className="plate">
              <svg className="sticker" viewBox="0 0 160 160" aria-hidden="true">
                <defs>
                  <path id="ring" d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
                </defs>
                <circle cx="80" cy="80" r="77" fill="#FFD23F" stroke="#141015" strokeWidth="3" />
                <circle cx="80" cy="80" r="44" fill="none" stroke="#141015" strokeWidth="1.5" />
                <text fontFamily="var(--font-mono)" fontWeight="600" fontSize="11" fill="#141015">
                  <textPath href="#ring" textLength="360" lengthAdjust="spacing">
                    STEP RIGHT UP · FIVE CLAIMS DAILY · ONE IS A TRAP ·{" "}
                  </textPath>
                </text>
                <text x="80" y="76" textAnchor="middle" fontFamily="var(--font-mono)" fontWeight="600" fontSize="10" letterSpacing="1.5" fill="#141015">
                  TODAY
                </text>
                <text x="80" y="108" textAnchor="middle" fontFamily="var(--font-wood)" fontWeight="900" fontSize="34" fill="#141015">
                  <EditionNumber prefix="No." fallback="No.1" />
                </text>
              </svg>
              <div className="plate-img">
                <div className="flood" />
                <div className="disc" />
                <Image
                  src="/images/riso/dancing-blue.webp"
                  alt="Engraving of pilgrims dancing on the road to Molenbeek, printed in riso blue over fluorescent pink"
                  width={820}
                  height={724}
                  priority
                  sizes="(max-width: 1180px) 90vw, 36vw"
                />
              </div>
              <span className="tape t1" aria-hidden="true" />
              <span className="tape t2" aria-hidden="true" />
              <figcaption className="mono-s">
                <b>Plate I.</b>
                <span>Pilgrims dancing at Molenbeek. After Pieter Bruegel the Elder, 1564; engraved by Hendrick Hondius, 1642.</span>
                <span className="it">In 1518, Strasbourg really did dance for weeks. How many died of it is a different question.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      <div className="ribbon-wrap" aria-hidden="true">
        <div className="ribbon">
          <div className="ribbon-track">
            {[0, 1].map((k) => (
              <span key={k} style={{ display: "contents" }}>
                {["Step right up", "Five claims daily", "One of them a trap"].map((phrase) => (
                  <span key={phrase} style={{ display: "contents" }}>
                    <span>{phrase}</span>
                    <Glyph v="happened" className="glyph h" />
                    <span>Happened</span>
                    <Glyph v="almost" className="glyph a" />
                    <span>Almost</span>
                    <Glyph v="lore" className="glyph l" />
                    <span>Lore</span>
                    <Hand bg="var(--ink)" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============ KEY TO THE STAMPS ============ */}
      <section className="sec" id="how" aria-labelledby="how-h">
        <div className="wrap">
          <div className="sec-head">
            <span className="mono-s">§ II</span>
            <span className="leader" />
            <span className="mono-s">How the stamps work</span>
          </div>
          <div className="key-top">
            <h2 className="wood sec-title" id="how-h">
              Key to the{" "}
              <span className="mis" data-t="stamps">
                stamps
              </span>
            </h2>
            <p>
              Every claim is written as plain fact. Your job is to decide how much of it is. Three stamps, no partial credit,
              and <em>every verdict comes with its sources</em>. (You may argue with the record. It keeps a public log of every
              time it lost.)
            </p>
          </div>

          <div className="keyrow">
            <span className="roman">I.</span>
            <div className="imp-wrap">
              <div className="impression v-happened" style={{ "--rot": "-4deg" } as React.CSSProperties}>
                Happened
              </div>
              <p className="mono-s ink-note">
                <Glyph v="happened" style={{ color: "var(--blue)" }} /> Riso blue · the full stop
              </p>
            </div>
            <p className="claim def">
              <b>True exactly as worded.</b> Not roughly, not in spirit. The date, the names and the numbers all survive a trip
              to the archive.
            </p>
            {examples.happened ? (
              <div className="example">
                <span className="mono-s">From the archive</span>
                <q>{examples.happened.claim}</q>
                <p className="ans">
                  <Slab v="happened" /> {examples.happened.record.split(". ").slice(0, 2).join(". ").replace(/\.?$/, ".")}
                </p>
              </div>
            ) : null}
          </div>

          <div className="keyrow">
            <span className="roman">II.</span>
            <div className="imp-wrap">
              <div className="impression v-almost" style={{ "--rot": "3deg" } as React.CSSProperties}>
                Almost
              </div>
              <p className="mono-s ink-note">
                <Glyph v="almost" /> Fluoro pink · the unclosed circle
              </p>
            </div>
            <div>
              <span className="mono-s house">The house speciality</span>
              <p className="claim def">
                <b>It came documented-close, then didn&apos;t.</b> The offer was made, the vote was held, the fuse was lit — and
                somebody blinked.
              </p>
            </div>
            {examples.almost ? (
              <div className="example">
                <span className="mono-s">From the archive</span>
                <q>{examples.almost.claim}</q>
                <p className="ans">
                  <Slab v="almost" /> {examples.almost.record}
                </p>
              </div>
            ) : null}
          </div>

          <div className="keyrow">
            <span className="roman">III.</span>
            <div className="imp-wrap">
              <div className="impression v-lore" style={{ "--rot": "-2deg" } as React.CSSProperties}>
                Lore
              </div>
              <p className="mono-s ink-note">
                <Glyph v="lore" /> Sunflower · the asterisk
              </p>
            </div>
            <p className="claim def">
              <b>A story everybody knows,</b> which is exactly how you can tell. Repeated so often it stopped needing a source.
              Every myth deserves an asterisk.
            </p>
            {examples.lore ? (
              <div className="example">
                <span className="mono-s">From the archive</span>
                <q>{examples.lore.claim}</q>
                <p className="ans">
                  <Slab v="lore" /> {examples.lore.record}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ============ TODAY'S DOCKET ============ */}
      <section className="sec docket-sec" id="docket" aria-labelledby="docket-h">
        <div className="wrap">
          <div className="sec-head">
            <span className="mono-s">§ III</span>
            <span className="leader" />
            <span className="mono-s">
              Today&apos;s docket · <EditionNumber />
            </span>
          </div>
          <div className="docket-top">
            <h2 className="wood" id="docket-h">
              <span className="mis" data-t="Today's">
                Today&apos;s
              </span>
              <br />
              docket
            </h2>
            <p className="intro">
              Five claims, face down. We print the subject on the back as a courtesy. Number five is <b>the trap</b>, and it is
              meaner than it looks.
            </p>
          </div>
          <DocketBacks />
          <div className="clock-row">
            <div className="clock">
              <span className="mono-s">The next docket goes to press in</span>
              <div className="digits">
                <Countdown />
              </div>
            </div>
            <div className="facts">
              <div>
                <span className="big">5</span>
                <span className="mono-s">Claims a day, one of them a trap</span>
              </div>
              <div>
                <span className="big">3</span>
                <span className="mono-s">Stamps, no partial credit</span>
              </div>
              <div>
                <span className="big">0</span>
                <span className="mono-s">Accounts, apps or ads required</span>
              </div>
            </div>
            <Link className="btn on-dark" href="/play">
              Play today&apos;s five <Hand bg="var(--bone-hi)" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CASE FILES ============ */}
      <section className="sec" id="case-files" aria-labelledby="cf-h">
        <div className="wrap">
          <div className="sec-head">
            <span className="mono-s">§ IV</span>
            <span className="leader" />
            <span className="mono-s">Longform, with footnotes</span>
          </div>
          <div className="cf-top">
            <div>
              <h2 className="wood sec-title" id="cf-h">
                Case{" "}
                <span className="mis" data-t="files">
                  files
                </span>
              </h2>
              <p>The near-misses, told properly. Maps, villains, ledgers — and the footnotes, which are the good part.</p>
            </div>
            <Link className="btn ghost" href="/case-files">
              All case files <Hand />
            </Link>
          </div>

          <div className="cf-grid">
            {poyais ? (
              <article className="cf-lead">
                <Link href="/case-files/poyais-invented-country" aria-label={poyais.title}>
                  <div className="art">
                    <span className="slab v-happened exhibit">Exhibit A · legal tender, allegedly</span>
                    <div className="note">
                      <Image src="/images/riso/poyais-blue.webp" alt="A Bank of Poyais one-dollar note, printed in riso blue" width={1200} height={585} sizes="(max-width: 1180px) 92vw, 60vw" />
                      <Image src="/images/riso/poyais-pink.webp" alt="" width={1200} height={585} sizes="(max-width: 1180px) 92vw, 60vw" />
                    </div>
                    <figure className="portrait">
                      <div className="ph">
                        <Image src="/images/riso/macgregor-ink.webp" alt="Portrait of Gregor MacGregor in military dress" width={460} height={580} sizes="30vw" />
                        <Image src="/images/riso/macgregor-pink.webp" alt="" width={460} height={580} sizes="30vw" />
                      </div>
                      <figcaption>“His Highness” Gregor MacGregor, Cazique of Poyais. Self-appointed.</figcaption>
                    </figure>
                  </div>
                </Link>
                <div className="kicker">
                  <span className="mono-s no">Case file · {poyais.yearLabel}</span>
                  <Slab v={poyais.verdict} />
                </div>
                <h3 className="claim">
                  <Link href="/case-files/poyais-invented-country">He invented a country, then sold shares in it.</Link>
                </h3>
                <p className="dek">{poyais.dek}</p>
                <div className="meta mono-s">
                  <span>{readingMinutes(poyais)} min read</span>
                  <span>Sourced</span>
                  <span>Uncertainty left visible</span>
                </div>
              </article>
            ) : null}

            <div className="cf-list">
              {beach ? (
                <Link className="cf-item" href="/case-files/forgotten-scheme">
                  <div className="thumb sun">
                    <Image src="/images/riso/beach-blue.webp" alt="Engraving of the 1870 Beach pneumatic subway car" width={700} height={689} sizes="136px" />
                    <Image className="l2" src="/images/riso/beach-sun.webp" alt="" width={700} height={689} sizes="136px" />
                  </div>
                  <div>
                    <span className="mono-s">
                      <b>{beach.verdict.toUpperCase()}</b> · New York · 1870
                    </span>
                    <div className="h4wrap">
                      <h4>{beach.title}</h4>
                    </div>
                    <p>One block, one car and one enormous fan. Then the city buried it.</p>
                  </div>
                </Link>
              ) : null}
              {fashoda ? (
                <Link className="cf-item" href="/case-files/fashoda-incident-1898">
                  <div className="thumb sun">
                    <svg viewBox="0 0 136 136" aria-label="Diagram of the Upper Nile with French and British routes converging at Fashoda">
                      <path d="M76 136 C 70 118, 84 106, 76 92 S 64 70, 72 56 S 88 30, 80 0" fill="none" stroke="#2F5BFF" strokeWidth="6" />
                      <path d="M0 74 C 22 70, 40 74, 64 68" fill="none" stroke="#141015" strokeWidth="2.4" strokeDasharray="5 4" />
                      <path d="M80 4 C 82 24, 74 40, 74 60" fill="none" stroke="#141015" strokeWidth="2.4" strokeDasharray="1.5 4" strokeLinecap="round" />
                      <circle cx="71" cy="66" r="7" fill="#FF4F9A" stroke="#141015" strokeWidth="2" />
                      <text x="8" y="64" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600" fill="#141015">FR →</text>
                      <text x="88" y="22" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600" fill="#141015">GB ↓</text>
                      <text x="86" y="92" fontFamily="var(--font-mono)" fontSize="8.5" fontWeight="600" fill="#141015">FASHODA</text>
                      <text x="86" y="124" fontFamily="var(--font-mono)" fontSize="8" fill="#141015">NILE</text>
                    </svg>
                  </div>
                  <div>
                    <span className="mono-s">
                      <b>{fashoda.verdict.toUpperCase()}</b> · Upper Nile · 1898
                    </span>
                    <div className="h4wrap">
                      <h4>{fashoda.title}</h4>
                    </div>
                    <p>A French column, a British flotilla and one mud fort. Two empires came within a telegram of war.</p>
                  </div>
                </Link>
              ) : null}
              {balloon ? (
                <Link className="cf-item" href="/case-files/balloon-almost-atlantic">
                  <div className="thumb pink">
                    <svg viewBox="0 0 136 136" aria-label="A balloon over waves, one hundred miles short of the coast">
                      <circle cx="68" cy="50" r="30" fill="#FBF6EC" stroke="#141015" strokeWidth="2.5" />
                      <path d="M44 66 L60 96 H76 L92 66" fill="none" stroke="#141015" strokeWidth="2" />
                      <rect x="59" y="96" width="18" height="12" fill="#141015" />
                      <path d="M0 122 q 11 -8 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0" fill="none" stroke="#2F5BFF" strokeWidth="4" />
                      <text x="8" y="16" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600" fill="#141015">110 MI SHORT</text>
                    </svg>
                  </div>
                  <div>
                    <span className="mono-s">
                      <b>{balloon.verdict.toUpperCase()}</b> · Atlantic · 1978
                    </span>
                    <div className="h4wrap">
                      <h4>{balloon.title}</h4>
                    </div>
                    <p>Two men, one leaking envelope, and the last stretch of the ocean covered by a trawler.</p>
                  </div>
                </Link>
              ) : null}
              <Link className="btn ghost cf-all" href="/case-files/poyais-invented-country">
                Read the Poyais file <Hand />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROMOS ============ */}
      <section className="sec" style={{ paddingTop: 0 }} aria-label="Special editions">
        <div className="wrap">
          <div className="sec-head">
            <span className="mono-s">§ V</span>
            <span className="leader" />
            <span className="mono-s">Special editions</span>
          </div>
          <div className="promos">
            <article className="gull" id="test">
              <div>
                <div className="eyebrow">
                  <span className="slab v-almost" style={{ fontSize: 16 }}>
                    20 claims
                  </span>
                  <span className="mono-s">The test · about 6 minutes</span>
                </div>
                <h3 className="wood">
                  How
                  <br />
                  gullible
                  <br />
                  are you<span className="q">?</span>
                </h3>
                <p>Twenty claims, no hints, no phone-a-friend. At the end: your score, your blind spot, and a certificate you will either frame or quietly delete.</p>
                <Link className="btn" href="/test">
                  Take the test <Hand bg="var(--ink)" />
                </Link>
              </div>
              <div className="striker" aria-label="Rank scale from Hollywood Screenwriter to Keeper of the Archive">
                <div className="bell" />
                <ol className="tower">
                  <li className="top">
                    <span className="sc">5</span>Keeper of the Archive
                  </li>
                  <li>
                    <span className="sc">4</span>Historian
                  </li>
                  <li>
                    <span className="sc">3</span>Pub Quizzer
                  </li>
                  <li>
                    <span className="sc">2</span>Tour Guide
                  </li>
                  <li>
                    <span className="sc">1</span>Uncle at Thanksgiving
                  </li>
                  <li>
                    <span className="sc">0</span>Hollywood Screenwriter
                  </li>
                </ol>
                <span className="mono-s base-note">Hit the bell. Or don&apos;t.</span>
              </div>
            </article>

            <article className="hallow" id="halloween">
              <div className="eyebrow mono-s">
                <span>Halloween edition</span>
                <span>Open now</span>
              </div>
              <div className="pic">
                <Image src="/images/riso/dancing-ink.webp" alt="The dancing pilgrims engraving, printed black on fluorescent pink" width={820} height={724} sizes="(max-width: 1180px) 92vw, 36vw" />
                <span className="slab v-lore">Haunted history</span>
              </div>
              <h3 className="wood">
                Witches,
                <br />
                curses &amp; frauds
              </h3>
              <p>
                Spooky claims about witch trials, vampire panics and the people who sold tickets to them.{" "}
                <b>Nobody was burned at Salem.</b> Everything else is up for grabs.
              </p>
              <div className="row">
                <Link className="btn on-dark" href="/halloween">
                  Play the edition <Hand bg="var(--bone-hi)" />
                </Link>
                <span className="mono-s">Printable pack for your party</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============ SHOP ============ */}
      <section className="sec" id="shop" style={{ paddingTop: 0 }} aria-labelledby="shop-h">
        <div className="wrap">
          <div className="sec-head">
            <span className="mono-s">§ VI</span>
            <span className="leader" />
            <span className="mono-s">The shop · printed matter</span>
          </div>
          <div className="shop-top">
            <div>
              <h2 className="wood sec-title" id="shop-h">
                Goods for the{" "}
                <span className="mis" data-t="well-actually">
                  well-actually
                </span>
              </h2>
              <p>For people who cannot let a wrong fact go, and the rooms that have to put up with them.</p>
            </div>
            <ul className="terms mono-s">
              <li>
                <span>Delivery</span>
                <span>Instant PDF</span>
              </li>
              <li>
                <span>Licence</span>
                <span>Your table, your class</span>
              </li>
              <li>
                <span>Refunds</span>
                <span>30 days, no argument</span>
              </li>
              <li>
                <span>Errata</span>
                <span>Published, gladly</span>
              </li>
            </ul>
          </div>
          <div className="shop-grid">
            <article className="item">
              <PartyStage />
              <div className="body">
                <span className="mono-s cat">Item 1A · print-and-play · 2 to 8 players</span>
                <h3>
                  <Link href="/shop/party-pack">The Party Pack</Link>
                </h3>
                <p className="desc">
                  {partyCount > 0 ? `${partyCount} claim cards` : "Claim cards"} you won&apos;t find in the daily game, stamp paddles for every
                  player and four ways to play. Ruins pub-quiz night for everybody else in the building.
                </p>
                <div className="buy">
                  <span className="price">
                    <sup>$</sup>
                    {party.priceCents / 100}
                    <span className="fmt">
                      PDF
                      <br />
                      A4 &amp; Letter
                    </span>
                  </span>
                  <BuyButton sku="party-pack" mode={checkoutMode("party-pack")} label="Buy the pack" />
                </div>
              </div>
            </article>

            <article className="item">
              <ClassStage />
              <div className="body">
                <span className="mono-s cat">Item 2B · for the projector</span>
                <h3>
                  <Link href="/shop/classroom-pack">The Classroom Pack</Link>
                </h3>
                <p className="desc">
                  {classCount > 0 ? `${classCount} bell-ringers` : "Bell-ringers"}, each with a sourced answer slide, a student
                  sheet and an evidence extension. Teaches weighing sources, not memorising dates.
                </p>
                <div className="buy">
                  <span className="price">
                    <sup>$</sup>
                    {classroom.priceCents / 100}
                    <span className="fmt">
                      Slides
                      <br />+ answer key
                    </span>
                  </span>
                  <BuyButton sku="classroom-pack" mode={checkoutMode("classroom-pack")} label="Buy for class" />
                </div>
              </div>
            </article>

            <article className="deck">
              <div className="box" aria-hidden="true">
                <div className="lid">
                  <span className="mono-s">Almost Lore · Vol. I</span>
                  <span className="band">3 INKS · 1 BOX · PROTOTYPE</span>
                  <div className="row">
                    <span className="wood">
                      The
                      <br />
                      Almanac
                      <br />
                      Deck
                    </span>
                    <span className="glyphs">
                      <Glyph v="happened" style={{ color: "var(--blue)" }} />
                      <Glyph v="almost" />
                      <Glyph v="lore" />
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span className="mono-s" style={{ color: "var(--sun)" }}>
                  Item 3C · waitlist · no payment taken
                </span>
                <h3 className="wood">
                  A real box. <span className="y">Someday soon.</span>
                </h3>
                <p>
                  Heavy stock, riso-printed in three inks, with rubber stamps you can actually slam on a table. It gets made when
                  enough of you ask. Join the list and we&apos;ll write when the printer says yes.
                </p>
                <div className="on-ink">
                  <NewsletterForm source="deck-waitlist" tags={["waitlist:deck"]} cta="Join the waitlist" done="You're on the list. We'll write when the printer says yes." />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============ DISPATCH ============ */}
      <section className="dispatch" aria-labelledby="dispatch-h">
        <div className="wrap">
          <div className="d-left">
            <h2 className="wood" id="dispatch-h">
              The Sunday
              <br />
              <span className="mis" data-t="Docket">
                Docket
              </span>
            </h2>
            <svg className="postmark" viewBox="0 0 300 150" aria-hidden="true">
              <defs>
                <path id="pm" d="M75,75 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
              </defs>
              <g fill="none" stroke="#141015" strokeWidth="3">
                <circle cx="75" cy="75" r="68" />
                <circle cx="75" cy="75" r="37" strokeWidth="1.8" />
                <path d="M150 45 q 12 -9 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0" />
                <path d="M150 63 q 12 -9 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0" />
                <path d="M150 81 q 12 -9 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0" />
                <path d="M150 99 q 12 -9 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0" />
              </g>
              <text fontFamily="var(--font-mono)" fontWeight="600" fontSize="11.5" fill="#141015">
                <textPath href="#pm" textLength="322" lengthAdjust="spacing">
                  ALMOST LORE · BY ELECTRIC POST ·{" "}
                </textPath>
              </text>
              <text x="75" y="84" textAnchor="middle" fontFamily="var(--font-wood)" fontWeight="900" fontSize="26" fill="#141015">
                SUN
              </text>
            </svg>
          </div>
          <div>
            <p>One near-miss a week, told properly. Plus the trap that fooled the most people, and exactly why.</p>
            <NewsletterForm source="home" cta="Subscribe" />
            <p className="mono-s fine">Free. Weekly. Unsubscribe in one click. We never sell the list.</p>
          </div>
        </div>
      </section>
    </>
  );
}
