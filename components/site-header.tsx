"use client";

import { useEffect, useState } from "react";
import { navLinks, offices, site } from "@/content/site";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-rule bg-paper/94 backdrop-blur-lg">
        <div className="shell flex min-h-[64px] items-center justify-between gap-6 md:min-h-[76px]">
          <a
            href="#top"
            className="font-serif text-[16px] font-normal tracking-[0.13em] whitespace-nowrap uppercase sm:text-[19px]"
          >
            {site.name}
          </a>

          <nav className="hidden items-center gap-[clamp(16px,2.2vw,34px)] lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="eyebrow tracking-[0.15em] text-mute transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="eyebrow border border-ink px-5 py-[11px] tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Contact
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="-mr-2.5 flex size-11 items-center justify-center lg:hidden"
          >
            <span className="flex w-6 flex-col gap-[6px]">
              <span className="h-px w-full bg-ink" />
              <span className="h-px w-full bg-ink" />
              <span className="h-px w-full bg-ink" />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu. Always mounted so it can transition. */}
      <div
        className={cn(
          "fixed inset-0 z-60 flex flex-col bg-ink text-paper transition-opacity duration-300 lg:hidden",
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="shell flex min-h-[64px] shrink-0 items-center justify-between gap-6">
          <span className="font-serif text-[16px] tracking-[0.13em] uppercase sm:text-[19px]">
            {site.name}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="-mr-2.5 flex size-11 items-center justify-center"
          >
            <span className="relative block size-5">
              <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-paper" />
              <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-paper" />
            </span>
          </button>
        </div>

        <nav className="shell flex flex-1 flex-col justify-center gap-2 py-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center font-serif text-[clamp(34px,10vw,56px)] font-light tracking-[-0.02em]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 flex min-h-11 items-center font-serif text-[clamp(34px,10vw,56px)] font-light tracking-[-0.02em] text-white/55"
          >
            Contact
          </a>
        </nav>

        <div className="shell shrink-0 border-t border-white/16 py-7">
          <a href={"mailto:" + site.email} className="meta font-medium text-white/80">
            {site.email}
          </a>
          <p className="meta mt-4 mb-0 text-white/40">{offices.map((o) => o.city).join(" · ")}</p>
        </div>
      </div>
    </>
  );
}
