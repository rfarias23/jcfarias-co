# 008 — Performance: LCP y CLS

Estado: verificada
Depende de: [000, 001, 003, 004]
Bloqueada por dueño: no (si la foto del hero cambia por 011, la spec se re-verifica; no bloquea)

## Por qué

El LCP de la home es la placa del hero (`soumaya-hero.jpg`, 2.0 MB de origen, servida por
`next/image`). El README promete "no layout shift" por las fuentes. Ninguna de las dos
cosas está medida. Objetivo: LCP < 2.5 s y CLS < 0.05 en Lighthouse móvil y desktop.

## Alcance

Respeta 000.

Entra:

- Medición de línea base con Lighthouse (Chrome instalado, `npx lighthouse` sin añadirlo al proyecto) contra `npm run start`, móvil y desktop, 3 corridas cada uno, mediana.
- Hero: mantener `priority` y `sizes="100vw"` (ya presentes). Añadir `placeholder="blur"` importando la imagen estáticamente (`import hero from "@/public/images/soumaya-hero.jpg"`) para que Next genere `blurDataURL` en build. Mismo `alt`, mismo `object-cover`, mismo contenedor.
- Reducir el **archivo de origen** `soumaya-hero.jpg` a ≤ 2560 px de ancho y ≤ 600 KB con calidad 82, sin recorte ni cambio de encuadre. Es una optimización del asset, no un cambio de diseño; `next/image` sigue generando los tamaños. Si el dueño prefiere no tocar el archivo, este punto se elimina y se anota.
- Retrato `perfil-jcf.png` (27 KB): sin cambios.
- Fuentes: las mejoras vienen de 004 (menos archivos). Verificar aquí que no hay CLS atribuible a fuentes.
- Registrar los resultados en `docs/STATUS.md`.

No entra:

- Cambiar alturas del hero, breakpoints, `sizes` de otras imágenes ni el orden de secciones.
- Lazy-load de secciones, code splitting manual, service workers.
- CDN o cabeceras de caché (las pone Vercel; 009).

## Criterios de aceptación

1. DADO `npm run build && npm run start`, CUANDO se ejecuta Lighthouse **móvil** (preset por defecto, throttling simulado) 3 veces, ENTONCES la mediana de LCP < 2.5 s y de CLS < 0.05.
2. DADO lo mismo con `--preset=desktop`, ENTONCES mediana de LCP < 2.5 s y CLS < 0.05.
3. DADO el HTML servido, CUANDO se inspecciona el `<img>` del hero, ENTONCES tiene `fetchpriority="high"` o existe un `<link rel="preload" as="image">` para él, `sizes="100vw"`, y `style` contiene `background-image: url("data:image/…")` o el atributo de blur de Next (`data-nimg="fill"` con `placeholder`).
4. DADO `public/images/soumaya-hero.jpg`, CUANDO se ejecuta `sips -g pixelWidth` y `stat -f %z`, ENTONCES ancho ≤ 2560 y tamaño ≤ 614400 bytes (salvo que el dueño excluya este punto).
5. DADO la captura de 003 en 1440 antes y después, CUANDO se comparan visualmente, ENTONCES el encuadre del hero es el mismo (mismo `object-cover`, misma altura).
6. DADO `npm run audit:responsive`, ENTONCES 27/27.
7. DADO el informe Lighthouse, CUANDO se lee la auditoría "Avoid large layout shifts", ENTONCES ningún elemento listado es texto (indicador de que las fuentes no producen CLS).
8. DADO `npm run build`, ENTONCES exit 0 sin warnings.

## Verificación

```bash
npm run build && (npm run start & sleep 3)
for i in 1 2 3; do npx lighthouse http://localhost:3000/ --only-categories=performance --output=json --output-path=/tmp/lh-m-$i.json --chrome-flags="--headless" --quiet; done
for i in 1 2 3; do npx lighthouse http://localhost:3000/ --preset=desktop --only-categories=performance --output=json --output-path=/tmp/lh-d-$i.json --chrome-flags="--headless" --quiet; done
for f in /tmp/lh-*.json; do node -e "const r=require('$f');console.log('$f',r.audits['largest-contentful-paint'].numericValue,r.audits['cumulative-layout-shift'].numericValue)"; done
curl -s http://localhost:3000/ | grep -oE '<img[^>]*soumaya[^>]*>' | head -1
sips -g pixelWidth public/images/soumaya-hero.jpg; stat -f %z public/images/soumaya-hero.jpg
npm run audit:responsive
kill %1
```

Viewports: Lighthouse móvil (360×640 emulado) y desktop (1350×940); 1440 para comparación visual.

## Archivos afectados

- `components/hero-image.tsx` (import estático + `placeholder="blur"`; nada más)
- `public/images/soumaya-hero.jpg` (re-encode, mismo encuadre)
- `docs/STATUS.md` (resultados)

## Hallazgos

- 2026-09-05 — **Causa raíz del LCP de 12 s en móvil: `package-lock.json` no tenía los binarios de plataforma de `sharp`** (solo `linux-ppc64`, `riscv64`, `s390x`, `wasm32`, `win32-ia32`; ni `darwin-arm64` ni `linux-x64`). Sin `sharp`, el optimizador de Next sirve el JPG original: la petición `/_next/image?…&w=750` devolvía 2 028 108 bytes. El mismo defecto habría afectado a Vercel y a CI (Linux x64). Origen probable: la sesión del 2026-09-03 instaló las devDependencies de Vitest con la red y la caché npm rotas por iCloud y npm resolvió parcialmente las dependencias opcionales.
- **Desviación de alcance, pendiente de confirmación del dueño:** `package-lock.json` no está en "Archivos afectados". Se reparó con `npm update sharp` (sin tocar `package.json`; `sharp` 0.34.5 → 0.35.4 dentro del rango que declara `next`; se añaden 18 entradas `@img/*` y no cambia ninguna otra versión). Se verificó `npm ci` limpio con el lock nuevo. Si el dueño lo rechaza, se revierte ese archivo y el criterio 1 vuelve a fallar. Intentos descartados y documentados: regenerar el lock sin lockfile (npm reconstruyó desde `node_modules` y perdió 112 paquetes de plataforma; revertido) y `npm install` sobre el lock existente (no añade opcionales ausentes).
- El JPG de origen a calidad 82 (mozjpeg) pesa 707 KB, por encima del tope de 600 KB del criterio 4. Se eligió la calidad más alta que cumple el tope: **q76, 591 743 bytes**, 2560×1708 px. Con `sharp` funcionando, el archivo de origen ya no llega al navegador (recibe variantes de 64–578 KB); el tope importa para el repo y para el fallback `w=3840`.
- La comparación visual (captura del `<img>` a 1440) muestra el mismo encuadre: `object-cover` sobre un contenedor de la misma altura no cambia con la resolución de origen.
- La mediana móvil (2 275 ms) queda a 225 ms del umbral; una de tres corridas dio 2 488 ms. En Vercel con CDN el TTFB y el "render delay" bajan, pero conviene repetir la medición en el preview de 009.
- Herramienta: `lighthouse` 12.8.2 instalado en el scratchpad de la sesión (fuera del proyecto), Chrome local, `--headless=new`.

## Evidencia de verificación (2026-09-05)

```
LÍNEA BASE (build de 013, antes de cambios)
  móvil    LCP 12047 / 12014 / 12158 ms · CLS 0 · score 75   (imagen w=750 servida = 2 028 523 B, sin optimizar)
  desktop  LCP   554 /  2058 /  2101 ms · CLS 0 · score 90–97

DESPUÉS (lock reparado + import estático/blur + JPG 2560 px)
  móvil    LCP 2488 / 2268 / 2275 ms · mediana 2275 < 2500 · CLS 0.000 · score 98/99/98        criterio 1 PASA
  desktop  LCP  781 /  475 /  495 ms · mediana  495 < 2500 · CLS 0.000 · score 100             criterio 2 PASA
  /_next/image w=750 → 64 500 B · w=1080 → 133 621 B · w=1920 → 362 044 B · w=3840 → 578 379 B
$ <img> del hero              sizes="100vw" · background-image: url("data:image/svg+xml… feGaussianBlur") (blur)
                              + <link rel="preload" as="image" imageSizes="100vw">                  criterio 3 PASA
$ sips / stat                 2560 px de ancho · 591 743 bytes ≤ 614 400                          criterio 4 PASA
$ captura <img> @1440         mismo encuadre que la captura de Fase 1                              criterio 5 PASA
$ npm run audit:responsive    27/27 · 12/12                                                        criterio 6 PASA
$ Lighthouse layout-shifts    0 elementos listados en móvil y desktop (ningún texto)               criterio 7 PASA
$ npm run build               ✓ Compiled successfully · warn count 0                               criterio 8 PASA
$ tsc / lint / format         ok / exit 0 / All matched files
```
