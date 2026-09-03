import { Shell } from "@/components/primitives";
import { stats } from "@/content/site";
import { cn } from "@/lib/cn";

export function Stats() {
  return (
    <Shell>
      <div className="mt-2 grid grid-cols-2 gap-px border-t border-rule bg-rule md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              "bg-paper py-[clamp(32px,4vw,56px)]",
              "px-[clamp(16px,2.6vw,40px)]",
              i % 2 === 0 && "pl-0 md:pl-[clamp(16px,2.6vw,40px)]",
              i === 0 && "md:pl-0",
              i === stats.length - 1 && "md:pr-0",
            )}
          >
            <p className="tnum m-0 font-serif text-[clamp(34px,4.4vw,64px)] font-light leading-none tracking-[-0.03em]">
              {stat.value}
            </p>
            <p className="eyebrow m-0 mt-4 tracking-[0.15em] text-faint">{stat.label}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}
