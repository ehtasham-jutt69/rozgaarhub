import type {
  EmploymentType,
  ExperienceLevel,
  Job,
  MarketCode,
  WorkMode,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

/**
 * Live job feed adapter — Adzuna.
 *
 * Adzuna is a reasonable first feed because its free tier covers exactly the
 * markets this site targets (US, GB, CA) and it returns a salary field with an
 * explicit `salary_is_predicted` flag, which lets us distinguish an advertised
 * range from an estimate rather than presenting both as fact.
 *
 * Register for credentials: https://developer.adzuna.com/
 *
 * To switch the site over:
 *   1. set ADZUNA_APP_ID / ADZUNA_APP_KEY and JOB_DATA_SOURCE=adzuna in .env
 *   2. make `getAllJobs()` in lib/jobs.ts async and await `fetchAdzunaJobs()`
 *   3. mark the pages that consume it with a revalidate window, e.g.
 *      `export const revalidate = 3600`
 *
 * Mapped rows carry `isSample: false`, which is what enables JobPosting
 * structured data — so only switch over once you are confident in the feed.
 */

const ENDPOINT = "https://api.adzuna.com/v1/api/jobs";

const COUNTRY_BY_MARKET: Record<MarketCode, string> = {
  us: "us",
  uk: "gb",
  ca: "ca",
};

const CURRENCY_BY_MARKET: Record<MarketCode, string> = {
  us: "USD",
  uk: "GBP",
  ca: "CAD",
};

const COUNTRY_NAME: Record<MarketCode, string> = {
  us: "United States",
  uk: "United Kingdom",
  ca: "Canada",
};

interface AdzunaResult {
  id: string;
  title: string;
  description: string;
  created: string;
  redirect_url: string;
  company?: { display_name?: string };
  location?: { display_name?: string; area?: string[] };
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string;
  contract_type?: string;
  contract_time?: string;
  category?: { label?: string; tag?: string };
}

interface AdzunaResponse {
  results?: AdzunaResult[];
  count?: number;
}

/* -------------------------------------------------------------------------- */
/*  Classification                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Infer experience level from the advert text.
 *
 * Deliberately conservative: a role is only kept as entry level if it reads
 * like one AND does not demand years of experience. Filtering out dressed-up
 * senior roles is the main editorial value we add over a raw feed.
 */
export function inferLevel(
  title: string,
  description: string,
): ExperienceLevel | null {
  const t = title.toLowerCase();
  const body = `${t} ${description.toLowerCase()}`;

  // Hard exclusions — a "graduate" title asking for 5 years is not entry level.
  if (/\b([3-9]|1\d)\+?\s*(years|yrs)\b/.test(body)) return null;
  if (/\b(senior|lead|principal|staff|head of|director|manager)\b/.test(t)) {
    return null;
  }

  if (/\b(intern|internship|placement|co-?op|summer analyst|vacation scheme)\b/.test(t)) {
    return "internship";
  }
  if (/\b(graduate|grad scheme|new grad|trainee)\b/.test(t)) return "graduate";
  if (/\b(junior|jr\.?|associate)\b/.test(t)) return "junior";
  if (/\b(entry.level|no experience)\b/.test(body)) return "entry";

  return null;
}

/** Map Adzuna's broad category tags onto our own taxonomy. */
export function mapCategory(tag?: string, label?: string): string {
  const s = `${tag ?? ""} ${label ?? ""}`.toLowerCase();
  if (/\b(it|software|developer|engineering-jobs.*software)\b/.test(s)) {
    return "software-engineering";
  }
  if (/\b(scientific|data|analyst)\b/.test(s)) return "data-analytics";
  if (/\b(pr|advertis|marketing)\b/.test(s)) return "marketing";
  if (/\b(accounting|finance|banking)\b/.test(s)) return "finance-accounting";
  if (/\b(creative|design)\b/.test(s)) return "design";
  if (/\b(logistics|warehouse|retail|admin)\b/.test(s)) return "operations";
  if (/\b(healthcare|nursing|social)\b/.test(s)) return "healthcare";
  if (/\b(engineering|manufactur|energy)\b/.test(s)) return "engineering";
  return "operations";
}

function inferWorkMode(title: string, description: string): WorkMode {
  const body = `${title} ${description}`.toLowerCase();
  if (/\b(fully remote|remote|work from home|wfh)\b/.test(body)) return "remote";
  if (/\bhybrid\b/.test(body)) return "hybrid";
  return "onsite";
}

function inferEmploymentType(
  level: ExperienceLevel,
  contractTime?: string,
  contractType?: string,
): EmploymentType {
  if (level === "internship") return "INTERN";
  if (contractType === "contract") return "CONTRACTOR";
  if (contractTime === "part_time") return "PART_TIME";
  return "FULL_TIME";
}

/** Adverts that mention sponsorship positively. Absence is not a negative. */
function inferSponsorship(description: string): boolean {
  const d = description.toLowerCase();
  if (/\b(no sponsorship|cannot sponsor|unable to sponsor|must have the right to work)\b/.test(d)) {
    return false;
  }
  return /\b(visa sponsorship|will sponsor|sponsorship available|skilled worker visa|h-?1b sponsor)\b/.test(d);
}

/* -------------------------------------------------------------------------- */
/*  Mapping                                                                    */
/* -------------------------------------------------------------------------- */

export function mapAdzunaResult(
  r: AdzunaResult,
  market: MarketCode,
): Job | null {
  const level = inferLevel(r.title, r.description ?? "");
  if (!level) return null;

  const companyName = r.company?.display_name?.trim();
  if (!companyName) return null;

  const area = r.location?.area ?? [];
  const city = area.at(-1) ?? r.location?.display_name ?? "Unknown";
  const region = area.at(1) ?? area.at(0) ?? COUNTRY_NAME[market];

  const mode = inferWorkMode(r.title, r.description ?? "");
  const estimated = r.salary_is_predicted === "1";

  const posted = new Date(r.created);
  const validThrough = new Date(posted.getTime() + 30 * 86_400_000);

  return {
    id: `adzuna-${r.id}`,
    slug: `${slugify(companyName)}-${slugify(r.title)}-${slugify(city)}`.slice(0, 90),
    title: r.title.trim(),
    companySlug: slugify(companyName),
    location: {
      city: mode === "remote" ? "Remote" : city,
      region,
      country: COUNTRY_NAME[market],
      market,
      mode,
    },
    employmentType: inferEmploymentType(level, r.contract_time, r.contract_type),
    level,
    category: mapCategory(r.category?.tag, r.category?.label),
    salary:
      r.salary_min && r.salary_max
        ? {
            min: Math.round(r.salary_min),
            max: Math.round(r.salary_max),
            currency: CURRENCY_BY_MARKET[market],
            period: "YEAR",
            estimated,
          }
        : undefined,
    postedAt: posted.toISOString(),
    validThrough: validThrough.toISOString(),
    applyUrl: r.redirect_url,
    summary: (r.description ?? "").replace(/\s+/g, " ").trim(),
    // The feed gives prose, not structured lists. Leave these empty rather
    // than inventing bullet points the employer never wrote.
    responsibilities: [],
    requirements: [],
    benefits: [],
    skills: [],
    visaSponsorship: inferSponsorship(r.description ?? ""),
    education: null,
    isSample: false,
  };
}

/* -------------------------------------------------------------------------- */
/*  Fetch                                                                      */
/* -------------------------------------------------------------------------- */

export async function fetchAdzunaJobs({
  markets = ["us", "uk", "ca"],
  perMarket = 50,
  what = "graduate internship entry level",
  revalidate = 3600,
}: {
  markets?: MarketCode[];
  perMarket?: number;
  what?: string;
  revalidate?: number;
} = {}): Promise<Job[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error(
      "ADZUNA_APP_ID and ADZUNA_APP_KEY must be set when JOB_DATA_SOURCE=adzuna",
    );
  }

  const batches = await Promise.all(
    markets.map(async (market) => {
      const params = new URLSearchParams({
        app_id: appId,
        app_key: appKey,
        results_per_page: String(perMarket),
        what_or: what,
        max_days_old: "30",
        content_type: "application/json",
      });

      const url = `${ENDPOINT}/${COUNTRY_BY_MARKET[market]}/search/1?${params}`;

      try {
        const res = await fetch(url, { next: { revalidate } });
        if (!res.ok) {
          console.error(`[adzuna] ${market} responded ${res.status}`);
          return [];
        }
        const data = (await res.json()) as AdzunaResponse;
        return (data.results ?? [])
          .map((r) => mapAdzunaResult(r, market))
          .filter((j): j is Job => j !== null);
      } catch (err) {
        // A feed outage must not take the site down — fall back to nothing
        // for that market and let the others render.
        console.error(`[adzuna] ${market} fetch failed`, err);
        return [];
      }
    }),
  );

  // De-duplicate by slug; the same role is often syndicated several times.
  const seen = new Set<string>();
  return batches.flat().filter((j) => {
    if (seen.has(j.slug)) return false;
    seen.add(j.slug);
    return true;
  });
}
