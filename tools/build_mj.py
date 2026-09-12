#!/usr/bin/env python3
"""Convierte docs/1000-mejoras.json (fuente única) en web/mejoras.js para la app.

La app trae el backlog completo para la pestaña 'Auto-mejora': progreso local,
siguientes sugerencias y generador de prompts para cualquier asistente IA.

Uso:  python3 tools/build_mj.py
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "docs", "1000-mejoras.json")
DST = os.path.join(ROOT, "web", "mejoras.js")


def main():
    with open(SRC, encoding="utf-8") as f:
        doc = json.load(f)

    mejoras = [
        {"id": m["id"], "sec": m["sec"], "seccion": m["seccion"], "p": m["prioridad"],
         "e": m["esfuerzo"], "i": m["impacto"], "t": m["texto"]}
        for m in doc["mejoras"]
    ]
    payload = {"total": doc["meta"]["total"], "fecha": doc["meta"]["fecha"], "mejoras": mejoras}
    js = "window.__CERTF_MEJORAS__ = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    with open(DST, "w", encoding="utf-8") as f:
        f.write(js)
    print(f"OK  {DST}\n    {len(mejoras)} mejoras (fuente: docs/1000-mejoras.json)")


if __name__ == "__main__":
    main()
