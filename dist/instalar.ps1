# instalar.ps1 — Instala Partituras de violin en Windows
# Copia el .exe a Programas y crea accesos directos en Escritorio y Menú Inicio.

$destinoDir = Join-Path $env:LOCALAPPDATA "Programs\Partituras de violin"

# Buscar el .exe junto al script (acepta cualquier nombre: GitHub puede
# reemplazar los espacios por puntos al subirlo a Releases)
$ejecutable = Get-ChildItem -Path $PSScriptRoot -Filter "*.exe" -File -ErrorAction SilentlyContinue |
    Select-Object -First 1
if (-not $ejecutable) {
    Write-Host "ERROR: no se encontro ningun .exe junto a este script."
    Write-Host "Descarga 'Partituras de violin.exe' desde Releases y colocalo junto a Instalar.bat."
    exit 1
}
$origen = $ejecutable.FullName
$destino = Join-Path $destinoDir "Partituras de violin.exe"

Write-Host ("Instalando: " + $ejecutable.Name)

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
