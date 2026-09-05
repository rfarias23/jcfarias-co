# 009 — Deploy en Vercel

Estado: borrador
Depende de: [000, 001, 002, 005, 007, 012]
Bloqueada por dueño: sí (acceso a la cuenta Vercel y a la zona DNS de GoDaddy de `jcfarias.com`; **producción bloqueada hasta que 011 cargue el historial real de transacciones**)

## Por qué

El sitio no está desplegado. Vercel con preset Next.js no necesita configuración; lo que
necesita decisión es la variable `CONTENT_SOURCE`, los previews por PR y el dominio,
registrado en GoDaddy (handover 2026-09-03, D1).

## Alcance

Respeta 000.

Entra:
- Proyecto Vercel enlazado a `rfarias23/jcfarias-co`, framework preset Next.js, sin build command ni output override.
- Variables de entorno: `CONTENT_SOURCE=local` en Production, Preview y Development. Las de Sanity vacías hasta que 006 se verifique en vivo.
- Preview deploy automático por PR (comportamiento por defecto de la integración GitHub). Production deploy desde `main`.
- Dominio: `jcfarias.com` (apex) y `www.jcfarias.com` con redirección `www → apex`. En GoDaddy: **editar** el registro `A` existente de `@` a `76.76.21.21` (GoDaddy no admite CNAME en apex; no añadir un segundo `A`), `CNAME www → cname.vercel-dns.com`, borrar cualquier regla de "Domain Forwarding", no tocar `NS`, `SOA` ni `MX`. Los valores que imprima Vercel prevalecen sobre estos.
- `.vercel/` ya está en `.gitignore`.
- Bar de producción: **no se promueve a producción con el dominio** mientras `content/local.ts` tenga las 6 filas `PENDING`. Previews sí.

No entra:
- Analytics de Vercel, Speed Insights, Edge Config.
- Cambiar `site.url` (ya es `https://jcfarias.com`).
- Nameservers a Vercel (alternativa; solo si el dueño lo pide).

## Criterios de aceptación

1. DADO un push a una rama con PR abierto, CUANDO Vercel construye, ENTONCES el check "Vercel — Preview" en GitHub pasa y la URL `*.vercel.app` responde 200.
2. DADO el preview, CUANDO se ejecuta `npm run audit:responsive` con `URL=<preview>`, ENTONCES 27/27.
3. DADO el preview, CUANDO se piden `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, ENTONCES 200, 200, 200 (007) y `/no-existe` responde 404.
4. DADO Vercel → Settings → Environment Variables, ENTONCES `CONTENT_SOURCE=local` existe en los tres entornos.
5. *(bloqueado por 011)* DADO el deploy de producción, CUANDO se ejecuta `dig +short jcfarias.com`, ENTONCES `76.76.21.21` y solo esa IP; `dig +short www.jcfarias.com` devuelve una cadena que termina en `vercel-dns.com`.
6. *(bloqueado por 011)* DADO producción, CUANDO se ejecuta `curl -sI https://www.jcfarias.com`, ENTONCES `30x` con `location: https://jcfarias.com/`; `curl -sI https://jcfarias.com` responde 200 con certificado válido.
7. *(bloqueado por 011)* DADO producción, CUANDO se pega la URL en el compositor de LinkedIn (sin publicar), ENTONCES la tarjeta muestra la imagen OG de 007.
8. DADO producción, CUANDO se lee `content/local.ts` en el commit desplegado, ENTONCES no contiene `PENDING`.

## Verificación

```bash
gh pr checks <n>                                  # criterio 1
URL=https://<preview>.vercel.app npm run audit:responsive
for p in robots.txt sitemap.xml opengraph-image no-existe; do curl -s -o /dev/null -w "$p %{http_code}\n" https://<preview>.vercel.app/$p; done
vercel env ls                                      # o panel
dig +short jcfarias.com; dig +short www.jcfarias.com
curl -sI https://www.jcfarias.com | head -5; curl -sI https://jcfarias.com | head -3
git show <sha-desplegado>:content/local.ts | grep -c PENDING   # esperado 0
```

Viewports: 390/834/1440 vía 003 contra la URL de preview.

## Archivos afectados

- Ninguno en el repositorio. Configuración externa (Vercel, GoDaddy). `docs/STATUS.md` registra URLs y fecha.

## Hallazgos

(vacío)
