#!/bin/sh
set -e

echo "[ENTRYPOINT] Sincronizando esquema de base de datos..."
npx prisma db push --skip-generate --accept-data-loss 2>&1 || echo "[ENTRYPOINT] Warning: prisma db push falló, continuando..."

echo "[ENTRYPOINT] Iniciando servidor..."
exec node server.js
