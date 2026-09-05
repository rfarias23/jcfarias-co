# 003 — Conformidad responsiva

Estado: aprobada
Depende de: [000, 001]
Bloqueada por dueño: no — decidido 2026-09-05: Opción A, `playwright-core` como devDependency

## Por qué

La tabla "Responsive behaviour" del README es contrato. STATUS.md §3 la verificó celda por
celda con resultado **27/27 CUMPLE**, así que **esta spec no corrige nada**: convierte la
verificación en un procedimiento repetible que 001, 004, 007, 008 y 010 pueden invocar como
prueba de no regresión.

## Alcance

Respeta 000.

Entra:

- Un script `scripts/responsive-audit.mjs` que carga la home en 390×844, 834×1112 y 1440×900 con Chrome headless, mide las 9 filas de la tabla con `getComputedStyle`, comprueba touch targets, `prefers-reduced-motion`, crédito CC BY-SA y ausencia de scroll horizontal de página, e imprime CUMPLE / NO CUMPLE por celda con el valor medido. Es el script usado en la auditoría, sin cambios de lógica.
- Opción A (recomendada): `playwright-core` como devDependency (autorizada por esta spec; no descarga navegadores, usa el Chrome instalado). Opción B: el script vive en `docs/tools/` y se ejecuta desde un directorio externo con `playwright-core` instalado ahí. El dueño elige al aprobar.
- Script `npm run audit:responsive`.

No entra:

- Ningún cambio en componentes ni estilos. Si el script marcara NO CUMPLE en el futuro, la corrección va en una spec propia.
- Capturas en el repo.

## Criterios de aceptación

Cada criterio se evalúa en los tres viewports salvo indicación.

1. DADO la home, CUANDO se mide `document.documentElement.scrollWidth`, ENTONCES es igual al ancho del viewport.
2. Nav: DADO 390 y 834, CUANDO se inspecciona, ENTONCES `header nav` tiene `display:none`, el burger es visible y mide ≥ 44×44; al hacer clic el overlay `fixed inset-0` tiene `background-color: rgb(14,14,14)`, cubre el viewport, `body.style.overflow === "hidden"` y Escape lo oculta. DADO 1440, ENTONCES `header nav` es visible con enlace `#contact` y el burger tiene `display:none`.
3. Hero: DADO 390 y 834, ENTONCES `#top > div` tiene una sola columna; DADO 1440, ENTONCES dos columnas con ratio 2.07 ± 0.02 (1.35/0.65).
4. Hero plate: ENTONCES la altura del contenedor de la imagen es 54 vh (≥ 340 px) / 66 vh (≥ 460) / 74 vh (≥ 520) con tolerancia ± 2 px.
5. Practice e Insights: ENTONCES 1 / 3 / 3 columnas, `gap: 1px`, `background-color: rgb(228,228,228)`.
6. Stats: ENTONCES 2 / 4 / 4 columnas, `gap: 1px`, `background-color: rgb(228,228,228)`.
7. Transactions: DADO 390 y 834, ENTONCES el contenedor tiene `overflow-x: auto`, `scrollWidth > clientWidth`, el track `min-width: 860px`, y el hint "Scroll for the full record →" es visible; DADO 1440, ENTONCES `overflow-x: visible`, `scrollWidth === clientWidth`, hint `display:none`. En los tres: cada fila tiene 5 columnas de grid.
8. Project frames: ENTONCES 1 / 2 / 2 columnas y altura de frame 46 vh (≥ 300) / 60 vh (≥ 440) / 60 vh, ± 2 px.
9. About: DADO 390 y 834, ENTONCES una columna y el contenedor del retrato tiene `max-width: 420px`; DADO 1440, ENTONCES dos columnas y `max-width: none`.
10. Footer: DADO 390 y 834, ENTONCES una columna y la rejilla de oficinas dos columnas; DADO 1440, ENTONCES dos columnas.
11. Touch targets: ENTONCES burger, cierre y botón de mail miden ≥ 44 px de alto y ancho; cada enlace del menú móvil ≥ 44 px de alto.
12. Reduced motion: DADO `prefers-reduced-motion: reduce` en 1440, ENTONCES `scroll-behavior: auto` y `transition-duration` ≤ 0.01 s en los enlaces de nav y en el overlay.
13. Crédito: ENTONCES existe un `<p>` visible que contiene "CC BY-SA" y un enlace a `commons.wikimedia.org`.
14. Herramienta: DADO el repo, CUANDO se ejecuta `npm run audit:responsive` contra `npm run start`, ENTONCES imprime 27 celdas CUMPLE y exit 0.

## Verificación

```bash
npm run build && (npm run start & sleep 3)
npm run audit:responsive          # o: node <ruta externa>/responsive-audit.mjs
kill %1
```

Viewports: 390×844, 834×1112, 1440×900 (deviceScaleFactor 1).

## Archivos afectados

- `scripts/responsive-audit.mjs` (nuevo) — o `docs/tools/responsive-audit.mjs` en Opción B
- `package.json` (script `audit:responsive`; devDependency `playwright-core` solo en Opción A)
- `package-lock.json` (solo Opción A)
- `docs/specs/000-constitution.md` (tabla C4, solo Opción A)

## Hallazgos

(vacío)
