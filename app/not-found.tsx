import type { Metadata } from "next";
import Link from "next/link";
import { ContactFooter } from "@/components/contact-footer";
import { Eyebrow, Shell, sectionPad } from "@/components/primitives";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

/** 404 inside the site's own chrome. Copy approved by the owner (spec 013). */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <Shell className={sectionPad}>
          <div className="flex max-w-[640px] flex-col gap-8">
            <Eyebrow>404</Eyebrow>
            <h1 className="m-0 font-serif text-[clamp(30px,4.2vw,56px)] font-light leading-[1.1] tracking-[-0.022em]">
              This page is not on the record.
            </h1>
            <p className="m-0 text-[16.5px] leading-[1.68] text-body">
              The address may have changed or never existed. The practice, transactions and notes
              are on the home page.
            </p>
            <Link
              href="/"
              className="eyebrow inline-flex min-h-11 items-center self-start border border-ink px-5 py-[11px] tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Back to home
            </Link>
          </div>
        </Shell>
      </main>
      <ContactFooter />
    </>
  );
}
