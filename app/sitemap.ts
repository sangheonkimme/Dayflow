import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { IMAGE_TOOLS_PUBLIC } from "@/lib/feature-flags";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    ...(IMAGE_TOOLS_PUBLIC
      ? ([
          { url: `${base}/tools/crop`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
          { url: `${base}/tools/pdf`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        ] as MetadataRoute.Sitemap)
      : []),
    { url: `${base}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/forgot`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
