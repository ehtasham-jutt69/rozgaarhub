/**
 * Single source of truth for brand, URLs, navigation and market targeting.
 * Rebranding the whole site is one edit to `name` + `domain` here.
 */

export const site = {
  // --- Brand -------------------------------------------------------------
  name: "RozgaarHub",
  shortName: "RozgaarHub",
  legalName: "RozgaarHub",
  tagline: "Graduate jobs and internships, without the guesswork",
  description:
    "Search entry-level jobs, graduate schemes and paid internships across the United States, United Kingdom and Canada — with salary ranges, visa-sponsorship signals and plain-English career guides.",

  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",

  // --- Contact -----------------------------------------------------------
  email: "hello@example.com",
  editorialEmail: "editorial@example.com",

  social: {
    linkedin: "",
    x: "",
    instagram: "",
  },

  /**
   * Markets we actively cover. Order matters — it drives the market switcher
   * and the default search scope. These are chosen for advertiser demand.
   */
  markets: [
    { code: "us", country: "United States", currency: "USD", symbol: "$", flag: "US" },
    { code: "uk", country: "United Kingdom", currency: "GBP", symbol: "£", flag: "UK" },
    { code: "ca", country: "Canada", currency: "CAD", symbol: "C$", flag: "CA" },
  ] as const,

  defaultMarket: "us" as const,

  // --- Ads / analytics ---------------------------------------------------
  adsense: {
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
    /** Ads render only once a client ID exists AND the visitor has consented. */
    get enabled() {
      return Boolean(this.client);
    },
  },

  // --- Navigation --------------------------------------------------------
  nav: [
    { label: "Jobs", href: "/jobs" },
    { label: "Internships", href: "/internships" },
    { label: "Companies", href: "/companies" },
    { label: "Career Guides", href: "/guides" },
    { label: "Salaries", href: "/salaries" },
  ],

  footerNav: [
    {
      heading: "Find work",
      links: [
        { label: "All jobs", href: "/jobs" },
        { label: "Paid internships", href: "/internships" },
        { label: "Graduate schemes", href: "/jobs?level=graduate" },
        { label: "Remote roles", href: "/jobs?remote=true" },
        { label: "Visa sponsorship", href: "/jobs?sponsorship=true" },
      ],
    },
    {
      heading: "Research",
      links: [
        { label: "Career guides", href: "/guides" },
        { label: "Salary benchmarks", href: "/salaries" },
        { label: "Company directory", href: "/companies" },
        { label: "Resume toolkit", href: "/guides/resume-with-no-experience" },
        { label: "Interview prep", href: "/guides/star-method-interview-answers" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About us", href: "/about" },
        { label: "Editorial standards", href: "/editorial-policy" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy policy", href: "/privacy" },
        { label: "Cookie policy", href: "/cookies" },
        { label: "Terms of use", href: "/terms" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ],
} as const;

export type Market = (typeof site.markets)[number]["code"];

export const absoluteUrl = (path = "/") =>
  `${site.domain.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
