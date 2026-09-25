/**
 * Optional Upstash Redis (REST) for aggregate "% of players who got this right".
 *   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN  (Vercel Marketplace → Upstash, free tier)
 * Without them, the stats API answers { enabled: false } and the UI hides the numbers.
 */

export function kvEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

type Command = (string | number)[];

export async function kvPipeline(commands: Command[]): Promise<unknown[]> {
  const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const json = (await res.json()) as { result: unknown; error?: string }[];
  return json.map((item) => item.result);
}
