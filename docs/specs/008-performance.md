# 008 — Performance: LCP y CLS

Estado: aprobada
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

(vacío)
