# preparar-webview2.ps1
# Copia una version ligera del runtime WebView2 a windows\WebView2Runtime
# para incluirla dentro del instalador (todas las dependencias incluidas).
# Se omiten: ResiliencyLinks (187 MB), WidevineCdm (22 MB, DRM),
# Installer (6 MB, actualizador) y PdfPreview. De Locales solo quedan
# en-US y es-ES (ahorra ~130 MB).

$ErrorActionPreference = "Stop"
$raiz = Split-Path -Parent $PSScriptRoot
$destino = Join-Path $raiz "windows\WebView2Runtime"

# --- localizar el runtime instalado ---
$fuentes = @()
$pf86 = ${env:ProgramFiles(x86)}
if ($pf86) { $fuentes += (Join-Path $pf86 "Microsoft\EdgeWebView\Application") }
if ($env:ProgramFiles) { $fuentes += (Join-Path $env:ProgramFiles "Microsoft\EdgeWebView\Application") }
$fuentes = @($fuentes | Where-Object { $_ -and (Test-Path $_) })

$origen = $null
foreach ($f in $fuentes) {
    # Solo carpetas con formato de version (p. ej. 157.0.4341.46), no "SetupMetrics".
    $c = Get-ChildItem $f -Directory -ErrorAction SilentlyContinue |
         Where-Object { $_.Name -match '^\d+\.\d+\.\d+\.\d+$' } |
         Sort-Object { [version]$_.Name } -Descending | Select-Object -First 1
    if ($c) { $origen = $c.FullName; break }
}
if (-not $origen) { throw "No se encontro el runtime WebView2 instalado." }
$version = Split-Path $origen -Leaf
Write-Output ("Runtime origen: " + $origen)

# --- ya preparado? ---
$marca = Join-Path $destino "version.txt"
if ((Test-Path (Join-Path $destino "msedgewebview2.exe")) -and (Test-Path $marca) -and
    ((Get-Content $marca -Raw).Trim() -eq $version)) {
    Write-Output ("WebView2Runtime ya preparado (" + $version + ")")
    exit 0
}

if (Test-Path $destino) { Remove-Item $destino -Recurse -Force }
New-Item -ItemType Directory -Path $destino | Out-Null

# --- copiar todo excepto las carpetas grandes que no hacen falta ---
$excluir = @("ResiliencyLinks", "WidevineCdm", "Installer", "PdfPreview", "Locales")
$rc = robocopy $origen $destino /E /XD $excluir /NFL /NDL /NJH /NJS /R:1 /W:1
if ($LASTEXITCODE -ge 8) { throw ("robocopy fallo con codigo " + $LASTEXITCODE) }

# --- Locales: solo ingles y espanol ---
New-Item -ItemType Directory -Path (Join-Path $destino "Locales") | Out-Null
foreach ($loc in @("en-US.pak", "es-ES.pak")) {
    $p = Join-Path $origen ("Locales\" + $loc)
    if (Test-Path $p) { Copy-Item $p (Join-Path $destino ("Locales\" + $loc)) }
}

Set-Content $marca $version
$tam = (Get-ChildItem $destino -Recurse -File | Measure-Object Length -Sum).Sum
Write-Output ("WebView2Runtime OK: " + [math]::Round($tam / 1MB, 0) + " MB -> " + $destino)
