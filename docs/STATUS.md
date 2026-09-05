# STATUS — radiografía del proyecto

Fecha: 2026-09-05
Fase: 1 (solo lectura). Ningún archivo del proyecto fue modificado salvo este documento.
Commit base: `fda04d2 chore: initial commit — J.C. Farias & Co. landing page` (main, ya en origin/main).

---

## 0. Procedencia de la evidencia — leer primero

La toolchain **no corre en el directorio del proyecto**. `~/Desktop/JCFarias` está bajo
iCloud Desktop sync y `node_modules` está evacuado a la nube como archivos _dataless_
(`find node_modules -flags +dataless` devuelve más de 2 000 archivos; `brctl status`
muestra un descargador activo sobre `node_modules/typescript/lib`). Disco: 11 GiB libres.

| Comando en sitio   | Resultado                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `npx tsc --noEmit` | 6 min 31 s de reloj, 1.75 s de CPU, sin salida. Proceso en estado `S` al 0 % CPU (bloqueado en I/O). Matado. |

También están _dataless_ `public/images/*` (las tres imágenes) y los briefs de `.superpowers/`.
Los archivos fuente `.ts/.tsx/.css/.md` no lo están.

Para obtener evidencia real sin tocar el proyecto se hizo un **espejo** del código fuente
(rsync excluyendo `node_modules`, `.next`, `.git`) en `/private/tmp/…/scratchpad/mirror`,
`npm ci` con caché npm aislada (la caché `~/.npm` tiene archivos root-owned → `EACCES`),
y ahí se corrió toda la toolchain y el servidor de desarrollo. Mismo código, mismo lockfile.

**Consecuencia para Fase 3:** ninguna spec puede verificarse en sitio hasta que el proyecto
salga del árbol sincronizado (`mv ~/Desktop/JCFarias ~/dev/JCFarias && rm -rf node_modules && npm ci`)
o se desactive iCloud Desktop sync. Es decisión del dueño. Ver §7.

---

## 1. Inventario de archivos

Estados: COMPLETO / PARCIAL / STUB / AUSENTE. "Git" indica tracked (T), modificado sin commit (M), untracked (U).

### Aplicación

| Archivo                             | Git | Estado   | Nota                                                                                                                  |
| ----------------------------------- | --- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                    | T   | COMPLETO | Fuentes vía `next/font/google`, metadata, `metadataBase`. Sin `weight` explícito (ver §4-D3).                         |
| `app/page.tsx`                      | T   | COMPLETO | Compone 10 secciones, `await Promise.all([getTransactions(), getInsights()])`.                                        |
| `app/globals.css`                   | T   | COMPLETO | 8 tokens de color, 2 familias, utilidades `shell/eyebrow/meta/tnum`, reduced-motion. Token `--breakpoint-xs` sin uso. |
| `app/sitemap.ts`                    | —   | AUSENTE  |                                                                                                                       |
| `app/robots.ts`                     | —   | AUSENTE  |                                                                                                                       |
| `app/opengraph-image.tsx`           | —   | AUSENTE  |                                                                                                                       |
| `app/not-found.tsx`                 | —   | AUSENTE  | Build genera `/_not-found` por defecto de Next.                                                                       |
| `app/icon.*` / `public/favicon.ico` | —   | AUSENTE  |                                                                                                                       |
| `app/insights/page.tsx`             | —   | AUSENTE  |                                                                                                                       |
| `app/insights/[slug]/page.tsx`      | —   | AUSENTE  |                                                                                                                       |
| `components/primitives.tsx`         | T   | COMPLETO | `Shell`, `Eyebrow`, `SectionHead`, `sectionPad`.                                                                      |
| `components/site-header.tsx`        | T   | COMPLETO | Único `"use client"` (verificado con grep). Menú móvil, Escape, bloqueo de scroll.                                    |
| `components/hero.tsx`               | T   | COMPLETO | Dos modos; "editorial" por defecto; `lg:grid-cols-[1.35fr_0.65fr]`.                                                   |
| `components/hero-image.tsx`         | T   | PARCIAL  | Funciona; foto es placeholder CC BY-SA (Museo Soumaya). Crédito visible.                                              |
| `components/position.tsx`           | T   | COMPLETO |                                                                                                                       |
| `components/practice.tsx`           | T   | COMPLETO | `gap-px bg-rule md:grid-cols-3`.                                                                                      |
| `components/stats.tsx`              | T   | COMPLETO | `grid-cols-2 gap-px bg-rule md:grid-cols-4`.                                                                          |
| `components/transactions.tsx`       | T   | COMPLETO | 5 columnas, `min-w-[860px] lg:min-w-0`, bleed negativo, hint `lg:hidden`.                                             |
| `components/project-pair.tsx`       | T   | PARCIAL  | Sin `src`; renderiza placas stone con brief.                                                                          |
| `components/insights.tsx`           | T   | PARCIAL  | Tarjetas y "All notes" enlazan a `#insights` (sin rutas).                                                             |
| `components/about.tsx`              | T   | COMPLETO | Retrato `max-w-[420px] lg:max-w-none`, `lg:grid-cols-2`.                                                              |
| `components/contact-footer.tsx`     | T   | COMPLETO | `lg:grid-cols-2`, oficinas `grid-cols-2`, mail `min-h-11`.                                                            |
| `content/site.ts`                   | M   | COMPLETO | Diff sin commit: `.co` → `.com` en `email` y `url` (dato del dueño, 2026-09-03).                                      |
| `content/local.ts`                  | T   | PARCIAL  | 6 transacciones marcadas `PENDING` (representativas). 3 insights con slug.                                            |
| `content/local.test.ts`             | U   | COMPLETO | 2 tests de caracterización; pasan.                                                                                    |
| `lib/content.ts`                    | T   | PARCIAL  | Ramas `source === "sanity"` lanzan `throw new Error(...)`.                                                            |
| `lib/types.ts`                      | T   | COMPLETO | `Insight` sin `body`/`publishedAt`/`dek`.                                                                             |
| `lib/cn.ts`                         | T   | COMPLETO |                                                                                                                       |
| `sanity/README.md`                  | T   | COMPLETO | Contrato + queries GROQ como texto.                                                                                   |
| `sanity/schemas/transaction.ts`     | T   | COMPLETO | Contrato de esquema, no importado.                                                                                    |
| `sanity/schemas/insight.ts`         | T   | COMPLETO | Ídem.                                                                                                                 |
| `sanity/schemas/types.ts`           | T   | STUB     | Declarado como stand-in a borrar cuando exista `next-sanity`.                                                         |
| `sanity/queries.ts` (o similar)     | —   | AUSENTE  | Las GROQ solo existen en el README de sanity.                                                                         |
| `public/images/soumaya-hero.jpg`    | T   | PARCIAL  | 2.0 MB, placeholder CC BY-SA.                                                                                         |
| `public/images/perfil-jcf.png`      | T   | COMPLETO | 27 KB.                                                                                                                |
| `public/images/logo-primario.png`   | T   | —        | 1.5 MB, **no referenciado por ningún archivo** (grep sin resultados).                                                 |

### Tooling y configuración

| Archivo                           | Git | Estado   | Nota                                                                                    |
| --------------------------------- | --- | -------- | --------------------------------------------------------------------------------------- |
| `package.json`                    | M   | COMPLETO | Diff: scripts `test`/`test:run` + 6 devDeps de Vitest/Testing Library.                  |
| `package-lock.json`               | M   | COMPLETO | Lockfile de lo anterior.                                                                |
| `tsconfig.json`                   | M   | COMPLETO | Diff: `types: ["node","vitest/globals"]`, `**/*.mts` en include.                        |
| `next.config.ts`                  | T   | COMPLETO | `remotePatterns` para `cdn.sanity.io`.                                                  |
| `postcss.config.mjs`              | T   | COMPLETO |                                                                                         |
| `eslint.config.mjs`               | T   | COMPLETO | Flat config: `next/core-web-vitals`, `next/typescript`, `prettier`.                     |
| `.prettierrc` / `.prettierignore` | T   | COMPLETO |                                                                                         |
| `vitest.config.mts`               | U   | COMPLETO | jsdom, globals, tsconfigPaths, react.                                                   |
| `vitest.setup.ts`                 | U   | COMPLETO | jest-dom + mocks de `next/link`/`next/image`. **Falla `prettier --check`** (una línea). |
| `.env.example`                    | T   | COMPLETO |                                                                                         |
| `.gitignore`                      | T   | COMPLETO | Cubre `.next`, `.env*`, `next-env.d.ts`, `tsconfig.tsbuildinfo`, `.vercel`.             |
| `.github/workflows/*`             | —   | AUSENTE  | No hay CI.                                                                              |
| `tsconfig.tsbuildinfo`            | ign | —        | Presente en disco, ignorado.                                                            |

### Documentación

| Archivo                                                | Git | Estado      | Nota                                                                                                          |
| ------------------------------------------------------ | --- | ----------- | ------------------------------------------------------------------------------------------------------------- |
| `README.md`                                            | T   | COMPLETO    | Fuente de las afirmaciones verificadas en §4. Sección "First push" obsoleta.                                  |
| `PROMPT-CLAUDE-CODE.md`                                | —   | **AUSENTE** | El spec de auditoría lo cita como fuente de la constitución (Fase 2). No existe en ninguna ruta del proyecto. |
| `PROMPT-AUDIT-SPEC.md`                                 | U   | COMPLETO    | Instrucciones de esta auditoría.                                                                              |
| `docs/HANDOVER-2026-09-03.md`                          | U   | COMPLETO    | Handover de la sesión anterior (bloqueo iCloud).                                                              |
| `docs/superpowers/plans/2026-09-03-jcfarias-launch.md` | M   | COMPLETO    | Plan de 12 tareas; diff refleja D1/D3 y DNS GoDaddy.                                                          |
| `.superpowers/sdd/…`                                   | ign | —           | Ledger y briefs de la sesión anterior; ignorados por su propio `.gitignore`.                                  |

---

## 2. Salidas literales de la toolchain

### En sitio (`~/Desktop/JCFarias`)

```
$ ls -la                     → ver §1 (28 entradas; node_modules 371 entradas)
$ git status                 → main, up to date with origin/main
                               M content/site.ts, docs/superpowers/plans/…, package-lock.json, package.json, tsconfig.json
                               ?? PROMPT-AUDIT-SPEC.md, content/local.test.ts, docs/HANDOVER-2026-09-03.md, vitest.config.mts, vitest.setup.ts
$ git log --oneline -5       → fda04d2 chore: initial commit — J.C. Farias & Co. landing page
$ git remote -v              → origin https://github.com/rfarias23/jcfarias-co.git (fetch/push)
$ git ls-remote origin       → fda04d23… HEAD / refs/heads/main   (el commit inicial SÍ está empujado)
$ gh auth status             → Logged in as rfarias23, protocol https, scopes gist/read:org/repo/workflow
$ node -v; npm -v            → v22.14.0 / 10.9.2
$ test -d node_modules       → node_modules: sí (pero dataless, ver §0)
$ ls public/images           → logo-primario.png 1529561 · perfil-jcf.png 26869 · soumaya-hero.jpg 2028108
$ npx tsc --noEmit           → sin salida en 6:31 (bloqueado en I/O); matado
```

`package.json`, `tsconfig.json`, `next.config.ts` y `.gitignore` se reproducen íntegros en §1 (estado) y en el diff de `git diff` registrado durante la sesión; no hay diferencia con el espejo.

### En el espejo (`/private/tmp/…/mirror`, `npm ci` limpio, 470 paquetes en 1 min)

```
$ npx tsc --noEmit
(sin salida)                                  exit=0   5.0 s

$ npm run lint            # script "lint": "eslint" (bare)
> jcfarias-co@0.1.0 lint
> eslint
(sin salida)                                  exit=0   2.3 s

$ npx eslint . --max-warnings=0
(sin salida)                                  exit=0

$ npx eslint --debug 2>&1 | grep -c "Linting code for"      → 28
$ npx eslint . --debug 2>&1 | grep -c "Linting code for"    → 28
```

**Pregunta abierta del handover resuelta:** el `eslint` bare lintea los mismos 28 archivos que
`eslint .`. El script no está roto; el cuelgue de 56 min fue solo iCloud.

```
$ npm run build
   ▲ Next.js 15.5.2
   Creating an optimized production build ...
 ✓ Compiled successfully in 3.6s
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (4/4)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ○ /                                     6.8 kB         109 kB
└ ○ /_not-found                            990 B         103 kB
+ First Load JS shared by all             102 kB
  ├ chunks/255-e3bf15caf1f1e0f9.js       45.7 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
  └ other shared chunks (total)           1.9 kB

○  (Static)  prerendered as static content
                                              exit=0   12.1 s   (0 warnings)

$ npm run format:check
Checking formatting...
[warn] .superpowers/sdd/2026-09-03-jcfarias-launch/progress.md
[warn] docs/HANDOVER-2026-09-03.md
[warn] vitest.setup.ts
[warn] Code style issues found in 3 files. Run Prettier with --write to fix.
                                              exit=1

$ npx vitest run
 ✓ content/local.test.ts (2 tests) 2ms
 Test Files  1 passed (1)
      Tests  2 passed (2)                     exit=0   661 ms

$ npm ci  (advertencia registrada)
npm warn deprecated next@15.5.2: This version has a security vulnerability.
  Please upgrade to a patched version. See https://nextjs.org/blog/CVE-2025-66478
npm warn deprecated eslint@9.39.5: This version is no longer supported.

$ npm run dev -p 3111
 ✓ Ready in 1231ms · GET / 200 in 2024ms · sin warnings en consola del servidor
```

---

## 3. Verificación responsiva (celda por celda)

Método: Chrome headless (playwright-core instalado en el scratchpad, no en el proyecto) contra
el dev server del espejo. Viewports 390×844, 834×1112, 1440×900. Cada celda reporta el valor
computado (`getComputedStyle`) y la clase que lo produce. Capturas en el scratchpad
(`shots/390-full.png`, `834-full.png`, `1440-full.png`, `390-menu.png`, `834-menu.png`).
`document.documentElement.scrollWidth` == ancho de viewport en los tres casos (sin scroll horizontal de página).

| Fila README             | 390 (Mobile)                                                                                                                                                                                                             | 834 (Tablet)                                                                                | 1440 (Desktop)                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Nav**                 | **CUMPLE.** Nav desktop `display:none`, burger visible 44×44. Al abrir: overlay `fixed inset-0`, bg `rgb(14,14,14)` = ink, 390×844, `body.style.overflow=hidden`, Escape cierra. Clases: `hidden lg:flex` / `lg:hidden`. | **CUMPLE.** Burger visible 44×44, nav desktop oculta. Overlay 834×1112 ink.                 | **CUMPLE.** Nav horizontal visible, burger `display:none`, botón Contact presente (`border border-ink`).                          |
| **Hero**                | **CUMPLE.** `grid-template-columns: 350px` (1 col).                                                                                                                                                                      | **CUMPLE.** `767.28px` (1 col).                                                             | **CUMPLE.** `847.80px 408.19px` = ratio 2.077 = 1.35/0.65. Clase `lg:grid-cols-[1.35fr_0.65fr]`.                                  |
| **Hero plate**          | **CUMPLE.** 456 px = 54 vh de 844; ≥ 340. `h-[54vh] min-h-[340px]`.                                                                                                                                                      | **CUMPLE.** 734 px = 66 vh de 1112; ≥ 460. `md:h-[66vh] md:min-h-[460px]`.                  | **CUMPLE.** 666 px = 74 vh de 900; ≥ 520. `lg:h-[74vh] lg:min-h-[520px]`.                                                         |
| **Practice / Insights** | **CUMPLE.** Ambos `350px` (1 col). `gap:1px`, bg `rgb(228,228,228)` = rule.                                                                                                                                              | **CUMPLE.** Ambos `255.09px ×3`. `md:grid-cols-3`.                                          | **CUMPLE.** Ambos `442px ×3`.                                                                                                     |
| **Stats**               | **CUMPLE.** `174.5px 174.5px` (2×2). `grid-cols-2`.                                                                                                                                                                      | **CUMPLE.** 4 columnas de 191 px. `md:grid-cols-4`.                                         | **CUMPLE.** 4 × 331.25 px.                                                                                                        |
| **Transactions**        | **CUMPLE.** `overflow-x:auto`, clientWidth 390, scrollWidth 900, track `min-width:860px`, 5 columnas por fila, hint "Scroll for the full record →" visible.                                                              | **CUMPLE.** `overflow-x:auto`, 834 vs scrollWidth 927, track 860, 5 columnas, hint visible. | **CUMPLE.** `overflow-x:visible`, clientWidth = scrollWidth = 1328, `min-width:0`, 5 columnas, hint `display:none` (`lg:hidden`). |
| **Project frames**      | **CUMPLE.** 1 col; frame 350×388 = 46 vh; ≥ 300. `h-[46vh] min-h-[300px]`.                                                                                                                                               | **CUMPLE.** 2 cols (382.64 px ×2); frame 667 px = 60 vh. `md:grid-cols-2 md:h-[60vh]`.      | **CUMPLE.** 2 × 663 px; frame 540 px = 60 vh.                                                                                     |
| **About**               | **CUMPLE.** 1 col; retrato 350 px (limitado por viewport), `max-width:420px`.                                                                                                                                            | **CUMPLE.** 1 col (767 px); retrato exactamente 420 px.                                     | **CUMPLE.** `620.80px 620.81px` (2 cols); retrato `max-width:none`, 621 px. `lg:grid-cols-2 lg:max-w-none`.                       |
| **Footer**              | **CUMPLE.** Grid principal 1 col; oficinas `159px 159px` (2-up).                                                                                                                                                         | **CUMPLE.** 1 col (767 px); oficinas 2-up.                                                  | **CUMPLE.** `620.80px 620.81px` (2 cols). `lg:grid-cols-2`.                                                                       |

Afirmaciones adicionales del README:

| Afirmación                                                 | Resultado                  | Evidencia                                                                                                                                                        |
| ---------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Touch targets ≥ 44 px (burger, close, menu links, mail)    | **CUMPLE**                 | burger 44×44 (`size-11`); close 44×44; links del menú 59 px @390 / 84 px @834 con `min-h-11`; botón mail 250×44 con `min-height:44px`.                           |
| `prefers-reduced-motion` mata smooth scroll y transiciones | **CUMPLE**                 | Con `reducedMotion: "reduce"`: `scroll-behavior: auto`; `transition-duration: 1e-05s` en enlaces de nav y overlay. Sin él: `smooth` / `0.15s`.                   |
| Crédito CC BY-SA visible                                   | **CUMPLE** en los 3 anchos | `<p>` "Photo Diego Delso / Wikimedia Commons · CC BY-SA 4.0" presente y visible, enlace a Commons.                                                               |
| Fuentes por `next/font/google`, self-hosted                | **CUMPLE**                 | CSS servido declara `@font-face` con `src: url(/_next/static/media/…woff2)`; fallbacks con `size-adjust` (sin layout shift). 8 `.woff2` en `.next/static/media`. |
| Solo Newsreader 300 / Instrument Sans 400-500 renderizados | **CUMPLE en render**       | `h1`: Newsreader `font-weight:300`; `body`: Instrument Sans `400`. Ver §4-D3 sobre lo que se _embebe_.                                                           |
| `site-header.tsx` único cliente                            | **CUMPLE**                 | `grep -rn '"use client"'` → solo `components/site-header.tsx:1`.                                                                                                 |
| Cero deps fuera de Next/React en runtime                   | **CUMPLE**                 | Imports reales: `next`, `next/font/google`, `next/image`, `react`. Las menciones a `next-sanity` y `sanity` están dentro de comentarios. `vitest` solo en tests. |

Nota: el círculo oscuro con "N" que aparece en las capturas es el indicador de Next.js dev tools, no contenido del sitio. Igual las fuentes `__nextjs-Geist` en `document.fonts` (solo en dev).

---

## 4. Discrepancias README ↔ código (por severidad)

| #   | Sev.     | Discrepancia                                                | Detalle                                                                                                                                                                                                                                                                                                                                                                                                                                      | Spec candidata |
| --- | -------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| D1  | **ALTA** | `PROMPT-CLAUDE-CODE.md` no existe                           | El spec de auditoría lo cita como fuente de la constitución. Solo existe README.md y las reglas del propio PROMPT-AUDIT-SPEC.md. La constitución (000) deberá derivarse de esas dos fuentes; hay que confirmarlo.                                                                                                                                                                                                                            | 000            |
| D2  | **ALTA** | README "First push" obsoleto e incorrecto                   | Dice `cd web` (no hay directorio `web`), `git init -b main`, remote SSH. Realidad: repo ya inicializado, commit inicial **ya empujado** a `origin/main`, remote por **HTTPS**. La premisa de la spec 005 ("init, primer push") ya se cumplió; lo pendiente es empujar el trabajo sin commit.                                                                                                                                                 | 005            |
| D3  | MEDIA    | Fuentes: "300" y "400/500, no other weight" vs. lo embebido | `layout.tsx` no pasa `weight`, así que el CSS servido declara `Newsreader 200–800` (normal **e itálica**, 3+3 archivos) e `Instrument Sans 400–700`. La itálica no se usa en ningún componente. El render usa 300/400/500 correctamente; el coste es peso de red y un `preload` de fuente sin uso. Corregirlo toca `layout.tsx` (fuera de "no cambiar tipografía": cambia lo que se descarga, no lo que se ve) → requiere spec y aprobación. | 004 / 008      |
| D4  | MEDIA    | "Schemas and GROQ queries are already written in `sanity/`" | Las GROQ solo existen como texto en `sanity/README.md`. No hay módulo exportable; 006 tendrá que crearlo.                                                                                                                                                                                                                                                                                                                                    | 006            |
| D5  | MEDIA    | `next@15.5.2` con CVE-2025-66478 (aviso de npm)             | No es una afirmación del README, pero afecta "build limpio". Subir de versión es un cambio de dependencia y requiere spec explícita.                                                                                                                                                                                                                                                                                                         | 001            |
| D6  | BAJA     | `prettier --check` falla                                    | `vitest.setup.ts` (una línea), `docs/HANDOVER-2026-09-03.md`, `.superpowers/…/progress.md`. El README no menciona `format:check`, pero el plan anterior lo usa como puerta.                                                                                                                                                                                                                                                                  | 002            |
| D7  | BAJA     | `public/images/logo-primario.png` (1.5 MB) sin uso          | README lo lista como "logo"; ningún componente lo referencia. O se usa (favicon/OG en 007) o se retira.                                                                                                                                                                                                                                                                                                                                      | 007            |
| D8  | BAJA     | Token `--breakpoint-xs: 26rem` no documentado y sin uso     | El README lista 8 tokens de color y 2 familias; `xs` no aparece ni en README ni en ningún `xs:` de componentes.                                                                                                                                                                                                                                                                                                                              | 004            |
| D9  | BAJA     | README "Structure" incompleto                               | Omite `eslint.config.mjs`, `.prettierrc`, `vitest.*`, `content/local.test.ts`, `docs/`, `.env.example`. Documental.                                                                                                                                                                                                                                                                                                                          | 002            |
| D10 | INFO     | `lib/types.ts` `Insight` sin cuerpo                         | README: "The model has slugs and body blocks". El esquema Sanity sí tiene `body`; el tipo TS y `content/local.ts` no. Coherente con "detail pages not designed yet", pero 010 lo necesitará.                                                                                                                                                                                                                                                 | 010            |
| D11 | INFO     | Spec 005 pide remote `git@github.com:…`                     | El remote existente es HTTPS y `gh` está autenticado con protocolo HTTPS. Cambiarlo a SSH no aporta nada; recomiendo que 005 acepte HTTPS.                                                                                                                                                                                                                                                                                                   | 005            |

Todo lo demás que afirma el README (tokens, utilidades `.shell/.eyebrow/.meta`, `sectionPad`,
`gap-px` sobre `bg-rule`, `min-w-[860px]`, bleed negativo, hint de scroll, touch targets,
reduced-motion, único cliente, seam de contenido, `CONTENT_SOURCE`) **coincide con el código**.

---

## 5. "Open items before launch" del README — estado real

| #   | Item README                                            | Estado real (2026-09-05)                                                                                                                                                                                                                                                                                             |
| --- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Transaction record: 6 filas representativas            | **PENDIENTE — BLOQUEADO POR DUEÑO.** Sigue el `PENDING` en `content/local.ts:4`. Handover: D2 "coming later". Los 2 tests de caracterización (5 columnas, orden descendente) pasan sobre las filas placeholder.                                                                                                      |
| 2   | Hero photography (Museo Soumaya, CC BY-SA)             | **PENDIENTE — BLOQUEADO POR DUEÑO.** Sin fotografía propia. D4 sin respuesta; el plan anterior propone por defecto mover Soumaya a los project frames con crédito. El crédito está visible hoy en los 3 anchos.                                                                                                      |
| 3   | Project frames sin `src`                               | **PENDIENTE — BLOQUEADO POR DUEÑO.** `components/project-pair.tsx` renderiza placas stone con brief.                                                                                                                                                                                                                 |
| 4   | Insight detail pages (`/insights`, `/insights/[slug]`) | **PENDIENTE.** No existen rutas; "All notes" y las tarjetas enlazan a `#insights`. Estructura de rutas = spec 010; **markup BLOQUEADO POR DUEÑO** hasta diseño aprobado.                                                                                                                                             |
| 5   | Verificar stats y teléfonos                            | **Stats: RESUELTO** según handover (D3 confirmado por el dueño 2026-09-03; sin cambios de valor). **Teléfonos: PENDIENTE — BLOQUEADO POR DUEÑO** (hoy solo prefijo + "by appointment"; decidir si se publican números). **Email:** confirmado `mandates@jcfarias.com`; el cambio está en el working tree sin commit. |

---

## 6. Estado de git y trabajo sin commit

- `origin/main` = `fda04d2` (verificado con `git ls-remote`). El README dice "not pushed"; el handover también. **Ambos están desactualizados: el commit inicial sí está en GitHub.**
- Working tree con 5 modificados y 5 untracked (ver §2). Todo es trabajo real de la sesión anterior (harness Vitest, corrección de dominio, plan actualizado, handover) más el spec de esta auditoría.
- Ningún commit de esta sesión. Regla: "nunca commits sin spec asociada" → el harness y la corrección de dominio necesitan spec (002 y 005/011 respectivamente) antes de commitear.

---

## 7. BLOQUEADO POR DUEÑO

Lo que no puedo resolver solo, en orden de impacto:

| #   | Bloqueo                                              | Por qué me bloquea                                                                                                                                         | Qué necesito                                                                                                                                                                                                                                              |
| --- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | **Entorno: proyecto dentro de iCloud Desktop sync**  | Ninguna verificación de Fase 3 puede correr en sitio (tsc 6+ min sin terminar). El espejo sirve para auditar, no para un ciclo editar-verificar-commitear. | Decisión: mover `~/Desktop/JCFarias` a una ruta no sincronizada (p. ej. `~/dev/JCFarias`) y reinstalar `node_modules`, **o** desactivar iCloud Desktop & Documents, **o** autorizar explícitamente que Fase 3 use el espejo como entorno de verificación. |
| B2  | **Historial real de transacciones** (D2)             | `content/local.ts` es placeholder. Sin él no hay deploy a producción (bar del plan anterior).                                                              | Filas reales en el formato que definirá la spec 011.                                                                                                                                                                                                      |
| B3  | **Fotografía propia** (hero y 2 project frames) (D4) | Hero es imagen CC de un edificio en México.                                                                                                                | Fotos propias, o decisión de mover Soumaya a frames / quitar la placa.                                                                                                                                                                                    |
| B4  | **Teléfonos**                                        | Hoy solo prefijos.                                                                                                                                         | Decidir: mantener "by appointment" o números completos.                                                                                                                                                                                                   |
| B5  | **Diseño de `/insights` y `/insights/[slug]`**       | 010 solo puede hacer rutas + data + metadata; el markup no tiene diseño aprobado.                                                                          | Diseño aprobado.                                                                                                                                                                                                                                          |
| B6  | **Contenido de los 3 insights** (cuerpo)             | Los slugs existen; no hay texto.                                                                                                                           | Cuerpos, o confirmar que las notas se publican después del lanzamiento.                                                                                                                                                                                   |
| B7  | **Fuente de la constitución** (D1 de §4)             | `PROMPT-CLAUDE-CODE.md` no existe.                                                                                                                         | Confirmar que 000 se deriva de README.md + reglas de PROMPT-AUDIT-SPEC.md, o entregar el archivo.                                                                                                                                                         |
| B8  | **Repo público / push del trabajo pendiente**        | El código con placeholders `PENDING` ya es público en `rfarias23/jcfarias-co`.                                                                             | Confirmar que se mantiene público (D5) y autorizar el push del working tree en 005.                                                                                                                                                                       |
| B9  | **Upgrade de Next por CVE-2025-66478**               | Cambio de dependencia fuera del alcance de "cero deps"/"no tocar".                                                                                         | Autorizar en 001 (o rechazar y aceptar el aviso).                                                                                                                                                                                                         |

Stats (18 · 4 · 40+ · USD 1.2B): **no bloqueado**, ya verificado por el dueño según handover.

---

## 8. Resumen ejecutivo

- El landing page está **completo y conforme al README** en las 9 filas × 3 anchos de la tabla responsiva y en todas las afirmaciones técnicas, con un solo matiz (fuentes embebidas con más pesos e itálica de los que se usan).
- `tsc`, `next build`, `eslint` y `vitest` pasan limpios en un entorno sano. `prettier --check` falla en 3 archivos.
- Lo que falta es lo que el README ya decía: contenido real, fotografía, rutas de insights, y además SEO (sitemap/robots/OG), favicon, 404, CI, deploy y la integración Sanity.
- **El bloqueo número uno es el entorno**, no el código. Hasta resolver B1 la Fase 3 no puede verificar nada en sitio.

---

## 9. Fase 3 — bitácora de ejecución

| Fecha      | Spec     | Commit                    | Resultado                                                                                                                                                                                   |
| ---------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-05 | Sesión 0 | —                         | Proyecto movido a `~/dev/JCFarias`; `node_modules` reinstalado; 0 archivos dataless; `tsc` 1.8 s en sitio. B1 cerrado.                                                                      |
| 2026-09-05 | 005 (A)  | `5fb27a7`                 | Trabajo heredado + documentos de auditoría committeados.                                                                                                                                    |
| 2026-09-05 | 002      | `2119d0e`                 | Tooling autorizado; harness Vitest committeado; `format:check` verde. **verificada**                                                                                                        |
| 2026-09-05 | 001      | `3264a48`                 | `next` 15.5.2 → 15.5.25 (CVE-2025-66478 cerrado); tsc/build limpios; 40/40 en auditoría responsiva. **verificada**                                                                          |
| 2026-09-05 | 005 (B)  | (este commit)             | `git push origin main` fda04d2..3264a48, sin force; `ls-remote` = HEAD; repo PUBLIC; working tree limpio. **verificada**                                                                    |
| 2026-09-05 | 003      | (este commit)             | `scripts/responsive-audit.mjs` + `npm run audit:responsive`; `playwright-core` devDep; 27/27 celdas y 12/12 checks. **verificada**                                                          |
| 2026-09-05 | 004      | (este commit)             | Fuentes embebidas: Newsreader 300 normal, Instrument Sans 400/500 normal, 0 itálicas, 5 woff2 (antes 8); token `xs` eliminado; README al día. 27/27. **verificada**                         |
| 2026-09-05 | 012      | `699ed1d` + (este commit) | `.github/workflows/ci.yml` verde en main (run 33954514905); prueba negativa PR #1 falló en typecheck (run 33954579831); actions v5. **verificada**                                          |
| 2026-09-05 | 010      | (este commit)             | `/insights` e `/insights/[slug]` (3 SSG) con metadata y `noindex`; `getInsight`; tipo `Insight` con `publishedAt`/`dek`/`body`; 7 tests. Markup placeholder hasta 014. **verificada**       |
| 2026-09-05 | 007      | (este commit)             | `robots.txt`, `sitemap.xml` (solo `/`), imagen OG 1200×630 en ink con wordmark serif (20.9 KB), `icon` 32 px (418 B) y `apple-icon` 180 px, canonical y twitter card. 27/27. **verificada** |
| 2026-09-05 | 013      | (este commit)             | `app/not-found.tsx` con header, footer y primitivas; copy aprobado; 404 en `/no-existe` y `/insights/no-existe`; enlace 44 px; `noindex`. 27/27 en home. **verificada**                     |

Pendiente del dueño (no bloqueante): `sudo chown -R 501:20 ~/.npm` para eliminar el workaround `--cache`.
