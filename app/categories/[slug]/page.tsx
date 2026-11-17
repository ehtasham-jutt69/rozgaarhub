import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { searchJobs } from "@/lib/jobs";
import { JOB_CATEGORIES, LEVEL_LABELS, categoryBySlug } from "@/lib/types";
import {
  buildMetadata,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";
import { formatSalary } from "@/lib/utils";
import { JobRow } from "@/components/job-card";
import {
  Breadcrumbs,
  ButtonLink,
  EmptyState,
  JsonLd,
  SectionHeading,
} from "@/components/ui";
import { Icon } from "@/components/icons";
import { AdSlot } from "@/components/ad-slot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return JOB_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) {
    return buildMetadata({
      title: "Field not found",
      description: "",
      path: "/jobs",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${category.name} internships and entry-level jobs`,
    description: `Entry-level ${category.name.toLowerCase()} openings across the US, UK and Canada — internships, graduate schemes and junior roles. ${category.description}`,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();

  const result = searchJobs({ category: category.slug, perPage: 50 });

  const trail = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: category.name, path: `/categories/${category.slug}` },
  ];

  // Pay range across this field, derived from actual listings.
  const withSalary = result.jobs.filter((j) => j.salary);
  const byLevel = (["internship", "graduate", "entry", "junior"] as const)
    .map((level) => ({
      level,
      count: result.jobs.filter((j) => j.level === level).length,
    }))
    .filter((x) => x.count > 0);

  const topSkills = [...new Set(result.jobs.flatMap((j) => j.skills))].slice(
    0,
    12,
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <JsonLd data={itemListSchema(result.jobs)} />

      <section className="border-b border-gray-200 bg-brand-50">
        <div className="container-page py-9 md:py-12">
          <Breadcrumbs trail={trail} className="mb-6" />

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h1 className="text-display-sm md:text-display-md text-balance">
                {category.name} jobs for students and graduates
              </h1>
              <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-gray-700 text-pretty">
                {category.description} Everything here is pitched at the
                internship, graduate or junior level — no listings that quietly
                want five years of experience.
              </p>

              {byLevel.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {byLevel.map((b) => (
                    <li key={b.level}>
                      <Link
                        href={`/jobs?category=${category.slug}&level=${b.level}`}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-2.5 py-1.5 text-[0.8125rem] text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                      >
                        {LEVEL_LABELS[b.level]}
                        <span className="tnum text-gray-500">{b.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="eyebrow">Advertised pay in this field</h2>
                {withSalary.length > 0 ? (
                  <ul className="mt-3.5 flex flex-col">
                    {withSalary.slice(0, 5).map((j) => (
                      <li
                        key={j.id}
                        className="flex items-baseline justify-between gap-4 border-t border-gray-200 py-2.5 first:border-t-0 first:pt-0"
                      >
                        <span className="min-w-0 truncate text-[0.8125rem] text-gray-700">
                          {j.title}
                        </span>
                        <span className="tnum shrink-0 text-[0.8125rem] font-semibold text-brand-800">
                          {formatSalary(j.salary)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-[0.8125rem] text-gray-600">
                    No employer in this field is currently advertising a pay
                    range.
                  </p>
                )}
                <ButtonLink
                  href="/salaries"
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                >
                  See salary benchmarks
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <SectionHeading
          eyebrow={`${result.total} open`}
          title={`${category.name} openings`}
        />

        <div className="mt-8">
          {result.jobs.length === 0 ? (
            <EmptyState
              title="Nothing open in this field right now"
              description="New roles are added continuously. Try a neighbouring field in the meantime."
              action={
                <ButtonLink href="/jobs" variant="secondary">
                  Browse all jobs
                </ButtonLink>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
              {result.jobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>

        {topSkills.length > 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-sans text-[1rem] font-semibold text-ink">
              Skills employers are asking for
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {topSkills.map((s) => (
                <li key={s}>
                  <Link
                    href={`/jobs?q=${encodeURIComponent(s)}`}
                    className="inline-flex rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-[0.8125rem] text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <AdSlot slot="category-footer" minHeight={280} />

        {/* Sibling fields */}
        <nav className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-sans text-[1rem] font-semibold text-ink">
            Other fields
          </h2>
          <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {JOB_CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
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
        </nav>
      </section>
    </>
  );
}
