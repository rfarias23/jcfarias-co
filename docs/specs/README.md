# Specs

Fuente de verdad del trabajo pendiente. El código sigue a la spec, no al revés.

Ciclo de estados: `borrador` → `aprobada` (solo el dueño) → `implementada` → `verificada`
(solo si todos los criterios pasan con evidencia). Una spec en `borrador` no se ejecuta.

| Spec                                   | Título                             | Estado                                  |
| -------------------------------------- | ---------------------------------- | --------------------------------------- |
| [000](000-constitution.md)             | Constitución                       | aprobada                                |
| [001](001-build-limpio.md)             | Build limpio                       | verificada                              |
| [002](002-tooling.md)                  | Tooling: ESLint, Prettier y Vitest | verificada                              |
| [003](003-conformidad-responsiva.md)   | Conformidad responsiva             | aprobada                                |
| [004](004-conformidad-constitucion.md) | Conformidad de constitución        | aprobada                                |
| [005](005-git.md)                      | Git: regularizar y empujar         | aprobada                                |
| [006](006-integracion-sanity.md)       | Integración Sanity                 | borrador (espera credenciales Sanity)   |
| [007](007-seo-metadata.md)             | SEO y metadata                     | aprobada                                |
| [008](008-performance.md)              | Performance                        | aprobada                                |
| [009](009-deploy-vercel.md)            | Deploy Vercel                      | borrador (espera acceso Vercel/GoDaddy) |
| [010](010-rutas-insights.md)           | Rutas insights (estructura)        | aprobada                                |
| [011](011-contenido-real.md)           | Contenido real                     | borrador (bloqueada por dueño)          |
| [012](012-ci.md)                       | CI GitHub Actions                  | aprobada                                |
| [013](013-not-found.md)                | Página 404                         | aprobada                                |

Orden de ejecución y sesiones: [`../PLAN.md`](../PLAN.md). Línea base: [`../STATUS.md`](../STATUS.md).
