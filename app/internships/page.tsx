import Link from "next/link";
import type { Metadata } from "next";
import { searchJobs, getSiteStats } from "@/lib/jobs";
import { JOB_CATEGORIES } from "@/lib/types";
import {
  buildMetadata,
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
} from "@/lib/seo";
import { JobRow } from "@/components/job-card";
import {
  Breadcrumbs,
  ButtonLink,
  JsonLd,
  SectionHeading,
} from "@/components/ui";
import { Icon } from "@/components/icons";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = buildMetadata({
  title: "Paid internships and placements in the US, UK and Canada",
  description:
    "Browse paid internships, summer analyst programmes, co-op terms and placement years with the pay rate shown up front. Filter by field, country and work setup.",
  path: "/internships",
});

const FAQS = [
  {
    q: "Should an internship be paid?",
    a: "In the United States, the Department of Labor applies a 'primary beneficiary' test under the Fair Labor Standards Act to decide whether an intern at a for-profit company is really an employee who must be paid at least minimum wage. The test weighs factors such as whether the internship is tied to formal coursework, whether academic credit is given, and whether the intern displaces paid staff. In the UK, anyone classed as a 'worker' is entitled to the National Minimum Wage, and calling the role an internship does not change that. Unpaid internships are more defensible for registered charities and genuine work-shadowing of a week or two. If a for-profit company expects a full-time schedule over several months for free, treat that as a red flag.",
  },
  {
    q: "When do internship applications open?",
    a: "It varies sharply by sector. Investment banking, consulting and large technology employers in the US typically open summer internship applications 9 to 12 months ahead — often in the autumn of the preceding year, with some closing before Christmas. Engineering, healthcare and public-sector roles usually run on a shorter cycle of 3 to 6 months. Smaller companies and startups frequently recruit only 4 to 8 weeks out. If you are targeting a competitive sector, work backwards from the previous year's deadline rather than assuming spring is soon enough.",
  },
  {
    q: "Do internships count as experience on a resume?",
    a: "Yes, and for a first full-time application they are usually the strongest evidence you have. What matters is how you describe them: name the system or process you touched, the action you took, and the measurable result. 'Rebuilt the weekly channel report in SQL, cutting preparation time from four hours to twenty minutes' carries far more weight than 'assisted the marketing team'. A short internship described specifically beats a long one described vaguely.",
  },
  {
    q: "Can international students do internships?",
    a: "Usually yes, but the authorisation route matters and the rules are specific. In the US, F-1 students generally use CPT for an internship that is integral to their course, or pre-completion OPT, and both need processing time before the start date. In the UK, Student-route visa holders can normally work up to 20 hours a week during term and full time in vacations, subject to the conditions on their visa. In Canada, study-permit holders meeting the eligibility conditions may work off campus, and co-op terms generally require a separate co-op work permit. Always confirm your own position with your institution's international office before accepting an offer — this page is general information, not immigration advice.",
  },
];

export default function InternshipsPage() {
  const result = searchJobs({ level: "internship", perPage: 40 });
  const stats = getSiteStats();

  const trail = [
    { name: "Home", path: "/" },
    { name: "Internships", path: "/internships" },
  ];

  const paid = result.jobs.filter((j) => j.salary).length;
  const paidShare = result.total ? Math.round((paid / result.total) * 100) : 0;

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd data={itemListSchema(result.jobs)} />

      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-gray-200">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="container-page relative py-10 md:py-14">
          <Breadcrumbs trail={trail} className="mb-6" />

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow flex items-center gap-2">
                <span className="h-px w-6 bg-accent-400" aria-hidden="true" />
                Internships &amp; placements
              </p>
              <h1 className="mt-4 text-display-md lg:text-display-lg text-balance">
                Paid internships, with the rate shown first.
              </h1>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-gray-700 text-pretty">
                Summer internships, co-op terms, placement years and graduate
                programmes across the US, UK and Canada. We list the pay rate
                where the employer states it, and we say so plainly when they
                don&rsquo;t.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <ButtonLink href="/jobs?level=internship&mode=remote" variant="secondary" size="md">
                  Remote internships
                </ButtonLink>
                <ButtonLink href="/jobs?level=internship&sponsorship=true" variant="secondary" size="md">
                  Visa sponsorship
                </ButtonLink>
                <ButtonLink href="/jobs?level=graduate" variant="secondary" size="md">
                  Graduate schemes
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-5">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200">
                {[
                  { label: "Internships listed", value: result.total },
                  { label: "Show pay rate", value: `${paidShare}%` },
                  { label: "Employers", value: stats.companies },
                  { label: "Countries", value: stats.markets },
                ].map((s) => (
                  <div key={s.label} className="bg-white px-5 py-5">
                    <dd
                      className="tnum font-display text-[1.75rem] font-semibold leading-none text-ink"
                      data-numeric
                    >
                      {s.value}
                    </dd>
                    <dt className="mt-2 text-[0.75rem] uppercase tracking-[0.07em] text-gray-500">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="container-page py-12">
        <SectionHeading
          eyebrow="Open now"
          title="Current internship openings"
          description="Sorted by posting date. Click through to apply on the employer's own site."
          action={
            <ButtonLink href="/jobs?level=internship" variant="secondary" size="md">
              Open in search
              <Icon name="arrowRight" size={15} />
            </ButtonLink>
          }
        />

        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white">
          {result.jobs.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </div>

        {/* Field links */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-sans text-[1rem] font-semibold text-ink">
            Internships by field
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {JOB_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/jobs?level=internship&category=${c.slug}`}
                  className="inline-flex rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-[0.8125rem] text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container-page">
        <AdSlot slot="internships-mid" minHeight={280} />
      </div>

      {/* FAQ — real editorial substance, eligible for FAQ rich results */}
      <section className="border-t border-gray-200 bg-gray-50 py-16">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow="Before you apply"
                title="Internship questions, answered properly"
                description="Short answers to the things students ask us most. Longer treatments live in our career guides."
              />
              <ButtonLink
                href="/guides"
                variant="secondary"
                size="md"
                className="mt-6"
              >
                Read the guides
                <Icon name="arrowRight" size={15} />
              </ButtonLink>
            </div>

            <div className="lg:col-span-8">
              {/* Always expanded: no accordion, no sliding. Every answer is
                  visible on load, which is also better for indexing. */}
              <div className="flex flex-col gap-4">
                {FAQS.map((f) => (
                  <div
                    key={f.q}
                    className="rounded-3xl border border-gray-200 bg-white p-6 md:p-7"
                  >
                    <h3 className="flex items-start gap-3 text-[1.0625rem] font-semibold text-ink">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                        <Icon name="check" size={13} strokeWidth={2.5} />
                      </span>
                      {f.q}
                    </h3>
                    <p className="mt-3 pl-9 text-[0.9375rem] leading-relaxed text-gray-700">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-5 flex gap-2.5 text-[0.75rem] leading-relaxed text-gray-500">
                <Icon name="shield" size={14} className="mt-px shrink-0" />
                General information only. Employment and immigration rules
                change and depend on your circumstances — check with your
                university careers service or a qualified adviser before acting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
