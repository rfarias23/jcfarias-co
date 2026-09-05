# 000 — Constitución

Estado: aprobada
Depende de: []
Bloqueada por dueño: no — aprobada por el dueño 2026-09-05 sin `PROMPT-CLAUDE-CODE.md` (B7 cerrado: las fuentes son README.md y PROMPT-AUDIT-SPEC.md)

Toda spec posterior declara, en su primera línea de "Alcance", que respeta esta constitución.
Si una spec la contradice, la ejecución se detiene y se pregunta al dueño. Ninguna spec
puede modificar este documento; solo el dueño.

**Fuentes.** El spec de auditoría cita `PROMPT-CLAUDE-CODE.md` como origen de estas reglas.
Ese archivo no existe en el repositorio (STATUS.md §4-D1). Esta constitución se deriva de
`README.md` (diseño cerrado y aprobado) y de las "Reglas no negociables" de
`PROMPT-AUDIT-SPEC.md`. Si el dueño entrega `PROMPT-CLAUDE-CODE.md`, este documento se
revisa contra él antes de aprobar cualquier spec.

---

## C1. Tipografía

- Solo dos familias, cargadas con `next/font/google` en `app/layout.tsx`: **Newsreader** para display, **Instrument Sans** para UI y cuerpo.
- Pesos permitidos en render: Newsreader **300**; Instrument Sans **400** y **500**. Ningún otro peso, ninguna itálica, ninguna otra familia.
- Las escalas (`clamp()` de cada elemento), interlineados y tracking del código actual son el diseño aprobado. No se cambian.
- Las tres utilidades del sistema son `.shell`, `.eyebrow`, `.meta` (definidas en `app/globals.css`) y el ritmo de sección es `sectionPad` (`components/primitives.tsx`). No se crean variantes.

## C2. Color

- Exactamente ocho tokens, declarados una vez en `@theme` de `app/globals.css`: `ink #0E0E0E`, `paper #FFFFFF`, `body #3A3A3A`, `mute #6B6B6B`, `faint #8A8A8A`, `rule #E4E4E4`, `stone #F2F1EF`, `wash #FAFAF9`.
- Negro, blanco y cuatro grises. **No hay color de acento.** Añadir uno es decisión de marca del dueño, nunca de una spec.
- Ningún color hardcodeado fuera de los tokens, salvo las opacidades de blanco sobre `ink` ya presentes en `site-header.tsx` y `contact-footer.tsx`.

## C3. Copy y espaciado

- No se cambia ningún texto visible (hero, position, practice, about, footer, etiquetas, hints). Texto nuevo (404, metadata de páginas nuevas, alt) requiere aprobación explícita del dueño dentro de la spec que lo introduce.
- No se cambian paddings, gaps, alturas ni breakpoints. Breakpoints son los de Tailwind: `sm` 640, `md` 768, `lg` 1024.
- La tabla "Responsive behaviour" del README es contrato. STATUS.md §3 es la línea base; toda spec que toque un componente re-verifica las celdas afectadas.

## C4. Dependencias

- `dependencies` en `package.json`: **solo** `next`, `react`, `react-dom`. Nada más, nunca.
- `devDependencies` solo si una spec aprobada las autoriza por nombre. Registro de autorizaciones (se actualiza al aprobar cada spec):

| Paquete(s)                                                                                                              | Autorizado por             |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`                  | Base del proyecto (README) |
| `eslint`, `eslint-config-next`, `eslint-config-prettier`, `@eslint/eslintrc`, `prettier`                                | 002                        |
| `vitest`, `@vitejs/plugin-react`, `vite-tsconfig-paths`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` | 002                        |
| `playwright-core` (solo devDependency; usa el Chrome local, no descarga navegadores)                                    | 003                        |
| `next-sanity` (dependencia de runtime, única excepción a la línea anterior)                                             | 006                        |

- Cambiar la versión de `next`, `react` o `react-dom` es un cambio de dependencia y requiere spec.

## C5. Arquitectura

- Static-first: toda sección es un server component. **`components/site-header.tsx` es el único archivo con `"use client"`.** Ninguna spec puede añadir otro sin que el dueño lo apruebe como excepción nominal.
- `lib/content.ts` es el único punto de contacto con la fuente de contenido. Los componentes reciben datos por props; no importan `content/local.ts` directamente (excepción actual: `content/site.ts`, que es configuración, no contenido editorial).
- La prosa que es diseño (hero, position, about) vive en los componentes y **no** se lleva al CMS.
- Reglas editoriales del contenido: una transacción nunca nombra contraparte; `asset` es una clase, no un inmueble; `scale` es texto libre; `number` de un insight es etiqueta de display, no clave de orden.

## C6. Componentes con reglas propias

- **Transacciones:** cinco columnas en todo ancho. Nunca tarjetas, nunca columnas ocultas. Bajo `lg` el track `min-w-[860px]` hace scroll horizontal dentro de un bleed negativo con el hint "Scroll for the full record →".
- **Divisores de rejilla** (Practice, Insights, Stats): `gap-px` sobre contenedor `bg-rule`. Nunca bordes por celda.
- **Crédito CC BY-SA** del hero: permanece visible en todos los anchos mientras `soumaya-hero.jpg` esté en uso en cualquier lugar del sitio.
- **Touch targets** de 44 px mínimo en burger, cierre, enlaces del menú móvil y botón de mail.
- **`prefers-reduced-motion`** anula smooth scroll y transiciones.

## C7. Git y proceso

- Nunca `force push`. Nunca un commit sin spec asociada. Un commit por spec, mensaje `spec-NNN: <título>` en imperativo, sin emojis.
- Una spec solo se implementa en estado `aprobada`, tocando únicamente los archivos de su lista "Archivos afectados". Pasa a `implementada` al terminar y a `verificada` solo si todos los criterios pasan con evidencia pegada.
- Lo que una spec no contempla no se resuelve: se anota bajo `## Hallazgos` en la spec y se pregunta.
- Contenido real (transacciones, stats, teléfonos, fotografía) solo entra si lo entrega el dueño. Jamás se inventa un dato plausible.

## C8. Entorno de verificación

- Las verificaciones de toda spec se ejecutan en un checkout con `node_modules` en disco local, fuera de iCloud (STATUS.md §0, bloqueo B1). Una verificación que no termina por I/O no cuenta como fallo ni como éxito: se reporta como NO VERIFICABLE.
