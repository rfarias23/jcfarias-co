import { describe, expect, it } from "vitest";
import { insights, transactions } from "@/content/local";
import type { Insight, Transaction } from "@/lib/types";
import {
  buildDocuments,
  insightId,
  planSync,
  toInsightDocument,
  toTransactionDocument,
  transactionId,
} from "@/lib/sanity-sync";
import { INSIGHT_BY_SLUG_QUERY, INSIGHTS_QUERY } from "@/sanity/queries";

const row: Transaction = {
  asset: "Mixed-use development",
  market: "Lima, Perú",
  scale: "34,000 m²",
  role: "Capital raise & structuring",
  year: "2024",
};

const note: Insight = {
  slug: "a-note",
  category: "Hospitality · Caribbean",
  title: "A note",
  number: "Note 01",
  year: "2026",
  publishedAt: "2026",
  body: ["A", "B"],
};

describe("transactionId", () => {
  it("has the transaction-<12 hex> shape", () => {
    expect(transactionId(row)).toMatch(/^transaction-[0-9a-f]{12}$/);
  });

  it("does not depend on the row's position in the array", () => {
    const [first, second] = buildDocuments([row, { ...row, year: "2023" }], []);
    const [swappedSecond, swappedFirst] = buildDocuments([{ ...row, year: "2023" }, row], []);
    expect(first._id).toBe(swappedFirst._id);
    expect(second._id).toBe(swappedSecond._id);
  });

  it.each(["asset", "market", "scale", "role", "year"] as const)(
    "changes when %s changes",
    (column) => {
      expect(transactionId({ ...row, [column]: `${row[column]}x` })).not.toBe(transactionId(row));
    },
  );
});

describe("insightId", () => {
  it("is insight-<slug>", () => {
    expect(insightId(note)).toBe("insight-a-note");
  });
});

describe("toTransactionDocument", () => {
  it("maps the five columns to the schema with a numeric year", () => {
    expect(toTransactionDocument(row)).toEqual({
      _id: transactionId(row),
      _type: "transaction",
      assetClass: "Mixed-use development",
      market: "Lima, Perú",
      scale: "34,000 m²",
      role: "Capital raise & structuring",
      year: 2024,
    });
  });
});

describe("toInsightDocument", () => {
  it("maps to the schema with a slug object, numeric year, hidden false and dek string", () => {
    const doc = toInsightDocument(note);
    expect(doc._id).toBe("insight-a-note");
    expect(doc._type).toBe("insight");
    expect(doc.slug).toEqual({ _type: "slug", current: "a-note" });
    expect(doc.year).toBe(2026);
    expect(doc.hidden).toBe(false);
    expect(doc.dek).toBe("");
    expect(doc.title).toBe("A note");
    expect(doc.category).toBe("Hospitality · Caribbean");
    expect(doc.number).toBe("Note 01");
  });

  it.each([
    ["2026", "2026-01-01T00:00:00.000Z"],
    ["2026-03", "2026-03-01T00:00:00.000Z"],
    ["2026-03-14", "2026-03-14T00:00:00.000Z"],
    ["2026-03-14T10:30:00.000Z", "2026-03-14T10:30:00.000Z"],
  ])("normalises publishedAt %s to %s", (input, expected) => {
    expect(toInsightDocument({ ...note, publishedAt: input }).publishedAt).toBe(expected);
  });

  it("turns body paragraphs into Portable Text blocks with deterministic keys", () => {
    expect(toInsightDocument(note).body).toEqual([
      {
        _type: "block",
        _key: "b0",
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: "s0", text: "A", marks: [] }],
      },
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: "s0", text: "B", marks: [] }],
      },
    ]);
  });

  it("passes dek through when present", () => {
    expect(toInsightDocument({ ...note, dek: "One line." }).dek).toBe("One line.");
  });
});

describe("buildDocuments", () => {
  it("rejects duplicate transaction rows naming the asset", () => {
    expect(() => buildDocuments([row, { ...row }], [])).toThrow(/duplicate.*Mixed-use development/);
  });

  it("builds nine documents from content/local.ts, identically on every call", () => {
    const first = buildDocuments(transactions, insights);
    expect(first).toHaveLength(9);
    expect(first.filter((doc) => doc._type === "transaction")).toHaveLength(6);
    expect(first.filter((doc) => doc._type === "insight")).toHaveLength(3);
    expect(buildDocuments(transactions, insights)).toEqual(first);
  });
});

describe("planSync", () => {
  it("upserts every local document and deletes only orphaned transactions and insights", () => {
    const local = [toInsightDocument({ ...note, slug: "new" })];
    const plan = planSync(local, ["transaction-x", "insight-old", "office-1"]);
    expect(plan.upsert.map((doc) => doc._id)).toEqual(["insight-new"]);
    expect(plan.deleteIds).toEqual(["transaction-x", "insight-old"]);
  });

  it("does not delete a remote id that is also local", () => {
    const local = [toInsightDocument(note)];
    expect(planSync(local, ["insight-a-note"]).deleteIds).toEqual([]);
  });
});

describe("insight queries", () => {
  it.each([
    ["INSIGHTS_QUERY", INSIGHTS_QUERY],
    ["INSIGHT_BY_SLUG_QUERY", INSIGHT_BY_SLUG_QUERY],
  ])("%s projects dek", (_name, query) => {
    expect(query).toMatch(/\bdek\b/);
  });
});
