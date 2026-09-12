# Certf

App para encontrar, seguir y no perder **certificaciones, badges y credenciales con peso real en el CV** (gratis, becadas o con descuento verificable), en **español e inglés**. Diseñada para llevar a una persona **de cero experiencia a perfil profesional**: cada ruta trae varias opciones gratuitas o verificables por fase, y todo lo que se muestra lleva su evidencia y su forma de verificarlo.

Dos formatos con **una sola base de código** (la PWA de `web/`):

| Formato | Estado | Cómo usarlo |
|---|---|---|
| **PWA / app web** | funcionando | Se abre en el navegador y se instala en Android con *"Añadir a pantalla de inicio"* (o en escritorio con el botón **Instalar**). Funciona offline. |
| **APK Android** | compilada en GitHub Actions | El workflow **Build Android APK** compila el `.apk` (debug) en cada push, lo sube como artefacto y —cuando el build es de `main`— lo deja en `dist/Certf-debug.apk` dentro del repo para descargarlo directo. |

## Botón "Buscar páginas" (tiempo real, sin límite)

Un botón en la cabecera —**Buscar páginas**— y otro gigante en la pestaña *Buscar páginas* —**Buscar páginas y actualizar ahora**— que revisa **las páginas en vivo cuando tú quieras**, sin esperar al rastreo diario:

- **Te dice al tiro el descuento**: cada hallazgo sale con su sello **100% GRATIS**, **50% DESCUENTO**, **otro %** o **BECA / AYUDA** (y el monto de la beca cuando la página lo publica).
- **Detecta códigos**: extrae los tokens tipo `AIF2CLOUD`, `CLF2FREE`, `COMPSEC-4417` y los muestra en grande, **listos para copiar con un toque**.
- **Marca los de un solo uso**: si la frase dice *single-use*, *unique code*, *non-transferable*, *first 50 redemptions*, *código de único uso*, *hasta agotar stock*… aparece el sello **CÓDIGO DE UN SOLO USO** (son los que hay que canjear primero).
- **Categorización ordenada por urgencia**: los resultados se agrupan siempre en el mismo orden: 1. Códigos de un solo uso · 2. 100% gratis · 3. 50% de descuento · 4. Otro descuento · 5. Becas y ayuda financiera · 6. Badges y credenciales digitales · 7. Leaks y códigos de comunidad (fuente no oficial: confirmar) · 8. Resto.
- **Todo verificable, cero descuentos fantasmas**: cada hallazgo muestra su **evidencia** (la frase exacta de la página donde salió el porcentaje o el código) y su **verificación** (fuente oficial o "fuente no oficial: confirma en el checkout del proveedor"). Un porcentaje que no aparece en la página no se muestra.
- **Busca certificaciones, badges y cosas que suman al CV**: 46 fuentes repartidas en *oficiales*, *badges/insignias*, *en español* y (opcional) *comunidades + agregadores*, que es donde se publican los códigos sueltos (Reddit r/AWSCertifications, r/CompTIA, r/AzureCertification, Hacker News).
- **Descubre páginas nuevas**: *Descubrir páginas nuevas* busca en DuckDuckGo y Hacker News oportunidades que no estaban en la lista; cada resultado se puede **Revisar ahora** o **Vigilar**.
- **Vigila tus propias páginas**: pega cualquier URL y se suma a todas las búsquedas siguientes (se guarda en el teléfono).
- **Actualizable en cualquier momento**: no hay cronómetro ni límite diario; el botón se puede apretar las veces que quieras y cada resultado queda guardado con la hora ("última búsqueda: hace 3 min").

### Cómo trae las páginas

| Dónde corre | Transporte |
|---|---|
| **APK Android** | Puente nativo `CertfNative` (Kotlin + `HttpURLConnection`): descarga **sin CORS**, con reintentos y entrega en trozos. Es la vía más confiable. |
| **PWA en el navegador** | Cadena con respaldo: fetch directo, luego `r.jina.ai`, `allorigins`, `codetabs`, `corsfix`, `thingproxy`. Si un proxy está caído, sigue con el siguiente y te muestra cuál respondió. |

Todo el resultado se guarda en `localStorage`: la próxima apertura de la app sigue mostrando lo encontrado.

## Qué hace

1. **Catálogo** de **47 credenciales** de Google, Microsoft, AWS, IBM, Cisco, Meta, Oracle, Harvard, Stanford, MIT, Anthropic, Fortinet, Universidad de Helsinki, SENCE (Chile), Santander, Fundación Telefónica y HubSpot, ordenadas por *peso en el CV* (1-10), con filtros por **descuento (100% / 50% / otro / beca)**, tipo, área, **certificación o badge**, **idioma (español / inglés)**, búsqueda y orden (incluye "Descuento, 100% primero").
2. **Ruta 0 a PRO**: de cero experiencia a perfil profesional. Seis áreas (Cloud, Seguridad, IA, Datos, Desarrollo, Marketing y gestión), cada una con **4 fases encadenadas y varias opciones por fase** (cursos 100% gratis, badges, becas y descuentos, siempre con enlace y método de verificación). Cada paso se puede marcar con "Seguir" para tenerlo en *Mis certificaciones* y vigilar las fechas de vouchers por evento.
3. **Mis certificaciones**: seguimiento con estado (Pendiente / En curso / Obtenida), fecha objetivo y notas. Se guarda en el dispositivo (`localStorage`).
4. **Alertas**: días restantes de cada fecha crítica (código `AIF2CLOUD` de AWS, Microsoft Certification Week, Ignite, re:Invent, códigos ISC2…) y de tus propios plazos.
   - En la **web**: notificaciones mientras la app está abierta.
   - En la **app Android**: alarma diaria nativa (09:00) que avisa de todo lo que vence en los próximos 7 días, aunque la app esté cerrada.
5. **Guías**: cómo pedir la beca de Coursera/edX paso a paso, lista de *descartes* (cosas que ya no son gratis o no suman en el ATS) y **Descuentos fantasmas: cómo detectarlos** (reglas para no caer en códigos que no existen ni en la fuente).
6. **Búsqueda en vivo**: el botón de arriba, cuando tú lo aprietes, las veces que quieras.
7. **Rastreador diario**: un workflow de GitHub Actions (`Rastreador diario de certificaciones`) revisa **una vez al día, solo, las mismas 46 fuentes** buscando vouchers, descuentos, códigos y cambios:
   - Lo nuevo se publica con un **commit** en `web/novedades.js` y aparece en la pestaña **Buscar páginas** (sección *Rastreador automático*) con el sello "última revisión: hace X h". Pages se redespliega solo.
   - Si una página cambió **sin** señales claras (o una fuente que funcionaba empieza a fallar), abre/actualiza un **PR de revisión** (`crawler/reporte`) con el detalle, sin ensuciar el catálogo.
   - Lo ya visto queda memorizado en `data/crawler-state.json` para no repetir novedades. Las señales tienen tope (máx. 5 por fuente y día) y caducan a los 45 días.
   - La APK no se recompila por novedades (solo con cambios reales del catálogo).

> El botón en vivo, el robot diario y el asistente de `prompts/` usan **el mismo clasificador** (100% / 50% / otro % / beca, códigos, único uso, badges, idioma) y **la misma lista de fuentes**; hay una prueba automática que falla si las dos listas se desincronizan.

## Asistente LLM (prompt)

`prompts/cv-enhancement-tool-prompt.md` contiene el system prompt para que cualquier modelo de lenguaje actúe como **Certf Scanner**: mismas fuentes, misma estrategia de búsqueda (keywords ES/EN, guardia contra falsos positivos), mismo protocolo de "Buscar páginas y actualizar" (sin límite diario, feedback inmediato del porcentaje), misma categorización ordenada, modo **0 a PRO** para personas sin experiencia, y reglas duras de verifiabilidad (evidencia + fuente; nada de descuentos fantasmas; política estricta sobre leaks).

## Usar la PWA

```bash
python3 -m http.server 8000 --bind 0.0.0.0 --directory web
# abrir http://localhost:8000
```

O desplegarla en GitHub Pages con el workflow **Publicar PWA en GitHub Pages** (requiere activar Pages en *Settings / Pages / Source: GitHub Actions*).

## Compilar la APK

En GitHub (recomendado, no requiere Android Studio):

1. Ve a **Actions / Build Android APK / Run workflow** (o haz cualquier push que toque `web/`, `android/` o `tools/`).
2. Al terminar tienes la APK en **dos lugares**:
   - `dist/Certf-debug.apk` **dentro del repo** (solo en los builds de `main`, para que las ramas no choquen entre sí por el binario): se descarga con `git`, con el botón de *Download raw file* de GitHub o desde tu checkout.
   - El artefacto **`certf-debug-apk`** de la ejecución (retención 90 días).
3. Instala el `.apk` en el celular (habilita "orígenes desconocidos" si te lo pide).

En local, con Android SDK instalado y Gradle >= 8.7:

```bash
python3 tools/build_data.py     # regenera web/data.json desde web/data.js
cd android && gradle :app:assembleDebug
# salida: android/app/build/outputs/apk/debug/app-debug.apk
```

## Pruebas

```bash
node tools/smoke_test.js             # 48 verificaciones: catálogo, rutas 0 a PRO, descuentos, alertas, guías, categorización ordenada, cero emojis
node tools/scanner_test.js           # 46 verificaciones del buscador en vivo, sin red (fixtures + puente nativo simulado)
python3 tools/build_data.py          # valida data.js y genera data.json
python3 tools/crawler.py --selftest  # 41 pruebas del rastreador, sin red
python3 tools/crawler.py --offline tools/fixtures   # corrida completa con HTML local
```

**En cada push corre `.github/workflows/tests.yml`** (14 s, sin red): valida que los cuatro
workflows sean YAML correcto, que `data.js` y `data.json` estén sincronizados, y ejecuta las
cuatro pruebas anteriores más una corrida completa del rastreador con fixtures. Nada llega a
la app si algo falla ahí. El workflow de la APK repite las pruebas antes de compilar y el del
rastreador las repite antes de publicar.

### Qué cubre `scanner_test.js`

Descuento 100/50/otro/beca, **15 casos de falsos positivos** ("Score at least 80%", "feel free", "100% online", "free trial", "Attendance of 90%"… — la base del "no descuentos fantasmas"), extracción de códigos (`AIF2CLOUD`, `COMPSEC-4417`) y rechazo de palabras sueltas, **códigos de un solo uso**, badges, detección de español, lectura de JSON de comunidades (Reddit/HN), limpieza de HTML y entidades, página bloqueada (prueba los 7 transportes antes de rendirse), **puente nativo de la APK con entrega en trozos**, escaneo completo con progreso y memoria ("nuevo" solo la primera vez), descubrimiento de páginas nuevas y paridad de fuentes con `tools/crawler.py`.

## Estructura

```
web/      PWA: index.html, app.js, scanner.js (buscador en vivo), styles.css,
          data.js (fuente de datos, incluye rutas 0 a PRO), novedades.js (generado
          por el rastreador), sw.js, manifest
android/  Proyecto Android (Kotlin + WebView): MainActivity, NativeFetch (puente
          sin CORS para el botón Buscar páginas), Alerts, receivers
tools/    build_data.py (data.js a data.json), crawler.py (rastreador diario),
          scanner_test.js, smoke_test.js, fixtures/*.html|json, gen_icons.py
data/     crawler-state.json (memoria de lo ya rastreado; lo commit-ea el workflow)
dist/     Certf-debug.apk (la publica el workflow de la APK)
prompts/  cv-enhancement-tool-prompt.md (system prompt del asistente LLM)
.github/  Workflows: android-apk.yml (compila y publica la APK), pages.yml (PWA),
          crawler.yml (rastreo diario con commit automático + PR de revisión)
certificaciones-alto-valor-2026.md   Informe con las fuentes y el detalle de cada certificación
```

## Rastreador: cómo operarlo

- **Corrido manual**: GitHub, Actions, *Rastreador diario de certificaciones*, **Run workflow**. O en local con red: `python3 tools/crawler.py` (escribe `web/novedades.js` y `data/crawler-state.json`).
- **Añadir una fuente**: agrega la entrada **en los dos lados** —`SOURCES` en `tools/crawler.py` y `SOURCES` en `web/scanner.js`— con el mismo `id` y la misma `url` (la prueba de paridad lo exige). Campos: `id`, `name`, `url`, `lang`, `grupo` (`oficial` | `badges` | `es` | `comunidad` | `agregador`) y `json: true` si la fuente devuelve JSON.
- **PR de revisión**: si el informe dice *"requiere revisión"*, el workflow fuerza la rama `crawler/reporte` con `data/last-report.md` y abre/actualiza el PR. Confirma la oferta a mano en `web/data.js` y corre `python3 tools/build_data.py`.
- El sello visible en la app ("rastreador: hace X h" y "tu última búsqueda: hace X min") refleja `novedades.js` y tu último scan.

## Notas

- `web/data.js` es la **fuente única** del catálogo: edítala y corre `python3 tools/build_data.py` para regenerar `web/data.json` (lo consume el lado nativo Android). El CI falla si quedan desincronizados. Campos por credencial: `disc` (descuento máximo en %) y `kind` (`cert` | `badge`) además de los clásicos; `rutas` referencia únicamente `id` de `certs` y `deadlines` (las pruebas lo exigen).
- La APK es *debug* (instalable, no apta para Play Store). Para publicar: crea un keystore y compila `assembleRelease` con firma.
- Los hallazgos en vivo son **automáticos**: confirman el porcentaje y el código que la página publica, pero **la fuente oficial manda**. Los resultados de *comunidades* y *agregadores* salen en la sección *Leaks y códigos de comunidad*, marcados como "fuente no oficial: confirmar". Nunca pagues por un voucher.
- La interfaz no usa emojis: la información se comunica con texto y sellos (100% GRATIS, 50% DESCUENTO, CÓDIGO DE UN SOLO USO, fuente no oficial), más legible en notificaciones y en pantallas pequeñas.
- Datos del catálogo verificados el **12-sep-2026** (y de ahora en adelante, a diario por el rastreador y en vivo con el botón).
