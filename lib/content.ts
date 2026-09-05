import { transactions as localTransactions, insights as localInsights } from "@/content/local";
import type { Insight, Transaction } from "@/lib/types";

/**
 * Single seam between the site and its content source.
 *
 * Today both functions return the hand-authored arrays in content/local.ts.
 * When the Sanity dataset exists, flip CONTENT_SOURCE=sanity and implement the
 * branches below — no component changes required, because every consumer is a
 * server component that awaits these two functions.
 *
 * Sanity implementation sketch:
 *
 *   import { createClient } from "next-sanity";
 *   const client = createClient({
 *     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
 *     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
 *     apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
 *     useCdn: true,
 *   });
 *   return client.fetch(TRANSACTIONS_QUERY, {}, { next: { revalidate: 300 } });
 *
 * GROQ queries and document schemas live in /sanity.
 */
const source = process.env.CONTENT_SOURCE ?? "local";

export async function getTransactions(): Promise<Transaction[]> {
  if (source === "sanity") {
    throw new Error("Sanity transactions source not wired yet — see /sanity/README.md");
  }
  return localTransactions;
}

export async function getInsights(): Promise<Insight[]> {
  if (source === "sanity") {
    throw new Error("Sanity insights source not wired yet — see /sanity/README.md");
  }
  return localInsights;
}

export async function getInsight(slug: string): Promise<Insight | null> {
  if (source === "sanity") {
    throw new Error("Sanity insight source not wired yet — see /sanity/README.md");
  }
  return localInsights.find((note) => note.slug === slug) ?? null;
}
