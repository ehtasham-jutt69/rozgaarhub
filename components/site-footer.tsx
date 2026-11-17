import Link from "next/link";
import { site } from "@/site.config";
import { Logomark, Icon } from "@/components/icons";
import { getPopularSearches } from "@/lib/jobs";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const popular = getPopularSearches();

  return (
    <footer className="mt-24 border-t border-gray-200 bg-brand-50">
      <div className="container-page">
        {/* Popular searches — real internal links, crawlable */}
        <div className="border-b border-gray-200 py-10">
          <h2 className="eyebrow mb-4">Popular searches</h2>
          <ul className="flex flex-wrap gap-2">
            {popular.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-1.5 text-[0.8125rem] text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Main columns */}
        <div className="grid gap-10 py-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Logomark size={30} />
              <span className="font-display text-[1.175rem] font-semibold tracking-[-0.02em] text-ink">
                {site.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[0.875rem] leading-relaxed text-gray-600">
              {site.tagline}. We cover entry-level hiring in the United States,
              United Kingdom and Canada, and publish research-backed guides on
              getting hired.
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {site.markets.map((m) => (
                <span
                  key={m.code}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-2 py-1 text-[0.6875rem] font-semibold tracking-[0.06em] text-gray-600"
                >
                  {m.flag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:col-span-8 lg:grid-cols-4">
            {site.footerNav.map((col) => (
              <div key={col.heading}>
                <h2 className="eyebrow mb-3.5">{col.heading}</h2>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.875rem] text-gray-700 hover:text-brand-800"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-gray-200 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-gray-600">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="shield" size={14} className="text-gray-500" />
              Editorially independent
            </span>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-1.5 hover:text-brand-800"
            >
              <Icon name="mail" size={14} className="text-gray-500" />
              {site.email}
            </a>
          </div>
        </div>

        <p className="pb-10 text-[0.75rem] leading-relaxed text-gray-500">
          {site.name} aggregates publicly advertised vacancies and links to the
          employer&rsquo;s own application page. We are not a recruitment agency
          and we never charge candidates. Salary figures are shown as advertised
          by the employer, or clearly labelled as our own estimate. Guides are
          general information, not legal or immigration advice.
        </p>
      </div>
    </footer>
  );
}
