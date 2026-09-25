import type { Metadata } from "next";
import Link from "next/link";
import { Hand } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { getProduct } from "@/lib/products";
import { site } from "@/lib/site";
import { getCheckoutSession } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string | string[] }> };

export default async function ThanksPage({ searchParams }: Props) {
  const raw = (await searchParams).session_id;
  const sessionId = typeof raw === "string" ? raw : "";
  const session = sessionId ? await getCheckoutSession(sessionId) : null;
  const paid = session?.payment_status === "paid";
  const product = paid ? getProduct(session?.metadata?.sku ?? "") : undefined;

  if (!paid || !product) {
    return (
      <div className="lost">
        <div className="wrap">
          <hr className="rule-double" />
          <p className="mono-s" style={{ marginTop: 20 }}>
            Receipt desk
          </p>
          <h1 className="wood page-title">We can&apos;t find that receipt.</h1>
          <p className="page-dek">
            {sessionId
              ? "Stripe hasn't confirmed this payment yet. If you just paid, wait a few seconds and refresh."
              : "This page opens from the link Stripe sends after checkout."}{" "}
            Still stuck? Email{" "}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>{" "}
            with your receipt and we&apos;ll send the files by hand.
          </p>
          <p style={{ marginTop: 28 }}>
            <Link className="btn" href="/shop">
              Back to the shop <Hand bg="var(--ink)" />
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const q = (file: string) =>
    `/api/download?session_id=${encodeURIComponent(sessionId)}&file=${encodeURIComponent(file)}`;

  return (
    <div className="wrap" style={{ paddingTop: 26, paddingBottom: 100 }}>
      <hr className="rule-double" />
      <div className="product-hero" style={{ marginTop: 28 }}>
        <div>
          <p className="mono-s">Receipt desk · paid in full</p>
          <h1 className="wood page-title">
            <span className="mis" data-t="Filed.">
              Filed.
            </span>
          </h1>
          <p className="page-dek">
            Thank you. {product.name} is yours. Download it below — and bookmark
            this page: it&apos;s your re-download link. Stripe emails your
            receipt separately.
          </p>
        </div>
        <div className="buybox">
          <span className="mono-s">Your files</span>
          <ul>
            {product.files.map((f) => (
              <li key={f.file} style={{ paddingLeft: 0 }}>
                <a className="btn pink" href={q(f.file)} download>
                  Download · {f.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="fine">
            {product.license} Printing tip: “actual size” on card stock, then
            cut along the crop marks.
          </p>
          <p className="fine" style={{ marginTop: 10 }}>
            If it isn&apos;t right for your table, email {site.email} within 30
            days for a full refund.
          </p>
        </div>
      </div>
      <div className="cta-band">
        <div>
          <h2 className="wood">One near-miss a week.</h2>
          <p>
            The Sunday Docket: the week&apos;s best trap, one case file, and
            first word on new packs.
          </p>
        </div>
        <div className="on-ink" style={{ minWidth: "min(100%, 380px)" }}>
          <NewsletterForm
            source="purchase"
            tags={[`buyer:${product.sku}`]}
            cta="Subscribe"
          />
        </div>
      </div>
    </div>
  );
}
