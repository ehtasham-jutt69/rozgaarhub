import type { Metadata } from "next";
import { site } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import { ArticleShell, Fillme } from "@/components/page-shell";

export const metadata: Metadata = buildMetadata({
  title: "Privacy policy",
  description: `How ${site.name} handles personal data: what we collect, the advertising and analytics cookies involved, your rights under UK and EU GDPR, PIPEDA and US state law, and how to exercise them.`,
  path: "/privacy",
});

const UPDATED = "2026-11-12";

export default function PrivacyPage() {
  return (
    <ArticleShell
      title="Privacy policy"
      standfirst={`This policy explains what personal data ${site.name} collects, why, who else is involved, and what you can do about it.`}
      trail={[
        { name: "Home", path: "/" },
        { name: "Privacy policy", path: "/privacy" },
      ]}
      updated={UPDATED}
    >
      <div className="callout callout--warning">
        <p className="callout-title">Template notice</p>
        <p>
          <Fillme>
            This is a working draft covering the disclosures a site of this
            type needs. Before you launch, have it reviewed against your actual
            setup and the law of your jurisdiction, and fill in every
            highlighted placeholder. Publishing an inaccurate privacy policy is
            worse than publishing none.
          </Fillme>
        </p>
      </div>

      <h2>Who we are</h2>
      <p>
        {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates this
        website. For the purposes of UK and EU data protection law, the data
        controller is{" "}
        <Fillme>
          [registered legal entity name, registration number and address]
        </Fillme>
        . You can reach us at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>The short version</h2>
      <ul>
        <li>
          We do not ask you to create an account, and we do not collect or
          store CVs
        </li>
        <li>
          Applying for a job takes you to the employer&rsquo;s own website — we
          do not receive your application
        </li>
        <li>
          We serve advertising, which involves third-party cookies, and only
          after you consent
        </li>
        <li>
          We never sell personal data
        </li>
      </ul>

      <h2>What we collect</h2>

      <h3>Information you give us</h3>
      <p>
        Only what you choose to send. If you email us a correction, a question
        or a privacy request, we hold that message and your email address so we
        can reply and keep a record of how we handled it.
      </p>

      <h3>Information collected automatically</h3>
      <p>
        Like virtually all websites, our hosting infrastructure processes
        technical data when you visit, including your IP address, browser type
        and version, device type, referring page, the pages you request, and
        the time of the request. This is used to serve the site, keep it
        secure, and diagnose faults.
      </p>

      <h3>What we do not collect</h3>
      <ul>
        <li>CVs, resumes, cover letters or application materials</li>
        <li>Account credentials — there are no accounts</li>
        <li>Payment details — we never charge candidates</li>
        <li>
          Special category data such as health, ethnicity, religion or sexual
          orientation
        </li>
      </ul>

      <h2>Cookies and advertising</h2>
      <p>
        We use a small number of cookies and similar technologies. Full detail,
        including names and purposes, is in our{" "}
        <a href="/cookies">cookie policy</a>.
      </p>

      <h3>Essential storage</h3>
      <p>
        We store your cookie choice in your browser&rsquo;s local storage so we
        do not ask again on every page. This is strictly necessary and is set
        regardless of consent. It contains no identifier and is not readable by
        anyone else.
      </p>

      <h3>Advertising cookies</h3>
      <p>
        With your consent we display advertising supplied by{" "}
        <strong>Google AdSense</strong>. Where advertising is enabled:
      </p>
      <ul>
        <li>
          Google, as a third-party vendor, uses cookies to serve ads on this
          site
        </li>
        <li>
          Google&rsquo;s use of advertising cookies enables it and its partners
          to serve ads based on your visits to this and other sites
        </li>
        <li>
          Third-party vendors and ad networks may also serve ads and use
          cookies, web beacons or similar technologies to measure effectiveness
          and personalise content
        </li>
      </ul>
      <p>
        You can opt out of personalised advertising in{" "}
        <a
          href="https://myadcenter.google.com/"
          rel="nofollow noopener"
          target="_blank"
        >
          Google&rsquo;s My Ad Center
        </a>
        , and opt out of third-party vendors&rsquo; use of cookies for
        personalised advertising at{" "}
        <a
          href="https://www.aboutads.info/choices/"
          rel="nofollow noopener"
          target="_blank"
        >
          aboutads.info/choices
        </a>{" "}
        or{" "}
        <a
          href="https://www.youronlinechoices.com/"
          rel="nofollow noopener"
          target="_blank"
        >
          youronlinechoices.com
        </a>
        . You can also withdraw consent on this site at any time — see{" "}
        <a href="/cookies">the cookie policy</a>.
      </p>
      <p>
        Google&rsquo;s own handling of this data is governed by{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          rel="nofollow noopener"
          target="_blank"
        >
          how Google uses information from sites that use its services
        </a>
        .
      </p>

      <h3>Analytics</h3>
      <p>
        <Fillme>
          [If you add analytics, name the provider here, state whether data is
          aggregated or identifiable, give the retention period, and link the
          provider&rsquo;s policy. If you use a privacy-preserving,
          cookieless tool, say so — it is a point in your favour.]
        </Fillme>
      </p>

      <h2>Legal bases for processing</h2>
      <p>Where UK or EU GDPR applies, we rely on:</p>
      <ul>
        <li>
          <strong>Consent</strong> — for advertising and any non-essential
          analytics cookies. You may withdraw it at any time
        </li>
        <li>
          <strong>Legitimate interests</strong> — for operating and securing
          the site, and for responding to correspondence you initiate
        </li>
        <li>
          <strong>Legal obligation</strong> — where we must retain records to
          comply with law
        </li>
      </ul>

      <h2>Sharing and transfers</h2>
      <p>
        We do not sell personal data and we do not share it for independent
        marketing use. Data is processed by the service providers we use to run
        the site:
      </p>
      <ul>
        <li>
          <strong>Hosting and content delivery</strong> —{" "}
          <Fillme>[name your host, e.g. Vercel]</Fillme>
        </li>
        <li>
          <strong>Advertising</strong> — Google (AdSense), where consented
        </li>
        <li>
          <strong>Email</strong> — <Fillme>[your email provider]</Fillme>
        </li>
      </ul>
      <p>
        Some of these providers operate outside the UK, EEA or Canada. Where
        personal data is transferred internationally we rely on appropriate
        safeguards such as the UK International Data Transfer Addendum, EU
        Standard Contractual Clauses, or an applicable adequacy decision.
      </p>

      <h2>Retention</h2>
      <p>
        Server logs are retained for{" "}
        <Fillme>[retention period, e.g. 30 days]</Fillme>. Email
        correspondence is retained for{" "}
        <Fillme>[retention period, e.g. 24 months]</Fillme> so we can handle
        follow-ups and demonstrate how a request was resolved, then deleted.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live you may have the right to access a copy of
        your data, have inaccurate data corrected, have data deleted, restrict
        or object to processing, withdraw consent, receive your data in a
        portable form, and not be subject to solely automated decisions with
        legal effect. We do not make automated decisions about you.
      </p>
      <p>
        If you are in <strong>California</strong> or another US state with
        comprehensive privacy legislation, you may also have the right to know
        what is collected, to request deletion, and to opt out of
        &ldquo;sharing&rdquo; for cross-context behavioural advertising. Our
        consent banner is the mechanism for that opt-out, and we honour{" "}
        <strong>Global Privacy Control</strong> signals where your browser
        sends them.
      </p>
      <p>
        To exercise any right, email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> with the request type
        in the subject line. We will respond within one month, and we will not
        charge you or treat you differently for asking.
      </p>
      <p>
        If you are unhappy with our response you can complain to your
        supervisory authority — the{" "}
        <a href="https://ico.org.uk/" rel="nofollow noopener" target="_blank">
          ICO
        </a>{" "}
        in the UK, your national authority in the EEA, or the{" "}
        <a
          href="https://www.priv.gc.ca/"
          rel="nofollow noopener"
          target="_blank"
        >
          Office of the Privacy Commissioner
        </a>{" "}
        in Canada.
      </p>

      <h2>Children</h2>
      <p>
        This site is intended for people aged 16 and over who are seeking work
        or studying at post-secondary level. We do not knowingly collect
        personal data from children under 16. If you believe a child has
        provided us with data, contact us and we will delete it.
      </p>

      <h2>Links to employer sites</h2>
      <p>
        Applying for a role takes you to a third-party website we do not
        control. Once you leave, that site&rsquo;s own privacy policy governs
        what happens to the information you give it, including your CV. We
        receive nothing from your application.
      </p>

      <h2>Changes</h2>
      <p>
        We will update this page when our practices change and will revise the
        date at the top. Material changes affecting how we use your data will
        be signposted on the site rather than made quietly.
      </p>
    </ArticleShell>
  );
}
