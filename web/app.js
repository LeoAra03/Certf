/* Certf — lógica de la app (vanilla JS, sin dependencias) */
(function () {
  "use strict";

  var DATA = window.__CERTF__ || { certs: [], deadlines: [], tips: [], updated: "" };
  var NOV = window.__CERTF_NOVEDADES__ || { checked: "", items: [] };
  if (!Array.isArray(NOV.items)) NOV.items = [];
  var STORE_KEY = "certf.mias.v1";
  var PREFS_KEY = "certf.prefs.v1";

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
  var prefs = load(PREFS_KEY, { tipo: "all", cat: "all", sort: "peso" });
  var query = "";

  /* ---------- catálogo ---------- */
  function certsFiltrados() {
    var q = query.trim().toLowerCase();
    var out = DATA.certs.filter(function (c) {
      if (prefs.tipo !== "all" && c.t !== prefs.tipo) return false;
      if (prefs.cat !== "all" && c.c !== prefs.cat) return false;
      if (!q) return true;
      var hay = [c.n, c.i, c.c, c.note, c.cond, c.lang].join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    out.sort(function (a, b) {
      if (prefs.sort === "nombre") return a.n.localeCompare(b.n, "es");
      if (prefs.sort === "institucion") return a.i.localeCompare(b.i, "es") || b.p - a.p;
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
    var html = "";
    html += '<article class="card" data-id="' + esc(c.id) + '">';
    html += '<div class="card-top"><div><h3>' + esc(c.n) + '</h3><div class="inst">' + esc(c.i) + "</div></div>";
    html += '<span class="peso" title="Peso estimado en el CV">CV ' + c.p + "/10</span></div>";
    html += '<p class="cond"><span class="tipo t-' + esc(c.t) + '">' + esc(TIPO_LABEL[c.t] || c.t) + "</span>" + esc(c.cond) + "</p>";
    html += '<p class="note">' + esc(c.note) + "</p>";
    html += '<p class="meta">Idioma: <b>' + esc(c.lang) + "</b> · Área: <b>" + esc(c.c) + "</b> · Verificación: <b>" + esc(c.verify) + "</b></p>";
    if (dl) {
      html += '<p class="meta">⏳ Fecha crítica: <b class="' + claseDias(dias) + '">' + esc(dl.title) + " — " + textoDias(dias) + "</b> (" + fmtFecha(dl.date) + ")</p>";
    }
    html += '<div class="row">';
    html += '<a class="btn" target="_blank" rel="noopener" href="' + esc(c.url) + '">Abrir enlace</a>';
    html += '<button class="btn ' + (siguiendo ? "btn-ghost" : "btn-ghost") + '" data-act="seguir">' + (siguiendo ? "✓ Siguiendo" : "Seguir") + "</button>";
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
    html += '<p class="meta">Condición: <b>' + esc(c.cond) + "</b></p>";
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
      '<div class="kpi"><b>' + DATA.certs.filter(function (c) { return c.t === "gratis"; }).length + "</b><span>100% gratis</span></div>";
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

  /* ---------- novedades (rastreador diario) ---------- */
  function cardNovedad(v) {
    var chip = v.review
      ? '<span class="tipo t-descuento">⚠ Revisar</span> La página cambió sin señales claras'
      : '<span class="tipo t-gratis">🛰️ Señal</span> Oferta detectada en la fuente';
    var html = "";
    html += '<article class="card nov' + (v.review ? " nov-review" : "") + '" data-nov="' + esc(v.id) + '">';
    html += '<div class="card-top"><div><h3>' + esc(v.name) + '</h3><div class="inst">' + esc(fmtFecha(v.found)) + " · " + esc(haceCuando(v.found)) + "</div></div></div>";
    html += '<p class="cond">' + chip + "</p>";
    html += '<p class="note">“' + esc(v.text) + "”</p>";
    html += '<div class="row"><a class="btn btn-small" target="_blank" rel="noopener" href="' + esc(v.url) + '">Ver fuente oficial</a></div>';
    html += "</article>";
    return html;
  }

  function renderNovedades() {
    var items = NOV.items.slice().sort(function (a, b) { return (String(b.found) + String(b.id)).localeCompare(String(a.found) + String(a.id)); });
    $("#lista-novedades").innerHTML = items.map(cardNovedad).join("");
    $("#novedades-vacio").classList.toggle("hidden", items.length > 0);
    var badge = $("#badge-nov");
    badge.textContent = items.length;
    badge.classList.toggle("hidden", items.length === 0);
    var pend = items.filter(function (v) { return v.review; }).length;
    $("#nov-estado").innerHTML =
      "Última revisión automática: <b>" + esc(haceCuando(NOV.checked)) + "</b>" +
      (pend ? ' · <b class="d-warn">' + pend + " cambio(s) por revisar</b>" : " · sin cambios pendientes de revisión");
    $("#last-check").textContent = " · 🛰️ revisión: " + haceCuando(NOV.checked);
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
      "<b>Udacity:</b> los Nanodegrees son pagos y no hay becas abiertas en 2026."
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

  function bind() {
    $$(".tab").forEach(function (t) {
      t.addEventListener("click", function () { mostrarVista(t.dataset.view); });
    });

    $("#q").addEventListener("input", function (e) { query = e.target.value; renderCatalogo(); });
    $("#sort").addEventListener("change", function (e) { prefs.sort = e.target.value; save(PREFS_KEY, prefs); renderCatalogo(); });

    $("#filtro-tipo").addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      prefs.tipo = b.dataset.tipo;
      $$("#filtro-tipo .chip").forEach(function (x) { x.classList.toggle("active", x === b); });
      save(PREFS_KEY, prefs); renderCatalogo();
    });
    $("#filtro-cat").addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      prefs.cat = b.dataset.cat;
      $$("#filtro-cat .chip").forEach(function (x) { x.classList.toggle("active", x === b); });
      save(PREFS_KEY, prefs); renderCatalogo();
    });

    $("#lista").addEventListener("click", function (e) {
      var btn = e.target.closest("button"); if (!btn) return;
      var id = e.target.closest(".card").dataset.id;
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

    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }

  /* ---------- inicio ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    $("#updated").textContent = DATA.updated || "—";
    $("#sort").value = prefs.sort || "peso";
    $$("#filtro-tipo .chip").forEach(function (x) { x.classList.toggle("active", x.dataset.tipo === (prefs.tipo || "all")); });
    $$("#filtro-cat .chip").forEach(function (x) { x.classList.toggle("active", x.dataset.cat === (prefs.cat || "all")); });
    bind();
    renderAll();
    programarAvisos();
  });
})();
