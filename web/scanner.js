/* Certf — buscador EN VIVO de páginas (botón "Buscar páginas").
   Sin dependencias: funciona en la PWA (GitHub Pages) y dentro del WebView
   de la APK (ahí usa el puente nativo CertfNative, que no tiene CORS).

   Qué hace cada vez que lo ejecutas (cuando tú quieras, no una vez al día):
     1. Descarga las páginas oficiales + de badges + en español (y, si lo
        activas, comunidades y agregadores de códigos).
     2. Extrae las frases con oferta y te dice AL TIRO el descuento:
        100% gratis · 50% dto · otro % · beca/asistencia financiera.
     3. Detecta códigos (promo/voucher/cupón) y marca los de UN SOLO USO.
     4. Busca páginas nuevas (DuckDuckGo + Hacker News + Reddit) para que
        puedas vigilarlas o revisarlas en el momento.
     5. Guarda todo en el dispositivo: la próxima apertura sigue ahí.
*/
(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Claves de almacenamiento                                            */
  /* ------------------------------------------------------------------ */
  var K_SCAN = "certf.scan.v2";      // último resultado en vivo
  var K_SEEN = "certf.seen.v2";      // firmas ya vistas (para marcar "nuevo")
  var K_CUSTOM = "certf.custom.v1";  // páginas que tú agregaste
  var K_PREFS = "certf.buscar.prefs.v1";

  var MAX_ITEMS = 140;               // tope de hallazgos guardados
  var MAX_POR_FUENTE = 6;            // tope de hallazgos por página
  var SNIPPET_MAX = 340;
  var SIG_LEN = 160;
  var TIMEOUT_MS = 22000;
  var TIMEOUT_NATIVO = 45000;        // la APK descarga sin proxy: puede tardar más
  var BODY_MAX = 1200000;            // ~1.2 MB de texto por página
  var CONC = 3;                      // páginas en paralelo

  /* ------------------------------------------------------------------ */
  /* Fuentes a revisar                                                   */
  /* grupo: oficial | badges | es | comunidad | agregador                */
  /* ------------------------------------------------------------------ */
  var SOURCES = [
    /* --- oficiales (las del catálogo) --- */
    { id: "aws-aif2cloud", name: "AWS · Código AIF2CLOUD (Pearson VUE)", url: "https://www.pearsonvue.com/us/en/aws/aif2cloud.html", lang: "EN", grupo: "oficial" },
    { id: "aws-student", name: "AWS · Voucher estudiante (Builder Center)", url: "https://builder.aws.com/student-rewards", lang: "EN", grupo: "oficial" },
    { id: "aws-certification", name: "AWS · Página de certificaciones", url: "https://aws.amazon.com/certification/", lang: "EN", grupo: "oficial" },
    { id: "ms-certweek", name: "Microsoft · Certification Week", url: "https://certweeks.fastlane.net/amer/az-sec-en", lang: "EN", grupo: "oficial" },
    { id: "ms-applied", name: "Microsoft · Applied Skills", url: "https://learn.microsoft.com/en-us/credentials/applied-skills/", lang: "EN", grupo: "oficial" },
    { id: "ms-events", name: "Microsoft · Eventos y Cloud Skills Challenges", url: "https://learn.microsoft.com/en-us/training/events/", lang: "EN", grupo: "oficial" },
    { id: "ibm-uopeople", name: "IBM SkillsBuild · Certificados con UoPeople", url: "https://skillsbuild.org/college-students/college-certificates", lang: "EN", grupo: "oficial" },
    { id: "oracle-free", name: "Oracle · Free training & certification", url: "https://mylearn.oracle.com/ou/story/163512", lang: "EN", grupo: "oficial" },
    { id: "edx-aid", name: "edX · Asistencia financiera", url: "https://courses.edx.org/financial-assistance/", lang: "EN", grupo: "oficial" },
    { id: "github-pack", name: "GitHub · Student Developer Pack", url: "https://education.github.com/pack", lang: "EN", grupo: "oficial" },
    { id: "cisco-netacad", name: "Cisco · Networking Academy (cursos)", url: "https://www.netacad.com/courses", lang: "EN/ES", grupo: "oficial" },
    { id: "isc2-1mcc", name: "ISC2 · 1MCC (códigos gratuitos)", url: "https://www.isc2.org/1mcc", lang: "EN", grupo: "oficial" },
    { id: "helsinki-ai", name: "Universidad de Helsinki · Elements of AI", url: "https://www.elementsofai.com", lang: "EN/ES", grupo: "oficial" },
    { id: "helsinki-fso", name: "Universidad de Helsinki · Full Stack Open", url: "https://fullstackopen.com/en/", lang: "EN", grupo: "oficial" },
    { id: "freecodecamp", name: "freeCodeCamp · Certificaciones", url: "https://www.freecodecamp.org/learn", lang: "EN", grupo: "oficial" },
    { id: "skillshop", name: "Google · Skillshop", url: "https://skillshop.withgoogle.com", lang: "MULTI", grupo: "oficial" },
    { id: "coursera-gcyber", name: "Coursera · Google Cybersecurity Certificate", url: "https://www.coursera.org/google-certificates/cybersecurity-certificate", lang: "ES/EN", grupo: "oficial" },
    { id: "coursera-aid", name: "Coursera · Financial Aid (becas 75-100%)", url: "https://www.coursera.org/financial-aid", lang: "EN", grupo: "oficial" },
    { id: "comptia-desc", name: "CompTIA · Descuentos y vouchers de examen", url: "https://www.comptia.org/exam-vouchers/discounts", lang: "EN", grupo: "oficial" },
    { id: "anthropic", name: "Anthropic Academy · certificados gratis de IA", url: "https://anthropic.skilljar.com/", lang: "EN", grupo: "oficial" },
    { id: "fortinet", name: "Fortinet · FCF / FCA (gratis con badge)", url: "https://training.fortinet.com/", lang: "EN", grupo: "oficial" },
    { id: "databricks", name: "Databricks · Training y Learning Festivals", url: "https://www.databricks.com/training", lang: "EN", grupo: "oficial" },
    { id: "mongodb", name: "MongoDB University · certificaciones", url: "https://learn.mongodb.com/", lang: "EN", grupo: "oficial" },

    /* --- badges / credenciales digitales (suman en el CV y LinkedIn) --- */
    { id: "aws-badges", name: "AWS · Skill Builder Digital Badges", url: "https://aws.amazon.com/training/badges/", lang: "EN", grupo: "badges" },
    { id: "gcp-skillsboost", name: "Google Cloud Skills Boost · skill badges", url: "https://www.cloudskillsboost.google/", lang: "EN", grupo: "badges" },
    { id: "ibm-skillsbuild", name: "IBM SkillsBuild · credenciales Credly", url: "https://skillsbuild.org/", lang: "EN", grupo: "badges" },
    { id: "ibm-cognitive", name: "IBM Cognitive Class · certificados y badges", url: "https://cognitiveclass.ai/", lang: "EN", grupo: "badges" },
    { id: "cisco-skillsforall", name: "Cisco Skills for All · badges", url: "https://skillsforall.com/", lang: "ES/EN", grupo: "badges" },
    { id: "google-developers", name: "Google Developers · badges y rutas", url: "https://developers.google.com/learn", lang: "EN", grupo: "badges" },
    { id: "trailhead", name: "Salesforce Trailhead · superbadges", url: "https://trailhead.salesforce.com/", lang: "EN", grupo: "badges" },

    /* --- en español --- */
    { id: "google-activate", name: "Google · Garage Digital / Actívate (español)", url: "https://learndigital.withgoogle.com/", lang: "ES", grupo: "es" },
    { id: "ms-learn-es", name: "Microsoft Learn · credenciales en español", url: "https://learn.microsoft.com/es-es/credentials/", lang: "ES", grupo: "es" },
    { id: "freecodecamp-es", name: "freeCodeCamp en español", url: "https://www.freecodecamp.org/espanol/learn", lang: "ES", grupo: "es" },
    { id: "elementsofai-es", name: "Elements of AI en español", url: "https://www.elementsofai.com/es", lang: "ES", grupo: "es" },
    { id: "santander", name: "Santander Open Academy · becas y cursos gratis", url: "https://www.santanderopenacademy.com/es", lang: "ES", grupo: "es" },
    { id: "telefonica", name: "Fundación Telefónica · Conecta Empleo", url: "https://conectaempleo.fundaciontelefonica.com/", lang: "ES", grupo: "es" },
    { id: "hubspot", name: "HubSpot Academy · certificaciones gratis", url: "https://academy.hubspot.com/certification", lang: "ES/EN", grupo: "es" },
    { id: "sence-chile", name: "SENCE Chile · cursos gratis con certificado", url: "https://sence.gob.cl/personas/noticias/sence-y-microsoft-abren-tres-nuevos-cursos-gratuitos-para-ampliar-competencias-digitales", lang: "ES", grupo: "es" },
    { id: "capacitate", name: "Capacítate para el empleo (Fundación Slim)", url: "https://capacitateparaelempleo.org/", lang: "ES", grupo: "es" },

    /* --- comunidades: donde se publican códigos de un solo uso --- */
    { id: "hn-vouchers", name: "Hacker News · 'free voucher' (últimas publicaciones)", url: "https://hn.algolia.com/api/v1/search_by_date?query=%22free%20voucher%22%20certification&tags=story&hitsPerPage=20", lang: "EN", grupo: "comunidad", json: true },
    { id: "reddit-aws", name: "Reddit r/AWSCertifications (nuevo)", url: "https://www.reddit.com/r/AWSCertifications/new.json?limit=25", lang: "EN", grupo: "comunidad", json: true },
    { id: "reddit-comptia", name: "Reddit r/CompTIA · 'voucher code'", url: "https://www.reddit.com/r/CompTIA/search.json?q=voucher%20OR%20%22discount%20code%22&restrict_sr=1&sort=new&t=month&limit=25", lang: "EN", grupo: "comunidad", json: true },
    { id: "reddit-azure", name: "Reddit r/AzureCertification (nuevo)", url: "https://www.reddit.com/r/AzureCertification/new.json?limit=25", lang: "EN", grupo: "comunidad", json: true },

    /* --- agregadores (NO oficiales: confirmar siempre en la fuente) --- */
    { id: "learnitfree", name: "learnitfree.com · listado de certificaciones gratis", url: "https://learnitfree.com/certifications/", lang: "EN", grupo: "agregador" },
    { id: "classcentral", name: "Class Central · credenciales gratis de Google", url: "https://www.classcentral.com/report/free-google-certifications/", lang: "EN", grupo: "agregador" },
    { id: "dumpsgate", name: "dumpsgate · códigos AWS (agregador, no oficial)", url: "https://dumpsgate.com/aws-promo-codes/", lang: "EN", grupo: "agregador" }
  ];

  /* Consultas para DESCUBRIR páginas nuevas (botón "buscar páginas"). */
  var QUERIES = [
    "free certification exam voucher code 2026",
    "100% discount exam voucher certification",
    "código descuento certificación gratis 2026",
    "free IT certification badge no cost 2026"
  ];

  /* ------------------------------------------------------------------ */
  /* Detección                                                           */
  /* ------------------------------------------------------------------ */
  var STRONG_RE = new RegExp(
    "(free|gratis|gratuit[oa]s?|sin costo|sin coste|costo cero|voucher|cup[óo]n|coupon|promo|discount|descuento|" +
    "scholarship|beca|financial (aid|assistance)|asistencia financiera|no cost|no charge|waiv\\w*|" +
    "\\d{2,3}\\s?%|100\\s?%|50\\s?%|half[- ]off|\\$0|0\\s?(usd|eur|clp)|limited[- ]time|tiempo limitado|" +
    "offer period|expires?|vence|deadline|fecha l[íi]mite|ends? on|first \\d+ (people|users|redemptions)|" +
    "badge|insignia|skill badge|micro-credential|credencial digital)",
    "i"
  );

  var PCT_RE = /(\d{2,3})\s?%/g;
  /* Un porcentaje solo cuenta como descuento si la frase habla de descuentos,
     y nunca si es un puntaje/asistencia ("Score at least 80%"). */
  var PCT_CTX_RE = /(\boff\b|\bdto\b|dscto|descuento|discount|\bsave\b|ahorr|saving|voucher|cup[óo]n|coupon|promo|beca|scholarship|\bgratis\b|\bfree\b|\baid\b|reducci[óo]n|half[- ]|\bmenos\b|\bless\b|rebaja|concesi[óo]n)/i;
  var PCT_NO_RE = /(score|grade|calificaci[óo]n|\bnota\b|accuracy|attendance|asistencia(?!\s+financiera)|completion|completitud|passing|aprobaci[óo]n|percentile|interest rate|\bapr\b|markup|success rate|conversion)/i;
  var FREE_RE = /((completely|entirely|totally|fully|absolutely|now|is|are|was|were|went|remain|stays|100\s?%)\s+free\b|\bfree\s+(of charge|to claim|to take|to enroll|to sit|for students|for everyone|for all)\b|\bfree\b(?=[\s\w\-'.]{0,45}\b(exams?|vouchers?|certifications?|certificates?|courses?|badges?|credentials?|training|retakes?|attempts?|seats?|access|enrollment|registration|download|entry)\b)|\bgratis\b|\bgratuit[oa]s?\b|sin (costo|coste)|costo cero|de forma gratuita|a costo cero|\bwaived\b|full(y)? (funded|scholarship)|beca (completa|total|del 100)|no (cost|charge)|\$0\b|zero cost)/i;
  /* "feel free", "free trial" y compañía NO son una credencial gratis. */
  var FREE_NEG_RE = /(feel free|free (trial|tier|account|plan|version|sample|preview|webinar|newsletter|e-?book|community edition|to (sign|join|try|play|browse|read))|freemium|free shipping)/i;
  var BECA_RE = /(financial aid|financial assistance|scholarship|beca|asistencia financiera|need[- ]based|subsid\w+)/i;
  var UNICO_RE = /(single[- ]use|one[- ]time (use|code|voucher)|unique (code|voucher|url)|c[óo]digo [úu]nico|[úu]nico uso|un solo uso|solo un uso|non[- ]transferable|first \d+ (people|users|redemptions|claims)|limitad[oa] a (las )?primeras|\d+ (redemptions|uses) (only|left|remaining)|while supplies last|hasta agotar (stock|cupos)|one per (person|candidate|account))/i;
  var BADGE_RE = /(badge|insignia|skill badge|micro[- ]?credential|credencial digital|digital credential|completion certificate|certificado de finalizaci[óo]n|diploma|superbadge)/i;
  var CODIGO_CTX_RE = /(promo(code)?|promo code|voucher code|coupon code|discount code|exam code|c[óo]digo( promocional| de descuento)?|cup[óo]n|code at checkout|use (the )?code|apply (the )?code|c[óo]digo:|code:)/i;
  var CODE_TOKEN_RE = /\b([A-Z0-9][A-Z0-9][A-Z0-9\-_]{2,22})\b/g;

  /* Palabras en mayúscula que NO son códigos. */
  var CODE_STOP = ("AWS,AZURE,AWS-CERTIFIED,GOOGLE,MICROSOFT,IBM,ORACLE,CISCO,META,HARVARD,MIT,STANFORD,SALESFORCE," +
    "FREE,GRATIS,OFF,NEW,NUEVO,USE,USED,GET,AND,THE,FOR,WITH,YOUR,OUR,CODE,CODES,PROMO,VOUCHER,COUPON,DISCOUNT," +
    "DESCUENTO,CUPON,CODIGO,CERT,CERTIFIED,CERTIFICATION,EXAM,EXAMS,LEARN,LEARNING,SKILLS,SKILL,BADGE,BADGES," +
    "CLOUD,DATA,AI,ML,IT,API,SQL,PYTHON,JAVA,LINUX,SECURITY,CYBERSECURITY,DEVOPS,STUDENT,STUDENTS,UNIVERSITY," +
    "STUDENTREWARDS,CREDLY,HTTP,HTTPS,WWW,COM,ORG,NET,HTML,CSS,JSON,XML,API,SDK,GIT,GITHUB,LINKEDIN,CV,ATS," +
    "FAQ,FAQS,T&C,TC,USD,EUR,CLP,SEP,SEPT,OCT,NOV,DEC,JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,EN,ES,ALL,ANY,BUY,NOW," +
    "SAVE,SAVINGS,TODAY,ONLY,LIMITED,TIME,OFFER,OFFERS,PERCENT,DISCOUNTS,APPLY,REGISTER,SIGN,UP,LOG,IN,OUT," +
    "MORE,MOST,BEST,TOP,FIRST,LAST,NEXT,THIS,THAT,THESE,THOSE,NOT,YES,NO,IF,OR,AS,AT,BY,ON,IN,IS,ARE,BE,DO," +
    "PLUS,PRO,PREMIUM,BASIC,BASE,FOUNDATION,FOUNDATIONS,ASSOCIATE,PROFESSIONAL,SPECIALTY,MASTER,PRACTITIONER," +
    "ANALYTICS,ANALYST,ENGINEER,ARCHITECT,DEVELOPER,ADMINISTRATOR,MANAGER,MARKETING,DESIGN,UX,PM,PMP,CAPM," +
    "NETACAD,NETacad,SKILLSHOP,SKILLSBOOST,TRAILHEAD,SKILLSBUILD,COGNITIVE,CLASS,ACADEMY,UNIVERSITY,INSTITUTE," +
    "OPEN,COURSES,COURSE,PROGRAM,PROGRAMS,EVENT,EVENTS,WEEK,WEEKS,DAYS,DAY,MONTH,YEAR,UTC,PST,EST,CET").split(",");

  var STOP_SET = {};
  CODE_STOP.forEach(function (w) { STOP_SET[w.toUpperCase()] = 1; });

  var ES_HINT = /\b(certificaci|gratis|descuento|c[oó]digo|cup[oó]n|beca|examen|curso|plataforma|postula|reg[ií]strate|vigente|hasta el|para|m[aá]s|informaci[oó]n)\b/i;
  var EN_HINT = /\b(certification|free|discount|voucher|code|coupon|scholarship|exam|course|apply|register|available|deadline|earn|complete)\b/i;

  /* ------------------------------------------------------------------ */
  /* Utilidades                                                          */
  /* ------------------------------------------------------------------ */
  function enc(s) { return encodeURIComponent(s); }

  function ahoraISO() { return new Date().toISOString().replace(/\.\d+Z$/, "Z"); }
  function hoyISO() { return ahoraISO().slice(0, 10); }

  function store(k) {
    try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (e) { return null; }
  }
  function storeSet(k, v) {
    try { if (window.localStorage) window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function loadJSON(k, def) {
    var raw = store(k);
    if (!raw) return def;
    try { var o = JSON.parse(raw); return o == null ? def : o; } catch (e) { return def; }
  }

  function shaish(s) {
    /* firma corta y estable (FNV-1a + longitud) — sin criptografía, solo dedupe */
    var h = 0x811c9dc5, i;
    for (i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
    var g = 0x1000193, j;
    for (j = s.length - 1; j >= 0; j--) { g ^= s.charCodeAt(j); g = (g * 0x811c9dc5) >>> 0; }
    return ("00000000" + h.toString(16)).slice(-8) + ("00000000" + g.toString(16)).slice(-8) + (s.length % 997);
  }

  function normalizar(t) { return String(t).toLowerCase().replace(/[^a-z0-9]+/g, ""); }

  var ENTIDADES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "-", mdash: "-", hellip: "..." };
  function decodeEnt(t) {
    return String(t).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, function (m, g) {
      if (g.charAt(0) === "#") {
        var n = g.charAt(1) === "x" || g.charAt(1) === "X" ? parseInt(g.slice(2), 16) : parseInt(g.slice(1), 10);
        return isNaN(n) ? m : String.fromCharCode(n);
      }
      var k = g.toLowerCase();
      return ENTIDADES[k] !== undefined ? ENTIDADES[k] : m;
    });
  }

  function htmlATexto(raw) {
    var t = String(raw || "")
      .replace(/<(script|style|noscript|svg|head)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ");
    return decodeEnt(t).replace(/\xa0/g, " ").replace(/\s+/g, " ").trim();
  }

  var CLAVES_JSON = /^(selftext|title|body|url|name|comment|story_text|story|text|description|content|message|link|headline)$/i;

  function jsonATexto(raw) {
    /* De un JSON (Reddit / Hacker News / cualquier API) saca los textos útiles:
       recorre TODO el árbol y conserva las cadenas de claves conocidas
       (title, selftext, url…) o cualquier texto largo que parezca prosa. */
    var out = [];
    var data;
    try { data = JSON.parse(raw); } catch (e) { return htmlATexto(raw); }
    (function walk(o, depth, clave) {
      if (o == null || depth > 10 || out.length > 600) return;
      if (typeof o === "string") {
        if (CLAVES_JSON.test(clave || "") || o.length > 60) out.push(o);
        return;
      }
      if (typeof o !== "object") return;
      if (Array.isArray(o)) {
        for (var i = 0; i < o.length; i++) walk(o[i], depth + 1, clave);
        return;
      }
      for (var k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k)) walk(o[k], depth + 1, k);
      }
    })(data, 0, "");
    return out.join(" . ").replace(/\s+/g, " ").trim();
  }

  function textoDe(raw, esJSON) {
    var s = String(raw || "").trim();
    if (esJSON || /^[{\[]/.test(s)) return jsonATexto(s);
    if (s.indexOf("<") !== -1) return htmlATexto(s);
    return decodeEnt(s).replace(/\s+/g, " ").trim();
  }

  function oraciones(texto) {
    /* Sin lookbehind: así funciona también en WebView/navegadores antiguos */
    return String(texto).split(/[.!?]+\s+|\s*[|•·]\s*|\s*\n\s*/).map(function (s) { return s.trim(); })
      .filter(function (s) { return normalizar(s).length >= 25; });
  }

  function idiomaDe(texto, fuente) {
    if (fuente && fuente.lang) return fuente.lang;
    var es = (String(texto).match(ES_HINT) || []).length;
    var en = (String(texto).match(EN_HINT) || []).length;
    if (es && en) return "ES/EN";
    if (es) return "ES";
    return "EN";
  }

  function codigosDe(frase) {
    var out = [], m, vistos = {};
    CODE_TOKEN_RE.lastIndex = 0;
    while ((m = CODE_TOKEN_RE.exec(frase)) !== null) {
      var tok = m[1];
      if (tok.length < 5 || tok.length > 24) continue;
      if (STOP_SET[tok.toUpperCase()]) continue;
      if (/^[A-Z]+$/.test(tok) && tok.length < 6 && !/\d/.test(tok)) continue; // siglas cortas
      if (/^(?!.*[A-Z])(?!.*\d)/.test(tok)) continue;
      if (vistos[tok]) continue;
      vistos[tok] = 1;
      out.push(tok);
      if (out.length >= 4) break;
    }
    /* Si la frase no habla de códigos, descarta falsos positivos */
    if (out.length && !CODIGO_CTX_RE.test(frase)) {
      out = out.filter(function (t) { return /\d/.test(t) && t.length >= 6; });
    }
    return out;
  }

  function descuentoDe(frase) {
    /* Devuelve {disc, etiqueta, beca}. disc: 100 | 50 | otro número | null */
    var pcts = [], m;
    PCT_RE.lastIndex = 0;
    while ((m = PCT_RE.exec(frase)) !== null) {
      var n = parseInt(m[1], 10);
      if (n >= 5 && n <= 100) pcts.push(n);
    }
    var libre = FREE_RE.test(frase) && !FREE_NEG_RE.test(frase);
    var beca = BECA_RE.test(frase);
    var max = null;
    if (pcts.length && !PCT_NO_RE.test(frase) && (PCT_CTX_RE.test(frase) || beca)) {
      max = Math.max.apply(null, pcts);   // en becas el % es el monto de la ayuda
    }

    if (max === 100) return { disc: 100, etiqueta: beca ? "BECA 100%" : "100% GRATIS", beca: beca };
    if (libre && max === null) return { disc: 100, etiqueta: "100% GRATIS", beca: beca };
    if (max !== null) return { disc: max, etiqueta: (beca ? "BECA " : "") + max + "% DESCUENTO", beca: beca };
    if (libre) return { disc: 100, etiqueta: "100% GRATIS", beca: beca };
    if (beca) return { disc: null, etiqueta: "BECA / AYUDA", beca: true };
    return { disc: null, etiqueta: "", beca: false };
  }

  function parecido(a, b, umbral) {
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.indexOf(b) !== -1 || b.indexOf(a) !== -1) return true;
    /* Jaccard sobre bigramas: rápido, sin dependencias y suficiente */
    umbral = umbral || 0.86;
    function big(s) { var o = {}, i; for (i = 0; i < s.length - 1; i++) o[s.substr(i, 2)] = 1; return o; }
    var A = big(a), B = big(b), inter = 0, k, na = 0, nb = 0;
    for (k in A) { na++; if (B[k]) inter++; }
    for (k in B) nb++;
    var j = inter / (na + nb - inter || 1);
    return j >= umbral;
  }

  /* ------------------------------------------------------------------ */
  /* Análisis de una página                                              */
  /* ------------------------------------------------------------------ */
  function analizar(raw, fuente) {
    var texto = textoDe(raw, fuente && fuente.json);
    if (!texto) return [];
    var frases = oraciones(texto);
    var vistos = [], out = [];
    var idioma = idiomaDe(texto, fuente);

    for (var i = 0; i < frases.length && out.length < MAX_POR_FUENTE * 2; i++) {
      var f = frases[i].slice(0, SNIPPET_MAX);
      if (!STRONG_RE.test(f)) continue;
      if (/^https?:\/\/\S+$/i.test(f.trim())) continue;   // una URL suelta no es un hallazgo
      if ((f.match(/https?:\/\//g) || []).length * 40 > f.length) continue;  // frase dominada por enlaces
      var sig = normalizar(f).slice(0, SIG_LEN);
      if (!sig) continue;
      var dup = false;
      for (var j = 0; j < vistos.length; j++) if (parecido(sig, vistos[j], 0.86)) { dup = true; break; }
      if (dup) continue;
      vistos.push(sig);

      var d = descuentoDe(f);
      var codes = codigosDe(f);
      var unico = UNICO_RE.test(f);
      var badge = BADGE_RE.test(f);
      var vale = d.disc !== null || d.beca || codes.length || unico || badge ||
                 /(voucher|cup[óo]n|coupon|beca|scholarship|financial aid|descuento|discount)/i.test(f);
      if (!vale) continue;

      out.push({
        id: shaish((fuente ? fuente.id : "?") + "|" + sig),
        src: fuente ? fuente.id : "custom",
        name: fuente ? fuente.name : (fuente && fuente.name) || "Página",
        url: fuente ? fuente.url : "",
        text: f,
        sig: sig,
        found: hoyISO(),
        kind: codes.length ? "codigo" : (badge && d.disc === null ? "badge" : "oferta"),
        review: false,
        disc: d.disc,
        etiqueta: d.etiqueta,
        beca: d.beca,
        codes: codes,
        unico: unico,
        badge: badge,
        lang: idioma,
        grupo: fuente ? (fuente.grupo || "oficial") : "custom",
        live: true
      });
    }
    out.sort(function (a, b) {
      var pa = a.disc === 100 ? 0 : (a.disc !== null ? 1 : (a.beca ? 2 : 3));
      var pb = b.disc === 100 ? 0 : (b.disc !== null ? 1 : (b.beca ? 2 : 3));
      return pa - pb || (b.codes.length - a.codes.length) || (b.text.length - a.text.length);
    });
    return out.slice(0, MAX_POR_FUENTE);
  }

  /* ------------------------------------------------------------------ */
  /* Transporte: puente nativo Android, luego fetch directo, luego proxies CORS  */
  /* ------------------------------------------------------------------ */
  var pendientes = {}, trozos = {}, seq = 0;

  function entregarNativo(cb, payload) {
    var f = pendientes[cb];
    if (f) { delete pendientes[cb]; f(payload); }
  }
  /* La APK entrega el cuerpo en trozos (el binder de Android no pasa de ~1 MB). */
  window.__certfNativeChunk = function (cb, idx, total, parte) {
    var buf = trozos[cb] || (trozos[cb] = { n: Number(total) || 1, parts: [], recibidos: 0 });
    if (buf.parts[idx] === undefined) { buf.parts[idx] = String(parte == null ? "" : parte); buf.recibidos++; }
    if (buf.recibidos >= buf.n) {
      var completo = buf.parts.join("");
      delete trozos[cb];
      entregarNativo(cb, completo);
    }
  };
  /* Compatibilidad con entrega de una sola pieza. */
  window.__certfNativeDone = function (cb, payload) { entregarNativo(cb, payload); };

  function conTimeout(promise, ms, etiqueta) {
    var to;
    var t = new Promise(function (_, reject) {
      to = setTimeout(function () { reject(new Error("timeout " + etiqueta)); }, ms);
    });
    return Promise.race([promise, t]).then(
      function (v) { clearTimeout(to); return v; },
      function (e) { clearTimeout(to); throw e; }
    );
  }

  function hayNativo() {
    var N = window.CertfNative;
    if (!N || typeof N.fetchUrl !== "function") return false;
    try { return typeof N.disponible !== "function" ? true : !!N.disponible(); } catch (e) { return true; }
  }

  function fetchNativo(url) {
    return new Promise(function (resolve, reject) {
      var N = window.CertfNative;
      if (!hayNativo()) { reject(new Error("sin puente nativo")); return; }
      var cb = "cb" + (++seq);
      pendientes[cb] = function (payload) {
        try {
          var d = typeof payload === "string" ? JSON.parse(payload) : payload;
          if (d && d.error) { reject(new Error(String(d.error))); return; }
          resolve({ status: (d && d.status) || 200, body: (d && d.body) || "", transporte: "nativo (APK)" });
        } catch (e) { reject(e); }
      };
      try { N.fetchUrl(url, cb); } catch (e) { delete pendientes[cb]; reject(e); }
    });
  }

  function fetchDirecto(url) {
    if (typeof fetch !== "function") return Promise.reject(new Error("fetch no disponible"));
    var ctrl = null;
    var init = { method: "GET", redirect: "follow", cache: "no-store" };
    var timer = null;
    if (typeof AbortController === "function") {
      ctrl = new AbortController();
      init.signal = ctrl.signal;
      timer = setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, TIMEOUT_MS);
    }
    function limpiar(v) { if (timer) { clearTimeout(timer); timer = null; } return v; }
    return fetch(url, init).then(function (res) {
      if (!res || !res.ok) throw new Error("HTTP " + ((res && res.status) || 0));
      return res.text();
    }).then(function (txt) {
      limpiar(null);
      return { status: 200, body: String(txt || "").slice(0, BODY_MAX), transporte: "directo" };
    }, function (e) {
      limpiar(null);
      throw e;
    });
  }

  function malCuerpo(body) {
    if (!body || body.length < 120) return true;
    var head = String(body).slice(0, 900);
    if (/Oops\.\.\.\s*Request Timeout/i.test(head)) return true;
    if (/522:\s*Connection timed out/i.test(head)) return true;
    if (/^\s*\{\s*"error"/i.test(head)) return true;
    if (/Just a moment|Enable JavaScript and cookies to continue/i.test(head)) return true;
    if (/cf-error-details|Attention Required!\s*\|\s*Cloudflare/i.test(head)) return true;
    if (/Access Denied|Request rejected|blocked by security/i.test(head)) return true;
    return false;
  }

  function transports() {
    var t = [];
    if (hayNativo()) {
      t.push({ id: "nativo", build: function (u) { return u; }, run: fetchNativo, timeout: TIMEOUT_NATIVO });
    }
    t.push({ id: "directo", build: function (u) { return u; }, run: fetchDirecto });
    t.push({ id: "jina", build: function (u) { return "https://r.jina.ai/" + u; }, run: fetchDirecto });
    t.push({ id: "allorigins", build: function (u) { return "https://api.allorigins.win/raw?url=" + enc(u); }, run: fetchDirecto });
    t.push({ id: "codetabs", build: function (u) { return "https://api.codetabs.com/v1/proxy/?quest=" + enc(u); }, run: fetchDirecto });
    t.push({ id: "corsfix", build: function (u) { return "https://proxy.corsfix.com/" + u; }, run: fetchDirecto });
    t.push({ id: "thingproxy", build: function (u) { return "https://thingproxy.freeboard.io/fetch/" + u; }, run: fetchDirecto });
    return t;
  }

  function descargar(url, esJSON) {
    var lista = transports();
    var i = 0;
    var ultimoError = "sin respuesta";
    function intento() {
      if (i >= lista.length) return Promise.reject(new Error(ultimoError));
      var t = lista[i++];
      var objetivo;
      try { objetivo = t.build(url); } catch (e) { return intento(); }
      return conTimeout(t.run(objetivo), t.timeout || TIMEOUT_MS, t.id).then(function (r) {
        if (!r || malCuerpo(r.body)) { ultimoError = "respuesta vacía o bloqueada (" + t.id + ")"; return intento(); }
        r.transporte = t.id === "nativo" ? "nativo (APK)" : t.id;
        return r;
      }, function (e) {
        ultimoError = (e && e.message) || String(e);
        return intento();
      });
    }
    return intento();
  }

  /* ------------------------------------------------------------------ */
  /* Estado / memoria                                                    */
  /* ------------------------------------------------------------------ */
  function vistosCargar() { return loadJSON(K_SEEN, {}); }

  function vistosGuardar(mapa) {
    var keys = Object.keys(mapa);
    if (keys.length > 2500) {
      keys.sort(function (a, b) { return String(mapa[a]).localeCompare(String(mapa[b])); });
      keys.slice(0, keys.length - 2500).forEach(function (k) { delete mapa[k]; });
    }
    storeSet(K_SEEN, mapa);
  }

  function firmasDeReferencia() {
    /* lo que ya publicó el rastreador diario cuenta como "visto" */
    var nov = window.__CERTF_NOVEDADES__ || { items: [] };
    var out = {};
    (nov.items || []).forEach(function (v) { if (v && v.sig) out[v.sig] = v.found || hoyISO(); });
    return out;
  }

  function customFuentes() { return loadJSON(K_CUSTOM, []); }
  function customGuardar(list) { storeSet(K_CUSTOM, list); }

  function fuentesActivas(opts) {
    opts = opts || {};
    var grupos = opts.grupos || ["oficial", "badges", "es"];
    var out = SOURCES.filter(function (s) { return grupos.indexOf(s.grupo) !== -1; });
    if (opts.ids && opts.ids.length) out = out.filter(function (s) { return opts.ids.indexOf(s.id) !== -1; });
    return out.concat(customFuentes().map(function (c) {
      return { id: c.id, name: c.name, url: c.url, lang: c.lang || "?", grupo: "custom" };
    }));
  }

  /* ------------------------------------------------------------------ */
  /* Escaneo                                                             */
  /* ------------------------------------------------------------------ */
  function scan(opts) {
    opts = opts || {};
    var fuentes = fuentesActivas(opts);
    var vistos = vistosCargar();
    var ref = firmasDeReferencia();
    var porFuente = [], hallazgos = [];
    var hechas = 0, total = fuentes.length;
    var inicio = Date.now();

    function avisar(ev) { if (typeof opts.onProgress === "function") { try { opts.onProgress(ev); } catch (e) {} } }

    function una(fuente) {
      avisar({ tipo: "inicio", fuente: fuente, hechas: hechas, total: total });
      return descargar(fuente.url, fuente.json).then(function (r) {
        var items = analizar(r.body, fuente);
        var nuevos = 0;
        items.forEach(function (it) {
          it.transporte = r.transporte;
          var conocido = vistos[it.sig] || ref[it.sig];
          it.nuevo = !conocido;
          it.vistoDesde = conocido || null;
          if (it.nuevo) nuevos++;
          vistos[it.sig] = ahoraISO();
          var dup = false;
          for (var k = 0; k < hallazgos.length; k++) if (parecido(hallazgos[k].sig, it.sig, 0.9)) { dup = true; break; }
          if (!dup) hallazgos.push(it);
        });
        var reg = { id: fuente.id, name: fuente.name, url: fuente.url, grupo: fuente.grupo, lang: fuente.lang,
                    ok: true, status: r.status, transporte: r.transporte, hallazgos: items.length, nuevos: nuevos,
                    error: null, ms: Date.now() - inicio };
        porFuente.push(reg);
        hechas++;
        avisar({ tipo: "fin", fuente: fuente, reg: reg, hechas: hechas, total: total });
        return reg;
      }, function (e) {
        var reg = { id: fuente.id, name: fuente.name, url: fuente.url, grupo: fuente.grupo, lang: fuente.lang,
                    ok: false, status: 0, transporte: "-", hallazgos: 0, nuevos: 0,
                    error: (e && e.message) || String(e), ms: Date.now() - inicio };
        porFuente.push(reg);
        hechas++;
        avisar({ tipo: "fin", fuente: fuente, reg: reg, hechas: hechas, total: total });
        return reg;
      });
    }

    /* pool con CONC trabajadores */
    return new Promise(function (resolve) {
      var idx = 0;
      function cancelado() { return !!(opts.signal && opts.signal.cancelado); }
      function worker() {
        if (cancelado() || idx >= fuentes.length) return Promise.resolve();
        var f = fuentes[idx++];
        return una(f).then(worker);
      }
      var arr = [];
      for (var w = 0; w < Math.min(CONC, fuentes.length); w++) arr.push(worker());
      Promise.all(arr).then(function () {
        vistosGuardar(vistos);
        hallazgos.sort(function (a, b) {
          return (a.nuevo === b.nuevo ? 0 : (a.nuevo ? -1 : 1)) ||
                 ((b.disc || 0) - (a.disc || 0)) ||
                 (b.codes.length - a.codes.length);
        });
        var res = {
          checked: ahoraISO(),
          items: hallazgos.slice(0, MAX_ITEMS),
          fuentes: porFuente,
          totalFuentes: fuentes.length,
          okFuentes: porFuente.filter(function (r) { return r.ok; }).length,
          nuevos: hallazgos.filter(function (h) { return h.nuevo; }).length,
          gratis100: hallazgos.filter(function (h) { return h.disc === 100; }).length,
          dto50: hallazgos.filter(function (h) { return h.disc === 50; }).length,
          codigos: hallazgos.filter(function (h) { return h.codes && h.codes.length; }).length,
          unicos: hallazgos.filter(function (h) { return h.unico; }).length,
          ms: Date.now() - inicio
        };
        res.cancelado = cancelado();
        if (!opts.noGuardar) guardarScan(res);
        avisar({ tipo: "listo", res: res });
        resolve(res);
      });
    });
  }

  function guardarScan(res) {
    try { storeSet(K_SCAN, { checked: res.checked, items: res.items, fuentes: res.fuentes, resumen: resumenDe(res) }); }
    catch (e) {}
  }
  function resumenDe(res) {
    return { totalFuentes: res.totalFuentes, okFuentes: res.okFuentes, nuevos: res.nuevos,
             gratis100: res.gratis100, dto50: res.dto50, codigos: res.codigos, unicos: res.unicos, ms: res.ms };
  }
  function scanGuardado() { return loadJSON(K_SCAN, null); }

  /* ------------------------------------------------------------------ */
  /* Descubrir páginas nuevas (motores de búsqueda)                      */
  /* ------------------------------------------------------------------ */
  function extraerLinksDDG(html) {
    /* DuckDuckGo HTML: cada resultado trae href="//duckduckgo.com/l/?uddg=<url codificada>" */
    var out = [], m;
    var rx = /class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]{0,220}?)<\/a>/g;
    while ((m = rx.exec(html)) !== null) {
      var href = decodeEnt(m[1]);
      var titulo = htmlATexto(m[2]).slice(0, 140);
      var uddg = /uddg=([^&]+)/.exec(href);
      if (uddg) { try { href = decodeURIComponent(uddg[1]); } catch (e) {} }
      if (/^https?:\/\//i.test(href)) out.push({ url: href, titulo: titulo });
    }
    if (!out.length) {
      var rx2 = /uddg=([^&"']+)/g;
      while ((m = rx2.exec(html)) !== null) {
        try { out.push({ url: decodeURIComponent(m[1]), titulo: "" }); } catch (e) {}
      }
    }
    return out;
  }

  function extraerLinksTexto(texto) {
    var out = [], m, rx = /https?:\/\/[^\s"'<>)\]]{12,180}/g;
    while ((m = rx.exec(texto)) !== null) out.push(m[0].replace(/[.,;]+$/, ""));
    return out;
  }

  /* Ojo con los falsos positivos ("example" contiene "exam"): por eso los \b. */
  var FILTRO_DESCUBRIMIENTO = /(certificaci[óo]n|certificat|certificad|voucher|cup[óo]n|coupon|\bbadge|\binsignia|credential|\bbeca|scholarship|\bgratis|\bfree\b|descuento|discount|\bexam(s|ination)?\b|\bcode\b|c[óo]digo)/i;
  var DOMINIOS_BASURA = /(duckduckgo\.com|google\.(com|cl)\/(search|url)|bing\.com|facebook\.com\/login|youtube\.com\/results|twitter\.com\/intent|pinterest\.|amazon\.(com|cl)\/gp|reddit\.com\/r\/[^/]+\/comments\/[a-z0-9]+\/[a-z0-9_]+\/[a-z0-9_]+\/|schema\.org|w3\.org|creativecommons\.org|gravatar\.com|googleapis\.com|gstatic\.com|cloudflare\.com|jina\.ai|allorigins|codetabs|corsfix|freeboard\.io)/i;

  function discover(opts) {
    opts = opts || {};
    var queries = opts.queries || QUERIES.slice(0, 2);
    var conocidos = {};
    SOURCES.forEach(function (s) {conocidos[normalizar(s.url)] = 1; });
    customFuentes().forEach(function (c) {conocidos[normalizar(c.url)] = 1; });
    var candidatos = [];

    function agregar(url, origen, titulo) {
      if (!url || url.length < 14) return;
      if (DOMINIOS_BASURA.test(url)) return;
      if (!/^https:\/\//i.test(url)) return;
      var k = normalizar(url.replace(/[#?].*$/, ""));
      if (conocidos[k]) return;
      for (var i = 0; i < candidatos.length; i++) if (candidatos[i].k === k) return;
      if (!FILTRO_DESCUBRIMIENTO.test(url + " " + (titulo || ""))) return;
      conocidos[k] = 1;
      candidatos.push({ k: k, url: url.replace(/[#?].*$/, ""), origen: origen, titulo: (titulo || "").slice(0, 140) });
    }

    function unaQuery(q) {
      var trabajos = [
        descargar("https://html.duckduckgo.com/html/?q=" + enc(q + " certification free voucher"), false).then(function (r) {
          extraerLinksDDG(r.body).forEach(function (o) { agregar(o.url, "DuckDuckGo", o.titulo); });
        }, function () {}),
        descargar("https://hn.algolia.com/api/v1/search_by_date?query=" + enc(q) + "&tags=story&hitsPerPage=15", true).then(function (r) {
          extraerLinksTexto(r.body).forEach(function (u) { agregar(u, "Hacker News", ""); });
        }, function () {})
      ];
      return Promise.all(trabajos);
    }

    var cadena = Promise.resolve();
    queries.forEach(function (q) { cadena = cadena.then(function () { return unaQuery(q); }); });
    return cadena.then(function () {
      return candidatos.slice(0, 18).map(function (c) {
        return { url: c.url, origen: c.origen, titulo: c.titulo, id: "desc-" + shaish(c.k).slice(0, 8) };
      });
    });
  }

  /* Escanea una URL suelta (una página descubierta o agregada a mano). */
  function scanURL(url, nombre) {
    var fuente = { id: "url-" + shaish(url).slice(0, 8), name: nombre || url, url: url, lang: null, grupo: "custom" };
    return descargar(url, false).then(function (r) {
      var items = analizar(r.body, fuente);
      var vistos = vistosCargar();
      var ref = firmasDeReferencia();
      items.forEach(function (it) {
        it.transporte = r.transporte;
        it.nuevo = !(vistos[it.sig] || ref[it.sig]);
        vistos[it.sig] = ahoraISO();
      });
      vistosGuardar(vistos);
      return { ok: true, url: url, transporte: r.transporte, items: items };
    }, function (e) {
      return { ok: false, url: url, error: (e && e.message) || String(e), items: [] };
    });
  }

  /* ------------------------------------------------------------------ */
  /* Páginas vigiladas por el usuario                                    */
  /* ------------------------------------------------------------------ */
  function agregarCustom(url, nombre) {
    url = String(url || "").trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    var list = customFuentes();
    var id = "custom-" + shaish(url).slice(0, 8);
    if (list.some(function (c) { return c.id === id; })) return { ok: false, error: "ya la estás vigilando", list: list };
    list.push({ id: id, name: nombre || url.replace(/^https?:\/\//, "").split("/")[0], url: url, lang: "?", added: hoyISO() });
    customGuardar(list);
    return { ok: true, list: list };
  }
  function quitarCustom(id) {
    var list = customFuentes().filter(function (c) { return c.id !== id; });
    customGuardar(list);
    return list;
  }

  /* ------------------------------------------------------------------ */
  /* Preferencias y utilidades para la app                               */
  /* ------------------------------------------------------------------ */
  function prefs() { return loadJSON(K_PREFS, { grupos: ["oficial", "badges", "es"], auto: false }); }
  function setPrefs(p) { var cur = prefs(); for (var k in p) if (Object.prototype.hasOwnProperty.call(p, k)) cur[k] = p[k]; storeSet(K_PREFS, cur); return cur; }

  function borrarTodo() {
    [K_SCAN, K_SEEN].forEach(function (k) { try { window.localStorage && window.localStorage.removeItem(k); } catch (e) {} });
  }

  /* Clasifica un hallazgo viejo (p. ej. del rastreador diario) que no trae descuento. */
  function clasificar(item) {
    if (item && (item.disc !== undefined || item.etiqueta)) return item;
    var t = (item && (item.text || "")) + " " + (item && item.name || "");
    var d = descuentoDe(t);
    var codes = codigosDe(t);
    var out = {};
    for (var k in item) if (Object.prototype.hasOwnProperty.call(item, k)) out[k] = item[k];
    out.disc = d.disc; out.etiqueta = d.etiqueta; out.beca = d.beca;
    out.codes = codes; out.unico = UNICO_RE.test(t); out.badge = BADGE_RE.test(t);
    out.lang = idiomaDe(t, null);
    out.sig = out.sig || normalizar(t).slice(0, SIG_LEN);
    return out;
  }

  /* ¿Estamos dentro de la APK? Ahí el puente nativo descarga sin CORS. */
  function esApp() {
    return !!(typeof window !== "undefined" && window.CertfNative &&
      typeof window.CertfNative.fetchUrl === "function");
  }

  window.CertfScanner = {
    SOURCES: SOURCES,
    esApp: esApp,
    QUERIES: QUERIES,
    scan: scan,
    scanURL: scanURL,
    discover: discover,
    analizar: analizar,
    descuentoDe: descuentoDe,
    codigosDe: codigosDe,
    clasificar: clasificar,
    textoDe: textoDe,
    htmlATexto: htmlATexto,
    jsonATexto: jsonATexto,
    normalizar: normalizar,
    parecido: parecido,
    scanGuardado: scanGuardado,
    guardarScan: guardarScan,
    customFuentes: customFuentes,
    agregarCustom: agregarCustom,
    quitarCustom: quitarCustom,
    fuentesActivas: fuentesActivas,
    transports: transports,
    prefs: prefs,
    setPrefs: setPrefs,
    borrarTodo: borrarTodo,
    idiomas: ["ES", "EN", "ES/EN", "MULTI"]
  };
})();
