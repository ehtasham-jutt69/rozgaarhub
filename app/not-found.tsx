import Link from "next/link";
import type { Metadata } from "next";
import { getAllJobs, getPopularSearches } from "@/lib/jobs";
import { getFeaturedGuides } from "@/lib/guides";
import { ButtonLink } from "@/components/ui";
import { JobMiniRow } from "@/components/job-card";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const jobs = getAllJobs().slice(0, 4);
  const guides = getFeaturedGuides(3);
  const popular = getPopularSearches().slice(0, 6);

  return (
    <div className="container-page py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="mt-4 text-display-md md:text-display-lg text-balance">
          That page has moved on.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-gray-700 text-pretty">
          Job listings come down when the employer closes the vacancy, so this
          is most likely a role that has expired. Everything still open is one
          click away.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/jobs" size="lg">
            Browse open roles
            <Icon name="arrowRight" size={16} />
          </ButtonLink>
          <ButtonLink href="/guides" variant="secondary" size="lg">
            Read career guides
          </ButtonLink>
        </div>
      </div>

      <div className="mt-16 grid gap-10 border-t border-gray-200 pt-12 lg:grid-cols-3">
        <section>
          <h2 className="eyebrow mb-4">Latest openings</h2>
          <ul className="flex flex-col">
            {jobs.map((j) => (
              <JobMiniRow key={j.id} job={j} />
            ))}
          </ul>
        </section>

        <section>
          <h2 className="eyebrow mb-4">Popular searches</h2>
          <ul className="flex flex-col gap-2.5">
            {popular.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group inline-flex items-center gap-1.5 text-[0.875rem] text-gray-700 hover:text-brand-800"
                >
                  <Icon
                    name="chevronRight"
                    size={13}
                    className="text-gray-400 group-"
                  />
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="eyebrow mb-4">Guides worth your time</h2>
          <ul className="flex flex-col gap-3.5">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="text-[0.875rem] font-medium leading-snug text-ink decoration-brand-300 underline-offset-[3px] hover:underline"
                >
                  {g.shortTitle ?? g.title}
                </Link>
                <p className="mt-1 text-[0.75rem] text-gray-500">
                  {g.readingMinutes} min read
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
