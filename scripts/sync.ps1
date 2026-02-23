# Script de Sincronizacion - Limoné
# Ejecutar: .\scripts\sync.ps1
#
# Parametros opcionales:
#   -SkipServer : No inicia el servidor (util durante el dia)
#   -ResetDB    : Resetea la DB completa (borra todo y hace seed)
#
# Ejemplos:
#   .\scripts\sync.ps1                    # Inicio del dia (con servidor)
#   .\scripts\sync.ps1 -SkipServer        # Solo actualizar (sin servidor)
#   .\scripts\sync.ps1 -ResetDB           # Reset completo de DB

param(
    [switch]$ResetDB,
    [switch]$SkipServer
)

Write-Host ""
Write-Host "[SYNC] SINCRONIZANDO PROYECTO LIMONE" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Colector de errores
$errorSummary = @()
function Add-Error { param($msg) $script:errorSummary += $msg }
Write-Host ""

# 1. Detener procesos Node si estan corriendo
Write-Host "[STOP] Deteniendo procesos Node..." -ForegroundColor Yellow
taskkill /F /IM node.exe /T 2>$null

# 2. Asegurar que Docker Desktop esta corriendo (limone-db)
Write-Host "[DOCKER] Verificando contenedor de base de datos..." -ForegroundColor Yellow
$dbRunning = docker ps --filter "name=limone-db" --format "{{.Names}}" 2>$null
if (-not $dbRunning) {
    Write-Host "[DOCKER] Levantando base de datos con docker-compose..." -ForegroundColor Yellow
    docker-compose up -d db
    Start-Sleep -Seconds 5
}

# 3. Actualizar codigo desde develop
Write-Host "[GIT] Actualizando codigo desde develop..." -ForegroundColor Yellow
git fetch origin
git pull origin develop
if ($LASTEXITCODE -ne 0) { Add-Error "[GIT] Error al actualizar el codigo (Git Pull)" }

# 4. Instalar dependencias si cambiaron
Write-Host "[NPM] Verificando dependencias..." -ForegroundColor Yellow
npm install

# 5. Generar cliente Prisma
Write-Host "[PRISMA] Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) { Add-Error "[PRISMA] Error al generar el cliente" }

# 6. Sincronizar esquema de base de datos
if ($ResetDB) {
    Write-Host "[DB] Reseteando base de datos completa..." -ForegroundColor Red
    docker exec -i limone-db psql -U limone -d limone -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    npx prisma db push
    npx prisma db seed
}
else {
    Write-Host "[DB] Sincronizando esquema..." -ForegroundColor Yellow
    npx prisma db push
    if ($LASTEXITCODE -ne 0) { Add-Error "[DB] Error al sincronizar el esquema" }
}

Write-Host ""
if ($errorSummary.Count -gt 0) {
    Write-Host "--------------------------------------" -ForegroundColor Red
    Write-Host "[REPORTE DE ERRORES]" -ForegroundColor Red
    foreach ($err in $errorSummary) {
        Write-Host " - $err" -ForegroundColor Red
    }
    Write-Host "--------------------------------------" -ForegroundColor Red
}
else {
    Write-Host "[OK] SINCRONIZACION COMPLETA" -ForegroundColor Green
}
Write-Host ""

# 7. Iniciar servidor de desarrollo
if (-not $SkipServer) {
    Write-Host "[DEV] Iniciando servidor de desarrollo..." -ForegroundColor Cyan
    npm run dev
}
