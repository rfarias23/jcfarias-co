import { Shell, SectionHead, sectionPad } from "@/components/primitives";
import { practiceAreas } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Three columns on desktop, stacked on mobile. Hairlines come from gap-px over
 * a rule-coloured background, so the dividers land correctly in both axes
 * without per-cell border bookkeeping.
 */
export function Practice() {
  return (
    <Shell id="practice" className={sectionPad}>
      <SectionHead title="Practice" aside="Three verticals" />
      <div className="grid grid-cols-1 gap-px bg-rule md:grid-cols-3">
        {practiceAreas.map((area, i) => (
          <div
            key={area.title}
            className={cn(
              "flex flex-col gap-7 bg-paper py-12 md:py-14",
              "md:px-[clamp(24px,3vw,56px)]",
              i === 0 && "md:pl-0",
              i === practiceAreas.length - 1 && "md:pr-0",
            )}
          >
            <p className="m-0 font-serif text-[15px] text-faint">{area.index}</p>
            <h3 className="m-0 font-serif text-[clamp(32px,3.6vw,46px)] font-light leading-[1.08] tracking-[-0.02em]">
              {area.title}
            </h3>
            <div className="flex flex-col gap-3">
              {area.services.map((service) => (
                <p key={service} className="m-0 text-[15.5px] text-body">
                  {service}
                </p>
              ))}
            </div>
            <p className="m-0 mt-auto max-w-[340px] pt-4 text-[15px] leading-[1.66] text-mute">
              {area.body}
            </p>
          </div>
        ))}
      </div>
    </Shell>
  );
}
