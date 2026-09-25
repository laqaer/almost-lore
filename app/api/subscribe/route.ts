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
];

/** POST /api/subscribe  { email, source, tags?, company? (honeypot) } — JSON or form. */
export async function POST(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
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
    return NextResponse.json({ ok: true });
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

  if (result.ok) return NextResponse.json({ ok: true });
  if (result.reason === "invalid") return NextResponse.json({ ok: false, error: "invalid-email" }, { status: 400 });
  console.error("[subscribe]", result.reason, result.reason === "provider-error" ? result.detail : "");
  return NextResponse.json({ ok: false, error: result.reason }, { status: 503 });
}
