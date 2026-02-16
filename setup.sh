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

# Esperar a que la base de datos esté lista
echo -e "${BLUE}>>> Esperando a que la base de datos esté lista...${NC}"
until docker exec limone-db pg_isready -U limone -d limone > /dev/null 2>&1; do
  echo -ne "."
  sleep 1
done
echo -e "\n${GREEN}>>> Base de datos lista!${NC}"

# 2. Configurar Variables de Entorno
if [ ! -f .env ]; then
    echo -e "${BLUE}>>> Creando archivo .env...${NC}"
    AUTH_SECRET=$(openssl rand -base64 32)
    cat > .env << EOL
# --- DATABASE ---
DATABASE_URL="postgresql://limone:limone_dev_2025@db:5432/limone?schema=public"

# --- NEXTAUTH ---
NEXTAUTH_URL="https://tallerlimone.com"
NEXTAUTH_SECRET="${AUTH_SECRET}"

# --- APP ---
NEXT_PUBLIC_APP_URL="https://tallerlimone.com"
NODE_ENV="production"
PORT=3081
EOL
fi

# 3. Construir e Iniciar con Docker (Todo el stack)
echo -e "${BLUE}>>> Construyendo e iniciando contenedores (App + DB)...${NC}"
docker compose up -d --build

# 4. Configurar Base de Datos (Adentro del contenedor)
echo -e "${BLUE}>>> Configurando base de datos interna...${NC}"
# Esperar un momento a que el contenedor de la app esté listo para ejecutar comandos
sleep 5
docker exec limone-app npx prisma db push --accept-data-loss
docker exec limone-app npx prisma db seed

echo -e "${GREEN}>>> Aplicación iniciada en Docker (Puerto 3081).${NC}"

# 5. Configurar Nginx
NGINX_CONF="/etc/nginx/sites-available/tallerlimone.com"

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
    server_name tallerlimone.com;
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

    if [ ! -f "/etc/nginx/sites-enabled/tallerlimone.com" ]; then
        $SUDO ln -s $NGINX_CONF /etc/nginx/sites-enabled/
    fi

    $SUDO nginx -t && $SUDO systemctl restart nginx
fi

echo -e "${GREEN}>>> DESPLIEGUE FINALIZADO${NC}"
echo -e "Para activar SSL: ${BLUE}sudo certbot --nginx -d tallerlimone.com${NC}"
