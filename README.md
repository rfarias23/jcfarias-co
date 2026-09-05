# J.C. Farias & Co. — website

Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript. Static-first: every
section is a server component, no client JS except the mobile menu.

    npm install
    npm run dev        # http://localhost:3000

Node 20+.

## Structure

    app/
      layout.tsx          fonts, metadata, html shell
      page.tsx            composes the sections, awaits content
      globals.css         @theme tokens + shell/eyebrow/meta utilities
    components/
      primitives.tsx      Shell, Eyebrow, SectionHead, sectionPad
      site-header.tsx     ONLY client component — sticky bar + mobile menu
      hero.tsx            two approved treatments ("editorial" is default)
      hero-image.tsx      full-bleed plate + required photo credit
      position.tsx  practice.tsx  stats.tsx
      transactions.tsx    5-column record, scrolls horizontally under lg
      project-pair.tsx  insights.tsx  about.tsx  contact-footer.tsx
    content/
      site.ts             nav, practice areas, stats, offices
      local.ts            transactions + insights (CMS stand-in)
      local.test.ts       characterisation tests on the record
    lib/
      content.ts          the one seam to the CMS
      types.ts  cn.ts
    sanity/               schemas; GROQ queries documented in sanity/README.md
    scripts/
      responsive-audit.mjs  27-cell check of the table below (npm run audit:responsive)
    public/images/        hero plate, portrait, logo
    docs/
      STATUS.md           audit of the real state of the project
      PLAN.md             execution order of the specs, grouped in sessions
      specs/              one spec per unit of work; nothing ships without one
    eslint.config.mjs  .prettierrc  vitest.config.mts  vitest.setup.ts

## Design tokens

Declared once in `app/globals.css` under `@theme`, so they are available as
Tailwind utilities (`text-faint`, `bg-stone`, `font-serif`).

| Token           | Value     | Use                        |
| --------------- | --------- | -------------------------- |
| `--color-ink`   | `#0E0E0E` | text, rules, dark sections |
| `--color-paper` | `#FFFFFF` | page                       |
| `--color-body`  | `#3A3A3A` | body copy                  |
| `--color-mute`  | `#6B6B6B` | secondary copy             |
| `--color-faint` | `#8A8A8A` | labels, captions           |
| `--color-rule`  | `#E4E4E4` | hairlines                  |
| `--color-stone` | `#F2F1EF` | image wells                |
| `--color-wash`  | `#FAFAF9` | table row hover            |

Type: **Newsreader** (300, display) and **Instrument Sans** (400/500, UI and
body), both via `next/font/google` — self-hosted at build, no layout shift.
No other family, no other weight. Colour is black, white and four greys; there
is no accent colour and adding one is a brand decision, not a dev one.

Three repeated utilities carry the system:

- `.shell` — `max-width:1560px`, gutter `clamp(20px,4vw,56px)`
- `.eyebrow` — 11.5px / 500 / 0.16em / uppercase
- `.meta` — 11.5px / 0.13em / uppercase

Section rhythm is `sectionPad` = `pt-[clamp(72px,9vw,120px)]`.

## Responsive behaviour

Breakpoints are Tailwind defaults — `sm` 640, `md` 768, `lg` 1024. Between them
type and spacing are fluid `clamp()`, so there is no width where the page looks
untuned.

|                     | Mobile (<768)                 | Tablet (768–1023) | Desktop (1024+)             |
| ------------------- | ----------------------------- | ----------------- | --------------------------- |
| Nav                 | burger → full-screen ink menu | burger            | horizontal + Contact button |
| Hero                | one column                    | one column        | 1.35fr / 0.65fr split       |
| Hero plate          | 54vh, min 340                 | 66vh, min 460     | 74vh, min 520               |
| Practice / Insights | stacked                       | 3 columns         | 3 columns                   |
| Stats               | 2 × 2                         | 4 across          | 4 across                    |
| Transactions        | horizontal scroll             | horizontal scroll | full width, no scroll       |
| Project frames      | stacked, 46vh                 | 2 across, 60vh    | 2 across, 60vh              |
| About               | stacked, portrait capped 420  | stacked           | 2 columns                   |
| Footer              | stacked, offices 2-up         | stacked           | 2 columns                   |

Two implementation notes worth keeping:

1. **Hairline grids.** Practice, Insights and Stats draw their dividers with
   `gap-px` over a `bg-rule` container rather than per-cell borders. The rules
   land correctly in both axes at every breakpoint with no index arithmetic;
   only the flush-left/right padding is index-aware.
2. **The transactions table never restructures.** All five columns survive at
   every width — the row is the credibility artefact, and cards dilute it. Under
   `lg` the track (`min-w-[860px]`) scrolls horizontally inside a negative-margin
   bleed so the scroll reaches the screen edge, with a "Scroll for the full
   record →" hint below.

Touch targets are 44px minimum (burger, close, menu links, mail button).
`prefers-reduced-motion` kills the smooth scroll and all transitions.

## Content and CMS

`lib/content.ts` is the only place the site talks to a content source. It reads
`content/local.ts` today and switches on `CONTENT_SOURCE`. Every consumer is a
server component that awaits `getTransactions()` / `getInsights()`, so moving to
Sanity is: install `next-sanity`, fill `.env.local`, implement the two
`source === "sanity"` branches. No component changes. Schemas are already
written in `sanity/schemas/`; the GROQ queries are documented in
`sanity/README.md`.

Prose that is design (hero, position statement, About) lives in the components
on purpose — it is not editorial content and should not be CMS-editable.

## Open items before launch

1. **Transaction record.** The six rows in `content/local.ts` are
   representative, not verified. Replace with the real mandate history.
2. **Hero photography.** The current plate is Museo Soumaya in Mexico City —
   visually right, geographically wrong for a firm that does not operate in
   Mexico. Either swap for owned project photography or move it to the project
   frames as an explicit architectural reference. The CC BY-SA credit must stay
   visible while the image is in use.
3. **Project frames.** Both awaiting owned photography; they render as stone
   plates with their brief until a `src` is set in `components/project-pair.tsx`.
4. **Insight detail pages.** The model has slugs and body blocks; `/insights` and
   `/insights/[slug]` are not designed yet, so "All notes" is still an anchor.
5. **Verify** the stats (18 · 4 · 40+ · USD 1.2B) and the contact numbers before
   they go public.

## Deploy

[![ci](https://github.com/rfarias23/jcfarias-co/actions/workflows/ci.yml/badge.svg)](https://github.com/rfarias23/jcfarias-co/actions/workflows/ci.yml)

Every push to `main` and every pull request runs `.github/workflows/ci.yml`:
typecheck, lint, format check, tests and build on a clean Ubuntu checkout.

Vercel, framework preset Next.js, no build config needed. Add
`CONTENT_SOURCE=local` as an env var until the CMS is live.

## Repository and workflow

The repository lives at `https://github.com/rfarias23/jcfarias-co` (remote
`origin`, HTTPS, branch `main`). Work is spec-driven: every change belongs to
a spec in `docs/specs/`, one commit per spec (`spec-NNN: <title>`), never a
force push. See `docs/PLAN.md` for the order of execution and
`docs/STATUS.md` for the current state.

    npm run typecheck && npm run lint && npm run format:check && npm run test:run && npm run build
    npm run start & npm run audit:responsive   # 27/27 cells must pass
