import { transactions as localTransactions, insights as localInsights } from "@/content/local";
import { getClient } from "@/lib/sanity-client";
import type { Insight, Transaction } from "@/lib/types";
import { INSIGHT_BY_SLUG_QUERY, INSIGHTS_QUERY, TRANSACTIONS_QUERY } from "@/sanity/queries";

/**
 * Single seam between the site and its content source.
 *
 * CONTENT_SOURCE=local (default) returns the hand-authored arrays in
 * content/local.ts. CONTENT_SOURCE=sanity reads the CMS through the lazy client
 * in lib/sanity-client.ts with a five-minute revalidation. Every consumer is a
 * server component that awaits these functions, so no component changes when
 * the source flips. GROQ queries and document schemas live in /sanity.
 */
const REVALIDATE_SECONDS = 300;

function contentSource(): "local" | "sanity" {
  return process.env.CONTENT_SOURCE === "sanity" ? "sanity" : "local";
}

function fetchFromSanity<T>(query: string, params: Record<string, string> = {}): Promise<T> {
  return getClient().fetch<T>(query, params, { next: { revalidate: REVALIDATE_SECONDS } });
}

export async function getTransactions(): Promise<Transaction[]> {
  if (contentSource() === "sanity") {
    return fetchFromSanity<Transaction[]>(TRANSACTIONS_QUERY);
  }
  return localTransactions;
}

export async function getInsights(): Promise<Insight[]> {
  if (contentSource() === "sanity") {
    return fetchFromSanity<Insight[]>(INSIGHTS_QUERY);
  }
  return localInsights;
}

export async function getInsight(slug: string): Promise<Insight | null> {
  if (contentSource() === "sanity") {
    return fetchFromSanity<Insight | null>(INSIGHT_BY_SLUG_QUERY, { slug });
  }
  return localInsights.find((note) => note.slug === slug) ?? null;
}
