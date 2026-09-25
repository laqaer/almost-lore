/**
 * Minimal Stripe REST client (no SDK dependency). Only used server-side.
 *
 *   STRIPE_SECRET_KEY  → enables on-site Checkout Sessions + verified downloads.
 *   Prices come from lib/products.ts (inline price_data); entitlement is the session's metadata.sku,
 *   which only our server sets.
 */

const API = "https://api.stripe.com/v1";

export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function encode(params: Record<string, string | number | boolean | undefined>): string {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) body.append(key, String(value));
  }
  return body.toString();
}

async function stripe<T>(path: string, init?: { method?: "GET" | "POST"; body?: string }): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-06-20",
    },
    body: init?.body,
    cache: "no-store",
  });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(json.error?.message ?? `Stripe ${res.status}`);
  return json;
}

export type CheckoutSession = {
  id: string;
  url: string | null;
  payment_status: "paid" | "unpaid" | "no_payment_required";
  status: "open" | "complete" | "expired";
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string>;
};

export async function createCheckoutSession(input: {
  sku: string;
  name: string;
  description: string;
  unitAmount: number;
  origin: string;
  cancelPath: string;
}): Promise<CheckoutSession> {
  return stripe<CheckoutSession>("/checkout/sessions", {
    method: "POST",
    body: encode({
      mode: "payment",
      "line_items[0][quantity]": 1,
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": input.unitAmount,
      "line_items[0][price_data][product_data][name]": input.name,
      "line_items[0][price_data][product_data][description]": input.description,
      "line_items[0][price_data][product_data][metadata][sku]": input.sku,
      success_url: `${input.origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${input.origin}${input.cancelPath}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      "invoice_creation[enabled]": true,
      "metadata[sku]": input.sku,
      "payment_intent_data[metadata][sku]": input.sku,
    }),
  });
}

export async function getCheckoutSession(id: string): Promise<CheckoutSession | null> {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return null;
  try {
    return await stripe<CheckoutSession>(`/checkout/sessions/${id}`);
  } catch {
    return null;
  }
}
