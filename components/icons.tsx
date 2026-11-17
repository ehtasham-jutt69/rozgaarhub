import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Hand-built 24px icon set, 1.5px stroke, square-ish joins.
 * Kept in-repo so the iconography is ours rather than a stock library look.
 */
const paths: Record<string, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.25" />
      <path d="m15.8 15.8 4.2 4.2" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s6.5-5.4 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.25" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
      <path d="M8.75 7.5V5.75A1.75 1.75 0 0 1 10.5 4h3a1.75 1.75 0 0 1 1.75 1.75V7.5" />
      <path d="M3 12.5h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.75V12l3 1.75" />
    </>
  ),
  building: (
    <>
      <path d="M4 20.5V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5v15" />
      <path d="M14 10h4.5A1.5 1.5 0 0 1 20 11.5v9" />
      <path d="M3 20.5h18" />
      <path d="M7.25 8h3.5M7.25 11.75h3.5M7.25 15.5h3.5M17 14h0M17 17.25h0" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19.5 12h-15" />
      <path d="m10.5 6-6 6 6 6" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  chevronDown: <path d="m5.5 9 6.5 6.5L18.5 9" />,
  chevronRight: <path d="m9 5.5 6.5 6.5L9 18.5" />,
  filter: (
    <>
      <path d="M3.5 6.5h17" />
      <path d="M6.5 12h11" />
      <path d="M10 17.5h4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M3.75 12h16.5" />
      <path d="M12 3.75c2.2 2.3 3.4 5.2 3.4 8.25S14.2 18 12 20.25C9.8 18 8.6 15.05 8.6 12S9.8 6.05 12 3.75Z" />
    </>
  ),
  bookmark: (
    <path d="M6.5 4.5h11a.5.5 0 0 1 .5.5v14.2a.4.4 0 0 1-.63.33L12 15.5l-5.37 4.03A.4.4 0 0 1 6 19.2V5a.5.5 0 0 1 .5-.5Z" />
  ),
  coins: (
    <>
      <ellipse cx="12" cy="7" rx="7" ry="3" />
      <path d="M5 7v4.5c0 1.66 3.13 3 7 3s7-1.34 7-3V7" />
      <path d="M5 11.5V16c0 1.66 3.13 3 7 3s7-1.34 7-3v-4.5" />
    </>
  ),
  cap: (
    <>
      <path d="m2.75 9.25 9.25-4.5 9.25 4.5L12 13.75 2.75 9.25Z" />
      <path d="M6.5 11.1v4.4c0 1.4 2.46 2.75 5.5 2.75s5.5-1.35 5.5-2.75v-4.4" />
      <path d="M20.5 10v5.25" />
    </>
  ),
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M5.75 9.75V19.5h12.5V9.75" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.75 5.25 6v5.4c0 4.07 2.84 7.5 6.75 8.85 3.91-1.35 6.75-4.78 6.75-8.85V6L12 3.75Z" />
      <path d="m9.25 12 2 2 3.5-3.75" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.75 7 8.25 6 8.25-6" />
    </>
  ),
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  external: (
    <>
      <path d="M13.5 4.5H19.5V10.5" />
      <path d="M19.5 4.5 11 13" />
      <path d="M18 14.5v4A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8.5" r="3.25" />
      <path d="M3.5 19.5c0-3.04 2.69-5.5 6-5.5s6 2.46 6 5.5" />
      <path d="M16 5.6a3.25 3.25 0 0 1 0 6.3" />
      <path d="M17.5 14.4c1.84.73 3 2.33 3 4.1" />
    </>
  ),
  trending: (
    <>
      <path d="M3.5 17 9 11.5l3.5 3.5L20.5 7" />
      <path d="M15.5 7h5v5" />
    </>
  ),
  document: (
    <>
      <path d="M6 3.5h7L18.5 9v11.5A.5.5 0 0 1 18 21H6a.5.5 0 0 1-.5-.5v-16A.5.5 0 0 1 6 3.5Z" />
      <path d="M12.75 3.75V9.5h5.5" />
      <path d="M8.5 13.5h7M8.5 17h5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 10h17" />
      <path d="M8 3.5V7M16 3.5V7" />
    </>
  ),
  sliders: (
    <>
      <path d="M5 4.5v6M5 15v4.5M12 4.5v3.5M12 12.5v7M19 4.5v9M19 17.5v2" />
      <circle cx="5" cy="12.75" r="2" />
      <circle cx="12" cy="10.25" r="2" />
      <circle cx="19" cy="15.5" r="2" />
    </>
  ),
  bolt: <path d="M13.5 3 5.5 13.5h5L10 21l8-10.5h-5L13.5 3Z" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="m14.75 9.25-1.5 4.5-4.5 1.5 1.5-4.5 4.5-1.5Z" />
    </>
  ),
  quote: (
    <>
      <path d="M9.5 6.5c-2.8 1-4.5 3.4-4.5 6.3V17a.5.5 0 0 0 .5.5h3.5a.5.5 0 0 0 .5-.5v-3.5a.5.5 0 0 0-.5-.5H6" />
      <path d="M19.5 6.5c-2.8 1-4.5 3.4-4.5 6.3V17a.5.5 0 0 0 .5.5h3.5a.5.5 0 0 0 .5-.5v-3.5a.5.5 0 0 0-.5-.5H16" />
    </>
  ),
};

export type IconName = keyof typeof paths;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  className,
  ...rest
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

/** Brand mark: a stylised upward step inside a rounded square. */
export function Logomark({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" fill="var(--color-brand-500)" />
      <path
        d="M8 21.5h4.2v-5.2H8v5.2Z"
        fill="var(--color-white)"
        opacity="0.55"
      />
      <path
        d="M13.9 21.5h4.2v-9.1h-4.2v9.1Z"
        fill="var(--color-white)"
        opacity="0.78"
      />
      <path
        d="M19.8 21.5H24V8.5h-4.2v13Z"
        fill="var(--color-white)"
      />
    </svg>
  );
}
