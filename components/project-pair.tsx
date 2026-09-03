import Image from "next/image";
import { Shell, sectionPad } from "@/components/primitives";

type Frame = {
  id: string;
  src?: string;
  alt?: string;
  placeholder: string;
};

/**
 * PENDING: both frames await owned project photography. Until a src is set the
 * frame renders as a stone plate with its brief, which is honest in staging and
 * disappears the moment the asset lands.
 */
const frames: Frame[] = [
  { id: "project-a", placeholder: "Project — vertical or square" },
  { id: "project-b", placeholder: "Architectural detail — facade, structure, materiality" },
];

export function ProjectPair() {
  return (
    <Shell className={sectionPad}>
      <div className="grid grid-cols-1 gap-0.5 md:grid-cols-2">
        {frames.map((frame) => (
          <div
            key={frame.id}
            className="relative h-[46vh] min-h-[300px] bg-stone md:h-[60vh] md:min-h-[440px]"
          >
            {frame.src ? (
              <Image
                src={frame.src}
                alt={frame.alt ?? ""}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <p className="meta absolute inset-x-6 bottom-6 m-0 text-faint">{frame.placeholder}</p>
            )}
          </div>
        ))}
      </div>
    </Shell>
  );
}
