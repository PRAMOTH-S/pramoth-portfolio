import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Case-study pages are intentionally not linked from the UI, so only the
// home page and the résumé are advertised. Empty until NEXT_PUBLIC_SITE_URL is set.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/resume`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
