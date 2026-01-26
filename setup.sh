#!/bin/bash

# ====================================================
# LIMONE OS - VPS Setup Script (Hybrid: Docker DB + PM2 App)
# ====================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}>>> Iniciando despliegue de LIMONE OS...${NC}"

# 1. Configurar Base de Datos (Docker)
echo -e "${BLUE}>>> Iniciando Base de Datos...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado. Instalá Docker primero.${NC}"
    exit 1
fi

docker compose up -d

# 2. Configurar Variables de Entorno
if [ ! -f .env ]; then
    echo -e "${BLUE}>>> Creando archivo .env...${NC}"
    AUTH_SECRET=$(openssl rand -base64 32)
    cat > .env << EOL
# --- DATABASE ---
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5435/limone?schema=public"

# --- NEXTAUTH ---
NEXTAUTH_URL="https://limone.usev.app"
NEXTAUTH_SECRET="${AUTH_SECRET}"

# --- APP ---
NEXT_PUBLIC_APP_URL="https://limone.usev.app"
NODE_ENV="production"
PORT=3006
EOL
fi

# 3. Instalación y Build de la App
echo -e "${BLUE}>>> Instalando dependencias y construyendo...${NC}"
npm install
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed
npm run build

# 4. Iniciar con PM2
echo -e "${BLUE}>>> Iniciando aplicación con PM2...${NC}"
if command -v pm2 &> /dev/null; then
    pm2 delete limone-web 2>/dev/null || true
    pm2 start npm --name "limone-web" -- start -- -p 3006
    pm2 save
    echo -e "${GREEN}>>> Aplicación iniciada en puerto 3006.${NC}"
else
    echo -e "${RED}PM2 no encontrado. Instalalo con: npm install -g pm2${NC}"
fi

# 5. Configurar Nginx
NGINX_CONF="/etc/nginx/sites-available/limone.usev.app"

if [ -d "/etc/nginx/sites-available" ]; then
    echo -e "${BLUE}>>> Configurando Nginx...${NC}"
    
    # Check if we have sudo privileges
    if [ "$EUID" -ne 0 ]; then 
        SUDO="sudo"
    else
        SUDO=""
    fi

    $SUDO bash -c "cat > $NGINX_CONF" << EOL
server {
    server_name limone.usev.app;
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

    if [ ! -f "/etc/nginx/sites-enabled/limone.usev.app" ]; then
        $SUDO ln -s $NGINX_CONF /etc/nginx/sites-enabled/
    fi

    $SUDO nginx -t && $SUDO systemctl restart nginx
fi

echo -e "${GREEN}>>> DESPLIEGUE FINALIZADO${NC}"
echo -e "Para activar SSL: ${BLUE}sudo certbot --nginx -d limone.usev.app${NC}"
