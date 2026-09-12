/* Certf — lógica de la app (vanilla JS, sin dependencias) */
(function () {
  "use strict";

  var DATA = window.__CERTF__ || { certs: [], deadlines: [], tips: [], updated: "" };
  var NOV = window.__CERTF_NOVEDADES__ || { checked: "", items: [] };
  if (!Array.isArray(NOV.items)) NOV.items = [];
  var SC = window.CertfScanner || null;

  var STORE_KEY = "certf.mias.v1";
  var PREFS_KEY = "certf.prefs.v1";
  var NOV_PREFS_KEY = "certf.novprefs.v1";
  var MJ_KEY = "certf.mj.v1";      // mejoras del backlog marcadas como hechas (solo local)
  var AI_KEY = "certf.ai.v1";      // endpoint/modelo/clave de la IA opcional (solo local)

  var MJ = window.__CERTF_MEJORAS__ || null;
  var mjState = load(MJ_KEY, { hechas: {} });

  /* ---------- utilidades ---------- */
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function today() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function parseDate(iso) {
    if (!iso) return null;
    var p = String(iso).split("-");
    if (p.length !== 3) return null;
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function diasRestantes(iso) {
    var d = parseDate(iso);
    if (!d) return null;
    return Math.round((d - today()) / 86400000);
  }
  function fmtFecha(iso) {
    var d = parseDate(iso);
    if (!d) return iso || "—";
    return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
  }
  function claseDias(n) {
    if (n === null) return "d-pass";
    if (n < 0) return "d-pass";
    if (n <= 7) return "d-bad";
    if (n <= 30) return "d-warn";
    return "d-ok";
  }
  function textoDias(n) {
    if (n === null) return "sin fecha";
    if (n < 0) return "vencida";
    if (n === 0) return "HOY";
    if (n === 1) return "mañana";
    return "en " + n + " días";
  }
  function haceCuando(iso) {
    if (!iso) return "pendiente";
    var t = new Date(iso).getTime();
    if (isNaN(t)) return "fecha inválida";
    var min = Math.round((Date.now() - t) / 60000);
    if (min < 1) return "recién";
    if (min < 60) return "hace " + min + " min";
    var h = Math.round(min / 60);
    if (h < 48) return "hace " + h + " h";
    return "hace " + Math.round(h / 24) + " días";
  }
  function horasDesde(iso) {
    if (!iso) return Infinity;
    var t = new Date(iso).getTime();
    if (isNaN(t)) return Infinity;
    return (Date.now() - t) / 3600000;
  }
  function load(key, def) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : def;
    } catch (e) { return def; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  var TIPO_LABEL = { gratis: "Todo gratis", beca: "Beca", descuento: "Descuento", estudiante: "Estudiante" };
  var ESTADOS = ["Pendiente", "En curso", "Obtenida"];

  var mis = load(STORE_KEY, {});
  var prefs = load(PREFS_KEY, { tipo: "all", cat: "all", sort: "peso", desc: "all", formato: "all", idioma: "all", peso: "all", objetivo: { puesto: "", horas: "", nivel: "" } });
  if (!prefs.objetivo) prefs.objetivo = {};
  var novPrefs = load(NOV_PREFS_KEY, { filtro: "all" });
  var query = "";
  var scanActivo = false;
  var scanSignal = null;
  var ultimoScan = SC ? SC.scanGuardado() : null;

  /* ---------- descuento: la respuesta inmediata ---------- */
  function etiquetaDescuento(c) {
    if (c.disc === 100) return c.t === "beca" ? "Beca 100%" : "100% GRATIS";
    if (typeof c.disc === "number" && c.disc > 0) return c.disc + "% DTO";
    if (c.t === "beca") return "Beca";
    if (c.t === "estudiante") return "Gratis estudiante";
    return "";
  }
  function claseDescuento(c) {
    if (c.disc === 100 && c.t !== "beca") return "dsc-100";
    if (typeof c.disc === "number" && c.disc >= 50) return "dsc-50";
    if (typeof c.disc === "number") return "dsc-otro";
    return "dsc-beca";
  }
  function cumpleDesc(c, filtro) {
    if (filtro === "all") return true;
    if (filtro === "100") return c.disc === 100;
    if (filtro === "50") return c.disc === 50;
    if (filtro === "otro") return typeof c.disc === "number" && c.disc > 0 && c.disc !== 100 && c.disc !== 50;
    if (filtro === "beca") return c.t === "beca" || c.t === "estudiante";
    return true;
  }
  function cumpleIdioma(c, filtro) {
    if (filtro === "all") return true;
    var l = String(c.lang || "").toLowerCase();
    if (filtro === "es") return l.indexOf("español") !== -1 || l.indexOf("multilenguaje") !== -1 || l.indexOf("idiomas") !== -1;
    if (filtro === "en") return l.indexOf("ingl") !== -1 || l.indexOf("multilenguaje") !== -1 || l.indexOf("idiomas") !== -1;
    return true;
  }
  function clasePeso(p) {
    p = Number(p) || 0;
    if (p >= 8) return "alta";
    if (p >= 6) return "media";
    return "";
  }
  function etiquetaPrimaria(c) {
    if (c.disc === 100 && c.t !== "beca") return "Postular ahora";
    if (c.t === "beca") return "Postular a la beca";
    if (c.t === "estudiante") return "Postular (estudiante)";
    return "Ver oferta";
  }

  /* ---------- Siguiente acción: lo más útil para el objetivo, hoy ---------- */
  function siguienteAccion() {
    var enCurso = DATA.certs.filter(function (c) { return mis[c.id] && mis[c.id].estado === "En curso" && mis[c.id].fecha; })
      .sort(function (a, b) { return (parseDate(mis[a.id].fecha) || new Date(9e15)) - (parseDate(mis[b.id].fecha) || new Date(9e15)); });
    if (enCurso.length) {
      var e = enCurso[0];
      var n = diasRestantes(mis[e.id].fecha);
      return { kind: "mias", texto: "Sigue: " + e.n + " · " + textoDias(n) + " · CV " + e.p + "/10", btn: "Ver mis certificaciones" };
    }
    var pendientes = DATA.certs.filter(function (c) { return mis[c.id] && mis[c.id].estado !== "Obtenida"; })
      .sort(function (a, b) { return String((mis[a.id] || {}).added || "").localeCompare(String((mis[b.id] || {}).added || "")); });
    if (pendientes.length) {
      var p = pendientes[0];
      return { kind: "cert", cert: p, texto: "Toca el botón para postular: " + p.n + " · CV " + p.p + "/10 · " + etiquetaDescuento(p), btn: etiquetaPrimaria(p), url: p.url };
    }
    var gratis = DATA.certs.filter(function (c) { return c.disc === 100 && c.t !== "beca"; })
      .sort(function (a, b) { return b.p - a.p || a.n.localeCompare(b.n, "es"); });
    if (gratis.length) {
      var g = gratis[0];
      return { kind: "cert", cert: g, texto: "Empieza hoy, 100% gratis (mayor peso en el CV): " + g.n + " · CV " + g.p + "/10", btn: "Postular ahora", url: g.url };
    }
    return { kind: "catalogo", texto: "Explora el catálogo ordenado por peso en el CV.", btn: "Ver catálogo" };
  }
  function renderSiguiente() {
    var el = $("#siguiente");
    if (!el) return;
    var a = siguienteAccion();
    var obj = prefs.objetivo || {};
    var extra = "";
    if (obj.horas === "0") extra = " · Esta semana tienes 0 h: agenda al menos un bloque";
    else if (obj.puesto) extra = " · Puesto: " + obj.puesto;
    var html = '<span class="sig-label">Siguiente acción</span><span class="sig-texto">' + esc(a.texto) + esc(extra) + "</span>";
    if (a.kind === "cert") html += '<a class="btn sig-btn" target="_blank" rel="noopener" href="' + esc(a.url) + '">' + esc(a.btn) + "</a>";
    else if (a.kind === "mias") html += '<button class="btn sig-btn" data-sig="mias">' + esc(a.btn) + "</button>";
    else html += '<button class="btn sig-btn" data-sig="catalogo">' + esc(a.btn) + "</button>";
    el.innerHTML = html;
  }

  /* ---------- catálogo ---------- */
  function certsFiltrados() {
    var q = query.trim().toLowerCase();
    var out = DATA.certs.filter(function (c) {
      if (prefs.tipo !== "all" && c.t !== prefs.tipo) return false;
      if (prefs.cat !== "all" && c.c !== prefs.cat) return false;
      if (!cumpleDesc(c, prefs.desc || "all")) return false;
      if ((prefs.formato || "all") !== "all" && (c.kind || "cert") !== prefs.formato) return false;
      if (!cumpleIdioma(c, prefs.idioma || "all")) return false;
      if ((prefs.peso || "all") !== "all" && (c.p || 0) < Number(prefs.peso)) return false;
      if (!q) return true;
      var hay = [c.n, c.i, c.c, c.note, c.cond, c.lang, c.kind, c.examen, c.peso_n].join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    out.sort(function (a, b) {
      if (prefs.sort === "nombre") return a.n.localeCompare(b.n, "es");
      if (prefs.sort === "institucion") return a.i.localeCompare(b.i, "es") || b.p - a.p;
      if (prefs.sort === "descuento") return (b.disc || 0) - (a.disc || 0) || b.p - a.p;
      if (prefs.sort === "urgencia") {
        var da = deadlineOf(a), db = deadlineOf(b);
        var na = da ? diasRestantes(da.date) : 9999;
        var nb = db ? diasRestantes(db.date) : 9999;
        return na - nb || b.p - a.p;
      }
      return b.p - a.p || a.n.localeCompare(b.n, "es");
    });
    return out;
  }

  function deadlineOf(cert) {
    if (!cert.deadline) return null;
    for (var i = 0; i < DATA.deadlines.length; i++) {
      if (DATA.deadlines[i].id === cert.deadline) return DATA.deadlines[i];
    }
    return null;
  }

  function cardCatalogo(c) {
    var dl = deadlineOf(c);
    var siguiendo = !!mis[c.id];
    var dias = dl ? diasRestantes(dl.date) : null;
    var dsc = etiquetaDescuento(c);
    var html = "";
    html += '<article class="card" data-id="' + esc(c.id) + '">';
    html += '<div class="card-top"><div><h3>' + esc(c.n) + '</h3><div class="inst">' + esc(c.i) + "</div></div>";
    html += '<span class="peso ' + clasePeso(c.p) + '" title="Peso estimado en el CV: ' + esc(c.peso_n || "ver razon abajo") + '">CV ' + c.p + "/10</span></div>";
    if (dsc) {
      html += '<p class="desc-line"><span class="desc ' + claseDescuento(c) + '">' + esc(dsc) + "</span>" +
        '<span class="tipo ' + ((c.kind === "badge") ? "t-badge" : "t-cert") + '">' + (c.kind === "badge" ? "Badge" : "Certificación") + "</span></p>";
    }
    html += '<p class="cond"><span class="tipo t-' + esc(c.t) + '">' + esc(TIPO_LABEL[c.t] || c.t) + "</span>" + esc(c.cond) + "</p>";
    html += '<p class="note">' + esc(c.note) + "</p>";
    html += '<p class="meta">Idioma: <b>' + esc(c.lang) + "</b> · Área: <b>" + esc(c.c) + "</b> · Examen: <b>" + esc(c.examen || "a confirmar") + "</b> · Verificación: <b>" + esc(c.verify) + "</b></p>";
    if (c.peso_n) html += '<p class="meta peso-razon"><b>Por qué pesa en el CV:</b> ' + esc(c.peso_n) + "</p>";
    if (dl) {
      html += '<p class="meta">Fecha crítica: <b class="' + claseDias(dias) + '">' + esc(dl.title) + " — " + textoDias(dias) + "</b> (" + fmtFecha(dl.date) + ")</p>";
    }
    html += '<div class="row">';
    html += '<a class="btn" target="_blank" rel="noopener" href="' + esc(c.url) + '">' + esc(etiquetaPrimaria(c)) + "</a>";
    html += '<button class="btn btn-ghost" data-act="seguir">' + (siguiendo ? "Siguiendo" : "Seguir") + "</button>";
    if (siguiendo) html += '<button class="btn btn-ghost" data-act="ver-mia">Ver en mis certificaciones</button>';
    html += "</div></article>";
    return html;
  }

  function renderCatalogo() {
    var list = certsFiltrados();
    $("#lista").innerHTML = list.length
      ? list.map(cardCatalogo).join("")
      : '<p class="empty">No hay resultados con esos filtros.</p>';
    $("#counts").textContent = list.length + " de " + DATA.certs.length + " credenciales";
    var g100 = list.filter(function (c) { return c.disc === 100 && c.t !== "beca"; }).length;
    var g50 = list.filter(function (c) { return c.disc === 50; }).length;
    var badges = list.filter(function (c) { return c.kind === "badge"; }).length;
    var becas = list.filter(function (c) { return c.t === "beca" && c.disc === 100; }).length;
    var el = $("#counts-desc");
    if (el) el.textContent = " · " + g100 + " gratis al 100% · " + becas +
      " becas hasta 100% · " + g50 + " al 50% · " + badges + " badges";
  }

  /* ---------- mis certificaciones ---------- */
  function cardMia(c) {
    var m = mis[c.id] || {};
    var estado = m.estado || "Pendiente";
    var dias = m.fecha ? diasRestantes(m.fecha) : null;
    var html = "";
    html += '<article class="card" data-id="' + esc(c.id) + '">';
    html += '<div class="card-top"><div><h3>' + esc(c.n) + '</h3><div class="inst">' + esc(c.i) + "</div></div>";
    html += '<span class="estado e-' + (estado === "Obtenida" ? "obtenida" : estado === "En curso" ? "curso" : "") + '">' + esc(estado) + "</span></div>";
    html += '<p class="cond"><span class="desc ' + claseDescuento(c) + '">' + esc(etiquetaDescuento(c)) + "</span> " + esc(c.cond) + "</p>";
    html += '<div class="row"><label class="sort" style="flex:1 1 140px">Estado<select data-act="estado">';
    ESTADOS.forEach(function (e) {
      html += '<option value="' + e + '"' + (e === estado ? " selected" : "") + ">" + e + "</option>";
    });
    html += "</select></label>";
    html += '<label class="sort" style="flex:1 1 160px">Fecha objetivo<input type="date" data-act="fecha" value="' + esc(m.fecha || "") + '"></label></div>';
    if (m.fecha) {
      html += '<p class="meta">Tu plazo: <b class="' + claseDias(dias) + '">' + textoDias(dias) + "</b> (" + fmtFecha(m.fecha) + ")</p>";
    }
    html += '<div class="row"><textarea data-act="nota" rows="2" placeholder="Notas (código de cupón, usuario, progreso…)">' + esc(m.nota || "") + "</textarea></div>";
    html += '<div class="row"><a class="btn" target="_blank" rel="noopener" href="' + esc(c.url) + '">Abrir enlace</a>';
    html += '<button class="btn btn-danger" data-act="quitar">Quitar</button></div>';
    html += "</article>";
    return html;
  }

  function renderMias() {
    var ids = Object.keys(mis);
    var items = DATA.certs.filter(function (c) { return !!mis[c.id]; });
    $("#lista-mias").innerHTML = items.map(cardMia).join("");
    $("#mias-vacio").classList.toggle("hidden", items.length > 0);
    var badge = $("#badge-mias");
    badge.textContent = ids.length;
    badge.classList.toggle("hidden", ids.length === 0);

    var o = 0, e = 0, p = 0, pts = 0;
    ids.forEach(function (id) {
      var s = (mis[id] || {}).estado || "Pendiente";
      if (s === "Obtenida") { o++; var c = certPorId(id); if (c) pts += c.p || 0; }
      else if (s === "En curso") e++; else p++;
    });
    $("#resumen").innerHTML =
      '<div class="kpi"><b>' + ids.length + "</b><span>seguidas</span></div>" +
      '<div class="kpi"><b style="color:var(--warn)">' + e + "</b><span>en curso</span></div>" +
      '<div class="kpi"><b style="color:var(--ok)">' + o + "</b><span>obtenidas</span></div>" +
      '<div class="kpi"><b style="color:var(--ok)">' + pts + "</b><span>puntos CV obtenidos</span></div>" +
      '<div class="kpi"><b>' + p + "</b><span>pendientes</span></div>" +
      '<div class="kpi"><b>' + DATA.deadlines.length + "</b><span>fechas críticas</span></div>" +
      '<div class="kpi"><b>' + DATA.certs.filter(function (c) { return c.disc === 100; }).length + "</b><span>hasta 100% gratis</span></div>";
    renderSiguiente();
  }

  /* ---------- AUTO-MEJORA: la app con su propio backlog ---------- */
  function mjPendiente(m) { return !mjState.hechas[m.id]; }
  function mjOrden(a, b) {
    var pv = { P0: 0, P1: 1, P2: 2 };
    var pa = pv.hasOwnProperty(a.p) ? pv[a.p] : 3;
    var pb = pv.hasOwnProperty(b.p) ? pv[b.p] : 3;
    return pa - pb || b.i - a.i || a.id - b.id;
  }
  function mjSiguientes(n) {
    if (!MJ || !Array.isArray(MJ.mejoras)) return [];
    return MJ.mejoras.filter(mjPendiente).sort(mjOrden).slice(0, n);
  }
  function promptMejora(m) {
    return "Tienes el repo Certf (LeoAra03/Certf): PWA en web/ (HTML+CSS+JS vanilla, sin dependencias) y app Android en android/ que sirve la misma web/.\n" +
      "Implementa la mejora #" + m.id + " de docs/1000-mejoras.json (sección " + m.seccion + ", prioridad " + m.p + ", esfuerzo " + m.e + ", impacto " + m.i + "/5):\n" +
      "«" + m.t + "»\n" +
      "Requisitos duros del proyecto:\n" +
      "- 0 emojis en cualquier parte (UI, textos, commits).\n" +
      "- Mobile-first: la interfaz debe verse útil en celular; textos en español.\n" +
      "- Cero descuentos fantasmas: cualquier porcentaje debe seguir con fuente y evidencia verificable.\n" +
      "- Si tocas web/data.js, regenera web/data.json con tools/build_data.py y web/mejoras.js con tools/build_mj.py.\n" +
      "- Actualiza tools/smoke_test.js (y tools/scanner_test.js si aplica) y deja toda la batería en verde (node tools/smoke_test.js y node tools/scanner_test.js).\n" +
      "- Commitea en la rama actual citando la id (ej: 'Mejora #" + m.id + ": ...'). El push recompila solo la APK vía GitHub Actions.\n" +
      "Al terminar, responde en máximo 5 líneas: qué cambiaste, cómo se ve en el celular y cómo verificarlo.";
  }
  function cardSugerencia(m) {
    var hecha = !!mjState.hechas[m.id];
    var html = '<article class="card mj-card' + (hecha ? " mj-hecha" : "") + '" data-mj="' + m.id + '">';
    html += '<div class="card-top"><div><b class="mj-titulo">Mejora #' + m.id + "</b><div class=\"inst\">" + esc(m.seccion) + "</div></div>" +
      '<span class="peso ' + (m.p === "P0" ? "alta" : m.p === "P1" ? "media" : "") + '">[' + esc(m.p) + "] · " + esc(m.e) + " · impacto " + m.i + "/5</span></div>";
    html += '<p class="note">' + esc(m.t) + "</p>";
    html += '<div class="row">';
    html += '<button class="btn btn-small" data-mj-copiar="' + m.id + '">Copiar prompt para el asistente</button>';
    html += '<button class="btn btn-ghost btn-small" data-mj-hecha="' + m.id + '">' + (hecha ? "Deshacer (volver al backlog)" : "Marcar como hecha") + "</button>";
    html += "</div></article>";
    return html;
  }
  function renderMejoras() {
    var res = $("#resumen-mj"), cont = $("#lista-sug");
    if (!res || !cont) return;
    if (!MJ || !Array.isArray(MJ.mejoras)) {
      res.innerHTML = "";
      cont.innerHTML = '<p class="empty">El backlog no se cargó (falta web/mejoras.js).</p>';
      return;
    }
    var total = MJ.mejoras.length;
    var hechas = MJ.mejoras.filter(function (m) { return mjState.hechas[m.id]; }).length;
    var p0 = MJ.mejoras.filter(function (m) { return m.p === "P0" && mjPendiente(m); }).length;
    var p1 = MJ.mejoras.filter(function (m) { return m.p === "P1" && mjPendiente(m); }).length;
    res.innerHTML =
      '<div class="kpi"><b>' + total + "</b><span>mejoras en el backlog</span></div>" +
      '<div class="kpi"><b style="color:var(--ok)">' + hechas + "</b><span>hechas</span></div>" +
      '<div class="kpi"><b style="color:var(--ok)">' + p0 + "</b><span>P0 pendientes</span></div>" +
      '<div class="kpi"><b style="color:var(--acc)">' + p1 + "</b><span>P1 pendientes</span></div>" +
      '<div class="kpi"><b>' + Math.round((hechas / Math.max(total, 1)) * 100) + "%</b><span>progreso</span></div>";
    var badge = $("#badge-mj");
    if (badge) { badge.textContent = String(p0); badge.classList.toggle("hidden", p0 === 0); }
    cont.innerHTML = mjSiguientes(3).map(cardSugerencia).join("") || '<p class="empty">Backlog completo: todo el plan está implementado.</p>';
  }
  function copiarPrompt(m) {
    var texto = promptMejora(m);
    copiar(texto);
    avisar("Prompt de la mejora #" + m.id + " copiado", "Pégalo en Arena, ChatGPT, Claude o Cursor. Incluye todos los requisitos duros del proyecto.");
  }
  function aiConfig() {
    return load(AI_KEY, { endpoint: "", model: "", key: "" });
  }
  function guardarMejorasIA() {
    var cfg = aiConfig();
    var ep = ($("#ai-endpoint") || {}).value, mo = ($("#ai-model") || {}).value, ke = ($("#ai-key") || {}).value;
    if (ep !== undefined) cfg.endpoint = String(ep || "").trim();
    if (mo !== undefined) cfg.model = String(mo || "").trim();
    if (ke !== undefined) cfg.key = String(ke || "").trim();
    save(AI_KEY, cfg);
  }
  function generarMejorasIA() {
    var out = $("#ai-out");
    if (!out) return;
    guardarMejorasIA();
    var cfg = aiConfig();
    if (!cfg.key) { out.classList.remove("hidden"); out.textContent = "Falta la clave API: guárdala arriba (se queda solo en este teléfono) o usa 'Copiar prompt' y pega el texto en cualquier asistente."; return; }
    var endpoint = (cfg.endpoint || "https://api.openai.com/v1/chat/completions").replace(/\/+$/, "");
    if (endpoint.indexOf("/chat/completions") === -1) endpoint += "/chat/completions";
    var model = cfg.model || "gpt-4o-mini";
    var top = mjSiguientes(10).map(function (m) { return "#" + m.id + " [" + m.p + "] " + m.t; }).join("\n");
    var ids = Object.keys(mis);
    var contexto = "App Certf (PWA + Android, vanilla JS): ayuda a un usuario particular a conseguir certificaciones y badges 100% gratis o verificadamente con descuento, con peso real en el CV, mobile-first, 0 emojis y cero descuentos fantasmas.\n" +
      "Estado local del usuario: " + ids.length + " credenciales seguidas, " +
      ids.filter(function (id) { return (mis[id] || {}).estado === "Obtenida"; }).length + " obtenidas.\n" +
      "Backlog pendiente (siguientes 10):\n" + (top || "ninguno") + "\n\n" +
      "Propón las 3 mejoras que mejor mueven el objetivo (acceso gratis, peso en el CV, utilidad en celular). Para cada una da: id sugerida dentro de las pendientes, que se agrega en qué archivo, y los pasos concretos de implementación en el repo. Máximo 200 palabras. Sin emojis.";
    out.classList.remove("hidden");
    out.textContent = "Pidiendo sugerencias a " + model + "…";
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + cfg.key },
      body: JSON.stringify({ model: model, messages: [
        { role: "system", content: "Eres el copiloto de auto-mejora de la app Certf. Responde en español, directo y accionable, sin emojis." },
        { role: "user", content: contexto }
      ] })
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (j) {
      var txt = j && j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : "Respuesta inesperada del modelo.";
      out.textContent = String(txt).trim();
    }).catch(function (e) {
      out.textContent = "No se pudo obtener la respuesta: " + ((e && e.message) || e) + ". Revisa endpoint, modelo y clave. También puedes usar 'Copiar prompt' y pegar el texto en cualquier asistente.";
    });
  }

  /* ---------- alertas ---------- */
  function cardAlerta(d) {
    var n = diasRestantes(d.date);
    var cls = n !== null && n <= 7 ? "urgente" : (n !== null && n <= 30 ? "proxima" : "");
    return '<div class="alerta ' + cls + '" data-dl="' + esc(d.id) + '">' +
      '<div class="cuando"><b class="' + claseDias(n) + '">' + (n !== null && n >= 0 ? n : "—") + "</b><span>" + (n === 1 ? "día" : "días") + "</span></div>" +
      "<div><h3>" + esc(d.title) + (d.approx ? ' <span class="meta">(fecha aprox.)</span>' : "") + "</h3>" +
      '<p class="meta">' + fmtFecha(d.date) + " · " + esc(textoDias(n)) + "</p>" +
      '<p class="note">' + esc(d.note) + "</p>" +
      '<div class="row"><a class="btn btn-small" target="_blank" rel="noopener" href="' + esc(d.url) + '">Ir a la fuente</a></div>' +
      "</div></div>";
  }

  function renderAlertas() {
    var ds = DATA.deadlines.slice().sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
    $("#lista-alertas").innerHTML = ds.map(cardAlerta).join("");

    var personales = DATA.certs.filter(function (c) { return mis[c.id] && mis[c.id].fecha; })
      .map(function (c) {
        return { id: c.id, title: c.n, date: mis[c.id].fecha, note: "Tu fecha objetivo para: " + c.n, url: c.url, approx: false };
      })
      .sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
    $("#lista-alertas-personales").innerHTML = personales.map(cardAlerta).join("");
    $("#alertas-personales-vacio").classList.toggle("hidden", personales.length > 0);

    var urgentes = ds.filter(function (d) { var n = diasRestantes(d.date); return n !== null && n >= 0 && n <= 14; }).length;
    var badge = $("#badge-alertas");
    badge.textContent = urgentes;
    badge.classList.toggle("hidden", urgentes === 0);

    var perm = typeof Notification !== "undefined" ? Notification.permission : "unsupported";
    var txt = {
      granted: "Notificaciones activas en este dispositivo.",
      denied: "Bloqueaste las notificaciones. Habilítalas en los ajustes del sitio/app.",
      default: "Notificaciones sin activar.",
      unsupported: "Este navegador no soporta notificaciones; la app Android usa alarmas nativas."
    };
    $("#estado-notif").textContent = txt[perm] || txt.default;
    $("#btn-permiso").classList.toggle("hidden", perm === "granted" || perm === "unsupported");
  }

  /* Categorización ordenada de los hallazgos (prioridad: urgencia de canje).
     Mismo orden en la app, en el rastreador y en el prompt del asistente. */
  var SECCIONES = [
    { id: "unico",     titulo: "Códigos de un solo uso",           nota: "Canjea primero: cuando se agota, no vuelve." },
    { id: "gratis",    titulo: "100% gratis (100% OFF)",           nota: "Sin costo. Guarda la URL de verificación de la credencial." },
    { id: "dto50",     titulo: "50% de descuento",                 nota: "Aplica el código en el checkout oficial del proveedor." },
    { id: "dtoo",      titulo: "Otro descuento",                   nota: "El porcentaje sale de la frase verificada en la página." },
    { id: "beca",      titulo: "Becas y ayuda financiera",         nota: "Postula; el monto depende de la aprobación (75-100%)." },
    { id: "badge",     titulo: "Badges y credenciales digitales",  nota: "Llenan LinkedIn con evidencia mientras preparas el examen." },
    { id: "comunidad", titulo: "Leaks y códigos de comunidad",     nota: "Fuente no oficial: confirma en el checkout del proveedor antes de pagar o postular." },
    { id: "otro",      titulo: "Resto de hallazgos",               nota: "Sin descuento explícito: revisa la fuente antes de actuar." }
  ];
  function categoriaDe(v) {
    if (v.unico) return "unico";
    if (v.grupo === "comunidad" || v.grupo === "agregador") return "comunidad";
    if (v.beca) return "beca";
    if (v.disc === 100) return "gratis";
    if (v.disc === 50) return "dto50";
    if (typeof v.disc === "number" && v.disc > 0) return "dtoo";
    if (v.badge) return "badge";
    return "otro";
  }
  function tituloCategoria(id) {
    for (var i = 0; i < SECCIONES.length; i++) if (SECCIONES[i].id === id) return SECCIONES[i].titulo;
    return "Otros";
  }
  function esFuenteOficial(v) {
    return v.grupo === "oficial" || v.grupo === "badges" || v.grupo === "es" || v.grupo === "custom";
  }

  /* ---------- RUTA 0 A PRO (de cero experiencia a perfil profesional) ---------- */
function certPorId(id) {
    for (var i = 0; i < DATA.certs.length; i++) if (DATA.certs[i].id === id) return DATA.certs[i];
    return null;
  }
  function rutaActual() {
    var rutas = DATA.rutas || [];
    for (var i = 0; i < rutas.length; i++) if (rutas[i].id === (prefs.rutaArea || rutas[0] && rutas[0].id)) return rutas[i];
    return rutas[0] || null;
  }
  function renderChipsRuta() {
    var cont = $("#filtro-area");
    if (!cont) return;
    var r = rutaActual();
    cont.innerHTML = (DATA.rutas || []).map(function (x) {
      return '<button class="chip' + (r && x.id === r.id ? " active" : "") + '" data-area="' + esc(x.id) + '">' + esc(x.area) + "</button>";
    }).join("");
  }
  function renderRuta() {
    var cont = $("#lista-ruta");
    if (!cont) return;
    renderChipsRuta();
    var r = rutaActual();
    if (!r) { cont.innerHTML = '<p class="empty">Sin rutas definidas.</p>'; return; }
    var html = '<p class="muted">Meta: <b>' + esc(r.papel) + "</b> — " + r.fases.length +
      " fases, cada una con varias opciones para elegir. Empieza la Fase 1 hoy y encadena desde ahí.</p>";
    r.fases.forEach(function (f) {
      html += '<div class="fase"><h3>Fase ' + f.n + " · " + esc(f.titulo) + ' <span class="meta">(' + esc(f.plazo) + ")</span></h3>";
      html += '<p class="meta">' + esc(f.objetivo) + "</p>";
      html += '<ul class="fase-lista">';
      (f.ids || []).forEach(function (id) {
        var c = certPorId(id);
        if (!c) return;
        var siguiendo = !!mis[id];
        html += '<li class="fase-item"><div class="fase-top"><b>' + esc(c.n) +
          '</b> <span class="desc ' + claseDescuento(c) + '">' + esc(etiquetaDescuento(c) || "Verificable") + "</span></div>" +
          '<p class="meta small">CV ' + c.p + '/10 · Examen: ' + esc(c.examen || "a confirmar") + " · " + esc(c.i) + " · " + esc(c.lang) + " · Verificación: " + esc(c.verify) + "</p>" +
          '<div class="row"><a class="btn btn-small" target="_blank" rel="noopener" href="' + esc(c.url) + '">Abrir enlace</a>' +
          '<button class="btn btn-ghost btn-small" data-ruta-seguir="' + esc(id) + '">' + (siguiendo ? "Siguiendo" : "Seguir") + "</button></div></li>";
      });
      if (f.fechas && f.fechas.length) {
        html += '<li class="fase-item fase-fechas"><b>Fechas a vigilar (vouchers por evento):</b><ul class="fase-fechas">';
        f.fechas.forEach(function (fid) {
          var d = null;
          for (var i = 0; i < DATA.deadlines.length; i++) if (DATA.deadlines[i].id === fid) d = DATA.deadlines[i];
          if (!d) return;
          var n = diasRestantes(d.date);
          html += "<li>" + esc(d.title) + " — " + fmtFecha(d.date) + ' <span class="' + claseDias(n) + '">(' + textoDias(n) + ")</span></li>";
        });
        html += "</ul></li>";
      }
      html += "</ul></div>";
    });
    cont.innerHTML = html;
  }

  /* ---------- BUSCAR PÁGINAS EN VIVO ---------- */
  function gruposDeScan() {
    var chk = $("#chk-comunidad");
    var base = ["oficial", "badges", "es"];
    if (chk && chk.checked) base = base.concat(["comunidad", "agregador"]);
    return base;
  }

  function etiquetaBuscar(activo) {
    var corto = typeof window.innerWidth === "number" && window.innerWidth < 520;
    if (activo) return corto ? "…" : "Buscando…";
    return corto ? "Buscar" : "Buscar páginas";
  }

  function setScanUI(activo) {
    scanActivo = activo;
    var b1 = $("#btn-scan"), b2 = $("#btn-buscar"), b3 = $("#btn-discover"), st = $("#btn-stop");
    [b1, b2, b3].forEach(function (b) { if (b) b.disabled = activo; });
    if (b1) b1.textContent = activo ? "Buscando páginas…" : "Buscar páginas y actualizar ahora";
    if (b2) b2.textContent = etiquetaBuscar(activo);
    if (b2) b2.title = "Revisa ahora las páginas oficiales y busca descuentos, códigos y badges";
    if (st) st.classList.toggle("hidden", !activo);
    var p = $("#scan-progreso");
    if (p) p.classList.toggle("hidden", !activo);
  }

  function progreso(ev) {
    var barra = $("#scan-barra"), est = $("#scan-estado");
    if (ev.tipo === "listo") {
      if (barra) barra.style.width = "100%";
      if (est) est.textContent = "Listo.";
      return;
    }
    var pct = ev.total ? Math.round((ev.hechas / ev.total) * 100) : 0;
    if (barra) barra.style.width = pct + "%";
    if (!est) return;
    if (ev.tipo === "inicio") {
      est.textContent = "Revisando " + ev.total + " páginas… " + ev.hechas + " listas · ahora: " + ev.fuente.name;
    } else if (ev.tipo === "fin") {
      var r = ev.reg;
      est.textContent = (r.ok ? "OK · " : "Fallo · ") + r.name + (r.ok ? " · " + r.hallazgos + " hallazgo(s)" + (r.nuevos ? " (" + r.nuevos + " nuevo(s))" : "") : " · " + (r.error || "sin respuesta")) +
        " — " + ev.hechas + "/" + ev.total;
    }
  }

  function ejecutarBusqueda(opts) {
    if (!SC) { alert("El buscador no se cargó (falta scanner.js)."); return Promise.resolve(null); }
    if (scanActivo) return Promise.resolve(null);
    opts = opts || {};
    setScanUI(true);
    scanSignal = { cancelado: false };
    var t0 = Date.now();
    return SC.scan({
      grupos: opts.grupos || gruposDeScan(),
      ids: opts.ids,
      signal: scanSignal,
      onProgress: progreso
    }).then(function (res) {
      ultimoScan = res;
      setScanUI(false);
      renderNovedades();
      var seg = Math.round((Date.now() - t0) / 1000);
      avisarHallazgos(res);
      var tr = $("#scan-transporte");
      if (tr) tr.innerHTML = "Última búsqueda: <b>" + esc(haceCuando(res.checked)) + "</b> · " + res.okFuentes + "/" + res.totalFuentes +
        " páginas respondieron en " + seg + " s" + (res.cancelado ? " (detenida por ti)" : "") + " · " +
        (res.okFuentes ? "transporte usado: " + esc(transporteMasUsado(res))
          : "ninguna página respondió. Revisa tu conexión; en el navegador algunas páginas bloquean la lectura (CORS) — en la APK de Certf la descarga la hace tu teléfono.");
      if (opts.despues) opts.despues(res);
      return res;
    }, function (e) {
      setScanUI(false);
      var est = $("#scan-estado");
      if (est) est.textContent = "La búsqueda falló: " + ((e && e.message) || e);
      return null;
    });
  }

  function transporteMasUsado(res) {
    var c = {};
    (res.fuentes || []).forEach(function (f) { if (f.ok && f.transporte) c[f.transporte] = (c[f.transporte] || 0) + 1; });
    var mejor = "-", n = 0;
    Object.keys(c).forEach(function (k) { if (c[k] > n) { n = c[k]; mejor = k; } });
    return mejor;
  }

  function avisarHallazgos(res) {
    if (!res || !res.items) return;
    var nuevos = res.items.filter(function (i) { return i.nuevo; });
    if (!nuevos.length) return;
    var g = nuevos.filter(function (i) { return i.disc === 100; }).length;
    var d50 = nuevos.filter(function (i) { return i.disc === 50; }).length;
    var cod = nuevos.filter(function (i) { return i.codes && i.codes.length; }).length;
    var uni = nuevos.filter(function (i) { return i.unico; }).length;
    var partes = [];
    if (g) partes.push(g + " al 100% gratis");
    if (d50) partes.push(d50 + " al 50%");
    if (cod) partes.push(cod + " con código" + (uni ? " (" + uni + " de un solo uso)" : ""));
    avisar("Nuevos hallazgos", nuevos.length + " hallazgo(s) nuevo(s): " + (partes.length ? partes.join(" · ") : "revisa la pestaña Buscar páginas."));
  }

  /* --- tarjetas de hallazgos --- */
  function claseDescVivo(it) {
    if (it.disc === 100) return "dsc-100";
    if (it.disc === 50) return "dsc-50";
    if (typeof it.disc === "number" && it.disc > 0) return "dsc-otro";
    if (it.beca) return "dsc-beca";
    return "dsc-cambio";
  }
  function etiquetaViva(it) {
    if (it.etiqueta) return it.etiqueta;
    if (it.disc === 100) return "100% GRATIS";
    if (typeof it.disc === "number" && it.disc > 0) return it.disc + "% DESCUENTO";
    if (it.beca) return "BECA / AYUDA";
    return "SIN % EXPLÍCITO";
  }
  function cumpleFiltroNov(it, f) {
    if (f === "all") return true;
    if (f === "nuevos") return !!it.nuevo;
    if (f === "100") return it.disc === 100;
    if (f === "50") return it.disc === 50;
    if (f === "codigo") return !!(it.codes && it.codes.length);
    if (f === "unico") return !!it.unico;
    if (f === "badge") return !!it.badge;
    if (f === "es") return /es/i.test(String(it.lang || ""));
    if (f === "en") return /en/i.test(String(it.lang || ""));
    return true;
  }

  function cardHallazgo(v) {
    var html = "";
    html += '<article class="card nov' + (v.review ? " nov-review" : "") + (v.nuevo ? " nov-nueva" : "") + '" data-nov="' + esc(v.id) + '">';
    html += '<div class="card-top"><div><h3>' + esc(v.name) + '</h3><div class="inst">' + esc(fmtFecha(v.found)) + " · " + esc(haceCuando(v.found)) +
      (v.nuevo ? ' · <b class="pill-nuevo">NUEVO</b>' : "") + "</div></div>";
    html += '<span class="desc grande ' + claseDescVivo(v) + '">' + esc(etiquetaViva(v)) + "</span></div>";

    var pills = [];
    pills.push('<span class="pill pill-cat">' + esc(tituloCategoria(categoriaDe(v))) + "</span>");
    if (v.unico) pills.push('<span class="pill pill-unico">CÓDIGO DE UN SOLO USO</span>');
    if (v.badge) pills.push('<span class="pill pill-badge">badge / insignia</span>');
    if (v.beca && v.disc !== 100) pills.push('<span class="pill pill-beca">beca / ayuda financiera</span>');
    if (v.lang) pills.push('<span class="pill pill-lang">' + esc(v.lang) + "</span>");
    if (v.review) pills.push('<span class="pill pill-review">requiere revisión</span>');
    if (v.grupo === "agregador" || v.grupo === "comunidad") pills.push('<span class="pill pill-review">fuente no oficial: confirmar</span>');
    if (pills.length) html += '<p class="pills">' + pills.join("") + "</p>";

    html += '<p class="note"><b>Evidencia (frase de la página):</b> “' + esc(v.text) + "”</p>";

    if (v.codes && v.codes.length) {
      html += '<div class="codigos">';
      v.codes.forEach(function (c) {
        html += '<button class="codigo" data-code="' + esc(c) + '" title="Toca para copiar">' + esc(c) + "</button>";
      });
      html += "</div>";
    }

    html += '<p class="meta small verif">Verificación: ' + (esFuenteOficial(v) ? "fuente oficial" : "fuente no oficial: confirma en el checkout del proveedor antes de pagar o postular") + " · " + esc(v.name) + "</p>";
    html += '<div class="row"><a class="btn btn-small" target="_blank" rel="noopener" href="' + esc(v.url) + '">Ver fuente</a>';
    if (v.codes && v.codes.length) html += '<button class="btn btn-ghost btn-small" data-act="copiar-todos">Copiar código</button>';
    html += '<button class="btn btn-ghost btn-small" data-act="vigilar">Vigilar esta página</button>';
    html += "</div>";
    if (v.transporte) html += '<p class="meta small">Obtenido en vivo vía ' + esc(v.transporte) + " · " + esc(haceCuando(v.liveAt || v.found)) + "</p>";
    html += "</article>";
    return html;
  }

  function renderNovedades() {
    /* 1) resultados en vivo (de tu último "Buscar páginas") */
    var vivos = (ultimoScan && ultimoScan.items ? ultimoScan.items : []).map(function (i) {
      var c = SC ? SC.clasificar(i) : i;
      c.liveAt = (ultimoScan && ultimoScan.checked) || c.found;
      return c;
    });
    var filtro = novPrefs.filtro || "all";
    var visibles = vivos.filter(function (v) { return cumpleFiltroNov(v, filtro); });
    var htmlNov = "";
    SECCIONES.forEach(function (sec) {
      var items = visibles.filter(function (v) { return categoriaDe(v) === sec.id; });
      if (!items.length) return;
      htmlNov += '<h3 class="sec-h">' + esc(sec.titulo) + ' <span class="sec-n">(' + items.length + ")</span></h3>" +
        '<p class="sec-note">' + esc(sec.nota) + "</p>" + items.map(cardHallazgo).join("");
    });
    $("#lista-novedades").innerHTML = htmlNov;
    $("#novedades-vacio").classList.toggle("hidden", visibles.length > 0);

    /* resumen */
    var resumen = $("#scan-resumen");
    if (resumen) {
      if (vivos.length) {
        var r = ultimoScan || {};
        resumen.classList.remove("hidden");
        resumen.innerHTML =
          '<div class="kpi kpi-scan"><b>' + (r.nuevos || 0) + "</b><span>nuevos</span></div>" +
          '<div class="kpi kpi-scan kun"><b>' + vivos.filter(function (v) { return v.unico; }).length + "</b><span>único uso</span></div>" +
          '<div class="kpi kpi-scan k100"><b>' + vivos.filter(function (v) { return v.disc === 100; }).length + "</b><span>100% gratis</span></div>" +
          '<div class="kpi kpi-scan k50"><b>' + vivos.filter(function (v) { return v.disc === 50; }).length + "</b><span>50% dto</span></div>" +
          '<div class="kpi kpi-scan kod"><b>' + vivos.filter(function (v) { return v.disc && v.disc !== 100 && v.disc !== 50; }).length + "</b><span>otro %</span></div>" +
          '<div class="kpi kpi-scan kbeca"><b>' + vivos.filter(function (v) { return v.beca; }).length + "</b><span>becas</span></div>" +
          '<div class="kpi kpi-scan"><b>' + vivos.filter(function (v) { return v.codes && v.codes.length; }).length + "</b><span>códigos</span></div>" +
          '<div class="kpi kpi-scan"><b>' + vivos.filter(function (v) { return v.badge; }).length + "</b><span>badges</span></div>" +
          '<div class="kpi kpi-scan"><b>' + (r.okFuentes || 0) + "/" + (r.totalFuentes || 0) + "</b><span>páginas OK</span></div>";
      } else {
        resumen.classList.add("hidden");
        resumen.innerHTML = "";
      }
    }

    /* 2) estado por página */
    var lf = $("#lista-fuentes");
    if (lf) {
      var fs = (ultimoScan && ultimoScan.fuentes) || [];
      lf.innerHTML = fs.length ? fs.map(function (f) {
        return '<div class="fuente ' + (f.ok ? "ok" : "err") + '">' +
          '<span class="fuente-estado">' + (f.ok ? "OK" : "x") + "</span>" +
          '<span class="fuente-nombre">' + esc(f.name) + (f.hallazgos ? ' <b>' + f.hallazgos + " hallazgo(s)</b>" : "") +
          (f.nuevos ? ' <b class="pill-nuevo">' + f.nuevos + " nuevo(s)</b>" : "") + "</span>" +
          '<span class="fuente-det">' + esc(f.ok ? (f.transporte || "") : (f.error || "sin respuesta")) + "</span>" +
          '<button class="btn btn-ghost btn-small" data-act="revisar-fuente" data-url="' + esc(f.url) + '" data-nombre="' + esc(f.name) + '">Revisar</button>' +
          "</div>";
      }).join("") : '<p class="muted small">Aún no revisaste ninguna página.</p>';
      var n = $("#scan-fuentes-n");
      if (n) n.textContent = fs.length;
    }

    /* 3) badge de la pestaña */
    var nuevos = vivos.filter(function (v) { return v.nuevo; }).length;
    var badge = $("#badge-nov");
    badge.textContent = nuevos || (ultimoScan ? vivos.length : NOV.items.length);
    badge.classList.toggle("hidden", (nuevos || vivos.length || NOV.items.length) === 0);

    /* 4) rastreador diario (novedades.js) */
    var auto = NOV.items.slice().sort(function (a, b) { return (String(b.found) + String(b.id)).localeCompare(String(a.found) + String(a.id)); });
    var la = $("#lista-novedades-auto");
    if (la) {
      la.innerHTML = auto.length ? auto.map(function (v) { return cardHallazgo(SC ? SC.clasificar(v) : v); }).join("")
        : '<p class="empty">Sin novedades del rastreador automático por ahora.</p>';
    }
    var pend = auto.filter(function (v) { return v.review; }).length;
    var ne = $("#nov-estado");
    if (ne) {
      ne.innerHTML = "Última revisión automática: <b>" + esc(haceCuando(NOV.checked)) + "</b>" +
        (pend ? ' · <b class="d-warn">' + pend + " cambio(s) por revisar</b>" : " · sin cambios pendientes de revisión");
    }

    /* 5) sello de la cabecera */
    var lc = $("#last-check");
    if (lc) {
      var cuando = ultimoScan ? haceCuando(ultimoScan.checked) : "todavía no";
      lc.textContent = " · tu última búsqueda: " + cuando + " · rastreador: " + haceCuando(NOV.checked);
      lc.classList.toggle("stale", !ultimoScan || horasDesde(ultimoScan.checked) > 6);
    }

    renderCustom();
  }

  function renderCustom() {
    var el = $("#lista-custom");
    if (!el || !SC) return;
    var list = SC.customFuentes();
    el.innerHTML = list.length ? list.map(function (c) {
      return '<span class="custom-chip">' + esc(c.name) +
        ' <button class="x" data-act="quitar-custom" data-id="' + esc(c.id) + '" title="Dejar de vigilar">x</button></span>';
    }).join("") : '<span class="muted small">Sin páginas propias. Pega una URL arriba para vigilarla en cada búsqueda.</span>';
  }

  /* --- descubrir páginas nuevas --- */
  function descubrirPaginas() {
    if (!SC) return;
    var btn = $("#btn-discover");
    if (btn) { btn.disabled = true; btn.textContent = "Buscando páginas nuevas…"; }
    SC.discover({}).then(function (lista) {
      if (btn) { btn.disabled = false; btn.textContent = "Descubrir páginas nuevas"; }
      var panel = $("#panel-descubiertas");
      var cont = $("#lista-descubiertas");
      if (!panel || !cont) return;
      panel.classList.toggle("hidden", !lista.length);
      cont.innerHTML = lista.length ? lista.map(function (c) {
        return '<article class="card desc-card" data-url="' + esc(c.url) + '">' +
          '<div class="card-top"><div><h3>' + esc(c.titulo || c.url) + '</h3><div class="inst">' + esc(c.origen) + "</div></div></div>" +
          '<p class="meta small">' + esc(c.url) + "</p>" +
          '<div class="row"><button class="btn btn-small" data-act="revisar-fuente" data-url="' + esc(c.url) + '" data-nombre="' + esc(c.titulo || c.url) + '">Revisar ahora</button>' +
          '<button class="btn btn-ghost btn-small" data-act="vigilar-url" data-url="' + esc(c.url) + '">Vigilar</button>' +
          '<a class="btn btn-ghost btn-small" target="_blank" rel="noopener" href="' + esc(c.url) + '">Abrir</a></div>' +
          "</article>";
      }).join("") : '<p class="empty">No encontré páginas nuevas que no estén ya en la lista.</p>';
    }, function () {
      if (btn) { btn.disabled = false; btn.textContent = "Descubrir páginas nuevas"; }
    });
  }

  /* --- revisar una sola página --- */
  function revisarURL(url, nombre) {
    if (!SC || !url) return;
    var btn = $("#btn-custom-scan");
    if (btn) btn.disabled = true;
    SC.scanURL(url, nombre).then(function (r) {
      if (btn) btn.disabled = false;
      if (r.ok && r.items.length) {
        ultimoScan = ultimoScan || { checked: new Date().toISOString().replace(/\.\d+Z$/, "Z"), items: [], fuentes: [] };
        r.items.forEach(function (it) {
          it.transporte = r.transporte;
          var dup = false;
          for (var i = 0; i < ultimoScan.items.length; i++) if (ultimoScan.items[i].sig === it.sig) { dup = true; break; }
          if (!dup) ultimoScan.items.unshift(it);
        });
        ultimoScan.checked = new Date().toISOString().replace(/\.\d+Z$/, "Z");
        if (SC.guardarScan) SC.guardarScan(ultimoScan);
        avisar("Hallazgos en " + (nombre || url), r.items.length + ": " + r.items.map(function (i) { return etiquetaViva(i); }).join(" · "));
      } else if (r.ok) {
        avisar("Sin ofertas en " + (nombre || url), "La página respondió pero no tiene frases de descuento, código o badge.");
      } else {
        avisar("No se pudo revisar " + (nombre || url), r.error || "sin respuesta");
      }
      renderNovedades();
    });
  }

  function copiar(texto) {
    if (!texto) return;
    var listo = function () { avisar("Código copiado", texto + " — pégalo al pagar el examen."); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(listo, function () { copiarFallback(texto, listo); });
        return;
      }
    } catch (e) {}
    copiarFallback(texto, listo);
  }
  function copiarFallback(texto, listo) {
    try {
      var ta = document.createElement("textarea");
      ta.value = texto;
      ta.setAttribute("readonly", "readonly");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      listo();
    } catch (e) {
      avisar("Copia manual", "El código es: " + texto);
    }
  }

  function renderGuias() {
    $("#guias-gratis-lista").innerHTML = (DATA.tips_gratis || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    $("#guias-lista").innerHTML = DATA.tips.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    $("#descartes").innerHTML = [
      "<b>ISC2 Certified in Cybersecurity (CC):</b> el programa gratuito cerró el 20-may-2026; hoy cuesta US$199.",
      "<b>Certificaciones Salesforce gratis:</b> terminaron el 31-dic-2025. Trailhead sigue gratis pero no es certificación.",
      "<b>Microsoft AI Skills Fest 2026:</b> cerrado; sus vouchers vencieron el 11-ago-2026.",
      "<b>Microsoft Virtual Training Days:</b> ya no dan voucher del 100% (desde 2023). Hoy ≈50% en exámenes fundamentales.",
      "<b>Coursera en modo Audit:</b> curso gratis / certificado pago. No lo pongas en el CV.",
      "<b>edX '100% gratis':</b> no existe; el tope de asistencia es 80-90%.",
      "<b>Udemy, Alison, Great Learning, CertiProf, SkillFront:</b> certificados de finalización sin peso en ATS.",
      "<b>Udacity:</b> los Nanodegrees son pagos y no hay becas abiertas en 2026.",
      "<b>Códigos de agregadores (dumpsgate, passitexams…):</b> la app los muestra marcados como <i>fuente no oficial</i>. Pruébalos solo en el checkout oficial de Pearson VUE/PSI y nunca pagues por un voucher."
    ].map(function (x) { return "<li>" + x + "</li>"; }).join("");
    $("#fantasmas").innerHTML = [
      "<b>Un descuento que no aparece en la página oficial no existe.</b> Certf solo muestra un porcentaje si sale en la frase exacta de la página verificada en ese momento; cada hallazgo muestra su evidencia y su fuente.",
      "<b>Nunca pagues por un voucher.</b> Los códigos gratuitos (AIF2CLOUD, ISC2 1MCC, Certification Week) se canjean gratis en el checkout oficial de Pearson VUE, PSI o Microsoft. Si alguien te cobra por entregar un voucher, es timo.",
      "<b>Los agregadores no son la fuente, son la pista.</b> Páginas tipo dumpsgate solo indican dónde buscar: confirma el código en el checkout del proveedor antes de confiar; si no se aplica ahí, no era real.",
      "<b>\u201c100% gratis\u201d que pide tarjeta no es gratis.</b> Si registran tu tarjeta o te cobran \u201cgastos de administración\u201d, no es 100% OFF: reclasifícalo como pago.",
      "<b>La beca no es un descuento garantizado.</b> Financial Aid cubre entre 75% y 100% según la aprobación; el remanente puede ser de US$20-60 por curso.",
      "<b>Sin fecha publicada, sin promesa.</b> Si la página no publica el fin de la promoción, la app lo muestra como sin fecha: no planifiques en base a una fecha que no está en la fuente.",
      "<b>Credencial sin URL de verificación no cuenta.</b> Credly, Coursera, cs50.io, CertView, Skillshop: si no hay link público que el empleador pueda abrir, el ATS no la registra."
    ].map(function (x) { return "<li>" + x + "</li>"; }).join("");
  }

  function renderAll() { renderCatalogo(); renderRuta(); renderMias(); renderAlertas(); renderNovedades(); renderGuias(); renderMejoras(); renderSiguiente(); }

  /* ---------- notificaciones ---------- */
  function pedirPermiso() {
    if (typeof Notification === "undefined" || !Notification.requestPermission) return;
    Notification.requestPermission().then(function () { renderAlertas(); programarAvisos(); });
  }
  function avisar(titulo, cuerpo, url) {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    try {
      var n = new Notification(titulo, { body: cuerpo, tag: "certf-" + titulo, icon: "icon-192.png" });
      if (url) n.onclick = function () { window.open(url, "_blank"); };
    } catch (e) {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "notify", titulo: titulo, cuerpo: cuerpo });
      }
    }
  }
  function programarAvisos() {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    var ahora = new Date();
    DATA.deadlines.forEach(function (d) {
      var n = diasRestantes(d.date);
      if (n === null || n < 0 || n > 7) return;
      var cuando = new Date(ahora.getTime() + 4000 + Math.random() * 2000);
      setTimeout(function () {
        avisar(n === 0 ? "Vence HOY: " + d.title : textoDias(n) + ": " + d.title, d.note, d.url);
      }, cuando - ahora);
    });
  }

  /* ---------- eventos ---------- */
  function mostrarVista(v) {
    $$(".tab").forEach(function (t) { t.classList.toggle("active", t.dataset.view === v); });
    $$(".view").forEach(function (s) { s.classList.toggle("hidden", s.id !== "view-" + v); });
    window.scrollTo({ top: 0, behavior: "smooth" });
    save(PREFS_KEY, prefs);
  }

  function chips(containerSel, attr, valor, cb) {
    var cont = $(containerSel);
    if (!cont || !cont.addEventListener) return;
    cont.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".chip") : null;
      if (!b) return;
      var v = b.dataset[attr];
      cb(v);
      $$(containerSel + " .chip").forEach(function (x) { x.classList.toggle("active", x === b); });
    });
    $$(containerSel + " .chip").forEach(function (x) { x.classList.toggle("active", x.dataset[attr] === valor); });
  }

  function bind() {
    $$(".tab").forEach(function (t) {
      t.addEventListener("click", function () { mostrarVista(t.dataset.view); });
    });

    $("#q").addEventListener("input", function (e) { query = e.target.value; renderCatalogo(); });
    $("#sort").addEventListener("change", function (e) { prefs.sort = e.target.value; save(PREFS_KEY, prefs); renderCatalogo(); });

    chips("#filtro-tipo", "tipo", prefs.tipo || "all", function (v) { prefs.tipo = v; save(PREFS_KEY, prefs); renderCatalogo(); });
    chips("#filtro-cat", "cat", prefs.cat || "all", function (v) { prefs.cat = v; save(PREFS_KEY, prefs); renderCatalogo(); });
    chips("#filtro-desc", "desc", prefs.desc || "all", function (v) { prefs.desc = v; save(PREFS_KEY, prefs); renderCatalogo(); });
    chips("#filtro-formato", "formato", prefs.formato || "all", function (v) { prefs.formato = v; save(PREFS_KEY, prefs); renderCatalogo(); });
    chips("#filtro-lang", "lang", prefs.idioma || "all", function (v) { prefs.idioma = v; save(PREFS_KEY, prefs); renderCatalogo(); });
    chips("#filtro-peso", "peso", prefs.peso || "all", function (v) { prefs.peso = v; save(PREFS_KEY, prefs); renderCatalogo(); });

    /* Siguiente acción: el botón ejecuta la acción (postular, ver mis certs o catálogo) */
    var sig = $("#siguiente");
    if (sig && sig.addEventListener) {
      sig.addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest("[data-sig]") : null;
        if (!b) return;
        mostrarVista(b.dataset.sig);
      });
    }

    /* Auto-mejora: copiar prompt y marcar mejoras como hechas (solo local) */
    var ls = $("#lista-sug");
    if (ls && ls.addEventListener) {
      ls.addEventListener("click", function (e) {
        var cop = e.target.closest ? e.target.closest("[data-mj-copiar]") : null;
        if (cop) {
          var idc = Number(cop.dataset.mjCopiar);
          if (MJ) {
            for (var i = 0; i < MJ.mejoras.length; i++) if (MJ.mejoras[i].id === idc) { copiarPrompt(MJ.mejoras[i]); break; }
          }
          return;
        }
        var he = e.target.closest ? e.target.closest("[data-mj-hecha]") : null;
        if (!he) return;
        var idh = Number(he.dataset.mjHecha);
        if (mjState.hechas[idh]) delete mjState.hechas[idh];
        else mjState.hechas[idh] = new Date().toISOString();
        save(MJ_KEY, mjState);
        renderMejoras();
      });
    }

    /* IA opcional (clave local, petición directa del teléfono al endpoint) */
    var cfg0 = aiConfig();
    var aiEp = $("#ai-endpoint"), aiMo = $("#ai-model"), aiKe = $("#ai-key");
    if (aiEp) {
      aiEp.value = cfg0.endpoint || "https://api.openai.com/v1/chat/completions";
      aiEp.placeholder = "https://api.openai.com/v1/chat/completions";
    }
    if (aiMo) aiMo.value = cfg0.model || "gpt-4o-mini";
    if (aiKe) aiKe.value = cfg0.key || "";
    [aiEp, aiMo, aiKe].forEach(function (el) { if (el && el.addEventListener) el.addEventListener("change", guardarMejorasIA); });
    var bAi = $("#btn-ai");
    if (bAi) bAi.addEventListener("click", generarMejorasIA);
    var bAiBorrar = $("#btn-ai-borrar");
    if (bAiBorrar) bAiBorrar.addEventListener("click", function () {
      save(AI_KEY, { endpoint: (aiEp && aiEp.value) || "", model: (aiMo && aiMo.value) || "", key: "" });
      if (aiKe) aiKe.value = "";
      var out = $("#ai-out");
      if (out) { out.classList.add("hidden"); out.textContent = ""; }
      avisar("Clave borrada", "Se eliminó la clave API de este teléfono.");
    });

    /* Tu objetivo: ajusta la barra Siguiente acción (guardado local) */
    var selPuesto = $("#obj-puesto"), selHoras = $("#obj-horas"), selNivel = $("#obj-nivel");
    if (selPuesto) {
      var opts = '<option value="">Elegir…</option>' + (DATA.rutas || []).map(function (r) {
        return '<option value="' + esc(r.area) + '">' + esc(r.papel) + "</option>";
      }).join("");
      selPuesto.innerHTML = opts;
      [selPuesto, selHoras, selNivel].forEach(function (sel, i) {
        if (!sel) return;
        var clave = ["puesto", "horas", "nivel"][i];
        sel.value = (prefs.objetivo || {})[clave] || "";
        sel.addEventListener("change", function () {
          prefs.objetivo = prefs.objetivo || {};
          prefs.objetivo[clave] = sel.value;
          save(PREFS_KEY, prefs);
          renderSiguiente();
        });
      });
    }
    chips("#filtro-nov", "nov", novPrefs.filtro || "all", function (v) { novPrefs.filtro = v; save(NOV_PREFS_KEY, novPrefs); renderNovedades(); });

    $("#lista").addEventListener("click", function (e) {
      var btn = e.target.closest("button"); if (!btn) return;
      var card = e.target.closest(".card"); if (!card) return;
      var id = card.dataset.id;
      if (btn.dataset.act === "seguir") {
        if (mis[id]) { delete mis[id]; } else { mis[id] = { estado: "Pendiente", fecha: "", nota: "", added: new Date().toISOString() }; }
        save(STORE_KEY, mis); renderCatalogo(); renderMias(); renderAlertas();
      } else if (btn.dataset.act === "ver-mia") {
        mostrarVista("mias");
      }
    });

    $("#lista-mias").addEventListener("click", function (e) {
      var btn = e.target.closest("button"); if (!btn) return;
      var id = e.target.closest(".card").dataset.id;
      if (btn.dataset.act === "quitar") {
        delete mis[id]; save(STORE_KEY, mis); renderMias(); renderCatalogo(); renderAlertas();
      }
    });
    $("#lista-mias").addEventListener("change", function (e) {
      var f = e.target; if (!f.dataset.act) return;
      var id = e.target.closest(".card").dataset.id;
      mis[id] = mis[id] || {};
      mis[id][f.dataset.act] = f.value;
      save(STORE_KEY, mis); renderMias(); renderAlertas();
    });
    $("#lista-mias").addEventListener("input", function (e) {
      var f = e.target; if (f.dataset.act !== "nota") return;
      var id = e.target.closest(".card").dataset.id;
      mis[id] = mis[id] || {}; mis[id].nota = f.value; save(STORE_KEY, mis);
    });

    /* --- buscar páginas --- */
    $("#btn-scan").addEventListener("click", function () { ejecutarBusqueda({}); });
    $("#btn-buscar").addEventListener("click", function () { mostrarVista("novedades"); ejecutarBusqueda({}); });
    $("#btn-discover").addEventListener("click", function () { mostrarVista("novedades"); descubrirPaginas(); });
    var avisoCors = $("#aviso-cors");
    if (avisoCors) avisoCors.classList.toggle("hidden", !!(SC && SC.esApp && SC.esApp()));

    $("#btn-stop").addEventListener("click", function () {
      if (scanSignal) scanSignal.cancelado = true;   // deja de abrir páginas nuevas
      var est = $("#scan-estado");
      if (est) est.textContent = "Deteniendo… se guarda lo ya revisado.";
    });

    var chkCom = $("#chk-comunidad"), chkAuto = $("#chk-auto");
    var p = SC ? SC.prefs() : { grupos: [], auto: false };
    if (chkCom) {
      chkCom.checked = !!(p.grupos && (p.grupos.indexOf("comunidad") !== -1));
      chkCom.addEventListener("change", function () {
        if (!SC) return;
        var grupos = ["oficial", "badges", "es"];
        if (chkCom.checked) grupos = grupos.concat(["comunidad", "agregador"]);
        SC.setPrefs({ grupos: grupos });
      });
    }
    if (chkAuto) {
      chkAuto.checked = !!p.auto;
      chkAuto.addEventListener("change", function () { if (SC) SC.setPrefs({ auto: chkAuto.checked }); });
    }

    var customUrl = $("#custom-url");
    $("#btn-custom-add").addEventListener("click", function () {
      if (!SC || !customUrl) return;
      var url = (customUrl.value || "").trim();
      if (!url) { avisar("Falta la URL", "Pega la dirección de la página que quieres vigilar."); return; }
      var r = SC.agregarCustom(url);
      customUrl.value = "";
      if (!r.ok) avisar("No se agregó", r.error);
      else avisar("Página agregada", "Se revisará en cada búsqueda: " + url);
      renderCustom();
    });
    $("#btn-custom-scan").addEventListener("click", function () {
      if (!customUrl) return;
      var url = (customUrl.value || "").trim();
      if (!url) { avisar("Falta la URL", "Pega una dirección para revisarla ahora."); return; }
      revisarURL(url.indexOf("http") === 0 ? url : "https://" + url);
    });

    /* clics dentro de la lista de hallazgos (copiar código, vigilar, revisar fuente) */
    ["#lista-novedades", "#lista-novedades-auto"].forEach(function (sel) {
      var cont = $(sel);
      if (!cont || !cont.addEventListener) return;
      cont.addEventListener("click", function (e) {
        var codeBtn = e.target.closest ? e.target.closest(".codigo") : null;
        if (codeBtn) { copiar(codeBtn.dataset.code); return; }
        var btn = e.target.closest ? e.target.closest("button") : null;
        if (!btn) return;
        var act = btn.dataset.act;
        if (act === "copiar-todos") {
          var card = e.target.closest(".card");
          var c = card ? card.querySelector(".codigo") : null;
          if (c) copiar(c.dataset.code);
        } else if (act === "vigilar") {
          var card2 = e.target.closest(".card");
          var a = card2 ? card2.querySelector('a[target="_blank"]') : null;
          if (a && SC) { SC.agregarCustom(a.getAttribute("href"), ""); renderCustom(); avisar("Página en vigilancia", "Se revisará en cada búsqueda."); }
        }
      });
    });

    var lf = $("#lista-fuentes");
    if (lf && lf.addEventListener) {
      lf.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest("button") : null;
        if (btn && btn.dataset.act === "revisar-fuente") revisarURL(btn.dataset.url, btn.dataset.nombre);
      });
    }
    var ld = $("#lista-descubiertas");
    if (ld && ld.addEventListener) {
      ld.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest("button") : null;
        if (!btn) return;
        if (btn.dataset.act === "revisar-fuente") revisarURL(btn.dataset.url, btn.dataset.nombre);
        else if (btn.dataset.act === "vigilar-url") {
          if (SC) { SC.agregarCustom(btn.dataset.url, ""); renderCustom(); avisar("Página en vigilancia", btn.dataset.url); }
        }
      });
    }
    var lc = $("#lista-custom");
    if (lc && lc.addEventListener) {
      lc.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest("button") : null;
        if (btn && btn.dataset.act === "quitar-custom" && SC) { SC.quitarCustom(btn.dataset.id); renderCustom(); }
      });
    }

    /* ruta 0 a pro */
    $("#filtro-area").addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".chip") : null;
      if (!b) return;
      prefs.rutaArea = b.dataset.area; save(PREFS_KEY, prefs); renderRuta();
    });
    $("#lista-ruta").addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-ruta-seguir]") : null;
      if (!btn) return;
      var id = btn.dataset.rutaSeguir;
      if (mis[id]) { delete mis[id]; } else { mis[id] = { estado: "Pendiente", fecha: "", nota: "", added: new Date().toISOString() }; }
      save(STORE_KEY, mis); renderRuta(); renderMias(); renderCatalogo(); renderAlertas();
    });

    $("#btn-permiso").addEventListener("click", pedirPermiso);
    $("#btn-notify").addEventListener("click", function () { pedirPermiso(); mostrarVista("alertas"); });
    $("#btn-prueba").addEventListener("click", function () {
      avisar("Certf: aviso de prueba", "Así se verá el recordatorio de una fecha límite.");
    });

    // Instalación (PWA)
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      var deferred = e;
      var btn = $("#btn-install");
      btn.classList.remove("hidden");
      btn.addEventListener("click", function () {
        btn.classList.add("hidden");
        deferred.prompt();
        deferred.userChoice.then(function () { deferred = null; });
      });
    });
    if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone) {
      $("#btn-install").classList.add("hidden");
    }

    window.addEventListener("resize", function () {
      var b = $("#btn-buscar");
      if (b && !scanActivo) b.textContent = etiquetaBuscar(false);
    });

    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }

  /* ---------- inicio ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    $("#updated").textContent = DATA.updated || "—";
    $("#sort").value = prefs.sort || "peso";
    bind();
    renderAll();
    programarAvisos();

    /* búsqueda automática opcional (si la activaste y pasaron >6 h) */
    if (SC) {
      var p = SC.prefs();
      var chk = $("#chk-comunidad");
      if (chk && p.grupos && (p.grupos.indexOf("comunidad") !== -1)) chk.checked = true;
      if (p.auto && horasDesde(ultimoScan ? ultimoScan.checked : null) > 6) ejecutarBusqueda({ grupos: p.grupos });
    }
  });
})();
