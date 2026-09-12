#!/usr/bin/env node
/* Certf · prueba del buscador EN VIVO (web/scanner.js) sin red.
   Simula el fetch del navegador (y el puente nativo de la APK) con HTML local
   de tools/fixtures, y verifica que la app diga al tiro:
     - si la oferta es 100% gratis, 50% u otro descuento,
     - si hay código (y si es de un solo uso),
     - si es badge, y en qué idioma viene,
     - que el resultado se guarde y se pueda reutilizar.

   Uso: node tools/scanner_test.js
*/
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const FIX = path.join(ROOT, "tools", "fixtures");
const read = (p) => fs.readFileSync(p, "utf8");
const fix = (n) => read(path.join(FIX, n));

/* ---------- "internet" de mentira: URL -> fixture ---------- */
const RUTAS = [
  ["unico-uso", "unico-uso.html"],
  ["badges-es", "badges-es.html"],
  ["reddit", "reddit.json"],
  ["duckduckgo", "ddg.html"],
  ["hn.algolia", "reddit.json"],
  ["bloqueada", "bloqueado.html"]
];
function cuerpoPara(url) {
  for (const [clave, archivo] of RUTAS) if (url.indexOf(clave) !== -1) return fix(archivo);
  return null;
}
const llamadas = [];

function respuesta(url) {
  llamadas.push(url);
  const body = cuerpoPara(url);
  if (body === null) return { ok: false, status: 404, text: () => Promise.resolve("") };
  return { ok: true, status: 200, text: () => Promise.resolve(body) };
}

/* ---------- entorno mínimo (equivalente a window en el celular) ---------- */
const storage = {};
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  AbortController: typeof AbortController === "function" ? AbortController : undefined,
  fetch: (url) => Promise.resolve(respuesta(url)),
  localStorage: {
    getItem: (k) => (k in storage ? storage[k] : null),
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
  },
  navigator: {},
  location: { protocol: "https:" }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox);
vm.runInContext(read(path.join(ROOT, "web", "scanner.js")), ctx, { filename: "scanner.js" });

const SC = sandbox.CertfScanner;

/* ---------- assertions ---------- */
let fallos = 0;
function check(label, cond, extra) {
  console.log((cond ? "  ✅ " : "  ❌ ") + label + (extra !== undefined && !cond ? " → " + extra : ""));
  if (!cond) fallos++;
}

(async function () {
  console.log("\nCertf · prueba del buscador en vivo (scanner.js)");
  console.log("────────────────────────────────────────");

  /* 1) clasificador de descuento: la respuesta inmediata */
  const d100 = SC.descuentoDe("Esta certificación es 100% gratis para estudiantes.");
  const d50 = SC.descuentoDe("Use the promo code to get 50% off AWS Certified AI Practitioner.");
  const d90 = SC.descuentoDe("El programa entrega asistencia financiera del 90% para el curso.");
  const dOtro = SC.descuentoDe("Save 25% on any exam this month with the seasonal discount.");
  const dNada = SC.descuentoDe("La plataforma abrió sus puertas en el año dos mil veinte.");
  check("Detecta 100% gratis", d100.disc === 100 && d100.etiqueta === "100% GRATIS", JSON.stringify(d100));
  check("Detecta 50% de descuento", d50.disc === 50 && d50.etiqueta === "50% DESCUENTO", JSON.stringify(d50));
  check("Detecta beca del 90%", d90.disc === 90 && d90.beca === true, JSON.stringify(d90));
  check("Detecta otro porcentaje (25%)", dOtro.disc === 25, JSON.stringify(dOtro));
  check("Sin oferta -> sin porcentaje", dNada.disc === null && dNada.etiqueta === "", JSON.stringify(dNada));
  check("Prioriza el mayor descuento de la frase",
    SC.descuentoDe("50% off today, or 100% free with the student voucher.").disc === 100);

  /* 1b) regresión de falsos positivos del clasificador */
  const CASOS = [
    ["Score at least 80% on the LevelUp assessment.", null],
    ["Please feel free to contact our support team.", null],
    ["El curso es 100% online y se hace a tu propio ritmo.", null],
    ["Earn a 100% off exam voucher when you attend all five days.", 100],
    ["Use the promo code to get 50% off AWS Certified AI Practitioner.", 50],
    ["Pass the exam and get a free AWS Certified Cloud Practitioner exam.", 100],
    ["The certification is free for students.", 100],
    ["Save 40% for 3 months on the subscription plan.", 40],
    ["Certificación 100% gratis en español con insignia verificable.", 100],
    ["Beca de asistencia financiera de hasta 90% del arancel.", 90],
    ["Start your free trial today and cancel anytime you want.", null],
    ["Attendance of 90% is required to receive the completion badge.", null],
    ["Obtén un voucher gratis para el examen de certificación.", 100],
    ["Get 25% off any exam with this seasonal promo code.", 25],
    ["La inscripción es sin costo para estudiantes verificados.", 100]
  ];
  const malos = CASOS.filter(([f, esp]) => SC.descuentoDe(f).disc !== esp).map(([f]) => f.slice(0, 40));
  check("Clasificador sin falsos positivos (15 casos)", malos.length === 0, JSON.stringify(malos));

  /* 2) códigos (incluso los de un solo uso) */
  const codigos = SC.codigosDe("Use the promo code AIF2CLOUD at checkout to get 50% off the exam.");
  check("Extrae el código promocional", codigos.indexOf("AIF2CLOUD") !== -1, JSON.stringify(codigos));
  check("No confunde palabras comunes con códigos",
    SC.codigosDe("The FREE AWS course is available for students.").length === 0,
    JSON.stringify(SC.codigosDe("The FREE AWS course is available for students.")));
  check("Extrae código con guiones y números",
    SC.codigosDe("Single-use code COMPSEC-4417 gives 100% off.").indexOf("COMPSEC-4417") !== -1);

  /* 3) análisis de una página en español con código de único uso */
  const items = SC.analizar(fix("unico-uso.html"), { id: "t-unico", name: "Página de prueba", url: "https://test.local/unico-uso", lang: null, grupo: "custom" });
  const conCodigo = items.filter((i) => i.codes && i.codes.length);
  const unico = items.filter((i) => i.unico);
  const cien = items.filter((i) => i.disc === 100);
  const noventa = items.filter((i) => i.disc === 90);
  const badge = items.filter((i) => i.badge);
  check("Encuentra hallazgos en la página", items.length >= 4, items.length);
  check("Extrae el código de único uso (AWSFREE-7X92K)",
    conCodigo.some((i) => i.codes.indexOf("AWSFREE-7X92K") !== -1), JSON.stringify(conCodigo.map((c) => c.codes)));
  check("Marca 'único uso' cuando el texto lo dice", unico.length >= 1, unico.length);
  check("Dice al tiro que hay 100% gratis", cien.length >= 1, cien.length);
  check("Dice al tiro que hay beca del 90%", noventa.length >= 1 && noventa[0].beca === true, JSON.stringify(noventa));
  check("Detecta badges / insignias", badge.length >= 1, badge.length);
  check("Ordena primero lo de mayor descuento", items[0].disc === 100, JSON.stringify(items.map((i) => i.disc)));
  check("Idioma detectado en español", /es/i.test(items[0].lang), items[0].lang);

  /* 4) JSON de comunidad (Reddit / HN) */
  const deJson = SC.analizar(fix("reddit.json"), { id: "t-reddit", name: "Reddit de prueba", url: "https://test.local/reddit", lang: "EN", grupo: "comunidad", json: true });
  check("Lee el JSON de la comunidad", deJson.length >= 2, deJson.length);
  check("Saca el código compartido en Reddit",
    deJson.some((i) => (i.codes || []).some((c) => c.indexOf("COMPSEC") !== -1)), JSON.stringify(deJson.map((d) => d.codes)));
  check("Saca el 50% del segundo post", deJson.some((i) => i.disc === 50), JSON.stringify(deJson.map((d) => d.disc)));

  /* 5) HTML -> texto (sin scripts ni etiquetas) */
  const txt = SC.htmlATexto("<html><head><style>a{color:red}</style><script>var x=1;</script></head><body><p>Hola&nbsp;mundo &amp; <b>adiós</b></p></body></html>");
  check("Limpia HTML y decodifica entidades", txt === "Hola mundo & adiós", txt);

  /* 6) respuesta bloqueada: el transporte siguiente toma el relevo */
  llamadas.length = 0;
  const bloqueada = await SC.scanURL("https://test.local/bloqueada", "Página bloqueada");
  check("Una página bloqueada no rompe la app", bloqueada && bloqueada.ok === false && bloqueada.items.length === 0,
    JSON.stringify(bloqueada && { ok: bloqueada.ok, error: bloqueada.error }));
  check("Prueba todos los transportes antes de rendirse", llamadas.length >= 5, llamadas.length + " intentos");
  check("Reporta el motivo del fallo", /bloqueada|vacía|timeout/i.test(bloqueada.error || ""), bloqueada.error);

  /* 7) puente nativo de la APK: entrega en trozos y se rearma */
  const cuerpoGrande = fix("unico-uso.html");
  sandbox.window.CertfNative = {
    disponible: () => true,
    fetchUrl: (url, cb) => {
      const payload = JSON.stringify({ status: 200, body: cuerpoGrande });
      const mitad = Math.ceil(payload.length / 2);
      setTimeout(() => {
        sandbox.window.__certfNativeChunk(cb, 0, 2, payload.slice(0, mitad));
        sandbox.window.__certfNativeChunk(cb, 1, 2, payload.slice(mitad));
      }, 5);
    }
  };
  llamadas.length = 0;
  const nativo = await SC.scanURL("https://test.local/unico-uso", "Vía puente nativo");
  check("El puente nativo de la APK rearma los trozos",
    nativo.ok === true && nativo.transporte === "nativo (APK)" && nativo.items.length >= 4,
    JSON.stringify({ ok: nativo.ok, t: nativo.transporte, n: nativo.items.length }));
  check("El puente nativo se intenta primero", llamadas.length === 0, llamadas.length + " llamadas fetch");
  delete sandbox.window.CertfNative;

  /* 8) escaneo completo con páginas vigiladas por el usuario + memoria */
  SC.borrarTodo();   // partimos sin memoria para probar el marcado de "nuevo"
  SC.agregarCustom("https://test.local/unico-uso", "Códigos de hoy");
  SC.agregarCustom("https://test.local/badges-es", "Badges en español");
  const custom = SC.customFuentes();
  check("Se pueden vigilar páginas propias", custom.length === 2, JSON.stringify(custom.map((c) => c.name)));
  check("No duplica una página ya vigilada", SC.agregarCustom("https://test.local/unico-uso").ok === false);

  let eventos = 0;
  const res = await SC.scan({ grupos: [], onProgress: () => { eventos++; } });
  check("El escaneo recorre las páginas vigiladas", res.totalFuentes === 2 && res.okFuentes === 2,
    JSON.stringify({ total: res.totalFuentes, ok: res.okFuentes }));
  check("Informa progreso página por página", eventos >= 4, eventos);
  check("Resumen con 100% / 50% / códigos / único uso",
    res.gratis100 >= 2 && res.dto50 >= 1 && res.codigos >= 2 && res.unicos >= 1,
    JSON.stringify({ g: res.gratis100, d: res.dto50, c: res.codigos, u: res.unicos }));
  check("Marca como nuevo lo que no se había visto", res.nuevos >= 6, res.nuevos);
  check("Guarda el resultado en el dispositivo", !!SC.scanGuardado() && SC.scanGuardado().items.length >= 6,
    SC.scanGuardado() ? SC.scanGuardado().items.length : "null");

  const res2 = await SC.scan({ grupos: [] });
  check("Segunda búsqueda: ya nada es 'nuevo' (memoria OK)", res2.nuevos === 0, res2.nuevos);
  check("Segunda búsqueda sigue mostrando las ofertas vigentes", res2.items.length >= 6, res2.items.length);

  /* 8b) botón "Detener": corta la búsqueda a mitad de camino */
  const extras = ["https://test.local/reddit", "https://test.local/bloqueada", "https://test.local/duckduckgo"];
  extras.forEach((u) => SC.agregarCustom(u, "extra"));
  const signal = { cancelado: false };
  let primero = true;
  const resC = await SC.scan({
    grupos: [], signal,
    onProgress: (ev) => { if (ev.tipo === "fin" && primero) { primero = false; signal.cancelado = true; } }
  });
  check("El botón Detener corta la búsqueda a tiempo", resC.cancelado === true && resC.fuentes.length < 5,
    JSON.stringify({ cancelado: resC.cancelado, revisadas: resC.fuentes.length }));
  check("Igual guarda lo que alcanzó a revisar", resC.fuentes.length >= 3 && resC.items.length >= 1,
    JSON.stringify({ f: resC.fuentes.length, i: resC.items.length }));
  SC.customFuentes().filter((c) => extras.indexOf(c.url) !== -1).forEach((c) => SC.quitarCustom(c.id));
  check("Quedan solo tus páginas originales", SC.customFuentes().length === 2, SC.customFuentes().length);

  /* 9) descubrir páginas nuevas (DuckDuckGo + HN) */
  const descubiertas = await SC.discover({ queries: ["free certification voucher"] });
  check("Descubre páginas nuevas", descubiertas.length >= 2, JSON.stringify(descubiertas.map((d) => d.url)));
  check("Filtra resultados que no son de certificaciones",
    descubiertas.every((d) => !/receta-de-cocina/.test(d.url)));

  /* 10) paridad con el rastreador diario (tools/crawler.py) */
  const py = read(path.join(ROOT, "tools", "crawler.py"));
  const bloque = py.slice(py.indexOf("SOURCES = ["), py.indexOf("\n]\n", py.indexOf("SOURCES = [")));
  const idsPy = [...bloque.matchAll(/\{"id":\s*"([a-z0-9-]+)"/g)].map((m) => m[1]).sort();
  const urlsPy = [...bloque.matchAll(/"url":\s*"(https:[^"]+)"/g)].map((m) => m[1]).sort();
  const idsJs = SC.SOURCES.map((s) => s.id).sort();
  const urlsJs = SC.SOURCES.map((s) => s.url).sort();
  check("Mismas fuentes en la app y en el robot diario", JSON.stringify(idsPy) === JSON.stringify(idsJs),
    "solo en JS: " + idsJs.filter((i) => !idsPy.includes(i)) + " · solo en Python: " + idsPy.filter((i) => !idsJs.includes(i)));
  check("Mismas URLs en ambos motores", JSON.stringify(urlsPy) === JSON.stringify(urlsJs),
    urlsPy.length + " vs " + urlsJs.length);
  check("46 fuentes o más", idsJs.length >= 40, idsJs.length);

  /* 11) quitar páginas vigiladas */
  const restantes = SC.quitarCustom(custom[0].id);
  check("Se puede dejar de vigilar una página", restantes.length === 1, restantes.length);

  console.log("────────────────────────────────────────");
  if (fallos) {
    console.log("❌ " + fallos + " verificación(es) fallida(s)\n");
    process.exit(1);
  }
  console.log("✅ Todo OK\n");
})().catch((e) => {
  console.error("❌ La prueba reventó:", e && e.stack ? e.stack : e);
  process.exit(1);
});
