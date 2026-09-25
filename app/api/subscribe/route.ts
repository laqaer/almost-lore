import { NextResponse, type NextRequest } from "next/server";
import { subscribe, type SignupSource } from "@/lib/newsletter";

const SOURCES: SignupSource[] = [
  "game-result",
  "home",
  "story",
  "footer",
  "newsletter-page",
  "shop-waitlist",
  "classroom",
  "deck-waitlist",
  "purchase",
];

type Outcome = "ok" | "invalid" | "unconfigured" | "error";

/** POST /api/subscribe  { email, source, tags?, company? (honeypot) } — JSON or form. */
export async function POST(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
  const isForm = !type.includes("application/json");
  // A no-JS form post lands on /newsletter with a status line instead of raw JSON.
  const reply = (outcome: Outcome, status = 200) =>
    isForm
      ? NextResponse.redirect(new URL(`/newsletter?status=${outcome}`, request.url), 303)
      : NextResponse.json(outcome === "ok" ? { ok: true } : { ok: false, error: outcome === "invalid" ? "invalid-email" : outcome }, { status });
  let body: Record<string, unknown> = {};
  if (type.includes("application/json")) {
    body = ((await request.json().catch(() => ({}))) ?? {}) as Record<string, unknown>;
  } else {
    const form = await request.formData().catch(() => new FormData());
    body = Object.fromEntries(form.entries());
    if (typeof body.tags === "string") body.tags = String(body.tags).split(",");
  }

  // Bots fill every field; people never see this one.
  if (typeof body.company === "string" && body.company.length > 0) {
    return reply("ok");
  }

  const source = SOURCES.includes(body.source as SignupSource) ? (body.source as SignupSource) : "footer";
  const tags = Array.isArray(body.tags)
    ? body.tags.map(String).filter((tag) => /^[a-z0-9:-]{1,40}$/.test(tag)).slice(0, 5)
    : [];

  const result = await subscribe({
    email: String(body.email ?? ""),
    source,
    tags,
    referrer: request.headers.get("referer") ?? undefined,
  });

  if (result.ok) return reply("ok");
  if (result.reason === "invalid") return reply("invalid", 400);
  console.error("[subscribe]", result.reason, result.reason === "provider-error" ? result.detail : "");
  return reply(result.reason === "unconfigured" ? "unconfigured" : "error", 503);
}
