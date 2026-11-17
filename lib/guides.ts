import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings, {
  type Options as AutolinkOptions,
} from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { readingTime } from "@/lib/utils";
import type { Guide, GuideFrontmatter } from "@/lib/types";

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

const autolinkOptions: AutolinkOptions = {
  behavior: "append",
  properties: {
    className: ["heading-anchor"],
    ariaHidden: "true",
    tabIndex: -1,
  },
  content: { type: "text", value: "#" },
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, autolinkOptions)
  .use(rehypeStringify, { allowDangerousHtml: true });

/** Pull h2/h3 anchors straight out of the rendered HTML so ids always match. */
function extractHeadings(html: string) {
  const out: { id: string; text: string; level: number }[] = [];
  const re = /<h([23])\s+id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const text = m[3]
      .replace(/<[^>]+>/g, "")
      .replace(/#$/, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#x26;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;|&apos;/g, "'")
      .trim();
    out.push({ id: m[2], text, level: Number(m[1]) });
  }
  return out;
}

/**
 * Tag the first paragraph as the standfirst/lede so it gets the larger
 * opening treatment without the author needing to add markup.
 */
function markLede(html: string) {
  return html.replace(/<p>/, '<p class="lede">');
}

function listFiles() {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".md"));
}

let cache: Guide[] | null = null;

export function getAllGuides(): Guide[] {
  if (cache) return cache;

  const guides = listFiles().map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const fm = data as GuideFrontmatter;

    const html = markLede(String(processor.processSync(content)));

    return {
      ...fm,
      slug,
      html,
      readingMinutes: readingTime(content),
      headings: extractHeadings(html),
    } satisfies Guide;
  });

  cache = guides.sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
  return cache;
}

export function getGuide(slug: string) {
  return getAllGuides().find((g) => g.slug === slug);
}

export function getGuideSlugs() {
  return listFiles().map((f) => f.replace(/\.md$/, ""));
}

export function getFeaturedGuides(limit = 3) {
  const all = getAllGuides();
  const featured = all.filter((g) => g.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export function getRelatedGuides(guide: Guide, limit = 3) {
  const all = getAllGuides().filter((g) => g.slug !== guide.slug);

  // Explicit `related` in frontmatter wins.
  const explicit = (guide.related ?? [])
    .map((slug) => all.find((g) => g.slug === slug))
    .filter((g): g is Guide => Boolean(g));

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const sameCategory = all
    .filter(
      (g) => g.category === guide.category && !explicit.some((e) => e.slug === g.slug),
    )
    .slice(0, limit - explicit.length);

  const combined = [...explicit, ...sameCategory];
  if (combined.length >= limit) return combined.slice(0, limit);

  const filler = all
    .filter((g) => !combined.some((c) => c.slug === g.slug))
    .slice(0, limit - combined.length);

  return [...combined, ...filler];
}

export function getGuideCategories() {
  const all = getAllGuides();
  const map = new Map<string, number>();
  for (const g of all) map.set(g.category, (map.get(g.category) ?? 0) + 1);
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
