import { adsRunnableConfig } from "@/lib/ads";

/**
 * The AdSense loader. Server component; renders null (no network request)
 * unless a consent platform is installed.
 */
export function AdsScript() {
  const config = adsRunnableConfig();
  if (!config) return null;

  const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.client)}`;

  return <script async crossOrigin="anonymous" src={src} />;
}
