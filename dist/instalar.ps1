# instalar.ps1 — Instala Partituras de violin en Windows
# Copia el .exe a Programas y crea accesos directos en Escritorio y Menú Inicio.

$origen = Join-Path $PSScriptRoot "Partituras de violin.exe"
$destinoDir = Join-Path $env:LOCALAPPDATA "Programs\Partituras de violin"
$destino = Join-Path $destinoDir "Partituras de violin.exe"

if (-not (Test-Path $origen)) {
    Write-Host "ERROR: no se encontro 'Partituras de violin.exe' junto a este script."
    exit 1
}

New-Item -ItemType Directory -Force -Path $destinoDir | Out-Null
Copy-Item $origen $destino -Force

$shell = New-Object -ComObject WScript.Shell

$escritorio = Join-Path ([Environment]::GetFolderPath('Desktop')) "Partituras de violin.lnk"
$sc = $shell.CreateShortcut($escritorio)
$sc.TargetPath = $destino
$sc.WorkingDirectory = $destinoDir
$sc.Description = "Partituras de violin"
$sc.IconLocation = "$destino,0"
$sc.Save()

$inicio = Join-Path ([Environment]::GetFolderPath('Programs')) "Partituras de violin.lnk"
$si = $shell.CreateShortcut($inicio)
$si.TargetPath = $destino
$si.WorkingDirectory = $destinoDir
$si.Description = "Partituras de violin"
$si.IconLocation = "$destino,0"
$si.Save()

Write-Host "Instalado correctamente."
Write-Host "  Copia:  $destino"
Write-Host "  Accesos directos: Escritorio y Menu Inicio"
Write-Host ""
Write-Host "Abriendo la aplicacion..."
Start-Process $destino
