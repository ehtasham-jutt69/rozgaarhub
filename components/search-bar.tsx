import { site } from "@/site.config";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";

/**
 * Server component. A plain GET form — no "use client", no router, no state.
 *
 * The browser builds `/jobs?q=…&market=…` natively on submit, so search works
 * with JavaScript disabled, costs zero bytes of client JS, and is crawlable.
 * (`/jobs` normalises unknown or empty market values back to "all".)
 */
export function SearchBar({
  defaultQuery = "",
  defaultMarket = "all",
  size = "lg",
  className,
}: {
  defaultQuery?: string;
  defaultMarket?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const tall = size === "lg";

  return (
    <form
      action="/jobs"
      method="get"
      role="search"
      className={cn(
        "flex flex-col gap-2 rounded-3xl border border-gray-200 bg-white p-2 shadow-raise",
        "sm:flex-row sm:items-center sm:gap-0 sm:p-1.5",
        className,
      )}
    >
      {/* Keyword */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5 px-2.5">
        <Icon name="search" size={18} className="text-gray-500" />
        <label htmlFor="job-search-q" className="sr-only">
          Job title, skill or company
        </label>
        <input
          id="job-search-q"
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="Job title, skill or company"
          autoComplete="off"
          className={cn(
            "w-full min-w-0 bg-transparent text-[0.9375rem] text-ink outline-none",
            "placeholder:text-gray-500",
            tall ? "h-12" : "h-10",
          )}
        />
      </div>

      <span
        className="hidden h-7 w-px shrink-0 bg-gray-200 sm:block"
        aria-hidden="true"
      />

      {/* Market */}
      <div className="flex shrink-0 items-center gap-2.5 px-2.5">
        <Icon name="location" size={18} className="text-gray-500" />
        <label htmlFor="job-search-market" className="sr-only">
          Country
        </label>
        <select
          id="job-search-market"
          name="market"
          defaultValue={defaultMarket}
          className={cn(
            "w-full cursor-pointer appearance-none bg-transparent pr-5 text-[0.9375rem] text-ink outline-none",
            tall ? "h-12" : "h-10",
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237c856d' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
          }}
        >
          <option value="all">All countries</option>
          {site.markets.map((m) => (
            <option key={m.code} value={m.code}>
              {m.country}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className={cn(
          "shrink-0 rounded-full bg-brand-700 px-7 font-medium text-white shadow-green hover:bg-brand-800",
          tall ? "h-12 text-[0.9375rem]" : "h-10 text-sm",
        )}
      >
        Search jobs
      </button>
    </form>
  );
}
