import { cn } from "@/lib/cn";

/** Page gutter + max measure. Wraps every section's content. */
export function Shell({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className={cn("shell", className)}>
      {children}
    </div>
  );
}

/** Standard top padding between major sections. */
export const sectionPad = "pt-[clamp(72px,9vw,120px)]";

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn("eyebrow m-0 text-faint", className)}>{children}</p>;
}

/**
 * Section header: uppercase label on the left, aside on the right, 1px ink rule
 * beneath. Wraps to two lines under ~480px rather than crushing the aside.
 */
export function SectionHead({
  title,
  aside,
  asideHref,
}: {
  title: string;
  aside?: string;
  asideHref?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink pb-5">
      <h2 className="eyebrow m-0">{title}</h2>
      {aside && asideHref ? (
        <a
          href={asideHref}
          className="meta m-0 font-medium text-faint transition-colors hover:text-ink"
        >
          {aside}
        </a>
      ) : aside ? (
        <p className="meta m-0 text-faint">{aside}</p>
      ) : null}
    </div>
  );
}
