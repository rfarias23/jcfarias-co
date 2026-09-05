# 001 — Build limpio

Estado: aprobada
Depende de: [000]
Bloqueada por dueño: no — resuelto 2026-09-05: proyecto movido a `~/dev/JCFarias` (B1); upgrade de `next` autorizado (B9), objetivo 15.5.25

## Por qué

Ninguna spec puede marcarse "verificada" sin `tsc` y `next build` limpios en un entorno
reproducible. Hoy ambos pasan en el espejo (STATUS.md §2) pero no se han podido correr en
sitio, y `npm ci` advierte una vulnerabilidad en `next@15.5.2`.

## Alcance

Respeta 000.

Entra:

- Establecer el entorno de verificación: checkout en disco local no sincronizado, `node_modules` reinstalado con `npm ci`.
- Confirmar que `npx tsc --noEmit` y `npm run build` pasan con cero errores y cero warnings en ese entorno.
- **Condicional a aprobación del dueño (B9):** subir `next` (y con él `eslint-config-next`) a la última versión parcheada de la línea 15.5.x que resuelva CVE-2025-66478. Sin cambio de major ni de minor. Si el dueño rechaza, el criterio 4 se elimina de esta spec antes de aprobarla y el aviso se documenta en STATUS.md como aceptado.

No entra:

- Lint, Prettier ni tests (002).
- Cualquier cambio en componentes, estilos o contenido.
- Subir `react`/`react-dom`.

## Criterios de aceptación

1. DADO el proyecto en un directorio no sincronizado con iCloud, CUANDO se ejecuta `find node_modules -type f -flags +dataless | head -1`, ENTONCES la salida está vacía.
2. DADO ese entorno, CUANDO se ejecuta `npx tsc --noEmit`, ENTONCES termina en menos de 60 s con exit 0 y sin salida.
3. DADO ese entorno, CUANDO se ejecuta `npm run build`, ENTONCES termina con exit 0, la salida contiene `✓ Compiled successfully` y no contiene las cadenas `warn`, `Warning` ni `⚠`.
4. _(solo si B9 aprobado)_ DADO `package.json` tras el upgrade, CUANDO se ejecuta `npm ls next` y `npm ci`, ENTONCES `next` es una versión 15.5.x ≥ la parcheada y la salida de `npm ci` no contiene `CVE-2025-66478`.
5. DADO el build anterior, CUANDO se ejecuta `npm run start` y `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/`, ENTONCES responde `200`.
6. DADO la home servida por `npm run start`, CUANDO se ejecuta el script de verificación responsiva de 003 (o, si 003 no está aprobada, la inspección manual de STATUS.md §3 en 390/834/1440), ENTONCES las 27 celdas siguen en CUMPLE (protege el criterio 4).

## Verificación

```bash
pwd                                  # fuera de ~/Desktop y de ~/Documents
find node_modules -type f -flags +dataless | head -1
time npx tsc --noEmit; echo "exit=$?"
npm run build 2>&1 | tee /tmp/build.log; grep -ciE "warn|⚠" /tmp/build.log   # esperado 0
npm ls next
npm run start & sleep 3; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/; kill %1
```

Viewports: 390, 834, 1440 (solo si se aplica el criterio 4).

## Archivos afectados

- `package.json` (solo si B9 aprobado: versión de `next` y `eslint-config-next`)
- `package-lock.json` (ídem)
- `docs/STATUS.md` (registro de resultado y, si B9 rechazado, aceptación del aviso)

## Hallazgos

(vacío)
