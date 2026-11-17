import type { Metadata } from "next";
import { getAllGuides, getGuideCategories } from "@/lib/guides";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { GuideCardLarge, GuideRow } from "@/components/guide-card";
import {
  Breadcrumbs,
  ButtonLink,
  JsonLd,
  SectionHeading,
} from "@/components/ui";
import { Icon } from "@/components/icons";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = buildMetadata({
  title: "Career guides for students and graduates",
  description:
    "Researched, practical guides on resumes, interviews, internship pay law, work authorisation and first-salary negotiation for the US, UK and Canada.",
  path: "/guides",
});

export default function GuidesIndexPage() {
  const guides = getAllGuides();
  const categories = getGuideCategories();
  const [lead, ...rest] = guides;

  const trail = [
    { name: "Home", path: "/" },
    { name: "Career guides", path: "/guides" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <section className="relative overflow-hidden border-b border-gray-200">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="container-page relative py-10 md:py-14">
          <Breadcrumbs trail={trail} className="mb-6" />
          <div className="max-w-3xl">
            <p className="eyebrow flex items-center gap-2">
              <span className="h-px w-6 bg-accent-400" aria-hidden="true" />
              Career guides
            </p>
            <h1 className="mt-4 text-display-md lg:text-display-lg text-balance">
              Straight answers about getting hired.
            </h1>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-gray-700 text-pretty md:text-[1.125rem]">
              Each guide takes one question that genuinely confuses people and
              answers it properly — with the rules, the exceptions and what to
              actually do. No listicles, no padding to hit a word count.
            </p>
          </div>

          {categories.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li
                  key={c.name}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-2.5 py-1.5 text-[0.8125rem] text-gray-700"
                >
                  {c.name}
                  <span className="tnum text-gray-500">{c.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {guides.length === 0 ? (
        <div className="container-page py-20">
          <p className="text-gray-600">No guides published yet.</p>
        </div>
      ) : (
        <>
          {lead && (
            <section className="container-page py-12">
              <SectionHeading eyebrow="Start here" title="Most useful right now" />
              <div className="mt-8">
                <GuideCardLarge guide={lead} />
              </div>
            </section>
          )}

          <section className="container-page pb-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                <h2 className="eyebrow border-b border-gray-200 pb-3">
                  All guides
                </h2>
                <div>
                  {rest.map((g) => (
                    <GuideRow key={g.slug} guide={g} />
                  ))}
                </div>
              </div>

              <aside className="lg:col-span-4">
                <div className="flex flex-col gap-8 lg:sticky lg:top-24">
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <h2 className="font-sans text-[0.9375rem] font-semibold text-ink">
                      How we write these
                    </h2>
                    <ul className="mt-4 flex flex-col gap-3">
                      {[
                        "One question per guide, answered in full.",
                        "Rules stated with the body that sets them, not vague claims.",
                        "Updated when the rules change, with the date shown.",
                        "No affiliate links inside the advice.",
                      ].map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <Icon
                            name="check"
                            size={15}
                            strokeWidth={1.75}
                            className="mt-[3px] shrink-0 text-brand-700"
                          />
                          <span className="text-[0.8125rem] leading-relaxed text-gray-700">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <ButtonLink
                      href="/editorial-policy"
                      variant="secondary"
                      size="sm"
                      className="mt-5 w-full"
                    >
                      Editorial standards
                    </ButtonLink>
                  </div>

                  <AdSlot slot="guides-sidebar" minHeight={600} />
                </div>
              </aside>
            </div>
          </section>
        </>
      )}
    </>
  );
}
