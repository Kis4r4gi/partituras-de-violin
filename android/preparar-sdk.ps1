# preparar-sdk.ps1 — Descarga y prepara el SDK de Android para compilar el APK.
# Uso: powershell -ExecutionPolicy Bypass -File android\preparar-sdk.ps1
# Requiere: JAVA_HOME o un JDK 17 disponible (se busca en %TEMP%\apk-tools).

$ErrorActionPreference = "Stop"
$t = Join-Path $env:TEMP "apk-tools"
$sdk = Join-Path $t "android-sdk"

# --- JDK 17 (si no esta, lo descarga de Adoptium) ---
$jdk = Get-ChildItem $t -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "jdk-17*" } | Select-Object -First 1
if (-not $jdk) {
    Write-Output "Descargando JDK 17..."
    $zip = Join-Path $t "jdk17.zip"
    curl.exe -s -L --retry 3 -o $zip "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse"
    Expand-Archive -Path $zip -DestinationPath $t -Force
    $jdk = Get-ChildItem $t -Directory | Where-Object { $_.Name -like "jdk-17*" } | Select-Object -First 1
}
$env:JAVA_HOME = $jdk.FullName
$env:PATH = (Join-Path $jdk.FullName "bin") + ";" + $env:PATH
Write-Output ("JAVA_HOME=" + $env:JAVA_HOME)

# --- cmdline-tools (sdkmanager) ---
$mgr = Join-Path $sdk "cmdline-tools\latest\bin\sdkmanager.bat"
if (-not (Test-Path $mgr)) {
    Write-Output "Descargando cmdline-tools..."
    $zip = Join-Path $t "cmdline.zip"
    curl.exe -s -L --retry 3 -o $zip "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
    $ex = Join-Path $t "cmdline-extract"
    Remove-Item $ex -Recurse -Force -ErrorAction SilentlyContinue
    Expand-Archive -Path $zip -DestinationPath $ex -Force
    $encontrado = Get-ChildItem $ex -Recurse -Filter "sdkmanager.bat" | Select-Object -First 1
    if (-not $encontrado) { throw "No se encontro sdkmanager.bat en el ZIP" }
    $carpeta = $encontrado.Directory.Parent.FullName   # carpeta que contiene bin\ y lib\
    New-Item -ItemType Directory -Force -Path (Join-Path $sdk "cmdline-tools") | Out-Null
    Move-Item $carpeta (Join-Path $sdk "cmdline-tools\latest")
}
Write-Output "sdkmanager listo."

# --- Licencias aceptadas (hashes oficiales de Android SDK) ---
$lic = Join-Path $sdk "licenses"
New-Item -ItemType Directory -Force -Path $lic | Out-Null
Set-Content (Join-Path $lic "android-sdk-license") `
    "24333f8a63b6825ea9c5514f83c2829b004d1fee`n8933bad161af4178b1185d1a37fbf41ea5269c55`nd56f5187479451eabf01fb78af6dfcb131a6481e"
Set-Content (Join-Path $lic "android-sdk-preview-license") "84831b9409646a918e30573bab4c9c91346d8abd"
Set-Content (Join-Path $lic "android-sdk-arm-dbt-license") "859f317696f67ef3d7f30a50a5560e7834b43963"

# --- Paquetes: plataforma 34 + herramientas de compilacion ---
Write-Output "Instalando platforms;android-34 y build-tools;34.0.0 (puede tardar)..."
1..20 | ForEach-Object { "y" } | & $mgr --sdk_root="$sdk" "platforms;android-34" "build-tools;34.0.0"

# --- Verificacion ---
$plat = Test-Path (Join-Path $sdk "platforms\android-34\android.jar")
$bt = Test-Path (Join-Path $sdk "build-tools\34.0.0\aapt2.exe")
Write-Output ("android.jar: " + $plat + " | aapt2: " + $bt)
if ($plat -and $bt) { Write-Output "SDK_LISTO" } else { Write-Output "SDK_FALLA" }
