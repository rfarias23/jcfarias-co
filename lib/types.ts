export type Transaction = {
  /** Asset class, e.g. "Mixed-use development". Counterparty never named. */
  asset: string;
  market: string;
  /** Free text — area, keys, units, hectares. */
  scale: string;
  role: string;
  year: string;
};

export type Insight = {
  slug: string;
  category: string;
  title: string;
  /** Display label, e.g. "Note 03". */
  number: string;
  year: string;
  /** ISO 8601 date (year-only until the owner supplies exact dates). Sorts the notes. */
  publishedAt: string;
  /** One-line summary for metadata description. Empty until supplied. */
  dek?: string;
  /** Plain-text paragraphs. Empty until the owner supplies the note (spec 011). */
  body: string[];
};

export type Office = {
  city: string;
  country: string;
  phoneNote: string;
};

export type PracticeArea = {
  index: string;
  title: string;
  services: string[];
  body: string;
};

export type Stat = {
  value: string;
  label: string;
};
