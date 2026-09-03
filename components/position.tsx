import { Shell, sectionPad } from "@/components/primitives";

export function Position() {
  return (
    <Shell className={sectionPad}>
      <div className="grid gap-7 md:grid-cols-[minmax(0,180px)_minmax(0,1fr)] md:gap-[clamp(28px,4vw,80px)]">
        <p className="eyebrow m-0 text-faint">Position</p>
        <p className="m-0 max-w-[1020px] font-serif text-[clamp(24px,3.1vw,40px)] font-light leading-[1.34] tracking-[-0.014em] text-pretty">
          Global brokerages bring balance sheets to markets they do not know. We bring the
          counterparty, the criterion and the twenty years of relationships that decide whether a
          transaction closes — and we do it as principals in the outcome, not as intermediaries in
          the fee.
        </p>
      </div>
    </Shell>
  );
}
