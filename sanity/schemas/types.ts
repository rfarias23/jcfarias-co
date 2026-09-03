/**
 * Minimal stand-in so the schema files typecheck before next-sanity is
 * installed. Delete this file and import from "sanity" once it is.
 */
export type Rule = {
  required: () => Rule;
  min: (n: number) => Rule;
  max: (n: number) => Rule;
};
