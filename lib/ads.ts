/**
 * Ad configuration, resolved once at build time (static export).
 * Nothing here fetches. It only decides whether ad markup is written.
 */

/** Google's TAG certification authority ID. A public constant, not a secret. */
export const ADS_TXT_CERTIFICATION_AUTHORITY = "f08c47fec0942fa0";

/** AdSense client IDs look like `ca-pub-` followed by 16 digits. */
const CLIENT_RE = /^ca-pub-[0-9]{16}$/;
/** AdSense ad unit slots are 10-digit ids. */
const SLOT_RE = /^[0-9]{10}$/;

/**
 * Whether a certified consent platform (a Google-certified IAB TCF CMP) is
 * actually deployed. Deliberately a source constant, not an env var: an env
 * string is an assertion, not visitor consent. Flip it only in the same change
 * that installs the CMP. Until then no ad code is served, whatever the env says.
 */
const CONSENT_PLATFORM_INSTALLED = false;

export type AdsConfig =
  | { enabled: true; client: string; publisherId: string; slot: string }
  | { enabled: false; client: null; publisherId: null; slot: null };

function env(name: string): string {
  const raw = process.env[name];
  return typeof raw === "string" ? raw.trim() : "";
}

/** `pub-…` form derived from the `ca-pub-…` client id. */
export function publisherIdFromClient(client: string): string | null {
  return CLIENT_RE.test(client) ? client.replace(/^ca-/, "") : null;
}

/**
 * The configured `pub-…` id from the ad client, or null. Independent of
 * whether ads serve. ads.txt reads `NEXT_PUBLIC_ADSENSE_PUB_ID` instead.
 */
export function adsPublisherId(): string | null {
  return publisherIdFromClient(env("NEXT_PUBLIC_ADS_PUBLISHER_ID"));
}

/** ads.txt accepts only `pub-` plus 10–20 digits. Anything else stays a comment. */
const ADSENSE_PUB_RE = /^pub-\d{10,20}$/;

export const ADS_TXT_PLACEHOLDER =
  "# Almost Lore ads.txt — AdSense publisher line added after approval.";

/**
 * The ads.txt publisher id from `NEXT_PUBLIC_ADSENSE_PUB_ID`, or null.
 * Separate from the `ca-pub-` client id that gates ad markup.
 */
export function adsensePublisherId(): string | null {
  const raw = env("NEXT_PUBLIC_ADSENSE_PUB_ID");
  return ADSENSE_PUB_RE.test(raw) ? raw : null;
}

/** One comment while unset or invalid; one seller line once a real id is set. */
export function adsTxtBody(): string {
  const publisherId = adsensePublisherId();
  const line = publisherId
    ? `google.com, ${publisherId}, DIRECT, ${ADS_TXT_CERTIFICATION_AUTHORITY}`
    : ADS_TXT_PLACEHOLDER;
  return `${line}\n`;
}

export function adsConfig(): AdsConfig {
  const off: AdsConfig = { enabled: false, client: null, publisherId: null, slot: null };

  if (env("NEXT_PUBLIC_ADS_ENABLED") !== "true") return off;

  const client = env("NEXT_PUBLIC_ADS_PUBLISHER_ID");
  const slot = env("NEXT_PUBLIC_ADS_SLOT");
  const publisherId = publisherIdFromClient(client);

  // A missing or malformed publisher ID or slot keeps ads off. We never invent one.
  if (!publisherId || !SLOT_RE.test(slot)) return off;

  return { enabled: true, client, publisherId, slot };
}

/**
 * The full config only when markup may actually be served: configured ids plus
 * a consent platform in place. Null means serve nothing.
 */
export function adsRunnableConfig(): Extract<AdsConfig, { enabled: true }> | null {
  const config = adsConfig();
  return config.enabled && CONSENT_PLATFORM_INSTALLED ? config : null;
}
