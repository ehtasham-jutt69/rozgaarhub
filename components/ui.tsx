import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn, stableHash } from "@/lib/utils";
import { Icon, type IconName } from "@/components/icons";

/* -------------------------------------------------------------------------- */
/*  Button                                                                     */
/* -------------------------------------------------------------------------- */

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white border border-brand-700 hover:bg-brand-800 hover:border-brand-800 shadow-green",
  secondary:
    "bg-white text-ink border border-gray-300 hover:border-brand-500 hover:text-brand-700",
  accent:
    "bg-white text-brand-700 border border-brand-500 hover:bg-brand-50",
  ghost: "bg-transparent text-brand-700 border border-transparent hover:bg-brand-50",
};

/* Fully rounded, like the reference site's buttons. */
const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem] gap-1.5 rounded-full",
  md: "h-11 px-5 text-sm gap-2 rounded-full",
  lg: "h-13 px-7 text-base gap-2 rounded-full",
};

const BUTTON_BASE =
  "inline-flex items-center justify-center font-medium " +
  "disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(BUTTON_BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link
      className={cn(BUTTON_BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Badge / Chip                                                               */
/* -------------------------------------------------------------------------- */

type BadgeTone = "neutral" | "brand" | "accent" | "outline" | "sample";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-gray-100 text-gray-700 border-gray-200",
  brand: "bg-brand-50 text-brand-700 border-brand-200",
  accent: "bg-accent-50 text-accent-700 border-accent-200",
  outline: "bg-transparent text-gray-600 border-gray-300",
  sample: "bg-gray-100 text-gray-600 border-dashed border-gray-400",
};

export function Badge({
  tone = "neutral",
  icon,
  className,
  children,
}: {
  tone?: BadgeTone;
  icon?: IconName;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[4px]",
        "text-[0.75rem] font-medium leading-tight",
        TONES[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={13} strokeWidth={1.75} />}
      {children}
    </span>
  );
}

/** Metadata item used in dense job rows: icon + text, no border. */
export function MetaItem({
  icon,
  children,
  className,
}: {
  icon: IconName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-600",
        className,
      )}
    >
      <Icon name={icon} size={14} strokeWidth={1.6} className="text-gray-500" />
      <span className="truncate">{children}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section heading                                                            */
/* -------------------------------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        centered
          ? "flex flex-col items-center text-center"
          : "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow && (
          <span className="mb-4 inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand-700">
            {eyebrow}
          </span>
        )}
        <h2 className="text-display-sm md:text-display-md text-balance">
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-4 text-[1.0625rem] leading-relaxed text-gray-600 text-pretty",
              centered && "mx-auto max-w-xl",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className={cn("shrink-0", centered && "mt-7")}>{action}</div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Company avatar (monogram — no external logo requests)                      */
/* -------------------------------------------------------------------------- */

const TINTS = [
  "bg-brand-100 text-brand-800 border-brand-200",
  "bg-accent-100 text-accent-800 border-accent-200",
  "bg-gray-200 text-gray-700 border-gray-300",
  "bg-brand-800 text-brand-100 border-brand-900",
];

export function CompanyAvatar({
  name,
  size = 44,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .replace(/[^A-Za-z0-9 &]/g, "")
    .split(/\s+/)
    .filter((w) => w !== "&" && w.length > 0)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  const tint = TINTS[stableHash(name) % TINTS.length];

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-[14px] border font-semibold",
        tint,
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials || "?"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Structured data                                                            */
/* -------------------------------------------------------------------------- */

export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // Schema objects are built server-side from our own typed data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Breadcrumbs                                                                */
/* -------------------------------------------------------------------------- */

export function Breadcrumbs({
  trail,
  className,
}: {
  trail: { name: string; path: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-gray-600">
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 && (
                <Icon
                  name="chevronRight"
                  size={13}
                  className="text-gray-400"
                />
              )}
              {last ? (
                <span className="font-medium text-gray-700" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="underline decoration-gray-300 decoration-1 underline-offset-[3px] hover:text-brand-700 hover:decoration-brand-400"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empty state                                                                */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  icon = "search",
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
      <span className="mb-4 grid size-11 place-items-center rounded-xl border border-gray-200 bg-white text-gray-500">
        <Icon name={icon} size={20} />
      </span>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
