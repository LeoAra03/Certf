# -*- coding: utf-8 -*-
"""Arma docs/1000-mejoras-certf.md y docs/1000-mejoras.json desde hand_*.py + gen_*.py."""

import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from base import SECCIONES, SECCION_NOMBRE, TEST_TYPES, parse  # noqa: E402
from hand_a import HAND as HA  # noqa: E402
from hand_b import HAND as HB  # noqa: E402
from hand_c import HAND as HC  # noqa: E402
from gen_a import GEN as GA  # noqa: E402
from gen_b import GEN as GB  # noqa: E402

FECHA = "2026-09-12"
TOTAL = 1000

HAND = {}
HAND.update(HA)
HAND.update(HB)
HAND.update(HC)

GEN = {}
for k, v in GA.items():
    if v is not None:
        GEN[k] = v
GEN.update(GB)


def recolectar():
    items = []
    vistos = set()
    for sec, name in SECCIONES:
        hand = HAND.get(sec, [])
        gen = GEN[sec]() if sec in GEN else []
        for raw, src in [(r, "hand") for r in hand] + [(r, "gen") for r in gen]:
            texto, prio = parse(raw)
            clave = re.sub(r"\s+", " ", texto.strip().lower())
            if clave in vistos:
                continue
            vistos.add(clave)
            items.append({"sec": sec, "seccion": name, "texto": texto, "prio": prio, "src": src})
    return items


def prioridades(items):
    for it in items:
        it["esfuerzo"] = "M"
        if it["sec"] == "S01":
            it["prio"] = "P0"
            it["impacto"] = 5
        elif it["prio"] is None:
            # Hecho a mano (sin prefijo) = P1; generado = P2.
            it["prio"] = "P1" if it["src"] == "hand" else "P2"
            it["impacto"] = 4 if it["prio"] == "P1" else 3
        else:
            it["impacto"] = 5 if it["prio"] == "P0" else 4
    return items


def md(items):
    lineas = []
    lineas.append("# 1000 mejoras para Certf")
    lineas.append("")
    lineas.append("Fecha: %s. Estado: backlog maestro (roadmap de la app)." % FECHA)
    lineas.append("")
    lineas.append("## Objetivo que se quiere superar")
    lineas.append("")
    lineas.append("El objetivo principal de Certf es llevar a una persona con 0 experiencia a ser profesional, "
                  "usando solo cursos y certificaciones gratis o verificadamente con descuento, con enlaces "
                  "directos de postulación y cero descuentos fantasmas. Este documento lista 1000 mejoras para "
                  "que la app no solo encuentre ofertas, sino que garantice el resultado final: estudiar, rendir, "
                  "certificar y conseguir el empleo.")
    lineas.append("")
    lineas.append("## Como leer")
    lineas.append("")
    lineas.append("- Prioridad: P0 mueve el resultado (hacer primero), P1 corto plazo, P2 backlog.")
    lineas.append("- Esfuerzo: S (dias), M (semanas), L (meses). Impacto: 1 a 5.")
    lineas.append("- Uso personal: todo es local-first, privado y sin costo; nada aqui obliga a gastar.")
    lineas.append("- Este archivo alimenta el motor de auto-mejora (seccion 21): su version maquina es docs/1000-mejoras.json.")
    lineas.append("")
    lineas.append("## Tipos de test considerados (gobiernan la preparacion)")
    lineas.append("")
    for i, t in enumerate(TEST_TYPES, 1):
        lineas.append("%d. %s." % (i, t))
    lineas.append("")
    n = 0
    for si, (sec, name) in enumerate(SECCIONES, 1):
        grupo = [it for it in items if it["sec"] == sec]
        if not grupo:
            continue
        lineas.append("## %02d. %s" % (si, name))
        lineas.append("")
        for it in grupo:
            n += 1
            lineas.append("%d. [%s] %s" % (n, it["prio"], it["texto"]))
        lineas.append("")
    return "\n".join(lineas) + "\n"


def main():
    items = recolectar()
    if len(items) > TOTAL:
        items = items[:TOTAL]
    if len(items) < TOTAL:
        print("FALTA: solo hay %d mejoras (se esperan %d)." % (len(items), TOTAL))
        sys.exit(1)
    items = prioridades(items)
    for i, it in enumerate(items, 1):
        it["id"] = i

    raiz = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
    docs = os.path.join(raiz, "docs")
    os.makedirs(docs, exist_ok=True)

    with open(os.path.join(docs, "1000-mejoras-certf.md"), "w", encoding="utf-8") as f:
        f.write(md(items))

    doc = {
        "meta": {
            "fecha": FECHA,
            "total": len(items),
            "objetivo": "Llevar de 0 experiencia a profesional con cursos y certs gratis o verificadamente con descuento, y conseguir el empleo.",
            "tipos_de_test": TEST_TYPES,
            "prioridades": {"P0": "mueve el resultado (hacer primero)", "P1": "corto plazo", "P2": "backlog"},
            "esfuerzos": {"S": "dias", "M": "semanas", "L": "meses"},
            "uso": "personal, local-first, sin costo",
        },
        "mejoras": [
            {"id": it["id"], "sec": it["sec"], "seccion": it["seccion"], "prioridad": it["prio"],
             "esfuerzo": it["esfuerzo"], "impacto": it["impacto"], "texto": it["texto"]}
            for it in items
        ],
    }
    with open(os.path.join(docs, "1000-mejoras.json"), "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
        f.write("\n")

    cont = {}
    for it in items:
        cont[it["sec"]] = cont.get(it["sec"], 0) + 1
    print("Total: %d" % len(items))
    for sec, name in SECCIONES:
        print("  %s (%s): %d" % (sec, name, cont.get(sec, 0)))
    p = {}
    for it in items:
        p[it["prio"]] = p.get(it["prio"], 0) + 1
    print("Prioridades:", p)
    print("OK  docs/1000-mejoras-certf.md")
    print("OK  docs/1000-mejoras.json")


if __name__ == "__main__":
    main()
