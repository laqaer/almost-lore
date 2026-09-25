import "server-only";
import { createDecipheriv } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Paid files live in /private/products. The repository is public, so they are committed only
 * encrypted (`<file>.enc`, AES-256-GCM, written by scripts/build-pdfs.mjs when PRODUCTS_KEY is
 * set) and decrypted here, per verified download, with the same PRODUCTS_KEY (32 bytes, base64).
 * A plaintext copy (local builds, or a private deployment) is served as-is.
 */
const DIR = path.join(process.cwd(), "private", "products");
const MAGIC = "ALP1";

function key(): Buffer | null {
  const raw = process.env.PRODUCTS_KEY?.trim();
  if (!raw) return null;
  const buf = Buffer.from(raw, "base64");
  return buf.length === 32 ? buf : null;
}

const safe = (file: string) => /^[a-z0-9-]+\.pdf$/.test(file);

export function productFileAvailable(file: string): boolean {
  if (!safe(file)) return false;
  if (existsSync(path.join(DIR, file))) return true;
  return key() !== null && existsSync(path.join(DIR, `${file}.enc`));
}

export async function readProductFile(file: string): Promise<Uint8Array | null> {
  if (!safe(file)) return null;
  const plain = path.join(DIR, file);
  if (existsSync(plain)) return new Uint8Array(await readFile(plain));
  const k = key();
  const enc = path.join(DIR, `${file}.enc`);
  if (!k || !existsSync(enc)) return null;
  const blob = await readFile(enc);
  if (blob.subarray(0, 4).toString("latin1") !== MAGIC) return null;
  const iv = blob.subarray(4, 16);
  const tag = blob.subarray(16, 32);
  const decipher = createDecipheriv("aes-256-gcm", k, iv);
  decipher.setAuthTag(tag);
  return new Uint8Array(Buffer.concat([decipher.update(blob.subarray(32)), decipher.final()]));
}
