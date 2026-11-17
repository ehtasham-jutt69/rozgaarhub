import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* -------------------------------------------------------------------------- */
/*  Dates                                                                      */
/* -------------------------------------------------------------------------- */

export function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 31) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 61) return "1 month ago";
  return `${Math.floor(days / 30)} months ago`;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/* -------------------------------------------------------------------------- */
/*  Salary                                                                     */
/* -------------------------------------------------------------------------- */

const SYMBOLS: Record<string, string> = { USD: "$", GBP: "£", CAD: "C$", EUR: "€" };

export type SalaryPeriod = "YEAR" | "MONTH" | "WEEK" | "DAY" | "HOUR";

export interface Salary {
  min: number;
  max: number;
  currency: string;
  period: SalaryPeriod;
  /** True when the figure is our own benchmark rather than employer-stated. */
  estimated?: boolean;
}

const PERIOD_SUFFIX: Record<SalaryPeriod, string> = {
  YEAR: "/yr",
  MONTH: "/mo",
  WEEK: "/wk",
  DAY: "/day",
  HOUR: "/hr",
};

/** Compact money: 54000 -> "54k", 1250 -> "1,250", 18.5 -> "18.50" */
function money(n: number, period: SalaryPeriod) {
  if (period === "HOUR") {
    return Number.isInteger(n) ? String(n) : n.toFixed(2);
  }
  if (n >= 1000) {
    const k = n / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return n.toLocaleString("en-US");
}

export function formatSalary(salary?: Salary | null) {
  if (!salary) return null;
  const sym = SYMBOLS[salary.currency] ?? "";
  const suffix = PERIOD_SUFFIX[salary.period];

  if (salary.min === salary.max) {
    return `${sym}${money(salary.min, salary.period)}${suffix}`;
  }
  return `${sym}${money(salary.min, salary.period)}–${sym}${money(salary.max, salary.period)}${suffix}`;
}

/* -------------------------------------------------------------------------- */
/*  Misc                                                                       */
/* -------------------------------------------------------------------------- */

/** Deterministic 0-100 hash, used to pick a stable logo tint per company. */
export function stableHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 100;
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 225));
}

export function pluralize(n: number, one: string, many = `${one}s`) {
  return `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;
}
