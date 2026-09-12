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
  var prefs = load(PREFS_KEY, { tipo: "all", cat: "all", sort: "peso", desc: "all", formato: "all", idioma: "all" });
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

  /* ---------- catálogo ---------- */
  function certsFiltrados() {
    var q = query.trim().toLowerCase();
    var out = DATA.certs.filter(function (c) {
      if (prefs.tipo !== "all" && c.t !== prefs.tipo) return false;
      if (prefs.cat !== "all" && c.c !== prefs.cat) return false;
      if (!cumpleDesc(c, prefs.desc || "all")) return false;
      if ((prefs.formato || "all") !== "all" && (c.kind || "cert") !== prefs.formato) return false;
      if (!cumpleIdioma(c, prefs.idioma || "all")) return false;
      if (!q) return true;
      var hay = [c.n, c.i, c.c, c.note, c.cond, c.lang, c.kind].join(" ").toLowerCase();
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
    html += '<span class="peso" title="Peso estimado en el CV">CV ' + c.p + "/10</span></div>";
    if (dsc) {
      html += '<p class="desc-line"><span class="desc ' + claseDescuento(c) + '">' + esc(dsc) + "</span>" +
        '<span class="tipo ' + ((c.kind === "badge") ? "t-badge" : "t-cert") + '">' + (c.kind === "badge" ? "🎖️ Badge" : "📜 Certificación") + "</span></p>";
    }
    html += '<p class="cond"><span class="tipo t-' + esc(c.t) + '">' + esc(TIPO_LABEL[c.t] || c.t) + "</span>" + esc(c.cond) + "</p>";
    html += '<p class="note">' + esc(c.note) + "</p>";
    html += '<p class="meta">Idioma: <b>' + esc(c.lang) + "</b> · Área: <b>" + esc(c.c) + "</b> · Verificación: <b>" + esc(c.verify) + "</b></p>";
    if (dl) {
      html += '<p class="meta">⏳ Fecha crítica: <b class="' + claseDias(dias) + '">' + esc(dl.title) + " — " + textoDias(dias) + "</b> (" + fmtFecha(dl.date) + ")</p>";
    }
    html += '<div class="row">';
    html += '<a class="btn" target="_blank" rel="noopener" href="' + esc(c.url) + '">Abrir enlace</a>';
    html += '<button class="btn btn-ghost" data-act="seguir">' + (siguiendo ? "✓ Siguiendo" : "Seguir") + "</button>";
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
    if (el) el.textContent = " · 🟢 " + g100 + " gratis al 100% · 🎓 " + becas +
      " becas hasta 100% · 🏷️ " + g50 + " al 50% · 🎖️ " + badges + " badges";
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
      html += '<p class="meta">⏳ Tu plazo: <b class="' + claseDias(dias) + '">' + textoDias(dias) + "</b> (" + fmtFecha(m.fecha) + ")</p>";
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

    var o = 0, e = 0, p = 0;
    ids.forEach(function (id) {
      var s = (mis[id] || {}).estado || "Pendiente";
      if (s === "Obtenida") o++; else if (s === "En curso") e++; else p++;
    });
    $("#resumen").innerHTML =
      '<div class="kpi"><b>' + ids.length + "</b><span>seguidas</span></div>" +
      '<div class="kpi"><b style="color:var(--warn)">' + e + "</b><span>en curso</span></div>" +
      '<div class="kpi"><b style="color:var(--ok)">' + o + "</b><span>obtenidas</span></div>" +
      '<div class="kpi"><b>' + p + "</b><span>pendientes</span></div>" +
      '<div class="kpi"><b>' + DATA.deadlines.length + "</b><span>fechas críticas</span></div>" +
      '<div class="kpi"><b>' + DATA.certs.filter(function (c) { return c.disc === 100; }).length + "</b><span>hasta 100% gratis</span></div>";
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
      granted: "✅ Notificaciones activas en este dispositivo.",
      denied: "⛔ Bloqueaste las notificaciones. Habilítalas en los ajustes del sitio/app.",
      default: "🔕 Notificaciones sin activar.",
      unsupported: "Este navegador no soporta notificaciones; la app Android usa alarmas nativas."
    };
    $("#estado-notif").textContent = txt[perm] || txt.default;
    $("#btn-permiso").classList.toggle("hidden", perm === "granted" || perm === "unsupported");
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
    if (activo) return corto ? "⏳" : "⏳ Buscando…";
    return corto ? "🔎 Buscar" : "🔎 Buscar páginas";
  }

  function setScanUI(activo) {
    scanActivo = activo;
    var b1 = $("#btn-scan"), b2 = $("#btn-buscar"), b3 = $("#btn-discover"), st = $("#btn-stop");
    [b1, b2, b3].forEach(function (b) { if (b) b.disabled = activo; });
    if (b1) b1.textContent = activo ? "⏳ Buscando páginas…" : "🔄 Buscar páginas y actualizar ahora";
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
      est.textContent = (r.ok ? "✓ " : "✗ ") + r.name + (r.ok ? " · " + r.hallazgos + " hallazgo(s)" + (r.nuevos ? " (" + r.nuevos + " nuevo(s))" : "") : " · " + (r.error || "sin respuesta")) +
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
    avisar("🔎 " + nuevos.length + " hallazgo(s) nuevo(s)", partes.length ? partes.join(" · ") : "Revisa la pestaña Buscar páginas.");
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
      (v.nuevo ? ' · <b class="pill-nuevo">✨ NUEVO</b>' : "") + "</div></div>";
    html += '<span class="desc grande ' + claseDescVivo(v) + '">' + esc(etiquetaViva(v)) + "</span></div>";

    var pills = [];
    if (v.unico) pills.push('<span class="pill pill-unico">1️⃣ código de UN SOLO USO</span>');
    if (v.badge) pills.push('<span class="pill pill-badge">🎖️ badge / insignia</span>');
    if (v.beca && v.disc !== 100) pills.push('<span class="pill pill-beca">🎓 beca / ayuda financiera</span>');
    if (v.lang) pills.push('<span class="pill pill-lang">🌐 ' + esc(v.lang) + "</span>");
    if (v.review) pills.push('<span class="pill pill-review">⚠ requiere revisión</span>');
    if (v.grupo === "agregador" || v.grupo === "comunidad") pills.push('<span class="pill pill-review">fuente no oficial: confirmar</span>');
    if (pills.length) html += '<p class="pills">' + pills.join("") + "</p>";

    html += '<p class="note">“' + esc(v.text) + "”</p>";

    if (v.codes && v.codes.length) {
      html += '<div class="codigos">';
      v.codes.forEach(function (c) {
        html += '<button class="codigo" data-code="' + esc(c) + '" title="Toca para copiar">' + esc(c) + " ⧉</button>";
      });
      html += "</div>";
    }

    html += '<div class="row"><a class="btn btn-small" target="_blank" rel="noopener" href="' + esc(v.url) + '">Ver fuente oficial</a>';
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
    $("#lista-novedades").innerHTML = visibles.map(cardHallazgo).join("");
    $("#novedades-vacio").classList.toggle("hidden", visibles.length > 0);

    /* resumen */
    var resumen = $("#scan-resumen");
    if (resumen) {
      if (vivos.length) {
        var r = ultimoScan || {};
        resumen.classList.remove("hidden");
        resumen.innerHTML =
          '<div class="kpi kpi-scan"><b>' + (r.nuevos || 0) + "</b><span>nuevos</span></div>" +
          '<div class="kpi kpi-scan k100"><b>' + vivos.filter(function (v) { return v.disc === 100; }).length + "</b><span>100% gratis</span></div>" +
          '<div class="kpi kpi-scan k50"><b>' + vivos.filter(function (v) { return v.disc === 50; }).length + "</b><span>50% dto</span></div>" +
          '<div class="kpi kpi-scan kod"><b>' + vivos.filter(function (v) { return v.disc && v.disc !== 100 && v.disc !== 50; }).length + "</b><span>otro %</span></div>" +
          '<div class="kpi kpi-scan"><b>' + vivos.filter(function (v) { return v.codes && v.codes.length; }).length + "</b><span>códigos</span></div>" +
          '<div class="kpi kpi-scan kun"><b>' + vivos.filter(function (v) { return v.unico; }).length + "</b><span>único uso</span></div>" +
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
          '<span class="fuente-estado">' + (f.ok ? "✓" : "✗") + "</span>" +
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
      lc.textContent = " · 🔎 tu última búsqueda: " + cuando + " · 🛰️ robot: " + haceCuando(NOV.checked);
      lc.classList.toggle("stale", !ultimoScan || horasDesde(ultimoScan.checked) > 6);
    }

    renderCustom();
  }

  function renderCustom() {
    var el = $("#lista-custom");
    if (!el || !SC) return;
    var list = SC.customFuentes();
    el.innerHTML = list.length ? list.map(function (c) {
      return '<span class="custom-chip">👁 ' + esc(c.name) +
        ' <button class="x" data-act="quitar-custom" data-id="' + esc(c.id) + '" title="Dejar de vigilar">✕</button></span>';
    }).join("") : '<span class="muted small">Sin páginas propias. Pega una URL arriba para vigilarla en cada búsqueda.</span>';
  }

  /* --- descubrir páginas nuevas --- */
  function descubrirPaginas() {
    if (!SC) return;
    var btn = $("#btn-discover");
    if (btn) { btn.disabled = true; btn.textContent = "⏳ Buscando páginas nuevas…"; }
    SC.discover({}).then(function (lista) {
      if (btn) { btn.disabled = false; btn.textContent = "🌐 Descubrir páginas nuevas"; }
      var panel = $("#panel-descubiertas");
      var cont = $("#lista-descubiertas");
      if (!panel || !cont) return;
      panel.classList.toggle("hidden", !lista.length);
      cont.innerHTML = lista.length ? lista.map(function (c) {
        return '<article class="card desc-card" data-url="' + esc(c.url) + '">' +
          '<div class="card-top"><div><h3>' + esc(c.titulo || c.url) + '</h3><div class="inst">' + esc(c.origen) + "</div></div></div>" +
          '<p class="meta small">' + esc(c.url) + "</p>" +
          '<div class="row"><button class="btn btn-small" data-act="revisar-fuente" data-url="' + esc(c.url) + '" data-nombre="' + esc(c.titulo || c.url) + '">🔎 Revisar ahora</button>' +
          '<button class="btn btn-ghost btn-small" data-act="vigilar-url" data-url="' + esc(c.url) + '">👁 Vigilar</button>' +
          '<a class="btn btn-ghost btn-small" target="_blank" rel="noopener" href="' + esc(c.url) + '">Abrir</a></div>' +
          "</article>";
      }).join("") : '<p class="empty">No encontré páginas nuevas que no estén ya en la lista.</p>';
    }, function () {
      if (btn) { btn.disabled = false; btn.textContent = "🌐 Descubrir páginas nuevas"; }
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
        avisar("🔎 " + r.items.length + " hallazgo(s) en " + (nombre || url), r.items.map(function (i) { return etiquetaViva(i); }).join(" · "));
      } else if (r.ok) {
        avisar("🔎 Sin ofertas en " + (nombre || url), "La página respondió pero no tiene frases de descuento, código o badge.");
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
  }

  function renderAll() { renderCatalogo(); renderMias(); renderAlertas(); renderNovedades(); renderGuias(); }

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
        avisar(n === 0 ? "⏰ Vence HOY: " + d.title : "⏳ " + textoDias(n) + ": " + d.title, d.note, d.url);
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
