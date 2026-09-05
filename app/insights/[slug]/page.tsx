import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eyebrow, Shell, sectionPad } from "@/components/primitives";
import { getInsight, getInsights } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

const siteDescription =
  "An advisory firm for institutional and private capital across the Andes and the Caribbean. We originate, structure and steward the transactions that global platforms cannot reach locally.";

export async function generateStaticParams() {
  const insights = await getInsights();
  return insights.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const note = await getInsight(slug);
  if (!note) return { title: "Not found", robots: { index: false, follow: false } };
  return {
    title: note.title,
    description: note.dek || siteDescription,
    robots: { index: false, follow: false },
  };
}

/**
 * Route structure only (spec 010). The markup below is a placeholder until the
 * insights design is approved (spec 014); the page is noindex until then.
 */
export default async function InsightPage({ params }: Params) {
  const { slug } = await params;
  const note = await getInsight(slug);
  if (!note) notFound();

  return (
    <main>
      <Shell className={sectionPad}>
        <Eyebrow>{note.category}</Eyebrow>
        <h1 className="m-0 mt-4">{note.title}</h1>
      </Shell>
    </main>
  );
}
