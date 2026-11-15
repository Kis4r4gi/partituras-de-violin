@echo off
chcp 65001 >nul
title Partituras de violin - servidor local
cd /d "%~dp0.."

where python >nul 2>nul
if errorlevel 1 (
  echo.
  echo  No se encontro Python en este equipo.
  echo  Alternativa: haz doble clic en "index.html" para abrir la aplicacion
  echo  directamente en el navegador (sin servidor).
  echo.
  pause
  exit /b 1
)

echo  Abriendo la aplicacion en el navegador...
start "" "http://127.0.0.1:8077/"
python -m http.server 8077 --bind 127.0.0.1
pause
