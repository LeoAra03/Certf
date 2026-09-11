#!/usr/bin/env python3
"""Certf — rastreador diario de certificaciones.

Revisa una lista de fuentes oficiales (AWS, Microsoft, IBM, edX, GitHub,
Cisco, ISC2, Google, Helsinki, freeCodeCamp, Coursera…), detecta ofertas
nuevas o páginas que cambiaron, y publica los hallazgos en web/novedades.js
(los consume la pestaña "Novedades" de la PWA/APK).

Publicación:
  * Señal clara de oferta (voucher, 50%, free, beca…)  -> novedad "oferta".
  * La página cambió pero sin señales extraíbles       -> novedad "cambio"
    marcada review=true; el workflow de CI abre un PR para revisarla.
  * El estado de lo ya visto queda en data/crawler-state.json para no
    repetir novedades día tras día.

Uso:
  python3 tools/crawler.py                          # rastreo real (CI / local con red)
  python3 tools/crawler.py --report data/last-report.md
  python3 tools/crawler.py --offline tools/fixtures # usa HTML local en vez de la red
  python3 tools/crawler.py --selftest               # pruebas sin red (deterministas)
  python3 tools/crawler.py --dry-run                # no escribe archivos

Solo usa la biblioteca estándar de Python 3.
"""
from __future__ import annotations

import argparse
import datetime as dt
import difflib
import hashlib
import html as html_mod
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STATE_PATH = os.path.join(ROOT, "data", "crawler-state.json")
NOVEDADES_PATH = os.path.join(ROOT, "web", "novedades.js")
FIXTURES_DIR = os.path.join(ROOT, "tools", "fixtures")

MAX_ITEMS = 40            # tope de novedades publicadas en la app
PRUNE_DAYS = 45           # las novedades más viejas que esto se descartan
MAX_NUEVOS_POR_FUENTE = 3
SNIPPET_MAX = 400         # largo máximo de una oración candidata
SIG_LEN = 160             # largo de la firma (oración normalizada, truncada)

# Palabras que indican una oferta aprovechable (gratis, voucher, % de beca…)
STRONG_RE = re.compile(
    r"(free|gratis|gratuit[oa]s?|voucher|promo|coupon|c[oó]digo promocional|"
    r"discount|descuento|scholarship|beca|financial (aid|assistance)|no cost|"
    r"waiv\w*|100\s?%|50\s?%|75\s?%|80[-–]\d{0,3}\s?%|90\s?%|limited[- ]time|"
    r"offer period|expires?|deadline|ends? on|ends? \w+ \d)",
    re.I,
)

# Fechas para el informe (no se usan para decidir nada crítico)
DATE_RES = [
    re.compile(r"\d{4}-\d{2}-\d{2}"),
    re.compile(r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}", re.I),
    re.compile(r"\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}", re.I),
]

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0 Safari/537.36 CertfBot/1.0 (+https://github.com/LeoAra03/Certf)")

# ---------------------------------------------------------------------------
# Fuentes oficiales ya usadas por el catálogo (web/data.js). Añadir aquí.
# ---------------------------------------------------------------------------
SOURCES = [
    {"id": "aws-aif2cloud",     "name": "AWS · Código AIF2CLOUD (Pearson VUE)", "url": "https://www.pearsonvue.com/us/en/aws/aif2cloud.html"},
    {"id": "aws-student",       "name": "AWS · Voucher estudiante (Builder Center)", "url": "https://builder.aws.com/student-rewards"},
    {"id": "aws-certification", "name": "AWS · Página de certificaciones", "url": "https://aws.amazon.com/certification/"},
    {"id": "ms-certweek",       "name": "Microsoft · Certification Week", "url": "https://certweeks.fastlane.net/amer/az-sec-en"},
    {"id": "ms-applied",        "name": "Microsoft · Applied Skills", "url": "https://learn.microsoft.com/en-us/credentials/applied-skills/"},
    {"id": "ibm-uopeople",      "name": "IBM SkillsBuild · Certificados con UoPeople", "url": "https://skillsbuild.org/college-students/college-certificates"},
    {"id": "oracle-free",       "name": "Oracle · Free training & certification", "url": "https://mylearn.oracle.com/ou/story/163512"},
    {"id": "edx-aid",           "name": "edX · Asistencia financiera", "url": "https://courses.edx.org/financial-assistance/"},
    {"id": "github-pack",       "name": "GitHub · Student Developer Pack", "url": "https://education.github.com/pack"},
    {"id": "cisco-netacad",     "name": "Cisco · Networking Academy", "url": "https://www.netacad.com/courses"},
    {"id": "isc2-1mcc",         "name": "ISC2 · 1MCC (códigos gratuitos)", "url": "https://www.isc2.org/1mcc"},
    {"id": "helsinki-ai",       "name": "Universidad de Helsinki · Elements of AI", "url": "https://www.elementsofai.com"},
    {"id": "helsinki-fso",      "name": "Universidad de Helsinki · Full Stack Open", "url": "https://fullstackopen.com/en/"},
    {"id": "freecodecamp",      "name": "freeCodeCamp · Certificaciones", "url": "https://www.freecodecamp.org/learn"},
    {"id": "skillshop",         "name": "Google · Skillshop", "url": "https://skillshop.withgoogle.com"},
    {"id": "coursera-gcyber",   "name": "Coursera · Google Cybersecurity Certificate", "url": "https://www.coursera.org/google-certificates/cybersecurity-certificate"},
]


# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------
def hoy() -> str:
    return dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")


def ahora_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def html_a_texto(raw: str) -> str:
    """HTML -> texto plano (sin scripts/estilos, entidades decodificadas)."""
    txt = re.sub(r"(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>", " ", raw)
    txt = re.sub(r"(?is)<!--.*?-->", " ", txt)
    txt = re.sub(r"(?s)<[^>]+>", " ", txt)
    txt = html_mod.unescape(txt)
    txt = txt.replace("\xa0", " ")
    return re.sub(r"\s+", " ", txt).strip()


def normalizar(texto: str) -> str:
    """Firma estable de un texto: minúsculas y solo alfanuméricos."""
    return re.sub(r"[^a-z0-9]+", "", texto.lower())


def texto_de_pagina(raw: str) -> str:
    return re.sub(r"\s+", " ", raw).strip()


def extraer_fechas(texto: str) -> list[str]:
    out = []
    for rx in DATE_RES:
        out.extend(m.group(0) for m in rx.finditer(texto))
    return out[:6]


def extraer_senales(texto: str) -> list[dict]:
    """Señales = oraciones que contienen una palabra clave de oferta.

    Usar oraciones (y no ventanas de N caracteres) hace el diff estable:
    una oración nueva del site se detecta como nueva, y una ya vista no
    cambia de forma solo porque el proveedor movió el texto.
    """
    hallazgos, vistos = [], set()
    for oracion in re.split(r"(?<=[.!?])\s+", texto):
        oracion = oracion.strip()[:SNIPPET_MAX]
        if len(normalizar(oracion)) < 25 or not STRONG_RE.search(oracion):
            continue
        sig = normalizar(oracion)[:SIG_LEN]
        if sig in vistos:
            continue
        vistos.add(sig)
        hallazgos.append({"frag": oracion, "sig": sig})
    return hallazgos


def parecido(sig1: str, sig2: str, umbral: float = 0.9) -> bool:
    if sig1 in sig2 or sig2 in sig1:
        return True
    return difflib.SequenceMatcher(None, sig1, sig2).ratio() >= umbral


def agrupar(hallazgos: list[dict], umbral: float = 0.9) -> list[dict]:
    """Colapsa ventanas solapadas de la misma frase: conserva la más larga."""
    out: list[dict] = []
    for h in hallazgos:
        for i, k in enumerate(out):
            if parecido(h["sig"], k["sig"], umbral):
                if len(h["frag"]) > len(k["frag"]):
                    out[i] = h
                break
        else:
            out.append(h)
    return out


def id_item(src: str, sig: str) -> str:
    return hashlib.sha1((src + "|" + sig).encode()).hexdigest()[:10]


# ---------------------------------------------------------------------------
# Estado y novedades (lectura/escritura)
# ---------------------------------------------------------------------------
def estado_vacio() -> dict:
    return {"version": 1, "last_run": "", "sources": {}}


def cargar_estado(path: str) -> dict:
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return estado_vacio()


def guardar_estado(path: str, estado: dict, dry: bool) -> None:
    if dry:
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(estado, f, ensure_ascii=False, indent=1, sort_keys=True)
        f.write("\n")


def _parse_objeto_js(texto: str, marcador: str) -> dict | None:
    """Extrae el objeto JSON que sigue a `marcador` en un archivo .js con comentarios."""
    inicio = texto.find(marcador)
    if inicio == -1:
        return None
    inicio = texto.find("{", inicio)
    if inicio == -1:
        return None
    depth, in_str, esc, fin = 0, False, False, None
    for i in range(inicio, len(texto)):
        ch = texto[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                fin = i + 1
                break
    if fin is None:
        return None
    try:
        return json.loads(texto[inicio:fin])
    except ValueError:
        return None


def cargar_novedades(path: str) -> dict:
    try:
        with open(path, encoding="utf-8") as f:
            data = _parse_objeto_js(f.read(), "__CERTF_NOVEDADES__")
        if data and isinstance(data.get("items"), list):
            data.setdefault("checked", "")
            return data
    except OSError:
        pass
    return {"checked": "", "items": []}


def guardar_novedades(path: str, data: dict, dry: bool) -> None:
    if dry:
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(
            "/* Certf — ARCHIVO GENERADO por tools/crawler.py (no editar a mano).\n"
            "   La app lo lee para la pestaña Novedades y el sello de última revisión. */\n"
            "window.__CERTF_NOVEDADES__ = "
        )
        json.dump(data, f, ensure_ascii=False, indent=1, sort_keys=True)
        f.write(";\n")


# ---------------------------------------------------------------------------
# Descarga
# ---------------------------------------------------------------------------
def descargar(url: str, timeout: int = 25) -> tuple[int, str | None, str | None]:
    """Devuelve (status, contenido, error). status=0 si no hubo respuesta HTTP."""
    headers = {"User-Agent": UA, "Accept-Language": "en,es;q=0.8"}
    for intento in (1, 2):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                raw = r.read()
            charset = "utf-8"
            try:
                charset = r.headers.get_content_charset() or "utf-8"
            except Exception:
                pass
            return r.status, raw.decode(charset, errors="replace"), None
        except urllib.error.HTTPError as e:
            if e.code in (500, 502, 503, 504) and intento == 1:
                time.sleep(2)
                continue
            return e.code, None, f"HTTP {e.code}" + (" (bloqueo anti-bot)" if e.code in (403, 429) else "")
        except Exception as e:  # URLError, timeout, SSL…
            if intento == 1:
                time.sleep(2)
                continue
            return 0, None, type(e).__name__
    return 0, None, "desconocido"


# ---------------------------------------------------------------------------
# Rastreo
# ---------------------------------------------------------------------------
def procesar_fuente(src: dict, contenido: str | None, error: str | None,
                    status: int, estado_src: dict, items_existentes: list[dict],
                    baseline: bool) -> tuple[dict, list[dict], list[str]]:
    """Actualiza el estado de una fuente y devuelve (estado, novedades_nuevas, avisos)."""
    hoy_s = hoy()
    avisos: list[str] = []
    if error:
        # Sin respuesta: conservamos hash/señales previas para no falsar el diff.
        # (Una fuente que nunca respondió no dispara revisión: probable
        #  bloqueo anti-bot permanente, no una novedad.)
        estado_src.setdefault("url", src["url"])
        estado_src["last_check"] = ahora_iso()
        estado_src["last_status"] = status
        estado_src["last_error"] = error
        avisos.append(f"error de acceso ({error})")
        return estado_src, [], avisos

    texto = html_a_texto(contenido or "") if "<" in (contenido or "") else texto_de_pagina(contenido or "")
    nuevo_hash = hashlib.sha256(texto.encode()).hexdigest()
    nuevo_hash_corto = nuevo_hash[:12]
    senales = extraer_senales(texto)

    prev_hash = estado_src.get("hash")
    prev_sigs = estado_src.get("snippets", {})
    cambio_hash = prev_hash is not None and prev_hash != nuevo_hash
    baseline = baseline or prev_hash is None

    nuevos = []
    if not baseline:
        # 1) colapsa oraciones casi repetidas; 2) descarta lo ya memorizado
        #    o casi igual a algo conocido (0.85 = misma frase, 0.8 = mismo anuncio)
        for s in agrupar(senales):
            if s["sig"] in prev_sigs:
                continue
            if any(parecido(s["sig"], k, 0.85) for k in prev_sigs):
                continue
            if any(parecido(s["sig"], normalizar(v.get("name", "") + " " + v.get("text", ""))[:SIG_LEN], 0.8) for v in items_existentes):
                continue
            nuevos.append(s)
    else:
        # Línea base: memoriza señales y publica hasta 2 fuertes para arrancar.
        publicadas_base = 0
        for s in agrupar(senales):
            if publicadas_base < 2 and not any(parecido(s["sig"], normalizar(v.get("name", "") + " " + v.get("text", ""))[:SIG_LEN], 0.8) for v in items_existentes):
                nuevos.append(s)
                publicadas_base += 1
        avisos.append(f"línea base creada ({len(senales)} señales memorizadas)")

    tope = MAX_NUEVOS_POR_FUENTE
    items = []
    for s in nuevos[:tope]:
        items.append({
            "id": id_item(src["id"], s["sig"]),
            "src": src["id"],
            "name": src["name"],
            "url": src["url"],
            "text": s["frag"],
            "found": hoy_s,
            "kind": "oferta",
            "review": False,
            "sig": s["sig"],
        })

    # La página cambió pero no se extrajo ninguna señal nueva -> revisión humana.
    if cambio_hash and not nuevos and not baseline:
        sig_cambio = "cambio-" + nuevo_hash_corto
        if not any(v.get("src") == src["id"] and v.get("kind") == "cambio" for v in items_existentes):
            items.append({
                "id": id_item(src["id"], sig_cambio),
                "src": src["id"],
                "name": src["name"],
                "url": src["url"],
                "text": "La página cambió, pero no se detectó una oferta nueva legible. Revisa el enlace.",
                "found": hoy_s,
                "kind": "cambio",
                "review": True,
                "sig": sig_cambio,
            })
            avisos.append("cambió sin señales claras -> requiere revisión")

    # Memorizar señales nuevas para no repetirlas mañana.
    for s in senales:
        prev_sigs.setdefault(s["sig"], {"t": s["frag"][:260], "first": hoy_s})
    for it in items:
        prev_sigs.setdefault(it["sig"], {"t": it["text"][:260], "first": hoy_s})

    estado_src.update({
        "hash": nuevo_hash,
        "last_check": ahora_iso(),
        "last_status": status,
        "last_error": None,
        "snippets": prev_sigs,
    })
    return estado_src, items, avisos


def recortar(items: list[dict]) -> list[dict]:
    limite = (dt.date.today() - dt.timedelta(days=PRUNE_DAYS)).isoformat()
    vivos = [v for v in items if v.get("found", "") >= limite]
    vivos.sort(key=lambda v: (v.get("found", ""), v.get("id", "")), reverse=True)
    return vivos[:MAX_ITEMS]


def generar_informe(resumen: list[dict], novedades_total: int, revisar: list[str], ruta: str | None, dry: bool) -> str:
    lin = []
    lin.append(f"# Informe del rastreador Certf — {ahora_iso()}\n")
    ok = sum(1 for r in resumen if r["status"] == "ok")
    err = sum(1 for r in resumen if r["status"] == "error")
    lin.append(f"Fuentes OK: {ok}/{len(resumen)} · errores: {err} · novedades publicadas hasta ahora: {novedades_total}\n")
    lin.append("| Fuente | Resultado | Detalle |")
    lin.append("|---|---|---|")
    for r in resumen:
        detalle = "; ".join(r["avisos"]) if r["avisos"] else (f"{r['snippets']} señales vigilarlas" if r["snippets"] else "sin señales nuevas")
        lin.append(f"| {r['name']} | {r['status']} | {detalle} |")
    if revisar:
        lin.append("\n## ⚠ requiere revisión (cambios sin señales claras)\n")
        for url in revisar:
            lin.append(f"- [ ] Revisar {url}")
        lin.append("\nSi confirmas una oferta nueva, añádela a `web/data.js` y corre `python3 tools/build_data.py`.")
    texto = "\n".join(lin) + "\n"
    if ruta and not dry:
        os.makedirs(os.path.dirname(ruta) or ".", exist_ok=True)
        with open(ruta, "w", encoding="utf-8") as f:
            f.write(texto)
    return texto


# ---------------------------------------------------------------------------
# Modo selftest (sin red, determinista)
# ---------------------------------------------------------------------------
def selftest() -> int:
    import tempfile
    fallos = 0

    def check(nombre, cond, extra=""):
        nonlocal fallos
        print(("  ✅ " if cond else "  ❌ ") + nombre + (f" → {extra}" if extra and not cond else ""))
        if not cond:
            fallos += 1

    print("\nCertf crawler · selftest")
    print("────────────────────────────────────────")
    with tempfile.TemporaryDirectory() as tmp:
        def fixture(nombre):
            with open(os.path.join(FIXTURES_DIR, nombre), encoding="utf-8") as f:
                return f.read()

        def fuente_base():
            return dict(SOURCES[0])  # aws-aif2cloud

        # 1) Línea base: memoriza señales y publica ofertas fuertes
        st = estado_vacio()
        prev_nov = {"checked": "", "items": []}
        es, items, avis = procesar_fuente(fuente_base(), fixture("aws-aif2cloud.html"), None, 200,
                                          {}, prev_nov["items"], baseline=False)
        check("Baseline publica ofertas fuertes", len(items) >= 1 and all(i["kind"] == "oferta" for i in items), str(len(items)))
        check("Baseline guarda hash y señales", bool(es.get("hash")) and len(es["snippets"]) >= 2)

        # 2) Segunda pasada igual: sin cambios -> cero novedades
        es2, items2, _ = procesar_fuente(fuente_base(), fixture("aws-aif2cloud.html"), None, 200, json.loads(json.dumps(es)), [], False)
        check("Sin cambios -> sin novedades", len(items2) == 0, str(len(items2)))

        # 3) Cambio con voucher nuevo -> nueva oferta, sin repetir la vieja
        es3, items3, _ = procesar_fuente(fuente_base(), fixture("aws-aif2cloud-changed.html"), None, 200, json.loads(json.dumps(es)), [], False)
        check("Cambio con señal nueva -> 1 novedad", len(items3) == 1 and items3[0]["kind"] == "oferta", str(len(items3)))
        check("Novedad nueva menciona el voucher", "CLF2FREE" in items3[0]["text"], items3[0]["text"][:60])

        # 4) Cambio sin señales -> novedad de revisión
        src_sin = {"id": "x-sin", "name": "Fuente sin señales", "url": "https://example.org/x"}
        es_prev = {"hash": "0" * 64, "snippets": {}, "last_check": "", "last_status": 200, "last_error": None}
        es4, items4, avis4 = procesar_fuente(src_sin, fixture("no-keywords.html"), None, 200, json.loads(json.dumps(es_prev)), [], False)
        check("Cambio sin señales -> review=true", len(items4) == 1 and items4[0]["review"] is True, str(items4))
        check("Aviso de revisión emitido", any("revisión" in a for a in avis4), str(avis4))

        # 5) Error de red: no rompe ni borra el estado
        es5, items5, avis5 = procesar_fuente(fuente_base(), None, "HTTP 403 (bloqueo anti-bot)", 403, json.loads(json.dumps(es3)), [], False)
        check("Error 403 -> sin novedades y sin crash", items5 == [] and es5["last_error"] is not None and es5.get("hash"))
        check("Error reportado en avisos", any("403" in a for a in avis5))

        # 6) Detección de fechas
        fechas = extraer_fechas(html_a_texto(fixture("aws-aif2cloud.html")))
        check("Extrae fechas del texto", any("2026" in f for f in fechas), str(fechas))

        # 7) Recortado: descarta viejas y respeta tope
        viejas = [{"id": "x", "found": "2020-01-01"}, {"id": "y", "found": hoy()}] * 30
        rec = recortar(viejas)
        check("Prune descarta antiguas y limita tope", len(rec) <= MAX_ITEMS and all(v["id"] != "x" for v in rec), str(len(rec)))

        # 8) novedades.js generado es parseable de vuelta
        path_nov = os.path.join(tmp, "novedades.js")
        data = {"checked": ahora_iso(), "items": items3 + items4}
        guardar_novedades(path_nov, data, dry=False)
        de_vuelta = cargar_novedades(path_nov)
        check("novedades.js se re-lee igual", de_vuelta == data, json.dumps(de_vuelta)[:120])

        # 9) Estado corrupto -> arranca limpio
        path_st = os.path.join(tmp, "state.json")
        with open(path_st, "w", encoding="utf-8") as f:
            f.write("{ roto")
        check("Estado corrupto -> estado vacío", cargar_estado(path_st)["version"] == 1)

        # 10) Offline end-to-end: corre con fixtures y produce archivos válidos
        st_path = os.path.join(tmp, "state.json")
        nov_path = os.path.join(tmp, "novedades.js")
        rc = main(["--offline", FIXTURES_DIR, "--state", st_path, "--novedades", nov_path, "--quiet"])
        nov = cargar_novedades(nov_path)
        st_off = cargar_estado(st_path)
        check("Offline end-to-end exitoso", rc == 0)
        check("Offline genera novedades válidas", isinstance(nov["items"], list) and len(nov["items"]) >= 1, str(len(nov.get("items", []))))
        check("Offline memoriza estado de fuentes", len(st_off.get("sources", {})) >= 1)

    print("────────────────────────────────────────")
    if fallos:
        print(f"❌ {fallos} verificación(es) fallida(s)\n")
        return 1
    print("✅ Todo OK\n")
    return 0


# ---------------------------------------------------------------------------
# Programa principal
# ---------------------------------------------------------------------------
def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Rastreador diario de certificaciones de Certf")
    p.add_argument("--state", default=STATE_PATH)
    p.add_argument("--novedades", default=NOVEDADES_PATH)
    p.add_argument("--report", default=None, help="escribe un informe markdown en esta ruta")
    p.add_argument("--offline", metavar="DIR", help="lee fixtures HTML locales (DIR/<id>.html) en vez de la red")
    p.add_argument("--only", metavar="ID1,ID2", help="rastrea solo estas fuentes")
    p.add_argument("--dry-run", action="store_true", help="no escribe archivos")
    p.add_argument("--quiet", action="store_true", help="menos salida (usado por el selftest)")
    p.add_argument("--selftest", action="store_true", help="ejecuta las pruebas sin red")
    args = p.parse_args(argv)

    if args.selftest:
        return selftest()

    fuentes = SOURCES
    if args.only:
        ids = {x.strip() for x in args.only.split(",")}
        fuentes = [s for s in SOURCES if s["id"] in ids]

    estado = cargar_estado(args.state)
    nov = cargar_novedades(args.novedades)
    items_existentes = list(nov.get("items", []))
    nuevos_total = 0
    resumen = []
    a_revisar = []

    for i, src in enumerate(fuentes):
        if not args.quiet and not args.offline:
            if i:
                time.sleep(1.2)  # etiqueta: no saturar a los servidores de origen

        contenido, error, status = None, None, 0
        if args.offline:
            path = os.path.join(args.offline, src["id"] + ".html")
            if os.path.exists(path):
                with open(path, encoding="utf-8") as f:
                    contenido = f.read()
                status = 200
            else:
                error, status = "fixture ausente (simula error de red)", 0
        else:
            status, contenido, error = descargar(src["url"])

        es_prev = estado["sources"].get(src["id"], {})
        try:
            es, items, avisos = procesar_fuente(src, contenido, error, status, dict(es_prev), items_existentes, baseline=False)
        except Exception as e:  # nunca dejar tirado el rastreo completo
            resumen.append({"id": src["id"], "name": src["name"], "status": "error",
                            "avisos": [f"excepción: {type(e).__name__}"], "snippets": 0})
            continue

        estado["sources"][src["id"]] = es
        if items:
            items_existentes.extend(items)
            nuevos_total += len(items)
            if any(v.get("review") for v in items):
                a_revisar.append(src["url"])
        # Una fuente que sí funcionó antes y ahora falla sí amerita revisión.
        if error and es_prev.get("hash"):
            a_revisar.append(src["url"])
        resumen.append({
            "id": src["id"], "name": src["name"],
            "status": "error" if error else "ok",
            "avisos": avisos,
            "snippets": len(es.get("snippets", {})),
        })
        if not args.quiet:
            estado_txt = "⚠ " + (error or "") if error else ("· " + "; ".join(avisos) if avisos else "sin cambios")
            print(f"  [{resumen[-1]['status']:^5}] {src['name']:<48} {estado_txt}")

    items_finales = recortar(items_existentes)
    nov_final = {"checked": ahora_iso(), "items": items_finales}

    estado["last_run"] = ahora_iso()
    guardar_estado(args.state, estado, args.dry_run)
    guardar_novedades(args.novedades, nov_final, args.dry_run)

    informe = generar_informe(resumen, len(items_finales), a_revisar, args.report, args.dry_run)
    if not args.quiet:
        print("\n" + informe)
        print(f"Novedades totales en la app: {len(items_finales)} (nuevas hoy: {nuevos_total})")
        if args.dry_run:
            print("(dry-run: no se escribió ningún archivo)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
