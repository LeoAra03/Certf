# Como seguir mejorando la app (sin depender de un solo servicio)

La app es 100 por ciento tuya (repo LeoAra03/Certf, open source). Todo el ciclo de mejora
funciona sin computadora de escritorio y sin atarse a una sola plataforma de IA:

## La pieza central: la pestaña "Auto-mejora" (dentro de la APK)

La APK trae embebido el backlog de 1000 mejoras priorizadas (docs/1000-mejoras.json).
En la pestaña **Auto-mejora** tienes:

1. **Progreso**: total, hechas, P0/P1 pendientes (guardado solo en tu telefono).
2. **Siguientes sugerencias**: las 3 mejoras que mas mueven el objetivo, con prioridad,
   esfuerzo e impacto.
3. **"Copiar prompt"**: arma el prompt completo (mejora + requisitos duros del proyecto:
   0 emojis, mobile-first, tests en verde, sincronizar data.json/mejoras.js).
4. **"Preguntarle a la IA" (opcional)**: si tienes tu propia clave API (cualquier API
   compatible con OpenAI), la app pide las proximas 3 mejoras segun tu estado.
   La clave se guarda solo en el telefono y la salida es directa a ese endpoint:
   no pasa por servidores de Certf.

## Tres formas de ejecutar las mejoras (elige la que quieras, puedes mezclar)

### 1. Con cualquier asistente IA (Arena, ChatGPT, Claude, Cursor)
- En la APK: pestaña Auto-mejora, pulsa "Copiar prompt" en la mejora que quieras.
- Pegalo en el asistente que tengas a mano (desde el navegador del telefono o de escritorio).
- El asistente edita el repo, deja los tests en verde y hace commit + push.
- Con el push, GitHub Actions recompila la APK solo: descargala desde la rama
  (dist/Certf-debug.apk) o del artifact certf-debug-apk (90 dias).

### 2. Con el codigo abierto directo (sin IA)
- Clona el repo en cualquier equipo con git.
- Implementa la mejora (los archivos importantes: web/index.html, web/app.js,
  web/data.js, web/styles.css, web/scanner.js).
- Corre: python3 tools/build_data.py, python3 tools/build_mj.py,
  node tools/smoke_test.js, node tools/scanner_test.js, python3 tools/crawler.py --selftest.
- Commitea y haz push. La APK se arma sola.

### 3. Desde el telefono sin asistente (cambios pequenos)
- En github.com, entra al repo, edita el archivo que quieras desde el navegador
  (por ejemplo un texto en web/data.js) y commitea directo.
- Sirve para textos, fechas y ajustes menores; para logica usa la opcion 1 o 2.

## Reglas que todo cambio debe respetar (van en cada prompt generado)

- 0 emojis en UI, textos y commits.
- Mobile-first, textos en espanol.
- Cero descuentos fantasmas: todo porcentaje con fuente y evidencia verificable.
- Si cambia web/data.js, regenerar web/data.json (tools/build_data.py).
- Si cambia docs/1000-mejoras.json, regenerar web/mejoras.js (tools/build_mj.py).
- Tests en verde: node tools/smoke_test.js y node tools/scanner_test.js.

## Nota sobre Arena

Arena no expone una API publica para llamarla desde dentro de la app; por eso la
pestaña Auto-mejora no "habla con Arena": lo que hace es generar el contexto exacto
para que Arena (o cualquier otro asistente) implemente la mejora en el repo. El
resultado es equivalente y no dependes de un unico proveedor.
