import type { Metadata } from "next";
import { site } from "@/site.config";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs, JsonLd } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";
import { Fillme } from "@/components/page-shell";

export const metadata: Metadata = buildMetadata({
  title: "Contact us",
  description: `How to reach ${site.name} — corrections to a guide, a problem with a listing, an employer enquiry, or a privacy request.`,
  path: "/contact",
});

const ROUTES: {
  icon: IconName;
  heading: string;
  body: string;
  email: string;
  note?: string;
}[] = [
  {
    icon: "document",
    heading: "Corrections and editorial",
    body: "If a guide is wrong, out of date, or unclear, tell us what and where. We check every report and note substantive corrections on the page with a date.",
    email: site.editorialEmail,
    note: "We aim to respond within two working days.",
  },
  {
    icon: "briefcase",
    heading: "A problem with a listing",
    body: "Expired role still showing, a broken application link, a salary we have reported wrongly, or a listing you believe is a scam. Include the listing URL.",
    email: site.email,
    note: "Suspected fraudulent listings are reviewed the same day.",
  },
  {
    icon: "building",
    heading: "Employers and universities",
    body: "To have roles included, or to talk about a careers-service partnership. Note that we do not sell placement — inclusion is editorial and free.",
    email: site.email,
  },
  {
    icon: "shield",
    heading: "Privacy and data requests",
    body: "Access, deletion or objection requests under UK GDPR, the EU GDPR, PIPEDA or applicable US state privacy law. Put the request type in the subject line.",
    email: site.email,
    note: "We respond within the statutory period, generally one month.",
  },
];

export default function ContactPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <header className="border-b border-gray-200 bg-brand-50">
        <div className="container-page py-9 md:py-12">
          <Breadcrumbs trail={trail} className="mb-6" />
          <div className="max-w-3xl">
            <h1 className="text-display-sm md:text-display-md text-balance">
              Contact us
            </h1>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-gray-700 text-pretty md:text-[1.125rem]">
              A real person reads everything sent to these addresses. Pick the
              one that fits and you will get to the right place faster.
            </p>
          </div>
        </div>
      </header>

      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ul className="grid gap-5 sm:grid-cols-2">
              {ROUTES.map((r) => (
                <li
                  key={r.heading}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <span className="grid size-9 place-items-center rounded-xl border border-gray-200 bg-gray-50 text-brand-700">
                    <Icon name={r.icon} size={17} />
                  </span>
                  <h2 className="mt-4 font-sans text-[0.9375rem] font-semibold text-ink">
                    {r.heading}
                  </h2>
                  <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-gray-600">
                    {r.body}
                  </p>
                  <a
                    href={`mailto:${r.email}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-700 underline decoration-brand-300 underline-offset-[3px] hover:decoration-brand-600"
                  >
                    <Icon name="mail" size={14} />
                    {r.email}
                  </a>
                  {r.note && (
                    <p className="mt-2 text-[0.75rem] text-gray-500">
                      {r.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-dashed border-gray-400 bg-brand-50 p-5">
              <p className="text-[0.8125rem] leading-relaxed text-gray-700">
                <Fillme>
                  Before launch: replace these placeholder addresses with real,
                  monitored mailboxes on your own domain, and add the registered
                  business address below. AdSense reviewers check that a
                  contact route genuinely works — a bouncing address is a common
                  reason for rejection. A contact form can be added later as a
                  route handler; email is sufficient to launch.
                </Fillme>
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="font-sans text-[0.9375rem] font-semibold text-ink">
                Postal address
              </h2>
              <address className="mt-3 text-[0.875rem] not-italic leading-relaxed text-gray-700">
                {site.legalName}
                <br />
                <Fillme>[Street address]</Fillme>
                <br />
                <Fillme>[City, postcode]</Fillme>
                <br />
                <Fillme>[Country]</Fillme>
              </address>

              <hr className="my-6 border-gray-200" />

              <h2 className="font-sans text-[0.9375rem] font-semibold text-ink">
                What we cannot help with
              </h2>
              <ul className="mt-3 flex flex-col gap-2.5">
                {[
                  "Applying on your behalf — all applications go directly to the employer.",
                  "The status of an application you have already submitted. Only the employer can tell you that.",
                  "Individual legal or immigration advice. Our guides are general information; please speak to a qualified adviser.",
                  "Reviewing or rewriting your CV. Our guides cover the method instead.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Icon
                      name="close"
                      size={14}
                      strokeWidth={1.75}
                      className="mt-1 shrink-0 text-gray-400"
                    />
                    <span className="text-[0.8125rem] leading-relaxed text-gray-600">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>

              <hr className="my-6 border-gray-200" />

              <p className="flex gap-2.5 text-[0.75rem] leading-relaxed text-gray-500">
                <Icon name="shield" size={14} className="mt-px shrink-0" />
                We will never ask you for payment, bank details or identity
                documents. If you receive a message claiming to be from us that
                does, it is not us — please report it to the address above.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
