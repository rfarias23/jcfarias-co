import type { Rule } from "./types";

export const insight = {
  name: "insight",
  title: "Insight",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (rule: Rule) => rule.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      description: "Vertical · region. e.g. Hospitality · Caribbean",
    },
    {
      name: "number",
      title: "Display number",
      type: "string",
      description: "Shown on the card, e.g. Note 03",
    },
    {
      name: "dek",
      title: "Dek",
      type: "string",
      description: "One line, ≤ 160 characters, for metadata",
      validation: (rule: Rule) => rule.max(160),
    },
    { name: "year", title: "Year", type: "number" },
    { name: "publishedAt", title: "Published at", type: "datetime" },
    { name: "hidden", title: "Hide from site", type: "boolean", initialValue: false },
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }] },
  ],
  preview: { select: { title: "title", subtitle: "category" } },
};
