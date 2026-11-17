import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The surrounding git repo is the user's home directory, so pin the
  // workspace root explicitly or Turbopack walks too far up.
  turbopack: { root: import.meta.dirname },
  reactStrictMode: true,
  poweredByHeader: false,
  // Trailing slashes off keeps one canonical URL shape per page.
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Optimised variants are content-hashed; hold them for a year.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        // /jobs reads searchParams, so it is server-rendered per request and
        // Next marks it no-store by default. The listing index only changes
        // when the feed refreshes, so let a CDN hold each filter combination
        // briefly and serve stale while it revalidates. This is the one route
        // that is not prerendered; everything else is static HTML.
        source: "/jobs",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        // Files in public/ are not content-hashed by the build, so they are
        // served with no cache by default — every navigation re-validates.
        // These are versioned by filename, so pin them hard.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
