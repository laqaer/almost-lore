import Link from "next/link";
import { Glyph } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { BuyButton } from "@/components/shop/buy-button";
import { ClassStage, HalloweenStage, PartyStage } from "@/components/shop/product-art";
import { STARTER_DECK, starterDeckAvailable } from "@/lib/free";
import { getSet } from "@/lib/game/content";
import { pageMetadata } from "@/lib/metadata";
import { checkoutMode, getProduct, type Product } from "@/lib/products";

export const metadata = pageMetadata({
  title: "The Shop — printable history games",
  description:
    "Print-at-home party games and classroom bell-ringers built from history's near-misses, myths and true stories. Every card sourced.",
  path: "/shop",
});

function Price({ product, fmt }: { product: Product; fmt: React.ReactNode }) {
  return (
    <span className="price">
      <sup>$</sup>
      {product.priceCents / 100}
      <span className="fmt">{fmt}</span>
    </span>
  );
}

export default function ShopPage() {
  const party = getProduct("party-pack")!;
  const classroom = getProduct("classroom-pack")!;
  const halloween = getProduct("halloween-pack")!;
  const counts = {
    party: getSet("partyPack").length,
    classroom: getSet("classroom").length,
    halloween: getSet("halloween").length,
  };
  const live = checkoutMode("party-pack") !== "waitlist";
  const starter = starterDeckAvailable();

  return (
    <div className="shop-page">
      <header className="page-head">
        <div className="wrap">
          <hr className="rule-double" />
          <div className="page-kicker">
            <span className="mono-s">The shop · printable · every card sourced</span>
          </div>
          <h1 className="wood page-title">
            <span className="mis" data-t="The Shop">
              The Shop
            </span>
          </h1>
          <p className="page-dek">
            The daily game, printed out and taken to the table. Party packs, classroom bell-ringers and a Halloween edition —
            {live ? " instant download, 30-day refund, no account needed." : " checkout opens soon. Leave your email and we'll write when it does."}
          </p>
        </div>
      </header>

      <section className="wrap" style={{ paddingBottom: 80 }} aria-label="Products">
        <div className="shop-grid">
          <article className="item">
            <PartyStage />
            <div className="body">
              <span className="mono-s cat">Item 1A · print-and-play · 2 to 8 players</span>
              <h2 className="h3like">
                <Link href={party.path}>The Party Pack</Link>
              </h2>
              <p className="desc">
                {counts.party} claim cards you won&apos;t find in the daily game, stamp paddles and four ways to play.
              </p>
              <div className="buy">
                <Price product={party} fmt={<>PDF<br />A4 &amp; Letter</>} />
                <Link className="btn ghost" href={party.path}>
                  Look inside
                </Link>
              </div>
            </div>
          </article>

          <article className="item">
            <ClassStage />
            <div className="body">
              <span className="mono-s cat">Item 2B · for the projector · grades 6–12</span>
              <h2 className="h3like">
                <Link href={classroom.path}>The Classroom Pack</Link>
              </h2>
              <p className="desc">
                {counts.classroom} bell-ringers with sourced answer slides, a student sheet and an evidence extension.
              </p>
              <div className="buy">
                <Price product={classroom} fmt={<>Slides<br />+ answer key</>} />
                <Link className="btn ghost" href={classroom.path}>
                  Look inside
                </Link>
              </div>
            </div>
          </article>

          <article className="item">
            <HalloweenStage />
            <div className="body">
              <span className="mono-s cat">Item 4D · seasonal · dinner-party sized</span>
              <h2 className="h3like">
                <Link href="/halloween#buy">Haunted History</Link>
              </h2>
              <p className="desc">
                {counts.halloween} spooky-history cards and place cards for the table. The truth is the scary part.
              </p>
              <div className="buy">
                <Price product={halloween} fmt={<>PDF<br />Halloween</>} />
                <BuyButton sku="halloween-pack" mode={checkoutMode("halloween-pack")} label="Buy" />
              </div>
            </div>
          </article>

          <article className="deck" id="deck">
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
              <h2 className="wood">
                A real box. <span className="y">Someday soon.</span>
              </h2>
              <p>
                Heavy stock, riso-printed in three inks, with rubber stamps you can slam on a table. It gets made when enough
                people ask. Join the list and we&apos;ll write when the printer says yes.
              </p>
              <div className="on-ink">
                <NewsletterForm
                  source="deck-waitlist"
                  tags={["waitlist:deck"]}
                  cta="Join the waitlist"
                  done="You're on the list. We'll write when the printer says yes."
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="shop-sec">
        <div className="wrap two">
          <div>
            <p className="mono-s">Before you buy</p>
            <h2 className="wood">How it works</h2>
          </div>
          <div className="faq">
            <details open>
              <summary>What do I actually get?</summary>
              <p>
                A PDF you print at home or at a copy shop, on A4 or US Letter. Cards, rules and the sourced record for every
                claim. Classroom packs add projector slides and an answer key.
              </p>
            </details>
            <details>
              <summary>Are the answers right?</summary>
              <p>
                Every claim has at least two sources, and each one is fact-checked before it ships. If we get one wrong, we fix
                the file, log it on the <Link href="/corrections">corrections page</Link> and you can re-download.
              </p>
            </details>
            <details>
              <summary>What if it doesn&apos;t work for my table?</summary>
              <p>
                Email us within 30 days and we refund you in full. See the <Link href="/terms">terms</Link>.
              </p>
            </details>
            {starter ? (
              <details>
                <summary>Can I try it first?</summary>
                <p>
                  Yes. The <a href={STARTER_DECK}>free starter deck</a> has 18 printable cards from the same archive.
                </p>
              </details>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
