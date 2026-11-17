import Link from "next/link";
import type { Metadata } from "next";
import { companies } from "@/data/companies";
import { getJobsByCompany, IS_SAMPLE_DATA } from "@/lib/jobs";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import {
  Badge,
  Breadcrumbs,
  CompanyAvatar,
  JsonLd,
  SectionHeading,
} from "@/components/ui";
import { Icon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Employers hiring students and graduates",
  description:
    "Browse employers currently advertising internships, graduate schemes and entry-level roles in the US, UK and Canada — with headcount, industry and open-role counts.",
  path: "/companies",
});

export default function CompaniesPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Companies", path: "/companies" },
  ];

  const rows = companies
    .map((c) => ({ company: c, jobs: getJobsByCompany(c.slug) }))
    .sort((a, b) => b.jobs.length - a.jobs.length);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <section className="border-b border-gray-200 bg-brand-50">
        <div className="container-page py-9 md:py-12">
          <Breadcrumbs trail={trail} className="mb-6" />
          <h1 className="text-display-sm md:text-display-md text-balance">
            Employers hiring right now
          </h1>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-gray-700 text-pretty">
            Every employer with at least one open entry-level role. We show
            headcount and industry so you can judge whether a company is the
            size you want to start at — which matters more than most careers
            advice admits.
          </p>
          {IS_SAMPLE_DATA && (
            <Badge tone="sample" icon="shield" className="mt-5">
              Demo data — these employers are fictional
            </Badge>
          )}
        </div>
      </section>

      <section className="container-page py-12">
        <SectionHeading
          eyebrow={`${companies.length} employers`}
          title="Company directory"
        />

        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2">
          {rows.map(({ company, jobs }) => (
            <li key={company.slug} className="group relative bg-white">
              <Link
                href={`/companies/${company.slug}`}
                className="flex h-full gap-4 p-5 hover:bg-brand-50/50"
              >
                <CompanyAvatar name={company.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-sans text-[0.9375rem] font-semibold leading-snug text-ink">
                      {company.name}
                    </h2>
                    <span className="tnum shrink-0 rounded-full border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[0.75rem] font-medium text-gray-600">
                      {jobs.length}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-gray-600">
                    {company.blurb}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[0.75rem] text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="building" size={13} />
                      {company.industry}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="users" size={13} />
                      {company.size}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="location" size={13} />
                      {company.hq}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
