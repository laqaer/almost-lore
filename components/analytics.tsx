"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { untrackedPath } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Loads GA4 and/or Plausible only when the owner configured them, and never on untracked pages:
 * classroom/projector mode (no data about students, ever) and /thanks (its URL is a download key).
 * If the scripts are already loaded from another page, GA's official opt-out flag silences them
 * while an untracked page is showing, and Plausible's exclusions list covers history navigation.
 */
export function Analytics() {
  const pathname = usePathname();
  const off = untrackedPath(pathname);
  useEffect(() => {
    if (GA_ID) (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = off;
  }, [off]);
  if (off) return null;
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
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          data-exclude="/class, /class/**, /thanks"
          src="https://plausible.io/js/script.exclusions.js"
          strategy="afterInteractive"
        />
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
