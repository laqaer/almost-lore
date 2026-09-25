import type { Metadata } from "next";
import { TodayGame } from "@/components/game/today";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { gameJsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Today's docket — happened, almost, or lore?",
  description:
    "Five history claims, written as plain fact. Stamp each one HAPPENED, ALMOST or LORE, then open the sourced record. New docket every day at your midnight.",
  path: "/play",
});

export default function PlayPage() {
  return (
    <>
      <JsonLd data={gameJsonLd()} />
      <h1 className="sr">Today&apos;s docket</h1>
      <TodayGame />
    </>
  );
}
