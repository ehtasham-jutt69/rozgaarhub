import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllJobs, getJobBySlug, getRelatedJobs } from "@/lib/jobs";
import {
  EMPLOYMENT_LABELS,
  LEVEL_LABELS,
  MODE_LABELS,
  categoryBySlug,
} from "@/lib/types";
import { buildMetadata, breadcrumbSchema, jobPostingSchema } from "@/lib/seo";
import { formatDate, formatSalary, timeAgo } from "@/lib/utils";
import { Icon } from "@/components/icons";
import {
  Badge,
  Breadcrumbs,
  ButtonLink,
  CompanyAvatar,
  JsonLd,
} from "@/components/ui";
import { JobMiniRow } from "@/components/job-card";
import { AdSlot } from "@/components/ad-slot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllJobs().map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return buildMetadata({ title: "Role not found", description: "", path: "/jobs", noIndex: true });

  const where =
    job.location.mode === "remote"
      ? `Remote (${job.location.country})`
      : `${job.location.city}, ${job.location.region}`;
  const salary = formatSalary(job.salary);

  return buildMetadata({
    title: `${job.title} at ${job.company.name} — ${where}`,
    description: [
      `${job.company.name} is hiring a ${job.title} in ${where}.`,
      salary ? `Pay: ${salary}.` : null,
      job.visaSponsorship ? "Visa sponsorship available." : null,
      job.summary.slice(0, 110),
    ]
      .filter(Boolean)
      .join(" "),
    path: `/jobs/${job.slug}`,
    ogType: "article",
    publishedTime: job.postedAt,
  });
}

function DetailList({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: "check" | "cap" | "coins";
}) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="font-display text-[1.375rem] tracking-[-0.018em] text-ink">
        {title}
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <Icon
              name={icon}
              size={16}
              strokeWidth={1.75}
              className="mt-[5px] shrink-0 text-brand-700"
            />
            <span className="text-[0.9375rem] leading-relaxed text-gray-800">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  const related = getRelatedJobs(job, 5);
  const category = categoryBySlug(job.category);
  const salary = formatSalary(job.salary);

  const where =
    job.location.mode === "remote"
      ? `Remote — ${job.location.region}`
      : `${job.location.city}, ${job.location.region}`;

  const trail = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    ...(category
      ? [{ name: category.name, path: `/categories/${category.slug}` }]
      : []),
    { name: job.title, path: `/jobs/${job.slug}` },
  ];

  const facts = [
    { label: "Salary", value: salary ?? "Not disclosed", icon: "coins" as const },
    { label: "Location", value: where, icon: "location" as const },
    { label: "Work setup", value: MODE_LABELS[job.location.mode], icon: "home" as const },
    { label: "Contract", value: EMPLOYMENT_LABELS[job.employmentType], icon: "briefcase" as const },
    { label: "Level", value: LEVEL_LABELS[job.level], icon: "cap" as const },
    {
      label: "Education",
      value: job.education ?? "No degree required",
      icon: "document" as const,
    },
    {
      label: "Visa sponsorship",
      value: job.visaSponsorship ? "Available" : "Not offered",
      icon: "shield" as const,
    },
    {
      label: "Closes",
      value: formatDate(job.validThrough),
      icon: "calendar" as const,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      {/* Returns null for demo rows — see lib/seo.ts */}
      <JsonLd data={jobPostingSchema(job)} />

      {/* ============================================================= HEADER */}
      <section className="border-b border-gray-200 bg-brand-50">
        <div className="container-page py-8 md:py-10">
          <Breadcrumbs trail={trail} className="mb-6" />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4 md:gap-5">
              <CompanyAvatar
                name={job.company.name}
                size={60}
                className="hidden sm:grid"
              />
              <div className="min-w-0">
                <h1 className="text-display-sm md:text-[2.25rem] md:leading-[1.12] md:tracking-[-0.022em] text-balance">
                  {job.title}
                </h1>

                <p className="mt-2.5 text-[1rem] text-gray-700">
                  <Link
                    href={`/companies/${job.company.slug}`}
                    className="font-medium text-brand-800 underline decoration-brand-300 underline-offset-[3px] hover:decoration-brand-600"
                  >
                    {job.company.name}
                  </Link>
                  <span className="mx-2 text-gray-400">·</span>
                  <span className="text-gray-600">{job.company.industry}</span>
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.875rem] text-gray-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon
                      name={job.location.mode === "remote" ? "globe" : "location"}
                      size={15}
                      className="text-gray-500"
                    />
                    {where}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="clock" size={15} className="text-gray-500" />
                    Posted{" "}
                    <time dateTime={job.postedAt}>
                      {timeAgo(job.postedAt).toLowerCase()}
                    </time>
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-1.5">
                  <Badge tone="brand" icon="cap">
                    {LEVEL_LABELS[job.level]}
                  </Badge>
                  <Badge tone="neutral">{MODE_LABELS[job.location.mode]}</Badge>
                  <Badge tone="neutral">
                    {EMPLOYMENT_LABELS[job.employmentType]}
                  </Badge>
                  {job.visaSponsorship && (
                    <Badge tone="accent" icon="shield">
                      Visa sponsorship
                    </Badge>
                  )}
                  {job.isSample && (
                    <Badge tone="sample">Sample listing</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Apply panel */}
            <div className="w-full shrink-0 lg:w-72">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-raise">
                {salary && (
                  <>
                    <p className="eyebrow">Salary</p>
                    <p
                      className="tnum mt-1.5 font-display text-[1.625rem] font-semibold leading-none text-ink"
                      data-numeric
                    >
                      {salary}
                    </p>
                    <p className="mt-2 text-[0.75rem] text-gray-500">
                      {job.salary?.estimated
                        ? "Our estimate — not stated by the employer"
                        : "As advertised by the employer"}
                    </p>
                    <hr className="my-4 border-gray-200" />
                  </>
                )}

                <ButtonLink
                  href={job.applyUrl}
                  size="lg"
                  className="w-full"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Apply on employer site
                  <Icon name="arrowUpRight" size={16} />
                </ButtonLink>

                <p className="mt-3 text-center text-[0.75rem] leading-relaxed text-gray-500">
                  Applications are handled by {job.company.name}. We never ask
                  for a fee or hold your CV.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================================== BODY */}
      <div className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            {job.isSample && (
              <div className="mb-10 rounded-xl border border-dashed border-gray-400 bg-brand-50 p-4">
                <p className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-gray-700">
                  <Icon
                    name="shield"
                    size={16}
                    className="mt-px shrink-0 text-gray-500"
                  />
                  <span>
                    <strong className="font-semibold text-gray-800">
                      This is sample data.
                    </strong>{" "}
                    {job.company.name} is a fictional employer used to
                    demonstrate the listing layout. Structured data is
                    deliberately not emitted for sample rows, so this page
                    cannot appear in Google Jobs.
                  </span>
                </p>
              </div>
            )}

            <section>
              <h2 className="font-display text-[1.375rem] tracking-[-0.018em] text-ink">
                About the role
              </h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-gray-800 text-pretty">
                {job.summary}
              </p>
            </section>

            <div className="mt-12 flex flex-col gap-12">
              <DetailList
                title="What you'll do"
                items={job.responsibilities}
                icon="check"
              />
              <DetailList
                title="What they're looking for"
                items={job.requirements}
                icon="cap"
              />
              <DetailList
                title="Pay and benefits"
                items={job.benefits}
                icon="coins"
              />
            </div>

            {job.skills.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display text-[1.375rem] tracking-[-0.018em] text-ink">
                  Skills mentioned
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <li key={s}>
                      <Link
                        href={`/jobs?q=${encodeURIComponent(s)}`}
                        className="inline-flex rounded-full border border-gray-300 bg-white px-2.5 py-1.5 text-[0.8125rem] text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                      >
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <AdSlot slot="job-detail-inline" minHeight={280} className="mt-12" />

            {/* Apply again at the bottom */}
            <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-gray-200 bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-sans text-[0.9375rem] font-semibold text-ink">
                  Ready to apply?
                </p>
                <p className="mt-1 text-[0.875rem] text-gray-600">
                  Closes {formatDate(job.validThrough)}
                </p>
              </div>
              <ButtonLink
                href={job.applyUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                size="md"
              >
                Apply on employer site
                <Icon name="arrowUpRight" size={15} />
              </ButtonLink>
            </div>
          </div>

          {/* ============================================================ ASIDE */}
          <aside className="lg:col-span-4">
            <div className="flex flex-col gap-8 lg:sticky lg:top-24">
              {/* At a glance */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="font-sans text-[0.9375rem] font-semibold text-ink">
                  At a glance
                </h2>
                <dl className="mt-4 flex flex-col">
                  {facts.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start justify-between gap-4 border-t border-gray-200 py-2.5 first:border-t-0 first:pt-0"
                    >
                      <dt className="inline-flex items-center gap-2 text-[0.8125rem] text-gray-600">
                        <Icon
                          name={f.icon}
                          size={14}
                          className="text-gray-500"
                        />
                        {f.label}
                      </dt>
                      <dd className="max-w-[55%] text-right text-[0.8125rem] font-medium text-ink">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Company */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="font-sans text-[0.9375rem] font-semibold text-ink">
                  About {job.company.name}
                </h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-gray-700">
                  {job.company.blurb}
                </p>
                <dl className="mt-4 flex flex-col gap-2 text-[0.8125rem]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-600">Industry</dt>
                    <dd className="font-medium text-ink">
                      {job.company.industry}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-600">Headcount</dt>
                    <dd className="font-medium text-ink">
                      {job.company.size}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-600">Headquarters</dt>
                    <dd className="font-medium text-ink">
                      {job.company.hq}
                    </dd>
                  </div>
                </dl>
                <ButtonLink
                  href={`/companies/${job.company.slug}`}
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                >
                  All roles at {job.company.name}
                </ButtonLink>
              </section>

              {/* Related */}
              {related.length > 0 && (
                <section className="rounded-2xl border border-gray-200 bg-white p-5">
                  <h2 className="font-sans text-[0.9375rem] font-semibold text-ink">
                    Similar roles
                  </h2>
                  <ul className="mt-3 flex flex-col">
                    {related.map((r) => (
                      <JobMiniRow key={r.id} job={r} />
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
