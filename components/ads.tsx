"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";

const CONSENT_KEY = "rh.consent.v1";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Broadcast so every AdSlot on the page reacts to a consent decision. */
const CONSENT_EVENT = "rh:consent";

export function useConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
    const onChange = () => setConsent(readConsent());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return { consent, ready };
}

export function setConsent(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* private mode — fall through, ads simply stay off */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/* -------------------------------------------------------------------------- */
/*  AdSense loader                                                             */
/* -------------------------------------------------------------------------- */

export function AdSenseScript() {
  const { consent } = useConsent();
  if (!ADSENSE_CLIENT || consent !== "granted") return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Ad slot                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Reserves its own height so enabling ads cannot shift layout (protects CLS).
 * Renders nothing at all until a client ID is configured AND consent granted,
 * which keeps the pre-approval site free of ad markup.
 */
export function AdSlot({
  slot,
  format = "auto",
  minHeight = 280,
  label = true,
  className,
}: {
  slot?: string;
  format?: "auto" | "fluid" | "horizontal" | "rectangle";
  minHeight?: number;
  label?: boolean;
  className?: string;
}) {
  const { consent, ready } = useConsent();
  const enabled = Boolean(ADSENSE_CLIENT) && consent === "granted";

  useEffect(() => {
    if (!enabled) return;
    try {
      // @ts-expect-error — injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* the script may not have loaded yet; AdSense retries on its own */
    }
  }, [enabled, slot]);

  if (!ready || !ADSENSE_CLIENT) return null;

  return (
    <aside
      className={cn("my-8", className)}
      aria-label="Advertisement"
      style={{ minHeight }}
    >
      {label && (
        <p className="mb-1.5 text-[0.625rem] uppercase tracking-[0.12em] text-gray-400">
          Advertisement
        </p>
      )}
      {enabled ? (
        <ins
          className="adsbygoogle block"
          style={{ display: "block", minHeight }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className="grid place-items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-[0.75rem] text-gray-500"
          style={{ minHeight }}
        >
          Ad space — enabled once cookies are accepted
        </div>
      )}
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Consent controls — rendered on the cookie policy page                      */
/* -------------------------------------------------------------------------- */

export function ConsentControls() {
  const { consent, ready } = useConsent();

  const label =
    consent === "granted"
      ? "Advertising cookies are currently ON for this browser."
      : consent === "denied"
        ? "Advertising cookies are currently OFF for this browser."
        : "You have not made a choice yet in this browser.";

  return (
    <div className="not-prose rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="font-sans text-[0.9375rem] font-semibold text-ink">
        Your current choice
      </h2>
      <p className="mt-2 flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-gray-700">
        <Icon
          name={consent === "granted" ? "check" : "shield"}
          size={16}
          className="mt-0.5 shrink-0 text-brand-700"
        />
        {ready ? label : "Checking…"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setConsent("granted")}
          className="h-9 rounded-xl border border-brand-900 bg-brand-800 px-3.5 text-[0.8125rem] font-medium text-gray-50 hover:bg-brand-900"
        >
          Turn advertising cookies on
        </button>
        <button
          type="button"
          onClick={() => setConsent("denied")}
          className="h-9 rounded-xl border border-gray-300 bg-white px-3.5 text-[0.8125rem] font-medium text-ink hover:bg-gray-50"
        >
          Turn them off
        </button>
      </div>

      <p className="mt-3 text-[0.75rem] leading-relaxed text-gray-500">
        Your choice is stored in this browser only. Clearing site data or using
        a different browser or device will reset it.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Consent banner                                                             */
/* -------------------------------------------------------------------------- */

export function ConsentBanner() {
  const { consent, ready } = useConsent();
  const [dismissed, setDismissed] = useState(false);

  if (!ready || consent !== null || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-300 bg-white/97"
    >
      <div className="container-page flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex gap-3">
          <Icon
            name="shield"
            size={20}
            className="mt-0.5 shrink-0 text-brand-700"
          />
          <p className="text-[0.8125rem] leading-relaxed text-gray-700">
            We use essential cookies to run the site. With your consent we also
            use advertising cookies, which is how we keep the job listings and
            guides free to read. Read our{" "}
            <a
              href="/cookies"
              className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-[3px]"
            >
              cookie policy
            </a>
            .
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => {
              setConsent("denied");
              setDismissed(true);
            }}
            className="h-10 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-ink hover:bg-gray-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => {
              setConsent("granted");
              setDismissed(true);
            }}
            className="h-10 rounded-xl border border-brand-900 bg-brand-800 px-4 text-sm font-medium text-gray-50 shadow-raise hover:bg-brand-900"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
