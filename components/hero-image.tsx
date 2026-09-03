import Image from "next/image";
import { Shell } from "@/components/primitives";

/**
 * Full-bleed architectural plate. Height steps down on small screens so the
 * image never eats the entire viewport before any copy is reachable.
 *
 * PENDING: swap for owned project photography — the current plate is a Mexican
 * landmark and the firm does not operate in Mexico. Attribution below is
 * required while the CC BY-SA image is in use.
 */
export function HeroImage() {
  return (
    <>
      <div className="relative mt-6 h-[54vh] min-h-[340px] w-full bg-stone md:h-[66vh] md:min-h-[460px] lg:h-[74vh] lg:min-h-[520px]">
        <Image
          src="/images/soumaya-hero.jpg"
          alt="Museo Soumaya, Mexico City, designed by Fernando Romero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <Shell>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule pt-5">
          <p className="meta m-0 text-faint">Museo Soumaya · Fernando Romero</p>
          <p className="meta m-0 text-faint">Ciudad de México</p>
        </div>
        <p className="m-0 pt-2 text-[10.5px] tracking-[0.08em] text-faint/80 uppercase">
          Photo{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Museo_Soumaya,_Ciudad_de_M%C3%A9xico,_M%C3%A9xico,_2015-07-18,_DD_13.JPG"
            className="underline decoration-rule underline-offset-2 hover:text-ink"
            rel="noopener noreferrer"
            target="_blank"
          >
            Diego Delso / Wikimedia Commons
          </a>{" "}
          · CC BY-SA 4.0
        </p>
      </Shell>
    </>
  );
}
