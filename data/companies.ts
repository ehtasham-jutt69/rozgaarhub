import type { Company } from "@/lib/types";

/**
 * DEMO DATA — the employers below are fictional.
 *
 * They exist so the interface can be designed and reviewed against realistic
 * shapes of data. They are not real companies and the roles attached to them
 * are not real vacancies. Replace this file (or switch
 * JOB_DATA_SOURCE=adzuna) before launch. See README.md › Going live.
 */
export const companies: Company[] = [
  {
    slug: "northwind-analytics",
    name: "Northwind Analytics",
    blurb:
      "Customer analytics platform used by mid-market retail and subscription businesses.",
    industry: "B2B Software",
    size: "250–1,000",
    hq: "Boston, MA",
    website: "https://example.com/northwind",
    tint: "spruce",
  },
  {
    slug: "harborlight-health",
    name: "Harborlight Health",
    blurb:
      "Community health network operating clinics and a remote-monitoring programme.",
    industry: "Healthcare",
    size: "5,000–10,000",
    hq: "Toronto, ON",
    website: "https://example.com/harborlight",
    tint: "ochre",
  },
  {
    slug: "fernbrook-studios",
    name: "Fernbrook Studios",
    blurb:
      "Independent product design and brand studio working with public-sector and nonprofit clients.",
    industry: "Design & Media",
    size: "50–250",
    hq: "London, UK",
    website: "https://example.com/fernbrook",
    tint: "sand",
  },
  {
    slug: "cormorant-labs",
    name: "Cormorant Labs",
    blurb:
      "Research-stage biotech developing diagnostic assays for respiratory illness.",
    industry: "Life Sciences",
    size: "50–250",
    hq: "Cambridge, MA",
    website: "https://example.com/cormorant",
    tint: "spruce",
  },
  {
    slug: "beacon-ridge-capital",
    name: "Beacon Ridge Capital",
    blurb:
      "Asset manager running infrastructure and real-assets strategies for institutional clients.",
    industry: "Financial Services",
    size: "1,000–5,000",
    hq: "New York, NY",
    website: "https://example.com/beaconridge",
    tint: "ochre",
  },
  {
    slug: "tessellate",
    name: "Tessellate",
    blurb:
      "Payments infrastructure for marketplaces, with an engineering hub in the North West.",
    industry: "Fintech",
    size: "250–1,000",
    hq: "Manchester, UK",
    website: "https://example.com/tessellate",
    tint: "spruce",
  },
  {
    slug: "quayside-logistics",
    name: "Quayside Logistics",
    blurb:
      "Freight forwarding and warehousing operator across the Pacific Northwest corridor.",
    industry: "Logistics",
    size: "1,000–5,000",
    hq: "Vancouver, BC",
    website: "https://example.com/quayside",
    tint: "sand",
  },
  {
    slug: "marrow-and-finch",
    name: "Marrow & Finch",
    blurb:
      "Direct-to-consumer household goods brand with a growing retail footprint.",
    industry: "Consumer Goods",
    size: "250–1,000",
    hq: "Chicago, IL",
    website: "https://example.com/marrowfinch",
    tint: "ochre",
  },
  {
    slug: "vantage-grid",
    name: "Vantage Grid",
    blurb:
      "Engineering consultancy specialising in grid connection and renewable integration.",
    industry: "Energy & Utilities",
    size: "1,000–5,000",
    hq: "Birmingham, UK",
    website: "https://example.com/vantagegrid",
    tint: "spruce",
  },
  {
    slug: "lumen-civic",
    name: "Lumen Civic",
    blurb:
      "Builds case-management and service-delivery software for municipal government.",
    industry: "Government Technology",
    size: "250–1,000",
    hq: "Ottawa, ON",
    website: "https://example.com/lumencivic",
    tint: "sand",
  },
];

export const companyBySlug = (slug: string) =>
  companies.find((c) => c.slug === slug);
