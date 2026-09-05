import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getInsights, getTransactions } from "@/lib/content";

beforeEach(() => {
  vi.stubEnv("CONTENT_SOURCE", "local");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("the transaction record", () => {
  it("gives every row all five columns", async () => {
    for (const row of await getTransactions()) {
      expect(row.asset.trim()).not.toBe("");
      expect(row.market.trim()).not.toBe("");
      expect(row.scale.trim()).not.toBe("");
      expect(row.role.trim()).not.toBe("");
      expect(row.year).toMatch(/^\d{4}$/);
    }
  });

  it("orders rows newest first", async () => {
    const years = (await getTransactions()).map((row) => row.year);
    expect([...years].sort().reverse()).toEqual(years);
  });
});

describe("the insight notes", () => {
  it("carry a valid ISO 8601 publishedAt", async () => {
    for (const note of await getInsights()) {
      expect(note.publishedAt).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/);
      expect(Number.isNaN(Date.parse(note.publishedAt))).toBe(false);
      expect(note.publishedAt.slice(0, 4)).toBe(note.year);
    }
  });

  it("have a body array (empty until the owner supplies the text)", async () => {
    for (const note of await getInsights()) {
      expect(Array.isArray(note.body)).toBe(true);
    }
  });
});
