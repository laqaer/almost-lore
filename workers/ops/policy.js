export const PRODUCT_ID = "poyais-working-file";
export const PRICE_CENTS = 900;
export const CURRENCY = "usd";
export const SIGNATURE_TOLERANCE_SECONDS = 300;

export function keyIsLive(secret) {
  return typeof secret === "string" && secret.includes("_live_");
}

export function assessCheckoutSession(session, options) {
  if (!session || typeof session !== "object") return { ok: false, reason: "missing_session" };
  if (session.object !== "checkout.session") return { ok: false, reason: "not_a_session" };
  if (session.mode !== "payment") return { ok: false, reason: "mode" };
  if (session.livemode !== options.livemode) return { ok: false, reason: "livemode" };
  if (!session.metadata || session.metadata.product !== PRODUCT_ID) {
    return { ok: false, reason: "product" };
  }
  if (session.currency !== CURRENCY) return { ok: false, reason: "currency" };
  if (session.amount_total !== PRICE_CENTS) return { ok: false, reason: "amount" };
  if (session.payment_status !== "paid") return { ok: false, reason: "unpaid" };

  const intent = session.payment_intent;
  if (!intent || typeof intent !== "object") return { ok: false, reason: "intent_not_expanded" };
  if (typeof intent.amount_received === "number" && intent.amount_received < PRICE_CENTS) {
    return { ok: false, reason: "amount_received" };
  }
  if ((intent.amount_refunded ?? 0) > 0) return { ok: false, reason: "refunded" };
  if (intent.status && intent.status !== "succeeded") return { ok: false, reason: "intent_status" };
  return { ok: true, reason: "paid" };
}

export function constantTimeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const length = Math.max(left.length, right.length);
  let mismatch = left.length === right.length ? 0 : 1;
  for (let index = 0; index < length; index += 1) {
    const a = index < left.length ? left.charCodeAt(index) : 0;
    const b = index < right.length ? right.charCodeAt(index) : 0;
    mismatch |= a ^ b;
  }
  return mismatch === 0;
}

export function parseSignatureHeader(header) {
  if (typeof header !== "string" || header.length === 0) return null;
  let timestamp = null;
  const signatures = [];
  for (const part of header.split(",")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key === "t") timestamp = value;
    if (key === "v1" && value) signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) return null;
  if (!/^\d+$/.test(timestamp)) return null;
  return { timestamp, signatures };
}

export function signatureTimestampFresh(timestamp, nowSeconds) {
  const signedAt = Number(timestamp);
  if (!Number.isFinite(signedAt) || !Number.isFinite(nowSeconds)) return false;
  return Math.abs(nowSeconds - signedAt) <= SIGNATURE_TOLERANCE_SECONDS;
}

export async function verifyStripeSignature(rawBody, header, secret, nowSeconds) {
  const parsed = parseSignatureHeader(header);
  if (!parsed || !secret || !signatureTimestampFresh(parsed.timestamp, nowSeconds)) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${parsed.timestamp}.${rawBody}`),
  );
  const hex = [...new Uint8Array(signed)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return parsed.signatures.some((signature) => constantTimeEqual(signature, hex));
}

export function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

export function summarizeSessions(sessions) {
  const totals = {
    livePaidCount: 0,
    liveCashCents: 0,
    liveRefundedCount: 0,
    testPaidCount: 0,
    truncated: false,
  };
  if (!Array.isArray(sessions)) return totals;
  for (const session of sessions) {
    const live = session.livemode === true;
    const assessment = assessCheckoutSession(session, { livemode: live });
    if (assessment.ok && live) {
      totals.livePaidCount += 1;
      totals.liveCashCents += PRICE_CENTS;
    } else if (assessment.ok) {
      totals.testPaidCount += 1;
    } else if (live && assessment.reason === "refunded") {
      totals.liveRefundedCount += 1;
    }
  }
  return totals;
}
