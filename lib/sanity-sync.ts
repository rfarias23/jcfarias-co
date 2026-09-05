import { createHash } from "node:crypto";
import type { Insight, Transaction } from "@/lib/types";

/**
 * Pure mapping from content/local.ts to Sanity documents (spec 015). No I/O:
 * scripts/sanity-sync.mts owns the client, this module owns the shape and the
 * plan so both can be tested without a dataset.
 */
export type TransactionDocument = {
  _id: string;
  _type: "transaction";
  assetClass: string;
  market: string;
  scale: string;
  role: string;
  year: number;
};

export type PortableTextBlock = {
  _type: "block";
  _key: string;
  style: "normal";
  markDefs: never[];
  children: { _type: "span"; _key: string; text: string; marks: never[] }[];
};

export type InsightDocument = {
  _id: string;
  _type: "insight";
  title: string;
  slug: { _type: "slug"; current: string };
  category: string;
  number: string;
  year: number;
  publishedAt: string;
  dek: string;
  hidden: false;
  body: PortableTextBlock[];
};

export type SyncDocument = TransactionDocument | InsightDocument;

export const SYNCED_TYPES = ["transaction", "insight"] as const;

export type SyncPlan = { upsert: SyncDocument[]; deleteIds: string[] };

export function transactionId(row: Transaction): string {
  const digest = createHash("sha1")
    .update([row.asset, row.market, row.scale, row.role, row.year].join("|"))
    .digest("hex");
  return `transaction-${digest.slice(0, 12)}`;
}

export function insightId(note: Insight): string {
  return `insight-${note.slug}`;
}

export function toTransactionDocument(row: Transaction): TransactionDocument {
  return {
    _id: transactionId(row),
    _type: "transaction",
    assetClass: row.asset,
    market: row.market,
    scale: row.scale,
    role: row.role,
    year: Number(row.year),
  };
}

function toDatetime(publishedAt: string): string {
  if (/^\d{4}$/.test(publishedAt)) return `${publishedAt}-01-01T00:00:00.000Z`;
  if (/^\d{4}-\d{2}$/.test(publishedAt)) return `${publishedAt}-01T00:00:00.000Z`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) return `${publishedAt}T00:00:00.000Z`;
  return publishedAt;
}

function toPortableText(paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text, index) => ({
    _type: "block",
    _key: `b${index}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "s0", text, marks: [] }],
  }));
}

export function toInsightDocument(note: Insight): InsightDocument {
  return {
    _id: insightId(note),
    _type: "insight",
    title: note.title,
    slug: { _type: "slug", current: note.slug },
    category: note.category,
    number: note.number,
    year: Number(note.year),
    publishedAt: toDatetime(note.publishedAt),
    dek: note.dek ?? "",
    hidden: false,
    body: toPortableText(note.body),
  };
}

export function buildDocuments(transactions: Transaction[], insights: Insight[]): SyncDocument[] {
  const seen = new Map<string, Transaction>();
  for (const row of transactions) {
    const id = transactionId(row);
    const previous = seen.get(id);
    if (previous) {
      throw new Error(
        `duplicate transaction row: "${row.asset}" (${row.market}, ${row.year}) appears twice`,
      );
    }
    seen.set(id, row);
  }
  return [...transactions.map(toTransactionDocument), ...insights.map(toInsightDocument)];
}

export function planSync(local: SyncDocument[], remoteIds: string[]): SyncPlan {
  const localIds = new Set(local.map((doc) => doc._id));
  const deleteIds = remoteIds.filter(
    (id) => SYNCED_TYPES.some((type) => id.startsWith(`${type}-`)) && !localIds.has(id),
  );
  return { upsert: local, deleteIds };
}
