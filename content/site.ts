import type { Office, PracticeArea, Stat } from "@/lib/types";

export const site = {
  name: "J.C. Farias & Co.",
  tagline: "Real Estate · Partnerships · Value Creation",
  email: "mandates@jcfarias.co",
  url: "https://jcfarias.co",
};

export const navLinks = [
  { label: "Practice", href: "#practice" },
  { label: "Transactions", href: "#transactions" },
  { label: "Insights", href: "#insights" },
  { label: "About", href: "#about" },
];

export const practiceAreas: PracticeArea[] = [
  {
    index: "01",
    title: "Real Estate",
    services: ["Investment", "Development", "Asset Strategy"],
    body: "Acquisition and disposition mandates, capital structuring for development, and repositioning plans for underperforming assets.",
  },
  {
    index: "02",
    title: "Partnerships",
    services: ["Market Entry", "Expansion", "Franchising"],
    body: "Local partner identification, joint-venture formation and master-franchise structures for brands entering the region.",
  },
  {
    index: "03",
    title: "Advisory",
    services: ["Transactions", "Growth", "Strategic Projects"],
    body: "Buy-side and sell-side execution, growth strategy for regional operators, and special situations requiring discretion.",
  },
];

export const stats: Stat[] = [
  { value: "18", label: "Years in the corridor" },
  { value: "4", label: "Markets covered directly" },
  { value: "40+", label: "Mandates advised" },
  { value: "USD 1.2B", label: "Aggregate transaction value" },
];

export const offices: Office[] = [
  { city: "Lima", country: "Perú", phoneNote: "+51 · by appointment" },
  { city: "Quito", country: "Ecuador", phoneNote: "+593 · by appointment" },
  { city: "San Juan", country: "Puerto Rico", phoneNote: "+1 · by appointment" },
  { city: "Santo Domingo", country: "Rep. Dominicana", phoneNote: "+1 · by appointment" },
];
