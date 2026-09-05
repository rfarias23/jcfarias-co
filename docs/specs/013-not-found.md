# 013 — Página 404 en el chrome del sitio

Estado: aprobada
Depende de: [000, 001, 010]
Bloqueada por dueño: no — copy propuesto aprobado por el dueño 2026-09-05

## Por qué

Con 010 existen rutas dinámicas y `notFound()`. Hoy la 404 es la de Next por defecto (fondo
blanco, Geist, sin header ni footer), fuera del sistema visual del sitio.

## Alcance

Respeta 000.

Entra:
- `app/not-found.tsx`: server component que compone `SiteHeader`, un `<main>` con `<Shell>` y `ContactFooter`. Usa exclusivamente primitivas y clases ya existentes: `Eyebrow` con "404", `<h1>` con las mismas clases que el `h2` de About (`font-serif text-[clamp(30px,4.2vw,56px)] font-light leading-[1.1] tracking-[-0.022em]`), un párrafo con las clases del párrafo de About, y un enlace a `/` con las clases del botón "Contact" del header. Padding `sectionPad`.
- Copy propuesto (a aprobar por el dueño; no se implementa otro):
  - Eyebrow: `404`
  - Título: `This page is not on the record.`
  - Párrafo: `The address may have changed or never existed. The practice, transactions and notes are on the home page.`
  - Enlace: `Back to home`
- `metadata`: `title: "Not found"`, `robots: noindex`.

No entra:
- Nuevos estilos, nuevas clases, nuevos tokens.
- Ilustraciones, imágenes.
- Cambios en `SiteHeader` o `ContactFooter`.

## Criterios de aceptación

1. DADO `npm run start`, CUANDO se pide `/no-existe`, ENTONCES el status es 404 y el HTML contiene `<header`, `<footer id="contact"` y el texto aprobado.
2. DADO `/insights/no-existe`, ENTONCES 404 con la misma página (verifica `notFound()` de 010).
3. DADO 390, 834 y 1440, CUANDO se inspecciona, ENTONCES el header se comporta como en la home (burger/nav), el enlace "Back to home" mide ≥ 44 px de alto, y `document.documentElement.scrollWidth` = viewport.
4. DADO `getComputedStyle(h1)`, ENTONCES `Newsreader` 300; el párrafo `Instrument Sans` 400.
5. DADO `grep -rn '"use client"'`, ENTONCES sigue siendo solo `site-header.tsx`.
6. DADO el HTML, ENTONCES `<meta name="robots" content="noindex">` y `<title>Not found · J.C. Farias & Co.</title>`.
7. DADO `npm run build`, ENTONCES exit 0 sin warnings y `/_not-found` sigue estático.

## Verificación

```bash
npm run build && (npm run start & sleep 3)
curl -s -o /tmp/404.html -w "%{http_code}\n" http://localhost:3000/no-existe; grep -cE "<header|footer id=\"contact\"|Back to home" /tmp/404.html
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/insights/no-existe
grep -rn '"use client"' app components lib
grep -oE "<title>[^<]*</title>|<meta name=\"robots\"[^>]*>" /tmp/404.html
# 390/834/1440: script de 003 apuntando a /no-existe (solo nav, touch target del enlace, scrollWidth)
kill %1
```

Viewports: 390×844, 834×1112, 1440×900.

## Archivos afectados

- `app/not-found.tsx` (nuevo)

## Hallazgos

(vacío)
