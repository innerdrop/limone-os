# Script para Guardar y Publicar Cambios - Limoné
# Ejecutar: .\scripts\publish.ps1 -Message "descripcion del cambio"

param(
    [Parameter(Mandatory = $true)]
    [string]$Message
)

Write-Host ""
Write-Host "[PUBLISH] GUARDANDO Y PUBLICANDO CAMBIOS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Colector de errores
$errorSummary = @()
function Add-Error { param($msg) $script:errorSummary += $msg }
Write-Host ""

# 1. Verificar rama actual
$currentBranch = git branch --show-current
Write-Host "[INFO] Rama actual: $currentBranch" -ForegroundColor Gray

if ($currentBranch -eq "main") {
    Write-Host "[ERROR] No se puede publicar directo a main. Usa una rama feature/*" -ForegroundColor Red
    exit 1
}

# 2. Mostrar archivos modificados
Write-Host ""
Write-Host "[CHANGES] Archivos modificados:" -ForegroundColor Yellow
git status --short
Write-Host ""

# 3. Agregar todos los cambios
Write-Host "[GIT] Agregando cambios..." -ForegroundColor Yellow
git add .

# 4. Crear commit
Write-Host "[GIT] Creando commit..." -ForegroundColor Yellow
git commit -m $Message

# 5. Push a origin
Write-Host "[GIT] Subiendo a GitHub..." -ForegroundColor Yellow
git push origin $currentBranch
if ($LASTEXITCODE -ne 0) { Add-Error "[GIT] Error al subir a GitHub" }

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Error al subir a GitHub. Verifica tu conexion." -ForegroundColor Red
    exit 1
}

if ($errorSummary.Count -gt 0) {
    Write-Host "`n--------------------------------------" -ForegroundColor Red
    Write-Host "[REPORTE DE ERRORES]" -ForegroundColor Red
    foreach ($err in $errorSummary) {
        Write-Host " - $err" -ForegroundColor Red
    }
    Write-Host "--------------------------------------" -ForegroundColor Red
}
else {
    Write-Host ""
    Write-Host "[OK] CAMBIOS PUBLICADOS EXITOSAMENTE" -ForegroundColor Green
    Write-Host "[INFO] Tu companero puede ejecutar: .\scripts\sync.ps1" -ForegroundColor Cyan
    Write-Host ""
}
