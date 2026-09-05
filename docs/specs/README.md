# Specs

Fuente de verdad del trabajo pendiente. El código sigue a la spec, no al revés.

Ciclo de estados: `borrador` → `aprobada` (solo el dueño) → `implementada` → `verificada`
(solo si todos los criterios pasan con evidencia). Una spec en `borrador` no se ejecuta.

| Spec                                   | Título                             | Estado                               |
| -------------------------------------- | ---------------------------------- | ------------------------------------ |
| [000](000-constitution.md)             | Constitución                       | aprobada                             |
| [001](001-build-limpio.md)             | Build limpio                       | verificada                           |
| [002](002-tooling.md)                  | Tooling: ESLint, Prettier y Vitest | verificada                           |
| [003](003-conformidad-responsiva.md)   | Conformidad responsiva             | verificada                           |
| [004](004-conformidad-constitucion.md) | Conformidad de constitución        | verificada                           |
| [005](005-git.md)                      | Git: regularizar y empujar         | verificada                           |
| [006](006-integracion-sanity.md)       | Integración Sanity                 | verificada                           |
| [007](007-seo-metadata.md)             | SEO y metadata                     | verificada                           |
| [008](008-performance.md)              | Performance                        | verificada                           |
| [009](009-deploy-vercel.md)            | Deploy Vercel                      | implementada (1–4; dominio tras 011) |
| [010](010-rutas-insights.md)           | Rutas insights (estructura)        | verificada                           |
| [011](011-contenido-real.md)           | Contenido real                     | borrador (bloqueada por dueño)       |
| [012](012-ci.md)                       | CI GitHub Actions                  | verificada                           |
| [013](013-not-found.md)                | Página 404                         | verificada                           |
| [015](015-sincronizacion-sanity.md)    | Sincronización a Sanity por API    | verificada                           |

Orden de ejecución y sesiones: [`../PLAN.md`](../PLAN.md). Línea base: [`../STATUS.md`](../STATUS.md).
