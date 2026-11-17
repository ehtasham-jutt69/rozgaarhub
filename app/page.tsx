import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/site.config";
import {
  getAllJobs,
  getCategoriesWithCounts,
  getPopularSearches,
  getSiteStats,
  IS_SAMPLE_DATA,
} from "@/lib/jobs";
import { getAllGuides, getFeaturedGuides } from "@/lib/guides";
import { buildMetadata } from "@/lib/seo";
import { formatSalary, timeAgo } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { ButtonLink, CompanyAvatar, SectionHeading } from "@/components/ui";
import { JobRow } from "@/components/job-card";
import { SearchBar } from "@/components/search-bar";
import { GuideCard, GuideCardLarge } from "@/components/guide-card";
import { Testimonials } from "@/components/testimonials";
import { preload } from "react-dom";

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — Graduate jobs and internships in the US, UK and Canada`,
  description: site.description,
  path: "/",
  bare: true,
});

export default function HomePage() {
  /* Preload the LCP photo. Done here rather than in the root layout so only
     "/" pays for it. preload() emits a single hoisted <link>; rendering the
     tag inline emitted a duplicate alongside React's hoisted copy. */
  preload("/images/hero-workspace.avif", {
    as: "image",
    type: "image/avif",
    fetchPriority: "high",
  });

  const stats = getSiteStats();
  const jobs = getAllJobs();
  const latest = jobs.slice(0, 6);
  const newest = jobs.slice(0, 3);
  const categories = getCategoriesWithCounts();
  const popular = getPopularSearches().slice(0, 4);
  const guides = getFeaturedGuides(4);
  const allGuides = getAllGuides();

  /* ---- Every figure below is computed from the dataset, never asserted --- */
  const salaryShare = stats.jobs
    ? Math.round((stats.withSalary / stats.jobs) * 100)
    : 0;
  const guideMinutes = allGuides.reduce((n, g) => n + g.readingMinutes, 0);
  const remoteCount = jobs.filter((j) => j.location.mode === "remote").length;
  const noDegreeCount = jobs.filter((j) => j.education === null).length;
  const fieldCount = categories.filter((c) => c.count > 0).length;

  return (
    <>
      {/* ================================================================ HERO
          Asymmetric 7/5 split. Not centred, and the primary action is the
          search field rather than a pair of buttons. */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container-page py-12 md:py-16 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* --- Copy column (7) --- */}
            <div className="lg:col-span-7">
              <p className="eyebrow flex items-center gap-2.5">
                <span className="h-px w-7 bg-brand-500" aria-hidden="true" />
                United States · United Kingdom · Canada
              </p>

              <h1 className="mt-5 text-display-lg lg:text-display-xl text-balance">
                Entry-level roles, with the
                <span className="text-brand-700"> salary on the listing</span>.
              </h1>

              <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-gray-600 text-pretty md:text-[1.125rem]">
                {stats.jobs} openings from {stats.companies} employers across{" "}
                {fieldCount} fields. {salaryShare}% show a pay range up front,{" "}
                {stats.sponsorship} state that they sponsor visas, and every one
                links straight to the employer&rsquo;s own application form.
              </p>

              <div className="mt-8 max-w-2xl">
                <SearchBar />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[0.8125rem] text-gray-500">
                  Common searches:
                </span>
                {popular.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="rounded-full border border-gray-300 bg-canvas px-3.5 py-1.5 text-[0.8125rem] text-gray-700 hover:border-brand-500 hover:text-brand-700"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* --- Image column (5), offset downward to break the baseline --- */}
            <div className="lg:col-span-5 lg:pt-10">
              <div className="relative">
                {/* Native <picture>, not next/image.
                    The LCP image is a single fixed-size asset we already
                    encoded to AVIF and JPEG at build time, so the optimizer
                    round-trip buys nothing — and next/image is a client
                    component, which would ship JS and hydration work for a
                    static photo. fetchPriority="high" gets it requested
                    early; width/height reserve the box so there is no CLS. */}
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-brand-50">
                  <picture>
                    <source
                      srcSet="/images/hero-workspace.avif"
                      type="image/avif"
                    />
                    <img
                      src="/images/hero-workspace.jpg"
                      alt="A job seeker working through applications at a desk"
                      width={740}
                      height={493}
                      fetchPriority="high"
                      decoding="async"
                      className="h-auto w-full object-cover"
                    />
                  </picture>
                </div>

                {/* Overlapping stat card — deliberately breaks the frame */}
                <div className="relative z-10 -mt-12 ml-6 w-[82%] rounded-2xl border border-gray-200 bg-white p-5 shadow-lift sm:-mt-14 sm:w-[70%]">
                  <p className="eyebrow">On the board right now</p>
                  <dl className="mt-3 grid grid-cols-3 gap-4">
                    {[
                      { label: "Roles", value: stats.jobs },
                      { label: "Internships", value: stats.internships },
                      { label: "Remote", value: remoteCount },
                    ].map((s) => (
                      <div key={s.label}>
                        <dd
                          className="tnum font-display text-[1.625rem] font-semibold leading-none text-brand-700"
                          data-numeric
                        >
                          {s.value}
                        </dd>
                        <dt className="mt-1.5 text-[0.75rem] text-gray-600">
                          {s.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {IS_SAMPLE_DATA && (
                <p className="mt-5 flex items-start gap-2 text-[0.75rem] leading-relaxed text-gray-500">
                  <Icon name="shield" size={13} className="mt-0.5 shrink-0" />
                  Demo environment — the listings behind these counts are sample
                  data with fictional employers.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== BENTO
          Uneven grid: one dominant 4×2 cell, then cells of 2, 2, 3 and 3.
          Each claim is a mechanism in the code, not a marketing adjective. */}
      <section className="container-page py-16 md:py-24">
        <SectionHeading
          align="left"
          eyebrow="How this differs"
          title="Five decisions that change what you see"
          description="Each one is a rule the site actually enforces, not a promise."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-6">
          {/* Dominant cell */}
          <article className="flex flex-col justify-between gap-8 rounded-3xl border border-brand-200 bg-brand-50 p-8 lg:col-span-4 lg:row-span-2 lg:p-10">
            <div>
              <p className="eyebrow">Pay transparency</p>
              <p
                className="tnum mt-5 font-display text-[4.5rem] font-semibold leading-none tracking-[-0.04em] text-brand-700 md:text-[5.5rem]"
                data-numeric
              >
                {salaryShare}%
              </p>
              <h3 className="mt-5 font-display text-[1.5rem] leading-tight tracking-[-0.02em] md:text-[1.75rem]">
                of listings show a pay range before you apply
              </h3>
              <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-gray-700">
                That is {stats.withSalary} of {stats.jobs} roles. Where the
                employer published a range we reproduce it; where we estimated
                one it is labelled <strong>Estimated</strong> on the card. We
                never silently fill a blank.
              </p>
            </div>
            <Link
              href="/salaries"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-500 bg-white px-5 py-2.5 text-[0.875rem] font-medium text-brand-700 hover:bg-brand-100"
            >
              See the benchmarks
              <Icon name="arrowRight" size={15} />
            </Link>
          </article>

          {/* 2-wide */}
          <article className="rounded-3xl border border-gray-200 bg-white p-7 lg:col-span-2">
            <span className="grid size-11 place-items-center rounded-2xl bg-clay-100 text-clay-700">
              <Icon name="shield" size={20} />
            </span>
            <p
              className="tnum mt-5 font-display text-[2.25rem] font-semibold leading-none text-ink"
              data-numeric
            >
              {stats.sponsorship}
            </p>
            <h3 className="mt-3 text-[1.0625rem] font-semibold">
              roles state they sponsor visas
            </h3>
            <p className="mt-2.5 text-[0.875rem] leading-relaxed text-gray-600">
              Flagged on the listing itself, and filterable, so you stop
              spending applications on roles that were never open to you.
            </p>
          </article>

          {/* 2-wide */}
          <article className="rounded-3xl border border-gray-200 bg-white p-7 lg:col-span-2">
            <span className="grid size-11 place-items-center rounded-2xl bg-brand-100 text-brand-700">
              <Icon name="coins" size={20} />
            </span>
            <p
              className="tnum mt-5 font-display text-[2.25rem] font-semibold leading-none text-ink"
              data-numeric
            >
              2,080
            </p>
            <h3 className="mt-3 text-[1.0625rem] font-semibold">
              hours — how we annualise hourly pay
            </h3>
            <p className="mt-2.5 text-[0.875rem] leading-relaxed text-gray-600">
              A $34/hour internship and a $78,000 graduate salary land on the
              same axis, so sorting by pay compares like with like.
            </p>
          </article>

          {/* 3-wide */}
          <article className="rounded-3xl border border-gray-200 bg-white p-7 lg:col-span-3">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700">
                <Icon name="cap" size={20} />
              </span>
              <div>
                <h3 className="text-[1.0625rem] font-semibold">
                  Adverts demanding 3+ years never reach the board
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-gray-600">
                  The feed adapter rejects any posting matching a
                  three-or-more-years pattern, or carrying a senior, lead,
                  principal or manager title — even when it is advertised as a
                  graduate role. {noDegreeCount} of our {stats.jobs} listings ask
                  for no degree at all.
                </p>
              </div>
            </div>
          </article>

          {/* 3-wide */}
          <article className="rounded-3xl border border-gray-200 bg-white p-7 lg:col-span-3">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-clay-100 text-clay-700">
                <Icon name="document" size={20} />
              </span>
              <div>
                <h3 className="text-[1.0625rem] font-semibold">
                  {allGuides.length} guides, {guideMinutes} minutes of reading
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-gray-600">
                  Each names the body that sets the rule — the Department of
                  Labor&rsquo;s primary beneficiary test, the National Minimum
                  Wage Act 1998, IRCC&rsquo;s PGWP criteria — and links the
                  primary source rather than a blog about it.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ========================================================= CATEGORIES */}
      <section className="border-y border-gray-200 bg-white py-16 md:py-24">
        <div className="container-page">
          <SectionHeading
            align="left"
            eyebrow="Browse by field"
            title="Where do you want to start?"
            description="Counts update with the board. Fields with nothing open are not shown."
            action={
              <ButtonLink href="/jobs" variant="secondary" size="md">
                All {stats.jobs} openings
                <Icon name="arrowRight" size={16} />
              </ButtonLink>
            }
          />

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="flex h-full flex-col justify-between gap-5 rounded-2xl border border-gray-200 bg-canvas p-5 hover:border-brand-400 hover:bg-brand-50"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[0.9375rem] font-semibold leading-snug">
                        {c.name}
                      </h3>
                      <span
                        className="tnum shrink-0 rounded-full bg-white px-2.5 py-1 text-[0.75rem] font-semibold text-brand-700"
                        data-numeric
                      >
                        {c.count}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-gray-600">
                      {c.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-700">
                    Browse
                    <Icon name="arrowRight" size={14} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================== STEPS
          Stepped, progressively indented rows — not three equal cards. */}
      <section className="container-page py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              align="left"
              eyebrow="How it works"
              title="Three steps. No account at any point."
              description="There is no sign-up wall, no CV upload and no fee — for anyone, ever."
            />
          </div>

          <ol className="lg:col-span-8">
            {[
              {
                n: "01",
                title: "Filter to what you can actually take",
                body: "Country, field, experience level, work setup and sponsorship. Every filter is a plain URL, so a filtered board is a link you can send to someone.",
              },
              {
                n: "02",
                title: "Read the whole listing before deciding",
                body: "Salary, contract type, education requirement, closing date and sponsorship status are all on the page — no form in the way.",
              },
              {
                n: "03",
                title: "Apply on the employer's own site",
                body: "The apply button leaves this site. We never receive your application, never hold a CV, and have nothing to sell to recruiters.",
              },
            ].map((s, i) => (
              <li
                key={s.n}
                className="flex gap-5 border-t border-gray-200 py-7 first:border-t-0 first:pt-0 sm:gap-8"
                style={{ paddingLeft: `${i * 2}rem` }}
              >
                <span
                  className="tnum shrink-0 font-display text-[1.75rem] font-semibold leading-none text-brand-300"
                  data-numeric
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="text-[1.125rem] font-semibold">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-gray-600">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================== LATEST */}
      <section className="border-y border-gray-200 bg-white py-16 md:py-24">
        <div className="container-page">
          <SectionHeading
            align="left"
            eyebrow="Fresh this week"
            title="Latest openings"
            description="Ordered by posting date. Nothing is promoted and no employer can pay for position."
            action={
              <ButtonLink href="/jobs" variant="secondary" size="md">
                View all {stats.jobs} roles
                <Icon name="arrowRight" size={16} />
              </ButtonLink>
            }
          />

          <div className="mt-12 overflow-hidden rounded-3xl border border-gray-200 bg-canvas">
            {latest.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= GUIDES */}
      <section className="container-page py-16 md:py-24">
        <SectionHeading
          align="left"
          eyebrow="Career guides"
          title="The parts nobody explains properly"
          description={`${allGuides.length} long-form guides on pay law, work permits, resumes and interviews — each one sourced.`}
          action={
            <ButtonLink href="/guides" variant="secondary" size="md">
              All guides
              <Icon name="arrowRight" size={16} />
            </ButtonLink>
          }
        />

        {guides.length > 0 && (
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <GuideCardLarge guide={guides[0]!} />
            </div>
            <div className="flex flex-col gap-5 lg:col-span-5">
              {guides.slice(1, 4).map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Renders only once data/testimonials.ts holds real, permissioned
          reviews. Empty today, so this outputs nothing. */}
      <Testimonials />

      {/* ============================================================= NEWEST */}
      <section className="border-t border-gray-200 bg-white py-16 md:py-24">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                align="left"
                eyebrow="Just posted"
                title="The three most recent roles"
                description="Whatever the field or country. New listings land here first."
              />
              <ButtonLink href="/jobs" size="md" className="mt-7">
                Browse everything
                <Icon name="arrowRight" size={16} />
              </ButtonLink>
            </div>

            <ul className="lg:col-span-7">
              {newest.map((job) => (
                <li
                  key={job.id}
                  className="mb-4 rounded-2xl border border-gray-200 bg-canvas last:mb-0 hover:border-brand-400"
                >
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="flex items-start gap-4 p-5"
                  >
                    <CompanyAvatar name={job.company.name} size={44} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-semibold leading-snug">
                        {job.title}
                      </span>
                      <span className="mt-1 block truncate text-[0.8125rem] text-gray-600">
                        {job.company.name} ·{" "}
                        {job.location.mode === "remote"
                          ? "Remote"
                          : job.location.city}{" "}
                        · {timeAgo(job.postedAt)}
                      </span>
                    </span>
                    {job.salary && (
                      <span className="tnum shrink-0 text-[0.875rem] font-semibold text-brand-700">
                        {formatSalary(job.salary)}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================ CTA */}
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 overflow-hidden rounded-3xl bg-brand-900 px-7 py-14 md:grid-cols-12 md:px-14 md:py-16">
          <div className="md:col-span-7">
            <h2 className="text-display-sm md:text-display-md text-balance text-white">
              Start with the roles that will actually take you.
            </h2>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-brand-100 text-pretty">
              Filter by country, experience level and sponsorship, then apply on
              the employer&rsquo;s own site. No login, no fee, no CV database —
              and {salaryShare}% of listings tell you the pay before you spend
              an evening on an application.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 md:col-span-5 md:items-end">
            <ButtonLink
              href="/jobs?level=internship"
              size="lg"
              className="w-full border-white bg-white text-brand-800 shadow-none hover:bg-brand-50 md:w-auto"
            >
              Browse {stats.internships} internships
              <Icon name="arrowRight" size={17} />
            </ButtonLink>
            <ButtonLink
              href="/guides/resume-with-no-experience"
              size="lg"
              className="w-full border-brand-700 bg-transparent text-white shadow-none hover:bg-brand-800 md:w-auto"
            >
              Fix your resume first
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
