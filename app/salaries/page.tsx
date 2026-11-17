import Link from "next/link";
import type { Metadata } from "next";
import { getAllJobs, IS_SAMPLE_DATA } from "@/lib/jobs";
import { JOB_CATEGORIES, LEVEL_LABELS, type ExperienceLevel } from "@/lib/types";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { Badge, Breadcrumbs, ButtonLink, JsonLd, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icons";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = buildMetadata({
  title: "Entry-level salary benchmarks for the US, UK and Canada",
  description:
    "What employers are actually advertising for internships, graduate schemes and entry-level roles — broken down by field, level and country, with the sample size shown for every figure.",
  path: "/salaries",
});

const SYMBOL: Record<string, string> = { USD: "$", GBP: "£", CAD: "C$" };
const MARKET_NAME: Record<string, string> = {
  us: "United States",
  uk: "United Kingdom",
  ca: "Canada",
};
const CURRENCY_BY_MARKET: Record<string, string> = {
  us: "USD",
  uk: "GBP",
  ca: "CAD",
};

/** Convert any advertised period to an annual figure for comparison. */
function annual(min: number, max: number, period: string) {
  const mult =
    period === "HOUR"
      ? 2080
      : period === "DAY"
        ? 260
        : period === "WEEK"
          ? 52
          : period === "MONTH"
            ? 12
            : 1;
  return { min: min * mult, max: max * mult };
}

function fmt(n: number, currency: string) {
  const sym = SYMBOL[currency] ?? "";
  return `${sym}${Math.round(n / 1000)}k`;
}

export default function SalariesPage() {
  const jobs = getAllJobs().filter((j) => j.salary);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Salaries", path: "/salaries" },
  ];

  // --- By market + level ---------------------------------------------------
  const byMarketLevel = (["us", "uk", "ca"] as const).map((market) => {
    const currency = CURRENCY_BY_MARKET[market]!;
    const rows = (
      ["internship", "graduate", "entry", "junior"] as ExperienceLevel[]
    )
      .map((level) => {
        const set = jobs.filter(
          (j) => j.location.market === market && j.level === level,
        );
        if (!set.length) return null;

        const ranges = set.map((j) =>
          annual(j.salary!.min, j.salary!.max, j.salary!.period),
        );
        const low = Math.min(...ranges.map((r) => r.min));
        const high = Math.max(...ranges.map((r) => r.max));
        const median =
          ranges
            .map((r) => (r.min + r.max) / 2)
            .sort((a, b) => a - b)[Math.floor(ranges.length / 2)] ?? 0;

        return { level, count: set.length, low, high, median, currency };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    return { market, currency, rows };
  });

  // --- By field ------------------------------------------------------------
  const byField = JOB_CATEGORIES.map((c) => {
    const set = jobs.filter((j) => j.category === c.slug);
    if (!set.length) return null;

    const ranges = set.map((j) => ({
      ...annual(j.salary!.min, j.salary!.max, j.salary!.period),
      currency: j.salary!.currency,
    }));
    const median =
      ranges
        .map((r) => (r.min + r.max) / 2)
        .sort((a, b) => a - b)[Math.floor(ranges.length / 2)] ?? 0;

    return {
      ...c,
      count: set.length,
      median,
      // Mixed currencies are shown per-field as a dominant-currency estimate.
      currency: ranges[0]!.currency,
      mixed: new Set(ranges.map((r) => r.currency)).size > 1,
    };
  })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => b.median - a.median);

  const maxMedian = Math.max(...byField.map((f) => f.median), 1);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <section className="border-b border-gray-200 bg-brand-50">
        <div className="container-page py-9 md:py-12">
          <Breadcrumbs trail={trail} className="mb-6" />
          <div className="max-w-3xl">
            <h1 className="text-display-sm md:text-display-md text-balance">
              What entry-level roles actually pay
            </h1>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-gray-700 text-pretty md:text-[1.125rem]">
              These figures come from the pay ranges employers published in
              their own job adverts on this site — not from self-reported
              surveys. Every number shows the sample size behind it, because a
              median drawn from four listings is not the same as one drawn from
              four hundred.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="brand" icon="document">
              {jobs.length} listings with published pay
            </Badge>
            {IS_SAMPLE_DATA && (
              <Badge tone="sample" icon="shield">
                Demo data — figures are illustrative only
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Methodology up front — matters for trust and for E-E-A-T */}
      <section className="container-page pt-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-sans text-[1rem] font-semibold text-ink">
            How these numbers are produced
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Only listings where the employer published a range are included. We never impute a figure and present it as advertised.",
              "Hourly, weekly and monthly rates are annualised (hourly × 2,080 hours) so they can be compared.",
              "The median is taken from the midpoint of each advertised range, which is less distorted by one unusually wide band than a mean.",
              "Currencies are not converted. A UK figure is in GBP and a Canadian figure in CAD, because converting them would imply a comparability that does not exist.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Icon
                  name="check"
                  size={15}
                  strokeWidth={1.75}
                  className="mt-[3px] shrink-0 text-brand-700"
                />
                <span className="text-[0.875rem] leading-relaxed text-gray-700">
                  {t}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* By market and level */}
      <section className="container-page py-12">
        <SectionHeading
          eyebrow="By country and level"
          title="Advertised ranges by experience level"
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {byMarketLevel.map(({ market, rows }) => (
            <div
              key={market}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div className="border-b border-gray-200 bg-gray-50 px-5 py-3.5">
                <h3 className="font-sans text-[0.9375rem] font-semibold text-ink">
                  {MARKET_NAME[market]}
                </h3>
              </div>

              {rows.length === 0 ? (
                <p className="px-5 py-6 text-[0.875rem] text-gray-600">
                  No published ranges yet.
                </p>
              ) : (
                <table className="w-full text-[0.8125rem]">
                  <thead className="sr-only">
                    <tr>
                      <th>Level</th>
                      <th>Range</th>
                      <th>Listings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr
                        key={r.level}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="px-5 py-3.5 align-top">
                          <span className="block font-medium text-ink">
                            {LEVEL_LABELS[r.level]}
                          </span>
                          <span className="mt-0.5 block text-[0.75rem] text-gray-500">
                            {r.count} listing{r.count === 1 ? "" : "s"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right align-top">
                          <span
                            className="tnum block font-semibold text-ink"
                            data-numeric
                          >
                            {fmt(r.low, r.currency)}–{fmt(r.high, r.currency)}
                          </span>
                          <span className="mt-0.5 block text-[0.75rem] text-gray-500">
                            median {fmt(r.median, r.currency)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>

        <p className="mt-5 text-[0.75rem] leading-relaxed text-gray-500">
          Internship figures are annualised from hourly or monthly rates for
          comparison only — an internship does not pay an annual salary.
        </p>
      </section>

      <div className="container-page">
        <AdSlot slot="salaries-mid" minHeight={280} />
      </div>

      {/* By field */}
      <section className="border-t border-gray-200 bg-gray-50 py-14">
        <div className="container-page">
          <SectionHeading
            eyebrow="By field"
            title="Median advertised pay by field"
            description="Ranked by the midpoint of advertised ranges. Bars are scaled to the highest-paying field in the index."
          />

          <ul className="mt-8 flex flex-col gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200">
            {byField.map((f) => (
              <li key={f.slug} className="bg-white">
                <Link
                  href={`/categories/${f.slug}`}
                  className="flex items-center gap-5 px-5 py-4 hover:bg-brand-50/50"
                >
                  <span className="w-48 shrink-0 text-[0.875rem] font-medium text-ink">
                    {f.name}
                  </span>

                  <span className="relative hidden h-2 flex-1 overflow-hidden rounded-full bg-gray-200 sm:block">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-brand-500"
                      style={{ width: `${(f.median / maxMedian) * 100}%` }}
                    />
                  </span>

                  <span className="ml-auto shrink-0 text-right sm:ml-0">
                    <span
                      className="tnum block text-[0.9375rem] font-semibold text-ink"
                      data-numeric
                    >
                      {fmt(f.median, f.currency)}
                      {f.mixed && (
                        <span className="ml-1 text-[0.6875rem] font-normal text-gray-500">
                          mixed currency
                        </span>
                      )}
                    </span>
                    <span className="block text-[0.75rem] text-gray-500">
                      {f.count} listing{f.count === 1 ? "" : "s"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-sans text-[0.9375rem] font-semibold text-ink">
                Got an offer and not sure if it is fair?
              </p>
              <p className="mt-1 text-[0.875rem] text-gray-600">
                Our guide covers how to research a defensible number and the
                exact words to use.
              </p>
            </div>
            <ButtonLink href="/guides/negotiate-first-salary-offer" size="md">
              Read the negotiation guide
              <Icon name="arrowRight" size={15} />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
