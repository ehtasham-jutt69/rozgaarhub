import type { Metadata } from "next";
import { site } from "@/site.config";
import { getSiteStats } from "@/lib/jobs";
import { buildMetadata } from "@/lib/seo";
import { ArticleShell, Fillme } from "@/components/page-shell";
import { ButtonLink } from "@/components/ui";
import { Icon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: `About ${site.name}`,
  description: `Who runs ${site.name}, how we choose what to list, how we make money, and what we will not do. Written so you can judge whether to trust the advice.`,
  path: "/about",
});

export default function AboutPage() {
  const stats = getSiteStats();

  return (
    <ArticleShell
      title={`About ${site.name}`}
      standfirst="We help students and recent graduates in the US, UK and Canada find entry-level work without wading through roles that secretly want five years of experience."
      trail={[
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]}
    >
      <h2>Why this site exists</h2>
      <p>
        Entry-level job hunting is made harder than it needs to be by the
        places you have to do it. Listings hide the salary. &ldquo;Graduate&rdquo;
        roles ask for three years of experience. Internships do not say whether
        they are paid. International students spend weeks applying for jobs
        that were never going to sponsor a visa, because nobody said so on the
        advert.
      </p>
      <p>
        {site.name} is built around the information that actually decides
        whether you apply. Every listing shows the pay range where the employer
        published one, the work setup, the experience level we think it truly
        sits at, and whether visa sponsorship is on offer. When we do not know
        something, we say so rather than leaving a blank that reads as a no.
      </p>

      <h2>What we cover</h2>
      <p>
        We focus on three markets — the United States, the United Kingdom and
        Canada — because entry-level hiring practice, pay transparency law and
        work authorisation rules differ enough between them that covering them
        properly means covering them specifically. We currently track{" "}
        <strong>{stats.jobs} roles</strong> from{" "}
        <strong>{stats.companies} employers</strong>, of which{" "}
        <strong>{stats.internships}</strong> are internships or placements.
      </p>
      <p>Everything we list sits at one of four levels:</p>
      <ul>
        <li>
          <strong>Internships and placements</strong> — summer internships,
          co-op terms, placement years, vacation schemes
        </li>
        <li>
          <strong>Graduate schemes</strong> — structured programmes with
          rotations, training and a defined duration
        </li>
        <li>
          <strong>Entry level</strong> — first permanent roles that genuinely
          expect no prior full-time experience
        </li>
        <li>
          <strong>Junior</strong> — roles for people with up to roughly two
          years of experience, including completed internships
        </li>
      </ul>

      <h2>How we make money</h2>
      <p>
        This matters, so it goes near the top rather than buried in the footer.
      </p>
      <p>
        The site is funded by <strong>advertising</strong>. Ad slots are
        labelled, they are kept out of the middle of article sentences, and
        they never affect which roles appear or in what order. We do not take
        payment from employers for placement, we do not sell &ldquo;featured
        listing&rdquo; slots that masquerade as organic results, and we do not
        rank a role higher because a company bought something.
      </p>
      <p>
        We also do not charge candidates, ever, for anything. There is no
        premium tier, no CV review upsell, and no account required to read a job
        description. If that changes, this page will say so before it happens.
      </p>

      <h2>What we will not do</h2>
      <ul>
        <li>
          <strong>Sell your data.</strong> We do not collect CVs and we do not
          operate as a recruitment agency, so there is nothing to sell
        </li>
        <li>
          <strong>Put a login in front of a job description.</strong> Gating
          content you need in order to decide whether to apply is a dark
          pattern, not a product
        </li>
        <li>
          <strong>List unpaid work at for-profit companies.</strong> In most
          cases these arrangements are unlawful. We explain why in our guide on{" "}
          <a href="/guides/are-unpaid-internships-legal">
            whether unpaid internships are legal
          </a>
        </li>
        <li>
          <strong>Publish advice we have not checked.</strong> Where we state a
          rule, we name the body that sets it and link the official source
        </li>
        <li>
          <strong>Invent statistics.</strong> Every figure on this site is
          computed from our own listing data, with the sample size shown
        </li>
      </ul>

      <h2>Who writes this</h2>
      <p>
        Guides are produced by the {site.name} careers desk and reviewed before
        publication against our{" "}
        <a href="/editorial-policy">editorial standards</a>. We state the
        publication date and the last-updated date on every guide, because
        advice about visa routes and minimum wage goes out of date quickly and
        you deserve to know how old it is.
      </p>
      <p>
        <Fillme>
          Before launch: replace this section with the real name, role and
          relevant background of whoever is writing, and add a linked author
          page. Named authorship with verifiable experience is the single
          strongest trust signal on a careers site — for readers and for search
          engines.
        </Fillme>
      </p>

      <h2>Corrections</h2>
      <p>
        If we have got something wrong, we want to know and we will fix it. Tell
        us at{" "}
        <a href={`mailto:${site.editorialEmail}`}>{site.editorialEmail}</a>.
        Substantive corrections to a guide are noted on the page with the date.
      </p>

      <h2>Legal status</h2>
      <p>
        {site.legalName} is{" "}
        <Fillme>
          [legal entity type and registration number, registered address, and
          the country whose law governs the site]
        </Fillme>
        . We are not a recruitment agency, an employment business, or an
        immigration adviser. Our guides are general information and not legal,
        tax or immigration advice.
      </p>

      <div className="not-prose mt-12 flex flex-col items-start gap-4 rounded-2xl border border-gray-200 bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-[0.9375rem] font-semibold text-ink">
            Questions, corrections or a role to list?
          </p>
          <p className="mt-1 text-[0.875rem] text-gray-600">
            We read everything that comes in.
          </p>
        </div>
        <ButtonLink href="/contact" size="md">
          Get in touch
          <Icon name="arrowRight" size={15} />
        </ButtonLink>
      </div>
    </ArticleShell>
  );
}
