# 015 — Sincronización de contenido a Sanity por API

Estado: implementada (criterios 1–7 y 10 verificados el 2026-09-05; 8 y 9 esperan `SANITY_API_WRITE_TOKEN`)
Depende de: [000, 002, 006]
Bloqueada por dueño: parcial (los criterios 8 y 9 necesitan `SANITY_API_WRITE_TOKEN`, un token con permiso Editor creado por el dueño en el panel de Sanity; todo lo demás se verifica sin él)

## Por qué

006 dejó la rama `sanity` de `lib/content.ts` implementada y probada contra la API, pero el
dataset `production` tiene 0 documentos y la constitución excluye el Studio. Sin una forma de
poblar el dataset, el criterio 7 de 006 no se puede cerrar y el flip a `CONTENT_SOURCE=sanity`
nunca se ejercita de verdad. Esta spec convierte `content/local.ts` en la fuente de verdad y
la espeja en Sanity con un comando, hoy con placeholders y mañana con los datos de 011.

## Decisiones tomadas por el dueño (2026-09-05)

- **Fuente de verdad: `content/local.ts`.** El script lee los mismos arrays que renderiza el
  sitio. No se añaden cargadores de CSV ni de front matter; 011 sigue cargando a `local.ts`.
- **Espejo exacto.** Tras subir, el script borra en Sanity todo `transaction` e `insight` cuyo
  id no provenga de `local.ts`. El dataset queda idéntico al archivo en cada ejecución.
- **Supuesto declarado:** `production` espejará `local.ts` tal cual, placeholders incluidos,
  hasta que 011 cargue datos reales. El sitio sigue en `CONTENT_SOURCE=local`; nada de esto es
  público.

## Alcance

Respeta 000. **Sin dependencias nuevas**: usa `@sanity/client` (C4, autorizado por 006) y
Node 22 (`--env-file`, `--experimental-strip-types`), la versión que ya fija CI.

Entra:

- `lib/sanity-sync.ts` (lógica pura, sin I/O, probada con Vitest):
  - `transactionId(row)`: `transaction-<12 hex>` con SHA-1 de las cinco columnas unidas por
    `|`. Reordenar filas no cambia ids; dos filas idénticas producen el mismo id y
    `buildDocuments` lanza `Error` nombrándolas.
  - `insightId(note)`: `insight-<slug>`.
  - `toTransactionDocument(row)`: `{ _id, _type: "transaction", assetClass, market, scale, role, year: Number(year) }`.
  - `toInsightDocument(note)`: `{ _id, _type: "insight", title, slug: { _type: "slug", current }, category, number, year: Number(year), publishedAt, dek, hidden: false, body }` donde:
    - `publishedAt` se normaliza a datetime ISO: `"2026"` → `"2026-01-01T00:00:00.000Z"`,
      `"2026-03"` → `"2026-03-01T00:00:00.000Z"`, `"2026-03-14"` → `"2026-03-14T00:00:00.000Z"`,
      un datetime completo se deja igual.
    - `body: string[]` → bloques Portable Text
      `{ _type: "block", _key, style: "normal", markDefs: [], children: [{ _type: "span", _key, text, marks: [] }] }`
      con `_key` deterministas (`b<índice>` y `s<índice>`), para que dos ejecuciones produzcan
      documentos byte a byte iguales.
    - `hidden: false` siempre, porque el contrato de consultas filtra `!hidden` (006, nota).
    - `dek` se envía como string, vacío si no hay.
  - `buildDocuments(transactions, insights)`: array con todos los documentos; valida duplicados.
  - `planSync(localDocuments, remoteIds)`: `{ upsert: Document[], deleteIds: string[] }` donde
    `deleteIds` son los ids remotos de tipo `transaction` o `insight` ausentes en local.
- `scripts/sanity-sync.mts` (capa fina de I/O):
  - Importa `content/local.ts` y `lib/sanity-sync.ts`. Lee `NEXT_PUBLIC_SANITY_PROJECT_ID`,
    `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_WRITE_TOKEN`
    del entorno (inyectado por `--env-file=.env.local`); si falta una, sale con código 2
    nombrándola.
  - Consulta `*[_type in ["transaction","insight"]]._id` con el cliente (`useCdn: false`,
    `perspective: "raw"`), llama a `planSync` e imprime el plan: por cada documento
    `create`/`replace` (según exista el id remoto) y `delete`, más un resumen
    `N create · N replace · N delete`.
  - **Sin `--apply` no escribe nada** y sale con 0. Con `--apply`, ejecuta una única
    transacción `client.transaction()` con `createOrReplace` por documento y `delete` por id,
    hace `commit()`, e imprime el resumen final. Una transacción de Sanity es atómica: o entra
    todo o nada.
  - Nunca toca documentos de otros `_type`.
- `package.json`: script `"content:sync": "node --env-file=.env.local --experimental-strip-types scripts/sanity-sync.mts"`.
- `.env.example`: añadir `SANITY_API_WRITE_TOKEN=` con comentario "solo para `npm run content:sync`; permiso Editor; nunca en Vercel".
- `sanity/schemas/insight.ts`: añadir campo `dek` (`string`, descripción "One line, ≤ 160 characters, for metadata"). Justificación: 011 lo entrega y el tipo `Insight` (010) lo tiene; el esquema y las consultas no.
- `sanity/queries.ts` y `sanity/README.md`: añadir `dek` a la proyección de `INSIGHTS_QUERY` e
  `INSIGHT_BY_SLUG_QUERY`, en ambos archivos a la vez (el test de 006 exige identidad).
- `lib/sanity-sync.test.ts`: tests de todo lo anterior (ver criterios 1–5).
- Cerrar el criterio 7 de 006 (criterio 9 de esta spec) y pegar la evidencia en 006.

No entra:

- Studio, `sanity.config.ts`, rutas `/studio`.
- Cargadores de CSV o Markdown (011 carga a `local.ts`; esta spec sube lo que haya en `local.ts`).
- Cambios en `components/`, `app/`, `lib/content.ts` ni `lib/types.ts`.
- Ejecutar el script en CI: necesita el token de escritura y no debe existir en GitHub ni en Vercel.
- Imágenes en Sanity.

## Limitación conocida (no se resuelve aquí)

`TRANSACTIONS_QUERY` ordena por `year desc, _createdAt desc`. Dentro de un mismo año, el orden
en Sanity es el de creación del documento, no la posición en `local.ts`. Con `createOrReplace`
Sanity conserva `_createdAt` del documento original, así que el orden intra-año se fija en la
primera carga. Resolverlo requeriría un campo de orden en el esquema y en el contrato de
consultas; se deja para cuando 011 traiga datos reales y se vea si importa.

## Criterios de aceptación

1. DADO `lib/sanity-sync.test.ts`, CUANDO se ejecuta `npx vitest run`, ENTONCES `transactionId`
   devuelve el mismo id para la misma fila con distinto orden en el array, y distinto id si
   cambia cualquiera de las cinco columnas.
2. DADO dos filas de transacción idénticas, CUANDO se llama `buildDocuments`, ENTONCES lanza
   `Error` cuyo mensaje contiene `duplicate` y el `asset` de la fila.
3. DADO un insight con `publishedAt: "2026"` y `body: ["A", "B"]`, CUANDO se llama
   `toInsightDocument`, ENTONCES `publishedAt` es `"2026-01-01T00:00:00.000Z"`, `hidden` es
   `false`, `slug` es `{ _type: "slug", current: <slug> }`, `year` es `2026` (número) y `body`
   tiene dos bloques con `_key` `b0`/`b1` y spans `s0` con el texto.
4. DADO `planSync` con ids remotos `["transaction-x", "insight-old", "office-1"]` y documentos
   locales `[insight-new]`, ENTONCES `deleteIds` es `["transaction-x", "insight-old"]` (nunca
   `office-1`) y `upsert` contiene solo `insight-new`.
5. DADO las 6 transacciones y 3 insights de `content/local.ts`, CUANDO se llama
   `buildDocuments`, ENTONCES devuelve 9 documentos y llamarla dos veces da arrays
   `toEqual`-idénticos.
6. DADO `sanity/queries.ts`, CUANDO se ejecuta `npx vitest run`, ENTONCES el test de 006
   (identidad con README) sigue pasando y ambas consultas de insight proyectan `dek`.
7. DADO el repo, CUANDO se ejecuta `npx tsc --noEmit && npx eslint && npx prettier --check . && CONTENT_SOURCE=local npm run build`, ENTONCES exit 0 y `npm run lint` incluye `scripts/sanity-sync.mts` sin errores.
8. _(bloqueado por dueño)_ DADO `.env.local` con `SANITY_API_WRITE_TOKEN`, CUANDO se ejecuta
   `npm run content:sync` sin `--apply`, ENTONCES imprime `9 create · 0 replace · 0 delete` y
   `count(*[_type in ["transaction","insight"]])` sigue en 0. CUANDO se ejecuta con `--apply`,
   ENTONCES `count` es 9; una segunda ejecución con `--apply` imprime `0 create · 9 replace · 0 delete`
   y `count` sigue en 9; los ids son exactamente los que calcula `buildDocuments`.
9. _(bloqueado por dueño; cierra 006 criterio 7)_ DADO el dataset espejado, CUANDO se ejecuta
   `CONTENT_SOURCE=sanity npm run build && npm run start`, ENTONCES la home muestra las 6 filas
   de transacciones y los 3 insights con los mismos textos que en modo `local`, `/insights/[slug]`
   genera los 3 slugs, y `npm run audit:responsive` da 27/27. La evidencia se pega también en
   006 y su estado pasa a `verificada` sin salvedad.
10. DADO `git diff --name-only`, ENTONCES ningún archivo de `components/`, `app/`, `lib/content.ts`
    ni `lib/types.ts` aparece, y `.env.local` no está en el commit.

## Verificación

```bash
npx vitest run
npx tsc --noEmit; echo "exit=$?"
npx eslint; echo "exit=$?"
npx prettier --check .
CONTENT_SOURCE=local npm run build; echo "exit=$?"
git diff --name-only HEAD~1 | grep -E "^(components|app)/|^lib/(content|types)\.ts$" | wc -l   # esperado 0
# criterios 8 y 9, solo con token de escritura:
npm run content:sync                       # plan, no escribe
npm run content:sync -- --apply
npm run content:sync -- --apply            # idempotencia
CONTENT_SOURCE=sanity npm run build && (npm run start & sleep 3) && npm run audit:responsive; kill $(lsof -t -iTCP:3000 -sTCP:LISTEN)
```

Viewports: 390/834/1440 solo en el criterio 9.

## Archivos afectados

- `lib/sanity-sync.ts` (nuevo)
- `lib/sanity-sync.test.ts` (nuevo)
- `scripts/sanity-sync.mts` (nuevo)
- `package.json` (script `content:sync`; sin dependencias)
- `.env.example` (`SANITY_API_WRITE_TOKEN=`)
- `sanity/schemas/insight.ts` (campo `dek`)
- `sanity/queries.ts`, `sanity/README.md` (`dek` en las dos consultas de insight; sección "Loading content")
- `docs/specs/006-integracion-sanity.md` (evidencia del criterio 7 al cerrar el 9 de esta spec)
- `docs/specs/README.md`, `docs/PLAN.md`, `docs/STATUS.md §9`
- `tsconfig.json` (`allowImportingTsExtensions`, ver H1)

## Hallazgos

- **H1 — `tsconfig.json` fuera de la lista.** Node ejecuta el script sin bundler y exige extensiones explícitas (`../content/local.ts`); `tsc` solo las admite con `allowImportingTsExtensions: true`, que es legal porque `noEmit` ya está activo. Un solo flag, sin efecto en el build de Next (verificado: 13/13 páginas).
- **H2 — Las advertencias de Node se silencian en el comando.** `--disable-warning=ExperimentalWarning` y `--disable-warning=MODULE_TYPELESS_PACKAGE_JSON` en `content:sync`, para que la salida sea el plan y nada más. Se retiran cuando Node estabilice `strip-types`.
- **H3 — El genérico de `createOrReplace` se fija en la llamada.** Con la unión `SyncDocument`, TypeScript infería el primer miembro; `createOrReplace<Record<string, unknown>>(doc)` resuelve sin `any` ni cast.
- **H4 — Plan verificado en seco con el token de lectura.** Exportando el token Viewer como `SANITY_API_WRITE_TOKEN` solo en la línea de comandos, `npm run content:sync` sin `--apply` imprimió `9 create · 0 replace · 0 delete` con los 9 ids esperados y `exit 0`; sin ese token, `exit 2` nombrando `SANITY_API_WRITE_TOKEN`. La escritura (criterios 8 y 9) sigue esperando el token Editor.

## Evidencia (2026-09-05)

| Criterio | Resultado                                                                                             |
| -------- | ----------------------------------------------------------------------------------------------------- |
| 1–5      | `lib/sanity-sync.test.ts`: 19 tests, todos verdes (suite completa 35/35)                              |
| 6        | Test de identidad con README pasa; `INSIGHTS_QUERY` e `INSIGHT_BY_SLUG_QUERY` proyectan `dek`         |
| 7        | `tsc` exit 0; `eslint` limpio (incluye `scripts/sanity-sync.mts`); prettier limpio; build local 13/13 |
| 8        | Parcial (H4): plan en seco correcto; escritura pendiente de token                                     |
| 9        | Pendiente de 8                                                                                        |
| 10       | 0 archivos de `components/`, `app/`, `lib/content.ts`, `lib/types.ts`; `.env.local` ignorado          |
