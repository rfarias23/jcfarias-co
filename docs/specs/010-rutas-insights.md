# 010 — Rutas `/insights` e `/insights/[slug]`: estructura, datos y metadata

Estado: aprobada
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

(vacío)
