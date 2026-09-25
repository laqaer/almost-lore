import { NextResponse, type NextRequest } from "next/server";
import { checkoutMode } from "@/lib/checkout";
import { getProduct, hostedCheckoutUrl } from "@/lib/products";
import { createCheckoutSession } from "@/lib/stripe";

/**
 * POST /api/checkout  (form field or JSON body: sku)
 * Works without JavaScript: a plain <form method="post"> gets a 303 to Stripe.
 */
export async function POST(request: NextRequest) {
  let sku = "";
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    sku = String(((await request.json().catch(() => ({}))) as { sku?: string }).sku ?? "");
  } else {
    sku = String((await request.formData().catch(() => new FormData())).get("sku") ?? "");
  }

  const product = getProduct(sku);
  const origin = new URL(request.url).origin;
  const wantsJson = type.includes("application/json");

  if (!product || product.status !== "available") {
    return wantsJson
      ? NextResponse.json({ error: "unknown-product" }, { status: 404 })
      : NextResponse.redirect(`${origin}/shop`, 303);
  }

  const mode = checkoutMode(product.sku);
  if (mode === "hosted") {
    const url = hostedCheckoutUrl(product.sku) as string;
    return wantsJson ? NextResponse.json({ url }) : NextResponse.redirect(url, 303);
  }
  if (mode === "waitlist") {
    const url = `${origin}${product.path}?notify=1`;
    return wantsJson ? NextResponse.json({ url, waitlist: true }) : NextResponse.redirect(url, 303);
  }

  try {
    const session = await createCheckoutSession({
      sku: product.sku,
      name: product.name,
      description: product.short,
      unitAmount: product.priceCents,
      origin,
      cancelPath: product.path,
    });
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return wantsJson ? NextResponse.json({ url: session.url }) : NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("[checkout]", product.sku, error);
    return wantsJson
      ? NextResponse.json({ error: "checkout-failed" }, { status: 502 })
      : NextResponse.redirect(`${origin}${product.path}?checkout=failed`, 303);
  }
}
