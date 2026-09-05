# 004 — Conformidad de constitución

Estado: verificada
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

- 2026-09-05 — Primera pasada de verificación dio "Times 700" y el audit falló: un `next-server` de la verificación de 003 seguía escuchando en :3000 sirviendo el build anterior (`pkill -f "next start"` no mata el proceso hijo, que se llama `next-server`). Corregido matando por puerto (`kill $(lsof -t -iTCP:3000 -sTCP:LISTEN)`) y repitiendo. Las specs siguientes usan ese comando en lugar de `kill %1`.
- El CSS servido contiene la utilidad `.italic{font-style:italic}` aunque ningún componente la usa (grep vacío en `app/ components/ content/ lib/`). Tailwind v4 detecta la palabra en archivos Markdown de `docs/`. Es una regla inerte de 26 bytes; no hay itálica sintetizada. Se anota por si conviene restringir `@source` en el futuro (fuera de esta spec).
- Archivos de fuente en el build: 8 → 5 `.woff2`; preloads: 3 → 2. La instancia estática `wght@300` de Newsreader pesa 29.9 KB (latin) frente a los 64.5 KB de la variable.

## Evidencia de verificación (2026-09-05)

```
$ @font-face servidos (app/layout css)      Newsreader: font-weight 300, font-style normal (x3 subsets)
                                            Instrument Sans: 400 (x2), 500 (x1), font-style normal
                                            @font-face con "italic": 0                     criterio 1 PASA
$ getComputedStyle @1440                    h1: Newsreader 300 · body: Instrument Sans 400 · .eyebrow: Instrument Sans 500
                                            document.fonts loaded: Newsreader 300 normal | Instrument Sans 400 | 500   criterio 2 PASA
$ <link rel=preload as=font>                26d0ba92…-s.p.woff2, ebf12d54…-s.p.woff2 (2, ninguno itálico)   criterio 3 PASA
$ grep -c breakpoint-xs app/globals.css     0 · grep -rn "xs:" components app → 0            criterio 4 PASA
$ grep -cE "cd web|git init" README.md      0 · "Structure" lista tooling, scripts/ y docs/   criterio 5 PASA
$ npm run audit:responsive                  27/27 celdas CUMPLE · 12/12 checks                criterio 6 PASA
$ npm run build                             ✓ Compiled successfully, warn count 0            criterio 7 PASA
$ tsc / lint / format:check / vitest        ok / exit 0 / All matched / 2 passed
```
