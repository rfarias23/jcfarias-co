# 011 — Carga de contenido real

Estado: borrador
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

| Uso | Archivo | Mínimo | Orientación | Además |
| --- | --- | --- | --- | --- |
| Hero | `hero.jpg` | 2560 × 1440 px | horizontal | Crédito si no es propia; si es propia, "© J.C. Farias & Co." o nada. Ubicación (ciudad) para la línea `meta` bajo la placa. |
| Project A | `project-a.jpg` | 1600 × 2000 px | vertical o cuadrada | Alt de una línea (qué es, dónde). |
| Project B | `project-b.jpg` | 1600 × 2000 px | vertical o cuadrada | Alt de una línea. Detalle arquitectónico: fachada, estructura, materialidad. |

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

(vacío)
