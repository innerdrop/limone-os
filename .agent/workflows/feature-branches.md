---
description: Flujo de trabajo Git para el equipo Limoné
---

# Flujo de Trabajo Git (Git-Flow simplificado)

Para mantener la estabilidad del proyecto y permitir el trabajo en equipo, seguiremos estas reglas:

## 1. Ramas Principales
* **`main`**: Refleja el estado actual en producción. **Nunca** se pushea directamente a main.
* **`develop`**: Rama base para el desarrollo. Aquí es donde se integran las nuevas funcionalidades.

## 2. Crear una nueva funcionalidad
Siempre que empieces una tarea nueva, usa el script `start`:

// turbo
```powershell
.\scripts\start.ps1
```

## 3. Integración de cambios
Cuando termines tu tarea y esté probada localmente, usa `finish`:

// turbo
```powershell
.\scripts\finish.ps1
```

## 4. Paso a Producción
Solo cuando `develop` esté estable y verificado, se pasa a `main` con `devmain`:

// turbo
```powershell
.\scripts\devmain.ps1
```

## 5. Limpieza
Borrá las ramas de las tareas ya integradas para mantener el repo limpio.
```bash
git branch -d feature/nombre-de-la-tarea
git push origin --delete feature/nombre-de-la-tarea
```
