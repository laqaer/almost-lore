import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/** The free printable sampler; built by scripts/build-pdfs.mjs into /public/free. */
export const STARTER_DECK = "/free/almost-lore-starter-deck.pdf";

export function starterDeckAvailable(): boolean {
  return existsSync(path.join(process.cwd(), "public", STARTER_DECK));
}
