# build-icons.ps1 — genera los iconos PNG de la aplicación a partir de la geometría del violín.
# Uso: powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\build-icons.ps1
# Salida: assets\icon-192.png, assets\icon-512.png, assets\icon-maskable-512.png

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$dir = (Resolve-Path (Join-Path $scriptDir "..\assets")).Path

$WOOD1 = [System.Drawing.Color]::FromArgb(255, 0xF8, 0xD7, 0x9A)
$WOOD2 = [System.Drawing.Color]::FromArgb(255, 0xE0, 0xAA, 0x53)
$WOOD3 = [System.Drawing.Color]::FromArgb(255, 0xC8, 0x76, 0x3F)
$GLOW  = [System.Drawing.Color]::FromArgb(255, 0x25, 0x1D, 0x14)
$BASE  = [System.Drawing.Color]::FromArgb(255, 0x12, 0x10, 0x0E)
$DARK  = [System.Drawing.Color]::FromArgb(255, 0x19, 0x14, 0x10)
$DARK2 = [System.Drawing.Color]::FromArgb(255, 0x16, 0x11, 0x0D)

function New-Canvas([int]$size) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = "AntiAlias"
  $g.PixelOffsetMode = "HighQuality"
  $g.InterpolationMode = "HighQualityBicubic"
  return @{ bmp = $bmp; g = $g }
}

function Draw-Master([System.Drawing.Graphics]$g, [double]$scale) {
  $g.ResetTransform()
  if ($scale -ne 1.0) {
    $off = 256 * (1 - $scale)
    $g.TranslateTransform([float]$off, [float]$off)
  }
  $g.ScaleTransform([float]$scale, [float]$scale)

  # fondo con resplandor radial (toda la superficie, para que el maskable sea a sangre)
  $baseBrush = New-Object System.Drawing.SolidBrush $BASE
  $g.FillRectangle($baseBrush, -600, -600, 1800, 1800)

  $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $glowPath.AddEllipse((New-Object System.Drawing.RectangleF -40, -60, 592, 640))
  $glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush $glowPath
  $glowBrush.CenterColor = $GLOW
  $glowBrush.SurroundColors = , $BASE
  $glowBrush.CenterPoint = New-Object System.Drawing.PointF 256, 230
  $g.FillEllipse($glowBrush, (New-Object System.Drawing.RectangleF -40, -60, 592, 640))

  # degradado de la madera
  $woodBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush `
    (New-Object System.Drawing.PointF 150, 170), `
    (New-Object System.Drawing.PointF 380, 460), `
    $WOOD1, $WOOD3

  # caja: dos elipses unidas menos las cuerdas de la cintura
  $body = New-Object System.Drawing.Drawing2D.GraphicsPath
  $body.FillMode = [System.Drawing.Drawing2D.FillMode]::Winding
  $body.AddEllipse((New-Object System.Drawing.RectangleF 186, 190, 140, 124))   # cuerpo superior
  $body.AddEllipse((New-Object System.Drawing.RectangleF 161, 280, 190, 172))   # cuerpo inferior
  $bodyRegion = New-Object System.Drawing.Region $body

  $carve = New-Object System.Drawing.Drawing2D.GraphicsPath
  $carve.FillMode = [System.Drawing.Drawing2D.FillMode]::Winding
  $carve.AddEllipse((New-Object System.Drawing.RectangleF 96, 252, 118, 118))
  $carve.AddEllipse((New-Object System.Drawing.RectangleF 298, 252, 118, 118))
  $bodyRegion.Exclude((New-Object System.Drawing.Region $carve))
  $g.FillRegion($woodBrush, $bodyRegion)

  # mango, cajón de clavijas y voluta
  $topBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush `
    (New-Object System.Drawing.PointF 0, 90), (New-Object System.Drawing.PointF 0, 260), $WOOD2, $WOOD3
  $g.FillRectangle($topBrush, 245, 150, 22, 106)
  $g.FillRectangle($topBrush, 239, 104, 34, 58)
  $g.FillEllipse($topBrush, (New-Object System.Drawing.RectangleF 238, 80, 36, 36))

  # diapasón
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $DARK), 249, 152, 14, 84)

  # efe
  $darkBrush = New-Object System.Drawing.SolidBrush $DARK2
  $st1 = $g.Save()
  $g.TranslateTransform(228, 368); $g.RotateTransform(-7)
  $g.FillRectangle($darkBrush, -3.5, -20, 7, 40)
  $g.Restore($st1)

  $st2 = $g.Save()
  $g.TranslateTransform(284, 368); $g.RotateTransform(7)
  $g.FillRectangle($darkBrush, -3.5, -20, 7, 40)
  $g.Restore($st2)

  # cordal
  $tail = @(
    (New-Object System.Drawing.PointF 243, 398),
    (New-Object System.Drawing.PointF 269, 398),
    (New-Object System.Drawing.PointF 263, 436),
    (New-Object System.Drawing.PointF 249, 436)
  )
  $g.FillPolygon($darkBrush, $tail)

  $g.ResetTransform()
}

function Save-Master([System.Drawing.Bitmap]$bmp, [string]$name) {
  $p = Join-Path $dir $name
  $bmp.Save($p, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "OK $name"
}

# --- 512x512 ---
$c = New-Canvas 512
Draw-Master $c.g 1.0
Save-Master $c.bmp "icon-512.png"

# --- 192x192 (desde el maestro, con interpolación de alta calidad) ---
$c = New-Canvas 512
Draw-Master $c.g 1.0
$master = $c.bmp

$small = New-Object System.Drawing.Bitmap 192, 192
$g2 = [System.Drawing.Graphics]::FromImage($small)
$g2.SmoothingMode = "AntiAlias"
$g2.InterpolationMode = "HighQualityBicubic"
$g2.PixelOffsetMode = "HighQuality"
$g2.DrawImage($master, (New-Object System.Drawing.Rectangle 0, 0, 192, 192))
$g2.Dispose()
$small.Save((Join-Path $dir "icon-192.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$small.Dispose()
$master.Dispose()
Write-Output "OK icon-192.png"

# --- 512x512 maskable (arte al 68 % dentro de la zona segura) ---
$c = New-Canvas 512
Draw-Master $c.g 0.68
Save-Master $c.bmp "icon-maskable-512.png"

Write-Output "Listo: $dir"
