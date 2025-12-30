# 🤝 Guía de Colaboración - LimoneOS

## 📋 Paso a Paso Completo

---

## 🔧 PASO 1: Configurar Git (Solo Mauro - Una vez)

Abrir terminal en la carpeta del proyecto y ejecutar:

```bash
# Ir a la carpeta del proyecto
cd C:\Users\Mauro\Desktop\LimoneOS

# Inicializar Git
git init

# Configurar tu usuario (si no lo has hecho antes)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Agregar todos los archivos
git add .

# Crear primer commit
git commit -m "🎨 Initial commit - LimoneOS"
```

---

## 🌐 PASO 2: Crear Repositorio en GitHub

1. Ir a **https://github.com/new**
2. Completar:
   - **Repository name**: `limone-os`
   - **Description**: `Plataforma SaaS para Taller Limoné`
   - **Visibility**: `Private` (recomendado)
   - ⚠️ **NO marcar** "Add a README" (ya tenemos uno)
3. Click en **Create repository**

---

## 🔗 PASO 3: Conectar Local con GitHub

Después de crear el repo, GitHub te muestra comandos. Ejecutar estos:

```bash
# Conectar con GitHub (reemplazar TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/limone-os.git

# Renombrar rama a main (si es necesario)
git branch -M main

# Subir código
git push -u origin main
```

---

## 👥 PASO 4: Invitar al Diseñador

1. Ir al repo en GitHub → **Settings** → **Collaborators**
2. Click en **Add people**
3. Buscar por username o email del diseñador
4. Enviar invitación

---

## 💻 PASO 5: El Diseñador Clona el Proyecto

El diseñador ejecuta en su computadora:

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/limone-os.git

# Entrar a la carpeta
cd limone-os

# Instalar dependencias
npm install

# Crear archivo de entorno (copiar el ejemplo)
cp .env.example .env

# Configurar base de datos
npx prisma db push
npx prisma db seed

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🔄 PASO 6: Flujo de Trabajo Diario

### Antes de empezar a trabajar:
```bash
git pull origin main
```

### Después de hacer cambios:
```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

### Si hay conflictos:
```bash
git pull origin main
# Resolver conflictos manualmente
git add .
git commit -m "Merge conflicts resolved"
git push origin main
```

---

## 📝 Buenas Prácticas para Commits

| Emoji | Tipo | Ejemplo |
|-------|------|---------|
| 🎨 | Diseño/UI | `🎨 Mejorar landing page` |
| ✨ | Nueva función | `✨ Agregar formulario de contacto` |
| 🐛 | Bug fix | `🐛 Corregir error en login` |
| 📝 | Documentación | `📝 Actualizar README` |
| 🔧 | Configuración | `🔧 Configurar variables de entorno` |

---

## ⚠️ Archivos NO Compartidos (en .gitignore)

Estos archivos NO se suben a GitHub por seguridad:
- `.env` - Variables de entorno (contraseñas, secrets)
- `node_modules/` - Dependencias (se instalan con npm install)
- `prisma/dev.db` - Base de datos local
- `.next/` - Build de Next.js

---

## 🆘 Comandos de Emergencia

```bash
# Ver estado actual
git status

# Ver historial de cambios
git log --oneline -10

# Descartar cambios locales (CUIDADO!)
git checkout -- .

# Volver a un commit anterior
git reset --hard HEAD~1
```

---

## 🚀 Deploy Automático (Opcional)

Para que cada push actualice automáticamente el VPS:
1. Configurar GitHub Actions
2. O usar webhook con el VPS de Hostinger

---

*Última actualización: 30 de Diciembre, 2025*
