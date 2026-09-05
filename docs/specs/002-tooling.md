# 002 — Tooling: ESLint, Prettier y Vitest

Estado: verificada
Depende de: [000, 001]
Bloqueada por dueño: no

## Por qué

ESLint, Prettier y el harness de Vitest ya existen en el working tree pero no están
autorizados por ninguna spec ni committeados, y `prettier --check` falla. Esta spec los
regulariza para que `npm run lint`, `npm run format:check` y `npm run test:run` sean puertas
fiables para todas las specs siguientes.

## Alcance

Respeta 000.

Entra:

- Autorizar como devDependencies (registro C4 de 000): `eslint`, `eslint-config-next`, `eslint-config-prettier`, `@eslint/eslintrc`, `prettier`, `vitest`, `@vitejs/plugin-react`, `vite-tsconfig-paths`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`. Todas ya están en `package.json`; no se añade ninguna otra.
- Corregir el formato de `vitest.setup.ts` con Prettier (una línea; sin cambio semántico).
- Añadir `docs/HANDOVER-2026-09-03.md` y `.superpowers/` a `.prettierignore` (son documentos históricos; no se reformatean).
- Mantener `"lint": "eslint"`: STATUS.md §2 demostró que lintea los mismos 28 archivos que `eslint .`.
- Los archivos del harness (`vitest.config.mts`, `vitest.setup.ts`, `content/local.test.ts`, cambios en `tsconfig.json` y `package.json`) se committean bajo esta spec.

No entra:

- Nuevas reglas de ESLint, nuevos tests, cambios en `eslint.config.mjs` o `.prettierrc`.
- CI (012).

## Criterios de aceptación

1. DADO el repo, CUANDO se ejecuta `npm run lint`, ENTONCES exit 0 sin salida de errores ni warnings.
2. DADO el repo, CUANDO se ejecuta `npx eslint --debug 2>&1 | grep -c "Linting code for"`, ENTONCES el número es ≥ 28 (el script bare no lintea cero archivos).
3. DADO el repo, CUANDO se ejecuta `npm run format:check`, ENTONCES exit 0 y "All matched files use Prettier code style!".
4. DADO el repo, CUANDO se ejecuta `npx vitest run`, ENTONCES `Tests 2 passed (2)` y exit 0.
5. DADO `git diff spec-001..HEAD -- vitest.setup.ts`, CUANDO se inspecciona, ENTONCES solo cambia el salto de línea en el mock de `next/image` (mismo AST).
6. DADO `package.json`, CUANDO se lee `dependencies`, ENTONCES contiene exactamente `next`, `react`, `react-dom`.
7. DADO `docs/specs/000-constitution.md`, CUANDO se lee la tabla C4, ENTONCES cada devDependency de `package.json` aparece con "Base" o "002" como autorización.

## Verificación

```bash
npm run lint; echo "exit=$?"
npx eslint --debug 2>&1 | grep -c "Linting code for"
npm run format:check; echo "exit=$?"
npx vitest run
node -e 'console.log(Object.keys(require("./package.json").dependencies))'
git diff HEAD~1 -- vitest.setup.ts
```

Sin viewports.

## Archivos afectados

- `vitest.setup.ts` (formato)
- `.prettierignore`
- `package.json`, `package-lock.json`, `tsconfig.json`, `vitest.config.mts`, `content/local.test.ts` (ya modificados en el working tree; esta spec los committea sin cambios adicionales)
- `docs/specs/000-constitution.md` (solo la tabla C4, ya redactada; se confirma)

## Hallazgos

- 2026-09-05 — `format:check` fallaba en 17 archivos de `docs/` (STATUS, PLAN, specs) escritos en Fase 1/2 sin pasar por Prettier. No estaban en "Archivos afectados". Decisión tomada: formatearlos con `prettier --write` (solo espaciado y alineación de tablas Markdown; sin cambio de contenido) porque son documentos de esta misma auditoría, no código ni copy. Alternativa descartada: ignorar `docs/` en Prettier, que dejaría los specs futuros sin puerta de formato. Si el dueño prefiere lo contrario, se revierte en un commit propio.

## Evidencia de verificación (2026-09-05)

```
$ npm run lint                                   exit=0 (sin salida)
$ npx eslint --debug | grep -c "Linting code for"  28
$ npm run format:check                           All matched files use Prettier code style!  exit=0
$ npx vitest run                                 Test Files 1 passed (1) · Tests 2 passed (2)  exit=0
$ dependencies                                   [ 'next', 'react', 'react-dom' ]
$ vitest.setup.ts                                único cambio: mock de next/image en una línea
```

Criterios 1–7: PASAN.
