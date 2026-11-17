import type { ReactNode } from "react";
import { Breadcrumbs, JsonLd } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

/**
 * Shell for prose pages — legal documents, about, policies.
 * Keeps the measure, header treatment and breadcrumbs consistent.
 */
export function ArticleShell({
  title,
  standfirst,
  trail,
  updated,
  children,
  wide = false,
}: {
  title: string;
  standfirst?: string;
  trail: { name: string; path: string }[];
  updated?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <header className="border-b border-gray-200 bg-brand-50">
        <div className="container-page py-9 md:py-12">
          <Breadcrumbs trail={trail} className="mb-6" />
          <div className="max-w-3xl">
            <h1 className="text-display-sm md:text-display-md text-balance">
              {title}
            </h1>
            {standfirst && (
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-gray-700 text-pretty md:text-[1.125rem]">
                {standfirst}
              </p>
            )}
            {updated && (
              <p className="mt-5 border-t border-gray-200 pt-4 text-[0.8125rem] text-gray-600">
                Last updated{" "}
                <time dateTime={updated}>{formatDate(updated)}</time>
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="container-page py-12">
        <div className={wide ? "" : "prose"}>{children}</div>
      </div>
    </>
  );
}

/** Placeholder marker for details the site owner must fill in before launch. */
export function Fillme({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded-[3px] bg-accent-100 px-1 py-px font-medium text-accent-900 decoration-accent-400">
      {children}
    </mark>
  );
}
