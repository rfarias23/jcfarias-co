import { describe, expect, it } from "vitest";
import { getTransactions } from "@/lib/content";

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
