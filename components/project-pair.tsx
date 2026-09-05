import Image from "next/image";
import { Shell, sectionPad } from "@/components/primitives";

type Frame = {
  id: string;
  src: string;
  alt: string;
};

/** Licensed stock photography supplied by the owner (spec 011, delivery 2). */
const frames: Frame[] = [
  {
    id: "project-a",
    src: "/images/project-a.jpg",
    alt: "Loading docks of a logistics facility under a clear sky",
  },
  {
    id: "project-b",
    src: "/images/project-b.jpg",
    alt: "Facade of an office building in afternoon light",
  },
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
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </Shell>
  );
}
