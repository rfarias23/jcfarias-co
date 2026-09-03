import { Shell, SectionHead, sectionPad } from "@/components/primitives";
import type { Transaction } from "@/lib/types";

const cols =
  "grid grid-cols-[minmax(140px,1.5fr)_minmax(120px,1fr)_minmax(96px,0.85fr)_minmax(150px,1.2fr)_minmax(56px,0.45fr)] gap-x-4";

/**
 * The table keeps all five columns at every size — the row is the credibility
 * artefact and stacking it into cards dilutes it. Under lg the track scrolls
 * horizontally inside the shell instead.
 */
export function Transactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Shell id="transactions" className={sectionPad}>
      <SectionHead title="Selected Transactions" aside="Counterparties withheld by mandate" />

      <div className="-mx-[clamp(20px,4vw,56px)] overflow-x-auto px-[clamp(20px,4vw,56px)] lg:mx-0 lg:overflow-visible lg:px-0">
        <div className="min-w-[860px] lg:min-w-0">
          <div className={cols + " border-b border-rule py-[18px]"}>
            {["Asset class", "Market", "Scale", "Role", "Year"].map((head, i) => (
              <p
                key={head}
                className={
                  "m-0 text-[11px] font-medium tracking-[0.14em] uppercase text-faint" +
                  (i === 4 ? " text-right" : "")
                }
              >
                {head}
              </p>
            ))}
          </div>

          {transactions.map((deal) => (
            <div
              key={deal.asset + deal.year}
              className={
                cols + " items-baseline border-b border-rule py-6 transition-colors hover:bg-wash"
              }
            >
              <p className="m-0 font-serif text-[clamp(19px,2vw,26px)] font-light leading-[1.16] tracking-[-0.012em]">
                {deal.asset}
              </p>
              <p className="m-0 text-[15.5px] text-body">{deal.market}</p>
              <p className="tnum m-0 text-[15.5px] text-body">{deal.scale}</p>
              <p className="m-0 text-[15.5px] text-mute">{deal.role}</p>
              <p className="tnum m-0 text-right text-[15.5px] text-mute">{deal.year}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="meta m-0 pt-4 text-faint lg:hidden">Scroll for the full record →</p>
    </Shell>
  );
}
