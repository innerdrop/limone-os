# 🚀 Guía de Despliegue - Limone OS

Guía para desplegar Limone OS en VPS con Docker y PostgreSQL.

---

## Requisitos del VPS

- Docker Engine 20+
- Docker Compose v2+
- Git
- 1GB RAM mínimo (2GB recomendado)
- 10GB espacio en disco

---

## 1. Preparación (en tu máquina local)

### 1.1 Exportar datos actuales de SQLite

Antes de cambiar el provider a PostgreSQL, exporta los datos:

```bash
# Asegúrate que .env tenga DATABASE_URL="file:./dev.db"
node scripts/migrate-to-postgres.js export
```

Esto crea `backup-sqlite.json` con todos los datos.

### 1.2 Subir a Git

```bash
git add .
git commit -m "feat: Docker deployment configuration"
git push origin main
```

---

## 2. Despliegue en VPS

### 2.1 Clonar repositorio

```bash
cd /opt  # o tu directorio preferido
git clone https://github.com/TU_USUARIO/limone-os.git
cd limone-os
```

### 2.2 Configurar variables de entorno

```bash
# Crear archivo .env para producción
cp .env.production .env

# Editar con tus valores seguros
nano .env
```

**Variables a configurar:**

```env
# Generar secret seguro:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET=TU_SECRET_GENERADO

POSTGRES_PASSWORD=TU_PASSWORD_SEGURO
DATABASE_URL=postgresql://limone:TU_PASSWORD_SEGURO@db:5432/limone
```

### 2.3 Subir archivo de backup

Copia el `backup-sqlite.json` desde tu máquina local:

```bash
scp backup-sqlite.json usuario@tu-vps:/opt/limone-os/
```

### 2.4 Construir y levantar servicios

```bash
# Construir imagen (primera vez toma varios minutos)
docker-compose build

# Iniciar solo la base de datos primero
docker-compose up -d db

# Esperar que PostgreSQL esté listo (10-15 segundos)
sleep 15

# Aplicar schema a PostgreSQL
docker-compose run --rm app npx prisma db push

# Importar datos
docker-compose run --rm app node scripts/migrate-to-postgres.js import

# Levantar la aplicación
docker-compose up -d
```

### 2.5 Verificar despliegue

```bash
# Ver logs
docker-compose logs -f app

# Verificar que responde
curl http://localhost:3000
```

---

## 3. Configurar Reverse Proxy (Nginx)

### 3.1 Instalar Nginx (si no está instalado)

```bash
apt update && apt install -y nginx certbot python3-certbot-nginx
```

### 3.2 Configurar sitio

```bash
nano /etc/nginx/sites-available/limone
```

```nginx
server {
    listen 80;
    server_name limone.usev.app;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

```bash
ln -s /etc/nginx/sites-available/limone /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 3.3 Configurar SSL con Let's Encrypt

```bash
certbot --nginx -d limone.usev.app
```

---

## 4. Comandos Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar aplicación
docker-compose restart app

# Actualizar después de cambios
git pull
docker-compose build
docker-compose up -d

# Backup de PostgreSQL
docker-compose exec db pg_dump -U limone limone > backup.sql

# Restaurar backup
docker-compose exec -T db psql -U limone limone < backup.sql

# Acceder a Prisma Studio (desarrollo)
docker-compose exec app npx prisma studio
```

---

## 5. Solución de Problemas

### La app no inicia
```bash
# Ver logs detallados
docker-compose logs app

# Verificar que la BD está corriendo
docker-compose ps db
```

### Error de conexión a base de datos
```bash
# Verificar que PostgreSQL está healthy
docker-compose exec db pg_isready -U limone

# Probar conexión manual
docker-compose exec db psql -U limone -c "SELECT 1"
```

### Reconstruir desde cero
```bash
docker-compose down -v  # ⚠️ Elimina volúmenes!
docker-compose build --no-cache
docker-compose up -d
```

---

## Estructura de Volúmenes

| Volumen | Contenido | Persistencia |
|---------|-----------|--------------|
| `limone_postgres_data` | Base de datos PostgreSQL | ✅ Persistente |
| `limone_uploads` | Archivos subidos | ✅ Persistente |

---

## Credenciales por Defecto

- **Admin**: `natalia@limone.usev.app`
- **Password**: (el que tengas configurado en la BD)

---

> ⚠️ **IMPORTANTE**: Cambia todas las contraseñas por defecto en producción.
