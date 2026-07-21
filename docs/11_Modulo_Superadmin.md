# Manta en Ruta - Módulo Superadministrador

## FASE 11: Diseño Completo del Superadministrador

---

## 1. Funcionalidades

| # | Función | Descripción | Prioridad |
|---|---------|-------------|-----------|
| 1 | Gestión de cooperativas | CRUD completo de cooperativas en la plataforma | Must Have |
| 2 | Asignar gerentes | Asignar/remover gerentes a cada cooperativa | Must Have |
| 3 | Configuración global | Parámetros globales del sistema | Must Have |
| 4 | Catálogos globales | Administrar catálogos y sus items | Must Have |
| 5 | Estadísticas generales | KPIs de toda la plataforma | Should Have |
| 6 | Logs de actividad | Registro de acciones del sistema | Should Have |
| 7 | Auditoría | Acciones críticas con detalle | Must Have |
| 8 | Roles y permisos | Gestionar roles y asignar permisos | Must Have |
| 9 | Usuarios globales | Crear y gestionar superadmins | Must Have |

---

## 2. Estructura de Navegación

```
(superadmin)/(tabs)/
│
├── cooperatives.tsx         # Lista de cooperativas
│   ├── new.tsx              # Nueva cooperativa
│   ├── [id].tsx             # Detalle/edición cooperativa
│   └── [id]/assign-gerente  # Asignar gerente
│
├── global-config.tsx        # Configuración global
│
├── catalogs.tsx             # Catálogos globales
│   ├── [id]/items           # Items de un catálogo
│   └── [id]/items/new       # Nuevo item
│
├── users.tsx                # Usuarios globales (superadmins)
│   ├── new.tsx              # Nuevo superadmin
│   └── [id].tsx             # Detalle/edición
│
├── roles.tsx                # Roles y permisos
│   └── [id].tsx             # Editar permisos de un rol
│
├── logs.tsx                 # Logs de actividad
│
└── statistics.tsx           # Estadísticas globales
```

---

## 3. Pantallas

### 3.1 Lista de Cooperativas (cooperatives.tsx)

```
┌──────────────────────────────┐
│  ← Cooperativas         [+]
├──────────────────────────────┤
│  🔍 Buscar cooperativa...    │
│                              │
│  ┌──────────────────────┐   │
│  │ 🏢 Cooperativa      │   │  ← Card con info de la coop
│  │    Transporte Urbano │   │
│  │    Manta             │   │
│  │ 📍 Manta, Manabí     │   │
│  │ 🟢 Activa            │   │
│  │ 🚌 25 vehículos      │   │
│  │ 👤 Gerente: Juan P.  │   │
│  ├──────────────────────┤   │
│  │ 🏢 Cooperativa      │   │
│  │    de Transporte     │   │
│  │    "Tarqui"          │   │
│  │ 🔴 Inactiva          │   │
│  │ 🚌 12 vehículos      │   │
│  │ 👤 Gerente: Sin asignar│  │  ← Badge alerta
│  └──────────────────────┘   │
│                              │
│  📊 Total: 5 cooperativas   │
│  Activas: 4 │ Inactivas: 1  │
└──────────────────────────────┘
```

### 3.2 Detalle de Cooperativa (cooperative/[id].tsx)

```
┌──────────────────────────────┐
│  ← Cooperativa Transporte ⋮
├──────────────────────────────┤
│  Información General:        │
│  ┌──────────────────────┐   │
│  │ Nombre: Cooperativa  │   │  ← Campos editables
│  │ RUC: 1791234567001   │   │
│  │ Teléfono: 052620000  │   │
│  │ Email: coop@email.com│   │
│  │ Dirección: Av. Malecón│   │
│  │ Alcance: Urbano      │   │  [Urbano ▼]
│  │ Estado: 🟢 Activo    │   │
│  └──────────────────────┘   │
│                              │
│  👤 Gerente asignado:        │
│  ┌──────────────────────┐   │
│  │ Juan Pérez           │   │
│  │ juan@coop.com        │   │
│  │ [Cambiar gerente]    │   │
│  └──────────────────────┘   │
│                              │
│  📊 Estadísticas rápidas:    │
│  ┌──────┬──────┬──────┐    │
│  │ 25   │ 12    │ 8     │    │
│  │ Veh. │ Cond. │ Lín. │    │
│  └──────┴──────┴──────┘    │
│                              │
│  ⚙️ Configuración propia:    │
│  ┌──────────────────────┐   │
│  │ Parámetros JSON      │   │
│  │ { "max_speed": 60 }  │   │
│  └──────────────────────┘   │
│                              │
│  🗑️ [Desactivar Cooperativa] │
└──────────────────────────────┘
```

### 3.3 Configuración Global (global-config.tsx)

```
┌──────────────────────────────┐
│  ← Configuración Global      │
├──────────────────────────────┤
│                              │
│  ⏱ GPS:                      │
│  ┌──────────────────────┐   │
│  │ Intervalo envío: 10s  │   │  ← Número
│  │ Tiempo retención: 90d│   │  ← Número (días)
│  └──────────────────────┘   │
│                              │
│  🔐 Seguridad:               │
│  ┌──────────────────────┐   │
│  │ Access token TTL:    │   │
│  │ 15 minutos           │   │
│  │ Refresh token TTL:   │   │
│  │ 7 días               │   │
│  │ Max intentos fallidos│   │
│  │ 5                    │   │
│  │ Bloqueo temporal:    │   │
│  │ 30 minutos           │   │
│  └──────────────────────┘   │
│                              │
│  📱 App:                     │
│  ┌──────────────────────┐   │
│  │ Versión mínima: 1.0.0│   │
│  │ URL Play Store: ...  │   │
│  │ URL App Store: ...   │   │
│  └──────────────────────┘   │
│                              │
│  🌐 API:                     │
│  ┌──────────────────────┐   │
│  │ Rate limit default:  │   │
│  │ 60 req/min           │   │
│  │ Rate limit auth:     │   │
│  │ 5 req/min            │   │
│  └──────────────────────┘   │
│                              │
│  [💾 Guardar Configuración] │
└──────────────────────────────┘
```

### 3.4 Catálogos Globales (catalogs.tsx)

```
┌──────────────────────────────┐
│  ← Catálogos Globales   [+] │
├──────────────────────────────┤
│                              │
│  ┌──────────────────────┐   │
│  │ 📋 Tipos de vehículo  │   │  ← Card de catálogo
│  │ 🏷️ 4 items           │   │
│  │ [Ver items →]         │   │
│  ├──────────────────────┤   │
│  │ 📋 Tipos de combus.  │   │
│  │ 🏷️ 3 items           │   │
│  │ [Ver items →]         │   │
│  ├──────────────────────┤   │
│  │ 📋 Tipos de alerta   │   │
│  │ 🏷️ 5 items           │   │
│  │ [Ver items →]         │   │
│  ├──────────────────────┤   │
│  │ 📋 Tipos de emerg.   │   │
│  │ 🏷️ 5 items           │   │
│  │ [Ver items →]         │   │
│  └──────────────────────┘   │
└──────────────────────────────┘

-- Al hacer clic en "Ver items" --

┌──────────────────────────────┐
│  ← Tipos de Vehículo    [+] │
├──────────────────────────────┤
│                              │
│  ┌──────────────────────┐   │
│  │ 🏷️ Bus (Bus)        │   │  ← Item del catálogo
│  │ Orden: 1             │   │  (con código y valor)
│  │ 🟢 Activo            │   │
│  ├──────────────────────┤   │
│  │ 🏷️ Minibus (Minibus)│   │
│  │ Orden: 2             │   │
│  │ 🟢 Activo            │   │
│  ├──────────────────────┤   │
│  │ 🏷️ Van (Van)        │   │
│  │ Orden: 3             │   │
│  │ 🔴 Inactivo          │   │
│  └──────────────────────┘   │
└──────────────────────────────┘
```

### 3.5 Roles y Permisos (roles.tsx)

```
┌──────────────────────────────┐
│  ← Roles y Permisos          │
├──────────────────────────────┤
│                              │
│  Selecciona un rol:          │
│  ┌──────────────────────┐   │
│  │ [Admin de Cooperativa]▼│  │  ← Dropdown
│  └──────────────────────┘   │
│                              │
│  Permisos:                   │
│                              │
│  📁 Módulo Vehículos         │
│  ┌──────────────────────┐   │
│  │ ✓ vehicles.view      │   │
│  │ ✓ vehicles.create    │   │  ← Switches por permiso
│  │ ✓ vehicles.update    │   │
│  │ ✗ vehicles.delete    │   │
│  └──────────────────────┘   │
│                              │
│  📁 Módulo Conductores       │
│  ┌──────────────────────┐   │
│  │ ✓ drivers.view       │   │
│  │ ✓ drivers.create     │   │
│  │ ✗ drivers.delete     │   │
│  └──────────────────────┘   │
│                              │
│  📁 Módulo Monitoreo         │
│  ┌──────────────────────┐   │
│  │ ✓ monitoring.view    │   │
│  │ ✓ alerts.manage      │   │
│  └──────────────────────┘   │
│                              │
│  [💾 Guardar Permisos]      │
└──────────────────────────────┘
```

### 3.6 Logs de Actividad (logs.tsx)

```
┌──────────────────────────────┐
│  ← Logs de Actividad         │
├──────────────────────────────┤
│  Filtros:                    │
│  ┌──────┐ ┌──────┐ ┌────┐  │
│  │Fecha │ │Usuario│ │Acc.│  │  ← Filtros
│  └──────┘ └──────┘ └────┘  │
│                              │
│  ┌──────────────────────┐   │
│  │ 14/07 10:30          │   │
│  │ admin@mantaruta.com  │   │
│  │ 🏢 Cooperativa       │   │
│  │ ✏️ Editó vehículo    │   │
│  │ MNT-1234             │   │
│  ├──────────────────────┤   │
│  │ 14/07 09:15          │   │
│  │ super@mantaruta.com  │   │
│  │ 👤 Creó cooperativa  │   │
│  │ "Cooperativa Manta"  │   │
│  ├──────────────────────┤   │
│  │ 14/07 08:00          │   │
│  │ conductor@coop.com   │   │
│  │ 🚌 Inició jornada    │   │
│  │ MNT-5678             │   │
│  └──────────────────────┘   │
│                              │
│  Cargando más...             │
└──────────────────────────────┘

-- Auditoría (acciones críticas) --

┌──────────────────────────────┐
│  ← Auditoría                 │
├──────────────────────────────┤
│  Acciones críticas:          │
│                              │
│  ⚠️ 14/07 11:00              │
│  Superadmin: desactivó       │
│  cooperativa "Tarqui"        │
│  IP: 190.15.XX.XX            │
│                              │
│  ⚠️ 13/07 15:30              │
│  Superadmin: eliminó         │
│  usuario admin@coop.com      │
│  IP: 190.15.XX.YY            │
│                              │
│  ⚠️ 12/07 08:00              │
│  Admin: cambió gerente       │
│  de cooperativa "Manta"      │
└──────────────────────────────┘
```

---

## 4. API Calls (Superadmin)

```typescript
// Cooperativas
GET    /superadmin/cooperatives?q=&scope=&is_active=
POST   /superadmin/cooperatives
GET    /superadmin/cooperatives/{id}
PUT    /superadmin/cooperatives/{id}
DELETE /superadmin/cooperatives/{id}
POST   /superadmin/cooperatives/{id}/assign-gerente

// Configuración global
GET  /superadmin/global-config
PUT  /superadmin/global-config

// Catálogos
GET    /superadmin/catalogs
POST   /superadmin/catalogs
PUT    /superadmin/catalogs/{id}
DELETE /superadmin/catalogs/{id}
GET    /superadmin/catalogs/{id}/items
POST   /superadmin/catalogs/{id}/items
PUT    /superadmin/catalogs/{id}/items/{itemId}
DELETE /superadmin/catalogs/{id}/items/{itemId}

// Roles y permisos
GET  /superadmin/roles
GET  /superadmin/roles/{id}/permissions
PUT  /superadmin/roles/{id}/permissions

// Usuarios globales
GET    /superadmin/users?q=
POST   /superadmin/users
PUT    /superadmin/users/{id}
DELETE /superadmin/users/{id}

// Logs y auditoría
GET /superadmin/logs?from=&to=&user_id=&action=
GET /superadmin/audit?from=&to=&severity=

// Estadísticas globales
GET /superadmin/statistics/global
GET /superadmin/statistics/cooperatives
GET /superadmin/statistics/users
GET /superadmin/statistics/journeys
```

---

## 5. Componentes Específicos

| Componente | Props | Descripción |
|------------|-------|-------------|
| `CooperativeCard` | cooperative, onPress | Card de cooperativa en lista |
| `CooperativeForm` | onSubmit, initialData | Formulario completo de cooperativa |
| `GerenteAssigner` | cooperativeId, currentGerente, onAssign | Selector/asignador de gerente |
| `GlobalConfigForm` | config, onSave | Formulario de configuración global |
| `CatalogList` | catalogs, onSelect | Lista de catálogos globales |
| `CatalogItemForm` | catalogId, onSubmit | Formulario de item de catálogo |
| `RoleSelector` | roles, selectedRole, onSelect | Dropdown de selección de rol |
| `PermissionSwitch` | permission, checked, onChange | Switch individual de permiso |
| `PermissionGroup` | moduleName, permissions, onToggle | Grupo de permisos por módulo |
| `LogEntry` | log, type | Item individual de log |
| `AuditEntry` | audit, severity | Item individual de auditoría |
| `GlobalStatsKpi` | label, value, change, period | KPI de estadísticas globales |
| `FilterBar` | filters, onFilter | Barra de filtros (fecha, usuario, acción) |

---

## 6. Reglas de Negocio del Superadmin

| ID | Regla |
|----|-------|
| SA-01 | Solo un superadmin puede crear/modificar/desactivar cooperativas |
| SA-02 | Un superadmin puede acceder a datos de cualquier cooperativa (cross-tenant) |
| SA-03 | Las acciones críticas (crear/desactivar cooperativa, eliminar usuario) se registran en auditoría con IP y timestamp |
| SA-04 | Un superadmin no puede tener rol dentro de una cooperativa (es externo) |
| SA-05 | Los catálogos globales afectan a todas las cooperativas |
| SA-06 | No se puede eliminar una cooperativa con jornadas activas (solo desactivar) |
| SA-07 | La configuración global se aplica a nuevas cooperativas por defecto |
| SA-08 | Los logs se retienen por 90 días; auditoría por 1 año |
