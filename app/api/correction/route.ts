import { NextResponse, type NextRequest } from "next/server";
import { getClaim } from "@/lib/game/content";
import { getStory } from "@/lib/stories";

/**
 * POST /api/correction  { claimId | storySlug, message, source?, credit?, company? (honeypot) }
 * Files a GitHub issue labelled "correction" for the ops team's corrections desk.
 * Readers' email addresses are never collected here: issues are public.
 *   CORRECTIONS_GITHUB_TOKEN  fine-grained token with Issues: read & write on the repo
 *   CORRECTIONS_GITHUB_REPO   owner/name (defaults to laqaer/almost-lore)
 */
export async function POST(request: NextRequest) {
  const body = ((await request.json().catch(() => ({}))) ?? {}) as Record<string, unknown>;
  if (typeof body.company === "string" && body.company) return NextResponse.json({ ok: true });

  const claimId = String(body.claimId ?? "").slice(0, 80);
  const message = String(body.message ?? "").trim().slice(0, 2000);
  const source = String(body.source ?? "").trim().slice(0, 500);
  const credit = String(body.credit ?? "").trim().slice(0, 60);
  const claim = getClaim(claimId);
  const story = claim ? undefined : getStory(String(body.storySlug ?? "").slice(0, 80));

  if ((!claim && !story) || message.length < 10) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 400 });
  }

  const token = process.env.CORRECTIONS_GITHUB_TOKEN;
  const repo = process.env.CORRECTIONS_GITHUB_REPO || "laqaer/almost-lore";
  if (!token) {
    console.warn("[correction] no CORRECTIONS_GITHUB_TOKEN; report for", claim?.id ?? story?.slug, message);
    return NextResponse.json({ ok: false, error: "unconfigured" }, { status: 503 });
  }

  const issue = {
    title: `Correction: ${claim ? claim.id : `case file ${story!.slug}`}`,
    labels: ["correction"],
    body: [
      claim
        ? `**Claim** (\`${claim.id}\`, stamped ${claim.verdict.toUpperCase()}):\n> ${claim.claim}`
        : `**Case file** (\`${story!.slug}\`): ${story!.title}`,
      "",
      "**Reader's report:**",
      message.replace(/@/g, "@​"),
      "",
      source ? `**Reader's source:** ${source}` : "_No source given._",
      credit ? `**Credit on /corrections if upheld:** ${credit}` : "_Reader did not ask for credit._",
      "",
      "Corrections desk: verify against sources, fix or reply within 24h, log upheld corrections in content/corrections.json.",
    ].join("\n"),
  };

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "almostlore-corrections",
      },
      body: JSON.stringify(issue),
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[correction]", error);
    return NextResponse.json({ ok: false, error: "provider-error" }, { status: 502 });
  }
}
