# desinstalar.ps1 — Desinstala Partituras de violin de Windows
# Quita el .exe y los accesos directos. Los datos (favoritos, progreso, notas)
# se conservan en la carpeta indicada al final.

$destinoDir = Join-Path $env:LOCALAPPDATA "Programs\Partituras de violin"

# Cerrar la aplicacion si esta abierta
Get-Process -Name "Partituras de violin" -ErrorAction SilentlyContinue | Stop-Process -Force

# Borrar accesos directos
$shell = New-Object -ComObject WScript.Shell
$directos = @(
    (Join-Path ([Environment]::GetFolderPath('Desktop')) "Partituras de violin.lnk"),
    (Join-Path ([Environment]::GetFolderPath('Programs')) "Partituras de violin.lnk")
)
foreach ($d in $directos) {
    if (Test-Path $d) { Remove-Item $d -Force }
}

# Borrar el programa
if (Test-Path $destinoDir) { Remove-Item $destinoDir -Recurse -Force }

Write-Host "Desinstalado."
Write-Host "Los datos (favoritos, progreso y notas) se conservan en:"
Write-Host "  $env:LOCALAPPDATA\Partituras de violin"
Write-Host "Para borrarlos tambien, elimina esa carpeta."
