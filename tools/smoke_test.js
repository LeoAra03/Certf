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
sandbox.window = Object.assign(sandbox.window, { document });
sandbox.globalThis = sandbox;

const ctx = vm.createContext(sandbox);
vm.runInContext(read("web/data.js"), ctx, { filename: "data.js" });
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
check("Guías renderizadas", ((els["#guias-lista"] || {}).innerHTML || "").includes("Financial aid"));
check("Descartes renderizados", ((els["#descartes"] || {}).innerHTML || "").includes("ISC2"));
check("Estado de notificaciones informado", (((els["#estado-notif"] || {}).textContent) || "").length > 0,
  (els["#estado-notif"] || {}).textContent);

console.log("────────────────────────────────────────");
if (fallos) {
  console.log("❌ " + fallos + " verificación(es) fallida(s)\n");
  process.exit(1);
}
console.log("✅ Todo OK\n");
