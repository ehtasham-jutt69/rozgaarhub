import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { companies, companyBySlug } from "@/data/companies";
import { getJobsByCompany, IS_SAMPLE_DATA } from "@/lib/jobs";
import { absoluteUrl } from "@/site.config";
import {
  buildMetadata,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";
import { JobRow } from "@/components/job-card";
import {
  Badge,
  Breadcrumbs,
  CompanyAvatar,
  EmptyState,
  ButtonLink,
  JsonLd,
} from "@/components/ui";
import { Icon } from "@/components/icons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = companyBySlug(slug);
  if (!company) {
    return buildMetadata({
      title: "Company not found",
      description: "",
      path: "/companies",
      noIndex: true,
    });
  }

  const jobs = getJobsByCompany(slug);
  return buildMetadata({
    title: `${company.name} — internships and graduate jobs`,
    description: `${company.blurb} ${jobs.length} open entry-level role${
      jobs.length === 1 ? "" : "s"
    } at ${company.name}, based in ${company.hq}.`,
    path: `/companies/${company.slug}`,
  });
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const company = companyBySlug(slug);
  if (!company) notFound();

  const jobs = getJobsByCompany(slug);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Companies", path: "/companies" },
    { name: company.name, path: `/companies/${company.slug}` },
  ];

  const levels = [...new Set(jobs.map((j) => j.level))];
  const locations = [
    ...new Set(
      jobs.map((j) =>
        j.location.mode === "remote" ? "Remote" : j.location.city,
      ),
    ),
  ];

  /**
   * Organization markup is only emitted for real employers. Fictional demo
   * companies must not be published as entities.
   */
  const orgSchema = IS_SAMPLE_DATA
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: company.name,
        description: company.blurb,
        url: company.website || undefined,
        industry: company.industry,
        address: { "@type": "PostalAddress", addressLocality: company.hq },
        mainEntityOfPage: absoluteUrl(`/companies/${company.slug}`),
      };

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <JsonLd data={orgSchema} />
      <JsonLd data={itemListSchema(jobs)} />

      <section className="border-b border-gray-200 bg-brand-50">
        <div className="container-page py-9 md:py-12">
          <Breadcrumbs trail={trail} className="mb-6" />

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-5">
              <CompanyAvatar name={company.name} size={64} />
              <div>
                <h1 className="text-display-sm md:text-[2.25rem] md:leading-[1.12] md:tracking-[-0.022em]">
                  {company.name}
                </h1>
                <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-gray-700">
                  {company.blurb}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.875rem] text-gray-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="building" size={15} className="text-gray-500" />
                    {company.industry}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="users" size={15} className="text-gray-500" />
                    {company.size} employees
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="location" size={15} className="text-gray-500" />
                    {company.hq}
                  </span>
                </div>
                {IS_SAMPLE_DATA && (
                  <Badge tone="sample" className="mt-4">
                    Fictional employer — sample data
                  </Badge>
                )}
              </div>
            </div>

            <div className="w-full shrink-0 md:w-56">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p
                  className="tnum font-display text-[2rem] font-semibold leading-none text-ink"
                  data-numeric
                >
                  {jobs.length}
                </p>
                <p className="mt-2 text-[0.75rem] uppercase tracking-[0.07em] text-gray-500">
                  Open entry-level roles
                </p>
                {locations.length > 0 && (
                  <>
                    <hr className="my-4 border-gray-200" />
                    <p className="text-[0.75rem] uppercase tracking-[0.07em] text-gray-500">
                      Hiring in
                    </p>
                    <p className="mt-1.5 text-[0.875rem] text-ink">
                      {locations.join(", ")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="font-display text-display-sm">
          Open roles at {company.name}
        </h2>
        {levels.length > 0 && (
          <p className="mt-2.5 text-[0.9375rem] text-gray-600">
            Currently hiring at{" "}
            {levels.length === 1 ? "the" : ""}{" "}
            {levels.join(", ")} level.
          </p>
        )}

        <div className="mt-7">
          {jobs.length === 0 ? (
            <EmptyState
              title="No open roles right now"
              description={`${company.name} has no entry-level vacancies listed with us at the moment.`}
              action={
                <ButtonLink href="/jobs" variant="secondary">
                  Browse all jobs
                </ButtonLink>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
