import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import type { Guide } from "@/lib/types";
import { Icon } from "@/components/icons";

const MARKET_LABEL: Record<string, string> = {
  us: "US",
  uk: "UK",
  ca: "CA",
};

function MarketChips({ markets }: { markets: readonly string[] }) {
  return (
    <span className="flex gap-1">
      {markets.map((m) => (
        <span
          key={m}
          className="rounded-[3px] border border-gray-300 bg-gray-50 px-1.5 py-px text-[0.625rem] font-semibold tracking-[0.06em] text-gray-600"
        >
          {MARKET_LABEL[m] ?? m.toUpperCase()}
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Large — lead story treatment                                               */
/* -------------------------------------------------------------------------- */

export function GuideCardLarge({ guide }: { guide: Guide }) {
  return (
    <article className="group relative flex h-full flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-hairline hover:shadow-lift md:p-8">
      <div>
        <div className="flex items-center gap-3">
          <span className="eyebrow text-brand-700">{guide.category}</span>
          <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
          <MarketChips markets={guide.markets} />
        </div>

        <h3 className="mt-5 font-display text-[1.75rem] leading-[1.15] tracking-[-0.022em] text-ink text-balance md:text-[2rem]">
          <Link href={`/guides/${guide.slug}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {guide.title}
          </Link>
        </h3>

        <p className="mt-4 text-[1rem] leading-relaxed text-gray-700 text-pretty">
          {guide.description}
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-200 pt-5 text-[0.8125rem] text-gray-600">
        <span className="font-medium text-gray-700">{guide.author}</span>
        <span className="text-gray-400" aria-hidden="true">
          ·
        </span>
        <time dateTime={guide.updatedAt ?? guide.publishedAt}>
          {guide.updatedAt
            ? `Updated ${formatDate(guide.updatedAt)}`
            : formatDate(guide.publishedAt)}
        </time>
        <span className="text-gray-400" aria-hidden="true">
          ·
        </span>
        <span>{guide.readingMinutes} min read</span>
        <span className="ml-auto inline-flex items-center gap-1 font-medium text-brand-700">
          Read guide
          <Icon
            name="arrowRight"
            size={14}
            className=" group-"
          />
        </span>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Standard                                                                   */
/* -------------------------------------------------------------------------- */

export function GuideCard({
  guide,
  className,
}: {
  guide: Guide;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-hairline hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-brand-700">{guide.category}</span>
        <MarketChips markets={guide.markets} />
      </div>

      <h3 className="mt-3 font-sans text-[1rem] font-semibold leading-snug tracking-[-0.013em] text-ink">
        <Link href={`/guides/${guide.slug}`}>
          <span className="absolute inset-0" aria-hidden="true" />
          {guide.shortTitle ?? guide.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 text-[0.875rem] leading-relaxed text-gray-600">
        {guide.description}
      </p>

      <p className="mt-3.5 flex items-center gap-2 text-[0.75rem] text-gray-500">
        <Icon name="clock" size={13} />
        {guide.readingMinutes} min read
      </p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Row — index pages                                                          */
/* -------------------------------------------------------------------------- */

export function GuideRow({ guide }: { guide: Guide }) {
  return (
    <article className="group relative border-b border-gray-200 py-6 last:border-b-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-8">
        <div className="shrink-0 sm:w-40">
          <p className="eyebrow text-brand-700">{guide.category}</p>
          <p className="mt-1.5 text-[0.75rem] text-gray-500">
            <time dateTime={guide.updatedAt ?? guide.publishedAt}>
              {formatDate(guide.updatedAt ?? guide.publishedAt)}
            </time>
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[1.375rem] leading-tight tracking-[-0.018em] text-ink text-balance">
            <Link
              href={`/guides/${guide.slug}`}
              className="decoration-brand-300 decoration-1 underline-offset-[4px] group-hover:underline"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {guide.title}
            </Link>
          </h3>
          <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-gray-600 text-pretty">
            {guide.description}
          </p>
          <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.75rem] text-gray-500">
            <span>{guide.author}</span>
            <span className="text-gray-400" aria-hidden="true">
              ·
            </span>
            <span>{guide.readingMinutes} min read</span>
            <MarketChips markets={guide.markets} />
          </div>
        </div>
      </div>
    </article>
  );
}
