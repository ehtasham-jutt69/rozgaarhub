import type { Metadata } from "next";
import { site } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import { ArticleShell, Fillme } from "@/components/page-shell";

export const metadata: Metadata = buildMetadata({
  title: "Editorial standards",
  description: `How ${site.name} researches, writes, reviews and corrects its career guides — and the line between editorial content and advertising.`,
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <ArticleShell
      title="Editorial standards"
      standfirst="How we decide what to publish, how we check it, and what separates our editorial content from the advertising that funds it."
      trail={[
        { name: "Home", path: "/" },
        { name: "Editorial standards", path: "/editorial-policy" },
      ]}
      updated="2026-11-12"
    >
      <h2>What we publish, and why</h2>
      <p>
        We publish guides on one subject: getting hired into your first or
        second job in the US, UK or Canada. Each guide takes a single question
        that genuinely confuses people and answers it in full.
      </p>
      <p>
        We do not publish content whose purpose is to occupy a search result.
        That means no &ldquo;top 10 skills for 2027&rdquo; listicles assembled
        from other listicles, no pages that restate the question for four
        hundred words before answering it, and no guides on subjects where we
        have nothing to add beyond what the official source already says
        clearly.
      </p>

      <h2>Sourcing</h2>
      <p>Where a guide states a rule, we:</p>
      <ul>
        <li>
          Name the body that sets it — the Department of Labor, HMRC, UKVI,
          IRCC, a provincial employment standards branch
        </li>
        <li>Link the primary source, not a secondary article about it</li>
        <li>
          Say plainly where a rule is uncertain, contested or under active
          review, rather than presenting a snapshot as settled
        </li>
        <li>
          Distinguish between what the law requires and what is merely common
          practice
        </li>
      </ul>
      <p>
        For data, we use our own listing index and publish the sample size. We
        do not quote statistics we cannot trace to a source, and we do not
        round a figure drawn from eleven listings into a confident claim about a
        market.
      </p>

      <h2>What we will not do</h2>
      <ul>
        <li>
          <strong>Invent numbers.</strong> No fabricated success rates, no
          &ldquo;10,000 students placed&rdquo; unless we have placed them and
          can show it
        </li>
        <li>
          <strong>Publish advice we would not follow.</strong> If a tactic only
          works in theory, we say so
        </li>
        <li>
          <strong>Put affiliate links inside advice.</strong> If we ever
          recommend a paid product, the recommendation will carry no commission,
          or it will not appear
        </li>
        <li>
          <strong>Let an advertiser influence editorial.</strong> Advertisers
          have no input into what we publish, and no advance sight of it
        </li>
        <li>
          <strong>Use AI-generated text as finished copy.</strong> Research
          tools are fine; publishing unverified machine output as advice is not
        </li>
      </ul>

      <h2>Review before publication</h2>
      <p>
        Every guide is checked against this policy before it goes live:
        factual claims traced to a source, links tested, jurisdiction-specific
        statements labelled for the countries they apply to, and the disclaimer
        applied where the subject is legal, immigration or pay related.
      </p>
      <p>
        <Fillme>
          Before launch: name the person responsible for this review and their
          relevant background, and link an author page. Anonymous
          &ldquo;editorial team&rdquo; bylines are the weakest form of
          authorship — for readers deciding whether to trust pay and visa
          advice, and for search engines assessing experience and
          expertise.
        </Fillme>
      </p>

      <h2>Keeping guides current</h2>
      <p>
        Advice about minimum wage, visa routes and application cycles decays.
        Every guide shows its publication date and, where it has been revised,
        a last-updated date. We review guides covering legal or immigration
        rules at least{" "}
        <Fillme>[state your review interval, e.g. every six months]</Fillme>,
        and immediately when we become aware of a rule change.
      </p>
      <p>
        When a guide is no longer accurate and we cannot update it promptly, we
        would rather unpublish it than leave it misleading people.
      </p>

      <h2>Corrections</h2>
      <p>
        We correct errors openly. Minor fixes — typos, broken links — are made
        silently. Anything that changes the meaning of advice gets a dated
        correction note on the page.
      </p>
      <p>
        Report an error to{" "}
        <a href={`mailto:${site.editorialEmail}`}>{site.editorialEmail}</a>. Tell
        us the page and what is wrong; if you can point to the official source,
        faster still. We do not need you to be polite about it.
      </p>

      <h2>Advertising and editorial separation</h2>
      <p>
        The site is funded by display advertising. Three rules follow:
      </p>
      <ul>
        <li>
          Every ad slot is <strong>labelled</strong> as advertising
        </li>
        <li>
          Ads are placed between sections, never mid-sentence or mid-list, and
          never styled to resemble our own content
        </li>
        <li>
          Advertising never influences which jobs are listed, how they are
          ranked, or what a guide says
        </li>
      </ul>
      <p>
        We do not sell featured listings, sponsored posts or paid placement in
        search results. If that ever changes, it will be disclosed on the page
        where it happens and on our <a href="/about">about page</a>, before it
        goes live.
      </p>

      <h2>Listing inclusion</h2>
      <p>
        Which roles appear is an editorial decision, not a commercial one.
        Roles are included when they are genuinely entry level, in a market we
        cover, and advertised publicly by the employer. We exclude:
      </p>
      <ul>
        <li>Unpaid roles at for-profit employers</li>
        <li>
          Roles advertised as &ldquo;graduate&rdquo; or
          &ldquo;entry-level&rdquo; that in fact require several years of
          experience
        </li>
        <li>
          Listings requiring the candidate to pay a fee at any stage
        </li>
        <li>Anything we believe to be fraudulent or a front for recruitment of data</li>
        <li>Multi-level marketing and commission-only &ldquo;opportunities&rdquo;</li>
      </ul>
      <p>
        Employers cannot pay to have an exclusion reversed. They can{" "}
        <a href="/contact">write to us</a> if they think we have judged a role
        wrongly, and we will look again.
      </p>
    </ArticleShell>
  );
}
