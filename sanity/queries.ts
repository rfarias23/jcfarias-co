/**
 * GROQ contract with the Sanity dataset. TRANSACTIONS_QUERY and INSIGHTS_QUERY
 * must stay character-for-character identical to sanity/README.md (spec 006,
 * criterion 8; lib/content.test.ts enforces it).
 */
export const TRANSACTIONS_QUERY = `*[_type == "transaction"] | order(year desc, _createdAt desc){
  "asset": assetClass, market, scale, role, "year": string(year)
}`;

export const INSIGHTS_QUERY = `*[_type == "insight" && !hidden] | order(publishedAt desc)[0...3]{
  "slug": slug.current, category, title, number, "year": string(year), publishedAt,
  "body": coalesce(body[]{"text": pt::text(@)}.text, [])
}`;

export const INSIGHT_BY_SLUG_QUERY = `*[_type == "insight" && slug.current == $slug && !hidden][0]{
  "slug": slug.current, category, title, number, "year": string(year), publishedAt,
  "body": coalesce(body[]{"text": pt::text(@)}.text, [])
}`;
