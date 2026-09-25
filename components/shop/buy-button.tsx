"use client";

import Link from "next/link";
import { useState } from "react";
import { Hand } from "@/components/icons";
import { track } from "@/lib/analytics";
import type { CheckoutMode } from "@/lib/products";

/**
 * A real buy button when checkout is configured (a plain form post, so it works without JS),
 * otherwise an honest "notify me" link to the product page's waitlist.
 */
export function BuyButton({
  sku,
  mode,
  label = "Buy now",
  variant = "",
}: {
  sku: string;
  mode: CheckoutMode;
  label?: string;
  variant?: string;
}) {
  const [busy, setBusy] = useState(false);
  if (mode === "waitlist") {
    const path = sku.startsWith("halloween") ? "/halloween" : `/shop/${sku.replace(/-(office|department)$/, "")}`;
    return (
      <Link className={`btn ghost ${variant}`} href={`${path}?notify=1#buy`}>
        Notify me when it&apos;s on sale
      </Link>
    );
  }
  return (
    <form
      action="/api/checkout"
      method="post"
      onSubmit={() => {
        setBusy(true);
        track("checkout_click", { sku });
      }}
    >
      <input type="hidden" name="sku" value={sku} />
      <button className={`btn ${variant}`} type="submit" disabled={busy}>
        {busy ? "Opening checkout…" : label} <Hand bg="var(--ink)" />
      </button>
    </form>
  );
}
