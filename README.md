# Certf

App para encontrar, seguir y no perder **certificaciones con peso real en el CV** (gratuitas, becadas o con descuento estudiantil verificable).

Dos formatos con **una sola base de código** (la PWA de `web/`):

| Formato | Estado | Cómo usarlo |
|---|---|---|
| **PWA / app web** | ✅ funcionando | Se abre en el navegador y se instala en Android con *“Añadir a pantalla de inicio”* (o en escritorio con el botón **Instalar**). Funciona offline. |
| **APK Android** | ✅ compilada en GitHub Actions | El workflow **Build Android APK** compila el `.apk` (debug) en cada push y lo deja como artefacto descargable. |

## Qué hace

1. **Catálogo** de 36 credenciales de Google, Microsoft, AWS, IBM, Cisco, Meta, Oracle, Harvard, Stanford, MIT y Universidad de Helsinki, ordenadas por *peso en el CV* (1-10), con filtros por tipo (todo gratis / beca / descuento / estudiante), área, búsqueda y orden por urgencia.
2. **Mis certificaciones**: seguimiento con estado (Pendiente / En curso / Obtenida), fecha objetivo y notas. Se guarda en el dispositivo (`localStorage`).
3. **Alertas**: días restantes de cada fecha crítica (código `AIF2CLOUD` de AWS, Microsoft Certification Week, re:Invent, códigos ISC2…) y de tus propios plazos.
   - En la **web**: notificaciones mientras la app está abierta.
   - En la **app Android**: alarma diaria nativa (09:00) que avisa de todo lo que vence en los próximos 7 días, aunque la app esté cerrada.
4. **Guías**: cómo pedir la beca de Coursera/edX paso a paso y lista de *descartes* (cosas que ya no son gratis o no suman en el ATS).

## Usar la PWA

```bash
python3 -m http.server 8000 --bind 0.0.0.0 --directory web
# abrir http://localhost:8000
```

O desplegarla en GitHub Pages con el workflow **Publicar PWA en GitHub Pages** (requiere activar Pages en *Settings → Pages → Source: GitHub Actions*).

## Compilar la APK

En GitHub (recomendado, no requiere Android Studio):

1. Ve a **Actions → Build Android APK → Run workflow**.
2. Al terminar, descarga el artefacto **`certf-debug-apk`** (retención 90 días).
3. Instala el `.apk` en el celular (habilita “orígenes desconocidos” si te lo pide).

En local, con Android SDK instalado y Gradle ≥ 8.7:

```bash
python3 tools/build_data.py     # regenera web/data.json desde web/data.js
cd android && gradle :app:assembleDebug
# salida: android/app/build/outputs/apk/debug/app-debug.apk
```

## Pruebas

```bash
node tools/smoke_test.js     # 12 verificaciones sobre catálogo, alertas y guías
python3 tools/build_data.py  # valida data.js y genera data.json
```

El workflow de la APK ejecuta ambas antes de compilar.

## Estructura

```
web/      PWA: index.html, app.js, styles.css, data.js (fuente de datos), sw.js, manifest
android/  Proyecto Android (Kotlin + WebView) que empaqueta web/ como assets
tools/    build_data.py (data.js → data.json), gen_icons.py (íconos PNG), smoke_test.js
.github/  Workflows: android-apk.yml (compila la APK) y pages.yml (publica la PWA)
certificaciones-alto-valor-2026.md   Informe con las fuentes y el detalle de cada certificación
```

## Notas

- `web/data.js` es la **fuente única**: edítala y corre `python3 tools/build_data.py` para regenerar `web/data.json` (lo consume el lado nativo Android). El CI falla si quedan desincronizados.
- La APK es *debug* (instalable, no apta para Play Store). Para publicar: crea un keystore y compila `assembleRelease` con firma.
- Datos verificados el **10-sep-2026**. Revisa siempre la fuente oficial antes de postular o pagar.
