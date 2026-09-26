import {
  CURRENCY,
  PRICE_CENTS,
  PRODUCT_ID,
  assessCheckoutSession,
  constantTimeEqual,
  dayKey,
  keyIsLive,
  summarizeSessions,
  verifyStripeSignature,
} from "./policy.js";

const SITE = "https://almostlore.com";
const SUCCESS_URL = `${SITE}/dossier/thanks?session_id={CHECKOUT_SESSION_ID}`;
const CANCEL_URL = `${SITE}/dossier`;
const DOSSIER_KEY = "product:poyais-working-file:v1";
const MAX_SUPPORT_BODY = 4000;
const MAX_SUPPORT_PER_DAY = 5;

const ops = {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/health") {
        return json({ ok: true, service: "almost-lore-ops" });
      }
      if (request.method === "GET" && url.pathname === "/status") {
        return json(await publicStatus(env));
      }
      if (request.method === "GET" && url.pathname === "/download") {
        return download(request, env, url);
      }
      if (request.method === "POST" && url.pathname === "/checkout") {
        return checkout(request, env);
      }
      if (request.method === "POST" && url.pathname === "/support") {
        return support(request, env);
      }
      if (request.method === "POST" && url.pathname === "/stripe/webhook") {
        return webhook(request, env);
      }
      if (request.method === "GET" && url.pathname === "/ops/inbox") {
        return inbox(request, env);
      }
      if (request.method === "POST" && (url.pathname === "/ops/pause" || url.pathname === "/ops/resume")) {
        return setPaused(request, env, url.pathname === "/ops/pause");
      }
      if (request.method === "POST" && url.pathname === "/ops/run") {
        return authorizedRun(request, env);
      }
      return html("Not found", "<p>That path is not part of Almost Lore checkout.</p>", 404);
    } catch (error) {
      console.log(`ops_error ${error instanceof Error ? error.name : "unknown"}`);
      return html("Something went wrong", "<p>The desk could not finish that request. Nothing was charged by this error page.</p>", 500);
    }
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(runDaily(env, "cron"));
  },
};

export default ops;

async function publicStatus(env) {
  const [paused, dossier, latest, waiting] = await Promise.all([
    env.STATE.get("ops:paused"),
    env.STATE.get("product:poyais-working-file:meta"),
    env.STATE.get("ops:latest-summary"),
    env.STATE.get("support:waiting"),
  ]);
  let summary = null;
  if (latest) {
    try {
      summary = JSON.parse(latest);
    } catch {
      summary = { parseError: true };
    }
  }
  return {
    service: "almost-lore-ops",
    paused: paused === "1",
    stripeConfigured: Boolean(env.STRIPE_SECRET_KEY),
    stripeLive: keyIsLive(env.STRIPE_SECRET_KEY || ""),
    webhookConfigured: Boolean(env.STRIPE_WEBHOOK_SECRET),
    dossierStored: Boolean(dossier),
    dossierMeta: dossier ? JSON.parse(dossier) : null,
    spendCapUsd: 0,
    discretionarySpendAuthorizedUsd: 0,
    supportWaiting: Number(waiting || 0),
    latestSummary: summary,
    stop: "Cloudflare dashboard → Workers → almost-lore-ops, or POST /ops/pause with the ops token.",
  };
}

async function checkout(request, env) {
  if ((await env.STATE.get("ops:paused")) === "1") {
    return html("Checkout paused", "<p>Checkout is paused. You have not been charged.</p>", 503);
  }
  const form = await readForm(request);
  if (form.get("product") !== PRODUCT_ID) {
    return html("Unknown file", "<p>That product is not for sale here.</p>", 400);
  }
  const company = form.get("company");
  if (company) return html("Received", "<p>Thanks.</p>", 200);
  if (!env.STRIPE_SECRET_KEY) {
    return html(
      "Checkout is not open",
      "<p>Card checkout is not connected for Almost Lore yet. You have not been charged. The essays remain free. The working file stays in the publisher’s private store until a merchant account is connected.</p><p><a href=\"https://almostlore.com/dossier\">Back to the dossier page</a></p>",
      503,
    );
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", SUCCESS_URL);
  params.set("cancel_url", CANCEL_URL);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", CURRENCY);
  params.set("line_items[0][price_data][unit_amount]", String(PRICE_CENTS));
  params.set("line_items[0][price_data][product_data][name]", "Poyais working file");
  params.set(
    "line_items[0][price_data][product_data][description]",
    "Printable source dossier for the Almost Lore Poyais essay. One-time download.",
  );
  params.set("metadata[product]", PRODUCT_ID);
  params.set("payment_intent_data[metadata][product]", PRODUCT_ID);

  const headers = {
    Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const attempt = form.get("attempt") || "";
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attempt)) {
    headers["Idempotency-Key"] = `poyais-${attempt}`;
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers,
    body: params,
  });
  const payload = await response.json();
  if (!response.ok || !payload.url) {
    console.log(`stripe_checkout_failed status=${response.status}`);
    return html(
      "Checkout could not start",
      "<p>The payment page did not open. You have not been charged. Write via the support form if this keeps happening.</p>",
      502,
    );
  }
  return Response.redirect(payload.url, 303);
}

async function download(request, env, url) {
  const sessionId = url.searchParams.get("session_id") || "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return html("Missing checkout", "<p>That download link does not include a checkout session.</p>", 400);
  }
  if (!env.STRIPE_SECRET_KEY) {
    return html("Checkout is not open", "<p>There is no merchant key, so this link cannot be verified.</p>", 503);
  }
  const stripeUrl = new URL(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`);
  stripeUrl.searchParams.set("expand[]", "payment_intent");
  const response = await fetch(stripeUrl, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  const session = await response.json();
  if (!response.ok) {
    return html("Payment not verified", "<p>Stripe did not return that session. The file stays put.</p>", 402);
  }
  const assessment = assessCheckoutSession(session, { livemode: keyIsLive(env.STRIPE_SECRET_KEY) });
  if (!assessment.ok) {
    return html(
      "File not released",
      `<p>This session cannot download the file (${escapeHtml(assessment.reason)}). If you were charged and this is wrong, use the support form within 14 days.</p>`,
      402,
    );
  }
  const file = await env.STATE.get(DOSSIER_KEY);
  if (!file) {
    return html(
      "File missing",
      "<p>Payment checked out, but the working file is not in the store. Use the support form and we will send it or refund.</p>",
      500,
    );
  }
  return new Response(file, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-disposition": "attachment; filename=\"poyais-working-file.html\"",
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

async function support(request, env) {
  const form = await readForm(request);
  if (form.get("company")) return html("Received", "<p>Thanks. If you wrote a real note, it is in the queue.</p>");
  const message = (form.get("message") || "").trim();
  const email = (form.get("email") || "").trim();
  const topic = (form.get("topic") || "other").trim().slice(0, 40);
  if (message.length < 4 || message.length > MAX_SUPPORT_BODY) {
    return html("Message not stored", "<p>Write at least a sentence, and keep it under 4,000 characters.</p>", 400);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return html("Email looks wrong", "<p>Leave the email blank or use a normal address. The message was not stored.</p>", 400);
  }
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const bucket = `support:rate:${dayKey(new Date())}:${await sha256(ip)}`;
  const used = Number((await env.STATE.get(bucket)) || 0);
  if (used >= MAX_SUPPORT_PER_DAY) {
    return html("Slow down", "<p>Five notes from this network are already stored today. Try again tomorrow.</p>", 429);
  }
  const id = crypto.randomUUID();
  const record = {
    id,
    topic,
    email,
    message,
    at: new Date().toISOString(),
  };
  await env.STATE.put(`support:item:${id}`, JSON.stringify(record));
  await env.STATE.put(bucket, String(used + 1), { expirationTtl: 60 * 60 * 48 });
  const waiting = Number((await env.STATE.get("support:waiting")) || 0) + 1;
  await env.STATE.put("support:waiting", String(waiting));
  const index = JSON.parse((await env.STATE.get("support:index")) || "[]");
  index.unshift(id);
  await env.STATE.put("support:index", JSON.stringify(index.slice(0, 200)));
  return html(
    "Received",
    "<p>The note is stored for Almost Lore. Essays stay free either way. If you asked for a refund, include the email you used at checkout.</p><p><a href=\"https://almostlore.com/support\">Back</a></p>",
  );
}

async function webhook(request, env) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return json({ received: false, reason: "webhook_secret_missing" }, 503);
  }
  const raw = await request.text();
  const header = request.headers.get("stripe-signature");
  const ok = await verifyStripeSignature(raw, header, env.STRIPE_WEBHOOK_SECRET, Math.floor(Date.now() / 1000));
  if (!ok) return json({ received: false }, 400);
  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return json({ received: false }, 400);
  }
  if (!event.id) return json({ received: false }, 400);
  const seenKey = `stripe:event:${event.id}`;
  if (await env.STATE.get(seenKey)) return json({ received: true, duplicate: true });
  await env.STATE.put(seenKey, event.type || "unknown", { expirationTtl: 60 * 60 * 24 * 30 });
  await runDaily(env, "webhook");
  return json({ received: true });
}

async function inbox(request, env) {
  if (!(await authorized(request, env))) return json({ error: "unauthorized" }, 401);
  const index = JSON.parse((await env.STATE.get("support:index")) || "[]");
  const items = [];
  for (const id of index.slice(0, 50)) {
    const raw = await env.STATE.get(`support:item:${id}`);
    if (raw) items.push(JSON.parse(raw));
  }
  return json({ items });
}

async function setPaused(request, env, paused) {
  if (!(await authorized(request, env))) return json({ error: "unauthorized" }, 401);
  await env.STATE.put("ops:paused", paused ? "1" : "0");
  return json({ paused });
}

async function authorizedRun(request, env) {
  if (!(await authorized(request, env))) return json({ error: "unauthorized" }, 401);
  const summary = await runDaily(env, "manual");
  return json(summary);
}

async function authorized(request, env) {
  const token = env.OPS_TOKEN;
  if (!token) return false;
  const header = request.headers.get("authorization") || "";
  const presented = header.startsWith("Bearer ") ? header.slice(7) : "";
  return constantTimeEqual(presented, token);
}

async function runDaily(env, source) {
  const paused = (await env.STATE.get("ops:paused")) === "1";
  const home = await probe(`${SITE}/`);
  const pig = await probe(`${SITE}/stories/pig-war-san-juan`);
  let ledger = {
    source: "no_stripe_key",
    livePaidCount: 0,
    liveCashCents: 0,
    liveRefundedCount: 0,
    testPaidCount: 0,
    fees: "unavailable",
    provisional: true,
  };
  if (!paused && env.STRIPE_SECRET_KEY) {
    ledger = await reconcile(env);
  }
  const summary = {
    date: dayKey(new Date()),
    at: new Date().toISOString(),
    source,
    paused,
    home,
    pigWar: pig,
    ledger,
    spendCapUsd: 0,
  };
  await env.STATE.put(`summary:${summary.date}`, JSON.stringify(summary));
  await env.STATE.put("ops:latest-summary", JSON.stringify(summary));
  return summary;
}

async function reconcile(env) {
  const listed = await stripeGet(env, "/v1/checkout/sessions?limit=100");
  if (!listed.ok) {
    return {
      source: "stripe_error",
      livePaidCount: 0,
      liveCashCents: 0,
      liveRefundedCount: 0,
      testPaidCount: 0,
      fees: "unavailable",
      provisional: true,
    };
  }
  const sessions = [];
  for (const session of listed.body.data || []) {
    if (!session.id) continue;
    const full = await stripeGet(env, `/v1/checkout/sessions/${session.id}?expand[]=payment_intent`);
    if (full.ok) sessions.push(full.body);
  }
  const totals = summarizeSessions(sessions);
  return {
    source: "stripe_checkout_sessions",
    ...totals,
    truncated: (listed.body.has_more === true) || totals.truncated,
    fees: "not_in_checkout_session",
    provisional: true,
  };
}

async function stripeGet(env, path) {
  const response = await fetch(`https://api.stripe.com${path}`, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  const body = await response.json();
  return { ok: response.ok, body };
}

async function probe(url) {
  try {
    const response = await fetch(url, { method: "GET", redirect: "follow" });
    return { url, status: response.status, ok: response.ok };
  } catch {
    return { url, status: 0, ok: false };
  }
}

async function readForm(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const body = await request.json();
    return new Map(Object.entries(body).map(([key, value]) => [key, String(value ?? "")]));
  }
  const form = await request.formData();
  return form;
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function html(title, inner, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><title>${escapeHtml(title)}</title><body style="font-family:Georgia,serif;max-width:38rem;margin:3rem auto;padding:0 1rem;line-height:1.5"><h1>${escapeHtml(title)}</h1>${inner}</body></html>`,
    {
      status,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    },
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
