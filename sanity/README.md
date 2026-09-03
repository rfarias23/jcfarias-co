# CMS layer (Sanity)

Nothing here is imported by the app yet. The site reads \`content/local.ts\` through
\`lib/content.ts\`; these files are the schema and query contract to build against
when the dataset is created.

## Wiring it up

1. \`npm i next-sanity\` and create a project at sanity.io.
2. Fill \`.env.local\` from \`.env.example\` and set \`CONTENT_SOURCE=sanity\`.
3. Add \`schemas/transaction.ts\` and \`schemas/insight.ts\` to the Studio config.
4. Implement the two \`source === "sanity"\` branches in \`lib/content.ts\` using the
   queries below. Nothing else in the codebase changes.

## Queries

    export const TRANSACTIONS_QUERY = \`*[_type == "transaction"] | order(year desc, _createdAt desc){
      "asset": assetClass, market, scale, role, "year": string(year)
    }\`;

    export const INSIGHTS_QUERY = \`*[_type == "insight" && !hidden] | order(publishedAt desc)[0...3]{
      "slug": slug.current, category, title, number, "year": string(year)
    }\`;

## Editorial rules the schema enforces

- Transactions never name a counterparty. \`assetClass\` is a class, not a property name.
- \`scale\` is free text so it can carry m², keys, units or hectares.
- Insight \`number\` is a display label ("Note 03"), not a sort key — \`publishedAt\` sorts.
