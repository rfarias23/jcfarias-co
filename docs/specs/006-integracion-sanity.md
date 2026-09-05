# 006 — Integración Sanity

Estado: borrador
Depende de: [000, 001, 002, 010]
Bloqueada por dueño: parcial (para verificar en vivo se necesitan `NEXT_PUBLIC_SANITY_PROJECT_ID`, dataset y token de lectura de un proyecto Sanity creado por el dueño; la rama `local` y la compilación se verifican sin ellos)

## Por qué

`lib/content.ts` es el único seam con el CMS y hoy sus ramas `source === "sanity"` lanzan
excepción. `sanity/README.md` fija el contrato; esta spec lo implementa sin que ningún
componente cambie.

## Alcance

Respeta 000. Autoriza `next-sanity` como única dependencia de runtime adicional (C4).

Entra:

- Crear `sanity/queries.ts` exportando `TRANSACTIONS_QUERY`, `INSIGHTS_QUERY` (las del README de sanity, literales) y `INSIGHT_BY_SLUG_QUERY` (para 010: `*[_type == "insight" && slug.current == $slug && !hidden][0]{…}`), cerrando D4.
- Crear `lib/sanity-client.ts` con cliente `next-sanity` en **inicialización perezosa** (una función `getClient()` que crea el cliente la primera vez; nunca en el nivel de módulo, para que `next build` no falle sin variables de entorno).
- Implementar en `lib/content.ts` las ramas `sanity` de `getTransactions()`, `getInsights()` y `getInsight(slug)` (esta última creada por 010) con `client.fetch(QUERY, params, { next: { revalidate: 300 } })`. Los tipos de retorno no cambian; el mapeo `year: number → string` lo hace la GROQ con `string(year)`, como ya está escrito.
- Borrar `sanity/schemas/types.ts` y cambiar `import type { Rule } from "./types"` por `import type { Rule } from "sanity"` en los dos esquemas. `sanity` (el paquete del Studio) **no** se instala: los esquemas se importan solo por tipo y `tsc` los resuelve vía `next-sanity`, que reexporta los tipos; si no los resuelve, se anota en Hallazgos y se pregunta antes de instalar nada.
- Fallo controlado: si `CONTENT_SOURCE=sanity` y faltan variables, `getClient()` lanza un `Error` con mensaje que nombra la variable ausente.
- `.env.example` sin cambios (ya lista las variables).

No entra:

- Sanity Studio, `sanity.config.ts`, rutas `/studio`.
- Cambios en componentes, tipos de `lib/types.ts` (010 los extiende) ni en `content/local.ts`.
- Imágenes desde `cdn.sanity.io` (el `remotePatterns` ya existe; no se usa todavía).

## Criterios de aceptación

1. DADO `package.json`, CUANDO se lee `dependencies`, ENTONCES es exactamente `next`, `next-sanity`, `react`, `react-dom`.
2. DADO el repo sin `.env.local`, CUANDO se ejecuta `CONTENT_SOURCE=local npm run build`, ENTONCES exit 0 (el cliente perezoso no se instancia).
3. DADO el repo sin `.env.local`, CUANDO se ejecuta `npx tsc --noEmit`, ENTONCES exit 0 y `sanity/schemas/types.ts` no existe.
4. DADO `CONTENT_SOURCE=local`, CUANDO se ejecuta `npx vitest run`, ENTONCES los tests de `content/local.test.ts` siguen pasando y `getTransactions()` devuelve las 6 filas locales.
5. DADO `CONTENT_SOURCE=sanity` sin `NEXT_PUBLIC_SANITY_PROJECT_ID`, CUANDO se llama `getTransactions()` en un test, ENTONCES rechaza con un `Error` cuyo mensaje contiene `NEXT_PUBLIC_SANITY_PROJECT_ID`.
6. DADO `git diff` de esta spec, CUANDO se listan los archivos, ENTONCES ningún archivo de `components/` ni `app/` aparece.
7. _(bloqueado por dueño)_ DADO un proyecto Sanity con al menos una transacción y un insight publicados y `.env.local` relleno, CUANDO se ejecuta `CONTENT_SOURCE=sanity npm run build && npm run start`, ENTONCES la home renderiza esas filas y `npm run audit:responsive` (003) da 27/27.
8. DADO `sanity/queries.ts`, CUANDO se compara con `sanity/README.md`, ENTONCES `TRANSACTIONS_QUERY` e `INSIGHTS_QUERY` son idénticas carácter a carácter.

## Verificación

```bash
node -e 'console.log(Object.keys(require("./package.json").dependencies))'
test ! -f sanity/schemas/types.ts && echo "types.ts borrado"
CONTENT_SOURCE=local npm run build; echo "exit=$?"
npx tsc --noEmit; echo "exit=$?"
CONTENT_SOURCE=local npx vitest run
CONTENT_SOURCE=sanity npx vitest run   # incluye el test del criterio 5 (añadido en lib/content.test.ts)
git diff --name-only HEAD~1 | grep -E "^(components|app)/" | wc -l   # esperado 0
# criterio 7, solo con credenciales:
CONTENT_SOURCE=sanity npm run build && (npm run start & sleep 3) && npm run audit:responsive; kill %1
```

Viewports: 390/834/1440 solo en criterio 7.

## Archivos afectados

- `package.json`, `package-lock.json` (`next-sanity`)
- `sanity/queries.ts` (nuevo)
- `lib/sanity-client.ts` (nuevo)
- `lib/content.ts`
- `lib/content.test.ts` (nuevo; criterios 4 y 5)
- `sanity/schemas/types.ts` (borrar)
- `sanity/schemas/transaction.ts`, `sanity/schemas/insight.ts` (solo la línea de import)
- `sanity/README.md` (actualizar "Wiring it up" al estado implementado)
- `docs/specs/000-constitution.md` (tabla C4: confirmar `next-sanity`)

## Hallazgos

(vacío)
