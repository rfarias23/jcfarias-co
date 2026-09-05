import Image from "next/image";
import { Shell, sectionPad } from "@/components/primitives";

export function About() {
  return (
    <Shell id="about" className={sectionPad}>
      <div className="grid items-start gap-[clamp(36px,6vw,96px)] border-t border-rule pt-14 lg:grid-cols-2 lg:pt-16">
        <div className="relative aspect-4/5 w-full max-w-[420px] bg-stone lg:max-w-none">
          <Image
            src="/images/perfil-jcf.jpg"
            alt="Juan Carlos Farias"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-8">
          <p className="eyebrow m-0 text-faint">About</p>
          <h2 className="m-0 font-serif text-[clamp(30px,4.2vw,56px)] font-light leading-[1.1] tracking-[-0.022em]">
            A firm built on one person&apos;s book, extended by a network that answers the phone.
          </h2>
          <p className="m-0 max-w-[640px] text-[16.5px] leading-[1.68] text-body">
            J.C. Farias &amp; Co. is led by Juan Carlos Farias, who has spent his career on the
            operating side of real estate and franchise growth in Peru, Ecuador, Puerto Rico and the
            Dominican Republic. The firm works on a small number of mandates at a time, with the
            principal on every call.
          </p>
          <p className="m-0 max-w-[640px] text-[16.5px] leading-[1.68] text-body">
            Around that core sits a standing network of local counsel, tax structuring, appraisal
            and construction management — assembled per transaction rather than carried as overhead.
            Clients get a specialist bench without paying for a platform.
          </p>
          <div className="flex flex-wrap gap-x-16 gap-y-7 pt-3">
            <div>
              <p className="m-0 text-[11px] font-medium tracking-[0.14em] uppercase text-faint">
                Principal
              </p>
              <p className="m-0 mt-2.5 font-serif text-2xl font-light">Juan Carlos Farias</p>
            </div>
            <div>
              <p className="m-0 text-[11px] font-medium tracking-[0.14em] uppercase text-faint">
                Editorial arm
              </p>
              <p className="m-0 mt-2.5 font-serif text-2xl font-light">JCFL</p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
