import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";
import type { Facet, JobSearchResult } from "@/lib/jobs";

export interface ActiveParams {
  q?: string;
  market?: string;
  category?: string;
  level?: string;
  mode?: string;
  sponsorship?: string;
  sort?: string;
}

/** Build a /jobs URL with one key toggled, dropping pagination. */
function buildHref(current: ActiveParams, key: keyof ActiveParams, value: string) {
  const next: Record<string, string> = {};
  for (const [k, v] of Object.entries(current)) {
    if (v && k !== "page") next[k] = v;
  }
  if (next[key] === value) delete next[key];
  else next[key] = value;

  const qs = new URLSearchParams(next).toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}

function FilterGroup({
  title,
  paramKey,
  facets,
  current,
}: {
  title: string;
  paramKey: keyof ActiveParams;
  facets: Facet[];
  current: ActiveParams;
}) {
  if (!facets.length) return null;

  return (
    <fieldset className="border-t border-gray-200 pt-5 first:border-t-0 first:pt-0">
      <legend className="eyebrow mb-3">{title}</legend>
      <ul className="flex flex-col gap-0.5">
        {facets.map((f) => {
          const active = current[paramKey] === f.value;
          return (
            <li key={f.value}>
              <Link
                href={buildHref(current, paramKey, f.value)}
                scroll={false}
                aria-pressed={active}
                className={cn(
                  "group flex items-center justify-between gap-2 rounded-full px-2 py-[7px] text-[0.875rem]",
                  active
                    ? "bg-brand-50 font-medium text-ink"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "grid size-[15px] shrink-0 place-items-center rounded-[3px] border",
                      active
                        ? "border-brand-700 bg-brand-700 text-white"
                        : "border-gray-300 bg-white group-hover:border-gray-400",
                    )}
                    aria-hidden="true"
                  >
                    {active && <Icon name="check" size={10} strokeWidth={3} />}
                  </span>
                  <span className="truncate">{f.label}</span>
                </span>
                <span className="tnum shrink-0 text-[0.75rem] text-gray-500">
                  {f.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export function JobFilters({
  facets,
  current,
}: {
  facets: JobSearchResult["facets"];
  current: ActiveParams;
}) {
  const hasFilters = Boolean(
    current.market ||
      current.category ||
      current.level ||
      current.mode ||
      current.sponsorship,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans text-[0.9375rem] font-semibold text-ink">
          <Icon name="sliders" size={16} className="text-gray-500" />
          Filters
        </h2>
        {hasFilters && (
          <Link
            href={current.q ? `/jobs?q=${encodeURIComponent(current.q)}` : "/jobs"}
            className="text-[0.8125rem] text-gray-600 underline decoration-gray-300 underline-offset-[3px] hover:text-brand-800"
          >
            Clear all
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-hairline">
        <FilterGroup
          title="Country"
          paramKey="market"
          facets={facets.markets}
          current={current}
        />
        <FilterGroup
          title="Experience level"
          paramKey="level"
          facets={facets.levels}
          current={current}
        />
        <FilterGroup
          title="Work setup"
          paramKey="mode"
          facets={facets.modes}
          current={current}
        />
        <FilterGroup
          title="Field"
          paramKey="category"
          facets={facets.categories}
          current={current}
        />

        {/* Sponsorship toggle */}
        <fieldset className="border-t border-gray-200 pt-5">
          <legend className="eyebrow mb-3">Work authorisation</legend>
          <Link
            href={buildHref(current, "sponsorship", "true")}
            scroll={false}
            aria-pressed={current.sponsorship === "true"}
            className={cn(
              "group flex items-center gap-2 rounded-full px-2 py-[7px] text-[0.875rem]",
              current.sponsorship === "true"
                ? "bg-accent-50 font-medium text-accent-800"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <span
              className={cn(
                "grid size-[15px] shrink-0 place-items-center rounded-[3px] border",
                current.sponsorship === "true"
                  ? "border-accent-600 bg-accent-500 text-white"
                  : "border-gray-300 bg-white group-hover:border-gray-400",
              )}
              aria-hidden="true"
            >
              {current.sponsorship === "true" && (
                <Icon name="check" size={10} strokeWidth={3} />
              )}
            </span>
            Offers visa sponsorship
          </Link>
        </fieldset>
      </div>
    </div>
  );
}

/** Sort control rendered as links so it works without JavaScript. */
export function SortControl({ current }: { current: ActiveParams }) {
  const options = [
    { value: "recent", label: "Most recent" },
    { value: "salary", label: "Highest salary" },
  ];
  const active = current.sort ?? "recent";

  return (
    <div className="flex items-center gap-1 rounded-full border border-gray-300 bg-white p-0.5">
      {options.map((o) => (
        <Link
          key={o.value}
          href={buildHref({ ...current, sort: undefined }, "sort", o.value)}
          scroll={false}
          className={cn(
            "rounded-[3px] px-2.5 py-1.5 text-[0.8125rem] font-medium",
            active === o.value
              ? "bg-brand-800 text-gray-50"
              : "text-gray-600 hover:text-brand-800",
          )}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}
