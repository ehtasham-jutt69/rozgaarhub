import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/site.config";
import { getAllJobs } from "@/lib/jobs";
import { getAllGuides } from "@/lib/guides";
import { companies } from "@/data/companies";
import { JOB_CATEGORIES } from "@/lib/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = (
    [
      { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
      { url: absoluteUrl("/jobs"), changeFrequency: "hourly", priority: 0.9 },
      { url: absoluteUrl("/internships"), changeFrequency: "daily", priority: 0.9 },
      { url: absoluteUrl("/guides"), changeFrequency: "weekly", priority: 0.8 },
      { url: absoluteUrl("/salaries"), changeFrequency: "weekly", priority: 0.8 },
      { url: absoluteUrl("/companies"), changeFrequency: "daily", priority: 0.7 },
      { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
      { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.5 },
      {
        url: absoluteUrl("/editorial-policy"),
        changeFrequency: "yearly",
        priority: 0.4,
      },
      { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
      { url: absoluteUrl("/cookies"), changeFrequency: "yearly", priority: 0.3 },
      { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
      {
        url: absoluteUrl("/disclaimer"),
        changeFrequency: "yearly",
        priority: 0.3,
      },
    ] as MetadataRoute.Sitemap
  ).map((p) => ({ ...p, lastModified: now }));

  const categoryPages: MetadataRoute.Sitemap = JOB_CATEGORIES.map((c) => ({
    url: absoluteUrl(`/categories/${c.slug}`),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const jobPages: MetadataRoute.Sitemap = getAllJobs().map((job) => ({
    url: absoluteUrl(`/jobs/${job.slug}`),
    lastModified: new Date(job.postedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const companyPages: MetadataRoute.Sitemap = companies.map((c) => ({
    url: absoluteUrl(`/companies/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const guidePages: MetadataRoute.Sitemap = getAllGuides().map((g) => ({
    url: absoluteUrl(`/guides/${g.slug}`),
    lastModified: new Date(g.updatedAt ?? g.publishedAt),
    changeFrequency: "monthly",
    // Editorial content is the long-term traffic asset — weight it highly.
    priority: 0.85,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...guidePages,
    ...jobPages,
    ...companyPages,
  ];
}
