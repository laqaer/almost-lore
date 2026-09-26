import assert from "node:assert/strict";
import test from "node:test";
import {
  PRICE_CENTS,
  PRODUCT_ID,
  assessCheckoutSession,
  constantTimeEqual,
  keyIsLive,
  parseSignatureHeader,
  signatureTimestampFresh,
  summarizeSessions,
  verifyStripeSignature,
} from "./policy.js";

function paidSession(overrides = {}) {
  return {
    object: "checkout.session",
    mode: "payment",
    livemode: true,
    currency: "usd",
    amount_total: PRICE_CENTS,
    payment_status: "paid",
    metadata: { product: PRODUCT_ID },
    payment_intent: {
      amount_received: PRICE_CENTS,
      amount_refunded: 0,
      status: "succeeded",
    },
    ...overrides,
  };
}

test("a paid live session for this product can be delivered", () => {
  assert.deepEqual(assessCheckoutSession(paidSession(), { livemode: true }), {
    ok: true,
    reason: "paid",
  });
});

test("delivery fails closed on amount, mode, refund, and an unexpanded intent", () => {
  assert.equal(assessCheckoutSession(paidSession({ amount_total: 100 }), { livemode: true }).ok, false);
  assert.equal(
    assessCheckoutSession(paidSession({ payment_intent: { amount_refunded: 900, status: "succeeded" } }), {
      livemode: true,
    }).reason,
    "refunded",
  );
  assert.equal(
    assessCheckoutSession(paidSession({ payment_intent: "pi_unexpanded" }), { livemode: true }).reason,
    "intent_not_expanded",
  );
  assert.equal(assessCheckoutSession(paidSession(), { livemode: false }).reason, "livemode");
});

test("test-mode payments are counted apart from live cash", () => {
  const totals = summarizeSessions([
    paidSession(),
    paidSession({ livemode: false }),
    paidSession({
      payment_intent: { amount_received: PRICE_CENTS, amount_refunded: 900, status: "succeeded" },
    }),
  ]);
  assert.equal(totals.livePaidCount, 1);
  assert.equal(totals.liveCashCents, 900);
  assert.equal(totals.testPaidCount, 1);
  assert.equal(totals.liveRefundedCount, 1);
});

test("signature header parsing and freshness", () => {
  assert.deepEqual(parseSignatureHeader("t=100,v1=abc,v1=def"), {
    timestamp: "100",
    signatures: ["abc", "def"],
  });
  assert.equal(parseSignatureHeader("v1=abc"), null);
  assert.equal(signatureTimestampFresh("1000", 1200), true);
  assert.equal(signatureTimestampFresh("1000", 1401), false);
});

test("secret comparison does not treat different lengths as equal", () => {
  assert.equal(constantTimeEqual("abc", "abc"), true);
  assert.equal(constantTimeEqual("abc", "abd"), false);
  assert.equal(constantTimeEqual("abc", "abcd"), false);
});

test("webhook signatures reject tampering and stale timestamps", async () => {
  const secret = "whsec_test_secret";
  const body = JSON.stringify({ id: "evt_1", type: "checkout.session.completed" });
  const timestamp = "1700000000";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${body}`));
  const hex = [...new Uint8Array(signed)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const header = `t=${timestamp},v1=${hex}`;
  assert.equal(await verifyStripeSignature(body, header, secret, 1700000100), true);
  assert.equal(await verifyStripeSignature(`${body} `, header, secret, 1700000100), false);
  assert.equal(await verifyStripeSignature(body, header, secret, 1700000401), false);
  assert.equal(await verifyStripeSignature(body, header, "", 1700000100), false);
});

test("live keys are recognized without logging them", () => {
  assert.equal(keyIsLive("sk_live_example"), true);
  assert.equal(keyIsLive("rk_test_example"), false);
  assert.equal(keyIsLive(""), false);
});
