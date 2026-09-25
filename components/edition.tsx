"use client";

import { useSyncExternalStore } from "react";
import { formatDocketDate, todaysDocketNumber } from "@/lib/game/schedule";

const subscribe = () => () => {};

/** Today's docket number by the viewer's local date; server renders the fallback. */
export function EditionNumber({ prefix = "No. ", fallback = "" }: { prefix?: string; fallback?: string }) {
  const n = useSyncExternalStore(subscribe, () => todaysDocketNumber(), () => null);
  return <>{n === null ? fallback : `${prefix}${n}`}</>;
}

export function EditionDate() {
  const label = useSyncExternalStore(subscribe, () => formatDocketDate(todaysDocketNumber()), () => null);
  return <>{label ?? "Today"}</>;
}
