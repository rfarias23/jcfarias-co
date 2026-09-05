import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generateStaticParams } from "@/app/insights/[slug]/page";
import { getInsight, getInsights, getTransactions } from "@/lib/content";
import { INSIGHTS_QUERY, TRANSACTIONS_QUERY } from "@/sanity/queries";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("with CONTENT_SOURCE=local", () => {
  beforeEach(() => {
    vi.stubEnv("CONTENT_SOURCE", "local");
  });

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
});

describe("with CONTENT_SOURCE=sanity and no credentials", () => {
  beforeEach(() => {
    vi.stubEnv("CONTENT_SOURCE", "sanity");
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", undefined);
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");
    vi.stubEnv("NEXT_PUBLIC_SANITY_API_VERSION", "2026-01-01");
  });

  it("getTransactions rejects naming NEXT_PUBLIC_SANITY_PROJECT_ID", async () => {
    await expect(getTransactions()).rejects.toThrow(/NEXT_PUBLIC_SANITY_PROJECT_ID/);
  });

  it("getInsights rejects naming NEXT_PUBLIC_SANITY_PROJECT_ID", async () => {
    await expect(getInsights()).rejects.toThrow(/NEXT_PUBLIC_SANITY_PROJECT_ID/);
  });

  it("getInsight rejects naming NEXT_PUBLIC_SANITY_PROJECT_ID", async () => {
    await expect(getInsight("any")).rejects.toThrow(/NEXT_PUBLIC_SANITY_PROJECT_ID/);
  });

  it("names the dataset variable when only the project id is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "abc12345");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", undefined);
    await expect(getTransactions()).rejects.toThrow(/NEXT_PUBLIC_SANITY_DATASET/);
  });
});

describe("sanity/queries.ts", () => {
  const readme = readFileSync("sanity/README.md", "utf8");
  const fromReadme = (name: string) => {
    const match = readme.match(new RegExp(`export const ${name} = \\\\\`([\\s\\S]*?)\\\\\`;`));
    if (!match) throw new Error(`${name} not found in sanity/README.md`);
    return match[1].replace(/\n {4}/g, "\n");
  };

  it("TRANSACTIONS_QUERY is identical to the README contract", () => {
    expect(TRANSACTIONS_QUERY).toBe(fromReadme("TRANSACTIONS_QUERY"));
  });

  it("INSIGHTS_QUERY is identical to the README contract", () => {
    expect(INSIGHTS_QUERY).toBe(fromReadme("INSIGHTS_QUERY"));
  });
});
