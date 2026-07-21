# Manta en Ruta - Planificación

## FASE 13: Backlog, Épicas y Sprint Planning

---

## 1. Épicas

| ID | Épica | Módulo | Prioridad |
|----|-------|--------|-----------|
| EP-01 | Infraestructura base | Backend | Must Have |
| EP-02 | Autenticación y autorización | Seguridad | Must Have |
| EP-03 | Módulo Conductor | Conductor | Must Have |
| EP-04 | Módulo Usuario (pasajero) | Usuario | Must Have |
| EP-05 | Módulo Cooperativa - Admin | Cooperativa | Must Have |
| EP-06 | Módulo Cooperativa - Monitoreo | Cooperativa | Must Have |
| EP-07 | Módulo Cooperativa - Mantenimiento | Cooperativa | Should Have |
| EP-08 | Módulo Cooperativa - Estadísticas | Cooperativa | Should Have |
| EP-09 | Módulo Superadministrador | Superadmin | Must Have |
| EP-10 | Seguridad y auditoría | Seguridad | Must Have |
| EP-11 | Modo offline y sincronización | Frontend | Should Have |
| EP-12 | Reportes y exportación | Cooperativa | Could Have |
| EP-13 | Notificaciones push | Transversal | Could Have |

---

## 2. Historias de Usuario

### Épica EP-01: Infraestructura Base

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-01 | Configurar proyecto Laravel + PostgreSQL | Configurar Laravel 11, conexión BD, variables de entorno | 1 | - |
| HU-02 | Configurar proyecto React Native (Expo) + TypeScript | Inicializar Expo con TypeScript, estructura de carpetas | 1 | - |
| HU-03 | Configurar migraciones iniciales | Migraciones de tablas: users, roles, permissions, cooperatives | 1 | HU-01 |
| HU-04 | Configurar JWT Middleware | tymon/jwt-auth o Sanctum, login/logout/refresh endpoints | 1 | HU-03 |
| HU-05 | Configurar Multi-tenant Middleware | TenantMiddleware + TenantScoped trait | 1 | HU-04 |
| HU-06 | Configurar seeders | Roles (6), permisos, superadmin por defecto | 1 | HU-03 |
| HU-07 | Configurar CORS, headers de seguridad | Middleware de seguridad, rate limiting | 1 | HU-01 |

### Épica EP-02: Autenticación

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-08 | Pantalla de login | UI login, interceptor Axios, manejo de tokens | 2 | HU-04, HU-02 |
| HU-09 | Recuperación de contraseña | Endpoint recovery + reset, UI de recuperación | 2 | HU-08 |
| HU-10 | Redirección por rol | RootLayout que detecta rol y redirige | 2 | HU-08 |
| HU-11 | Refresh automático de token | Interceptor con refresh + cola de requests | 2 | HU-08 |

### Épica EP-03: Módulo Conductor

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-12 | CRUD de vehículos (backend) | Migración vehicles, API endpoints, permisos | 2 | HU-05 |
| HU-13 | CRUD de conductores (backend) | Migración drivers + vehicle_driver, API | 2 | HU-05 |
| HU-14 | Iniciar jornada (backend) | Migración journeys, POST /journeys, validaciones | 3 | HU-12, HU-13 |
| HU-15 | Finalizar jornada (backend) | PATCH /journeys/active/finish, validación km | 3 | HU-14 |
| HU-16 | Enviar posición GPS (backend) | Migración positions, POST /positions, partición por mes | 3 | HU-14 |
| HU-17 | App Conductor: Iniciar jornada (frontend) | Pantalla start-journey, selección vehículo, km input | 3 | HU-14, HU-08 |
| HU-18 | App Conductor: Jornada activa (frontend) | Pantalla active-journey, temporizador, GPS tracking | 3 | HU-17 |
| HU-19 | App Conductor: Finalizar jornada (frontend) | Pantalla finish-journey, km final, confirmación | 3 | HU-18 |
| HU-20 | Registrar combustible (backend + frontend) | API + formulario fuel | 4 | HU-14 |
| HU-21 | Registrar notas (backend + frontend) | API + formulario notes | 4 | HU-14 |
| HU-22 | Reportar emergencia/avería (backend + frontend) | API + pantalla emergencia + confirmación | 4 | HU-14 |
| HU-23 | Toggle AC/WiFi (backend + frontend) | PATCH vehículo, toggle UI | 4 | HU-14 |
| HU-24 | Historial de jornadas (backend + frontend) | API + lista con filtros | 4 | HU-14 |

### Épica EP-04: Módulo Usuario

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-25 | API líneas + paradas + rutas | Migraciones lines, stops, line_stop, route_segments, endpoints públicos | 3 | HU-05 |
| HU-26 | API búsqueda de destino | SearchService con algoritmo de distancia, PostGIS | 4 | HU-25 |
| HU-27 | API lugares de interés | Migración points_of_interest, CRUD + búsqueda | 4 | HU-05 |
| HU-28 | API posición aproximada de buses | Endpoint con ofuscación GPS | 4 | HU-16, HU-25 |
| HU-29 | App Usuario: Mapa principal (frontend) | MapView con marcadores, posiciones aproximadas de buses | 4 | HU-08, HU-28 |
| HU-30 | App Usuario: Búsqueda de destino (frontend) | SearchBar con resultados, búsqueda por texto | 5 | HU-26, HU-29 |
| HU-31 | App Usuario: Detalle de línea (frontend) | Pantalla con ruta, paradas, buses activos | 5 | HU-25, HU-29 |
| HU-32 | App Usuario: Detalle de bus (frontend) | Pantalla con distancia, tiempo, características, próximas paradas | 5 | HU-28, HU-29 |
| HU-33 | App Usuario: Búsqueda por mapa (frontend) | Seleccionar punto en mapa como destino | 5 | HU-30 |
| HU-34 | App Usuario: Lista de líneas (frontend) | Lista con todas las líneas activas | 5 | HU-25 |
| HU-35 | Ordenar buses por distancia restante | Implementación en backend (SearchService) | 5 | HU-26 |

### Épica EP-05: Módulo Cooperativa - Admin

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-36 | App Cooperativa: Login y navegación (frontend) | Layout con tabs, reutilizar auth | 4 | HU-08 |
| HU-37 | Gestión de vehículos (frontend) | CRUD completo con formularios | 4 | HU-12, HU-36 |
| HU-38 | Gestión de conductores (frontend) | CRUD completo con formularios | 4 | HU-13, HU-36 |
| HU-39 | Gestión de líneas (frontend) | CRUD + editor de ruta con mapa y paradas | 5 | HU-25, HU-36 |
| HU-40 | Gestión de paradas (frontend) | CRUD + selector de coordenadas en mapa | 5 | HU-25, HU-36 |
| HU-41 | Gestión de lugares de interés (frontend) | CRUD + categorías | 5 | HU-27, HU-36 |

### Épica EP-06: Módulo Cooperativa - Monitoreo

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-42 | API monitoreo de unidades | Endpoints con posición exacta, estado, jornada activa | 5 | HU-16 |
| HU-43 | API alertas | CRUD alertas, atender/cerrar | 5 | HU-05 |
| HU-44 | App Cooperativa: Mapa de monitoreo (frontend) | Mapa con posición exacta, colores por estado | 6 | HU-36, HU-42 |
| HU-45 | App Cooperativa: Centro de alertas (frontend) | Lista de alertas, atender/cerrar, filtros | 6 | HU-43, HU-36 |
| HU-46 | App Cooperativa: Detalle de unidad (frontend) | Info en tiempo real, jornada actual, velocidad | 6 | HU-42, HU-36 |

### Épica EP-07: Módulo Cooperativa - Mantenimiento

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-47 | API mantenimiento | CRUD mantenimientos, tipos, alertas de próximo service | 6 | HU-12 |
| HU-48 | App: Lista de mantenimientos (frontend) | Historial por vehículo con filtros | 7 | HU-36, HU-47 |
| HU-49 | App: Registrar mantenimiento (frontend) | Formulario completo con tipo, km, costo | 7 | HU-36, HU-47 |

### Épica EP-08: Módulo Cooperativa - Estadísticas

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-50 | API estadísticas (backend) | Endpoints de km, combustible, costos, incidentes | 7 | HU-14, HU-20, HU-22, HU-47 |
| HU-51 | App: Dashboard estadísticas (frontend) | KPIs, gráficos de barras, selectores de período | 7 | HU-36, HU-50 |
| HU-52 | App: Reportes exportables (frontend) | Botón exportar PDF/CSV | 8 | HU-50 |

### Épica EP-09: Módulo Superadministrador

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-53 | API gestión cooperativas | CRUD cooperativas, asignar gerente | 5 | HU-03 |
| HU-54 | API catálogos globales | CRUD catálogos + items | 5 | HU-03 |
| HU-55 | API configuración global | GET/PUT configuración global | 5 | HU-03 |
| HU-56 | API roles y permisos | GET roles, asignar permisos | 5 | HU-05 |
| HU-57 | App Superadmin: Lista cooperativas (frontend) | CRUD cooperativas, estadísticas rápidas | 6 | HU-53, HU-08 |
| HU-58 | App Superadmin: Detalle cooperativa (frontend) | Editar coop, asignar gerente, ver stats | 6 | HU-57 |
| HU-59 | App Superadmin: Catálogos (frontend) | CRUD catálogos, items, orden | 6 | HU-54, HU-08 |
| HU-60 | App Superadmin: Config global (frontend) | Formulario de configuración | 6 | HU-55, HU-08 |
| HU-61 | App Superadmin: Roles y permisos (frontend) | Selector de rol, switches de permisos | 7 | HU-56, HU-08 |

### Épica EP-10: Seguridad y Auditoría

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-62 | Logs de actividad | Modelo activity_logs, middleware de logging automático | 7 | HU-01 |
| HU-63 | Auditoría de acciones críticas | Modelo audit_trail, registro en acciones críticas | 7 | HU-62 |
| HU-64 | App Superadmin: Logs y auditoría (frontend) | Tabla con filtros, detalle de cambios | 8 | HU-62, HU-63, HU-08 |

### Épica EP-11: Modo Offline

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-65 | Cache offline de catálogos | AsyncStorage + TTL para líneas, paradas | 8 | HU-29 |
| HU-66 | Cola de sincronización conductor | SyncQueue local para posiciones, combustible, notas | 8 | HU-18, HU-20, HU-21 |

### Épica EP-12: Reportes

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-67 | Exportar reporte PDF | Laravel DomPDF o similar, generar PDF | 8 | HU-50 |
| HU-68 | Exportar reporte CSV | Generar CSV desde endpoint | 8 | HU-50 |

### Épica EP-13: Notificaciones Push

| ID | Historia | Técnica | Sprint | Depende |
|----|----------|---------|:------:|:-------:|
| HU-69 | Notificación de alertas | Expo Push Notifications o Firebase Cloud Messaging | 9 | HU-45 |
| HU-70 | Notificación al conductor | Alerta de cooperativa => notificación push al conductor | 9 | HU-69 |

---

## 3. Sprint Planning

### Sprint 1: Fundación
```
Duración: 2 semanas
Objetivo: Infraestructura base funcionando
HU: HU-01, HU-02, HU-03, HU-04, HU-05, HU-06, HU-07
Entregable: Proyecto Laravel + Expo iniciados, BD migrada, JWT funcionando, login endpoint
```

### Sprint 2: Autenticación + Base Cooperativa
```
Duración: 2 semanas
Objetivo: Login completo + CRUD base de cooperativa
HU: HU-08, HU-09, HU-10, HU-11, HU-12, HU-13
Entregable: App con login funcional, redirección por rol, CRUD vehículos y conductores
```

### Sprint 3: Conductor Base + Líneas
```
Duración: 2 semanas
Objetivo: Jornada de conductor + catálogo de líneas
HU: HU-14, HU-15, HU-16, HU-17, HU-18, HU-19, HU-25
Entregable: App conductor inicia/finaliza jornada, envía GPS. API líneas y paradas.
```

### Sprint 4: Conductor Completo + Búsqueda
```
Duración: 2 semanas
Objetivo: Funcionalidades completas de conductor + API búsqueda
HU: HU-20, HU-21, HU-22, HU-23, HU-24, HU-26, HU-27, HU-28, HU-29
Entregable: App conductor completa. Mapa público con buses.
```

### Sprint 5: Usuario + Cooperativa Admin
```
Duración: 2 semanas
Objetivo: App usuario completa + admin cooperativa
HU: HU-30, HU-31, HU-32, HU-33, HU-34, HU-35, HU-39, HU-40, HU-41
HU-53, HU-54, HU-55, HU-56
Entregable: App usuario funcional (búsqueda, detalle). Admin coop gestiona líneas/paradas.
```

### Sprint 6: Monitoreo + Superadmin
```
Duración: 2 semanas
Objetivo: Monitoreo en tiempo real + superadmin
HU: HU-42, HU-43, HU-44, HU-45, HU-46, HU-47
HU-57, HU-58, HU-59, HU-60
Entregable: Mapa de monitoreo, centro de alertas, panel superadmin.
```

### Sprint 7: Mantenimiento + Estadísticas + Roles
```
Duración: 2 semanas
Objetivo: Mantenimiento, estadísticas, roles y permisos
HU: HU-48, HU-49, HU-50, HU-51, HU-61, HU-62, HU-63
Entregable: Módulo mantenimiento, dashboard estadísticas, editor de roles.
```

### Sprint 8: Reportes + Offline + Auditoría
```
Duración: 2 semanas
Objetivo: Reportes exportables, modo offline, auditoría
HU: HU-52, HU-64, HU-65, HU-66, HU-67, HU-68
Entregable: Reportes PDF/CSV, caché offline, vista de logs/auditoría.
```

### Sprint 9: Notificaciones + Pulido
```
Duración: 2 semanas
Objetivo: Notificaciones push, QA, bug fixing
HU: HU-69, HU-70 + bug fixes + polish
Entregable: App completa con notificaciones, pruebas finales.
```

---

## 4. Diagrama de Dependencias entre Módulos

```
Sprint 1: Fundación
  ├── HU-01: Laravel
  ├── HU-02: Expo
  ├── HU-03: Migraciones
  ├── HU-04: JWT
  ├── HU-05: Multitenant
  ├── HU-06: Seeders
  └── HU-07: Seguridad headers
       │
Sprint 2: Auth + Base Coop
  ├── HU-08: Login UI ────────── depende de HU-04
  ├── HU-10: Redirección rol ─── depende de HU-08
  ├── HU-12: CRUD vehículos ─── depende de HU-05
  └── HU-13: CRUD conductores ── depende de HU-05
       │
Sprint 3: Conductor + Líneas
  ├── HU-14: Iniciar jornada ─── depende de HU-12, HU-13
  ├── HU-16: Posiciones GPS ──── depende de HU-14
  ├── HU-17: Jornada UI ──────── depende de HU-14, HU-08
  ├── HU-25: Líneas/paradas ──── depende de HU-05
  │
Sprint 4: Conductor completo
  ├── HU-22: Emergencias ──────── depende de HU-14
  ├── HU-26: Búsqueda ────────── depende de HU-25
  ├── HU-28: Posición aprox ──── depende de HU-16
  └── HU-29: Mapa público ────── depende de HU-28, HU-08
       │
Sprint 5: Usuario + Admin
  ├── HU-30: Búsqueda UI ─────── depende de HU-26, HU-29
  ├── HU-39: Editor rutas ────── depende de HU-25, HU-36
  ├── HU-53: CRUD coop ──────── depende de HU-03
  └── HU-56: Roles/permisos ──── depende de HU-05
       │
Sprint 6: Monitoreo + Superadmin
  ├── HU-42: Monitoreo API ───── depende de HU-16
  ├── HU-44: Mapa monitoreo ──── depende de HU-42, HU-36
  └── HU-57: Superadmin UI ───── depende de HU-53, HU-08
       │
Sprint 7: Mantenimiento + Stats
  ├── HU-47: Mantenimiento API ── depende de HU-12
  ├── HU-50: Stats API ────────── depende de HU-14, HU-20, HU-47
  ├── HU-61: Roles UI ────────── depende de HU-56, HU-08
  └── HU-62: Activity logs ────── depende de HU-01
       │
Sprint 8: Reportes + Offline
  ├── HU-52: Exportar ────────── depende de HU-50
  ├── HU-65: Caché offline ────── depende de HU-29
  └── HU-67: PDF report ──────── depende de HU-50
       │
Sprint 9: Notificaciones + QA
  ├── HU-69: Push notifications ─ depende de HU-45
  └── Tests + bug fixes
```

---

## 5. Criterios de "Done" (Definition of Done)

Cada historia de usuario debe cumplir:

- [ ] Backend: API endpoint funcionando con validación, autorización y tests
- [ ] Frontend: Pantalla o componente funcionando con estados (loading, error, empty, success)
- [ ] Base de datos: Migración ejecutada y seeders si aplica
- [ ] Documentación: Endpoint documentado en docs/05_API.md si aplica
- [ ] Pruebas: Tests unitarios de la funcionalidad
- [ ] Sin errores de compilación/typescript/lint
- [ ] Code review realizado
- [ ] Merge a rama principal
