# -*- coding: utf-8 -*-
"""indexar-offline.py — Indexa los archivos locales (partituras, libros, audio,
imágenes y notas) y escribe js/data/offline.js para que la aplicación los muestre.

Uso:
    python scripts\\indexar-offline.py

Carpetas escaneadas (relativas a la raíz de la aplicación):
    Partituras/  -> PDF, MusicXML, MXL, ABC, PNG, JPG
    Libros/      -> PDF, EPUB, TXT, MD
    Audio/       -> MP3, OGG, WAV, M4A, FLAC
    Imagenes/    -> PNG, JPG, WEBP, SVG
    Notas/       -> TXT, MD, PDF

Los archivos que empiecen con LEEME/README o con punto se ignoran.
Después de ejecutarlo, recargá la aplicación en la sección "Sin conexión".
"""

import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(SCRIPT_DIR)

CARPETAS = [
    ("Partituras", "partitura"),
    ("Libros", "libro"),
    ("Audio", "audio"),
    ("Imagenes", "imagen"),
    ("Notas", "nota"),
]

IGNORAR_PREFIJO = ("leeme", "readme", ".")


def indexar():
    entradas = []
    for carpeta, tipo in CARPETAS:
        raiz = os.path.join(BASE, carpeta)
        if not os.path.isdir(raiz):
            continue
        for dirpath, dirnames, filenames in os.walk(raiz):
            dirnames[:] = sorted(d for d in dirnames if not d.startswith("."))
            for nombre in sorted(filenames):
                bajo = nombre.lower()
                if bajo.startswith(IGNORAR_PREFIJO):
                    continue
                ext = os.path.splitext(nombre)[1].lower().lstrip(".")
                if not ext:
                    continue
                full = os.path.join(dirpath, nombre)
                rel = os.path.relpath(full, BASE).replace(os.sep, "/")
                entradas.append({
                    "nombre": os.path.splitext(nombre)[0],
                    "ruta": rel,
                    "carpeta": carpeta,
                    "tipo": tipo,
                    "ext": ext,
                    "tam": os.path.getsize(full),
                })
    entradas.sort(key=lambda e: (e["carpeta"], e["nombre"].lower()))
    return entradas


def main():
    entradas = indexar()
    salida = os.path.join(BASE, "js", "data", "offline.js")
    with open(salida, "w", encoding="utf-8") as f:
        f.write("/* Archivo generado por scripts/indexar-offline.py — no editar a mano. */\n")
        f.write("window.CVM = window.CVM || {};\n")
        f.write("window.CVM.offline = " + json.dumps(entradas, ensure_ascii=False, indent=2))
        f.write(";\n")
    print("Indexados %d archivos -> %s" % (len(entradas), salida))
    if not entradas:
        print("Consejo: guardá partituras (PDF) en 'Partituras' y libros en 'Libros' "
              "y volvé a ejecutar este script.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
