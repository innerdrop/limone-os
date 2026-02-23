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

## 🔄 Paso 6: Flujo de Trabajo con Ramas (Scripts)

Para automatizar el trabajo y mantener la estabilidad, usamos scripts de PowerShell en la carpeta `scripts/`.

### 1. Iniciar una tarea
Crea una rama desde `develop` (feature, fix, hotfix o refactor).
```powershell
.\scripts\start.ps1
```

### 2. Guardar progreso (mientras trabajas)
Agrega todos los cambios, crea un commit y hace push a tu rama actual.
```powershell
.\scripts\publish.ps1 -Message "descripcion corta"
```

### 3. Sincronizar cambios de otros (opcional)
Si un compañero subió algo a `develop` y lo necesitás en tu rama sin perder tu trabajo:
```powershell
.\scripts\refresh.ps1
```

### 4. Finalizar tarea
Mergea tu rama en `develop`, sube los cambios a GitHub y opcionalmente borra la rama local/remota.
```powershell
.\scripts\finish.ps1
```

### 5. Deploy a Producción
Sincroniza `develop` con `main`, sube a GitHub y muestra los comandos para el VPS.
```powershell
.\scripts\devmain.ps1
```

### 6. Sincronizar entorno local (Comienzo del día)
Trae lo último de `develop`, instala dependencias, sincroniza la DB y levanta el servidor.
```powershell
# Uso normal
.\scripts\sync.ps1

# Reset completo de DB (borra todo y hace seed)
.\scripts\sync.ps1 -ResetDB
```

---

## 🏛️ Estructura de Ramas

* **`main`**: Código estable en producción. **No tocar directamente.**
* **`develop`**: Rama de integración. Todo se prueba aquí antes de pasar a `main`.
* **`feature/*`**, **`fix/*`**, etc: Ramas temporales para tareas específicas.

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
