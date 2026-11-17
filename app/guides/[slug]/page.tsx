import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllGuides, getGuide, getRelatedGuides } from "@/lib/guides";
import { getAllJobs } from "@/lib/jobs";
import { buildMetadata, breadcrumbSchema, articleSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { GuideCard } from "@/components/guide-card";
import { JobMiniRow } from "@/components/job-card";
import {
  Breadcrumbs,
  ButtonLink,
  JsonLd,
  SectionHeading,
} from "@/components/ui";
import { Icon } from "@/components/icons";
import { AdSlot } from "@/components/ad-slot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    return buildMetadata({
      title: "Guide not found",
      description: "",
      path: "/guides",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    ogType: "article",
    publishedTime: guide.publishedAt,
    modifiedTime: guide.updatedAt ?? guide.publishedAt,
    authors: [guide.author],
  });
}

const MARKET_LABEL: Record<string, string> = {
  us: "United States",
  uk: "United Kingdom",
  ca: "Canada",
};

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide, 3);
  const jobs = getAllJobs().slice(0, 5);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Career guides", path: "/guides" },
    { name: guide.shortTitle ?? guide.title, path: `/guides/${guide.slug}` },
  ];

  const toc = guide.headings.filter((h) => h.level === 2);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <JsonLd data={articleSchema(guide)} />

      {/* ============================================================= HEADER */}
      <article>
        <header className="border-b border-gray-200 bg-brand-50">
          <div className="container-page py-9 md:py-12">
            <Breadcrumbs trail={trail} className="mb-6" />

            <div className="max-w-3xl">
              <p className="eyebrow text-brand-700">{guide.category}</p>
              <h1 className="mt-3.5 font-display text-display-md lg:text-display-lg text-balance">
                {guide.title}
              </h1>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-gray-200 pt-5 text-[0.8125rem] text-gray-600">
                <span>
                  By{" "}
                  <span className="font-medium text-gray-800">
                    {guide.author}
                  </span>
                  , {guide.authorRole}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="calendar" size={14} className="text-gray-500" />
                  <time dateTime={guide.updatedAt ?? guide.publishedAt}>
                    {guide.updatedAt
                      ? `Updated ${formatDate(guide.updatedAt)}`
                      : formatDate(guide.publishedAt)}
                  </time>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="clock" size={14} className="text-gray-500" />
                  {guide.readingMinutes} min read
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="globe" size={14} className="text-gray-500" />
                  Applies to{" "}
                  {guide.markets.map((m) => MARKET_LABEL[m] ?? m).join(", ")}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* =============================================================== BODY */}
        <div className="container-page py-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Table of contents */}
            {toc.length > 2 && (
              <aside className="lg:col-span-3 lg:order-2">
                <div className="lg:sticky lg:top-24">
                  <nav aria-label="On this page">
                    <h2 className="eyebrow mb-3">On this page</h2>
                    <ul className="flex flex-col gap-0.5 border-l border-gray-200">
                      {toc.map((h) => (
                        <li key={h.id}>
                          <a
                            href={`#${h.id}`}
                            className="-ml-px block border-l border-transparent py-1.5 pl-3.5 text-[0.8125rem] leading-snug text-gray-600 hover:border-brand-500 hover:text-brand-800"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <AdSlot slot="guide-sidebar" minHeight={600} className="mt-8" />
                </div>
              </aside>
            )}

            {/* Article */}
            <div
              className={toc.length > 2 ? "lg:col-span-9 lg:order-1" : "lg:col-span-9"}
            >
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: guide.html }}
              />

              {/* Disclaimer */}
              <div className="mt-12 rounded-2xl border border-gray-200 bg-brand-50 p-5">
                <p className="flex gap-3 text-[0.8125rem] leading-relaxed text-gray-700">
                  <Icon
                    name="shield"
                    size={17}
                    className="mt-px shrink-0 text-gray-500"
                  />
                  <span>
                    This guide is general information, not legal, tax or
                    immigration advice. Employment and visa rules change and
                    depend on your individual circumstances. Check the official
                    source we cite, or speak to your university careers service
                    or a qualified adviser, before you act on anything here.
                  </span>
                </p>
              </div>

              <AdSlot slot="guide-footer" minHeight={280} />

              {/* Next steps — ties editorial back to inventory */}
              <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="font-display text-[1.375rem] tracking-[-0.018em] text-ink">
                  Put this into practice
                </h2>
                <p className="mt-2 text-[0.9375rem] text-gray-600">
                  Roles open now where this advice applies directly.
                </p>
                <ul className="mt-4 flex flex-col">
                  {jobs.map((j) => (
                    <JobMiniRow key={j.id} job={j} />
                  ))}
                </ul>
                <ButtonLink
                  href="/jobs"
                  variant="secondary"
                  size="sm"
                  className="mt-5"
                >
                  Browse all openings
                  <Icon name="arrowRight" size={14} />
                </ButtonLink>
              </section>
            </div>
          </div>
        </div>
      </article>

      {/* ============================================================ RELATED */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 py-16">
          <div className="container-page">
            <SectionHeading
              eyebrow="Keep reading"
              title="Related guides"
              action={
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-700 underline decoration-brand-300 underline-offset-[3px]"
                >
                  All guides
                  <Icon name="arrowRight" size={14} />
                </Link>
              }
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
