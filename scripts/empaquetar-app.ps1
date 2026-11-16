# empaquetar-app.ps1
# Empaqueta la aplicacion web (PWA) en windows\PartiturasViolin\app.zip
# para incrustarla dentro del .exe. Se ejecuta antes de cada compilacion.

$raiz = Split-Path -Parent $PSScriptRoot
$salida = Join-Path $raiz "windows\PartiturasViolin\app.zip"
$incluir = @("index.html", "manifest.json", "sw.js", "css", "js", "assets")

# Carpeta temporal de preparacion
$staging = Join-Path $env:TEMP ("partituras-app-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $staging | Out-Null

try {
    foreach ($i in $incluir) {
        $origen = Join-Path $raiz $i
        if (Test-Path $origen) {
            Copy-Item $origen (Join-Path $staging $i) -Recurse -Force
        }
    }

    # Excluir archivos de desarrollo que no necesita la app
    $basura = @("$staging\assets\icon.html")
    foreach ($b in $basura) { if (Test-Path $b) { Remove-Item $b -Force } }

    if (Test-Path $salida) { Remove-Item $salida -Force }
    Compress-Archive -Path (Join-Path $staging "*") -DestinationPath $salida -CompressionLevel Optimal

    $tam = [math]::Round((Get-Item $salida).Length / 1KB, 1)
    Write-Output ("app.zip OK (" + $tam + " KB) -> " + $salida)
}
finally {
    Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue
}
