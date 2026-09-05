# 006 — Integración Sanity

Estado: verificada (8/8; el criterio 7 se cerró con 015 el 2026-09-05)
Depende de: [000, 001, 002, 010]
Bloqueada por dueño: parcial (para verificar en vivo se necesitan `NEXT_PUBLIC_SANITY_PROJECT_ID`, dataset y token de lectura de un proyecto Sanity creado por el dueño; la rama `local` y la compilación se verifican sin ellos)

## Por qué

`lib/content.ts` es el único seam con el CMS y hoy sus ramas `source === "sanity"` lanzan
excepción. `sanity/README.md` fija el contrato; esta spec lo implementa sin que ningún
componente cambie.

## Alcance

Respeta 000. Autoriza `@sanity/client` como única dependencia de runtime adicional (C4). Originalmente `next-sanity`; enmendado por el dueño el 2026-09-05 (Hallazgo H1).

Entra:

- Crear `sanity/queries.ts` exportando `TRANSACTIONS_QUERY`, `INSIGHTS_QUERY` (las del README de sanity, literales) y `INSIGHT_BY_SLUG_QUERY` (para 010: `*[_type == "insight" && slug.current == $slug && !hidden][0]{…}`), cerrando D4.
- Crear `lib/sanity-client.ts` con cliente `@sanity/client` en **inicialización perezosa** (una función `getClient()` que crea el cliente la primera vez; nunca en el nivel de módulo, para que `next build` no falle sin variables de entorno).
- Implementar en `lib/content.ts` las ramas `sanity` de `getTransactions()`, `getInsights()` y `getInsight(slug)` (esta última creada por 010) con `client.fetch(QUERY, params, { next: { revalidate: 300 } })`. Los tipos de retorno no cambian; el mapeo `year: number → string` lo hace la GROQ con `string(year)`, como ya está escrito.
- `sanity/schemas/types.ts` se conserva: ni `next-sanity` ni `@sanity/client` reexportan el tipo `Rule` del Studio, y `sanity` (el paquete del Studio) **no** se instala (Hallazgo H2). Se actualiza su comentario de cabecera para que deje de anunciar un borrado.
- Fallo controlado: si `CONTENT_SOURCE=sanity` y faltan variables, `getClient()` lanza un `Error` con mensaje que nombra la variable ausente.
- `.env.example` sin cambios (ya lista las variables).

No entra:

- Sanity Studio, `sanity.config.ts`, rutas `/studio`.
- Cambios en componentes, tipos de `lib/types.ts` (010 los extiende) ni en `content/local.ts`.
- Imágenes desde `cdn.sanity.io` (el `remotePatterns` ya existe; no se usa todavía).

## Criterios de aceptación

1. DADO `package.json`, CUANDO se lee `dependencies`, ENTONCES es exactamente `@sanity/client`, `next`, `react`, `react-dom`.
2. DADO el repo sin `.env.local`, CUANDO se ejecuta `CONTENT_SOURCE=local npm run build`, ENTONCES exit 0 (el cliente perezoso no se instancia).
3. DADO el repo sin `.env.local`, CUANDO se ejecuta `npx tsc --noEmit`, ENTONCES exit 0.
4. DADO `CONTENT_SOURCE=local`, CUANDO se ejecuta `npx vitest run`, ENTONCES los tests de `content/local.test.ts` siguen pasando y `getTransactions()` devuelve las 6 filas locales.
5. DADO `CONTENT_SOURCE=sanity` sin `NEXT_PUBLIC_SANITY_PROJECT_ID`, CUANDO se llama `getTransactions()` en un test, ENTONCES rechaza con un `Error` cuyo mensaje contiene `NEXT_PUBLIC_SANITY_PROJECT_ID`.
6. DADO `git diff` de esta spec, CUANDO se listan los archivos, ENTONCES ningún archivo de `components/` ni `app/` aparece.
7. _(bloqueado por dueño)_ DADO un proyecto Sanity con al menos una transacción y un insight publicados y `.env.local` relleno, CUANDO se ejecuta `CONTENT_SOURCE=sanity npm run build && npm run start`, ENTONCES la home renderiza esas filas y `npm run audit:responsive` (003) da 27/27.
8. DADO `sanity/queries.ts`, CUANDO se compara con `sanity/README.md`, ENTONCES `TRANSACTIONS_QUERY` e `INSIGHTS_QUERY` son idénticas carácter a carácter.

## Verificación

```bash
node -e 'console.log(Object.keys(require("./package.json").dependencies))'
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

- `package.json`, `package-lock.json` (`@sanity/client`)
- `sanity/queries.ts` (nuevo)
- `lib/sanity-client.ts` (nuevo)
- `lib/content.ts`
- `lib/content.test.ts` (nuevo; criterios 4 y 5)
- `sanity/schemas/types.ts` (solo el comentario de cabecera)
- `content/local.test.ts` (fija `CONTENT_SOURCE=local` por test para que la suite completa pase bajo `CONTENT_SOURCE=sanity`)
- `sanity/README.md` (actualizar "Wiring it up" al estado implementado)
- `docs/specs/000-constitution.md` (tabla C4: `@sanity/client` sustituye a `next-sanity`)

## Hallazgos

- **H1 — `next-sanity` no se puede instalar en este proyecto.** Toda versión compatible con Next 15 (9.x–11.x) declara como peer dependencies `sanity` (el Studio completo) y `styled-components`; npm 7+ los instala automáticamente y `sanity@5` exige React 19.2.2 (el proyecto fija 19.1.1), así que `npm install next-sanity` falla con ERESOLVE. Medido en scratch: con `--legacy-peer-deps` instala 81 paquetes, añade 5 vulnerabilidades (1 alta) en código que el sitio no usa y `npm ci` falla en CI sin un `.npmrc`. `@sanity/client@8.5.0` instala 26 paquetes, 0 vulnerabilidades nuevas, `npm ci` limpio, y es el mismo `createClient` que `next-sanity` reexporta; `fetch(query, params, { next: { revalidate } })` es API nativa del cliente. **El dueño aprobó la sustitución el 2026-09-05**; C4 actualizado.
- **H2 — El tipo `Rule` no se resuelve sin el Studio.** Ni `next-sanity` ni `@sanity/client` lo reexportan. `sanity/schemas/types.ts` se conserva con el comentario actualizado. Se elimina el criterio "types.ts no existe".
- **H3 — `INSIGHTS_QUERY` del README no cubría el tipo `Insight` de 010.** Faltaban `publishedAt` y `body`, que `/insights/[slug]` renderiza. Se añaden a la consulta en README y `queries.ts` a la vez (criterio 8 se mantiene: idénticas, verificado por test). `body` se aplana con `pt::text(@)` por bloque a `string[]`, el tipo actual; `dek` no existe en el esquema y sigue opcional.
- **H4 — `CONTENT_SOURCE` se leía una vez a nivel de módulo.** Impedía probar ambas ramas en la misma suite y hacía fallar `CONTENT_SOURCE=sanity npx vitest run` en los tests locales. Ahora se lee por llamada; `content/local.test.ts` fija `local` por test con `vi.stubEnv`.
- **H5 — Criterio 7 bloqueado por contenido, no por credenciales.** Con `.env.local` del proyecto `7sbvxr17` (dataset `production`, token Viewer): las tres consultas se ejecutan sin error contra la API (`[]`, `[]`, `null`; `count(*[_type in ["transaction","insight"]])` = 0) y `CONTENT_SOURCE=sanity npm run build` pasa (10 páginas, `/insights` con revalidate 5m). Para ver filas reales hace falta un Studio o una carga por API con token de escritura, ambos fuera de 006. Evidencia a re-verificar cuando 011 cargue contenido.
- **Nota (sin cambio):** el filtro `!hidden` del contrato excluye documentos donde `hidden` sea `null` (creados por API sin el campo). El esquema fija `initialValue: false`, así que desde el Studio no ocurre; si 011 carga por API debe enviar `hidden: false`.

## Evidencia (2026-09-05)

| Criterio | Resultado                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------- |
| 1        | `dependencies` = `@sanity/client`, `next`, `react`, `react-dom`                                         |
| 2        | Sin `.env.local`, `CONTENT_SOURCE=local npm run build`: compiled successfully, 13/13 páginas            |
| 3        | `npx tsc --noEmit` exit 0                                                                               |
| 4        | `CONTENT_SOURCE=local npx vitest run`: 13/13; `content/local.test.ts` intacto en aserciones             |
| 5        | `CONTENT_SOURCE=sanity npx vitest run`: 13/13; 4 tests de fallo controlado nombran la variable ausente  |
| 6        | 0 archivos de `components/` o `app/` en el diff                                                         |
| 7        | Parcial: API y build en modo `sanity` verificados con credenciales reales; filas reales pendientes (H5) |
| 8        | Test compara `queries.ts` con `sanity/README.md` carácter a carácter: pasa                              |
