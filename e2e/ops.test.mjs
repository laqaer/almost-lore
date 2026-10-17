import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.E2E_BASE_URL || "https://almostlore.com";

test("the public status exposes a recent, successful daily reconciliation", async () => {
  const response = await fetch(new URL("/api/status", baseUrl), {
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });
  assert.equal(response.status, 200);
  const status = await response.json();
  assert.equal(status.service, "almost-lore-ops");

  const now = new Date();
  const due = new Date(now);
  due.setUTCHours(13, 0, 0, 0);
  // Allow the daily 13:00 UTC job 15 minutes to publish its summary.
  if (now.getTime() < due.getTime() + 15 * 60_000) {
    due.setUTCDate(due.getUTCDate() - 1);
  }
  const summary = status.latestSummary;
  const at = Date.parse(summary?.at);
  assert.ok(
    Number.isFinite(at) && at >= due.getTime(),
    `Daily summary is stale: latest=${summary?.at ?? "missing"}; required>=${due.toISOString()}`,
  );
  assert.ok(at <= now.getTime() + 5 * 60_000, "Summary timestamp is in the future");
  assert.equal(summary.home?.status, 200);
  assert.equal(summary.pigWar?.status, 200);
  if (status.stripeConfigured && !status.paused) {
    assert.equal(summary.ledger?.source, "stripe_checkout_sessions");
  }
});
