import { createClient, type SanityClient } from "@sanity/client";

type RequiredVariable =
  "NEXT_PUBLIC_SANITY_PROJECT_ID" | "NEXT_PUBLIC_SANITY_DATASET" | "NEXT_PUBLIC_SANITY_API_VERSION";

let client: SanityClient | null = null;

function requireEnv(name: RequiredVariable): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `CONTENT_SOURCE=sanity requires ${name}; copy .env.example to .env.local and fill it in`,
    );
  }
  return value;
}

/**
 * Lazily built read-only client. Never instantiated at module level so that
 * `next build` succeeds on a checkout without .env.local.
 */
export function getClient(): SanityClient {
  if (client) return client;
  const token = process.env.SANITY_API_READ_TOKEN || undefined;
  client = createClient({
    projectId: requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"),
    dataset: requireEnv("NEXT_PUBLIC_SANITY_DATASET"),
    apiVersion: requireEnv("NEXT_PUBLIC_SANITY_API_VERSION"),
    token,
    useCdn: !token,
    perspective: "published",
  });
  return client;
}
