/**
 * REAL reviews only.
 *
 * This array ships EMPTY on purpose. The site has not had users yet, so there
 * are no genuine testimonials to show, and inventing them would be both
 * dishonest and a direct AdSense policy problem (fabricated endorsements are
 * treated as deceptive content).
 *
 * The homepage section that renders these returns `null` while the array is
 * empty — no placeholder cards, no "coming soon" state, nothing. The moment
 * you add a real entry the section appears automatically.
 *
 * Before adding one, you need:
 *   - the person's explicit written permission to publish their words,
 *     first name, role and institution;
 *   - their actual wording, not a tidied-up paraphrase;
 *   - something verifiable where possible (the role they were hired into,
 *     the month, the employer) — vague praise persuades nobody.
 *
 * Good: "I applied to 31 roles off the sponsorship filter and got 4 first-round
 *        interviews in three weeks. The filter saved me the ones that would
 *        never sponsor." — Priya R., MSc Data Science, Manchester, March 2027
 *
 * Bad:  "This website transformed my job search!" — Student
 */

export interface Testimonial {
  /** The person's own words, unedited. */
  quote: string;
  /** First name + initial is enough; never publish a full name without consent. */
  name: string;
  /** e.g. "MSc Data Science, University of Manchester" */
  role: string;
  /** Market the person was searching in. */
  market: "us" | "uk" | "ca";
  /** Month and year the outcome happened, e.g. "March 2027". */
  date: string;
  /** Optional concrete outcome, e.g. "Hired as Graduate Data Analyst". */
  outcome?: string;
  /** Where you obtained it, for your own records. Not rendered. */
  source?: string;
}

export const testimonials: Testimonial[] = [];
