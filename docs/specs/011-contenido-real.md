# 011 — Carga de contenido real

Estado: aprobada parcialmente (entrega 2, fotografía, por el dueño el 2026-09-05; entregas 1, 3 y 5 siguen bloqueadas)
Depende de: [000, 002, 010]
Bloqueada por dueño: **sí, íntegramente.** Sin los datos de este documento no hay nada que ejecutar.

## Por qué

Cuatro elementos de la página son afirmaciones públicas de la firma y hoy son placeholders:
las 6 transacciones, la fotografía del hero, los dos project frames y los teléfonos. Esta
spec define **el formato exacto** en que el dueño entrega cada cosa para que la carga sea
mecánica, sin interpretación.

## Alcance

Respeta 000.

Entra: sustituir datos placeholder por datos reales entregados en los formatos de abajo.
No entra: inventar, redondear, "mejorar" o completar datos; cambiar el diseño de ninguna
sección; cambiar copy de diseño (hero, position, about).

### Formato de entrega 1 — Transacciones

Archivo `content/transactions.csv` (UTF-8, coma, cabecera obligatoria), o su equivalente en tabla:

```
asset,market,scale,role,year
Mixed-use development,"Lima, Perú","34,000 m²",Capital raise & structuring,2024
```

Reglas (las hace cumplir un test):

- `asset`: clase de activo, nunca nombre de inmueble, proyecto ni contraparte.
- `market`: `Ciudad, País` tal como debe verse.
- `scale`: texto libre con unidad (`m²`, `keys`, `units`, `ha`, `assets`).
- `role`: uno de `Capital raise & structuring · Buy-side advisory · Sell-side mandate · Asset strategy · Partnership structuring · Joint-venture formation`. Si hace falta otro, se indica y se añade a `sanity/schemas/transaction.ts` en la misma spec.
- `year`: cuatro dígitos. Se ordenan de más reciente a más antiguo.
- Entre 6 y 10 filas. Todas publicables.

### Formato de entrega 2 — Fotografía

| Uso       | Archivo         | Mínimo         | Orientación         | Además                                                                                                                      |
| --------- | --------------- | -------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Hero      | `hero.jpg`      | 2560 × 1440 px | horizontal          | Crédito si no es propia; si es propia, "© J.C. Farias & Co." o nada. Ubicación (ciudad) para la línea `meta` bajo la placa. |
| Project A | `project-a.jpg` | 1600 × 2000 px | vertical o cuadrada | Alt de una línea (qué es, dónde).                                                                                           |
| Project B | `project-b.jpg` | 1600 × 2000 px | vertical o cuadrada | Alt de una línea. Detalle arquitectónico: fachada, estructura, materialidad.                                                |

Decisión requerida sobre Soumaya (D4): (a) se retira y se sustituye por `hero.jpg`; (b) pasa a
un project frame como referencia arquitectónica explícita, con su crédito CC BY-SA
trasladado bajo ese frame. Mientras esté en cualquier sitio, el crédito se mantiene (C6).

### Formato de entrega 3 — Contacto

```
email: mandates@jcfarias.com          (confirmado 2026-09-03)
Lima:          +51 ...  | o "by appointment"
Quito:         +593 ... | o "by appointment"
San Juan:      +1 ...   | o "by appointment"
Santo Domingo: +1 ...   | o "by appointment"
```

Formato de display si hay número: `+51 1 234 5678`. `phoneNote` conserva el patrón actual.

### Formato de entrega 4 — Stats

Ya verificadas por el dueño (18 · 4 · 40+ · USD 1.2B, 2026-09-03). No se tocan. Si cambian,
misma tabla `value,label`. Regla: "4 markets covered directly" = número de oficinas.

### Formato de entrega 5 — Insights (cuerpos)

Por nota, un `.md` con front matter:

```
---
slug: five-year-window-keys-pr-dr
dek: Una línea de resumen (≤ 160 caracteres) para metadata.
publishedAt: 2026-03-14
---
Párrafo 1.

Párrafo 2.
```

Se cargan a `body: string[]` (010). El markup de la página lo decide la spec de diseño (014).

## Criterios de aceptación

1. DADO `content/transactions.csv` entregado, CUANDO se carga a `content/local.ts`, ENTONCES `npx vitest run` pasa: 5 columnas no vacías, año de 4 dígitos, orden descendente, `role` dentro de la lista, y `asset` no coincide con `/\b(Torre|Tower|Plaza|Hotel [A-Z]|Centro|Mall|Residences?)\b/` (tripwire de nombre propio; se lee además a mano).
2. DADO `content/local.ts`, ENTONCES `grep -c PENDING` es 0 en `content/`, `components/`, `lib/`, `app/`.
3. DADO las fotos, CUANDO se ejecuta `sips -g pixelWidth -g pixelHeight`, ENTONCES cumplen los mínimos de la tabla, y `components/project-pair.tsx` tiene `src` y `alt` en ambos frames.
4. DADO el hero con foto nueva, ENTONCES `alt` describe la foto real y la línea `meta` bajo la placa nombra el lugar real. Si Soumaya sigue en uso en cualquier lugar, el `<p>` con "CC BY-SA" sigue visible en 390/834/1440.
5. DADO `content/site.ts`, ENTONCES los cuatro `phoneNote` coinciden carácter a carácter con la entrega 3.
6. DADO 008 verificada antes, CUANDO se repite Lighthouse con la foto nueva, ENTONCES LCP < 2.5 s y CLS < 0.05.
7. DADO `npm run audit:responsive`, ENTONCES 27/27.
8. DADO cada insight entregado, ENTONCES `body.length ≥ 1`, `dek` ≤ 160 caracteres, `publishedAt` ISO válida.

## Verificación

```bash
npx vitest run
grep -rn PENDING content components lib app | wc -l
sips -g pixelWidth -g pixelHeight public/images/hero.jpg public/images/project-a.jpg public/images/project-b.jpg
grep -n "src:" components/project-pair.tsx
grep -n "phoneNote" content/site.ts
npm run build && (npm run start & sleep 3) && npm run audit:responsive; kill %1
# Lighthouse: ver 008
```

Viewports: 390/834/1440.

## Archivos afectados

- `content/local.ts`
- `content/local.test.ts` (tests de reglas editoriales)
- `content/site.ts` (`offices[].phoneNote`; `stats` solo si el dueño los cambia)
- `public/images/hero.jpg`, `public/images/project-a.jpg`, `public/images/project-b.jpg` (nuevos); `public/images/soumaya-hero.jpg` (borrar o mover según D4)
- `components/hero-image.tsx` (src, alt, crédito, línea meta)
- `components/project-pair.tsx` (src, alt)
- `sanity/schemas/transaction.ts` (solo si hay un `role` nuevo)

## Hallazgos

- **H1 — D4 resuelta con una tercera opción: Soumaya se queda como hero.** El dueño decidió el 2026-09-05 mantener `soumaya-hero.jpg` y su crédito CC BY-SA. Las fotos entregadas no sustituyen al hero; van a los dos project frames y al retrato de About. `hero.jpg` de la entrega 2 no aplica.
- **H2 — Project A es horizontal.** `project-a.jpg` (iStock 2212732389, licencia estándar confirmada por el dueño) mide 2309 × 1299, no vertical ni cuadrada. El frame recorta con `object-cover` al centro (los tres muelles); el dueño aceptó el recorte. Se re-encodeó a calidad 76 (675 KB).
- **H3 — Project B cumple.** `project-b.jpg` (iStock 1501184213, licencia estándar) cuadrada, reducida de 3414 a 2000 px, calidad 78 (918 KB; textura fina que comprime mal; Next sirve derivados de 49–88 KB).
- **H4 — El retrato de About sustituye al logotipo "JCF LIM".** `perfil-jcf.png` (800 × 800, logotipo) → `perfil-jcf.jpg` (1280 × 853, foto propia entregada por el dueño). La spec no fijaba mínimo para About; el marco 4:5 recorta los laterales y conserva la cara. En pantallas retina grandes puede verse ligeramente blanda. Si el dueño tiene un original mayor, se sustituye sin tocar código.
- **H5 — `alt` confirmados por el dueño el 2026-09-05.** Frame A: "Loading docks of a logistics facility under a clear sky" (aceptado tal cual). Frame B: el dueño pidió describirlo como edificio de oficinas; queda "Facade of an office building in afternoon light". Sin ubicación porque son fotos de archivo.
- **H6 — `public/images/logo-primario.png` (1.5 MB) no se referencia en ningún componente.** Fuera de alcance; se anota para decidir si se borra.

## Evidencia parcial (2026-09-05, entrega 2)

| Criterio   | Resultado                                                                                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3          | `sips`: project-a 2309×1299 (H2), project-b 2000×2000, perfil-jcf 1280×853; `components/project-pair.tsx` con `src` y `alt` en ambos frames; `about.tsx` apunta a `perfil-jcf.jpg` |
| 4          | Hero sin cambios; crédito CC BY-SA visible (check "credit" de la auditoría: CUMPLE)                                                                                                |
| 7          | `npm run audit:responsive` 27/27 + 12/12 con las tres imágenes                                                                                                                     |
| 6          | No aplica: el hero no cambió (LCP intacto)                                                                                                                                         |
| 1, 2, 5, 8 | Pendientes de las entregas 1, 3 y 5                                                                                                                                                |
