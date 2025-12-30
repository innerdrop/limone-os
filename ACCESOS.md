# 🔐 LimoneOS - Guía de Accesos

## 🌐 URLs del Sistema

| Panel | URL Local | Descripción |
|-------|-----------|-------------|
| **Landing** | http://localhost:3000 | Página pública del taller |
| **Login** | http://localhost:3000/login | Iniciar sesión |
| **Portal Alumno** | http://localhost:3000/portal | Panel del estudiante |
| **Admin Panel** | http://localhost:3000/admin | Panel administrativo |

---

## 👥 Credenciales de Acceso

### 🔴 Administrador (Natalia)
| Campo | Valor |
|-------|-------|
| **Email** | `natalia@limone.usev.app` |
| **Contraseña** | `admin123` |
| **Rol** | ADMIN |
| **Acceso** | Panel Admin completo |

---

### 🟡 Docente (Demo)
| Campo | Valor |
|-------|-------|
| **Email** | `docente@limone.usev.app` |
| **Contraseña** | `docente123` |
| **Rol** | DOCENTE |
| **Acceso** | Panel de clases y asistencia |

---

### 🟢 Alumno (Demo)
| Campo | Valor |
|-------|-------|
| **Email** | `alumno@demo.com` |
| **Contraseña** | `alumno123` |
| **Rol** | ALUMNO |
| **Acceso** | Portal del alumno |

---

## 🛠️ Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Resetear y poblar base de datos
npm run db:push
npx prisma db seed

# Ver base de datos con Prisma Studio
npx prisma studio
```

---

## 📁 Estructura de Paneles

### Panel Admin (`/admin`)
- Dashboard general
- Gestión de alumnos
- Gestión de talleres
- Gestión de clases
- Control de asistencia
- Gestión de pagos
- Sistema de notificaciones
- Configuración

### Portal Alumno (`/portal`)
- Mi perfil
- Mis talleres
- Mi asistencia
- Mis pagos
- Mis obras
- Notificaciones

---

## ⚠️ Notas Importantes

1. **Base de datos**: El proyecto usa SQLite en desarrollo (`prisma/dev.db`)
2. **Primer uso**: Ejecutar `npm run db:push` y `npx prisma db seed`
3. **Producción**: Cambiar a PostgreSQL y actualizar credenciales

---

*Última actualización: 30 de Diciembre, 2025*
