import type { Metadata } from "next";
import { site, absoluteUrl } from "@/site.config";
import type { Guide, JobWithCompany } from "@/lib/types";
import { EMPLOYMENT_LABELS } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                   */
/* -------------------------------------------------------------------------- */

interface MetaInput {
  title: string;
  description: string;
  path: string;
  /** Omit the "| Brand" suffix, for the homepage. */
  bare?: boolean;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
  /** Query-string pages should point their canonical at the clean path. */
  canonicalOverride?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  bare = false,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
  canonicalOverride,
}: MetaInput): Metadata {
  const fullTitle = bare ? title : `${title} | ${site.name}`;
  const canonical = absoluteUrl(canonicalOverride ?? path);

  return {
    // The root layout owns the "%s | Brand" template, so pass the bare title
    // and let it apply the suffix once. `bare` pages opt out entirely.
    title: bare ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: ogType,
      url: canonical,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: "en_US",
      images: [
        {
          url: absoluteUrl(`/og?title=${encodeURIComponent(title)}`),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(`/og?title=${encodeURIComponent(title)}`)],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Structured data                                                            */
/* -------------------------------------------------------------------------- */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    legalName: site.legalName,
    url: absoluteUrl("/"),
    description: site.description,
    email: site.email,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.svg"),
    },
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name: site.name,
    description: site.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/jobs?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const COUNTRY_CODE: Record<string, string> = {
  "United States": "US",
  "United Kingdom": "GB",
  Canada: "CA",
};

/**
 * Google-compliant JobPosting markup.
 *
 * Returns `null` for demo rows. That is deliberate: submitting fabricated
 * vacancies to Google Jobs would be both a policy violation and a bad
 * experience for job seekers. Live data must set `isSample: false`.
 */
export function jobPostingSchema(job: JobWithCompany) {
  if (job.isSample) return null;

  const descriptionHtml = [
    `<p>${job.summary}</p>`,
    job.responsibilities.length
      ? `<p><strong>Responsibilities</strong></p><ul>${job.responsibilities
          .map((r) => `<li>${r}</li>`)
          .join("")}</ul>`
      : "",
    job.requirements.length
      ? `<p><strong>Requirements</strong></p><ul>${job.requirements
          .map((r) => `<li>${r}</li>`)
          .join("")}</ul>`
      : "",
    job.benefits.length
      ? `<p><strong>Benefits</strong></p><ul>${job.benefits
          .map((r) => `<li>${r}</li>`)
          .join("")}</ul>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const isRemote = job.location.mode === "remote";

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: descriptionHtml,
    identifier: {
      "@type": "PropertyValue",
      name: job.company.name,
      value: job.id,
    },
    datePosted: job.postedAt,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      sameAs: job.company.website || undefined,
    },
    jobLocation: isRemote
      ? undefined
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location.city,
            addressRegion: job.location.region,
            addressCountry: COUNTRY_CODE[job.location.country] ?? job.location.country,
          },
        },
    ...(isRemote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: {
            "@type": "Country",
            name: job.location.country,
          },
        }
      : {}),
    ...(job.salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salary.currency,
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salary.min,
              maxValue: job.salary.max,
              unitText: job.salary.period,
            },
          },
        }
      : {}),
    ...(job.education
      ? {
          educationRequirements: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "bachelor degree",
          },
        }
      : {}),
    directApply: false,
    industry: job.company.industry || undefined,
    skills: job.skills.join(", "),
  };
}

export function articleSchema(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt ?? guide.publishedAt,
    author: {
      "@type": "Person",
      name: guide.author,
      jobTitle: guide.authorRole,
    },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/guides/${guide.slug}`),
    },
    image: absoluteUrl(`/og?title=${encodeURIComponent(guide.title)}`),
    inLanguage: "en",
    isAccessibleForFree: true,
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function itemListSchema(
  jobs: JobWithCompany[],
  { suppressForSample = true } = {},
) {
  const live = suppressForSample ? jobs.filter((j) => !j.isSample) : jobs;
  if (!live.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: live.map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/jobs/${job.slug}`),
      name: `${job.title} — ${job.company.name}`,
    })),
  };
}

export const employmentLabel = (t: keyof typeof EMPLOYMENT_LABELS) =>
  EMPLOYMENT_LABELS[t];
