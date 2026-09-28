"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdUnitProps = {
  client: string;
  slot: string;
};

/**
 * One AdSense unit. The fill request runs after mount, so it also fires on
 * client-side navigation where an inline <script> would not. Config arrives as
 * props from the server component that read it; this file never reads env.
 */
export function AdUnit({ client, slot }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const requested = useRef(false);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins || requested.current) return;
    // Skip a unit AdSense already filled, e.g. a StrictMode effect re-run.
    if (ins.getAttribute("data-adsbygoogle-status")) {
      requested.current = true;
      return;
    }

    requested.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // A vendor failure must not take the page down; leave the slot as-is.
      requested.current = false;
    }
  }, [client, slot]);

  return (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
