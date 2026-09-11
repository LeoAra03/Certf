#!/usr/bin/env python3
"""Genera los íconos PNG sin dependencias externas (lector/escritor PNG propio).

Salidas:
  web/icon-192.png, web/icon-512.png
  android/app/src/main/res/mipmap-*/ic_launcher.png

Uso: python3 tools/gen_icons.py
"""
import os
import struct
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BG = (11, 18, 32)
GRAD_A = (79, 140, 255)
GRAD_B = (138, 99, 255)
FG = (255, 255, 255)


def px(x, y, size):
    """Devuelve el color RGBA del píxel."""
    cx = cy = size / 2.0
    r = size * 0.28
    dx, dy = x + 0.5 - cx, y + 0.5 - cy
    dist = (dx * dx + dy * dy) ** 0.5

    # círculo con degradado (logo)
    if dist <= r:
        t = (x + y) / (2.0 * size)
        col = tuple(int(GRAD_A[i] + (GRAD_B[i] - GRAD_A[i]) * t) for i in range(3))
        # "C" blanca: arco abierto hacia la derecha
        rr = size * 0.155
        d2 = (dx * dx + dy * dy) ** 0.5
        if abs(d2 - rr) <= size * 0.035 and not (dx > rr * 0.35 and abs(dy) < rr * 0.55):
            return (255, 255, 255, 255)
        return (col[0], col[1], col[2], 255)
    return (BG[0], BG[1], BG[2], 255)


def write_png(path, size):
    raw = bytearray()
    for y in range(size):
        raw.append(0)  # filtro None
        for x in range(size):
            raw.extend(px(x, y, size))

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    png += chunk(b"IEND", b"")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(png)
    print("icono:", path, f"{size}x{size}")


def main():
    write_png(os.path.join(ROOT, "web", "icon-192.png"), 192)
    write_png(os.path.join(ROOT, "web", "icon-512.png"), 512)
    for folder, size in (("mipmap-mdpi", 48), ("mipmap-hdpi", 72),
                         ("mipmap-xhdpi", 96), ("mipmap-xxhdpi", 144),
                         ("mipmap-xxxhdpi", 192)):
        write_png(os.path.join(ROOT, "android", "app", "src", "main", "res", folder, "ic_launcher.png"), size)


if __name__ == "__main__":
    main()
