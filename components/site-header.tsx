"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/site.config";
import { cn } from "@/lib/utils";
import { Icon, Logomark } from "@/components/icons";
import { ButtonLink } from "@/components/ui";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80"
            aria-label={`${site.name} home`}
          >
            <Logomark size={30} />
            <span className="font-display text-[1.175rem] font-semibold tracking-[-0.02em] text-ink">
              {site.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 text-[0.9375rem] font-medium",
                      isActive(item.href)
                        ? "text-brand-700"
                        : "text-gray-700 hover:text-brand-700",
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="absolute inset-x-3.5 -bottom-[21px] h-[3px] rounded-full bg-brand-500" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/jobs"
              className="grid size-11 place-items-center rounded-full border border-gray-300 bg-white text-gray-600 hover:border-brand-500 hover:text-brand-700"
              aria-label="Search jobs"
            >
              <Icon name="search" size={17} />
            </Link>
            <ButtonLink href="/jobs?level=internship" size="sm" variant="primary">
              Browse internships
            </ButtonLink>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-full border border-gray-300 bg-white text-ink lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} size={19} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-nav"
          className="border-t border-gray-200 bg-white lg:hidden"
        >
          <nav aria-label="Mobile" className="container-page py-4">
            <ul className="flex flex-col">
              {site.nav.map((item) => (
                <li key={item.href} className="border-b border-gray-200/80">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between py-3.5 text-[0.9375rem] font-medium",
                      isActive(item.href) ? "text-brand-700" : "text-gray-700",
                    )}
                  >
                    {item.label}
                    <Icon
                      name="chevronRight"
                      size={16}
                      className="text-gray-400"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2.5">
              <ButtonLink href="/jobs?level=internship" size="lg" className="w-full">
                Browse internships
              </ButtonLink>
              <ButtonLink
                href="/guides"
                size="lg"
                variant="secondary"
                className="w-full"
              >
                Read career guides
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
