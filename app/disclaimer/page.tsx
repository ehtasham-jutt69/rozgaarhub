import type { Metadata } from "next";
import { site } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import { ArticleShell } from "@/components/page-shell";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description: `The limits of what ${site.name} can tell you: listings are not offers, guides are not professional advice, and how to spot a recruitment scam.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <ArticleShell
      title="Disclaimer"
      standfirst="What this site can and cannot tell you — stated plainly, because being vague about it would not help you."
      trail={[
        { name: "Home", path: "/" },
        { name: "Disclaimer", path: "/disclaimer" },
      ]}
      updated="2026-11-12"
    >
      <h2>Listings are not job offers</h2>
      <p>
        A listing on this site is an index entry pointing to a vacancy
        advertised elsewhere. It is not an offer of employment, and seeing a
        role here confers no entitlement to apply, to be considered, or to be
        interviewed. Hiring decisions belong entirely to the employer.
      </p>
      <p>
        We also cannot confirm that a role is still open. Employers close
        vacancies without notifying job boards, and a listing may remain
        visible for a short period after the employer has stopped accepting
        applications.
      </p>

      <h2>Salary figures</h2>
      <p>
        Where we show a pay range, it is reproduced from the employer&rsquo;s
        own advertisement. Where a figure is our estimate it is labelled{" "}
        <strong>Estimated</strong> on the listing. Advertised ranges are not
        guarantees: the actual offer depends on your experience, the interview
        outcome, location and the employer&rsquo;s internal banding. Benchmarks
        on our <a href="/salaries">salaries page</a> are computed from
        advertised ranges in our own index, and we publish the sample size so
        you can judge how much weight to give them. A median drawn from a
        handful of listings is indicative at best.
      </p>

      <h2>Guides are not professional advice</h2>
      <p>
        Our career guides are general information for a general audience. They
        are <strong>not</strong> legal, immigration, tax, financial or careers
        advice, and no relationship of professional adviser and client is
        created by reading them.
      </p>
      <p>This matters most in two areas:</p>
      <ul>
        <li>
          <strong>Employment and pay law.</strong> Minimum wage rules, worker
          status and the treatment of unpaid internships differ by country and,
          in Canada and the US, by province or state. They also change
        </li>
        <li>
          <strong>Immigration and work authorisation.</strong> Visa routes,
          eligibility criteria, application windows and permitted working hours
          change frequently, sometimes at short notice, and always depend on
          your individual history and status
        </li>
      </ul>
      <p>
        We cite the official source wherever we state a rule. That source, as it
        reads on the day you act, is authoritative — not our summary of it.
        Before making a decision that affects your money, your job or your
        immigration status, check it there and speak to a qualified adviser,
        your university international office, careers service or
        students&rsquo; union.
      </p>

      <h2>Visa sponsorship flags</h2>
      <p>
        Where a listing is marked as offering visa sponsorship, that reflects
        what the employer stated in the advertisement at the time we indexed it.
        Employers change sponsorship policy, licences lapse, and an individual
        hiring manager may not be able to sponsor even where the company
        generally does. Treat the flag as a filter that saves you time, not as a
        commitment by the employer.
      </p>
      <p>
        Equally, the absence of a flag does not prove an employer will not
        sponsor. Many adverts simply do not mention it.
      </p>

      <h2>Third-party content</h2>
      <p>
        We link to employer websites, government sources and other third
        parties. We do not control those sites and are not responsible for their
        content or availability. Advertising displayed on this site is served by
        third parties and is not an endorsement by us — see our{" "}
        <a href="/cookies">cookie policy</a> for how that works.
      </p>

      <h2>Recruitment scams</h2>
      <p>
        Job seekers are a target for fraud, and new graduates are targeted most.
        No legitimate employer and no legitimate job board will do any of the
        following. Treat every one of them as a stop signal:
      </p>
      <ul>
        <li>
          Ask you to <strong>pay</strong> for an application, training,
          equipment, a visa, a background check or a &ldquo;guaranteed&rdquo;
          placement
        </li>
        <li>
          Send you money to buy equipment, or ask you to process payments,
          receive and forward goods, or move funds through your own bank
          account — this is money laundering and the liability lands on you
        </li>
        <li>
          Offer a job with <strong>no interview</strong>, or conduct the entire
          process over a messaging app
        </li>
        <li>
          Request your bank details, national insurance or social security
          number, or copies of identity documents <em>before</em> a written
          offer from a verified company address
        </li>
        <li>
          Use a free email domain for official correspondence, or a domain that
          is a near-miss of a real company&rsquo;s
        </li>
        <li>
          Pressure you to accept within hours, or to keep the offer
          confidential
        </li>
      </ul>
      <p>
        If a listing you found here looks fraudulent, please{" "}
        <a href="/contact">tell us</a> with the URL. We review reports the same
        day and remove confirmed scams. You can also report fraud to Action
        Fraud in the UK, the FTC in the US, or the Canadian Anti-Fraud Centre.
      </p>

      <h2>No guarantee of outcome</h2>
      <p>
        Using this site, following our guides, or applying to roles we list does
        not guarantee an interview, an offer or a job. Anyone promising you a
        guaranteed job outcome is selling you something.
      </p>
    </ArticleShell>
  );
}
