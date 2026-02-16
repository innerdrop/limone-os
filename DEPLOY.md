# 🚀 Guía de Deploy - Limone OS

## Configuración de GitHub Secrets

Para que el pipeline de CI/CD funcione, debes configurar los siguientes secrets en tu repositorio de GitHub:

### Pasos:
1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Click en "New repository secret"

### Secrets requeridos:

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `VPS_HOST` | IP o dominio del servidor | `123.45.67.89` o `vps.ejemplo.com` |
| `VPS_USER` | Usuario SSH del servidor | `root` o `deploy` |
| `SSH_PRIVATE_KEY` | Clave privada SSH completa | Ver instrucciones abajo |

### Generar clave SSH:

```bash
# En tu máquina local, generar clave SSH
ssh-keygen -t ed25519 -C "github-actions-limone" -f ~/.ssh/limone_deploy

# Copiar la clave pública al servidor
ssh-copy-id -i ~/.ssh/limone_deploy.pub usuario@tu-vps-ip

# El contenido de ~/.ssh/limone_deploy (clave privada) es lo que va en SSH_PRIVATE_KEY
cat ~/.ssh/limone_deploy
```

> ⚠️ **Importante**: Copia TODO el contenido del archivo de clave privada, incluyendo `-----BEGIN OPENSSH PRIVATE KEY-----` y `-----END OPENSSH PRIVATE KEY-----`

---

## Preparar el VPS (primera vez)

```bash
# Conectar al VPS
ssh usuario@tu-vps-ip

# Crear directorio del proyecto
sudo mkdir -p /var/www/limone
sudo chown -R $USER:$USER /var/www/limone

# Clonar el repositorio
cd /var/www/limone
git clone https://github.com/tu-usuario/limone-os.git .

# Crear archivo .env de producción
cp .env.example .env
nano .env  # Editar con valores de producción

# Primer deploy manual
docker-compose up -d --build
docker-compose exec app npx prisma migrate deploy
```

---

## Flujo de trabajo

### Desarrollo local (cada desarrollador):
```bash
# 1. Clonar el repo
git clone https://github.com/tu-usuario/limone-os.git
cd limone-os

# 2. Crear tu .env local
cp .env.example .env

# 3. Levantar Docker (cada uno tiene su propia DB local)
docker-compose up -d

# 4. Ejecutar migraciones
docker-compose exec app npx prisma migrate dev

# 5. Trabajar normalmente...
npm run dev
```

### Deploy a producción:
```bash
# Simplemente hacer push a main
git add .
git commit -m "Nueva funcionalidad"
git push origin main

# ¡El pipeline hace todo automáticamente! 🎉
```

---

## Verificar deploy

```bash
# Ver estado de contenedores en el VPS
ssh usuario@tu-vps-ip "docker-compose -f /var/www/limone/docker-compose.yml ps"

# Ver logs
ssh usuario@tu-vps-ip "docker-compose -f /var/www/limone/docker-compose.yml logs -f app"

# Verificar health check
curl https://tallerlimone.com/api/health
```

---

## Troubleshooting

### Error de permisos SSH
```bash
# En el VPS, verificar que la clave pública está configurada
cat ~/.ssh/authorized_keys
```

### Contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs app
docker-compose logs db
```

### Migraciones fallan
```bash
# Ejecutar manualmente
docker-compose exec app npx prisma migrate deploy --force
```
