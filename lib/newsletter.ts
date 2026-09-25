/**
 * Newsletter provider adapters. The site works with whichever provider the owner
 * configures via env vars — first match wins. With none configured, signups are
 * rejected honestly (never silently dropped) so the owner notices in the logs.
 *
 *   BUTTONDOWN_API_KEY                       → Buttondown
 *   BEEHIIV_API_KEY + BEEHIIV_PUBLICATION_ID → beehiiv
 *   KIT_API_KEY + KIT_FORM_ID                → Kit (ConvertKit v4)
 *   NEWSLETTER_WEBHOOK_URL                   → any webhook (Zapier, Make, Apps Script…)
 */

export type SignupSource =
  | "game-result"
  | "home"
  | "story"
  | "footer"
  | "newsletter-page"
  | "shop-waitlist"
  | "classroom"
  | "deck-waitlist"
  | "purchase";

export type SignupInput = {
  email: string;
  source: SignupSource;
  /** Optional tag list, e.g. ["waitlist:deck"]. */
  tags?: string[];
  referrer?: string;
};

export type SignupResult =
  | { ok: true; provider: string }
  | { ok: false; reason: "invalid" | "unconfigured" | "provider-error"; detail?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

export function newsletterProvider(): string | null {
  if (process.env.BUTTONDOWN_API_KEY) return "buttondown";
  if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) return "beehiiv";
  if (process.env.KIT_API_KEY && process.env.KIT_FORM_ID) return "kit";
  if (process.env.NEWSLETTER_WEBHOOK_URL) return "webhook";
  return null;
}

async function ok(res: Response, provider: string): Promise<SignupResult> {
  // 409/400 "already subscribed" responses are a success from the reader's point of view.
  if (res.ok || res.status === 409) return { ok: true, provider };
  const body = await res.text().catch(() => "");
  if (/already|exists|duplicate/i.test(body)) return { ok: true, provider };
  return { ok: false, reason: "provider-error", detail: `${provider} ${res.status}: ${body.slice(0, 300)}` };
}

export async function subscribe(input: SignupInput): Promise<SignupResult> {
  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) return { ok: false, reason: "invalid" };
  const tags = [`source:${input.source}`, ...(input.tags ?? [])];
  const provider = newsletterProvider();

  try {
    switch (provider) {
      case "buttondown": {
        const res = await fetch("https://api.buttondown.com/v1/subscribers", {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: email,
            tags,
            referrer_url: input.referrer,
          }),
        });
        return ok(res, provider);
      }
      case "beehiiv": {
        const res = await fetch(
          `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              reactivate_existing: false,
              send_welcome_email: true,
              utm_source: input.source,
              referring_site: input.referrer,
            }),
          },
        );
        return ok(res, provider);
      }
      case "kit": {
        const res = await fetch(`https://api.kit.com/v4/forms/${process.env.KIT_FORM_ID}/subscribers`, {
          method: "POST",
          headers: {
            "X-Kit-Api-Key": process.env.KIT_API_KEY as string,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email_address: email, referrer: input.referrer }),
        });
        return ok(res, provider);
      }
      case "webhook": {
        const res = await fetch(process.env.NEWSLETTER_WEBHOOK_URL as string, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source: input.source, tags, referrer: input.referrer }),
        });
        return ok(res, provider);
      }
      default:
        return { ok: false, reason: "unconfigured" };
    }
  } catch (error) {
    return { ok: false, reason: "provider-error", detail: String(error) };
  }
}
