import { Shell } from "@/components/primitives";
import { offices, site } from "@/content/site";

export function ContactFooter() {
  return (
    <footer id="contact" className="mt-[clamp(72px,10vw,120px)] bg-ink text-paper">
      <Shell className="grid items-end gap-[clamp(40px,6vw,96px)] pt-[clamp(64px,9vw,110px)] pb-[clamp(56px,7vw,96px)] lg:grid-cols-2">
        <div className="flex flex-col gap-9">
          <p className="eyebrow m-0 text-white/55">Contact</p>
          <h2 className="m-0 font-serif text-[clamp(34px,5.6vw,76px)] font-light leading-[1.04] tracking-[-0.028em]">
            Bring us the situation before it becomes a process.
          </h2>
          <a
            href={"mailto:" + site.email}
            className="eyebrow flex min-h-11 items-center self-start border border-white/40 px-7 tracking-[0.15em] text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            {site.email}
          </a>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-11">
          {offices.map((office) => (
            <div key={office.city}>
              <p className="m-0 text-[11px] font-medium tracking-[0.14em] uppercase text-white/45">
                {office.city}
              </p>
              <p className="m-0 mt-3 text-[15.5px] leading-[1.6] text-white/82">
                {office.country}
                <br />
                {office.phoneNote}
              </p>
            </div>
          ))}
        </div>
      </Shell>

      <Shell className="pb-11">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-white/16 pt-7">
          <p className="m-0 font-serif text-[15px] tracking-[0.13em] uppercase text-white/82">
            {site.name}
          </p>
          <p className="meta m-0 text-white/40">{site.tagline}</p>
          <p className="meta m-0 text-white/40">© 2026 · All rights reserved</p>
        </div>
      </Shell>
    </footer>
  );
}
