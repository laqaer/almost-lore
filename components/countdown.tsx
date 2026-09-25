"use client";

import { useEffect, useState } from "react";
import { msUntilLocalMidnight } from "@/lib/game/schedule";

function format(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/** Time until the next docket (local midnight). Renders a stable placeholder on the server. */
export function Countdown({ className = "" }: { className?: string }) {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setMs(msUntilLocalMidnight());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <time className={className} suppressHydrationWarning aria-live="off">
      {ms === null ? "--:--:--" : format(ms)}
    </time>
  );
}
