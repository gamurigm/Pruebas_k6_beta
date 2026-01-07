# Script de compilación robusto para LaTeX
$ErrorActionPreference = "Continue"

Write-Host "Iniciando compilación de LaTeX..." -ForegroundColor Cyan

# Directorio de salida
$BuildDir = "build"
$PdfFile = "$BuildDir/main.pdf"

# Intentar borrar el PDF antiguo para asegurar que se genera uno nuevo
if (Test-Path $PdfFile) {
    try {
        Remove-Item $PdfFile -ErrorAction Stop
        Write-Host "PDF antiguo eliminado correctamente." -ForegroundColor Gray
    } catch {
        Write-Host "ADVERTENCIA: No se pudo eliminar el PDF antiguo. ¿Está abierto en otro programa?" -ForegroundColor Yellow
        Write-Host "Es probable que los cambios NO se vean reflejados si el archivo está bloqueado.`n" -ForegroundColor Yellow
    }
}

# Asegurar que el directorio de salida existe
if (-not (Test-Path $BuildDir)) {
    New-Item -ItemType Directory -Path $BuildDir | Out-Null
    Write-Host "Carpeta '$BuildDir' creada." -ForegroundColor Gray
}

# Limpiar solo archivos auxiliares conocidos para evitar borrar archivos importantes accidentalmente
$ExtensionsToClean = @("*.aux", "*.log", "*.out", "*.toc", "*.bbl", "*.blg", "*.lot", "*.lof", "*.run.xml", "*.bcf")
Write-Host "Limpiando archivos auxiliares antiguos en $BuildDir..." -ForegroundColor Gray
foreach ($ext in $ExtensionsToClean) {
    Get-ChildItem -Path $BuildDir -Filter $ext -ErrorAction SilentlyContinue | Remove-Item -Force
}

# Ejecutar la secuencia de compilación con rutas entrecomilladas
Write-Host "Ejecutando pdflatex (paso 1/3)..."
& pdflatex -interaction=nonstopmode -output-directory="$BuildDir" "main.tex" | Out-Null

Write-Host "Procesando bibliografía..." -ForegroundColor Cyan
if (Test-Path "$BuildDir/main.aux") {
    & bibtex "$BuildDir/main" | Out-Null
}

Write-Host "Ejecutando pdflatex (paso 2/3)..."
& pdflatex -interaction=nonstopmode -output-directory="$BuildDir" "main.tex" | Out-Null

Write-Host "Ejecutando pdflatex (paso 3/3)..."
& pdflatex -interaction=nonstopmode -output-directory="$BuildDir" "main.tex" | Out-Null

# Verificar resultado final
if (Test-Path $PdfFile) {
    $LastMod = (Get-Item $PdfFile).LastWriteTime
    Write-Host "`n¡ÉXITO! PDF generado en: $PdfFile" -ForegroundColor Green
    Write-Host "Última actualización: $LastMod" -ForegroundColor Gray
} else {
    Write-Host "`nERROR: No se pudo generar el PDF. Revisa el archivo de log en $BuildDir/main.log" -ForegroundColor Red
}

pause
