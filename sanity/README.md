# CMS layer (Sanity)

The site reads content through the single seam \`lib/content.ts\`. With
\`CONTENT_SOURCE=local\` (the default) it returns \`content/local.ts\`; with
\`CONTENT_SOURCE=sanity\` it queries the dataset through the lazy client in
\`lib/sanity-client.ts\` (\`@sanity/client\`, five-minute revalidation). The
queries below live in \`queries.ts\` and are the contract with the dataset.

## Wiring it up

1. Create a project at sanity.io with a \`production\` dataset and a read-only
   (Viewer) API token.
2. Copy \`.env.example\` to \`.env.local\` and fill \`NEXT_PUBLIC_SANITY_PROJECT_ID\`
   and \`SANITY_API_READ_TOKEN\`. Set \`CONTENT_SOURCE=sanity\` only once the
   dataset has content; the client throws a descriptive error if a variable is
   missing.
3. When a Studio exists, register \`schemas/transaction.ts\` and
   \`schemas/insight.ts\` in its config. The Studio package is not installed
   here; \`schemas/types.ts\` stands in for its \`Rule\` type.

## Queries

    export const TRANSACTIONS_QUERY = \`*[_type == "transaction"] | order(year desc, _createdAt desc){
      "asset": assetClass, market, scale, role, "year": string(year)
    }\`;

    export const INSIGHTS_QUERY = \`*[_type == "insight" && !hidden] | order(publishedAt desc)[0...3]{
      "slug": slug.current, category, title, number, "year": string(year), publishedAt, dek,
      "body": coalesce(body[]{"text": pt::text(@)}.text, [])
    }\`;

\`INSIGHT_BY_SLUG_QUERY\` uses the same projection filtered by
\`slug.current == $slug\` and returns a single document or null.

## Loading content

There is no Studio. `npm run content:sync` mirrors `content/local.ts` into the dataset
(spec 015): deterministic ids (`transaction-<hash>`, `insight-<slug>`), `hidden: false`,
paragraphs as Portable Text blocks, and every `transaction`/`insight` document that is
not in the file gets deleted. Without `--apply` it only prints the plan. It needs
`SANITY_API_WRITE_TOKEN` (Editor) in `.env.local`; that token must never reach Vercel.

## Editorial rules the schema enforces

- Transactions never name a counterparty. \`assetClass\` is a class, not a property name.
- \`scale\` is free text so it can carry m², keys, units or hectares.
- Insight \`number\` is a display label ("Note 03"), not a sort key — \`publishedAt\` sorts.
