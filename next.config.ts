import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Paid files live outside /public and are streamed by /api/download after Stripe verification.
  outputFileTracingIncludes: {
    "/api/download": ["./private/products/**/*"],
    "/api/og/docket": ["./assets/fonts/**/*"],
  },
  async redirects() {
    return [
      { source: "/stories", destination: "/case-files", permanent: true },
      { source: "/stories/:slug", destination: "/case-files/:slug", permanent: true },
      { source: "/today", destination: "/play", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The embeddable widget is meant to be framed by other sites.
      { source: "/embed/:path*", headers: [{ key: "X-Frame-Options", value: "ALLOWALL" }] },
    ];
  },
};

export default nextConfig;
