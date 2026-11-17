import type { Salary } from "./utils";

export type MarketCode = "us" | "uk" | "ca";

export type WorkMode = "onsite" | "hybrid" | "remote";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERN"
  | "CONTRACTOR"
  | "TEMPORARY";

export type ExperienceLevel = "internship" | "graduate" | "entry" | "junior";

export interface Company {
  slug: string;
  name: string;
  /** Short, factual one-liner. */
  blurb: string;
  industry: string;
  /** Headcount band, e.g. "1,000–5,000". */
  size: string;
  hq: string;
  website: string;
  /** Monogram background tint, chosen from the brand/accent/gray ramps. */
  tint?: string;
}

export interface JobLocation {
  city: string;
  region: string;
  country: string;
  market: MarketCode;
  mode: WorkMode;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  companySlug: string;
  location: JobLocation;
  employmentType: EmploymentType;
  level: ExperienceLevel;
  /** Category slug — must exist in `JOB_CATEGORIES`. */
  category: string;
  salary?: Salary;
  postedAt: string;
  validThrough: string;
  applyUrl: string;
  /** Lead paragraph shown on the detail page, plain text. */
  summary: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  visaSponsorship: boolean;
  /** Degree requirement, or null when explicitly not required. */
  education: string | null;
  /**
   * Marks repo-shipped demo data. Sample rows never emit JobPosting
   * structured data, so they cannot leak into Google Jobs as real vacancies.
   */
  isSample?: boolean;
}

/** A job with its company resolved — what UI components actually receive. */
export interface JobWithCompany extends Job {
  company: Company;
}

export interface JobCategory {
  slug: string;
  name: string;
  /** Plural noun used in copy, e.g. "engineering roles". */
  description: string;
}

export const JOB_CATEGORIES: JobCategory[] = [
  {
    slug: "software-engineering",
    name: "Software Engineering",
    description: "Backend, frontend, mobile and platform roles.",
  },
  {
    slug: "data-analytics",
    name: "Data & Analytics",
    description: "Analysts, data engineering and business intelligence.",
  },
  {
    slug: "marketing",
    name: "Marketing & Growth",
    description: "Content, performance, SEO, lifecycle and brand.",
  },
  {
    slug: "finance-accounting",
    name: "Finance & Accounting",
    description: "Audit, FP&A, treasury and investment roles.",
  },
  {
    slug: "design",
    name: "Design & Product",
    description: "Product design, UX research and associate PM roles.",
  },
  {
    slug: "operations",
    name: "Operations & Supply Chain",
    description: "Logistics, procurement and business operations.",
  },
  {
    slug: "healthcare",
    name: "Healthcare & Life Sciences",
    description: "Clinical research, lab and allied health roles.",
  },
  {
    slug: "engineering",
    name: "Engineering (Non-software)",
    description: "Mechanical, civil, electrical and manufacturing.",
  },
];

export const categoryBySlug = (slug: string) =>
  JOB_CATEGORIES.find((c) => c.slug === slug);

export const LEVEL_LABELS: Record<ExperienceLevel, string> = {
  internship: "Internship",
  graduate: "Graduate scheme",
  entry: "Entry level",
  junior: "Junior",
};

export const MODE_LABELS: Record<WorkMode, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

export const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  INTERN: "Internship",
  CONTRACTOR: "Contract",
  TEMPORARY: "Fixed term",
};

/* -------------------------------------------------------------------------- */
/*  Guides (editorial content)                                                 */
/* -------------------------------------------------------------------------- */

export interface GuideFrontmatter {
  title: string;
  description: string;
  /** Short title for cards and breadcrumbs. */
  shortTitle?: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  authorRole: string;
  /** Markets the advice applies to; drives the "Applies to" chip row. */
  markets: MarketCode[];
  featured?: boolean;
  /** Related guide slugs. */
  related?: string[];
}

export interface Guide extends GuideFrontmatter {
  slug: string;
  html: string;
  readingMinutes: number;
  headings: { id: string; text: string; level: number }[];
}
