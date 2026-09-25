import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchivedDocket } from "@/components/game/archived-docket";
import { decodeChallenge } from "@/lib/game/challenge";
import { getDocket, isDocketOpen } from "@/lib/game/content";
import { rankFor } from "@/lib/game/scoring";
import { pageMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ c?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { n: raw } = await params;
  const { c } = await searchParams;
  const n = Number(raw);
  const challenge = decodeChallenge(c);
  const docket = Number.isInteger(n) && isDocketOpen(n) ? getDocket(n) : null;
  const score = challenge && docket ? challenge.picks.filter((p, i) => p === docket.claims[i]?.verdict).length : null;
  const base = pageMetadata({
    title: challenge ? `${challenge.name} challenged you: Almost Lore No. ${n}` : `Almost Lore No. ${n}`,
    description: challenge
      ? `${challenge.name} stamped five history claims and sealed the results. Happened, almost, or lore? Play to break the seal.`
      : `Five history claims. Happened, almost, or lore? Play Almost Lore No. ${n}.`,
    path: `/play/${n}`,
    image: {
      url: `/api/og/docket?n=${n}${challenge && score !== null ? `&name=${encodeURIComponent(challenge.name)}&score=${score}&rank=${encodeURIComponent(rankFor(score).title)}` : ""}`,
      width: 1200,
      height: 630,
      alt: `Almost Lore No. ${n}`,
    },
  });
  return base;
}

export default async function DocketPage({ params, searchParams }: Props) {
  const { n: raw } = await params;
  const { c } = await searchParams;
  const n = Number(raw);
  if (!Number.isInteger(n) || !isDocketOpen(n)) notFound();
  const docket = getDocket(n);
  if (!docket) notFound();
  const payload = {
    n: docket.n,
    theme: docket.theme ?? null,
    encore: docket.encore,
    claims: docket.claims.map((claim) => ({
      ...claim,
      sources: claim.sources.map(({ title, publisher, url }) => ({ title, publisher, url })),
    })),
  };
  return (
    <>
      <h1 className="sr">Almost Lore No. {n}</h1>
      <ArchivedDocket docket={payload} challengeToken={c ?? null} />
    </>
  );
}
