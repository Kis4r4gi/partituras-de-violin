# compilar-instalador.ps1 — Construye el instalador autocontenido de Windows.
# Salida: dist\Partituras-de-violin-Instalar.exe (lleva dentro el .exe de la
# aplicacion, el runtime WebView2 y el desinstalar; no requiere nada mas).
#
# Pasos:
#   [1/4] Compila Instalador.cs con el csc de .NET Framework (sin dependencias)
#   [2/4] Junta el payload: .exe publicado + WebView2 + Desinstalar.exe
#   [3/4] Comprime el payload a ZIP
#   [4/4] Anade el ZIP al final del instalador
#
# Requisitos previos:
#   - dotnet publish del proyecto windows\PartiturasViolin
#   - windows\WebView2Runtime (scripts\preparar-webview2.ps1)

$ErrorActionPreference = "Stop"

$raiz = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$build = Join-Path $raiz "windows\Instalador\build"
$payload = Join-Path $build "payload"
$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$ico = Join-Path $raiz "assets\icon.ico"

if (-not (Test-Path $csc)) { throw "No se encontro csc.exe de .NET Framework." }

if (Test-Path $build) { Remove-Item $build -Recurse -Force }
New-Item -ItemType Directory -Force -Path $payload | Out-Null

# ---------------------------------------------------------- [1/4] stub
Write-Output "[1/4] Compilando el instalador (csc de .NET Framework)..."
$stub = Join-Path $build "InstaladorStub.exe"
& $csc /nologo /target:winexe /optimize+ /codepage:65001 `
    /win32icon:$ico `
    /r:System.dll `
    /r:System.Core.dll `
    /r:System.Drawing.dll `
    /r:System.Windows.Forms.dll `
    /r:System.IO.Compression.dll `
    /r:Microsoft.CSharp.dll `
    /out:$stub `
    (Join-Path $raiz "windows\Instalador\Instalador.cs")
if ($LASTEXITCODE -ne 0) { throw "La compilacion del instalador fallo." }
Copy-Item $stub (Join-Path $payload "Desinstalar.exe") -Force

# ---------------------------------------------------------- [2/4] payload
Write-Output "[2/4] Preparando el payload..."
$exePublicado = Join-Path $raiz "windows\PartiturasViolin\bin\Release\net8.0-windows\win-x64\publish\Partituras de violin.exe"
if (-not (Test-Path $exePublicado)) {
    throw "Falta el .exe publicado. Ejecuta antes: dotnet publish -c Release -r win-x64 --self-contained true"
}
Copy-Item $exePublicado (Join-Path $payload "Partituras de violin.exe") -Force

$wv = Join-Path $raiz "windows\WebView2Runtime"
if (-not (Test-Path (Join-Path $wv "msedgewebview2.exe"))) {
    throw "Falta windows\WebView2Runtime. Ejecuta antes: scripts\preparar-webview2.ps1"
}
Copy-Item $wv (Join-Path $payload "WebView2") -Recurse -Force

# ---------------------------------------------------------- [3/4] ZIP
Write-Output "[3/4] Comprimiendo el payload (puede tardar un poco)..."
$zip = Join-Path $build "payload.zip"
if (Get-Command tar -ErrorAction SilentlyContinue) {
    tar -a -c -f $zip -C $payload "Partituras de violin.exe" WebView2 Desinstalar.exe
    if ($LASTEXITCODE -ne 0) { throw "tar fallo." }
} else {
    Compress-Archive -Path (Join-Path $payload "*") -DestinationPath $zip -Force
}
$zipLen = (Get-Item $zip).Length
Write-Output ("      ZIP: " + [math]::Round($zipLen / 1MB, 1) + " MB")

# ---------------------------------------------------------- [4/4] ensamblar
Write-Output "[4/4] Ensamblando el instalador autocontenido..."
$salida = Join-Path $raiz "dist\Partituras-de-violin-Instalar.exe"
if (Test-Path $salida) { Remove-Item $salida -Force }

$fs = [System.IO.File]::Create($salida)
try {
    $in = [System.IO.File]::OpenRead($stub)
    try { $in.CopyTo($fs) } finally { $in.Close() }
    $in = [System.IO.File]::OpenRead($zip)
    try { $in.CopyTo($fs) } finally { $in.Close() }
    $bytesLen = [BitConverter]::GetBytes([int64]$zipLen)
    $fs.Write($bytesLen, 0, 8)
} finally {
    $fs.Close()
}

$final = Get-Item $salida
Write-Output ""
Write-Output ("Listo: " + $final.FullName)
Write-Output ("Tamano: " + [math]::Round($final.Length / 1MB, 1) + " MB")
Write-Output ""
Write-Output "Prueba rapida:"
Write-Output ("  Instalar sin interfaz:  " + $final.FullName + " /S")
Write-Output "  Desinstalar:             Desinstalar.exe /uninstall /quiet  (en la carpeta instalada)"
