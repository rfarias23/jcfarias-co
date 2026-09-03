import type { Rule } from "./types";

export const transaction = {
  name: "transaction",
  title: "Transaction",
  type: "document",
  fields: [
    {
      name: "assetClass",
      title: "Asset class",
      type: "string",
      description: "A class, never a named property. e.g. Mixed-use development",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "market",
      title: "Market",
      type: "string",
      description: "City, country. e.g. Lima, Perú",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "scale",
      title: "Scale",
      type: "string",
      description: "Free text: 34,000 m² · 180 keys · 12 units · 82 ha",
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          "Capital raise & structuring",
          "Buy-side advisory",
          "Sell-side mandate",
          "Asset strategy",
          "Partnership structuring",
          "Joint-venture formation",
        ],
      },
    },
    {
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule: Rule) => rule.required().min(2000).max(2100),
    },
  ],
  preview: {
    select: { title: "assetClass", subtitle: "market" },
  },
};
