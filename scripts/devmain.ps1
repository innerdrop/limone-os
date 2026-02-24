# Script para pasar cambios de develop a main + Deploy a VPS - Limoné
# Uso: .\scripts\devmain.ps1
#
# NOTA: El deploy al VPS requiere acceso SSH manual.
# Este script prepara todo en GitHub y luego muestra los comandos
# que debes ejecutar en el VPS.

Write-Host "`n[DEPLOY] PASANDO CAMBIOS A MAIN + VPS" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Colector de errores
$errorSummary = @()
function Add-Error { param($msg) $script:errorSummary += $msg }

# Configuración del VPS
$VPS_HOST = "31.97.14.156"
$VPS_PATH = "/var/www/limone"

# 0. Asegurar que estamos en develop y sincronizados
Write-Host "[GIT] Sincronizando develop con origin..." -ForegroundColor Yellow
git checkout develop 2>$null
git pull origin develop --no-edit
if ($LASTEXITCODE -ne 0) { Add-Error "[GIT] Error al actualizar develop" }

# 1. Verificar si hay cambios pendientes y guardarlos
$status = git status --porcelain
if ($status) {
    Write-Host "[GIT] Guardando cambios pendientes..." -ForegroundColor Yellow
    git add .
    git commit -m "sync: actualización previa a deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git push origin develop
    if ($LASTEXITCODE -ne 0) { Add-Error "[GIT] Error al subir cambios a develop" }
}

# 2. Ir a main y traer cambios remotos
Write-Host "[GIT] Sincronizando main..." -ForegroundColor Yellow
git checkout main
git pull origin main --no-edit

# 3. Mergear develop en main
Write-Host "[GIT] Mergeando develop -> main..." -ForegroundColor Yellow
git merge develop --no-edit -m "deploy: actualización desde develop ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))"
if ($LASTEXITCODE -ne 0) {
    Add-Error "[GIT] Conflictos al mergear develop en main"
    Write-Host "`n[ERROR] Conflictos detectados. Resolvelos manualmente." -ForegroundColor Red
    exit
}

# 4. Subir cambios a GitHub
Write-Host "[GIT] Subiendo main a GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) { Add-Error "[GIT] Error al subir main a GitHub" }

# 5. Volver a develop
Write-Host "`n[GIT] Volviendo a develop..." -ForegroundColor Yellow
git checkout develop

# 6. Deploy al VPS via SSH
if ($errorSummary.Count -gt 0) {
    Write-Host "`n--------------------------------------" -ForegroundColor Red
    Write-Host "[REPORTE DE ERRORES]" -ForegroundColor Red
    foreach ($err in $errorSummary) {
        Write-Host " - $err" -ForegroundColor Red
    }
    Write-Host "--------------------------------------" -ForegroundColor Red
    Write-Host "[INFO] Corrige los errores antes de deployar." -ForegroundColor Yellow
}
else {
    Write-Host "`n[OK] Main actualizado en GitHub." -ForegroundColor Green

    $deploy = Read-Host "Deployar al VPS ahora? (s/n)"
    if ($deploy -eq 's') {
        Write-Host "`n[VPS] Conectando a $VPS_HOST..." -ForegroundColor Cyan
        Write-Host "[VPS] Ingresa la clave cuando se te pida.`n" -ForegroundColor Yellow

        ssh root@$VPS_HOST "cd $VPS_PATH && echo '[VPS] Pulling main...' && git pull origin main && echo '[VPS] Rebuilding containers...' && docker-compose down && docker-compose up -d --build && echo '[VPS] Deploy completado!'"

        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n[OK] DEPLOY EXITOSO" -ForegroundColor Green
            Write-Host "[INFO] Sitio: https://tallerlimone.com" -ForegroundColor Gray
        } else {
            Write-Host "`n[ERROR] Hubo un problema con el deploy. Revisa la salida de arriba." -ForegroundColor Red
        }
    } else {
        Write-Host "`n[INFO] Deploy cancelado. Comandos manuales:" -ForegroundColor Yellow
        Write-Host "  ssh root@$VPS_HOST" -ForegroundColor White
        Write-Host "  cd $VPS_PATH" -ForegroundColor White
        Write-Host "  git pull origin main" -ForegroundColor White
        Write-Host "  docker-compose down" -ForegroundColor White
        Write-Host "  docker-compose up -d --build" -ForegroundColor White
        Write-Host "[INFO] Sitio: https://tallerlimone.com" -ForegroundColor Gray
    }
}
Write-Host ""
