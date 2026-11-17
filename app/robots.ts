import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          // Query-string permutations canonicalise to /jobs; let crawlers
          // follow them for discovery but keep the sorted duplicates out.
          "/jobs?*sort=",
          "/*?*page=",
        ],
      },
      // Google's job crawler needs unrestricted access to listing pages for
      // Google Jobs eligibility.
      { userAgent: "Googlebot", allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
