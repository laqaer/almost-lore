import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Glyph, Mark, Slab } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { BuyButton } from "@/components/shop/buy-button";
import { ClassStage, PartyStage } from "@/components/shop/product-art";
import { STARTER_DECK, starterDeckAvailable } from "@/lib/free";
import { getSet } from "@/lib/game/content";
import { VERDICT_SAY } from "@/lib/game/scoring";
import type { Claim, Verdict } from "@/lib/game/types";
import { pageMetadata } from "@/lib/metadata";
import { checkoutMode, formatPrice, getProduct, type Product } from "@/lib/products";
import { faqJsonLd, productJsonLd } from "@/lib/schema";

type Props = { params: Promise<{ sku: string }> };

type Page = {
  sku: string;
  tiers: string[];
  kicker: string;
  title: string;
  description: string;
  inside: (count: number) => [string, string][];
  faq: { q: string; a: string }[];
};

const PAGES: Record<string, Page> = {
  "party-pack": {
    sku: "party-pack",
    tiers: ["party-pack", "party-pack-office"],
    kicker: "Item 1A · print-and-play · 2 to 8 players",
    title: "The Party Pack — a printable history party game",
    description:
      "A print-at-home card game of history's near-misses, myths and true stories so strange they sound made up. Stamp each claim HAPPENED, ALMOST or LORE, then flip for the record.",
    inside: (count) => [
      [String(count), "claim cards that never appear in the daily game, each with its verdict and record on the back"],
      ["4", "ways to play: Stamp Off, The Dad Test, Two Truths and a Lore, and Draft Night"],
      ["8", "stamp paddles to cut out, one per player"],
      ["1", "host script for running a round in a room or on a video call"],
    ],
    faq: [
      {
        q: "How many people can play?",
        a: "Two to eight at one table, with paddles for everyone. The Dad Test works with one reader and any number of guessers.",
      },
      {
        q: "Do I need a colour printer?",
        a: "No. Every card reads in black and white. Colour looks better, and card stock holds up to a few rounds of slamming.",
      },
      {
        q: "Are these the same claims as the daily game?",
        a: "No. Party Pack cards are exclusive to the pack and never scheduled in a daily docket, so regular players aren't spoiled.",
      },
      {
        q: "What's the Office Edition?",
        a: "The same files with a licence for one organisation to use at unlimited internal events, plus a receipt for expenses. Households only need the standard pack.",
      },
      {
        q: "What if it doesn't work for us?",
        a: "Email us within 30 days of purchase and we refund you in full.",
      },
    ],
  },
  "classroom-pack": {
    sku: "classroom-pack",
    tiers: ["classroom-pack", "classroom-department"],
    kicker: "Item 2B · for the projector · grades 6–12",
    title: "Classroom Pack — history bell-ringers on evaluating sources",
    description:
      "Projector-ready history bell-ringers: students weigh a claim, vote HAPPENED, ALMOST or LORE, then check the sourced record. Slides, recording sheet and answer key.",
    inside: (count) => [
      [String(count), "bell-ringer slides: the claim alone, big enough for the back row"],
      [String(count), "answer slides with the verdict, a short record and two named sources"],
      ["1", "student recording sheet: vote, confidence, and what would change your mind"],
      ["1", "extension lesson: write your own ALMOST, then trade and fact-check"],
    ],
    faq: [
      {
        q: "What ages is it for?",
        a: "Written for grades 6–12. Every claim in the pack is marked school-safe: no graphic violence, nothing a class can't discuss.",
      },
      {
        q: "What does it teach?",
        a: "Evaluating sources and using evidence. Students commit to a verdict, then check it against named sources, and learn why a plausible story isn't the same as a documented one.",
      },
      {
        q: "Do students need accounts or devices?",
        a: "No. It's a PDF you project. Nobody signs up and no student data is collected.",
      },
      {
        q: "Can I share it with colleagues?",
        a: "The standard licence covers one teacher and all of their classes. The Department Licence covers up to 10 teachers in one department of one school.",
      },
      {
        q: "Is there a free version?",
        a: "Yes: put today's five claims on the projector at almostlore.com/class. The pack adds a curated, school-safe set with an answer key that works offline.",
      },
      {
        q: "What if it doesn't suit my class?",
        a: "Email us within 30 days of purchase and we refund you in full.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((sku) => ({ sku }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params;
  const page = PAGES[sku];
  const product = getProduct(sku);
  if (!page || !product) return {};
  return pageMetadata({ title: page.title, description: page.description, path: product.path });
}

function samples(): Claim[] {
  // Samples come from the free starter deck, so nothing sold or scheduled is spoiled.
  const starter = getSet("starter");
  const pick = (v: Verdict) => starter.find((c) => c.verdict === v && c.claim.length < 90);
  return (["happened", "almost", "lore"] as Verdict[]).map(pick).filter((c): c is Claim => Boolean(c));
}

function Tier({ product, first }: { product: Product; first: boolean }) {
  const mode = checkoutMode(product.sku);
  return (
    <div className="tier">
      <div>
        <span className="price wood">
          <sup>$</sup>
          {product.priceCents / 100}
        </span>
      </div>
      <div style={{ textAlign: "right" }}>
        <span className="who">{product.unit}</span>
      </div>
      {mode === "waitlist" ? null : (
        <BuyButton sku={product.sku} mode={mode} label={first ? "Buy now" : `Buy the ${product.kind === "license" ? "licence" : "pack"}`} variant={first ? "pink" : "ghost"} />
      )}
      {product.kind === "license" ? <p className="fine">{product.license}</p> : null}
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { sku } = await params;
  const page = PAGES[sku];
  const product = getProduct(sku);
  if (!page || !product) notFound();

  const tiers = page.tiers.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));
  const count = getSet(sku === "party-pack" ? "partyPack" : "classroom").length;
  const mode = checkoutMode(sku);
  const waitlist = mode === "waitlist";
  const sampleCards = samples();
  const starter = starterDeckAvailable();

  return (
    <div className="shop-page">
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: page.description,
          path: product.path,
          priceCents: product.priceCents,
          purchasable: !waitlist,
        })}
      />
      <JsonLd data={faqJsonLd(page.faq)} />

      <div className="wrap">
        <hr className="rule-double" style={{ marginTop: 26, marginBottom: 20 }} />
        <div className="page-kicker" style={{ marginBottom: 28 }}>
          <Link className="mono-s link" href="/shop">
            The shop
          </Link>
          <span className="mono-s"> · {page.kicker}</span>
        </div>

        <div className="product-hero">
          <div className="item">
            {sku === "party-pack" ? <PartyStage /> : <ClassStage />}
            <div className="inside">
              <h2>What&apos;s inside</h2>
              <dl>
                {page.inside(count).map(([n, text]) => (
                  <div key={text} style={{ display: "contents" }}>
                    <dt>{n}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="buybox" id="buy">
            <span className="mono-s">{waitlist ? "Checkout opens soon" : "Instant download · PDF · A4 & US Letter"}</span>
            <h1 style={{ marginTop: 10 }}>{product.name}</h1>
            <p className="short">{product.short}</p>
            <ul>
              {product.bullets.map((b) => (
                <li key={b}>
                  <Mark kind="kept" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="tiers">
              {tiers.map((tier, i) => (
                <Tier key={tier.sku} product={tier} first={i === 0} />
              ))}
            </div>
            {waitlist ? (
              <div className="notice">
                <p>
                  <b>Not on sale yet.</b> We&apos;re finishing the print files. Leave your email and we&apos;ll send one note
                  the day it opens — no other mail unless you ask for it.
                </p>
                <NewsletterForm
                  source="shop-waitlist"
                  tags={[`waitlist:${sku}`]}
                  cta="Notify me"
                  done="Done. One email when it opens."
                  label={`Email me when ${product.name} goes on sale`}
                />
              </div>
            ) : (
              <p className="guarantee fine">
                <Glyph v="happened" style={{ width: 14, height: 14, flex: "none" }} />
                Secure checkout by Stripe · 30-day refund · re-download any time from your receipt link
              </p>
            )}
          </div>
        </div>
      </div>

      {sampleCards.length ? (
        <section className="shop-sec">
          <div className="wrap">
            <p className="mono-s">Three sample cards from the free starter deck</p>
            <h2 className="wood">Front, then back.</h2>
            <div className="sample-row">
              {sampleCards.map((c) => (
                <article className="sample" key={c.id}>
                  <span className="mono-s">
                    {c.topic.replace(/-/g, " ")} · {c.year}
                  </span>
                  <p className="claim">{c.claim}</p>
                  <div className="s-back">
                    <Slab v={c.verdict} />
                    <p>{c.record.split(". ").slice(0, 2).join(". ").replace(/\.?$/, ".")}</p>
                    <p className="fine" style={{ marginTop: 6 }}>
                      {VERDICT_SAY[c.verdict]}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            {starter ? (
              <p style={{ marginTop: 28 }}>
                <a className="btn ghost" href={STARTER_DECK}>
                  Download the free 18-card starter deck
                </a>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="shop-sec">
        <div className="wrap two">
          <div>
            <p className="mono-s">Questions</p>
            <h2 className="wood">Asked &amp; answered</h2>
            <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: "36ch" }}>
              Anything else? <Link className="link" href="/about">Write to us</Link> — the publisher answers purchase questions.
            </p>
          </div>
          <div className="faq">
            {page.faq.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <p className="wrap fine" style={{ paddingBottom: 60 }}>
        Prices in USD. {tiers.map((t) => `${t.name}: ${formatPrice(t.priceCents)}, ${t.unit}.`).join(" ")}
      </p>
    </div>
  );
}
