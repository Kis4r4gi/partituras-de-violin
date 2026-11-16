# compilar-apk.ps1
# Compila el APK de Android sin Gradle: aapt2 + javac + d8 + zipalign + apksigner.
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File android\compilar-apk.ps1
# Requiere: android\preparar-sdk.ps1 ejecutado (JDK 17 + SDK).

$ErrorActionPreference = "Stop"
$raiz = Split-Path -Parent $PSScriptRoot
$t = Join-Path $env:TEMP "apk-tools"
$sdk = Join-Path $t "android-sdk"
$bt = Join-Path $sdk "build-tools\34.0.0"
$androidJar = Join-Path $sdk "platforms\android-34\android.jar"

# --- JDK 17 ---
$jdk = Get-ChildItem $t -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "jdk-17*" } | Select-Object -First 1
if (-not $jdk) { throw "No se encontro el JDK 17. Ejecuta android\preparar-sdk.ps1." }
$env:JAVA_HOME = $jdk.FullName
$env:PATH = (Join-Path $jdk.FullName "bin") + ";" + $env:PATH

if (-not (Test-Path $androidJar)) { throw "Falta android.jar. Ejecuta android\preparar-sdk.ps1." }
$aapt2 = Join-Path $bt "aapt2.exe"
if (-not (Test-Path $aapt2)) { throw "Falta aapt2. Ejecuta android\preparar-sdk.ps1." }

$appDir = Join-Path $raiz "android\app"
$build = Join-Path $raiz "android\build"
if (Test-Path $build) { Remove-Item $build -Recurse -Force }
New-Item -ItemType Directory -Path $build | Out-Null

Write-Output "[1/7] Preparando assets de la aplicacion web..."
$assets = Join-Path $build "assets\web"
New-Item -ItemType Directory -Path $assets | Out-Null
foreach ($i in @("index.html", "manifest.json", "sw.js", "css", "js", "assets")) {
    $o = Join-Path $raiz $i
    if (Test-Path $o) { Copy-Item $o (Join-Path $assets $i) -Recurse -Force }
}
if (Test-Path (Join-Path $assets "assets\icon.html")) {
    Remove-Item (Join-Path $assets "assets\icon.html") -Force
}

Write-Output "[2/7] Compilando recursos (aapt2 compile)..."
$resZip = Join-Path $build "res.zip"
& $aapt2 compile --dir (Join-Path $appDir "res") -o $resZip
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile fallo" }

Write-Output "[3/7] Vinculando manifest + recursos + assets (aapt2 link)..."
$apk0 = Join-Path $build "app-sin-firmar.apk"
& $aapt2 link -o $apk0 -I $androidJar `
    --manifest (Join-Path $appDir "AndroidManifest.xml") `
    -R $resZip -A (Join-Path $build "assets") --auto-add-overlay
if ($LASTEXITCODE -ne 0) { throw "aapt2 link fallo" }

# aapt2 en Windows escribe las rutas de assets con '\' dentro del ZIP;
# Android solo busca con '/'. Se normalizan antes de seguir.
Write-Output "[3b/7] Normalizando rutas dentro del APK..."
& python (Join-Path $raiz "android\normalizar-apk.py") $apk0
if ($LASTEXITCODE -ne 0) { throw "normalizar apk fallo" }

Write-Output "[4/7] Compilando Java (javac)..."
$classes = Join-Path $build "classes"
New-Item -ItemType Directory -Path $classes | Out-Null
$sources = Get-ChildItem (Join-Path $appDir "java") -Recurse -Filter *.java |
    ForEach-Object { $_.FullName }
& (Join-Path $jdk.FullName "bin\javac.exe") --release 8 -classpath $androidJar -d $classes $sources
if ($LASTEXITCODE -ne 0) { throw "javac fallo" }

Write-Output "[5/7] Generando dex (d8)..."
$classFiles = Get-ChildItem $classes -Recurse -Filter *.class | ForEach-Object { $_.FullName }
& (Join-Path $bt "d8.bat") --release --lib $androidJar --min-api 24 --output $build $classFiles
if ($LASTEXITCODE -ne 0) { throw "d8 fallo" }
$dex = Join-Path $build "classes.dex"
if (-not (Test-Path $dex)) { throw "No se genero classes.dex" }

Write-Output "[6/7] Incrustando dex y alineando (zipalign)..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($apk0, 'Update')
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $dex, 'classes.dex', 'Optimal') | Out-Null
$zip.Dispose()

$apk1 = Join-Path $build "app-alineado.apk"
& (Join-Path $bt "zipalign.exe") -f 4 $apk0 $apk1
if ($LASTEXITCODE -ne 0) { throw "zipalign fallo" }

Write-Output "[7/7] Firmando (apksigner)..."
$keystore = Join-Path $appDir "partituras.keystore"
if (-not (Test-Path $keystore)) {
    & (Join-Path $jdk.FullName "bin\keytool.exe") -genkeypair -v `
        -keystore $keystore -alias partituras `
        -keyalg RSA -keysize 2048 -validity 10000 `
        -storepass partituras2026 -keypass partituras2026 `
        -dname "CN=Partituras de violin, O=Kis4r4gi"
    if ($LASTEXITCODE -ne 0) { throw "keytool fallo" }
}

$salida = Join-Path $raiz "dist\Partituras-de-violin.apk"
New-Item -ItemType Directory -Path (Join-Path $raiz "dist") -Force | Out-Null
& (Join-Path $bt "apksigner.bat") sign `
    --ks $keystore --ks-pass pass:partituras2026 --key-pass pass:partituras2026 `
    --out $salida $apk1
if ($LASTEXITCODE -ne 0) { throw "apksigner fallo" }

Write-Output ""
Write-Output "=== Verificacion ==="
& (Join-Path $bt "apksigner.bat") verify --print-certs $salida
if ($LASTEXITCODE -ne 0) { throw "verificacion de firma fallo" }
& $aapt2 dump badging $salida | Select-Object -First 12

$tam = [math]::Round((Get-Item $salida).Length / 1MB, 1)
Write-Output ""
Write-Output ("APK OK: " + $tam + " MB -> " + $salida)
