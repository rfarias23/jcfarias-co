# J.C. Farias & Co. — Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take the existing J.C. Farias & Co. landing page from an un-versioned local directory to a verified, tested, indexable site deployed on Vercel from `github.com/rfarias23/jcfarias-co`.

**Architecture:** The site stays static-first and server-rendered — every section is a server component, `components/site-header.tsx` remains the only client component. The plan adds a real test harness, closes the one genuinely missing feature (insight detail pages), builds out the SEO and brand-asset surface a public site needs, forces a truth pass over the placeholder content, and ships. **Sanity is deliberately out of scope for launch:** `lib/content.ts` is already an async seam, so three notes and six transaction rows do not justify a CMS runtime dependency and a credential surface before the site is even live. Every task preserves that seam so the migration stays a two-branch change.

**Tech Stack:** Next.js 15.5.2 (App Router) · React 19.1.1 · TypeScript 5.9 (strict) · Tailwind CSS v4 (`@theme` tokens) · Vitest + Testing Library · Vercel · GitHub Actions

**Spec:** `README.md` § "Open items before launch" (items 1–5), plus the design-token and responsive-behaviour tables in the same file. The README is the source of truth for the design system; this plan does not re-derive it.

---

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from `README.md` and the existing config.

- **Runtime:** Node 20+ required; local and CI both run Node 22.
- **Design tokens:** Declared once in `app/globals.css` under `@theme`. Colour is `--color-ink #0E0E0E`, `--color-paper #FFFFFF`, `--color-body #3A3A3A`, `--color-mute #6B6B6B`, `--color-faint #8A8A8A`, `--color-rule #E4E4E4`, `--color-stone #F2F1EF`, `--color-wash #FAFAF9`. **There is no accent colour and adding one is a brand decision, not a dev one.** Do not introduce a hex literal in a component; use the token utilities (`text-faint`, `bg-stone`).
- **Type:** Newsreader (300, display, `font-serif`) and Instrument Sans (400/500, UI/body, `font-sans`), both via `next/font/google`. **No other family, no other weight.**
- **Repeated utilities:** `.shell` (`max-width:1560px`, gutter `clamp(20px,4vw,56px)`), `.eyebrow` (11.5px / 500 / 0.16em / uppercase), `.meta` (11.5px / 0.13em / uppercase). Use them; do not re-declare their values inline.
- **Section rhythm:** `sectionPad` = `pt-[clamp(72px,9vw,120px)]`, exported from `components/primitives.tsx`.
- **Fluid sizing:** Type and spacing between breakpoints are `clamp()`. Breakpoints are Tailwind defaults (`sm` 640, `md` 768, `lg` 1024) plus `--breakpoint-xs: 26rem`.
- **Client components:** `components/site-header.tsx` is the only `"use client"` file and must stay that way. Every new page and section is an async server component.
- **TypeScript:** `strict: true`. Zero `any`, zero `@ts-ignore`, zero `eslint-disable`.
- **Formatting:** Prettier — `semi: true`, `singleQuote: false`, `tabWidth: 2`, `trailingComma: "all"`, `printWidth: 100`.
- **Content seam:** `lib/content.ts` is the only module that talks to a content source. Components never import `content/local.ts` directly. Any function added there must be `async` and return a Promise.
- **Path alias:** `@/*` maps to the repo root (`@/lib/content`, `@/components/primitives`).
- **Editorial rule (from `sanity/README.md`):** a transaction row **never names a counterparty**; `asset` is a class, not a property name.
- **Touch targets:** 44px minimum on every interactive element (`min-h-11` / `size-11`).
- **Motion:** `prefers-reduced-motion` already kills smooth scroll and transitions in `globals.css`. Do not add animation that bypasses it.

---

## Decisions Required From the Owner

These block specific tasks. Everything not listed here proceeds on the assumptions stated in-task.

| #      | Decision                                                                                                    | Blocks      | Default if unanswered                                                                                                                                                        |
| ------ | ----------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~D1~~ | ~~Is the domain registered and pointable?~~                                                                 | ~~Task 12~~ | **ANSWERED 2026-09-03 — registered at GoDaddy.** Task 12 Step 8 carries GoDaddy-specific DNS steps. Confirm the exact registered domain matches `site.url` before deploying. |
| D2     | The real mandate record — which six-to-ten rows are true and publishable?                                   | Task 10     | **STILL OPEN — owner says "coming later."** Cannot default. Task 10 Step 2 stops here; the rest of Task 10 proceeds.                                                         |
| ~~D3~~ | ~~Are the stats (18 · 4 · 40+ · USD 1.2B) verified?~~                                                       | ~~Task 10~~ | **ANSWERED 2026-09-03 — verified by the owner.** Task 10 Step 4 is a recorded confirmation, not a gate.                                                                      |
| D4     | Owned hero photography, or move Museo Soumaya to the project frames as an explicit architectural reference? | Task 10     | Move it to the project frames with its CC BY-SA credit intact, and render the hero without a plate.                                                                          |
| D5     | Repo is currently **public**. Keep it public?                                                               | Task 1      | Keep public. The placeholder rows are commented `PENDING`, and nothing secret is committed.                                                                                  |

---

## File Structure

**New files**

| Path                             | Responsibility                                                    |
| -------------------------------- | ----------------------------------------------------------------- |
| `vitest.config.mts`              | Test runner config — jsdom, path aliases, setup file.             |
| `vitest.setup.ts`                | Global matchers + `next/link` / `next/image` mocks.               |
| `.github/workflows/ci.yml`       | typecheck · lint · format · test · build on push and PR.          |
| `app/insights/page.tsx`          | `/insights` — the full note index.                                |
| `app/insights/[slug]/page.tsx`   | `/insights/[slug]` — one note, statically generated.              |
| `app/not-found.tsx`              | 404, in the site's own chrome.                                    |
| `app/robots.ts`                  | `robots.txt` route handler.                                       |
| `app/sitemap.ts`                 | `sitemap.xml`, built from the content seam.                       |
| `app/icon.tsx`                   | Generated square monogram favicon.                                |
| `app/opengraph-image.tsx`        | Generated 1200×630 social card.                                   |
| `app/_fonts/newsreader-300.woff` | Committed font for the two generated images.                      |
| `lib/og-font.ts`                 | Reads that woff — shared by `icon.tsx` and `opengraph-image.tsx`. |
| `lib/structured-data.ts`         | `ProfessionalService` JSON-LD builder.                            |
| `components/insight-body.tsx`    | Renders an `InsightBlock[]` into the type system.                 |

**Modified files**

| Path                                                        | Change                                                              |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `package.json`                                              | Test deps and `test` / `test:run` scripts.                          |
| `tsconfig.json`                                             | `**/*.mts` in `include`, `vitest/globals` in `types`.               |
| `lib/types.ts`                                              | `InsightBlock` union; `Insight` gains `dek`, `publishedAt`, `body`. |
| `lib/content.ts`                                            | `getInsight(slug)` added alongside the two existing readers.        |
| `content/local.ts`                                          | Note bodies; verified transaction record (Task 10).                 |
| `content/site.ts`                                           | Nav hrefs become root-relative so they work off the home page.      |
| `components/insights.tsx`                                   | Cards link to real routes via `next/link`.                          |
| `components/site-header.tsx`                                | Root-relative hrefs, `aria-controls` on the burger.                 |
| `components/hero-image.tsx` / `components/project-pair.tsx` | Photography decision D4 (Task 10).                                  |
| `app/layout.tsx`                                            | Skip link, `twitter` card, `alternates.canonical`.                  |
| `app/page.tsx`                                              | Slices to three notes; emits JSON-LD.                               |
| `sanity/README.md`                                          | GROQ drops the `[0...3]` slice; insight query gains the new fields. |
| `README.md`                                                 | Open items closed out; test + deploy sections added.                |

Branching: work commits directly to `main`. The repo is empty, this is a solo launch, and production deploy is gated on Task 12 — a long-lived branch would buy nothing. CI runs on every push to `main`.

---

## Task 1: Repository and test harness

Version control does not exist yet (`git status` → _not a repository_) and there is no test runner. Both are prerequisites for every commit in this plan, so they land together. The tests written here are **characterization tests**: they pin down behaviour the current code already has, so that later tasks changing `content/local.ts` cannot silently break the record's shape.

**Files:**

- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`
- Create: `.gitignore` entry — none needed, `node_modules`/`.next` already covered
- Modify: `package.json` (scripts + devDependencies)
- Modify: `tsconfig.json:31-38` (`include`) and `compilerOptions`
- Test: `content/local.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `npm run test:run` (single-pass, used by CI) and `npm test` (watch). A jsdom environment with `@testing-library/jest-dom` matchers, `@/*` path resolution, and module mocks for `next/link` and `next/image`.

- [ ] **Step 1: Establish a clean formatting baseline**

The repo does not currently satisfy its own Prettier config. `npx prettier --check` flags **seven files**: `app/globals.css`, `components/about.tsx`, `components/hero.tsx`, `components/primitives.tsx`, `components/site-header.tsx`, `components/transactions.tsx` and `content/local.ts`. CI will enforce `format:check` in Task 2, so normalise first, as its own commit, to keep the reformat out of every later diff.

Run the check first so you can see the same list:

```bash
npx prettier --check .
```

Expected: FAIL — `Code style issues found in 7 files.`

```bash
npm run format
```

- [ ] **Step 2: Initialise the repository and push the current state**

The remote already exists and is empty: `rfarias23/jcfarias-co`, public. Use HTTPS — `gh auth status` reports `Git operations protocol: https`, so an SSH remote would prompt for a key that is not configured.

```bash
git init -b main
git add .
git commit -m "chore: initial commit — J.C. Farias & Co. landing page"
git remote add origin https://github.com/rfarias23/jcfarias-co.git
git push -u origin main
```

- [ ] **Step 3: Confirm the push landed**

```bash
gh repo view rfarias23/jcfarias-co --json defaultBranchRef,isEmpty
```

Expected: `{"defaultBranchRef":{"name":"main"},"isEmpty":false}`

- [ ] **Step 4: Run the test command to verify it does not exist**

```bash
npm run test:run
```

Expected: FAIL — `npm error Missing script: "test:run"`. This is the red state for a harness task.

- [ ] **Step 5: Install the test dependencies**

`@vitejs/plugin-react` compiles JSX. `vite-tsconfig-paths` makes `@/*` resolve in tests without duplicating the alias. `jsdom` gives the DOM that Testing Library asserts against.

```bash
npm i -D vitest@^3 @vitejs/plugin-react@^5 vite-tsconfig-paths@^5 jsdom@^26 \
  @testing-library/react@^16 @testing-library/jest-dom@^6
```

- [ ] **Step 6: Write the Vitest config**

The file is `.mts`, not `.ts`: `package.json` has no `"type": "module"`, and the `.mts` extension is what tells Node the config is ESM. This is the extension Next.js documents for exactly this reason.

Create `vitest.config.mts`:

```ts
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
```

- [ ] **Step 7: Write the setup file**

`next/link` and `next/image` both reach for App Router context that Testing Library does not provide, and `Link` throws _"invariant expected app router to be mounted"_ when rendered bare. Both degrade to the plain element they wrap — which is exactly what these tests assert on — so mocking them globally here keeps every test file free of the same boilerplate. The `next/image` mock deliberately drops `fill` and `priority`: forwarding them to a real `<img>` produces React unknown-attribute warnings.

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href }, children),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => React.createElement("img", { src, alt }),
}));
```

- [ ] **Step 8: Teach TypeScript about the new files**

`**/*.ts` does not match `.mts`, so without the added pattern the Vitest config is outside the project and `npm run typecheck` never sees it. `vitest/globals` supplies `describe`/`it`/`expect` types, which `globals: true` makes available at runtime.

**`"node"` is not optional here.** Specifying `types` at all switches off automatic inclusion of every `@types/*` package, so omitting `node` would drop `@types/node` and break `next.config.ts` plus Task 9's `import { readFile } from "node:fs/promises"`. The jest-dom matchers do not need a `types` entry — `vitest.setup.ts` is inside `include`, so its `import "@testing-library/jest-dom/vitest"` augments Vitest's `Assertion` interface for the whole program.

In `tsconfig.json`, add `"types"` inside `compilerOptions` and `"**/*.mts"` to `include`:

```json
{
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.mts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

- [ ] **Step 9: Add the scripts**

In `package.json`, inside `"scripts"`:

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 10: Write the characterization test**

Create `content/local.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getTransactions } from "@/lib/content";

describe("the transaction record", () => {
  it("gives every row all five columns", async () => {
    for (const row of await getTransactions()) {
      expect(row.asset.trim()).not.toBe("");
      expect(row.market.trim()).not.toBe("");
      expect(row.scale.trim()).not.toBe("");
      expect(row.role.trim()).not.toBe("");
      expect(row.year).toMatch(/^\d{4}$/);
    }
  });

  it("orders rows newest first", async () => {
    const years = (await getTransactions()).map((row) => row.year);
    expect([...years].sort().reverse()).toEqual(years);
  });
});
```

- [ ] **Step 11: Run the suite and verify it passes**

```bash
npm run test:run
```

Expected: PASS — `2 passed`. The harness is proven and the record's shape is now pinned.

- [ ] **Step 12: Verify nothing else regressed**

```bash
npm run typecheck && npm run lint && npm run format:check
```

Expected: all three exit 0.

- [ ] **Step 13: Commit**

```bash
git add package.json package-lock.json tsconfig.json vitest.config.mts vitest.setup.ts content/local.test.ts
git commit -m "test: add Vitest harness with jsdom and Testing Library"
git push
```

---

## Task 2: Continuous integration

Five commands guard this repo. Running them by hand is how one of them stops being run. The workflow makes `main` self-policing before Vercel is ever attached to it.

**Files:**

- Create: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: the `typecheck`, `lint`, `format:check`, `test:run` and `build` scripts from Task 1.
- Produces: a required-status-check-capable workflow named `ci`.

- [ ] **Step 1: Write the workflow**

`npm ci` rather than `npm install` — it installs exactly the lockfile and fails if `package.json` and `package-lock.json` have drifted, which is the behaviour you want in CI. Node 22 matches local; the README's floor is 20.

Create `.github/workflows/ci.yml`:

```yaml
name: ci

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run format:check
      - run: npm run test:run
      - run: npm run build
        env:
          CONTENT_SOURCE: local
```

- [ ] **Step 2: Run the same sequence locally before pushing**

```bash
npm ci && npm run typecheck && npm run lint && npm run format:check && npm run test:run && npm run build
```

Expected: all pass. `npm run build` should report the home page as a static route (`○` or `●`).

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: verify typecheck, lint, format, tests and build on push"
git push
```

- [ ] **Step 4: Verify the run went green on GitHub**

```bash
gh run watch
```

Expected: `verify` completes with conclusion `success`. If it fails on `format:check`, Task 1 Step 1 was skipped — run `npm run format`, commit, push.

---

## Task 3: Give insights a body

`sanity/schemas/insight.ts` already declares a `body` field as a Portable Text block array, but `lib/types.ts` has no counterpart — which is precisely why "All notes" is still an anchor to `#insights`. This task closes the model gap.

The body is a **discriminated union of block objects**, not an HTML string. Three reasons: a union renders through an exhaustive `switch` that TypeScript checks for completeness, so adding a block kind later is a compile error rather than a silent no-op; there is no `dangerouslySetInnerHTML` and therefore no injection surface; and each `kind` maps one-to-one onto a Portable Text block style when Sanity arrives.

**Files:**

- Modify: `lib/types.ts:11-18` (the `Insight` type)
- Modify: `lib/content.ts:26-38`
- Modify: `content/local.ts:16-38` (the `insights` array)
- Modify: `sanity/README.md` (GROQ contract)
- Test: `lib/content.test.ts`

**Interfaces:**

- Consumes: `getInsights(): Promise<Insight[]>` from Task 1's baseline.
- Produces:
  - `type InsightBlock = { kind: "lead" | "paragraph" | "heading" | "pullquote"; text: string }` as a union of four single-`kind` object types.
  - `Insight` gains `dek: string`, `publishedAt: string` (ISO 8601), `body: InsightBlock[]`.
  - `getInsight(slug: string): Promise<Insight | null>` — returns `null`, never throws, for an unknown slug.

- [ ] **Step 1: Write the failing tests**

Create `lib/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getInsight, getInsights } from "@/lib/content";

describe("getInsights", () => {
  it("orders notes newest first", async () => {
    const dates = (await getInsights()).map((note) => note.publishedAt);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("gives every note a unique slug", async () => {
    const slugs = (await getInsights()).map((note) => note.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every note a dek and a non-empty body", async () => {
    for (const note of await getInsights()) {
      expect(note.dek.trim()).not.toBe("");
      expect(note.body.length).toBeGreaterThan(0);
    }
  });

  it("opens every note with a lead block", async () => {
    for (const note of await getInsights()) {
      expect(note.body[0].kind).toBe("lead");
    }
  });
});

describe("getInsight", () => {
  it("finds a note by slug", async () => {
    const note = await getInsight("pricing-land-dollarized-economy");
    expect(note?.title).toBe("Pricing land in a dollarized economy");
  });

  it("returns null for an unknown slug", async () => {
    expect(await getInsight("no-such-note")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
npm run test:run -- lib/content.test.ts
```

Expected: FAIL — `getInsight is not a function`, plus type errors on `publishedAt`, `dek` and `body`.

- [ ] **Step 3: Extend the types**

In `lib/types.ts`, add `InsightBlock` above `Insight` and replace the `Insight` type:

```ts
/**
 * One editorial block. Each kind maps to a Portable Text block style, so the
 * shape survives the move to Sanity: lead → normal (lead), heading → h2,
 * pullquote → blockquote, paragraph → normal.
 */
export type InsightBlock =
  | { kind: "lead"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "pullquote"; text: string };

export type Insight = {
  slug: string;
  category: string;
  title: string;
  /** Display label, e.g. "Note 03". */
  number: string;
  year: string;
  /** ISO 8601. Sorts the record and drives sitemap lastModified. */
  publishedAt: string;
  /** One-sentence standfirst. Shown on the index, reused as meta description. */
  dek: string;
  body: InsightBlock[];
};
```

- [ ] **Step 4: Add the single-note reader to the seam**

In `lib/content.ts`, append below `getInsights`:

```ts
export async function getInsight(slug: string): Promise<Insight | null> {
  const all = await getInsights();
  return all.find((note) => note.slug === slug) ?? null;
}
```

With Sanity this becomes a parameterised GROQ fetch; reading through `getInsights` keeps the local branch to one array and one code path.

- [ ] **Step 5: Write the note bodies**

Replace the `insights` array in `content/local.ts`. The prose below is publishable but unverified — it carries no figure that is not already public knowledge, and Task 10 reviews it. Voice matches the site: declarative, no hype, no exclamation, no first-person plural beyond "we".

```ts
export const insights: Insight[] = [
  {
    slug: "five-year-window-keys-pr-dr",
    category: "Hospitality · Caribbean",
    title: "The five-year window for keys in Puerto Rico and the DR",
    number: "Note 03",
    year: "2026",
    publishedAt: "2026-02-11",
    dek: "Two Caribbean markets are absorbing hotel capital at very different speeds, and the reason is not demand.",
    body: [
      {
        kind: "lead",
        text: "Both markets are described to capital as the same trade. They are not. One is constrained by what can be built, the other by what can be financed, and an underwriting model that does not separate the two will misprice both.",
      },
      {
        kind: "paragraph",
        text: "The Dominican Republic has the land and the construction capacity. What it lacks is a deep domestic lending market for hospitality, which pushes sponsors toward offshore debt and, with it, toward currency and covenant structures that a local operator is rarely equipped to carry through a soft season.",
      },
      { kind: "heading", text: "Puerto Rico inverts the constraint" },
      {
        kind: "paragraph",
        text: "Capital is available and dollar-denominated. Sites are not. The inventory that trades is largely existing keys requiring repositioning, which turns the question from development yield into an operating question: can this asset be taken off its current brand and re-flagged without losing a season.",
      },
      {
        kind: "pullquote",
        text: "The window is not about demand. It is about how long the two constraints stay mismatched.",
      },
      {
        kind: "paragraph",
        text: "For a sponsor holding a mandate in one market, the discipline is to underwrite the constraint rather than the destination. For a sponsor holding both, the sequencing matters more than the entry price.",
      },
    ],
  },
  {
    slug: "franchise-expansion-lima-quito",
    category: "Partnerships · Andes",
    title: "Why franchise expansion fails in Lima and Quito",
    number: "Note 02",
    year: "2026",
    publishedAt: "2026-01-14",
    dek: "Most master-franchise agreements in the Andes fail on partner selection, not on the brand or the unit economics.",
    body: [
      {
        kind: "lead",
        text: "A brand entering Lima or Quito usually arrives with the unit model solved and the partner question open. That order is backwards, and it is the most common reason a regional rollout stalls at four locations.",
      },
      {
        kind: "paragraph",
        text: "The candidate who signs fastest is typically the one with the most capital and the least operating depth. They can fund the first three units and cannot staff the fifth. By the time this is visible in the numbers, the territory is committed and the brand's remedies are contractual rather than practical.",
      },
      { kind: "heading", text: "What to test before the term sheet" },
      {
        kind: "paragraph",
        text: "Whether the partner already runs something with shift-level supervision. Whether their real estate relationships are their own or borrowed. Whether they have survived one devaluation with the business intact. None of these appear in a financial model, and all three predict unit five better than the balance sheet does.",
      },
      {
        kind: "pullquote",
        text: "A master franchise is an operating partnership wearing a licensing agreement.",
      },
    ],
  },
  {
    slug: "pricing-land-dollarized-economy",
    category: "Underwriting",
    title: "Pricing land in a dollarized economy",
    number: "Note 01",
    year: "2025",
    publishedAt: "2025-10-02",
    dek: "When the currency cannot absorb a shock, the land price does — and comparables lag by a year or more.",
    body: [
      {
        kind: "lead",
        text: "In a dollarized economy the exchange rate stops acting as a shock absorber. The adjustment has to happen somewhere, and in real estate it happens in land, slowly and without an observable print.",
      },
      {
        kind: "paragraph",
        text: "Ecuador is the clearest case in the region. Because there is no devaluation to reprice an asset overnight, sellers hold nominal expectations far longer than the market supports them, and the transaction record thins out rather than adjusting. A comparables set drawn from that record will read as stability when it is actually absence.",
      },
      { kind: "heading", text: "Underwrite the bid, not the ask" },
      {
        kind: "paragraph",
        text: "The workable method is to price from what a developer can pay given today's construction cost and achievable sale price, then treat the gap to the asking price as the negotiation rather than as a market signal. That gap has been wide enough, long enough, that patience is a genuine source of return.",
      },
    ],
  },
];
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — `8 passed` across both test files.

- [ ] **Step 7: Update the CMS contract to match**

In `sanity/README.md`, the insight query drops the `[0...3]` slice — the home page now does its own slicing so the index route can read the full record from one query — and gains the new fields:

```
export const INSIGHTS_QUERY = `*[_type == "insight" && !hidden] | order(publishedAt desc){
  "slug": slug.current, category, title, number, "year": string(year),
  "publishedAt": string(publishedAt), dek, body
}`;
```

Add a line under "Editorial rules the schema enforces":

```
- `dek` is a single sentence; it is reused verbatim as the page's meta description.
```

Add `dek` to `sanity/schemas/insight.ts` so the schema and the type agree:

```ts
{
  name: "dek",
  title: "Dek",
  type: "text",
  rows: 2,
  description: "One sentence. Shown on the index and used as the meta description.",
  validation: (rule: Rule) => rule.required(),
},
```

- [ ] **Step 8: Verify and commit**

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:run
git add lib/types.ts lib/content.ts lib/content.test.ts content/local.ts sanity/
git commit -m "feat: add body, dek and publishedAt to the insight model"
git push
```

---

## Task 4: The `/insights` index

**Files:**

- Create: `app/insights/page.tsx`
- Test: `app/insights/page.test.tsx`

**Interfaces:**

- Consumes: `getInsights()` and the `Insight` fields from Task 3; `Shell`, `SectionHead`, `sectionPad` from `@/components/primitives`; `SiteHeader`, `ContactFooter`.
- Produces: the route `/insights`. Task 6 links to it and Task 8 lists it in the sitemap.

Note on heading levels: `SectionHead` renders its title as an `<h2>`. The page's own `<h1>` is the index title, so each note title in the list is an `<h3>` — it sits under the "All notes" `<h2>`. Getting this wrong is the most common accessibility defect on a listing page.

- [ ] **Step 1: Write the failing test**

Rendering an async server component: Testing Library cannot render one directly, but the component is just an async function returning JSX, so `render(await Page())` works. This holds as long as the component uses no request-scoped API — true here, and true for every page in this plan.

Create `app/insights/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InsightsIndexPage from "@/app/insights/page";
import { getInsights } from "@/lib/content";

describe("/insights", () => {
  it("links every published note to its detail page", async () => {
    render(await InsightsIndexPage());
    for (const note of await getInsights()) {
      const link = screen.getByRole("link", { name: new RegExp(note.title, "i") });
      expect(link).toHaveAttribute("href", `/insights/${note.slug}`);
    }
  });

  it("shows each note's dek", async () => {
    render(await InsightsIndexPage());
    const [first] = await getInsights();
    expect(screen.getByText(first.dek)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm run test:run -- app/insights/page.test.tsx
```

Expected: FAIL — `Failed to resolve import "@/app/insights/page"`.

- [ ] **Step 3: Write the page**

Create `app/insights/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ContactFooter } from "@/components/contact-footer";
import { SectionHead, Shell, sectionPad } from "@/components/primitives";
import { SiteHeader } from "@/components/site-header";
import { getInsights } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes on real estate, partnerships and value creation across the Andes and the Caribbean.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsIndexPage() {
  const insights = await getInsights();

  return (
    <>
      <SiteHeader />
      <main>
        <Shell className="pt-[clamp(56px,9vw,132px)]">
          <p className="eyebrow m-0 mb-7 text-faint">Insights</p>
          <h1 className="m-0 max-w-[16ch] font-serif text-[clamp(38px,6.4vw,84px)] font-light leading-[1.02] tracking-[-0.026em]">
            Notes from the corridor.
          </h1>
          <p className="mt-8 mb-0 max-w-[52ch] text-[16.5px] leading-[1.62] text-body">
            Short and infrequent. What we see in the transactions we take, and in the ones we
            decline.
          </p>
        </Shell>

        <Shell className={sectionPad}>
          <SectionHead title="All notes" aside={`${insights.length} published`} />
          <ul className="m-0 list-none p-0">
            {insights.map((note) => (
              <li key={note.slug} className="border-b border-rule">
                <Link
                  href={`/insights/${note.slug}`}
                  className="grid gap-x-8 gap-y-4 py-[clamp(28px,4vw,44px)] transition-opacity hover:opacity-55 lg:grid-cols-[0.26fr_1fr_0.16fr] lg:items-baseline"
                >
                  <p className="m-0 text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
                    {note.category}
                  </p>
                  <div>
                    <h3 className="m-0 font-serif text-[clamp(24px,3vw,40px)] font-light leading-[1.14] tracking-[-0.018em]">
                      {note.title}
                    </h3>
                    <p className="mt-4 mb-0 max-w-[58ch] text-[15.5px] leading-[1.6] text-body">
                      {note.dek}
                    </p>
                  </div>
                  <p className="meta m-0 text-faint lg:text-right">
                    {note.number} · {note.year}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Shell>
      </main>
      <ContactFooter />
    </>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm run test:run -- app/insights/page.test.tsx
```

Expected: PASS — `2 passed`.

- [ ] **Step 5: Look at it in a browser**

```bash
npm run dev
```

Open `http://localhost:3000/insights`. Check at 375px, 768px and 1440px: the three-column row collapses to stacked under `lg`, the hairline `border-rule` runs the full shell width, and the header/footer match the home page exactly.

- [ ] **Step 6: Commit**

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:run
git add app/insights/page.tsx app/insights/page.test.tsx
git commit -m "feat: add the /insights index route"
git push
```

---

## Task 5: The `/insights/[slug]` detail page

**Files:**

- Create: `components/insight-body.tsx`
- Create: `app/insights/[slug]/page.tsx`
- Test: `components/insight-body.test.tsx`
- Test: `app/insights/[slug]/page.test.tsx`

**Interfaces:**

- Consumes: `getInsight(slug)`, `getInsights()`, `InsightBlock` from Task 3.
- Produces: the route `/insights/[slug]`, statically generated for every slug via `generateStaticParams`. Task 8's sitemap enumerates the same slugs.

Two Next.js 15 specifics that will bite an engineer coming from 14:

1. **`params` is a Promise.** `{ params }: { params: Promise<{ slug: string }> }`, and you must `await params` before reading `slug`. Destructuring it synchronously is a type error and a runtime warning.
2. **`notFound()` throws.** It does not return. Calling it inside a `try` block whose `catch` swallows errors silently breaks the 404 — the same class of bug as `redirect()` in a catch. There is no `try` here; keep it that way.

- [ ] **Step 1: Write the failing test for the body renderer**

Create `components/insight-body.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InsightBody } from "@/components/insight-body";
import type { InsightBlock } from "@/lib/types";

const blocks: InsightBlock[] = [
  { kind: "lead", text: "The lead paragraph." },
  { kind: "heading", text: "A section heading" },
  { kind: "paragraph", text: "An ordinary paragraph." },
  { kind: "pullquote", text: "A quotable line." },
];

describe("InsightBody", () => {
  it("renders a heading block as a level-2 heading", () => {
    render(<InsightBody blocks={blocks} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "A section heading" }),
    ).toBeInTheDocument();
  });

  it("renders a pullquote as a blockquote", () => {
    const { container } = render(<InsightBody blocks={blocks} />);
    expect(container.querySelector("blockquote")?.textContent).toBe("A quotable line.");
  });

  it("renders every block", () => {
    render(<InsightBody blocks={blocks} />);
    for (const block of blocks) {
      expect(screen.getByText(block.text)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm run test:run -- components/insight-body.test.tsx
```

Expected: FAIL — `Failed to resolve import "@/components/insight-body"`.

- [ ] **Step 3: Write the body renderer**

The `switch` has no `default` on purpose. Every arm returns, so TypeScript narrows `block` to `never` after the last case — which means adding a fifth `kind` to the union makes this function fail to compile until it is handled. That is the whole reason the body is a union and not a string.

Create `components/insight-body.tsx`:

```tsx
import type { InsightBlock } from "@/lib/types";

export function InsightBody({ blocks }: { blocks: InsightBlock[] }) {
  return (
    <div className="flex flex-col gap-7">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        switch (block.kind) {
          case "lead":
            return (
              <p
                key={key}
                className="m-0 font-serif text-[clamp(21px,2.2vw,28px)] font-light leading-[1.44] tracking-[-0.012em] text-ink"
              >
                {block.text}
              </p>
            );
          case "heading":
            return (
              <h2
                key={key}
                className="m-0 mt-6 font-serif text-[clamp(22px,2.4vw,30px)] font-light leading-[1.2] tracking-[-0.016em]"
              >
                {block.text}
              </h2>
            );
          case "pullquote":
            return (
              <blockquote
                key={key}
                className="my-6 border-l border-ink pl-7 font-serif text-[clamp(20px,2.2vw,27px)] leading-[1.4] font-light tracking-[-0.012em] italic"
              >
                {block.text}
              </blockquote>
            );
          case "paragraph":
            return (
              <p key={key} className="m-0 text-[16.5px] leading-[1.72] text-body">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm run test:run -- components/insight-body.test.tsx
```

Expected: PASS — `3 passed`.

- [ ] **Step 5: Write the failing test for the page**

Create `app/insights/[slug]/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InsightPage, { generateMetadata, generateStaticParams } from "@/app/insights/[slug]/page";
import { getInsights } from "@/lib/content";

const slug = "pricing-land-dollarized-economy";

describe("/insights/[slug]", () => {
  it("pre-renders one param per published note", async () => {
    const params = await generateStaticParams();
    const slugs = (await getInsights()).map((note) => note.slug);
    expect(params).toEqual(slugs.map((s) => ({ slug: s })));
  });

  it("renders the note title as the page's only h1", async () => {
    render(await InsightPage({ params: Promise.resolve({ slug }) }));
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Pricing land in a dollarized economy");
  });

  it("uses the dek as the meta description", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug }) });
    expect(meta.description).toBe(
      "When the currency cannot absorb a shock, the land price does — and comparables lag by a year or more.",
    );
  });

  it("404s on an unknown slug", async () => {
    await expect(
      InsightPage({ params: Promise.resolve({ slug: "no-such-note" }) }),
    ).rejects.toThrow();
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

```bash
npm run test:run -- "app/insights/[slug]/page.test.tsx"
```

Expected: FAIL — `Failed to resolve import "@/app/insights/[slug]/page"`.

- [ ] **Step 7: Write the page**

Create `app/insights/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactFooter } from "@/components/contact-footer";
import { InsightBody } from "@/components/insight-body";
import { Shell } from "@/components/primitives";
import { SiteHeader } from "@/components/site-header";
import { getInsight, getInsights } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const insights = await getInsights();
  return insights.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getInsight(slug);
  if (!note) return {};

  return {
    title: note.title,
    description: note.dek,
    alternates: { canonical: `/insights/${note.slug}` },
    openGraph: {
      type: "article",
      title: note.title,
      description: note.dek,
      publishedTime: note.publishedAt,
    },
  };
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getInsight(slug);
  if (!note) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <Shell className="pt-[clamp(48px,7vw,104px)]">
          <div className="mx-auto max-w-[760px]">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink pb-5">
              <p className="eyebrow m-0">{note.category}</p>
              <p className="meta m-0 text-faint">
                {note.number} · {note.year}
              </p>
            </div>
            <h1 className="mt-10 mb-0 font-serif text-[clamp(32px,5vw,60px)] font-light leading-[1.06] tracking-[-0.024em] text-balance">
              {note.title}
            </h1>
            <p className="mt-7 mb-0 max-w-[56ch] text-[16.5px] leading-[1.62] text-mute">
              {note.dek}
            </p>
            <div className="mt-12">
              <InsightBody blocks={note.body} />
            </div>
            <div className="mt-16 border-t border-rule pt-7">
              <Link href="/insights" className="meta font-medium text-faint hover:text-ink">
                ← All notes
              </Link>
            </div>
          </div>
        </Shell>
      </main>
      <ContactFooter />
    </>
  );
}
```

- [ ] **Step 8: Run it to verify it passes**

```bash
npm run test:run
```

Expected: PASS — the full suite, `17 passed`.

- [ ] **Step 9: Confirm the routes are statically generated**

```bash
npm run build
```

Expected: the route table lists `/insights/[slug]` as `● SSG` with three generated paths, and `/insights` as static.

- [ ] **Step 10: Look at it in a browser**

```bash
npm run dev
```

Open `http://localhost:3000/insights/pricing-land-dollarized-economy`. The measure should hold at ~760px on desktop; the lead should read as Newsreader 300; `http://localhost:3000/insights/nope` should 404.

- [ ] **Step 11: Commit**

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:run
git add components/insight-body.tsx components/insight-body.test.tsx "app/insights/[slug]"
git commit -m "feat: add the /insights/[slug] detail route"
git push
```

---

## Task 6: Wire the home page in and fix cross-page navigation

The routes now exist but nothing reaches them, and there is a bug the routes have just exposed: every entry in `navLinks` is a bare fragment (`#practice`, `#transactions`, …), and the header renders on `/insights/[slug]` too. From a note page, `#practice` scrolls to nothing — the target is on another document. Making them root-relative (`/#practice`) fixes the sub-page case without changing behaviour on the home page, where the browser still treats it as a same-document fragment jump and the smooth scroll survives.

**Files:**

- Modify: `content/site.ts:10-15` (`navLinks`)
- Modify: `components/site-header.tsx:29` (logo), `:46` (Contact), `:106` (mobile Contact)
- Modify: `components/insights.tsx:5-34`
- Modify: `app/page.tsx:28` (the `<Insights />` element)
- Test: `content/site.test.ts`
- Test: `components/insights.test.tsx`

**Interfaces:**

- Consumes: `/insights` (Task 4) and `/insights/[slug]` (Task 5).
- Produces: no new exports. `Insights` keeps its `{ insights: Insight[] }` prop.

- [ ] **Step 1: Write the failing tests**

Create `content/site.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { navLinks } from "@/content/site";

describe("navLinks", () => {
  it("uses root-relative fragments so the nav works off the home page", () => {
    for (const link of navLinks) {
      expect(link.href).toMatch(/^\/#/);
    }
  });
});
```

Create `components/insights.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Insights } from "@/components/insights";
import { getInsights } from "@/lib/content";

describe("Insights", () => {
  it("links each card to the note's detail page", async () => {
    const insights = await getInsights();
    render(<Insights insights={insights} />);
    const link = screen.getByRole("link", { name: new RegExp(insights[0].title, "i") });
    expect(link).toHaveAttribute("href", `/insights/${insights[0].slug}`);
  });

  it("links the section aside to the full index", async () => {
    render(<Insights insights={await getInsights()} />);
    expect(screen.getByRole("link", { name: "All notes" })).toHaveAttribute("href", "/insights");
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

```bash
npm run test:run -- content/site.test.ts components/insights.test.tsx
```

Expected: FAIL — `expected "#practice" to match /^\/#/` and `expected "#insights" to be "/insights"`.

- [ ] **Step 3: Make the nav root-relative**

In `content/site.ts`:

```ts
export const navLinks = [
  { label: "Practice", href: "/#practice" },
  { label: "Transactions", href: "/#transactions" },
  { label: "Insights", href: "/#insights" },
  { label: "About", href: "/#about" },
];
```

In `components/site-header.tsx`, change the three remaining bare fragments — the logo anchor `href="#top"` → `href="/#top"`, the desktop Contact button `href="#contact"` → `href="/#contact"`, and the mobile menu Contact `href="#contact"` → `href="/#contact"`.

- [ ] **Step 4: Point the insight cards at the routes**

Rewrite `components/insights.tsx`:

```tsx
import Link from "next/link";
import { SectionHead, Shell, sectionPad } from "@/components/primitives";
import { cn } from "@/lib/cn";
import type { Insight } from "@/lib/types";

export function Insights({ insights }: { insights: Insight[] }) {
  return (
    <Shell id="insights" className={sectionPad}>
      <SectionHead title="Insights" aside="All notes" asideHref="/insights" />
      <div className="grid grid-cols-1 gap-px bg-rule md:grid-cols-3">
        {insights.map((note, i) => (
          <Link
            key={note.slug}
            href={`/insights/${note.slug}`}
            className={cn(
              "flex flex-col gap-6 bg-paper py-11 transition-opacity hover:opacity-55",
              "md:px-[clamp(24px,3vw,56px)]",
              i === 0 && "md:pl-0",
              i === insights.length - 1 && "md:pr-0",
            )}
          >
            <p className="m-0 text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
              {note.category}
            </p>
            <h3 className="m-0 font-serif text-[clamp(23px,2.4vw,32px)] font-light leading-[1.18] tracking-[-0.016em]">
              {note.title}
            </h3>
            <p className="meta m-0 mt-auto pt-4 text-faint">
              {note.number} · {note.year}
            </p>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
```

- [ ] **Step 5: Keep the home grid at three columns**

`getInsights()` now returns the whole record, and the home section is a three-column grid whose flush-left/right padding is index-aware. Slice at the call site so the section stays visually correct as the archive grows.

In `app/page.tsx`, change the render of `Insights`:

```tsx
<Insights insights={insights.slice(0, 3)} />
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — `20 passed`.

- [ ] **Step 7: Click through it**

```bash
npm run dev
```

From `http://localhost:3000`: click an insight card → lands on the note. From the note, open the mobile menu at 375px and click "Practice" → returns to `/` and scrolls to the practice section. Click "All notes" in the home Insights header → `/insights`.

- [ ] **Step 8: Commit**

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:run
git add content/site.ts content/site.test.ts components/site-header.tsx components/insights.tsx components/insights.test.tsx app/page.tsx
git commit -m "feat: link the site to the insight routes and fix cross-page nav"
git push
```

---

## Task 7: A 404 in the site's own chrome

`/insights/[slug]` can now 404, and `notFound()` currently falls through to Next's unstyled default page. A public site should not have a page that looks like it belongs to a different product.

**Files:**

- Create: `app/not-found.tsx`
- Test: `app/not-found.test.tsx`

**Interfaces:**

- Consumes: `SiteHeader`, `ContactFooter`, `Shell`.
- Produces: the global not-found boundary. `notFound()` from any route renders it.

- [ ] **Step 1: Write the failing test**

Create `app/not-found.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "@/app/not-found";

describe("not-found", () => {
  it("offers a route back into the site", () => {
    render(<NotFound />);
    expect(screen.getByRole("link", { name: /Return home/i })).toHaveAttribute("href", "/");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm run test:run -- app/not-found.test.tsx
```

Expected: FAIL — `Failed to resolve import "@/app/not-found"`.

- [ ] **Step 3: Write the page**

Create `app/not-found.tsx`:

```tsx
import Link from "next/link";
import { ContactFooter } from "@/components/contact-footer";
import { Shell } from "@/components/primitives";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Shell className="pt-[clamp(72px,12vw,160px)] pb-[clamp(72px,12vw,160px)]">
          <p className="eyebrow m-0 mb-7 text-faint">404</p>
          <h1 className="m-0 max-w-[18ch] font-serif text-[clamp(34px,5.6vw,72px)] font-light leading-[1.04] tracking-[-0.026em]">
            This page is not part of the record.
          </h1>
          <div className="mt-12 flex flex-wrap gap-x-9 gap-y-4">
            <Link href="/" className="meta font-medium text-faint hover:text-ink">
              Return home
            </Link>
            <Link href="/insights" className="meta font-medium text-faint hover:text-ink">
              All notes
            </Link>
          </div>
        </Shell>
      </main>
      <ContactFooter />
    </>
  );
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm run test:run -- app/not-found.test.tsx
```

Expected: PASS — `1 passed`.

- [ ] **Step 5: See it in a browser**

```bash
npm run dev
```

Visit `http://localhost:3000/insights/nope` and `http://localhost:3000/anything`. Both should render this page with the real header and footer.

- [ ] **Step 6: Commit**

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:run
git add app/not-found.tsx app/not-found.test.tsx
git commit -m "feat: add a styled 404 page"
git push
```

---

## Task 8: Indexability — robots, sitemap and structured data

The site has good `metadata` in `app/layout.tsx` but no `robots.txt`, no `sitemap.xml` and no structured data. For a firm whose visibility depends on being found by name, the JSON-LD is the highest-value piece: it is what lets a search engine render the firm as an organisation with an email and a service area rather than as an anonymous page.

**Files:**

- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `lib/structured-data.ts`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx:19-40` (metadata)
- Test: `lib/structured-data.test.ts`
- Test: `app/sitemap.test.ts`

**Interfaces:**

- Consumes: `site` from `@/content/site`, `offices` from `@/content/site`, `getInsights()`.
- Produces:
  - `professionalServiceJsonLd(): Record<string, unknown>`
  - `serializeJsonLd(data: unknown): string` — JSON with `<` escaped.
  - The routes `/robots.txt` and `/sitemap.xml`.

- [ ] **Step 1: Write the failing tests**

The escaping test is the important one. `JSON.stringify` does not escape `<`, so a string containing `</script>` inside a JSON-LD payload closes the tag early and everything after it is parsed as HTML. Today the inputs are hand-authored constants; the moment a CMS supplies them, this is the injection point.

Create `lib/structured-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { professionalServiceJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { offices, site } from "@/content/site";

describe("professionalServiceJsonLd", () => {
  it("identifies the firm by name, url and email", () => {
    const data = professionalServiceJsonLd();
    expect(data["@type"]).toBe("ProfessionalService");
    expect(data.name).toBe(site.name);
    expect(data.url).toBe(site.url);
    expect(data.email).toBe(site.email);
  });

  it("lists every office as a served place", () => {
    const data = professionalServiceJsonLd();
    expect(data.areaServed).toHaveLength(offices.length);
  });
});

describe("serializeJsonLd", () => {
  it("escapes angle brackets so the script tag cannot be closed early", () => {
    const payload = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(payload).not.toContain("</script>");
    expect(payload).toContain("\\u003c");
  });

  it("round-trips to the same object", () => {
    expect(JSON.parse(serializeJsonLd({ a: 1, b: "two" }))).toEqual({ a: 1, b: "two" });
  });
});
```

Create `app/sitemap.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { site } from "@/content/site";
import { getInsights } from "@/lib/content";

describe("sitemap", () => {
  it("lists the home page, the index and every note", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    const notes = await getInsights();
    expect(urls).toContain(site.url);
    expect(urls).toContain(`${site.url}/insights`);
    for (const note of notes) {
      expect(urls).toContain(`${site.url}/insights/${note.slug}`);
    }
    expect(urls).toHaveLength(notes.length + 2);
  });

  it("dates each note entry from its publication date", async () => {
    const entries = await sitemap();
    const [first] = await getInsights();
    const entry = entries.find((e) => e.url.endsWith(first.slug));
    expect(entry?.lastModified).toEqual(new Date(first.publishedAt));
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

```bash
npm run test:run -- lib/structured-data.test.ts app/sitemap.test.ts
```

Expected: FAIL — both imports unresolved.

- [ ] **Step 3: Write the structured data module**

Create `lib/structured-data.ts`:

```ts
import { offices, site } from "@/content/site";

export function professionalServiceJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: site.email,
    slogan: site.tagline,
    description:
      "An advisory firm for institutional and private capital across the Andes and the Caribbean.",
    areaServed: offices.map((office) => ({
      "@type": "Place",
      name: `${office.city}, ${office.country}`,
    })),
    knowsAbout: [
      "Real estate investment",
      "Real estate development",
      "Asset strategy",
      "Joint-venture formation",
      "Market entry advisory",
      "Master franchising",
    ],
  };
}

/**
 * JSON.stringify does not escape "<". Inside a <script> tag an unescaped
 * "</script>" in any string value ends the block and the rest is parsed as
 * markup. Escaping it here keeps that true no matter where the values come from.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
```

- [ ] **Step 4: Write robots and sitemap**

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
```

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getInsights } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const insights = await getInsights();
  const now = new Date();

  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/insights`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...insights.map((note) => ({
      url: `${site.url}/insights/${note.slug}`,
      lastModified: new Date(note.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
```

- [ ] **Step 5: Emit the JSON-LD on the home page**

In `app/page.tsx`, add the imports and render the script as the first child of the fragment:

```tsx
import { professionalServiceJsonLd, serializeJsonLd } from "@/lib/structured-data";
```

```tsx
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(professionalServiceJsonLd()) }}
      />
      <SiteHeader />
```

This is the one sanctioned use of `dangerouslySetInnerHTML` in the codebase — React has no other way to write a raw JSON payload into a script tag, and `serializeJsonLd` is what makes it safe. Do not copy the pattern elsewhere.

- [ ] **Step 6: Add the canonical and Twitter card to the root metadata**

In `app/layout.tsx`, inside the `metadata` object, add alongside `openGraph`:

```ts
  alternates: { canonical: "/" },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: "Real estate, partnerships and advisory across the Andes and the Caribbean.",
  },
```

`metadataBase` is already set to `new URL(site.url)`, so the relative canonical resolves correctly and the per-page canonicals added in Tasks 4 and 5 resolve too.

- [ ] **Step 7: Run the tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — `27 passed` (21 after Task 7, plus four structured-data and two sitemap assertions).

- [ ] **Step 8: Verify the routes actually serve**

```bash
npm run build && npm start
```

In another shell:

```bash
curl -s localhost:3000/robots.txt
curl -s localhost:3000/sitemap.xml | head -20
curl -s localhost:3000 | grep -o 'application/ld+json'
```

Expected: robots names the sitemap; the sitemap lists five `<url>` entries; the grep finds one match.

- [ ] **Step 9: Commit**

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:run
git add app/robots.ts app/sitemap.ts app/sitemap.test.ts lib/structured-data.ts lib/structured-data.test.ts app/page.tsx app/layout.tsx
git commit -m "feat: add robots, sitemap and ProfessionalService structured data"
git push
```

---

## Task 9: Favicon and social card

`public/images/logo-primario.png` is **1024×1536 — portrait, 2:3**. A favicon has to be square, so cropping the wordmark to fit would mutilate it. Both images are generated instead, from a "JC" monogram in Newsreader, which keeps them on-brand and means neither is a binary asset anyone has to re-export by hand.

`next/og` renders with satori, which needs real font data — it will not resolve `font-family: serif` from the system. The Newsreader face is committed to the repo rather than pulled from `next/font`'s build cache or fetched at build time, so image generation has no network dependency and no dependency on internals.

**Files:**

- Create: `app/_fonts/newsreader-300.woff` (downloaded)
- Create: `lib/og-font.ts`
- Create: `lib/monogram.tsx`
- Create: `app/icon.tsx`
- Create: `app/apple-icon.tsx`
- Create: `app/opengraph-image.tsx`

**Interfaces:**

- Consumes: `site` from `@/content/site`.
- Produces: `newsreader(): Promise<ArrayBuffer>`, `<Monogram size={n} />`, and the routes `/icon`, `/apple-icon`, `/opengraph-image`.

- [ ] **Step 1: Commit the font**

satori reads TTF, OTF and WOFF — **not WOFF2**. Take the `.woff`. Next does not route directories under `app/` whose name starts with an underscore, so `app/_fonts` is a safe home for a non-route asset that must sit inside the app directory's build trace.

```bash
mkdir -p app/_fonts
curl -sL -o app/_fonts/newsreader-300.woff \
  https://cdn.jsdelivr.net/fontsource/fonts/newsreader@latest/latin-300-normal.woff
ls -l app/_fonts/newsreader-300.woff
```

Expected: a file of roughly 30–60 KB. If it is under 1 KB the CDN returned an error page — open the URL in a browser and check before continuing.

- [ ] **Step 2: Write the font loader**

Create `lib/og-font.ts`:

```ts
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Newsreader 300 for ImageResponse. The slice re-narrows the Buffer's backing
 * store to just this file's bytes — a Node Buffer is a view into a shared pool,
 * so handing satori `file.buffer` directly would hand it the whole pool.
 */
export async function newsreader(): Promise<ArrayBuffer> {
  const file = await readFile(join(process.cwd(), "app/_fonts/newsreader-300.woff"));
  return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
}
```

- [ ] **Step 3: Write the monogram**

satori supports a subset of CSS and requires an explicit `display` on every element. Tailwind classes do not apply here — this tree is rendered by satori, not by the browser — so the colours are the literal token values from `globals.css`.

Create `lib/monogram.tsx`:

```tsx
export function Monogram({ size }: { size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0E0E0E",
        color: "#FFFFFF",
        fontFamily: "Newsreader",
        fontSize: size * 0.4,
        letterSpacing: "-0.03em",
      }}
    >
      JC
    </div>
  );
}
```

- [ ] **Step 4: Write the icon routes**

Create `app/icon.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { Monogram } from "@/lib/monogram";
import { newsreader } from "@/lib/og-font";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(<Monogram size={size.width} />, {
    ...size,
    fonts: [{ name: "Newsreader", data: await newsreader(), weight: 300, style: "normal" }],
  });
}
```

Create `app/apple-icon.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { Monogram } from "@/lib/monogram";
import { newsreader } from "@/lib/og-font";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(<Monogram size={size.width} />, {
    ...size,
    fonts: [{ name: "Newsreader", data: await newsreader(), weight: 300, style: "normal" }],
  });
}
```

- [ ] **Step 5: Write the social card**

Next detects `app/opengraph-image` by file convention and injects the `og:image` tags automatically — no `openGraph.images` entry in `layout.tsx` is needed, and adding one would override this.

Create `app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { newsreader } from "@/lib/og-font";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "J.C. Farias & Co. — Real Estate, Partnerships, Value Creation";

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0E0E0E",
        color: "#FFFFFF",
        padding: 72,
        fontFamily: "Newsreader",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, letterSpacing: "0.16em", opacity: 0.55 }}>
        LIMA · QUITO · SAN JUAN · SANTO DOMINGO
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 86,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
        }}
      >
        <div style={{ display: "flex" }}>Real Estate.</div>
        <div style={{ display: "flex" }}>Partnerships.</div>
        <div style={{ display: "flex" }}>Value Creation.</div>
      </div>
      <div style={{ display: "flex", fontSize: 30, letterSpacing: "0.13em", opacity: 0.55 }}>
        {site.name.toUpperCase()}
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Newsreader", data: await newsreader(), weight: 300, style: "normal" }],
    },
  );
}
```

- [ ] **Step 6: Build and look at the generated images**

These are image routes, not components, so they are verified by looking at the output rather than by assertion. `npm run build` will fail outright if satori cannot parse the tree or the font.

```bash
npm run build && npm start
```

In another shell:

```bash
curl -s -o /tmp/og.png -w "%{http_code} %{content_type} %{size_download}\n" localhost:3000/opengraph-image
curl -s -o /tmp/icon.png -w "%{http_code} %{content_type} %{size_download}\n" localhost:3000/icon
open /tmp/og.png /tmp/icon.png
```

Expected: both `200 image/png` with a non-trivial size. In the images the type must render as Newsreader — if it comes out as a generic sans, the font did not load and the build silently fell back. Check the browser tab on `localhost:3000` shows the monogram.

- [ ] **Step 7: Confirm the tags are emitted**

```bash
curl -s localhost:3000 | grep -oE '<(link rel="icon"|meta property="og:image")[^>]*>'
```

Expected: at least one icon link and one `og:image` meta.

- [ ] **Step 8: Commit**

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:run
git add app/_fonts app/icon.tsx app/apple-icon.tsx app/opengraph-image.tsx lib/og-font.ts lib/monogram.tsx
git commit -m "feat: generate the favicon and social card from a Newsreader monogram"
git push
```

---

## Task 10: The content truth pass

This is the task that decides whether the site can go public. Everything before it is engineering; this is verification. Four things on the page are currently marked `PENDING` in source comments or flagged in the README, and each is a claim the firm would be making in public.

**Status as of 2026-09-03:** D3 (stats) is answered — verified. D1 (domain) is answered — registered at GoDaddy. **D2 (the transaction record) is still open**; the owner says it is coming later.

Do not substitute plausible-sounding figures for missing ones. Step 2 is blocked until D2 lands: leave the six representative rows and their `PENDING` comment intact, and report the task as partially complete. Every other step here can proceed. An honest placeholder in staging is recoverable; a fabricated transaction record in production is not.

**Task 12 must not run to production while Step 2 is outstanding** — the record is the page's central credibility artefact.

**Files:**

- Modify: `content/local.ts:3-14` (the `PENDING` comment and the transaction record)
- Modify: `content/site.ts:38-43` (`stats`)
- Modify: `components/hero-image.tsx`, `components/project-pair.tsx`, `app/page.tsx` (photography)
- Test: `content/local.test.ts` (extend)

**Interfaces:**

- Consumes: the characterization tests from Task 1.
- Produces: no new exports. The guarantee it produces is that every figure on the page is one the firm will stand behind.

- [ ] **Step 1: List what is unverified**

```bash
grep -rn "PENDING" content/ components/ lib/ app/
```

Expected today: `content/local.ts` (transaction record), `components/hero-image.tsx` (Museo Soumaya), `components/project-pair.tsx` (project frames). Each hit must end this task either resolved or consciously kept.

- [ ] **Step 2: Replace the transaction record (D2) — BLOCKED, owner-supplied**

Six rows currently stand in `content/local.ts`. Replace them with the real mandate history, newest first, honouring the editorial rule from `sanity/README.md`: **a row never names a counterparty**, and `asset` is a class ("Mixed-use development"), never a property name. `scale` is free text so it can carry m², keys, units or hectares. `role` should come from the list already enumerated in `sanity/schemas/transaction.ts:33-40` — extend that list rather than inventing a one-off label.

Delete the `PENDING` comment block above the array once the rows are real.

- [ ] **Step 3: Tighten the record's tests**

Add to `content/local.test.ts`, inside the existing `describe`:

```ts
it("keeps the record long enough to be a record", async () => {
  expect((await getTransactions()).length).toBeGreaterThanOrEqual(6);
});

it("describes an asset class, not a named property", async () => {
  for (const row of await getTransactions()) {
    expect(row.asset).not.toMatch(/\b(Hotel|Torre|Plaza|Residences|Tower)\s+[A-Z]/);
  }
});
```

The second test is a tripwire, not a proof — it catches the specific mistake of pasting a property name into the asset column. Read every row yourself as well.

- [ ] **Step 4: Record the stats as verified (D3 — answered)**

`content/site.ts:38-43` claims **18** years in the corridor, **4** markets covered directly, **40+** mandates advised, **USD 1.2B** aggregate transaction value. **The owner confirmed all four as verified on 2026-09-03.** No value changes — leave the array exactly as it stands. This step is a recorded confirmation, not an edit.

Note the coupling: "4 markets covered directly" must equal `offices.length`. If offices change, the stat changes.

The same README item flags the contact numbers. `content/site.ts:45-50` currently publishes only dialling codes and the words "by appointment" (`"+51 · by appointment"`), and `site.email` is `mandates@jcfarias.com`. Confirm that mailbox exists and is monitored before launch — the footer's `mailto:` is the site's only intake path, so a bounced address is a silent loss of every inbound mandate. Decide deliberately whether the dialling-code-only treatment stays; publishing full numbers is a reachability decision, not a dev one.

- [ ] **Step 5: Resolve the hero photography (D4)**

The current plate is Museo Soumaya, Mexico City — visually right, geographically wrong for a firm that does not operate in Mexico.

_If owned project photography exists:_ drop it in `public/images/`, update `src` and `alt` in `components/hero-image.tsx:17-18`, and delete the credit block at `components/hero-image.tsx:25-42` along with the `PENDING` comment.

_If it does not (the default):_ move the image to the project frames as an explicit architectural reference, which is what the README proposes. The CC BY-SA credit must stay visible wherever the image lives.

In `app/page.tsx`, remove the `HeroImage` import and its `<HeroImage />` element.

In `components/project-pair.tsx`, give the first frame the image and add the credit beneath the pair:

```tsx
const frames: Frame[] = [
  {
    id: "project-a",
    src: "/images/soumaya-hero.jpg",
    alt: "Museo Soumaya, Mexico City, designed by Fernando Romero",
    placeholder: "Project — vertical or square",
  },
  { id: "project-b", placeholder: "Architectural detail — facade, structure, materiality" },
];
```

and, inside `<Shell>` directly after the closing `</div>` of the grid:

```tsx
<p className="m-0 pt-4 text-[10.5px] tracking-[0.08em] text-faint/80 uppercase">
  Reference · Museo Soumaya, Fernando Romero. Photo{" "}
  <a
    href="https://commons.wikimedia.org/wiki/File:Museo_Soumaya,_Ciudad_de_M%C3%A9xico,_M%C3%A9xico,_2015-07-18,_DD_13.JPG"
    className="underline decoration-rule underline-offset-2 hover:text-ink"
    rel="noopener noreferrer"
    target="_blank"
  >
    Diego Delso / Wikimedia Commons
  </a>{" "}
  · CC BY-SA 4.0
</p>
```

Then delete `components/hero-image.tsx`.

- [ ] **Step 6: Resolve the second project frame**

If owned photography exists for it, set `src` and `alt`. If not, keep the stone plate — it is honest and it disappears the moment an asset lands. Leave the `PENDING` comment in place in that case and note it as a known-open item.

- [ ] **Step 7: Run the tests and read the page**

```bash
npm run test:run
```

Expected: PASS, with the two new assertions included.

```bash
npm run dev
```

Read the whole home page out loud at 1440px and at 375px. Every number on it should be one you can source.

- [ ] **Step 8: Commit**

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:run
git add content/ components/ app/page.tsx
git commit -m "content: verified transaction record, stats and photography"
git push
```

---

## Task 11: Accessibility pass

Two concrete gaps, both introduced or exposed by the multi-page structure. Neither is exotic; both are the kind of thing that is trivial now and awkward after launch.

**Files:**

- Modify: `app/layout.tsx` (skip link)
- Modify: `app/page.tsx`, `app/insights/page.tsx`, `app/insights/[slug]/page.tsx`, `app/not-found.tsx` (`id="main"`)
- Modify: `components/site-header.tsx:53-65` and `:70-76` (`aria-controls`)
- Test: `components/site-header.test.tsx`

**Interfaces:**

- Consumes: nothing new.
- Produces: a `#main` skip target on every route; `aria-controls="mobile-menu"` binding the burger to the panel it opens.

- [ ] **Step 1: Write the failing test**

Create `components/site-header.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/site-header";

describe("SiteHeader", () => {
  it("binds the burger to the panel it controls", () => {
    render(<SiteHeader />);
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button).toHaveAttribute("aria-controls", "mobile-menu");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm run test:run -- components/site-header.test.tsx
```

Expected: FAIL — `expected null to have attribute "aria-controls"`, because the attribute is absent.

- [ ] **Step 3: Bind the burger to the menu**

In `components/site-header.tsx`, add `aria-controls="mobile-menu"` to the open button (line 53–59, beside the existing `aria-expanded`), and add `id="mobile-menu"` to the full-screen menu `<div>` (line 70).

- [ ] **Step 4: Run it to verify it passes**

```bash
npm run test:run -- components/site-header.test.tsx
```

Expected: PASS — `1 passed`.

- [ ] **Step 5: Add the skip link**

A sticky header means a keyboard user tabs through the whole nav on every page before reaching content. The link is invisible until focused.

In `app/layout.tsx`, as the first child of `<body>`:

```tsx
<body>
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:flex focus:min-h-11 focus:items-center focus:bg-ink focus:px-5 focus:text-[11.5px] focus:font-medium focus:tracking-[0.16em] focus:text-paper focus:uppercase"
  >
    Skip to content
  </a>
  {children}
</body>
```

- [ ] **Step 6: Give every route the skip target**

Add `id="main"` to the `<main>` element in `app/page.tsx`, `app/insights/page.tsx` and `app/insights/[slug]/page.tsx`. `app/not-found.tsx` already has it from Task 7.

```bash
grep -rn "<main" app/
```

Expected: four hits, all carrying `id="main"`.

- [ ] **Step 7: Verify by keyboard**

```bash
npm run dev
```

On `http://localhost:3000`, press Tab once from a fresh page load. "Skip to content" should appear top-left on an ink ground; Enter should jump focus past the header. Then at 375px: Tab to the burger, Enter to open, Escape to close, and confirm focus is not trapped inside the closed panel (the `invisible` class removes it from the tab order).

- [ ] **Step 8: Run Lighthouse on the production build**

```bash
npm run build && npm start
```

In Chrome DevTools → Lighthouse, run Performance + Accessibility + SEO against `http://localhost:3000` and `http://localhost:3000/insights`. Record the scores. Accessibility and SEO should be 100; investigate anything below 95 on Performance — the likely culprit is `soumaya-hero.jpg` at 3840×2562 and 2 MB, in which case set explicit `sizes` and let `next/image` serve a narrower variant.

- [ ] **Step 9: Commit**

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:run
git add app/ components/site-header.tsx components/site-header.test.tsx
git commit -m "fix: add a skip link and bind the burger to the mobile menu"
git push
```

---

## Task 12: Publish

**Requires decision D1.** Everything else is done; this makes it public.

**Files:**

- Modify: `content/site.ts:3-8` (`site.url`, if the domain differs)
- Modify: `README.md` (open items, test and deploy sections)

**Interfaces:**

- Consumes: a green CI run on `main`.
- Produces: a live site and a `main` branch that auto-deploys.

- [ ] **Step 1: Confirm CI is green on the tip of main**

```bash
git push && gh run watch
```

Expected: `success`. Do not deploy off a red build.

- [ ] **Step 2: Confirm the production URL (D1 — answered: registered at GoDaddy)**

`content/site.ts:3-8` sets `url: "https://jcfarias.com"`, and `metadataBase`, every canonical, the sitemap and the JSON-LD all derive from that one string. The domain is registered at GoDaddy.

**Confirm the registered domain is character-for-character `jcfarias.com`** before anything else — a `.com` instead of a `.co`, or a hyphenated variant, silently poisons every canonical and the whole sitemap.

```bash
grep -n 'url:' content/site.ts
dig +short jcfarias.com
dig +short www.jcfarias.com
```

If the registered domain differs, change `site.url` — that one line is the only place it appears. If `dig` returns GoDaddy parking IPs at this point, that is expected; Step 8 replaces them.

- [ ] **Step 3: Link the project to Vercel**

The Vercel CLI is already installed at `/usr/local/bin/vercel`.

```bash
vercel login
vercel link
```

Accept the detected Next.js framework preset. No build configuration is needed.

- [ ] **Step 4: Set the production environment variable**

`lib/content.ts` defaults to `"local"` when `CONTENT_SOURCE` is unset, so this is belt-and-braces — but setting it explicitly means the day someone flips it to `sanity` without wiring the branches, the failure is the loud `throw` in `lib/content.ts:29` and `:36` rather than a silent fallback.

```bash
vercel env add CONTENT_SOURCE production
# value: local
```

- [ ] **Step 5: Connect the Git integration**

In the Vercel dashboard, link the project to `rfarias23/jcfarias-co` and set the production branch to `main`. This is preferable to deploying from the CLI: every push then produces a preview deploy, and `main` produces production, so the deployed artefact always corresponds to a commit.

- [ ] **Step 6: Deploy and verify**

```bash
vercel --prod
```

Then against the returned URL:

```bash
DEPLOY_URL=https://<the-deployment-url>
curl -s -o /dev/null -w "%{http_code}\n" $DEPLOY_URL
curl -s -o /dev/null -w "%{http_code}\n" $DEPLOY_URL/insights
curl -s -o /dev/null -w "%{http_code}\n" $DEPLOY_URL/insights/pricing-land-dollarized-economy
curl -s -o /dev/null -w "%{http_code}\n" $DEPLOY_URL/no-such-page
curl -s $DEPLOY_URL/robots.txt
curl -s $DEPLOY_URL/sitemap.xml | head -20
```

Expected: `200`, `200`, `200`, `404`, then a robots body naming the sitemap and a sitemap listing five URLs at the production origin.

- [ ] **Step 7: Check the social card renders where it will be seen**

Paste the production URL into a LinkedIn post composer (do not post) and into a WhatsApp draft. The card should show the ink-ground Newsreader treatment from Task 9. If it shows nothing, `metadataBase` does not match the deployed origin — that is D1 unresolved, not a bug in the image route.

- [ ] **Step 8: Attach the domain at GoDaddy (D1 — answered)**

In the Vercel dashboard → Project → Settings → Domains, add `jcfarias.com` and `www.jcfarias.com`, and set `www` to redirect to the apex. Vercel then prints the exact records to create. **Vercel's printed values are authoritative — if they differ from anything below, follow Vercel.**

Then, in GoDaddy → My Products → the domain → DNS → Manage Zones. Two GoDaddy-specific traps make this different from most registrars:

1. **GoDaddy does not support CNAME/ALIAS/ANAME at the apex.** The naked domain must be an **A record**, not a CNAME. Vercel's apex A record is `76.76.21.21`.
2. **A newly-registered GoDaddy domain ships with parking records that conflict.** There is already an `A` record on `@` pointing at a GoDaddy parking IP, and often a `CNAME` on `www` pointing to `@`, plus a "Forwarding" rule. **Edit the existing `@` A record rather than adding a second one** — two A records on `@` will round-robin between Vercel and the parking page, which presents as a site that works only half the time. Delete any Domain Forwarding rule in the Forwarding section; it overrides DNS entirely.

The end state in GoDaddy's zone:

| Type  | Name  | Value                  | TTL                     |
| ----- | ----- | ---------------------- | ----------------------- |
| A     | `@`   | `76.76.21.21`          | 600 (GoDaddy's minimum) |
| CNAME | `www` | `cname.vercel-dns.com` | 600                     |

Leave GoDaddy's `NS` and `SOA` records alone, and leave any `MX` records alone — removing those kills email on the domain.

_Alternative, if you would rather Vercel own DNS entirely:_ change the nameservers at GoDaddy to `ns1.vercel-dns.com` / `ns2.vercel-dns.com`. This is cleaner long-term but takes any existing MX/TXT records with it, so only do it if nothing else uses this domain yet.

- [ ] **Step 8b: Wait for propagation and verify**

GoDaddy's minimum TTL is 600s, but a fresh delegation can take longer to settle.

```bash
dig +short jcfarias.com          # expect 76.76.21.21
dig +short www.jcfarias.com      # expect a cname.vercel-dns.com chain
curl -sI https://jcfarias.com | head -3
curl -sI https://www.jcfarias.com | head -5   # expect a 30x redirect to the apex
```

Vercel's Domains panel should show both domains as **Valid Configuration** and issue the TLS certificate automatically. A certificate that stays pending for more than ~15 minutes almost always means a leftover second `A` record on `@`, or a `CAA` record that does not permit Let's Encrypt — check both before retrying.

Then confirm `content/site.ts` matches the live apex and redeploy if it changed.

- [ ] **Step 9: Update the README**

`README.md` § "Open items before launch" is the spec this plan implements; close it out. Replace that section with a "Known open items" list containing only what is genuinely still open — most likely the second project frame, and Sanity. Then:

- Add `npx vitest run` / `npm test` to the Commands block.
- Add `/insights` and `/insights/[slug]` to the Structure tree, plus `insight-body.tsx`, `lib/structured-data.ts`, `lib/og-font.ts`, `lib/monogram.tsx` and `app/_fonts/`.
- Replace the "First push" section — the repo exists now — with the deploy URL and the note that `main` auto-deploys.
- Record in "Content and CMS" that `getInsight(slug)` is the third seam function and that the GROQ contract in `sanity/README.md` matches the extended `Insight` type.

- [ ] **Step 10: Commit**

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:run
git add README.md content/site.ts
git commit -m "docs: close the launch open items and record the deploy"
git push
```

- [ ] **Step 11: Confirm the auto-deploy fired**

```bash
gh run watch
vercel ls
```

Expected: CI green, and a new production deployment matching the commit just pushed.

---

## What this plan deliberately does not do

- **Sanity.** The seam is preserved and the GROQ contract stays in sync with the types, but wiring a CMS runtime for three notes before the site is live inverts the risk. Do it when a second author exists.
- **An accent colour.** `README.md` is explicit that adding one is a brand decision, not a dev one.
- **Analytics.** Nothing in the spec asks for it, and it carries a consent obligation in the EU that nobody has scoped. Vercel Analytics is a one-line addition afterwards if wanted.
- **A contact form.** The footer's `mailto:` is deliberate for a firm whose intake is relationship-led; a form implies a queue somebody has to staff.
- **Restructuring the transactions table.** `README.md` is emphatic: all five columns survive at every width, the row is the credibility artefact, and cards dilute it.
