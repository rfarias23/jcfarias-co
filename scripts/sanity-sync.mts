/**
 * Mirror content/local.ts into the Sanity dataset — spec 015.
 *
 *   npm run content:sync            # prints the plan, writes nothing
 *   npm run content:sync -- --apply # applies it in one atomic transaction
 *
 * Reads NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * NEXT_PUBLIC_SANITY_API_VERSION and SANITY_API_WRITE_TOKEN from .env.local
 * (injected by --env-file). Only `transaction` and `insight` documents are
 * ever created, replaced or deleted.
 */
import { createClient } from "@sanity/client";
import { insights, transactions } from "../content/local.ts";
import { buildDocuments, planSync, SYNCED_TYPES } from "../lib/sanity-sync.ts";

function env(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Add it to .env.local (see .env.example).`);
    process.exit(2);
  }
  return value;
}

const apply = process.argv.includes("--apply");

const client = createClient({
  projectId: env("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: env("NEXT_PUBLIC_SANITY_DATASET"),
  apiVersion: env("NEXT_PUBLIC_SANITY_API_VERSION"),
  token: env("SANITY_API_WRITE_TOKEN"),
  useCdn: false,
  perspective: "raw",
});

const remoteIds = await client.fetch<string[]>("*[_type in $types]._id", {
  types: [...SYNCED_TYPES],
});
const remote = new Set(remoteIds);
const plan = planSync(buildDocuments(transactions, insights), remoteIds);
const creates = plan.upsert.filter((doc) => !remote.has(doc._id));
const replaces = plan.upsert.filter((doc) => remote.has(doc._id));

for (const doc of creates) console.log(`create   ${doc._id}`);
for (const doc of replaces) console.log(`replace  ${doc._id}`);
for (const id of plan.deleteIds) console.log(`delete   ${id}`);
console.log(
  `${creates.length} create · ${replaces.length} replace · ${plan.deleteIds.length} delete`,
);

if (!apply) {
  console.log("Dry run: nothing written. Re-run with --apply to mirror the dataset.");
  process.exit(0);
}

let transaction = client.transaction();
for (const doc of plan.upsert)
  transaction = transaction.createOrReplace<Record<string, unknown>>(doc);
for (const id of plan.deleteIds) transaction = transaction.delete(id);
const result = await transaction.commit();
console.log(`Committed transaction ${result.transactionId}: dataset now mirrors content/local.ts.`);
