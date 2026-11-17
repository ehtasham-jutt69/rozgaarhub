# RozgaarHub

A jobs-and-internships site for students and graduates in the **US, UK and Canada**, built for organic search and AdSense monetisation.

Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript · zero-runtime-JS content pages

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then edit NEXT_PUBLIC_SITE_URL
npm run dev                    # http://localhost:3000
```

```bash
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

The site ships with **sample job data** so it runs and looks complete out of the box. See [Replacing the sample data](#replacing-the-sample-data).

---

## Read this before you launch

Three things will decide whether this makes money. They are worth more of your attention than any code change.

### 1. The brand name works against your target market

`RozgaarHub` reads as South Asian to a US, UK or Canadian job seeker — *rozgaar* is an Urdu/Hindi word. That is a real problem for a site whose entire premise is high-CPM Western traffic:

- It signals "this site is not for me" to the exact audience you are courting
- It will hurt branded-search CTR and perceived authority in those markets
- It makes outreach to US/UK/CA employers and university careers services harder

**The code is built so this is a one-line fix.** Brand name, tagline and domain all live in [`site.config.ts`](site.config.ts). Change `name` and `domain`, and the whole site — titles, schema, OG images, footer, legal pages — follows.

If you already own the domain and want to keep it, that is a legitimate call, but make it deliberately. Names that would fit the market: something short, neutral and pronounceable in English. Avoid anything with a hyphen or a number.

### 2. Job listings alone will not get you AdSense approval

This is the single most common failure for job-board projects. AdSense reviewers reject sites that are mostly aggregated third-party content with little original material — their policy language is "scraped content" and "no original content". A wall of syndicated job adverts is exactly that, no matter how well designed.

**Your editorial content is the approval path, not the job listings.** Six substantial guides ship in [`content/guides/`](content/guides). That is a credible start, not a finished product. Target **20–30 guides** before applying, and keep publishing after.

### 3. You are not going to outrank Indeed on "jobs"

Nor LinkedIn, Glassdoor or Reed. Do not try. The traffic available to a new site is in the long tail that large boards serve badly:

- `"are unpaid internships legal in the uk"`
- `"cpt vs opt difference"`
- `"what does a pgwp let you do"`
- `"how to write a resume with no experience"`
- `"software engineering internship summer 2027 boston"`

Three of those are already covered. That is the wedge: **answer questions, then convert the reader to a job search.** Every guide on this site links back into live inventory for exactly that reason.

---

## Going live

### Required before first deploy

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real origin, no trailing slash — canonicals, sitemap and OG URLs all derive from it
- [ ] Update `name`, `domain`, `email`, `editorialEmail` in `site.config.ts`
- [ ] Set up **real, monitored mailboxes** for those addresses. A bouncing contact address is a common AdSense rejection
- [ ] Fill in every highlighted placeholder (they render with an amber background) in `/about`, `/contact`, `/privacy`, `/terms`, `/editorial-policy`
- [ ] Have `/privacy` and `/terms` reviewed against your actual setup and jurisdiction. They are solid drafts, not legal advice
- [ ] Replace the `RozgaarHub Editorial` byline with a **named author** and add an author page — see [E-E-A-T](#e-e-a-t-the-cheapest-win-available-to-you)

### Deploy

Vercel is the path of least resistance (this is a Next.js app with ISR-ready data fetching):

```bash
npx vercel          # or connect the repo at vercel.com/new
```

Set the environment variables from `.env.example` in the project dashboard. Any Node host works — `npm run build && npm start`.

### After deploy

- [ ] Add the property to **Google Search Console**, verify, submit `/sitemap.xml`
- [ ] Add to **Bing Webmaster Tools** (feeds Copilot citations, and takes two minutes via GSC import)
- [ ] Test a job page in the [Rich Results Test](https://search.google.com/test/rich-results) — you should see a valid `JobPosting`
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) on the homepage and a guide
- [ ] Only then apply for AdSense

---

## Replacing the sample data

Every shipped listing is fictional and flagged `isSample: true`. That flag does real work:

- **Suppresses `JobPosting` structured data** — fabricated vacancies are never submitted to Google Jobs
- **Suppresses company `Organization` schema** — fictional employers are never published as entities
- Renders a visible `Sample listing` marker on cards and detail pages

**Do not simply flip the flag.** Put real data behind it.

### Option A — live feed (recommended)

[`lib/adzuna.ts`](lib/adzuna.ts) is a complete, working adapter for the Adzuna API. Its free tier covers US, GB and CA, and it exposes `salary_is_predicted`, so advertised pay and estimates stay distinguishable.

```bash
# .env.local
JOB_DATA_SOURCE=adzuna
ADZUNA_APP_ID=...        # https://developer.adzuna.com/
ADZUNA_APP_KEY=...
```

Then in [`lib/jobs.ts`](lib/jobs.ts), make `getAllJobs()` async and await `fetchAdzunaJobs()`, and add `export const revalidate = 3600` to the pages that consume it.

The adapter does the editorial filtering that makes a feed worth reading: `inferLevel()` **rejects** any advert demanding 3+ years or carrying a senior title, so "graduate" roles that actually want five years never reach your site. That filtering is your differentiator — a raw feed is worth nothing.

Other feeds worth looking at: Jooble, Careerjet, USAJOBS (US federal, free), and employer ATS boards (Greenhouse and Lever both expose public JSON per company, which gives you genuinely exclusive listings).

### Option B — hand-curated

Edit [`data/jobs.ts`](data/jobs.ts) and [`data/companies.ts`](data/companies.ts) directly, setting `isSample: false` on real vacancies.

Slower, but curated listings are higher quality than any feed and you can add the structured `responsibilities` / `requirements` / `benefits` detail that feeds do not provide. **A hundred genuinely good listings beat ten thousand syndicated ones** — for users and for Google Jobs.

> **Legal note:** check each source's terms before ingesting it. Many job boards prohibit scraping. Official APIs and employer ATS endpoints are the safe routes.

---

## AdSense: the realistic path

### What is already handled

- `/privacy` discloses third-party ad cookies, Google's use of data, and opt-out routes — AdSense requires this
- `/cookies`, `/terms`, `/disclaimer`, `/about`, `/contact` all exist with real content
- A consent banner gates ad loading; **no ad script loads without consent**
- `AdSlot` reserves its own height, so enabling ads does not wreck your CLS score
- No ad markup renders at all until `NEXT_PUBLIC_ADSENSE_CLIENT` is set — so the pre-approval site is clean

### What you must do

1. **Publish more content.** 20–30 guides minimum. This is the gate.
2. **Get a certified CMP for EEA/UK traffic.** Google requires a [certified Consent Management Platform](https://support.google.com/adsense/answer/13554116) for European users. The shipped banner is honest and functional but is **not certified** and will not satisfy that requirement. Add one before enabling ads for European traffic.
3. **Apply, then set the client ID:**
   ```bash
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   ```
4. **Create ad units** in AdSense and replace the `slot` props in the pages (`jobs-sidebar`, `guide-footer`, etc.) with your real slot IDs.

### Why applications get rejected

In rough order of frequency: thin or aggregated content; missing or boilerplate privacy policy; no working contact method; navigation that leads to empty pages; and applying too early. The first one is the one that will catch you.

---

## SEO: what is built in

| Area | Implementation |
| --- | --- |
| **Rendering** | Every job, guide, category and company page is **prerendered static HTML**. Google never needs to execute JS to read your content |
| **`JobPosting` schema** | Full Google-compliant markup with `baseSalary`, `validThrough`, `employmentType`, `identifier`, remote handling via `jobLocationType` — this is what makes you eligible for the **Google Jobs** widget |
| **Other schema** | `Organization`, `WebSite` + `SearchAction`, `BreadcrumbList`, `Article`, `FAQPage`, `ItemList` |
| **Canonicals** | Filtered views (`/jobs?level=...`) canonicalise to `/jobs`, consolidating crawl equity instead of splitting it across query strings |
| **Crawlable filters** | Filters are real `<Link>`s, not JS state — so Google discovers filtered inventory |
| **Internal linking** | Popular searches in the footer, category cross-links, skill links, guide→jobs links. Nothing is orphaned |
| **Sitemap / robots** | Generated from live data at `/sitemap.xml` and `/robots.txt` |
| **OG images** | Generated per page at `/og?title=...` — typographic, no stock photos |
| **Core Web Vitals** | Self-hosted fonts via `next/font`, no layout-shifting ads, no client JS on content pages, `font-display: swap` |

### E-E-A-T: the cheapest win available to you

Guides are currently bylined `RozgaarHub Editorial`. Anonymous bylines are the **weakest** form of authorship for exactly the topics this site covers — pay law, visa rules, money. Both readers and Google weigh author credibility heavily here.

Replace it with a real name, a real role, and a linked author page describing relevant background. It costs an afternoon and it is worth more than any technical tweak in this table.

### What is deliberately *not* built

Honest about the gaps:

- **No programmatic location pages.** `"software engineering internships in chicago"` is a real query cluster you could own with `/jobs/[category]/[city]` routes. Not built because thin generated pages are a penalty risk — only build them where you have enough inventory per combination to justify a page.
- **No analytics.** Add Plausible, Matomo or GA4 and document it in `/privacy` and `/cookies`.
- **No email capture.** A newsletter is the best retention asset a job site has, but a non-functional signup form is worse than none, so none ships.
- **No search autocomplete, no saved jobs, no accounts.** All deliberate — accounts in particular would mean gating content, which is the mistake the competitor analysis flagged.

---

## Project structure

```
app/
  page.tsx                  homepage
  jobs/                     search (dynamic) + [slug] detail (SSG)
  internships/              landing page w/ FAQ schema
  categories/[slug]/        field landing pages (SSG)
  companies/                directory + [slug] profiles
  guides/                   editorial index + [slug] articles
  salaries/                 benchmarks computed from live listing data
  about contact privacy cookies terms disclaimer editorial-policy
  og/route.tsx              OG image generation
  sitemap.ts robots.ts not-found.tsx icon.svg
  globals.css               design tokens + prose styles

components/
  site-header.tsx           sticky nav + mobile drawer (client)
  site-footer.tsx
  job-card.tsx              JobRow / JobCardCompact / JobMiniRow
  job-filters.tsx           link-based, crawlable filters
  search-bar.tsx            client
  guide-card.tsx
  ads.tsx                   AdSlot, consent banner, consent controls (client)
  ui.tsx                    Button, Badge, Breadcrumbs, JsonLd, …
  icons.tsx                 hand-built SVG icon set
  page-shell.tsx            prose page layout

lib/
  jobs.ts                   query layer: search, filters, facets, related
  guides.ts                 markdown → HTML pipeline + TOC extraction
  seo.ts                    metadata builders + all JSON-LD
  adzuna.ts                 live feed adapter
  types.ts utils.ts

content/guides/*.md         editorial content (frontmatter + markdown)
data/jobs.ts companies.ts   sample data
site.config.ts              brand, nav, markets, ad config
```

---

## Adding a guide

Create `content/guides/your-slug.md`:

```markdown
---
title: "The full headline, written for a human"
shortTitle: "Short version for cards"
description: "One or two sentences. This becomes the meta description."
category: "Applications"
publishedAt: "2026-11-20"
updatedAt: "2026-11-22"
author: "Your Name"
authorRole: "Your role"
markets: ["us", "uk", "ca"]
featured: true
related: ["another-slug"]
---

First paragraph is styled automatically as the standfirst.

## A heading

Headings get ids and anchor links, and `##` headings build the table of
contents (shown when there are more than two).
```

It appears on `/guides`, in the sitemap, and in related-guide slots automatically. No registration step.

Supported in the body: GFM tables, blockquotes, footnote-free prose, and these callouts:

```html
<div class="callout">
<p class="callout-title">Heading</p>
<p>Body.</p>
</div>

<div class="callout callout--warning">…</div>
```

### House style

What makes these guides worth reading rather than ranking-bait:

- **One question per guide**, answered completely
- **Name the authority** — "the Department of Labor applies…", not "studies show…"
- **Link the primary source**, never a secondary article about it
- **Say when something is uncertain or under review** rather than presenting a snapshot as permanent
- **No invented statistics.** Every number on this site traces to our own listing data, with sample size shown
- **Cut the preamble.** Answer in the first two paragraphs, then expand

---

## Performance

### "It compiles when I click a job"

That is the **dev server**, not the site. `npm run dev` compiles each route the first time you visit it, every time you restart. It is not shipped behaviour and users never see it.

```bash
npm run build && npm start     # how the site actually behaves
```

Measured on the production build, warm, localhost:

| Route | TTFB | HTML (gz) |
| --- | --- | --- |
| `/` | 6.3 ms | 23 KB |
| `/jobs/[slug]` | 6.9 ms | 16 KB |
| `/guides/[slug]` | 6.4 ms | 24 KB |
| `/internships` | 6.3 ms | 20 KB |
| `/jobs` | 42 ms | 20 KB |

Every route except `/jobs` is prerendered to static HTML at build time — there is no rendering work per request at all. `/jobs` is the one exception because it reads `searchParams`.

### First-load weight (homepage)

| | |
| --- | --- |
| HTML | 23 KB |
| CSS | 8 KB |
| JS | 189 KB |
| Fonts | 71 KB — 2 variable woff2, preloaded |
| Hero image | 21 KB AVIF |
| **Total** | **~314 KB** over 12 requests |

**The 189 KB of JS is React 19 + the Next App Router runtime.** It is the framework floor, not application code — verified by fingerprinting the chunks: no markdown pipeline, no date library, nothing from `lib/` leaks client-side. App Router always hydrates, so this cannot be reduced further without leaving Next.

### What was changed

- **Search needs no JavaScript.** `SearchBar` was a client component using `useState` + `router.push`. It is now a server component rendering a plain `<form action="/jobs" method="get">`. The browser builds the query string natively, so search works with JS disabled and ships zero bytes.
- **The job index is memoised.** `getAllJobs()` re-mapped and re-sorted the whole dataset on every call — and it is called 4+ times per page render. Now built once. `/jobs` went 56 ms → 42 ms; the saving scales with a live feed.
- **Query params are validated against allow-lists.** `?market=all`, `?market=`, and junk like `?level=wizard` all collapse to "no constraint" instead of silently filtering to zero results.
- **No ad JS before approval.** `components/ad-slot.tsx` is a server gate: with no `NEXT_PUBLIC_ADSENSE_CLIENT`, it renders nothing and never creates a client reference, so the ads chunk is never requested. The consent banner is gated the same way — there is nothing to consent to yet.
- **The LCP image bypasses the optimizer.** The hero was `next/image`, which is a client component and adds a `/_next/image` round-trip. It is now a native `<picture>` pointing at the AVIF/JPEG pair generated at build, with `width`/`height` to reserve the box and `fetchPriority="high"`. Preloaded via `ReactDOM.preload()` **on the homepage only** — putting it in the root layout would make every other page download a photo it does not show.
- **Cache headers.** `/images/*` is `immutable, max-age=31536000`. `/og` is cached for a year (it renders a PNG per request otherwise). `/jobs` gets `s-maxage=60, stale-while-revalidate=300` so a CDN can serve it instead of hitting the origin.

### Already in good shape

- All 8 script tags are `async` — nothing blocks render
- One stylesheet, 8 KB gzipped
- Fonts self-hosted by `next/font` with `display: swap` and automatic fallback metrics (no FOUT shift); variable files beat shipping 6 static weights
- `width`/`height` on the hero and fixed `minHeight` on ad slots — no layout shift when ads turn on
- gzip is on. **Brotli is not** — `next start` does not do it. Vercel, Netlify and Cloudflare apply it automatically, which cuts roughly another 15–20% off text assets. If you self-host behind nginx, enable `brotli on`.

### If you need it faster still

The remaining lever is the framework floor. Options, in order of effort:

1. Serve behind a CDN so static HTML is edge-cached — turns 6 ms origin TTFB into ~0 ms for most visitors. Biggest real-world win, no code change.
2. Drop one of the two fonts (−31 to −40 KB).
3. Make `SiteHeader` a server component. It is client-only for `usePathname` (active nav underline) and the mobile menu toggle. Worth a few KB and some hydration, at the cost of the active state.

## Design system

Anchored on **`#43a724`**, the brand green read off internee.pk's compiled stylesheet. Every neutral is *derived* from that hue (desaturated toward ~103°), which is why the greys read warm-olive rather than cold blue-grey.

| Role | Value |
| --- | --- |
| Anchor | `#43a724` (`brand-500`) |
| Text / buttons | `#2a6d16` (`brand-700`) — passes WCAG AA on light surfaces, unlike the anchor itself at ~2.9:1 |
| Canvas | `#f6f7f2` — **not** `#ffffff` |
| Surface | `#fcfcf9` — `--color-white` is overridden to this |
| Ink | `#151a12` — **not** `#000000` |
| Warm counterpoint | clay `#b45f2b` ramp, used sparingly |
| Display font | **Bricolage Grotesque** |
| Body font | **Outfit** (Inter is used nowhere) |

Tailwind's own `white` and `gray` ramps are overridden in the `@theme` block, so every existing `bg-white` / `text-gray-*` class inherits the tint automatically — there is no pure white or pure black anywhere that renders.

### Broken symmetry

Three sections deliberately avoid an even grid:

- **Hero** — 7/5 asymmetric split, image column offset downward with `lg:pt-10`, and a stat card that overlaps the image frame via negative margin. The primary action is the search field, not a pair of buttons.
- **Bento** — uneven cells on a 6-column grid: one dominant `col-span-4 row-span-2`, then `2`, `2`, `3`, `3`.
- **How it works** — progressively indented rows (`paddingLeft: i * 2rem`), not three equal cards.

### No motion

Every page renders in its final state. `transition` and `animation` are disabled globally with `!important`, `scroll-behavior` is `auto`, and the markup contains zero transform/transition/duration utilities. The internships FAQ is always-open blocks rather than an accordion.

### Images

`public/images/` holds the processed assets. The source you supplied (`img2.avif`, 740×493) is left untouched at the project root.

- The hero imports the **JPEG** copy, not the AVIF. Next reads dimensions unreliably from this file's HEIF-branded AVIF and silently collapses the aspect ratio to 1:1; importing the JPEG gives the correct 740×493, and the optimizer still serves AVIF (~12 KB) to browsers that accept it.
- `hero-workspace-portrait.avif` is a 360×493 subject crop, currently unused — available if you want a narrower hero column.
- At 740px wide the source is fine for a hero panel but **should not be used full-bleed** on large screens; it will soften.

---

## Statistics and reviews

Everything numeric on the site is **computed at build time from the actual dataset** — role counts, the share of listings showing pay, sponsorship counts, median pay by field, guide count and total reading minutes. Nothing is asserted. If the data changes, the copy changes.

`data/testimonials.ts` **ships empty, deliberately.** The site has not had users, so there are no genuine reviews, and inventing them would be dishonest and an AdSense policy violation (fabricated endorsements count as deceptive content). The homepage section returns `null` while the array is empty — no placeholder cards, no "coming soon" state. Add one real entry and the section appears.

Before adding a testimonial you need written permission to publish the person's words, name, role and institution; their actual wording rather than a tidied paraphrase; and something verifiable where possible — the role they were hired into, the month, the employer. The file has a worked good/bad example.

## Licence

Content in `content/guides/` is original editorial work. The code is yours to do with as you like.
