#!/usr/bin/env node
/* Prueba de humo sin navegador: ejecuta web/app.js sobre un DOM mínimo simulado
   y verifica que el catálogo, las alertas y el seguimiento se rendericen.

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
vm.runInContext(read("web/data.js"), ctx, { filename: "data.js" });
let novCargado = true;
try { vm.runInContext(read("web/novedades.js"), ctx, { filename: "novedades.js" }); }
catch (e) { novCargado = false; }
let scannerCargado = true;
try { vm.runInContext(read("web/scanner.js"), ctx, { filename: "scanner.js" }); }
catch (e) { scannerCargado = false; console.error(e); }
vm.runInContext(read("web/app.js"), ctx, { filename: "app.js" });

// Disparamos DOMContentLoaded (el listener quedó guardado en document._ready)
if (typeof document._ready === "function") document._ready();

/* ---------- verificaciones ---------- */
let fallos = 0;
function check(label, cond, extra) {
  console.log((cond ? "  ✅ " : "  ❌ ") + label + (extra ? " → " + extra : ""));
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

/* ---------- descuento a la vista + badges + buscador en vivo ---------- */
const html = read("web/index.html");
check("Dice al tiro el 100% gratis en el catálogo", lista.includes("100% GRATIS"), "revisa web/data.js (campo disc)");
check("Dice al tiro el 50% de descuento en el catálogo", lista.includes("50% DTO"));
check("Distingue certificaciones de badges", lista.includes("🎖️ Badge") && lista.includes("📜 Certificación"));
check("Botón 'Buscar páginas' en la cabecera", html.includes('id="btn-buscar"') && html.includes("Buscar páginas"));
check("Botón 'Buscar páginas y actualizar ahora'", html.includes('id="btn-scan"') && html.includes("Buscar páginas y actualizar ahora"));
check("Filtros de descuento e idioma", html.includes('id="filtro-desc"') && html.includes('id="filtro-lang"'));
check("scanner.js cargado y con API", scannerCargado && sandbox.window.CertfScanner &&
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
check("Todos los scripts están en el HTML", ["data.js", "novedades.js", "scanner.js", "app.js"]
  .every((f) => html.includes('src="' + f + '"')));

check("scanner.js va en el service worker y en la APK",
  read("web/sw.js").includes("scanner.js") && read("android/app/build.gradle").includes("scanner.js"));
check("Estado de notificaciones informado", (((els["#estado-notif"] || {}).textContent) || "").length > 0,
  (els["#estado-notif"] || {}).textContent);

/* ---------- novedades del rastreador ---------- */
const nov = sandbox.window.__CERTF_NOVEDADES__;
const novedades = els["#lista-novedades"] ? els["#lista-novedades"].innerHTML : "";
check("Datos de novedades cargados", novCargado && nov && Array.isArray(nov.items),
  nov && nov.items ? nov.items.length + " hallazgos" : "novedades.js ausente o inválido");
check("Sello de tu última búsqueda visible", ((els["#last-check"] || {}).textContent || "").includes("tu última búsqueda:"),
  (els["#last-check"] || {}).textContent);
check("Sello del rastreador automático visible", ((els["#last-check"] || {}).textContent || "").includes("robot:"),
  (els["#last-check"] || {}).textContent);
const auto = els["#lista-novedades-auto"] ? els["#lista-novedades-auto"].innerHTML : "";
check("Novedades del robot renderizadas con su %", nov && nov.items.length > 0
  ? auto.includes("card nov") && auto.includes("50% off") && auto.includes("50% DESCUENTO")
  : auto.length === 0,
  "novedades: " + (nov ? nov.items.length : "?"));
check("La lista en vivo parte vacía (hasta que busques)", novedades.length === 0 &&
  !(els["#novedades-vacio"] || { classList: { contains: () => true } }).classList.contains("hidden"));
check("Estado del rastreador informado", ((els["#nov-estado"] || {}).innerHTML || "").includes("Última revisión automática"),
  (els["#nov-estado"] || {}).innerHTML);

console.log("────────────────────────────────────────");
if (fallos) {
  console.log("❌ " + fallos + " verificación(es) fallida(s)\n");
  process.exit(1);
}
console.log("✅ Todo OK\n");
