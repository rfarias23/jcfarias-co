# Prompt para Claude Code — Auditoría + plan spec-driven

Abre Claude Code en la raíz del proyecto (`cd ~/Desktop/JCFarias`) y pega el bloque completo.

---

```
Este es el sitio corporativo de J.C. Farias & Co. (asesoría en real estate y
partnerships, Andes y Caribe). El diseño está cerrado y aprobado. Tu trabajo en
esta sesión NO es escribir features: es auditar el estado real del proyecto,
convertir lo que existe en especificaciones verificables y proponer un plan
para terminarlo. No toques código hasta la Fase 3, y ahí solo lo que yo apruebe.

Estás en ~/Desktop/JCFarias, raíz del proyecto (package.json, app/, components/,
content/, lib/, sanity/, public/). No hay monorepo ni subcarpeta contenedora.

══════════════════════════════════════════════════════════════════
FASE 1 — ANÁLISIS PROFUNDO (solo lectura, sin cambios)
══════════════════════════════════════════════════════════════════

1. Lee completos, en este orden: README.md, PROMPT-CLAUDE-CODE.md,
   sanity/README.md, app/globals.css, components/primitives.tsx, lib/types.ts,
   lib/content.ts, content/site.ts, content/local.ts. Luego cada archivo de
   app/ y components/ y sanity/schemas/.
2. Ejecuta y registra la salida literal de:
     ls -la; git status 2>&1; git log --oneline -5 2>&1
     test -d node_modules && echo "node_modules: sí" || echo "node_modules: no"
     cat package.json; cat tsconfig.json; cat next.config.ts; cat .gitignore
     ls public/images
3. Si node_modules no existe, corre `npm install` (esto es lo único permitido
   en Fase 1 que modifica disco). Después corre y registra:
     npx tsc --noEmit 2>&1 | head -80
     npm run build 2>&1 | tail -60
     npm run lint 2>&1 | tail -30   (si el script no existe, anótalo)
4. Levanta `npm run dev` y verifica en 390, 834 y 1440 px cada fila de la tabla
   "Responsive behaviour" del README. Para cada celda anota: CUMPLE /
   NO CUMPLE / NO VERIFICABLE, con evidencia (qué viste, qué clase lo produce).
5. Cruza README.md y PROMPT-CLAUDE-CODE.md contra el código: para cada
   afirmación del README ("site-header.tsx es el único cliente", "tabla
   min-w-[860px]", "gap-px sobre bg-rule", "next/font/google con Newsreader e
   Instrument Sans", "crédito CC BY-SA visible", "touch targets 44px",
   "prefers-reduced-motion", etc.) determina si el código la cumple.

Entregable de Fase 1 → escribe `docs/STATUS.md` con:
  - Inventario de archivos con estado: COMPLETO / PARCIAL / STUB / AUSENTE.
  - Salidas de tsc/build/lint sin editar.
  - Tabla de verificación responsiva (celda por celda).
  - Lista de discrepancias README ↔ código, ordenadas por severidad.
  - Lista de "Open items before launch" del README con su estado actual real.
  - Lo que NO puedes resolver solo (datos reales de transacciones, estadísticas
    18 · 4 · 40+ · USD 1.2B, teléfonos, fotografía propia, diseño de
    /insights/[slug]). Márcalo como BLOQUEADO POR EL DUEÑO.

Detente aquí y muéstrame docs/STATUS.md. Espera mi confirmación antes de
seguir.

══════════════════════════════════════════════════════════════════
FASE 2 — ESPECIFICACIONES (spec-driven development)
══════════════════════════════════════════════════════════════════

Regla: nada se implementa sin una spec aprobada; nada se cierra sin que la
spec tenga sus criterios de aceptación verificados. La spec es la fuente de
verdad, el código la sigue.

1. Crea `docs/specs/000-constitution.md` con las reglas no negociables que ya
   existen en PROMPT-CLAUDE-CODE.md (tipografía, paleta sin acento, cero deps
   fuera de Next/React, un solo client component, tabla de 5 columnas siempre,
   divisores gap-px, crédito CC BY-SA). Todo spec posterior debe declarar que
   la respeta. Si un spec la contradice, se detiene y se me pregunta.

2. Crea una spec por unidad de trabajo pendiente, con este formato exacto:

   # NNN — Título
   Estado: borrador | aprobada | implementada | verificada
   Depende de: [lista de specs]
   Bloqueada por dueño: sí/no (qué)

   ## Por qué
   Una o dos líneas. Qué problema resuelve.

   ## Alcance
   Qué entra. Qué explícitamente NO entra.

   ## Criterios de aceptación
   Lista numerada, cada uno verificable por comando, test o inspección en
   viewport concreto. Formato "DADO / CUANDO / ENTONCES". Nada de "se ve bien".

   ## Verificación
   Comandos exactos y viewports a revisar para marcar cada criterio.

   ## Archivos afectados
   Lista. Si un archivo no está en la lista, la spec no autoriza tocarlo.

   Specs que espero, como mínimo (ajusta según lo que encuentres en Fase 1):
     001 — Build limpio: tsc --noEmit, next build, sin warnings.
     002 — Tooling: ESLint (eslint-config-next) + Prettier, npm run lint pasa.
     003 — Conformidad responsiva: cada fila de la tabla del README como
           criterio; corrige solo las celdas NO CUMPLE de STATUS.md.
     004 — Conformidad de constitución: cada discrepancia README ↔ código.
     005 — Git: .gitignore correcto, init, primer push a
           git@github.com:rfarias23/jcfarias-co.git (main). Sin force push.
     006 — Integración Sanity: implementar ramas source==="sanity" de
           lib/content.ts según sanity/README.md; borrar sanity/schemas/types.ts;
           CONTENT_SOURCE=local sigue funcionando; ningún componente cambia.
     007 — SEO y metadata: sitemap.ts, robots.ts, opengraph-image con wordmark
           serif sobre #0E0E0E, metadata por página.
     008 — Performance: LCP < 2.5s, CLS < 0.05 en Lighthouse móvil y desktop;
           priority/sizes del hero; placeholder blur.
     009 — Deploy Vercel: preset Next.js, env CONTENT_SOURCE, preview por PR.
     010 — Rutas /insights e /insights/[slug]: SOLO estructura de rutas, data
           fetching y metadata. Markup BLOQUEADO hasta que exista diseño
           aprobado. La spec lo dice explícitamente.
     011 — Carga de contenido real: transacciones, stats, teléfonos, fotos.
           BLOQUEADA POR DUEÑO. Define el formato exacto en que debo
           entregarte los datos para que la carga sea mecánica.

3. Crea `docs/PLAN.md`: grafo de dependencias entre specs, orden de ejecución
   propuesto, agrupado en sesiones (una sesión = lo que cabe en un contexto
   sin perder coherencia; típicamente 1–3 specs). Para cada sesión: specs
   incluidas, resultado verificable al terminar, qué necesito yo aportar antes
   de empezarla.

Detente aquí. Muéstrame PLAN.md y el índice de specs. Yo apruebo, ajusto o
rechazo cada spec cambiando su Estado a "aprobada". No avances con ninguna en
borrador.

══════════════════════════════════════════════════════════════════
FASE 3 — EJECUCIÓN (solo specs aprobadas)
══════════════════════════════════════════════════════════════════

Por cada spec aprobada, en el orden de PLAN.md:
  a. Relee la spec y 000-constitution.md.
  b. Implementa tocando únicamente los archivos listados.
  c. Corre la sección Verificación completa y pega la evidencia.
  d. Cambia Estado a "implementada" y luego a "verificada" solo si todos los
     criterios pasan. Si uno falla, no lo marques: repórtalo.
  e. Un commit por spec: "spec-NNN: <título>". Mensaje en imperativo, sin
     emojis.
  f. Actualiza docs/STATUS.md.

Si durante la ejecución descubres algo que la spec no contempla, no lo
resuelvas: escribe una nota en la spec bajo "## Hallazgos" y pregúntame.

Reglas no negociables (aplican en las tres fases):
- No cambies tipografía, colores, escalas, espaciados ni copy. Si algo se ve
  mal, repórtalo y espera.
- Solo Newsreader (300) e Instrument Sans (400/500). Negro, blanco, cuatro
  grises. Sin acento.
- Cero dependencias fuera de Next y React, salvo las que una spec aprobada
  autorice explícitamente (next-sanity en 006, eslint/prettier en 002).
- site-header.tsx es el único "use client".
- La tabla de transacciones mantiene 5 columnas en todo ancho; nunca tarjetas.
- Divisores con gap-px sobre bg-rule.
- El crédito CC BY-SA del hero permanece visible mientras la foto esté en uso.
- Nunca force push. Nunca commits sin spec asociada.
```

---

## Qué esperar de vuelta

- **Sesión 1:** `docs/STATUS.md` — radiografía real del proyecto. Revísalo; ahí sabrás qué de lo "hecho" realmente funciona.
- **Sesión 2:** `docs/specs/*.md` + `docs/PLAN.md`. Aprueba cambiando `Estado: borrador` → `aprobada` en cada archivo.
- **Sesiones siguientes:** una o dos specs por sesión, cada una con su commit y evidencia.

## Lo que solo tú puedes resolver (spec 011)

Historial real de mandatos, estadísticas verificadas, teléfonos, fotografía propia de proyectos, y el diseño de `/insights/[slug]` (se diseña aquí antes de que Claude Code lo escriba).
