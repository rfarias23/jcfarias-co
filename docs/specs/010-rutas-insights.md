# 010 — Rutas `/insights` e `/insights/[slug]`: estructura, datos y metadata

Estado: verificada
Depende de: [000, 001, 002]
Bloqueada por dueño: sí, parcialmente — **el markup de ambas páginas está BLOQUEADO hasta que exista un diseño aprobado** (B5). Esta spec autoriza solo rutas, tipos, data fetching y metadata. Los cuerpos de las notas (B6) son contenido del dueño.

## Por qué

El modelo tiene slugs y el esquema Sanity tiene `body`, pero no existen rutas: "All notes" y
las tarjetas apuntan a `#insights`. Preparar la estructura ahora permite que 006 y 007 la
consuman, sin comprometer un diseño que todavía no existe.

## Alcance

Respeta 000. **Esta spec no diseña nada.** Cualquier decisión de layout, tipografía o
espaciado de las páginas de insight pertenece a una spec futura (014) que se abrirá cuando
el dueño entregue el diseño.

Entra:

- `lib/types.ts`: extender `Insight` con `publishedAt: string` (ISO), `dek?: string` (una línea de resumen para metadata `description`) y `body: string[]` (párrafos de texto plano; el bloque Portable Text de Sanity se mapea a párrafos en 006; el modelo definitivo lo fija la spec de diseño).
- `content/local.ts`: añadir a las 3 notas `publishedAt`, `dek: ""` y `body: []`. **No se inventa texto.** Vacío hasta que 011 lo cargue.
- `lib/content.ts`: `getInsight(slug): Promise<Insight | null>` con rama `local` (busca en el array) y rama `sanity` que lanza hasta 006.
- `app/insights/page.tsx`: server component. `generateMetadata` con `title: "Insights"` y `description` = la descripción de `site` en `layout.tsx`. `robots: { index: false, follow: false }` **hasta la spec de diseño**. Cuerpo: únicamente `<Shell><SectionHead title="Insights" /></Shell>` y una lista `<ul>` sin estilos de los títulos enlazados a su slug — un placeholder honesto, no un diseño.
- `app/insights/[slug]/page.tsx`: `generateStaticParams` desde `getInsights()`; `params` es `Promise` (Next 15) y se `await`; `notFound()` si `getInsight` devuelve `null`, llamado fuera de cualquier `try`; `generateMetadata` con `title` = título de la nota, `description` = `dek` o la descripción del sitio, `robots` `noindex` hasta la spec de diseño. Cuerpo: `<Shell><Eyebrow>{category}</Eyebrow><h1>{title}</h1></Shell>` con las clases existentes de `SectionHead`/`Eyebrow`, nada más.
- Los enlaces del componente `insights.tsx` de la home **no cambian** (siguen a `#insights`) hasta que el diseño exista; se documenta en Hallazgos de 014.
- Tests (Vitest): `getInsight` devuelve la nota por slug y `null` para desconocido; `generateStaticParams` devuelve los 3 slugs; `content/local.test.ts` gana un test de que cada insight tiene `publishedAt` ISO válida.

No entra:

- Markup, estilos, tipografía o espaciado de las páginas más allá del placeholder descrito.
- Cambiar `components/insights.tsx`.
- Texto de las notas.
- Entradas en el sitemap (007 las añade cuando dejen de ser `noindex`).

## Criterios de aceptación

1. DADO `npm run build`, CUANDO se lee la tabla de rutas, ENTONCES aparecen `/insights` y `/insights/[slug]` con 3 rutas estáticas generadas (`● (SSG)`), exit 0 sin warnings.
2. DADO `npm run start`, CUANDO se piden `/insights`, `/insights/five-year-window-keys-pr-dr`, `/insights/franchise-expansion-lima-quito`, `/insights/pricing-land-dollarized-economy`, ENTONCES 200 en los cuatro; `/insights/no-existe` responde 404.
3. DADO el HTML de `/insights/five-year-window-keys-pr-dr`, ENTONCES `<title>` es `The five-year window for keys in Puerto Rico and the DR · J.C. Farias & Co.` y existe `<meta name="robots" content="noindex, nofollow">`.
4. DADO `npx vitest run`, ENTONCES los tests nuevos pasan y el total es ≥ 6.
5. DADO `grep -rn '"use client"' app components lib`, ENTONCES una sola línea (`site-header.tsx`).
6. DADO `git diff --name-only` de la spec, ENTONCES `components/insights.tsx` no aparece y ningún archivo de `components/` cambia.
7. DADO `content/local.ts`, CUANDO se ejecuta `grep -c 'body: \[\]'`, ENTONCES 3 (ningún cuerpo inventado).
8. DADO `/sitemap.xml`, ENTONCES sigue conteniendo solo `/` (las rutas `noindex` no se listan).
9. DADO `npm run audit:responsive` sobre `/`, ENTONCES 27/27 (la home no cambia).

## Verificación

```bash
npm run build 2>&1 | grep -E "insights|warn"
(npm run start & sleep 3)
for p in insights insights/five-year-window-keys-pr-dr insights/franchise-expansion-lima-quito insights/pricing-land-dollarized-economy insights/no-existe; do curl -s -o /dev/null -w "$p %{http_code}\n" http://localhost:3000/$p; done
curl -s http://localhost:3000/insights/five-year-window-keys-pr-dr | grep -oE "<title>[^<]*</title>|<meta name=\"robots\"[^>]*>"
npx vitest run
grep -rn '"use client"' app components lib
grep -c 'body: \[\]' content/local.ts
curl -s http://localhost:3000/sitemap.xml | grep -c "<loc>"
npm run audit:responsive
kill %1
```

Viewports: ninguno para las páginas nuevas (no hay diseño que verificar); 390/834/1440 para la home vía 003.

## Archivos afectados

- `lib/types.ts`
- `lib/content.ts`
- `lib/content.test.ts` (nuevo o ampliado si 006 ya lo creó)
- `content/local.ts` (solo campos nuevos, vacíos)
- `content/local.test.ts`
- `app/insights/page.tsx` (nuevo)
- `app/insights/[slug]/page.tsx` (nuevo)

## Hallazgos

- 2026-09-05 — **`publishedAt` sin inventar fechas.** Las notas solo tienen `year`. Para no fabricar un día y un mes, `publishedAt` se cargó como el año en ISO 8601 (`"2026"`, `"2025"`), que es una fecha ISO válida y `Date.parse` la acepta. El test comprueba además que `publishedAt.slice(0,4) === year`. Las fechas exactas llegan con el formato 5 de 011.
- 2026-09-05 — **Descripción del sitio duplicada.** La spec pedía usar "la descripción de `site` en `layout.tsx`", pero ese texto es un literal dentro de `layout.tsx`, no un campo de `content/site.ts`, y ninguno de los dos archivos está en la lista de esta spec. Importar `app/layout` desde una página arrastra `next/font/google` a los tests. Se copió el literal en `app/insights/page.tsx` y `app/insights/[slug]/page.tsx`. **Pregunta al dueño:** ¿autoriza una spec pequeña que mueva la descripción a `content/site.ts` (`site.description`) y la use en `layout.tsx` y en ambas páginas? Hasta entonces, cualquier cambio de esa frase debe hacerse en tres sitios.
- 2026-09-05 — Criterio 8 (sitemap sigue con solo `/`) no aplica todavía: `app/sitemap.ts` lo crea 007, que en PLAN.md va después. 007 hereda la obligación de excluir las rutas `noindex`.
- El `<h1>` del placeholder de `[slug]` no lleva clases de tipografía (solo `m-0 mt-4`): con el preflight de Tailwind hereda el cuerpo. Es deliberado: la spec prohíbe diseñar aquí.
- `components/insights.tsx` sigue enlazando a `#insights` (criterio 6). El cambio de `href` queda para 014.

## Evidencia de verificación (2026-09-05)

```
$ npm run build                        ○ /insights 127 B · ● /insights/[slug] (SSG) con 3 rutas · warn count 0    criterio 1 PASA
$ curl (start)                         /insights 200 · 3 slugs 200 · /insights/no-existe 404                       criterio 2 PASA
$ <title>/<meta robots>                "The five-year window for keys in Puerto Rico and the DR · J.C. Farias & Co."
                                       <meta name="robots" content="noindex, nofollow">                            criterio 3 PASA
$ npx vitest run                       content/local.test.ts 4 · lib/content.test.ts 3 → 7 passed                 criterio 4 PASA
$ grep -rn '"use client"'              components/site-header.tsx:1 (única)                                       criterio 5 PASA
$ git status                           lib/types.ts, lib/content.ts, lib/content.test.ts, content/local.ts,
                                       content/local.test.ts, app/insights/ — ningún components/                  criterio 6 PASA
$ grep -c 'body: \[\]' content/local.ts   3                                                                        criterio 7 PASA
$ /sitemap.xml                         404 (no existe aún; 007)                                                    criterio 8 N/A
$ npm run audit:responsive             27/27 celdas · 12/12 checks                                                 criterio 9 PASA
$ tsc / lint / format:check            exit 0 / exit 0 / All matched files
```
