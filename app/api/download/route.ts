import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { getProduct } from "@/lib/products";
import { getCheckoutSession } from "@/lib/stripe";

/**
 * GET /api/download?session_id=cs_…&file=almost-lore-party-pack.pdf
 * Re-verifies the Stripe Checkout Session on every request, then streams the file from
 * /private/products (never from /public).
 */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id") ?? "";
  const file = request.nextUrl.searchParams.get("file") ?? "";

  const session = await getCheckoutSession(sessionId);
  if (!session || session.payment_status !== "paid") {
    return NextResponse.json({ error: "payment-not-verified" }, { status: 403 });
  }

  const product = getProduct(session.metadata?.sku ?? "");
  const entitled = product?.files.find((item) => item.file === file);
  if (!product || !entitled) {
    return NextResponse.json({ error: "not-entitled" }, { status: 403 });
  }

  try {
    const bytes = await readFile(path.join(process.cwd(), "private", "products", entitled.file));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${entitled.file}"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (error) {
    console.error("[download] missing file", entitled.file, error);
    return NextResponse.json({ error: "file-missing" }, { status: 500 });
  }
}
