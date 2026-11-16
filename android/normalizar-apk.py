# normalizar-apk.py
# Reescribe un APK sustituyendo '\' por '/' en los nombres de entrada.
# aapt2 en Windows genera rutas de assets con barras invertidas dentro del
# ZIP y Android no las encuentra (getAssets().open() fallaria).
# Uso: python normalizar-apk.py ruta\del.apk

import os
import sys
import zipfile


def normalizar(ruta):
    tmp = ruta + ".tmp"
    with zipfile.ZipFile(ruta, "r") as zin, zipfile.ZipFile(tmp, "w") as zout:
        for info in zin.infolist():
            datos = zin.read(info.filename)
            nuevo = zipfile.ZipInfo(
                filename=info.filename.replace("\\", "/"),
                date_time=info.date_time,
            )
            nuevo.compress_type = info.compress_type
            nuevo.external_attr = info.external_attr
            nuevo.create_system = info.create_system
            zout.writestr(nuevo, datos)
    os.replace(tmp, ruta)
    print("Rutas normalizadas -> " + ruta)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python normalizar-apk.py archivo.apk")
        sys.exit(1)
    normalizar(sys.argv[1])
