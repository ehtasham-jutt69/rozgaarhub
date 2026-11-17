import type { Metadata } from "next";
import { site } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import { ArticleShell, Fillme } from "@/components/page-shell";

export const metadata: Metadata = buildMetadata({
  title: "Terms of use",
  description: `The terms that apply when you use ${site.name} — what we provide, what we do not warrant, acceptable use, and the limits of our liability.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ArticleShell
      title="Terms of use"
      standfirst={`These terms apply whenever you use ${site.name}. By using the site you accept them.`}
      trail={[
        { name: "Home", path: "/" },
        { name: "Terms of use", path: "/terms" },
      ]}
      updated="2026-11-12"
    >
      <div className="callout callout--warning">
        <p className="callout-title">Template notice</p>
        <p>
          <Fillme>
            Have these terms reviewed by a qualified lawyer in your
            jurisdiction before launch, and complete every placeholder. The
            governing-law and liability clauses in particular are not
            one-size-fits-all.
          </Fillme>
        </p>
      </div>

      <h2>1. Who we are</h2>
      <p>
        This site is operated by {site.legalName},{" "}
        <Fillme>[entity type, registration number, registered address]</Fillme>.
        Contact: <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>2. What this service is</h2>
      <p>
        {site.name} is an <strong>information service</strong>. We aggregate and
        index publicly advertised vacancies and publish editorial career
        guides. We are <strong>not</strong>:
      </p>
      <ul>
        <li>A recruitment agency or employment business</li>
        <li>An employer, or an agent of any employer listed</li>
        <li>A party to any application, interview or employment contract</li>
        <li>A provider of legal, immigration, tax or financial advice</li>
      </ul>
      <p>
        When you apply for a role you leave this site and deal directly with
        the employer. We have no involvement in, visibility of, or
        responsibility for that process or its outcome.
      </p>

      <h2>3. No fees for candidates</h2>
      <p>
        Use of this site is free for job seekers. We will never ask you for
        payment, bank details or identity documents. If you receive any
        communication claiming to be from us that does, it is fraudulent —
        please report it to us.
      </p>

      <h2>4. Listing accuracy</h2>
      <p>
        Listings are sourced from employers and public job feeds. We take
        reasonable care, but we do not warrant that any listing is accurate,
        current, complete or still open. Salary figures are reproduced as
        advertised by the employer, or are clearly labelled as our own
        estimate. Role details, closing dates and sponsorship availability can
        change without notice, and the employer&rsquo;s own posting is always
        the authoritative version.
      </p>
      <p>
        If you find a listing that is expired, inaccurate or appears
        fraudulent, tell us and we will review it promptly.
      </p>

      <h2>5. Guides are general information</h2>
      <p>
        Our career guides describe general rules and common practice. They are
        not advice about your situation and must not be relied on as such.
        Employment, minimum wage and immigration rules change frequently and
        apply differently depending on individual circumstances. Always check
        the official source we cite, and take advice from a qualified
        professional, your university careers service or your students&rsquo;
        union before acting. See also our <a href="/disclaimer">disclaimer</a>.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          Scrape, crawl or bulk-copy the site except as permitted by our{" "}
          <code>robots.txt</code>, or use automated means that place an
          unreasonable load on our infrastructure
        </li>
        <li>
          Republish substantial portions of our editorial content without
          permission and attribution
        </li>
        <li>
          Attempt to gain unauthorised access to the site, or interfere with its
          operation or security
        </li>
        <li>
          Use the site to post, transmit or solicit anything unlawful,
          fraudulent or misleading — including fake vacancies
        </li>
        <li>
          Use any part of the site to harvest personal data
        </li>
      </ul>

      <h2>7. Intellectual property</h2>
      <p>
        Our editorial content, design, code, and the compilation and
        presentation of listing data are owned by us or licensed to us.
        Individual job advertisements remain the property of the employers who
        published them. You may quote short extracts of our guides with a
        visible link back to the page.
      </p>

      <h2>8. Third-party links and advertising</h2>
      <p>
        The site contains links to third-party websites and displays
        third-party advertising. We do not control those destinations and are
        not responsible for their content, products, practices or privacy
        policies. The presence of an advertisement is not an endorsement.
      </p>

      <h2>9. Availability</h2>
      <p>
        We aim to keep the site available but do not guarantee uninterrupted
        access. We may change, suspend or withdraw any part of it, including
        individual listings or guides, without notice.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, we exclude liability for any
        loss arising from reliance on the site, including loss of opportunity,
        loss of earnings, wasted time or costs incurred applying for a role that
        was inaccurate, expired or withdrawn.
      </p>
      <p>
        Nothing in these terms excludes or limits liability for death or
        personal injury caused by negligence, for fraud or fraudulent
        misrepresentation, or for any other liability that cannot lawfully be
        excluded. If you are a consumer, these terms do not affect your
        statutory rights.
      </p>

      <h2>11. Changes to these terms</h2>
      <p>
        We may update these terms. The version published here when you use the
        site is the version that applies, and the date at the top shows when it
        last changed.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These terms are governed by the law of{" "}
        <Fillme>[jurisdiction]</Fillme>, and the courts of{" "}
        <Fillme>[jurisdiction]</Fillme> have exclusive jurisdiction, except
        that consumers may also bring proceedings in their country of
        residence where local law gives them that right.
      </p>
    </ArticleShell>
  );
}
