# 007 — SEO y metadata: sitemap, robots, imagen OG, favicon

Estado: aprobada
Depende de: [000, 001, 004]
Bloqueada por dueño: no — decidido 2026-09-05: favicon Opción A (wordmark); texto de la imagen OG aprobado

## Por qué

El sitio no tiene sitemap, robots, imagen social ni favicon. Sin ellos un enlace compartido
en LinkedIn o WhatsApp muestra una tarjeta vacía y los buscadores no tienen mapa del sitio.
`metadataBase` ya deriva de `site.url = https://jcfarias.com`.

## Alcance

Respeta 000.

Entra:

- `app/sitemap.ts`: `/` con `lastModified` = fecha de build; más las rutas de 010 **solo cuando 010 esté verificada y sus páginas dejen de ser `noindex`** (hasta entonces, solo `/`).
- `app/robots.ts`: `allow: /`, `sitemap: ${site.url}/sitemap.xml`. Sin `disallow` salvo que 010 lo pida para sus placeholders.
- `app/opengraph-image.tsx` (1200×630, `ImageResponse`): fondo `#0E0E0E`, wordmark `J.C. FARIAS & CO.` en Newsreader 300 sobre `#FFFFFF`, tracking uppercase como el header, y una línea `eyebrow` con `site.tagline` en Instrument Sans 500 gris `#8A8A8A`. Fuentes cargadas desde archivos `.ttf/.woff` committeados en `lib/og/fonts/` (Newsreader 300 y Instrument Sans 500, licencia OFL) leídos con `node:fs/promises`; **no** se hace fetch a Google en build. La imagen no usa colores fuera de la paleta.
- `app/icon.tsx` (32×32 y 180×180 vía `generateImageMetadata`, o `app/icon.png` + `app/apple-icon.png` si el dueño elige el logo): Opción A wordmark "JC" serif sobre ink; Opción B `logo-primario.png` recortado y reducido (< 20 KB). Si se elige B, `public/images/logo-primario.png` (1.5 MB) se sustituye por la versión reducida o se borra (cierra D7).
- `app/layout.tsx`: añadir `twitter: { card: "summary_large_image" }` y `alternates: { canonical: "/" }`. No se añade `openGraph.images` (la convención de archivo la genera).
- Metadata por página: solo `/` existe hoy; las rutas de 010 definen la suya en su spec.

No entra:

- JSON-LD / datos estructurados (se propondrá como spec aparte si el dueño lo quiere).
- Cambios de copy visible en la página.
- Analytics, verificación de Search Console.

## Criterios de aceptación

1. DADO `npm run build`, CUANDO se lee la tabla de rutas, ENTONCES aparecen `/sitemap.xml`, `/robots.txt`, `/opengraph-image` e `/icon` (o `/icon.png`), y el build tiene exit 0 sin warnings.
2. DADO `npm run start`, CUANDO se pide `/robots.txt`, ENTONCES responde 200, contiene `User-Agent: *`, `Allow: /` y `Sitemap: https://jcfarias.com/sitemap.xml`.
3. DADO `/sitemap.xml`, ENTONCES responde 200, es XML válido y contiene exactamente una `<url>` con `<loc>https://jcfarias.com/</loc>` (más las de 010 cuando aplique).
4. DADO `/opengraph-image`, ENTONCES responde 200 con `content-type: image/png`, dimensiones 1200×630 (`file` o `sips -g pixelWidth`), y al inspeccionarla visualmente el fondo es `#0E0E0E`, el wordmark es serif y no hay ningún color fuera de la paleta.
5. DADO el HTML de `/`, CUANDO se extraen las metas, ENTONCES existen `og:image` con URL absoluta bajo `https://jcfarias.com/`, `og:image:width` 1200, `og:image:height` 630, `twitter:card` `summary_large_image`, `link rel="canonical" href="https://jcfarias.com/"` y `link rel="icon"`.
6. DADO `/icon` (o `/icon.png`), ENTONCES responde 200, `image/png`, y pesa menos de 20 KB.
7. DADO `grep -rn "fonts.googleapis\|fetch(" app/opengraph-image.tsx app/icon.tsx`, ENTONCES 0 líneas.
8. DADO `npm run audit:responsive` (003), ENTONCES 27/27 (el layout no cambia visualmente).
9. DADO `npx tsc --noEmit` y `npm run lint`, ENTONCES exit 0.

## Verificación

```bash
npm run build 2>&1 | grep -E "sitemap|robots|opengraph|icon|warn"
(npm run start & sleep 3)
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/sitemap.xml | xmllint --noout - && curl -s http://localhost:3000/sitemap.xml | grep -c "<loc>"
curl -s -o /tmp/og.png -w "%{content_type}\n" http://localhost:3000/opengraph-image && sips -g pixelWidth -g pixelHeight /tmp/og.png && open /tmp/og.png
curl -s -o /tmp/icon.png -w "%{content_type} %{size_download}\n" http://localhost:3000/icon
curl -s http://localhost:3000/ | grep -oE '<(meta|link)[^>]*(og:image|twitter:card|canonical|rel="icon")[^>]*>'
grep -rn "fonts.googleapis\|fetch(" app/opengraph-image.tsx app/icon.tsx | wc -l
npm run audit:responsive; npx tsc --noEmit; npm run lint
kill %1
```

Viewports: inspección visual de la imagen OG a 1200×630; 390/834/1440 vía 003.

## Archivos afectados

- `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/icon.tsx` (nuevos)
- `lib/og/fonts/Newsreader-Light.ttf`, `lib/og/fonts/InstrumentSans-Medium.ttf` (nuevos, OFL) y `lib/og/fonts.ts` (loader)
- `app/layout.tsx` (solo `twitter` y `alternates` en `metadata`)
- `public/images/logo-primario.png` (solo si Opción B: sustituir o borrar)

## Hallazgos

(vacío)
