"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Loads GA4 and/or Plausible only when the owner configured them, and never in
 * classroom/projector mode (links into /class are full page loads, so nothing carries over).
 */
export function Analytics() {
  const pathname = usePathname();
  if (pathname?.startsWith("/class")) return null;
  return (
    <>
      {GA_ID ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
      {PLAUSIBLE_DOMAIN ? (
        <Script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      ) : null}
    </>
  );
}

/** Hides site chrome (header/footer) on routes that need the whole screen. */
export function Chrome({ children, hideOn }: { children: React.ReactNode; hideOn: string }) {
  const pathname = usePathname();
  if (pathname?.startsWith(hideOn)) return null;
  return <>{children}</>;
}
