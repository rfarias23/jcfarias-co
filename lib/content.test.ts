import { describe, expect, it } from "vitest";
import { generateStaticParams } from "@/app/insights/[slug]/page";
import { getInsight, getInsights } from "@/lib/content";

describe("getInsight", () => {
  it("returns the note for a known slug", async () => {
    const note = await getInsight("five-year-window-keys-pr-dr");
    expect(note?.title).toBe("The five-year window for keys in Puerto Rico and the DR");
  });

  it("returns null for an unknown slug", async () => {
    expect(await getInsight("no-such-note")).toBeNull();
  });
});

describe("/insights/[slug] static params", () => {
  it("lists every insight slug", async () => {
    const slugs = (await getInsights()).map((note) => note.slug);
    const params = await generateStaticParams();
    expect(params.map((p) => p.slug)).toEqual(slugs);
    expect(params).toHaveLength(3);
  });
});
