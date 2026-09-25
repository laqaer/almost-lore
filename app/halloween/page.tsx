import Image from "next/image";
import { Mark } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { QuizRunner } from "@/components/game/quiz-runner";
import { BuyButton } from "@/components/shop/buy-button";
import { HalloweenStage } from "@/components/shop/product-art";
import { getSet, publicClaim } from "@/lib/game/content";
import { pageMetadata } from "@/lib/metadata";
import { checkoutMode } from "@/lib/checkout";
import { getProduct } from "@/lib/products";
import { productJsonLd } from "@/lib/schema";
import { siteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Haunted History — a Halloween history quiz",
  description:
    "Vampire panics, stolen coffins and the witch trials nobody gets right. Ten spooky history claims: happened, almost, or lore? Plus a printable pack for your Halloween party.",
  path: "/halloween",
});

export default function HalloweenPage() {
  const online = getSet("halloweenOnline").map(publicClaim);
  const packCount = getSet("halloween").length;
  const exclusive = packCount - online.length;
  const product = getProduct("halloween-pack")!;
  const mode = checkoutMode(product.sku);

  return (
    <div className="haunt">
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: product.short,
          path: "/halloween",
          priceCents: product.priceCents,
          purchasable: mode !== "waitlist",
        })}
      />
      <header className="page-head haunt-head">
        <div className="wrap">
          <hr className="rule-double" />
          <div className="haunt-grid">
            <div>
              <div className="page-kicker">
                <span className="mono-s">
                  The Halloween edition · {online.length} claims · free
                </span>
              </div>
              <h1 className="wood page-title">
                Haunted{" "}
                <span className="mis" data-t="History">
                  History
                </span>
              </h1>
              <p className="page-dek">
                Vampire panics, stolen coffins and the witch trials nobody
                remembers right. Happened, almost, or lore? The truth is usually
                the scary part.
              </p>
            </div>
            <figure className="haunt-pic">
              <Image
                src="/images/riso/dancing-ink.webp"
                alt="The dancing pilgrims engraving, printed black on fluorescent pink"
                width={820}
                height={724}
                priority
                sizes="(max-width: 900px) 92vw, 34vw"
              />
            </figure>
          </div>
        </div>
      </header>

      <QuizRunner
        claims={online}
        kind="halloween"
        title="Haunted History"
        shareUrl={`${siteUrl()}/halloween`}
      />

      <section className="shop-sec" id="buy" aria-labelledby="pack-h">
        <div className="wrap">
          <div className="product-hero" style={{ paddingBottom: 20 }}>
            <div className="item">
              <HalloweenStage />
            </div>
            <div className="buybox">
              <span className="mono-s">
                For the party · PDF · A4 &amp; US Letter
              </span>
              <h2 className="buy-h" id="pack-h">
                {product.name}
              </h2>
              <p className="short">
                All {packCount} haunted-history cards — {exclusive} of them not
                in the free edition — with the sourced record on the back, place
                cards for the table and rules for a fifteen-minute round between
                courses.
              </p>
              <ul>
                {product.bullets.map((b) => (
                  <li key={b}>
                    <Mark kind="kept" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="tier">
                <span className="price wood">
                  <sup>$</sup>
                  {product.priceCents / 100}
                </span>
                <span className="who" style={{ textAlign: "right" }}>
                  {product.unit}
                </span>
                {mode === "waitlist" ? null : (
                  <BuyButton
                    sku={product.sku}
                    mode={mode}
                    label="Buy the pack"
                    variant="pink"
                  />
                )}
              </div>
              {mode === "waitlist" ? (
                <div className="notice">
                  <p>
                    <b>Not on sale yet.</b> Leave your email and we&apos;ll send
                    one note the day the pack opens.
                  </p>
                  <NewsletterForm
                    source="shop-waitlist"
                    tags={["waitlist:halloween-pack"]}
                    cta="Notify me"
                    done="Done. One email when it opens."
                    label="Email me when the Halloween Pack goes on sale"
                  />
                </div>
              ) : (
                <p className="fine" style={{ marginTop: 14 }}>
                  Secure checkout by Stripe · instant download · 30-day refund
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
