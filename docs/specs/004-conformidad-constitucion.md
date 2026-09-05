# 004 — Conformidad de constitución

Estado: aprobada
Depende de: [000, 001, 003]
Bloqueada por dueño: no — punto 1 confirmado por el dueño 2026-09-05

## Por qué

STATUS.md §4 encontró tres desviaciones entre README/constitución y código que no son de
contenido: se embeben pesos e itálicas de fuente que la constitución prohíbe, hay un token
sin uso y el README describe un estado del repo que ya no es cierto.

## Alcance

Respeta 000.

Entra:

1. **Fuentes (D3).** En `app/layout.tsx`, restringir `Newsreader` a `weight: ["300"]`, `style: ["normal"]` y `Instrument Sans` a `weight: ["400", "500"]`. Resultado: el CSS servido declara solo esos pesos y ninguna `font-style: italic`; el render no cambia porque ya usaba exactamente esos pesos.
2. **Token sin uso (D8).** Eliminar `--breakpoint-xs: 26rem` de `@theme` en `app/globals.css`. Ningún componente usa `xs:`.
3. **README (D2, D9, D4).** Reemplazar la sección "First push" por el estado real (repo existente, remote HTTPS, flujo de commit por spec); completar "Structure" con `eslint.config.mjs`, `.prettierrc`, `vitest.*`, `content/local.test.ts`, `docs/`, `scripts/`; corregir "GROQ queries are already written in `sanity/`" a "documented in `sanity/README.md`" hasta que 006 cree el módulo. Solo texto de documentación, no copy del sitio.

No entra:

- `logo-primario.png` sin uso (D7): se decide en 007.
- Cualquier cambio de escala, color, espaciado o copy visible.
- El tipo `Insight` (D10): 010.

## Criterios de aceptación

1. DADO la home servida, CUANDO se extraen las reglas `@font-face` del CSS de `app/layout`, ENTONCES todas las de `Newsreader` tienen `font-weight: 300` y `font-style: normal`, y todas las de `Instrument Sans` tienen `font-weight` en {400, 500} (o el rango `400 500`) y `font-style: normal`. Cero reglas con `italic`.
2. DADO la home en 1440, CUANDO se lee `getComputedStyle(h1)`, ENTONCES `font-family` empieza por `Newsreader` y `font-weight` es `300`; DADO `body`, ENTONCES `Instrument Sans` y `400`; DADO un `.eyebrow`, ENTONCES `500`.
3. DADO el HTML servido, CUANDO se cuentan los `<link rel="preload" as="font">`, ENTONCES ninguno apunta a un archivo de itálica (verificable comparando con el listado de `.next/static/media` y la salida del criterio 1).
4. DADO `app/globals.css`, CUANDO se ejecuta `grep -c "breakpoint-xs"`, ENTONCES 0; y `grep -rn "xs:" components app` devuelve 0 líneas.
5. DADO `README.md`, CUANDO se lee, ENTONCES no contiene `cd web` ni `git init`, y la sección "Structure" lista los archivos de tooling y `docs/`.
6. DADO 003 aprobada, CUANDO se ejecuta `npm run audit:responsive`, ENTONCES 27/27 CUMPLE (el cambio de fuentes no altera métricas).
7. DADO `npm run build`, ENTONCES exit 0 sin warnings (001 se mantiene).

## Verificación

```bash
npm run build && (npm run start & sleep 3)
CSS=$(curl -s http://localhost:3000/ | grep -oE '/_next/static/css/[^"]+' | head -1)
curl -s "http://localhost:3000$CSS" | tr '\n' ' ' | grep -oE "@font-face *\{[^}]*\}" | grep -oE "font-family:[^;]+;|font-style:[^;]+;|font-weight:[^;]+;" | paste - - - | sort | uniq -c
curl -s http://localhost:3000/ | grep -oE '<link[^>]*as="font"[^>]*>'
grep -c "breakpoint-xs" app/globals.css; grep -rn "xs:" components app | wc -l
grep -nE "cd web|git init" README.md | wc -l
npm run audit:responsive
kill %1
```

Viewports: 1440 (criterio 2); 390/834/1440 vía 003.

## Archivos afectados

- `app/layout.tsx`
- `app/globals.css`
- `README.md`

## Hallazgos

(vacío)
