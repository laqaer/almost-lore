import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createFetchMock, Miniflare } from "miniflare";

const dossier = "<!doctype html><title>Local dossier fixture</title><p>Paid file contents.</p>";
const opsToken = "local-refund-test-token";
const charges = {
  cs_paid: { id: "ch_paid", object: "charge", amount_refunded: 0 },
  cs_full_refund: { id: "ch_full", object: "charge", amount_refunded: 900 },
  cs_partial_refund: { id: "ch_partial", object: "charge", amount_refunded: 100 },
  cs_no_charge: null,
  cs_unexpanded_charge: "ch_unexpanded",
  cs_missing_refund: { id: "ch_missing", object: "charge" },
  cs_null_refund: { id: "ch_null", object: "charge", amount_refunded: null },
  cs_string_refund: { id: "ch_string", object: "charge", amount_refunded: "0" },
  cs_negative_refund: { id: "ch_negative", object: "charge", amount_refunded: -1 },
  cs_fractional_refund: { id: "ch_fractional", object: "charge", amount_refunded: 0.5 },
};
const sessions = Object.fromEntries(Object.entries(charges).map(([id, charge]) => [id, {
  id,
  object: "checkout.session",
  mode: "payment",
  livemode: true,
  currency: "usd",
  amount_total: 900,
  payment_status: "paid",
  metadata: { product: "poyais-working-file" },
  payment_intent: {
    id: `pi_${id}`,
    object: "payment_intent",
    status: "succeeded",
    amount_received: 900,
    latest_charge: charge,
  },
}]));
sessions.cs_test_paid = { ...sessions.cs_paid, id: "cs_test_paid", livemode: false };

function stripeSession(session, expansions, prefix = "") {
  const result = structuredClone(session);
  const intentPath = `${prefix}payment_intent`;
  const intent = result.payment_intent;
  if (!expansions.some((path) => path === intentPath || path.startsWith(`${intentPath}.`))) {
    result.payment_intent = intent.id;
  } else if (!expansions.includes(`${intentPath}.latest_charge`) && typeof intent.latest_charge === "object") {
    intent.latest_charge = intent.latest_charge?.id ?? null;
  }
  return result;
}

let worker;
let baseUrl;
let fetchMock;

before(async () => {
  fetchMock = createFetchMock();
  fetchMock.disableNetConnect();
  fetchMock.get("https://api.stripe.com")
    .intercept({ method: "GET", path: /^\/v1\/checkout\/sessions(?:\/cs_\w+)?(?:\?|$)/ })
    .reply(({ path }) => {
      const url = new URL(path, "https://api.stripe.com");
      const expansions = url.searchParams.getAll("expand[]");
      if (url.pathname === "/v1/checkout/sessions") {
        return {
          statusCode: 200,
          data: {
            object: "list",
            has_more: false,
            data: Object.values(sessions).map((session) => stripeSession(session, expansions, "data.")),
          },
        };
      }
      const session = sessions[url.pathname.split("/").at(-1)];
      return session
        ? { statusCode: 200, data: stripeSession(session, expansions) }
        : { statusCode: 404, data: { error: { message: "Unknown fixture session" } } };
    })
    .persist();
  for (const path of ["/", "/stories/pig-war-san-juan"]) {
    fetchMock.get("https://almostlore.com").intercept({ method: "GET", path }).reply(200, "Local page fixture").persist();
  }
  worker = new Miniflare({
    host: "127.0.0.1",
    port: 0,
    modules: true,
    modulesRoot: fileURLToPath(new URL("../workers/ops/", import.meta.url)),
    modulesRules: [{ type: "ESModule", include: ["**/*.js"] }],
    scriptPath: fileURLToPath(new URL("../workers/ops/index.js", import.meta.url)),
    compatibilityDate: "2026-07-30",
    kvNamespaces: ["STATE"],
    bindings: { STRIPE_SECRET_KEY: "sk_live_local_fixture", OPS_TOKEN: opsToken },
    fetchMock,
  });
  baseUrl = await worker.ready;
  const state = await worker.getKVNamespace("STATE");
  await state.put("product:poyais-working-file:v1", dossier);
});

after(async () => {
  await worker?.dispose();
  await fetchMock?.close();
});

function request(path, options = {}) {
  return fetch(new URL(path, baseUrl), { ...options, signal: AbortSignal.timeout(10_000) });
}

test("full and partial refunds do not release the dossier", async () => {
  const outcomes = [];
  for (const id of ["cs_full_refund", "cs_partial_refund"]) {
    const response = await request(`/download?session_id=${id}`);
    const body = await response.text();
    outcomes.push({ id, status: response.status, refundDenied: body.includes("(refunded)"), fileReleased: body === dossier });
  }
  assert.deepEqual(outcomes, [
    { id: "cs_full_refund", status: 402, refundDenied: true, fileReleased: false },
    { id: "cs_partial_refund", status: 402, refundDenied: true, fileReleased: false },
  ]);
});

test("an unrefunded paid session downloads the stored dossier", async () => {
  const response = await request("/download?session_id=cs_paid");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-disposition"), 'attachment; filename="poyais-working-file.html"');
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(await response.text(), dossier);
});

test("missing or invalid Charge refund evidence cannot release the dossier", async () => {
  const ids = Object.keys(charges).filter((id) => !["cs_paid", "cs_full_refund", "cs_partial_refund"].includes(id));
  const outcomes = [];
  for (const id of ids) {
    const response = await request(`/download?session_id=${id}`);
    const body = await response.text();
    outcomes.push({ id, status: response.status, denied: body.includes("File not released"), fileReleased: body === dossier });
  }
  assert.deepEqual(outcomes, ids.map((id) => ({ id, status: 402, denied: true, fileReleased: false })));
});

test("an authorized reconciliation persists refund exclusions in public status", async () => {
  const unauthorized = await request("/ops/run", { method: "POST" });
  assert.equal(unauthorized.status, 401);
  const response = await request("/ops/run", {
    method: "POST",
    headers: { Authorization: `Bearer ${opsToken}` },
  });
  assert.equal(response.status, 200);
  const summary = await response.json();
  assert.equal(summary.source, "manual");
  assert.equal(summary.home.status, 200);
  assert.equal(summary.pigWar.status, 200);
  assert.deepEqual(summary.ledger, {
    source: "stripe_checkout_sessions",
    livePaidCount: 1,
    liveCashCents: 900,
    liveRefundedCount: 2,
    testPaidCount: 1,
    truncated: false,
    fees: "not_in_checkout_session",
    provisional: true,
  });
  const statusResponse = await request("/status");
  assert.equal(statusResponse.status, 200);
  const status = await statusResponse.json();
  assert.deepEqual(status.latestSummary, summary);
});
