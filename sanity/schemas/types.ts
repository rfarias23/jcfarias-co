/**
 * Minimal stand-in for the Studio's validation `Rule` type. The Studio package
 * (`sanity`) is deliberately not installed and `@sanity/client` does not
 * re-export it (spec 006, H2), so this keeps the schema files typechecking.
 */
export type Rule = {
  required: () => Rule;
  min: (n: number) => Rule;
  max: (n: number) => Rule;
};
