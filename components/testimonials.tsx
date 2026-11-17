import { testimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icons";

const MARKET_LABEL: Record<string, string> = {
  us: "United States",
  uk: "United Kingdom",
  ca: "Canada",
};

/**
 * Renders nothing at all while `testimonials` is empty — no skeletons, no
 * "coming soon" filler. See data/testimonials.ts for why.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  const [lead, ...rest] = testimonials;

  return (
    <section className="border-y border-gray-200 bg-white py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          align="left"
          eyebrow="From people who used it"
          title="What job seekers told us"
          description="Published with permission, in their words, with the month and the outcome attached."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {/* Dominant cell */}
          {lead && (
            <figure className="flex flex-col justify-between gap-8 rounded-3xl border border-brand-200 bg-brand-50 p-8 lg:col-span-7 lg:p-10">
              <Icon
                name="quote"
                size={30}
                className="text-brand-500"
                strokeWidth={1.4}
              />
              <blockquote className="font-display text-[1.375rem] leading-[1.35] tracking-[-0.018em] text-ink md:text-[1.625rem]">
                {lead.quote}
              </blockquote>
              <figcaption className="border-t border-brand-200 pt-5 text-[0.875rem]">
                <span className="font-semibold text-ink">{lead.name}</span>
                <span className="mt-1 block text-gray-600">{lead.role}</span>
                <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-gray-500">
                  <span>{MARKET_LABEL[lead.market] ?? lead.market}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lead.date}</span>
                  {lead.outcome && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-brand-700">
                        {lead.outcome}
                      </span>
                    </>
                  )}
                </span>
              </figcaption>
            </figure>
          )}

          {/* Stacked smaller cells */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {rest.slice(0, 2).map((t) => (
              <figure
                key={t.quote}
                className="flex flex-1 flex-col justify-between gap-5 rounded-3xl border border-gray-200 bg-canvas p-6"
              >
                <blockquote className="text-[0.9375rem] leading-relaxed text-gray-700">
                  {t.quote}
                </blockquote>
                <figcaption className="text-[0.8125rem]">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span className="mt-0.5 block text-gray-600">{t.role}</span>
                  <span className="mt-1.5 block text-gray-500">
                    {MARKET_LABEL[t.market] ?? t.market} · {t.date}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
