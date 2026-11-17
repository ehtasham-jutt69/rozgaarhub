import Link from "next/link";
import type { Metadata } from "next";
import { searchJobs, getSiteStats, IS_SAMPLE_DATA } from "@/lib/jobs";
import {
  JOB_CATEGORIES,
  LEVEL_LABELS,
  MODE_LABELS,
  type ExperienceLevel,
  type MarketCode,
  type WorkMode,
} from "@/lib/types";
import { buildMetadata, breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { site } from "@/site.config";
import { pluralize } from "@/lib/utils";
import { JobRow } from "@/components/job-card";
import { JobFilters, SortControl, type ActiveParams } from "@/components/job-filters";
import { SearchBar } from "@/components/search-bar";
import { Breadcrumbs, EmptyState, ButtonLink, JsonLd, Badge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { AdSlot } from "@/components/ad-slot";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const one = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

/**
 * Query params arrive from a plain GET form and from arbitrary inbound links,
 * so nothing is trusted. Anything not in the allow-list collapses to
 * undefined, which the filters treat as "no constraint" — a junk value can
 * never silently produce an empty board.
 */
const pick = <T extends string>(
  v: string | string[] | undefined,
  allowed: readonly T[],
): T | undefined => {
  const raw = one(v);
  return raw && (allowed as readonly string[]).includes(raw)
    ? (raw as T)
    : undefined;
};

const MARKETS = ["us", "uk", "ca"] as const;
const LEVELS = ["internship", "graduate", "entry", "junior"] as const;
const MODES = ["onsite", "hybrid", "remote"] as const;
const CATEGORY_SLUGS = JOB_CATEGORIES.map((c) => c.slug);

const MARKET_NAME: Record<string, string> = {
  us: "the United States",
  uk: "the United Kingdom",
  ca: "Canada",
};

/** Human-readable description of the current filter set, for titles + H1. */
function describe(params: ActiveParams) {
  const level = params.level
    ? LEVEL_LABELS[params.level as ExperienceLevel]?.toLowerCase()
    : null;
  const category = params.category
    ? JOB_CATEGORIES.find((c) => c.slug === params.category)?.name
    : null;
  const mode = params.mode
    ? MODE_LABELS[params.mode as WorkMode]?.toLowerCase()
    : null;
  const market = params.market ? MARKET_NAME[params.market] : null;

  let noun = "Jobs";
  if (level === "internship") noun = "Internships";
  else if (level === "graduate scheme") noun = "Graduate schemes";
  else if (level) noun = `${level[0]!.toUpperCase()}${level.slice(1)} jobs`;

  const parts: string[] = [];
  if (mode && mode !== "on-site") parts.push(mode);
  if (category) parts.push(`in ${category}`);
  if (market) parts.push(`in ${market}`);
  if (params.sponsorship === "true") parts.push("with visa sponsorship");
  if (params.q) parts.push(`matching “${params.q}”`);

  return { noun, suffix: parts.join(" "), hasFilters: parts.length > 0 || Boolean(level) };
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const params: ActiveParams = {
    q: one(sp.q)?.trim() || undefined,
    market: pick(sp.market, MARKETS),
    category: pick(sp.category, CATEGORY_SLUGS),
    level: pick(sp.level, LEVELS),
    mode: pick(sp.mode, MODES),
    sponsorship: one(sp.sponsorship) === "true" ? "true" : undefined,
  };
  const { noun, suffix } = describe(params);
  const title = suffix
    ? `${noun} ${suffix}`
    : "Entry-level jobs, internships and graduate schemes";

  return buildMetadata({
    title,
    description: `Browse ${noun.toLowerCase()} ${suffix} across the US, UK and Canada. Salary ranges, work setup and visa-sponsorship status shown on every listing.`.replace(
      /\s+/g,
      " ",
    ),
    path: "/jobs",
    // Filtered permutations all point at the clean /jobs canonical so that
    // crawl equity consolidates instead of splitting across query strings.
    canonicalOverride: "/jobs",
  });
}

export default async function JobsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const market = pick(sp.market, MARKETS);
  const level = pick(sp.level, LEVELS);
  const mode = pick(sp.mode, MODES);
  const category = pick(sp.category, CATEGORY_SLUGS);
  const q = one(sp.q)?.trim() || undefined;

  const params: ActiveParams = {
    q,
    market,
    category,
    level,
    mode,
    sponsorship: one(sp.sponsorship) === "true" ? "true" : undefined,
    sort: one(sp.sort) === "salary" ? "salary" : undefined,
  };

  const pageRaw = Number(one(sp.page));
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

  const result = searchJobs({
    q,
    market: market ?? "all",
    category,
    level: level ?? "all",
    mode: mode ?? "all",
    sponsorship: params.sponsorship === "true",
    sort: params.sort === "salary" ? "salary" : "recent",
    page,
    perPage: 12,
  });

  const stats = getSiteStats();
  const { noun, suffix } = describe(params);
  const heading = suffix ? `${noun} ${suffix}` : "Every entry-level opening we track";

  const trail = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
  ];

  const pageHref = (n: number) => {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) if (v) next[k] = v;
    if (n > 1) next.page = String(n);
    const qs = new URLSearchParams(next).toString();
    return qs ? `/jobs?${qs}` : "/jobs";
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <JsonLd data={itemListSchema(result.jobs)} />

      {/* Page header */}
      <section className="border-b border-gray-200 bg-brand-50">
        <div className="container-page py-8 md:py-10">
          <Breadcrumbs trail={trail} className="mb-5" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-display-sm md:text-display-md text-balance">
                {heading}
              </h1>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-gray-600">
                {pluralize(result.total, "role")} from {stats.companies}{" "}
                employers across {site.markets.length} countries. Filters are
                shareable links — send one to a friend and they see the same
                results.
              </p>
            </div>

            {IS_SAMPLE_DATA && (
              <Badge tone="sample" icon="shield" className="h-fit shrink-0">
                Demo data — fictional employers
              </Badge>
            )}
          </div>

          <div className="mt-7">
            <SearchBar
              defaultQuery={params.q ?? ""}
              defaultMarket={params.market ?? "all"}
              size="md"
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Filters */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <JobFilters facets={result.facets} current={params} />
              <AdSlot slot="jobs-sidebar" minHeight={600} className="mt-8 hidden lg:block" />
            </div>
          </aside>

          {/* List */}
          <div className="lg:col-span-9">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[0.875rem] text-gray-600">
                Showing{" "}
                <span className="tnum font-medium text-ink">
                  {result.jobs.length}
                </span>{" "}
                of{" "}
                <span className="tnum font-medium text-ink">
                  {result.total}
                </span>{" "}
                roles
              </p>
              <SortControl current={params} />
            </div>

            {result.jobs.length === 0 ? (
              <EmptyState
                title="No roles match those filters"
                description="Try widening the country or clearing the experience level. New roles are added continuously."
                action={
                  <ButtonLink href="/jobs" variant="secondary">
                    Clear all filters
                  </ButtonLink>
                }
              />
            ) : (
              <>
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
                  {result.jobs.map((job) => (
                    <JobRow key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {result.totalPages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="mt-8 flex items-center justify-between gap-4"
                  >
                    {result.page > 1 ? (
                      <Link
                        href={pageHref(result.page - 1)}
                        rel="prev"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-ink hover:bg-gray-50"
                      >
                        <Icon name="arrowLeft" size={15} />
                        Previous
                      </Link>
                    ) : (
                      <span />
                    )}

                    <p className="tnum text-[0.8125rem] text-gray-600">
                      Page {result.page} of {result.totalPages}
                    </p>

                    {result.page < result.totalPages ? (
                      <Link
                        href={pageHref(result.page + 1)}
                        rel="next"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-ink hover:bg-gray-50"
                      >
                        Next
                        <Icon name="arrowRight" size={15} />
                      </Link>
                    ) : (
                      <span />
                    )}
                  </nav>
                )}
              </>
            )}

            <AdSlot slot="jobs-footer" minHeight={280} className="lg:hidden" />

            {/* Internal linking block — helps crawl depth */}
            <section className="mt-14 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="font-sans text-[1rem] font-semibold text-ink">
                Browse by field
              </h2>
              <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {JOB_CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/categories/${c.slug}`}
                      className="group inline-flex items-center gap-1.5 text-[0.875rem] text-gray-700 hover:text-brand-800"
                    >
                      <Icon
                        name="chevronRight"
                        size={13}
                        className="text-gray-400 group-"
                      />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
