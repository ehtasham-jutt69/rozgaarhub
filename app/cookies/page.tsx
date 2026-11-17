import type { Metadata } from "next";
import { site } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import { ArticleShell, Fillme } from "@/components/page-shell";
import { ConsentControls } from "@/components/ads";

export const metadata: Metadata = buildMetadata({
  title: "Cookie policy",
  description: `Which cookies ${site.name} uses, what each one does, and how to change or withdraw your consent at any time.`,
  path: "/cookies",
});

export default function CookiePolicyPage() {
  return (
    <ArticleShell
      title="Cookie policy"
      standfirst="We keep this short because we use very few cookies. Here is each one, what it does, and how to switch the optional ones off."
      trail={[
        { name: "Home", path: "/" },
        { name: "Cookie policy", path: "/cookies" },
      ]}
      updated="2026-11-12"
    >
      <h2>Change your choice</h2>
      <p>
        You can turn advertising cookies on or off here at any time. Turning
        them off does not limit any part of the site — the listings and guides
        are identical either way.
      </p>

      <ConsentControls />

      <h2>What a cookie is</h2>
      <p>
        A cookie is a small file a website asks your browser to store. Related
        technologies — local storage, pixels and web beacons — do similar jobs,
        and we use the word &ldquo;cookie&rdquo; here to cover all of them.
      </p>

      <h2>Strictly necessary</h2>
      <p>
        These are set regardless of consent, because without them the site
        cannot work or cannot respect your choices.
      </p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>rh.consent.v1</code>
            </td>
            <td>Local storage</td>
            <td>
              Remembers whether you accepted or declined advertising cookies,
              so you are not asked on every page.
            </td>
            <td>Until you clear site data</td>
          </tr>
        </tbody>
      </table>

      <p>
        This entry holds one word — <code>granted</code> or{" "}
        <code>denied</code>. It contains no identifier, nothing about you, and
        it is never transmitted to us or to anyone else.
      </p>

      <h2>Advertising — optional, off by default</h2>
      <p>
        Advertising pays for the site. These cookies are set only after you
        choose &ldquo;Accept all&rdquo;, and are set by Google rather than by
        us, which means we cannot list every name — Google changes them and the
        exact set depends on the ads served.
      </p>

      <table>
        <thead>
          <tr>
            <th>Set by</th>
            <th>Purpose</th>
            <th>More information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google AdSense</td>
            <td>
              Serves ads, measures performance, limits how often you see the
              same ad, and detects invalid traffic. May personalise ads based on
              your visits to this and other sites.
            </td>
            <td>
              <a
                href="https://policies.google.com/technologies/partner-sites"
                rel="nofollow noopener"
                target="_blank"
              >
                How Google uses this data
              </a>
            </td>
          </tr>
          <tr>
            <td>Third-party ad vendors</td>
            <td>
              Where Google serves ads from partner networks, those vendors may
              set their own cookies for measurement and personalisation.
            </td>
            <td>
              <a
                href="https://www.aboutads.info/choices/"
                rel="nofollow noopener"
                target="_blank"
              >
                Industry opt-out
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Analytics</h2>
      <p>
        <Fillme>
          [If you add analytics, list the cookies it sets here, or state that
          your chosen tool is cookieless. Do not leave this section as a
          placeholder once analytics is live.]
        </Fillme>
      </p>

      <h2>What we do not use</h2>
      <ul>
        <li>Social media tracking pixels</li>
        <li>Cross-site advertising retargeting of our own</li>
        <li>Fingerprinting or any technique designed to evade cookie controls</li>
        <li>Session recording or heatmap tools</li>
      </ul>

      <h2>Controlling cookies in your browser</h2>
      <p>
        Beyond the control at the top of this page, every major browser lets you
        block or delete cookies in its settings, and offers a private or
        incognito mode that discards them when you close the window. Blocking
        all cookies may affect other websites you use.
      </p>
      <p>
        If your browser sends a <strong>Global Privacy Control</strong> signal,
        we treat it as a withdrawal of consent to advertising cookies.
      </p>

      <div className="callout">
        <p className="callout-title">If you are launching this site</p>
        <p>
          <Fillme>
            Google requires publishers serving ads to users in the EEA and UK to
            use a Google-certified Consent Management Platform. The banner
            shipped here is a clean, honest starting point, but it is{" "}
            <strong>not</strong> a certified CMP and will not satisfy that
            requirement on its own. Install a certified CMP before you enable
            ads for European traffic, and update this page to describe it.
          </Fillme>
        </p>
      </div>
    </ArticleShell>
  );
}
