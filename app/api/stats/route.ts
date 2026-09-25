import { NextResponse, type NextRequest } from "next/server";
import { getDocket, isDocketOpen } from "@/lib/game/content";
import { kvEnabled, kvPipeline } from "@/lib/kv";
import { allow, clientKey } from "@/lib/rate-limit";

/** Minimum plays before any percentage is shown — no tiny-sample theatre. */
const MIN_SAMPLE = 25;
const TTL = 60 * 60 * 24 * 120;

/** GET /api/stats?n=12 → { enabled, plays, right: [pct|null ×5] } */
export async function GET(request: NextRequest) {
  const n = Number(request.nextUrl.searchParams.get("n"));
  if (!kvEnabled()) return NextResponse.json({ enabled: false });
  if (!Number.isInteger(n) || !isDocketOpen(n)) return NextResponse.json({ error: "bad-docket" }, { status: 400 });

  try {
    const keys = [`d:${n}:plays`, ...[0, 1, 2, 3, 4].map((i) => `d:${n}:r:${i}`)];
    const [plays, ...rights] = (await kvPipeline(keys.map((key) => ["GET", key]))).map((v) => Number(v ?? 0));
    const right = rights.map((count) => (plays >= MIN_SAMPLE ? Math.round((count / plays) * 100) : null));
    return NextResponse.json(
      { enabled: true, plays, right },
      { headers: { "Cache-Control": "public, max-age=30, s-maxage=60" } },
    );
  } catch (error) {
    console.error("[stats:get]", error);
    return NextResponse.json({ enabled: false });
  }
}

/** POST /api/stats { n, correct: boolean[5] } — one anonymous tally per finished docket. */
export async function POST(request: NextRequest) {
  if (!kvEnabled()) return NextResponse.json({ enabled: false });
  const body = (await request.json().catch(() => ({}))) as { n?: number; correct?: unknown };
  const n = Number(body.n);
  const correct = body.correct;
  if (
    !Number.isInteger(n) ||
    !isDocketOpen(n) ||
    !getDocket(n) ||
    !Array.isArray(correct) ||
    correct.length !== 5 ||
    !correct.every((v) => typeof v === "boolean")
  ) {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }

  if (!(await allow(request, "stats", 20, 3600))) return NextResponse.json({ ok: true });

  try {
    // One tally per browser network per docket: without this, a script could mint a fake
    // "0% got this right" in 25 requests. Duplicates get a quiet ok and change nothing.
    const [fresh] = await kvPipeline([["SET", `d:${n}:seen:${clientKey(request)}`, 1, "EX", 172800, "NX"]]);
    if (fresh !== "OK") return NextResponse.json({ ok: true });
    const commands: (string | number)[][] = [["INCR", `d:${n}:plays`], ["EXPIRE", `d:${n}:plays`, TTL]];
    correct.forEach((ok, i) => {
      if (ok) commands.push(["INCR", `d:${n}:r:${i}`], ["EXPIRE", `d:${n}:r:${i}`, TTL]);
    });
    await kvPipeline(commands);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[stats:post]", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
