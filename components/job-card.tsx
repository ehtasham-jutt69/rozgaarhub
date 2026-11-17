import Link from "next/link";
import { cn, formatSalary, timeAgo } from "@/lib/utils";
import {
  EMPLOYMENT_LABELS,
  LEVEL_LABELS,
  MODE_LABELS,
  type JobWithCompany,
} from "@/lib/types";
import { Badge, CompanyAvatar, MetaItem } from "@/components/ui";
import { Icon } from "@/components/icons";

/* -------------------------------------------------------------------------- */
/*  Full row — used on /jobs, /internships, company pages                      */
/* -------------------------------------------------------------------------- */

export function JobRow({ job }: { job: JobWithCompany }) {
  const salary = formatSalary(job.salary);
  const locationText =
    job.location.mode === "remote"
      ? `Remote — ${job.location.region}`
      : `${job.location.city}, ${job.location.region}`;

  return (
    <article className="group relative border-b border-gray-200 last:border-b-0 hover:bg-brand-50/60">
      <div className="flex gap-4 px-4 py-5 sm:px-5">
        <CompanyAvatar name={job.company.name} size={44} className="mt-0.5" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <div className="min-w-0">
              <h3 className="font-sans text-[1rem] font-semibold leading-snug tracking-[-0.011em] text-ink">
                <Link
                  href={`/jobs/${job.slug}`}
                  className="decoration-brand-300 decoration-1 underline-offset-[3px] group-hover:underline"
                >
                  {/* Stretch the hit area across the row */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  {job.title}
                </Link>
              </h3>
              <p className="mt-1 text-[0.875rem] text-gray-700">
                {job.company.name}
                <span className="mx-1.5 text-gray-400">·</span>
                <span className="text-gray-600">{job.company.industry}</span>
              </p>
            </div>

            {salary && (
              <div className="shrink-0 text-right">
                <p
                  className="tnum text-[0.9375rem] font-semibold text-ink"
                  data-numeric
                >
                  {salary}
                </p>
                <p className="mt-0.5 text-[0.6875rem] uppercase tracking-[0.07em] text-gray-500">
                  {job.salary?.estimated ? "Estimated" : "Advertised"}
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <MetaItem icon={job.location.mode === "remote" ? "globe" : "location"}>
              {locationText}
            </MetaItem>
            <MetaItem icon="briefcase">
              {EMPLOYMENT_LABELS[job.employmentType]}
            </MetaItem>
            <MetaItem icon="clock">
              <time dateTime={job.postedAt}>{timeAgo(job.postedAt)}</time>
            </MetaItem>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            <Badge tone="brand" icon="cap">
              {LEVEL_LABELS[job.level]}
            </Badge>
            <Badge tone="neutral">{MODE_LABELS[job.location.mode]}</Badge>
            {job.visaSponsorship && (
              <Badge tone="accent" icon="shield">
                Visa sponsorship
              </Badge>
            )}
            {job.isSample && (
              <Badge tone="sample" className="relative z-10">
                Sample listing
              </Badge>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Compact card — homepage grid and related-jobs sidebars                     */
/* -------------------------------------------------------------------------- */

export function JobCardCompact({
  job,
  className,
}: {
  job: JobWithCompany;
  className?: string;
}) {
  const salary = formatSalary(job.salary);

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-hairline",
        " hover:border-gray-300 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <CompanyAvatar name={job.company.name} size={36} />
        <div className="min-w-0 flex-1">
          <h3 className="text-[0.9375rem] font-semibold leading-snug tracking-[-0.011em] text-ink">
            <Link href={`/jobs/${job.slug}`}>
              <span className="absolute inset-0" aria-hidden="true" />
              {job.title}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-[0.8125rem] text-gray-600">
            {job.company.name}
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
        <MetaItem icon={job.location.mode === "remote" ? "globe" : "location"}>
          {job.location.mode === "remote" ? "Remote" : job.location.city}
        </MetaItem>
        {salary && (
          <span className="tnum text-[0.8125rem] font-semibold text-brand-800">
            {salary}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <Badge tone="brand">{LEVEL_LABELS[job.level]}</Badge>
        <span className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-gray-500 group-hover:text-brand-700">
          View role
          <Icon
            name="arrowRight"
            size={13}
            className=" group-"
          />
        </span>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Minimal link list — footer of job detail pages                             */
/* -------------------------------------------------------------------------- */

export function JobMiniRow({ job }: { job: JobWithCompany }) {
  const salary = formatSalary(job.salary);
  return (
    <li className="group relative border-b border-gray-200 py-3 last:border-b-0">
      <Link href={`/jobs/${job.slug}`} className="flex items-start gap-3">
        <CompanyAvatar name={job.company.name} size={30} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.875rem] font-medium text-ink decoration-brand-300 underline-offset-[3px] group-hover:underline">
            {job.title}
          </span>
          <span className="mt-0.5 block truncate text-[0.75rem] text-gray-600">
            {job.company.name}
            {salary ? ` · ${salary}` : ""}
          </span>
        </span>
      </Link>
    </li>
  );
}
