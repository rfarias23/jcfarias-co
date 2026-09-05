import type { Metadata } from "next";
import { SectionHead, Shell, sectionPad } from "@/components/primitives";
import { getInsights } from "@/lib/content";

/**
 * Route structure only (spec 010). The markup below is a placeholder until the
 * insights design is approved (spec 014); the page is noindex until then.
 */
export const metadata: Metadata = {
  title: "Insights",
  description:
    "An advisory firm for institutional and private capital across the Andes and the Caribbean. We originate, structure and steward the transactions that global platforms cannot reach locally.",
  robots: { index: false, follow: false },
};

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <main>
      <Shell className={sectionPad}>
        <SectionHead title="Insights" />
        <ul>
          {insights.map((note) => (
            <li key={note.slug}>
              <a href={"/insights/" + note.slug}>{note.title}</a>
            </li>
          ))}
        </ul>
      </Shell>
    </main>
  );
}
