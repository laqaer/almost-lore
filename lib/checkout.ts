import "server-only";
import { productFileAvailable } from "@/lib/product-files";
import { getProduct, hostedCheckoutUrl, type CheckoutMode } from "@/lib/products";

/**
 * How a product can be bought right now, first match wins:
 *   1. STRIPE_SECRET_KEY and every file deliverable → on-site Stripe Checkout, download on /thanks
 *   2. NEXT_PUBLIC_CHECKOUT_URL_<SKU>               → a hosted checkout that delivers the file itself
 *   3. otherwise                                    → an honest "notify me" waitlist
 * Stripe is never offered for a file this deployment can't deliver: no broken buy buttons.
 */
export function checkoutMode(sku: string): CheckoutMode {
  const product = getProduct(sku);
  if (process.env.STRIPE_SECRET_KEY && product?.files.every((f) => productFileAvailable(f.file))) return "stripe";
  if (hostedCheckoutUrl(sku)) return "hosted";
  return "waitlist";
}
