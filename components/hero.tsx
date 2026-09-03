import { Shell } from "@/components/primitives";

export type HeroMode = "editorial" | "full-bleed";

/**
 * Two approved hero treatments. "editorial" is the shipped default: stacked
 * serif lines with the positioning statement in the right column, collapsing to
 * one column under lg.
 */
export function Hero({ mode = "editorial" }: { mode?: HeroMode }) {
  if (mode === "full-bleed") {
    return (
      <Shell id="top">
        <div className="pt-[clamp(48px,7vw,96px)]">
          <p className="eyebrow m-0 mb-7 text-faint">
            Real Estate Advisory · Andes &amp; Caribbean
          </p>
          <h1 className="m-0 max-w-[1180px] font-serif text-[clamp(38px,7.4vw,96px)] font-light leading-[1.04] tracking-[-0.026em]">
            Real Estate. Partnerships. Value Creation.
          </h1>
        </div>
      </Shell>
    );
  }

  return (
    <Shell id="top">
      <div className="grid items-end gap-[clamp(32px,5vw,80px)] pt-[clamp(56px,9vw,132px)] pb-[clamp(48px,7vw,96px)] lg:grid-cols-[1.35fr_0.65fr]">
        <h1 className="m-0 font-serif text-[clamp(44px,8.4vw,124px)] font-light leading-[0.98] tracking-[-0.028em] text-balance">
          Real Estate.
          <br />
          Partnerships.
          <br />
          Value Creation.
        </h1>
        <div className="flex flex-col gap-[22px] lg:pb-3.5">
          <div className="h-px w-11 bg-ink" />
          <p className="m-0 max-w-[46ch] text-[16.5px] leading-[1.62] text-body">
            An advisory firm for institutional and private capital across the Andes and the
            Caribbean. We originate, structure and steward the transactions that global platforms
            cannot reach locally.
          </p>
          <p className="eyebrow m-0 tracking-[0.15em] text-faint">
            Lima · Quito · San Juan · Santo Domingo
          </p>
        </div>
      </div>
    </Shell>
  );
}
