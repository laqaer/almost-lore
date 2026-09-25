/**
 * Tiny analytics shim. Sends events to whichever tools the owner enabled:
 *   NEXT_PUBLIC_GA_ID               → Google Analytics 4 (the ops team reads it through OpenSEO)
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN    → Plausible
 * With neither set, calls are no-ops. Never send emails or other personal data here.
 */

type Params = Record<string, string | number | boolean | undefined>;

type AnalyticsWindow = Window & {
  gtag?: (command: "event", name: string, params?: Params) => void;
  plausible?: (name: string, options?: { props?: Params }) => void;
};

export type AnalyticsEvent =
  | "game_start"
  | "game_answer"
  | "game_complete"
  | "game_share"
  | "practice_start"
  | "subscribe"
  | "checkout_click"
  | "waitlist_join"
  | "classroom_start"
  | "story_cta_click";

export function track(name: AnalyticsEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  try {
    w.gtag?.("event", name, params);
    w.plausible?.(name, { props: params });
  } catch {
    // analytics must never break the page
  }
}
