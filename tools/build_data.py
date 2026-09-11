#!/usr/bin/env python3
"""Convierte web/data.js (fuente única) en web/data.json para el lado nativo Android.

Uso:  python3 tools/build_data.py
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "web", "data.js")
DST = os.path.join(ROOT, "web", "data.json")


def main():
    with open(SRC, encoding="utf-8") as f:
        raw = f.read()

    start = raw.find("window.__CERTF__")
    if start == -1:
        sys.exit("No se encontró window.__CERTF__ en data.js")
    start = raw.find("{", start)

    # Balance de llaves ignorando las que están dentro de strings
    depth = 0
    end = None
    in_str = False
    esc = False
    for idx in range(start, len(raw)):
        ch = raw[idx]
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
                end = idx + 1
                break
    if end is None:
        sys.exit("No se pudo delimitar el objeto JSON en data.js")

    payload = raw[start:end]

    # El archivo es JS (admite comentarios y trailing commas): los quitamos
    payload = re.sub(r"/\*.*?\*/", "", payload, flags=re.S)
    payload = re.sub(r"(?m)^\s*//.*$", "", payload)
    payload = re.sub(r",(\s*[}\]])", r"\1", payload)

    data = json.loads(payload)

    certs = data.get("certs", [])
    deadlines = data.get("deadlines", [])
    assert certs and deadlines, "data.js no trae certs/deadlines"

    with open(DST, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")

    print(f"OK  {DST}\n    {len(certs)} certificaciones · {len(deadlines)} fechas críticas")


if __name__ == "__main__":
    main()
