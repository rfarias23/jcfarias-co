import { Shell, SectionHead, sectionPad } from "@/components/primitives";
import type { Insight } from "@/lib/types";
import { cn } from "@/lib/cn";

export function Insights({ insights }: { insights: Insight[] }) {
  return (
    <Shell id="insights" className={sectionPad}>
      <SectionHead title="Insights" aside="All notes" asideHref="#insights" />
      <div className="grid grid-cols-1 gap-px bg-rule md:grid-cols-3">
        {insights.map((note, i) => (
          <a
            key={note.slug}
            href={"#insights"}
            className={cn(
              "flex flex-col gap-6 bg-paper py-11 transition-opacity hover:opacity-55",
              "md:px-[clamp(24px,3vw,56px)]",
              i === 0 && "md:pl-0",
              i === insights.length - 1 && "md:pr-0",
            )}
          >
            <p className="m-0 text-[11px] font-medium tracking-[0.14em] uppercase text-faint">
              {note.category}
            </p>
            <h3 className="m-0 font-serif text-[clamp(23px,2.4vw,32px)] font-light leading-[1.18] tracking-[-0.016em]">
              {note.title}
            </h3>
            <p className="meta m-0 mt-auto pt-4 text-faint">
              {note.number} · {note.year}
            </p>
          </a>
        ))}
      </div>
    </Shell>
  );
}
