---
description: Flujo de trabajo Git para el equipo Limoné
---

# Flujo de Trabajo Git (Git-Flow simplificado)

Para mantener la estabilidad del proyecto y permitir el trabajo en equipo, seguiremos estas reglas:

## 1. Ramas Principales
* **`main`**: Refleja el estado actual en producción. **Nunca** se pushea directamente a main.
* **`develop`**: Rama base para el desarrollo. Aquí es donde se integran las nuevas funcionalidades.

## 2. Crear una nueva funcionalidad
Siempre que empieces una tarea nueva, create una rama desde `develop`:

// turbo
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-tarea
```

## 3. Integración de cambios
Cuando termines tu tarea y esté probada localmente:

1. Subí tu rama al repositorio:
```bash
git push origin feature/nombre-de-la-tarea
```

2. Integrá en `develop` (puedes usar un Pull Request en GitHub o hacerlo manualmente si estás seguro):
// turbo
```bash
git checkout develop
git pull origin develop
git merge feature/nombre-de-la-tarea
git push origin develop
```

## 4. Paso a Producción
Solo cuando `develop` esté estable y verificado, se pasa a `main`:

// turbo
```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

## 5. Limpieza
Borrá las ramas de las tareas ya integradas para mantener el repo limpio.
```bash
git branch -d feature/nombre-de-la-tarea
git push origin --delete feature/nombre-de-la-tarea
```
