import { jobs as sampleJobs } from "@/data/jobs";
import { companies, companyBySlug } from "@/data/companies";
import {
  JOB_CATEGORIES,
  type ExperienceLevel,
  type Job,
  type JobWithCompany,
  type MarketCode,
  type WorkMode,
} from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  Source selection                                                           */
/* -------------------------------------------------------------------------- */

export const DATA_SOURCE = (process.env.JOB_DATA_SOURCE ?? "sample") as
  | "sample"
  | "adzuna";

/** True while the site is running on repo-shipped demo listings. */
export const IS_SAMPLE_DATA = DATA_SOURCE === "sample";

const FALLBACK_COMPANY = {
  slug: "unknown",
  name: "Undisclosed employer",
  blurb: "",
  industry: "",
  size: "",
  hq: "",
  website: "",
};

function withCompany(job: Job): JobWithCompany {
  return { ...job, company: companyBySlug(job.companySlug) ?? FALLBACK_COMPANY };
}

/**
 * All listings, newest first.
 *
 * Memoised: this is called 4+ times while rendering a single page (stats,
 * categories, search, related), and without the cache each call re-mapped and
 * re-sorted the whole index. Harmless at 24 rows, O(n log n) per call once a
 * live feed is supplying thousands.
 *
 * The returned array is treated as immutable by every caller — they all copy
 * via map/filter/slice before sorting. Keep it that way.
 *
 * When JOB_DATA_SOURCE=adzuna this is where the live adapter is plugged in —
 * see lib/adzuna.ts. Kept synchronous for the sample source so that pages can
 * stay statically rendered; swap to async when wiring a live feed (and drop
 * this module-level cache in favour of `revalidate`).
 */
let jobIndex: JobWithCompany[] | null = null;

export function getAllJobs(): JobWithCompany[] {
  if (jobIndex) return jobIndex;
  jobIndex = sampleJobs
    .map(withCompany)
    .sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));
  return jobIndex;
}

export function getJobBySlug(slug: string): JobWithCompany | undefined {
  const job = sampleJobs.find((j) => j.slug === slug);
  return job ? withCompany(job) : undefined;
}

export function getJobsByCompany(companySlug: string) {
  return getAllJobs().filter((j) => j.companySlug === companySlug);
}

/* -------------------------------------------------------------------------- */
/*  Search + filter                                                            */
/* -------------------------------------------------------------------------- */

export interface JobQuery {
  q?: string;
  market?: MarketCode | "all";
  category?: string;
  level?: ExperienceLevel | "all";
  mode?: WorkMode | "all";
  /** "true" restricts to roles flagged as offering visa sponsorship. */
  sponsorship?: boolean;
  sort?: "recent" | "salary";
  page?: number;
  perPage?: number;
}

export interface Facet {
  value: string;
  label: string;
  count: number;
}

export interface JobSearchResult {
  jobs: JobWithCompany[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  facets: {
    markets: Facet[];
    categories: Facet[];
    levels: Facet[];
    modes: Facet[];
  };
}

/** Annual-equivalent figure, purely for sorting. Rough by design. */
function annualised(job: JobWithCompany) {
  if (!job.salary) return 0;
  const { max, period } = job.salary;
  switch (period) {
    case "HOUR":
      return max * 2080;
    case "DAY":
      return max * 260;
    case "WEEK":
      return max * 52;
    case "MONTH":
      return max * 12;
    default:
      return max;
  }
}

function matchesText(job: JobWithCompany, q: string) {
  const needle = q.toLowerCase().trim();
  if (!needle) return true;
  const terms = needle.split(/\s+/);
  const haystack = [
    job.title,
    job.company.name,
    job.location.city,
    job.location.region,
    job.summary,
    job.skills.join(" "),
    job.category,
  ]
    .join(" ")
    .toLowerCase();
  return terms.every((t) => haystack.includes(t));
}

const LEVEL_ORDER: ExperienceLevel[] = [
  "internship",
  "graduate",
  "entry",
  "junior",
];

function countBy<T extends string>(
  list: JobWithCompany[],
  pick: (j: JobWithCompany) => T,
) {
  const map = new Map<T, number>();
  for (const j of list) {
    const k = pick(j);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return map;
}

export function searchJobs(query: JobQuery = {}): JobSearchResult {
  const {
    q = "",
    market = "all",
    category,
    level = "all",
    mode = "all",
    sponsorship = false,
    sort = "recent",
    page = 1,
    perPage = 12,
  } = query;

  const all = getAllJobs();

  // Facet counts are computed against everything except the facet's own
  // dimension being irrelevant here; keeping it simple and honest: counts
  // reflect the text query only, so the numbers never contradict the list.
  const textScoped = all.filter((j) => matchesText(j, q));

  const filtered = textScoped.filter((j) => {
    if (market !== "all" && j.location.market !== market) return false;
    if (category && j.category !== category) return false;
    if (level !== "all" && j.level !== level) return false;
    if (mode !== "all" && j.location.mode !== mode) return false;
    if (sponsorship && !j.visaSponsorship) return false;
    return true;
  });

  const sorted =
    sort === "salary"
      ? [...filtered].sort((a, b) => annualised(b) - annualised(a))
      : filtered;

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;

  const marketCounts = countBy(textScoped, (j) => j.location.market);
  const categoryCounts = countBy(textScoped, (j) => j.category);
  const levelCounts = countBy(textScoped, (j) => j.level);
  const modeCounts = countBy(textScoped, (j) => j.location.mode);

  return {
    jobs: sorted.slice(start, start + perPage),
    total,
    page: safePage,
    perPage,
    totalPages,
    facets: {
      markets: [
        { value: "us", label: "United States", count: marketCounts.get("us") ?? 0 },
        { value: "uk", label: "United Kingdom", count: marketCounts.get("uk") ?? 0 },
        { value: "ca", label: "Canada", count: marketCounts.get("ca") ?? 0 },
      ],
      categories: JOB_CATEGORIES.map((c) => ({
        value: c.slug,
        label: c.name,
        count: categoryCounts.get(c.slug) ?? 0,
      })).filter((f) => f.count > 0),
      levels: LEVEL_ORDER.map((l) => ({
        value: l,
        label:
          l === "internship"
            ? "Internship"
            : l === "graduate"
              ? "Graduate scheme"
              : l === "entry"
                ? "Entry level"
                : "Junior",
        count: levelCounts.get(l) ?? 0,
      })).filter((f) => f.count > 0),
      modes: (["onsite", "hybrid", "remote"] as WorkMode[]).map((m) => ({
        value: m,
        label: m === "onsite" ? "On-site" : m === "hybrid" ? "Hybrid" : "Remote",
        count: modeCounts.get(m) ?? 0,
      })).filter((f) => f.count > 0),
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Related + aggregates                                                       */
/* -------------------------------------------------------------------------- */

export function getRelatedJobs(job: JobWithCompany, limit = 4) {
  const scored = getAllJobs()
    .filter((j) => j.id !== job.id)
    .map((j) => {
      let score = 0;
      if (j.category === job.category) score += 3;
      if (j.level === job.level) score += 2;
      if (j.location.market === job.location.market) score += 2;
      if (j.companySlug === job.companySlug) score += 1;
      score += j.skills.filter((s) => job.skills.includes(s)).length;
      return { job: j, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.job);
}

export function getSiteStats() {
  const all = getAllJobs();
  return {
    jobs: all.length,
    internships: all.filter((j) => j.level === "internship").length,
    companies: companies.length,
    withSalary: all.filter((j) => j.salary).length,
    sponsorship: all.filter((j) => j.visaSponsorship).length,
    markets: new Set(all.map((j) => j.location.market)).size,
  };
}

/** Category tiles for the homepage, with live counts. */
export function getCategoriesWithCounts() {
  const all = getAllJobs();
  return JOB_CATEGORIES.map((c) => ({
    ...c,
    count: all.filter((j) => j.category === c.slug).length,
  })).sort((a, b) => b.count - a.count);
}

/** Popular pre-built searches — these become real internal links for SEO. */
export function getPopularSearches() {
  return [
    { label: "Remote internships", href: "/jobs?level=internship&mode=remote" },
    { label: "Graduate schemes in the UK", href: "/jobs?level=graduate&market=uk" },
    { label: "Visa sponsorship available", href: "/jobs?sponsorship=true" },
    { label: "Software engineering interns", href: "/jobs?category=software-engineering&level=internship" },
    { label: "Entry-level data jobs", href: "/jobs?category=data-analytics&level=entry" },
    { label: "Finance internships in New York", href: "/jobs?category=finance-accounting&level=internship&market=us" },
    { label: "Canada new-grad roles", href: "/jobs?market=ca&level=graduate" },
    { label: "Paid design placements", href: "/jobs?category=design&level=internship" },
  ];
}
