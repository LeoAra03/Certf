#!/usr/bin/env node
/* Prueba de humo sin navegador: ejecuta web/app.js sobre un DOM mínimo simulado
   y verifica que el catálogo, las rutas 0 a PRO, las alertas y el seguimiento
   se rendericen, que la categorización quede ordenada por urgencia y que no
   queden emojis ni descuentos sin evidencia en la interfaz.

   Uso: node tools/smoke_test.js
*/
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

/* ---------- DOM mínimo ---------- */
function makeEl(name) {
  const el = {
    _name: name,
    innerHTML: "",
    textContent: "",
    value: "",
    dataset: {},
    style: {},
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); },
      remove(c) { this._s.delete(c); },
      contains(c) { return this._s.has(c); },
      toggle(c, force) { if (force === undefined) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); } else { force ? this._s.add(c) : this._s.delete(c); } }
    },
    listeners: {},
    addEventListener(ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); },
    closest() { return el; },
    querySelector() { return makeEl("child"); },
    querySelectorAll() { return []; }
  };
  return el;
}

const els = {};
const document = {
  querySelector(sel) { return (els[sel] = els[sel] || makeEl(sel)); },
  querySelectorAll() { return []; },
  addEventListener(ev, fn) { if (ev === "DOMContentLoaded") document._ready = fn; }
};

const storage = {};
const sandbox = {
  console,
  document,
  window: {
    matchMedia: () => ({ matches: false }),
    addEventListener() {},
    scrollTo() {},
    open() {}
  },
  navigator: {},
  localStorage: {
    getItem: (k) => (k in storage ? storage[k] : null),
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
  },
  location: { protocol: "http:" },
  setTimeout: () => 0,
  Notification: undefined
};
sandbox.window = Object.assign(sandbox.window, { document, localStorage: sandbox.localStorage, navigator: sandbox.navigator });
sandbox.globalThis = sandbox;

const ctx = vm.createContext(sandbox);
vm.runInContext(read("web/data.js"), ctx);
vm.runInContext(read("web/mejoras.js"), ctx);

/* Último guardado en vivo (simula una búsqueda previa): sirve para verificar
   que la lista se restaura y que la categorización queda ORDENADA por urgencia. */
const ahora = new Date().toISOString().replace(/\.\d+Z$/, "Z");
const hallazgo = (id, extra) => Object.assign({
  id: id, sig: id + "sig", src: "fake", name: "Fuente de prueba " + id, url: "https://ejemplo.test/" + id,
  text: "Use the promo code to get 50% off this certification by September 30.", found: "2026-09-12",
  kind: "oferta", review: false, disc: null, etiqueta: "", beca: false, codes: [], unico: false,
  badge: false, lang: "EN", grupo: "oficial", live: true, nuevo: true
}, extra);
/* Mejora #1 ya hecha: la primera sugerencia debe ser la #2 (todas P0, impacto 5). */
storage["certf.mj.v1"] = JSON.stringify({ hechas: { 1: "2026-09-12T12:00:00.000Z" } });

storage["certf.scan.v2"] = JSON.stringify({
  checked: ahora,
  items: [
    hallazgo("unico-comunidad", { disc: 100, etiqueta: "100% GRATIS", unico: true, codes: ["UNICODE-777"], grupo: "comunidad" }),
    hallazgo("gratis-oficial", { disc: 100, etiqueta: "100% GRATIS" }),
    hallazgo("dto50-oficial", { disc: 50, etiqueta: "50% DESCUENTO", codes: ["AIF2CLOUD"] }),
    hallazgo("dtoo-oficial", { disc: 25, etiqueta: "25% DESCUENTO" }),
    hallazgo("beca-oficial", { beca: true, etiqueta: "BECA / AYUDA" }),
    hallazgo("badge-badges", { badge: true, grupo: "badges" }),
    hallazgo("leak-agregador", { disc: 100, etiqueta: "100% GRATIS", grupo: "agregador" }),
    hallazgo("otro-es", { lang: "ES", grupo: "es" })
  ],
  fuentes: [], totalFuentes: 8, okFuentes: 8, nuevos: 8
});

vm.runInContext(read("web/novedades.js"), ctx);
vm.runInContext(read("web/scanner.js"), ctx);
vm.runInContext(read("web/app.js"), ctx);

// Disparamos DOMContentLoaded (el listener quedó guardado en document._ready)
if (typeof document._ready === "function") document._ready();

/* ---------- verificaciones ---------- */
let fallos = 0;
function check(label, cond, extra) {
  console.log((cond ? "  [OK]   " : "  [FALLO]") + " " + label + (extra ? " => " + extra : ""));
  if (!cond) fallos++;
}

const lista = els["#lista"] ? els["#lista"].innerHTML : "";
const alertas = els["#lista-alertas"] ? els["#lista-alertas"].innerHTML : "";
const data = sandbox.window.__CERTF__;
const tarjetas = (lista.match(/<article class="card"/g) || []).length;

console.log("\nCertf · prueba de humo");
console.log("────────────────────────────────────────");
check("Datos cargados", !!data && Array.isArray(data.certs), data.certs.length + " certificaciones");
check("Catálogo renderizado", tarjetas === data.certs.length, tarjetas + " tarjetas");
check("Incluye la #1 por peso", lista.includes("AWS Certified Cloud Practitioner"));
check("Orden por peso correcto", lista.indexOf("Cloud Practitioner") < lista.indexOf("Trailhead"));
check("Muestra verificación", lista.includes("Credly"));
check("Fechas críticas renderizadas", (alertas.match(/<div class="alerta/g) || []).length === data.deadlines.length);
check("Alerta urgente detectada", alertas.includes("AIF2CLOUD"));
check("Conteo en cabecera actualizado", (els["#counts"] || {}).textContent === data.certs.length + " de " + data.certs.length + " credenciales",
  (els["#counts"] || {}).textContent);
check("Fecha de actualización visible", (els["#updated"] || {}).textContent === data.updated, (els["#updated"] || {}).textContent);
check("Resumen de descuentos en la cabecera",
  ((els["#counts-desc"] || {}).textContent || "").includes("gratis al 100%") &&
  ((els["#counts-desc"] || {}).textContent || "").includes("becas hasta 100%") && ((els["#counts-desc"] || {}).textContent || "").includes("badges"),
  (els["#counts-desc"] || {}).textContent);
check("Guías renderizadas", ((els["#guias-lista"] || {}).innerHTML || "").includes("Financial aid"));
check("Descartes renderizados", ((els["#descartes"] || {}).innerHTML || "").includes("ISC2"));
check("Guía de descuentos fantasmas renderizada",
  ((els["#fantasmas"] || {}).innerHTML || "").includes("no aparece en la página oficial no existe"));

/* ---------- descuento a la vista + badges + buscador en vivo ---------- */
const html = read("web/index.html");
check("Dice al tiro el 100% gratis en el catálogo", lista.includes("100% GRATIS"), "revisa web/data.js (campo disc)");
check("Dice al tiro el 50% de descuento en el catálogo", lista.includes("50% DTO"));
check("Distingue certificaciones de badges", lista.includes(">Badge<") && lista.includes(">Certificación<"));
check("Botón 'Buscar páginas' en la cabecera", html.includes('id="btn-buscar"') && html.includes("Buscar páginas"));
check("Botón 'Buscar páginas y actualizar ahora'", html.includes('id="btn-scan"') && html.includes("Buscar páginas y actualizar ahora"));
check("Filtros de descuento e idioma", html.includes('id="filtro-desc"') && html.includes('id="filtro-lang"'));
check("scanner.js cargado y con API", sandbox.window.CertfScanner &&
  typeof sandbox.window.CertfScanner.scan === "function" && typeof sandbox.window.CertfScanner.discover === "function");
check("Fuentes en vivo del buscador", sandbox.window.CertfScanner && sandbox.window.CertfScanner.SOURCES.length >= 30,
  sandbox.window.CertfScanner ? sandbox.window.CertfScanner.SOURCES.length : 0);
check("Fuentes en español y de badges", sandbox.window.CertfScanner &&
  sandbox.window.CertfScanner.SOURCES.some((s) => s.grupo === "es") &&
  sandbox.window.CertfScanner.SOURCES.some((s) => s.grupo === "badges") &&
  sandbox.window.CertfScanner.SOURCES.some((s) => s.grupo === "comunidad"));
/* ningún selector de app.js puede quedar sin elemento en index.html (crash seguro) */
const idsHtml = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
const idsUsados = new Set([...read("web/app.js").matchAll(/\$\("#([A-Za-z0-9_-]+)"\)/g)].map((m) => m[1]));
const faltan = [...idsUsados].filter((i) => !idsHtml.has(i));
check("Todos los elementos que usa app.js existen", faltan.length === 0, "faltan: " + faltan.join(", "));
check("Todos los scripts están en el HTML", ["data.js", "mejoras.js", "novedades.js", "scanner.js", "app.js"]
  .every((f) => html.includes('src="' + f + '"')));

/* ---------- AUTO-MEJORA: backlog embebido, progreso y prompts ---------- */
check("Backlog embebido cargado (1000 mejoras)", sandbox.window.__CERTF_MEJORAS__ &&
  sandbox.window.__CERTF_MEJORAS__.total === 1000 && sandbox.window.__CERTF_MEJORAS__.mejoras.length === 1000,
  sandbox.window.__CERTF_MEJORAS__ ? sandbox.window.__CERTF_MEJORAS__.total : "ausente");
const mjResumen = (els["#resumen-mj"] || {}).innerHTML || "";
check("Progreso del backlog renderizado (1000, 1 hecha, P0 pendientes)",
  mjResumen.includes("1000") && mjResumen.includes(">1<") && mjResumen.includes("P0 pendientes"), mjResumen.slice(0, 120));
const sug = (els["#lista-sug"] || {}).innerHTML || "";
check("Siguientes sugerencias: #2, #3 y #4 (la #1 ya está hecha)",
  sug.includes("Mejora #2") && sug.includes("Mejora #3") && sug.includes("Mejora #4") && !sug.includes("Mejora #1<"));
check("Cada sugerencia trae botón 'Copiar prompt'", (sug.match(/data-mj-copiar=/g) || []).length === 3,
  (sug.match(/data-mj-copiar=/g) || []).length + "/3");
check("Badge de la pestaña Auto-mejora con P0 pendientes",
  ((els["#badge-mj"] || {}).textContent || "") === "24", (els["#badge-mj"] || {}).textContent);
check("Panel IA opcional con aviso de privacidad local",
  html.includes('id="ai-key"') && html.includes('id="btn-ai"') && html.includes("solo en este teléfono"));

check("scanner.js va en el service worker y en la APK",
  read("web/sw.js").includes("scanner.js") && read("android/app/build.gradle").includes("scanner.js"));
check("Estado de notificaciones informado", (((els["#estado-notif"] || {}).textContent) || "").length > 0,
  (els["#estado-notif"] || {}).textContent);

/* ---------- RUTA 0 A PRO ---------- */
const ruta = els["#lista-ruta"] ? els["#lista-ruta"].innerHTML : "";
check("Rutas definidas en datos", Array.isArray(data.rutas) && data.rutas.length >= 5, (data.rutas || []).length + " áreas");
check("Ruta 0 a PRO renderizada", ruta.includes("Fase 1") && ruta.includes("Fase 4"), "fases visibles");
check("Cada fase trae varias opciones",
  data.rutas.every((r) => r.fases.every((f) => f.ids.length >= 2)));
check("Las rutas solo citan credenciales del catálogo",
  data.rutas.every((r) => r.fases.every((f) => f.ids.every((id) => data.certs.some((c) => c.id === id)))));
check("Las fechas de las rutas existen en deadlines",
  data.rutas.every((r) => r.fases.every((f) => !(f.fechas || []).length || f.fechas.every((id) => data.deadlines.some((d) => d.id === id)))));
const pasosRuta = data.rutas[0].fases.reduce((a, f) => a + f.ids.length, 0);
check("Cada paso de la ruta activa muestra verificación",
  (ruta.match(/Verificación: /g) || []).length === pasosRuta,
  (ruta.match(/Verificación: /g) || []).length + "/" + pasosRuta + " pasos verificados");
check("Cada credencial citada en las rutas tiene método de verificación",
  data.rutas.every((r) => r.fases.every((f) => f.ids.every((id) => {
    const c = data.certs.find((x) => x.id === id);
    return c && c.verify;
  }))));
check("Chips de área renderizados", (els["#filtro-area"] || {}).innerHTML.includes('data-area="cloud"') &&
  (els["#filtro-area"] || {}).innerHTML.includes('data-area="seguridad"'));
check("Botón Seguir dentro de la ruta", ruta.includes('data-ruta-seguir="aws-clf"'));

/* ---------- novedades del rastreador + categorización ORDENADA ---------- */
const nov = sandbox.window.__CERTF_NOVEDADES__;
check("Datos de novedades cargados", nov && Array.isArray(nov.items),
  nov && nov.items ? nov.items.length + " hallazgos" : "novedades.js ausente o inválido");
check("Sello de tu última búsqueda visible", ((els["#last-check"] || {}).textContent || "").includes("tu última búsqueda:"),
  (els["#last-check"] || {}).textContent);
check("Sello del rastreador automático visible", ((els["#last-check"] || {}).textContent || "").includes("rastreador:"),
  (els["#last-check"] || {}).textContent);
const auto = els["#lista-novedades-auto"] ? els["#lista-novedades-auto"].innerHTML : "";
check("Novedades del robot renderizadas con su %", nov && nov.items.length > 0
  ? auto.includes("card nov") && auto.includes("50% off") && auto.includes("50% DESCUENTO")
  : auto.length === 0,
  "novedades: " + (nov ? nov.items.length : "?"));

/* lista en vivo: restaurada desde el último guardado y ORDENADA por urgencia */
const novedades = els["#lista-novedades"] ? els["#lista-novedades"].innerHTML : "";
check("Lista en vivo restaurada desde el último guardado",
  novedades.includes("card nov"), "debería traer las 8 tarjetas guardadas");
const orden = [
  "Códigos de un solo uso",
  "100% gratis (100% OFF)",
  "50% de descuento",
  "Otro descuento",
  "Becas y ayuda financiera",
  "Badges y credenciales digitales",
  "Leaks y códigos de comunidad",
  "Resto de hallazgos"
];
let idx = -1, ordenOK = true;
for (const titulo of orden) {
  const pos = novedades.indexOf(titulo);
  if (pos === -1 || pos < idx) { ordenOK = false; break; }
  idx = pos;
}
check("Categorización ordenada por urgencia (único uso primero, leaks antes del resto)", ordenOK);
check("El código de un solo uso cae en la sección 1 aunque venga de comunidad",
  novedades.indexOf("CÓDIGO DE UN SOLO USO") < novedades.indexOf("100% gratis (100% OFF)"));
check("Cada hallazgo muestra su evidencia (frase de la página)",
  (novedades.match(/Evidencia \(frase de la página\)/g) || []).length >= 8,
  (novedades.match(/Evidencia \(frase de la página\)/g) || []).length + " evidencias");
check("Cada hallazgo muestra su verificación (oficial o no oficial)",
  (novedades.match(/Verificación: /g) || []).length >= 8);
check("Los leaks se marcan como fuente no oficial",
  novedades.includes("fuente no oficial: confirma en el checkout del proveedor"));

check("En el navegador avisa por qué alguna página puede no responder",
  !(els["#aviso-cors"] || { classList: { contains: () => true } }).classList.contains("hidden"),
  "el aviso debe verse fuera de la APK");

/* ---------- paquete P0: peso CV, tipo de examen, siguiente acción, gratis directo ---------- */
check("Toda credencial tiene tipo de examen (test)", data.certs.every((c) => c.examen && c.examen.length > 3));
check("Toda credencial tiene razon verificable de su peso en el CV", data.certs.every((c) => c.peso_n && c.peso_n.length > 10));
check("Las tarjetas muestran el tipo de examen", (lista.match(/Examen: /g) || []).length === data.certs.length,
  (lista.match(/Examen: /g) || []).length + "/" + data.certs.length);
check("Las tarjetas muestran por que pesan en el CV", (lista.match(/Por qué pesa en el CV:/g) || []).length === data.certs.length,
  (lista.match(/Por qué pesa en el CV:/g) || []).length + "/" + data.certs.length);
check("Las tarjetas 100% gratis dicen 'Postular ahora'", lista.includes("Postular ahora"));
check("Las becas dicen 'Postular a la beca'", lista.includes("Postular a la beca"));
check("Filtro de peso en el CV presente", html.includes('id="filtro-peso"') && html.includes("Peso alto (8-10)"));
const sig = (els["#siguiente"] || {}).innerHTML || "";
check("Barra 'Siguiente acción' renderizada con boton", sig.includes("Siguiente acción") && sig.includes("sig-btn"));
check("Siguiente acción por defecto apunta a la gratis de mayor peso (CLF-C02, CV 10/10)",
  sig.includes("AWS Certified Cloud Practitioner") && sig.includes("CV 10/10") && sig.includes("Postular ahora"), sig.slice(0, 160));
check("Panel 'Tu objetivo' presente (puesto, horas, experiencia)",
  html.includes('id="objetivo"') && html.includes('id="obj-puesto"') && html.includes('id="obj-horas"') && html.includes('id="obj-nivel"'));
check("Puestos objetivo alimentados desde las rutas",
  ((els["#obj-puesto"] || {}).innerHTML || "").includes("Analista de seguridad junior") &&
  ((els["#obj-puesto"] || {}).innerHTML || "").includes("Soporte / Cloud junior"));
check("Guía 'Como postular a las 100% gratis' renderizada",
  ((els["#guias-gratis-lista"] || {}).innerHTML || "").includes("Apply Now") &&
  ((els["#guias-gratis-lista"] || {}).innerHTML || "").includes("MISMO email"));
check("Mis certificaciones muestra puntos CV obtenidos", ((els["#resumen"] || {}).innerHTML || "").includes("puntos CV obtenidos"));
check("La ruta muestra peso y tipo de examen por paso", (ruta.match(/CV \d+\/10 · Examen:/g) || []).length === pasosRuta,
  (ruta.match(/CV \d+\/10 · Examen:/g) || []).length + "/" + pasosRuta);
check("La barra Siguiente acción queda pegada a las pestañas (sticky)",
  read("web/styles.css").includes(".tabs-wrap") && read("web/styles.css").includes(".siguiente"));
check("Estado del rastreador informado", ((els["#nov-estado"] || {}).innerHTML || "").includes("Última revisión automática"),
  (els["#nov-estado"] || {}).innerHTML);

/* ---------- cero emojis en la interfaz ---------- */
const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{1F1E6}-\u{1F1FF}\uFE0F\u200D\u20E3]/u;
const archivosWeb = ["web/index.html", "web/app.js", "web/data.js", "web/data.json", "web/scanner.js", "web/styles.css", "web/novedades.js", "web/sw.js", "web/mejoras.js"];
const conEmoji = archivosWeb.filter((f) => EMOJI_RE.test(read(f)));
check("Sin emojis en la interfaz web", conEmoji.length === 0, "con emojis: " + conEmoji.join(", "));

console.log("────────────────────────────────────────");
if (fallos) {
  console.log("[FALLO] " + fallos + " verificación(es) fallida(s)\n");
  process.exit(1);
}
console.log("[OK] Todo OK\n");
