"use client";

import { useEffect } from "react";

export function FeedNavigation() {
  useEffect(() => {
    function skipFeedTransition(event: PageSwapEvent) {
      const destination = event.activation?.entry.url;
      if (destination && new URL(destination).pathname === "/feed.xml") {
        // XML cannot opt in to the HTML page transition.
        event.viewTransition?.skipTransition();
      }
    }

    window.addEventListener("pageswap", skipFeedTransition);
    return () => window.removeEventListener("pageswap", skipFeedTransition);
  }, []);

  return null;
}
