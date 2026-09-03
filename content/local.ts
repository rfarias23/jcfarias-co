import type { Insight, Transaction } from "@/lib/types";

/**
 * PENDING: these six rows are representative, not verified. Replace with the
 * real mandate record before launch (see README, "Open items").
 */
export const transactions: Transaction[] = [
  {
    asset: "Mixed-use development",
    market: "Lima, Perú",
    scale: "34,000 m²",
    role: "Capital raise & structuring",
    year: "2024",
  },
  {
    asset: "Hotel repositioning",
    market: "San Juan, PR",
    scale: "180 keys",
    role: "Buy-side advisory",
    year: "2024",
  },
  {
    asset: "Retail portfolio",
    market: "Quito, Ecuador",
    scale: "5 assets",
    role: "Asset strategy",
    year: "2023",
  },
  {
    asset: "Franchise market entry",
    market: "Santo Domingo, DO",
    scale: "12 units",
    role: "Partnership structuring",
    year: "2023",
  },
  {
    asset: "Land assembly",
    market: "Punta Cana, DO",
    scale: "82 ha",
    role: "Sell-side mandate",
    year: "2022",
  },
  {
    asset: "Logistics park",
    market: "Lima, Perú",
    scale: "61,000 m²",
    role: "Joint-venture formation",
    year: "2022",
  },
];

export const insights: Insight[] = [
  {
    slug: "five-year-window-keys-pr-dr",
    category: "Hospitality · Caribbean",
    title: "The five-year window for keys in Puerto Rico and the DR",
    number: "Note 03",
    year: "2026",
  },
  {
    slug: "franchise-expansion-lima-quito",
    category: "Partnerships · Andes",
    title: "Why franchise expansion fails in Lima and Quito",
    number: "Note 02",
    year: "2026",
  },
  {
    slug: "pricing-land-dollarized-economy",
    category: "Underwriting",
    title: "Pricing land in a dollarized economy",
    number: "Note 01",
    year: "2025",
  },
];
