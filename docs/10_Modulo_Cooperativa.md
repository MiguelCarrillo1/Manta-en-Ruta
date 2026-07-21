# Manta en Ruta - Módulo Cooperativa

## FASE 10: Diseño Completo del Módulo Cooperativa

---

## 1. Submódulos

| # | Submódulo | Funciones Clave | Roles |
|---|-----------|-----------------|-------|
| 1 | Administrativo - Vehículos | CRUD vehículos, asignación conductores | Gerente, Admin |
| 2 | Administrativo - Conductores | CRUD conductores, licencias | Gerente, Admin |
| 3 | Administrativo - Rutas | CRUD líneas, asignación paradas, orden | Gerente, Admin |
| 4 | Administrativo - Paradas | CRUD paradas, coordenadas | Gerente, Admin |
| 5 | Gestión Operativa | Monitoreo mapa, jornadas activas, alertas | Gerente, Admin, Operador |
| 6 | Mantenimiento | Registro y control de mantenimientos | Gerente, Admin |
| 7 | Estadísticas | KPIs, km, combustible, costos | Gerente, Admin |
| 8 | Reportes | Exportación de datos | Gerente, Admin |
| 9 | Administración | Usuarios internos, roles, configuración | Gerente |

---

## 2. Estructura de Navegación

```
(cooperative)/(tabs)/
│
├── monitoring.tsx          # Dashboard principal con mapa
│   └── vehicle-detail.tsx  # Detalle rápido de unidad (modal/sheet)
│
├── management.tsx          # Submenú de gestión
│   ├── vehicles.tsx        # Lista de vehículos
│   │   ├── new.tsx         # Nuevo vehículo
│   │   └── [id].tsx        # Detalle/edición vehículo
│   ├── drivers.tsx         # Lista de conductores
│   │   ├── new.tsx         # Nuevo conductor
│   │   └── [id].tsx        # Detalle/edición conductor
│   ├── lines.tsx           # Lista de líneas
│   │   ├── new.tsx         # Nueva línea
│   │   └── [id].tsx        # Detalle/edición línea + paradas
│   ├── stops.tsx           # Lista de paradas
│   │   ├── new.tsx         # Nueva parada (con mapa)
│   │   └── [id].tsx        # Detalle/edición parada
│   └── maintenance.tsx     # Módulo mantenimiento
│       ├── list.tsx        # Historial
│       ├── new.tsx         # Nuevo mantenimiento
│       └── [id].tsx        # Detalle mantenimiento
│
├── alerts.tsx              # Centro de alertas
│   └── [id].tsx            # Detalle alerta
│
└── statistics.tsx          # Estadísticas y reportes
    ├── kilometers.tsx      # Km por período
    ├── fuel.tsx            # Consumo combustible
    ├── maintenance.tsx     # Costos mantenimiento
    ├── incidents.tsx       # Incidentes
    └── reports.tsx         # Generar/exportar reportes
```

---

## 3. Pantallas Clave

### 3.1 Monitoreo / Dashboard (monitoring.tsx)

```
┌──────────────────────────────┐
│  Monitoreo en Vivo       🔔  │  ← 3 alertas activas (badge)
├──────────────────────────────┤
│                              │
│  ┌────────────────────────┐  │
│  │     Mapa de unidades   │  │  ← Todos los buses activos
│  │                        │  │  (posición EXACTA)
│  │  🟢 🟡 🔴 🟢 🟢       │  │  ← Colores según estado
│  │       🟢               │  │
│  │  🟡       🟢           │  │
│  └────────────────────────┘  │
│                              │
│  📊 Resumen rápido:          │
│  ┌──────┬──────┬──────┐    │
│  │🟢 12  │🟡 2   │🔴 1  │    │  ← Activos / Avería / Emerg
│  └──────┴──────┴──────┘    │
│                              │
│  🚌 Unidades activas (12):   │
│  ┌──────────────────────┐   │  ← Lista scrolleable
│  │ 🟢 MNT-1234 │ Pedro  │   │     (pull-to-refresh)
│  │   35 km/h │ Línea 8   │   │
│  ├──────────────────────┤   │
│  │ 🟢 MNT-5678 │ José   │   │
│  │   0 km/h │ Línea 12   │   │  ← 0 km/h = detenido en parada
│  └──────────────────────┘   │
└──────────────────────────────┘
```

### 3.2 Lista de Vehículos (management/vehicles.tsx)

```
┌──────────────────────────────┐
│  ← Vehículos           [+]
├──────────────────────────────┤
│  🔍 Buscar vehículo...       │
│                              │
│  ┌──────────────────────┐   │
│  │ 🟢 MNT-1234          │   │  ← Estado con color
│  │ Chevrolet 2018       │   │
│  │ Conductor: Pedro     │   │
│  │ 📏 125,430 km        │   │
│  ├──────────────────────┤   │
│  │ 🟡 MNT-5678          │   │
│  │ Hyundai 2020         │   │
│  │ En mantenimiento     │   │
│  │ Último service: 80k  │   │
│  ├──────────────────────┤   │
│  │ 🔴 MNT-9012          │   │  ← Averiado
│  │ Kia 2019             │   │
│  │ Sin conductor        │   │
│  └──────────────────────┘   │
│                              │
│  Filtros: [Todos] [Activos]  │
│  [En ruta] [Mantenimiento]   │
└──────────────────────────────┘
```

### 3.3 Detalle / Edición de Vehículo (management/vehicle/[id].tsx)

```
┌──────────────────────────────┐
│  ← MNT-1234            ⋮    │
├──────────────────────────────┤
│  📷 [Foto del vehículo]      │
│                              │
│  Información General:        │
│  ┌──────────────────────┐   │
│  │ Placa: MNT-1234      │   │  ← Campos editables
│  │ Marca: Chevrolet     │   │
│  │ Modelo: NHR          │   │
│  │ Año: 2018            │   │
│  │ Color: Blanco        │   │
│  │ Capacidad: 30 pasaj. │   │
│  └──────────────────────┘   │
│                              │
│  Características:            │
│  [✓] Aire acondicionado      │  ← Switches
│  [✓] WiFi                    │
│                              │
│  Conductor asignado:         │
│  ┌──────────────────────┐   │
│  │ Pedro López          │   │
│  │ [Cambiar conductor]  │   │
│  └──────────────────────┘   │
│                              │
│  📊 Última jornada:          │
│  Hoy │ 85 km │ 3:20 hrs      │
│                              │
│  Historial rápido:           │
│  ▸ Último mantenimiento:     │
│    10/07/2026 - 300 km       │
│  ▸ Próximo mantenimiento:    │
│    en 500 km                 │
│                              │
│  [💾 Guardar Cambios]        │
└──────────────────────────────┘
```

### 3.4 Centro de Alertas (alerts.tsx)

```
┌──────────────────────────────┐
│  ← Alertas              🔔  │
├──────────────────────────────┤
│                              │
│  Filtros:                    │
│  [Todas] [Críticas] [Abiertas]│
│                              │
│  ┌──────────────────────┐   │
│  │ 🔴 MNT-9012          │   │  ← Alerta crítica
│  │ 🚨 EMERGENCIA: Asalto│   │
│  │ 📍 Av. 24 de Mayo    │   │
│  │ 🕐 10:35             │   │
│  │ [Atender]            │   │
│  ├──────────────────────┤   │
│  │ 🟡 MNT-5678          │   │  ← Alerta warning
│  │ 🔧 Avería: Motor     │   │
│  │ 📍 Terminal          │   │
│  │ 🕐 09:15             │   │
│  │ [Atender]            │   │
│  ├──────────────────────┤   │
│  │ 🔵 Línea 8           │   │  ← Alerta informativa
│  │ 📋 Nota: Tráfico     │   │
│  │ 🕐 08:30             │   │
│  │ ✓ Atendida           │   │
│  └──────────────────────┘   │
└──────────────────────────────┘
```

### 3.5 Mapa de Línea con Editor (management/lines/[id].tsx)

```
┌──────────────────────────────┐
│  ← Línea 8 - Editar          │
├──────────────────────────────┤
│                              │
│  Nombre:                     │
│  ┌──────────────────────┐   │
│  │ Línea 8              │   │
│  └──────────────────────┘   │
│  Código:                     │
│  ┌──────────────────────┐   │
│  │ L8                   │   │
│  └──────────────────────┘   │
│                              │
│  ┌────────────────────────┐  │
│  │  Mapa con ruta         │  │  ← Ruta dibujada con
│  │  ●──●──●──●──●──●     │  │     paradas numeradas
│  │  1  2  3  4  5  6      │  │
│  └────────────────────────┘  │
│                              │
│  🚏 Paradas (ordenadas):     │
│  ┌──────────────────────┐   │
│  │ ⠿ 1. Terminal       │   │  ← Drag handle para reordenar
│  │ ⠿ 2. Av. 24 de Mayo │   │
│  │ ⠿ 3. Mercado Central │   │
│  │ ⠿ 4. Colegio Manta  │   │
│  │ [+ Agregar parada]   │   │
│  └──────────────────────┘   │
│                              │
│  [💾 Guardar Cambios]        │
└──────────────────────────────┘
```

### 3.6 Mantenimiento (management/maintenance/list.tsx)

```
┌──────────────────────────────┐
│  ← Mantenimiento        [+] │
├──────────────────────────────┤
│  🚌 Vehículo: [MNT-1234  ▼] │  ← Dropdown selector
│                              │
│  📊 Resumen del vehículo:    │
│  Último cambio aceite:       │
│  Hace 2,500 km (10/06/2026)  │
│  ⚠️ Próximo en 2,500 km      │
│                              │
│  Historial:                  │
│  ┌──────────────────────┐   │
│  │ 05/07 Aceite    $120 │   │
│  │ 20/06 Filtros   $45  │   │
│  │ 10/06 Neumáticos$600 │   │
│  │ 15/05 Reparac. $250 │   │
│  └──────────────────────┘   │
│                              │
│  Total invertido: $1,015     │
│                              │
│  Filtros:                    │
│  [Todos] [Aceite] [Filtros]  │
│  [Neumáticos] [Reparación]   │
└──────────────────────────────┘
```

### 3.7 Nuevo Mantenimiento (management/maintenance/new.tsx)

```
┌──────────────────────────────┐
│  ← Nuevo Mantenimiento       │
├──────────────────────────────┤
│  🚌 Vehículo: [MNT-1234  ▼]  │
│                              │
│  Tipo de mantenimiento:      │
│  ┌──────────────────────┐   │
│  │ ○ Cambio de aceite   │   │
│  │ ● Cambio de filtros  │   │  ← Radio buttons
│  │ ○ Neumáticos         │   │
│  │ ○ Reparación general │   │
│  └──────────────────────┘   │
│                              │
│  Descripción:                │
│  ┌──────────────────────┐   │
│  │ Filtro de aceite y   │   │
│  │ filtro de aire       │   │
│  └──────────────────────┘   │
│                              │
│  📏 Kilometraje actual:      │
│  ┌──────────────────────┐   │
│  │ 125,800              │   │
│  └──────────────────────┘   │
│                              │
│  💰 Costo ($):               │
│  ┌──────────────────────┐   │
│  │ 45.00                │   │
│  └──────────────────────┘   │
│                              │
│  🔧 Proveedor:               │
│  ┌──────────────────────┐   │
│  │ Taller "El Motor"    │   │
│  └──────────────────────┘   │
│                              │
│  📅 Fecha: 14/07/2026       │
│                              │
│  Próximo mantenimiento (km): │
│  ┌──────────────────────┐   │
│  │ 130,000              │   │  ← Sugerido automáticamente
│  └──────────────────────┘   │
│                              │
│  [💾 Registrar Mantenimiento]│
└──────────────────────────────┘
```

---

## 4. Dashboard de Estadísticas

```
┌──────────────────────────────┐
│  ← Estadísticas         📊  │
├──────────────────────────────┤
│  Período: [Julio 2026    ▼]  │
│                              │
│  ┌──────┬──────┬──────┐    │
│  │ 8,450 │ 1,230  │ $2,450│  │  ← KPIs principales
│  │ Km    │ Litros │ Costo │  │
│  └──────┴──────┴──────┘    │
│                              │
│  📈 Kilómetros por vehículo: │
│  ┌──────────────────────┐   │
│  │ ████████ MNT-1234    │   │  ← Barras horizontales
│  │ ██████   MNT-5678    │   │
│  │ ████     MNT-9012    │   │
│  └──────────────────────┘   │
│                              │
│  💰 Costos de mantenimiento: │
│  ┌────────────────────────┐  │
│  │ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │  │  ← Gráfico de barras simple
│  │ │  │ │  │ │  │ │  │  │  │
│  │ │  │ │  │ │  │ │  │  │  │
│  │ │  │ │  │ │  │ │  │  │  │
│  │ │  │ │  │ │  │ │  │  │  │  │
│  │ │  │ │  │ │  │ │  │  │  │  │
│  │ └──┘ └──┘ └──┘ └──┘  │  │
│  │ Ene Feb Mar Abr       │  │
│  └────────────────────────┘  │
│                              │
│  [📄 Exportar Reporte]      │
└──────────────────────────────┘
```

---

## 5. Tabla de Permisos por Submódulo

| Submódulo | Acción | Gerente | Admin | Operador |
|-----------|--------|:-------:|:-----:|:--------:|
| Vehículos | Ver lista | ✓ | ✓ | ✓ |
| Vehículos | Crear | ✓ | ✓ | ✗ |
| Vehículos | Editar | ✓ | ✓ | ✗ |
| Vehículos | Desactivar | ✓ | ✓ | ✗ |
| Vehículos | Asignar conductor | ✓ | ✓ | ✗ |
| Conductores | Ver lista | ✓ | ✓ | ✓ |
| Conductores | Crear/Editar | ✓ | ✓ | ✗ |
| Conductores | Desactivar | ✓ | ✓ | ✗ |
| Líneas | Ver lista | ✓ | ✓ | ✓ |
| Líneas | Crear/Editar | ✓ | ✓ | ✗ |
| Líneas | Asignar paradas | ✓ | ✓ | ✗ |
| Paradas | CRUD | ✓ | ✓ | ✗ |
| Monitoreo | Ver mapa | ✓ | ✓ | ✓ |
| Monitoreo | Ver detalle unidad | ✓ | ✓ | ✓ |
| Alertas | Ver | ✓ | ✓ | ✓ |
| Alertas | Atender/Cerrar | ✓ | ✓ | ✓ |
| Alertas | Escalar | ✓ | ✗ | ✗ |
| Mantenimiento | Crear | ✓ | ✓ | ✗ |
| Mantenimiento | Ver historial | ✓ | ✓ | ✓ |
| Estadísticas | Ver dashboard | ✓ | ✓ | ✗ |
| Estadísticas | Exportar | ✓ | ✓ | ✗ |
| Usuarios | Gestionar admins | ✓ | ✗ | ✗ |
| Usuarios | Gestionar operadores | ✓ | ✗ | ✗ |
| Configuración | Editar | ✓ | ✗ | ✗ |

---

## 6. API Calls (Cooperativa)

```typescript
// Monitoreo
GET  /cooperative/monitoring/vehicles
GET  /cooperative/monitoring/vehicles/{id}
GET  /cooperative/monitoring/journeys/active

// Alertas
GET    /cooperative/alerts?status=&severity=
PATCH  /cooperative/alerts/{id}   // Atender/cerrar
GET    /cooperative/emergencies
PATCH  /cooperative/emergencies/{id}

// Vehículos
GET    /cooperative/vehicles?status=&q=
POST   /cooperative/vehicles
GET    /cooperative/vehicles/{id}
PUT    /cooperative/vehicles/{id}
DELETE /cooperative/vehicles/{id}

// Conductores
GET    /cooperative/drivers?q=&is_active=
POST   /cooperative/drivers
GET    /cooperative/drivers/{id}
PUT    /cooperative/drivers/{id}
DELETE /cooperative/drivers/{id}

// Líneas
GET    /cooperative/lines
POST   /cooperative/lines
GET    /cooperative/lines/{id}?include=stops,route
PUT    /cooperative/lines/{id}
DELETE /cooperative/lines/{id}
POST   /cooperative/lines/{id}/stops  // Asignar paradas con orden

// Paradas
GET    /cooperative/stops?q=
POST   /cooperative/stops
GET    /cooperative/stops/{id}
PUT    /cooperative/stops/{id}
DELETE /cooperative/stops/{id}

// Mantenimiento
GET    /cooperative/maintenance?vehicle_id=&type_id=
POST   /cooperative/maintenance
GET    /cooperative/maintenance/{id}
GET    /cooperative/maintenance/types
GET    /cooperative/maintenance/upcoming

// Estadísticas
GET /cooperative/statistics/dashboard?from=&to=
GET /cooperative/statistics/kilometers?from=&to=
GET /cooperative/statistics/fuel?from=&to=
GET /cooperative/statistics/maintenance?from=&to=
GET /cooperative/statistics/incidents?from=&to=
GET /cooperative/statistics/journeys?from=&to=

// Reportes
GET /cooperative/reports?type=km&from=&to=&format=pdf

// Administración
GET    /cooperative/users
POST   /cooperative/users
PUT    /cooperative/users/{id}
DELETE /cooperative/users/{id}
GET    /cooperative/config
PUT    /cooperative/config
```

---

## 7. Componentes Específicos

| Componente | Props | Descripción |
|------------|-------|-------------|
| `MonitoringMap` | vehicles, onVehicleSelect, alerts | Mapa con unidades exactas y colores de estado |
| `VehicleCard` | vehicle, onPress | Card de vehículo en lista |
| `VehicleForm` | onSubmit, initialData | Formulario de vehículo |
| `DriverCard` | driver, onPress | Card de conductor |
| `DriverForm` | onSubmit, initialData | Formulario de conductor |
| `LineEditorMap` | stops, route, onReorder | Mapa + editor de ruta con drag & drop |
| `StopForm` | onSubmit, initialData, onMapPick | Formulario con selector de mapa |
| `AlertCard` | alert, onAttend, severity | Card de alerta con nivel |
| `AlertDetail` | alert, onAction | Detalle completo de alerta |
| `MaintenanceForm` | vehicles, types, onSubmit | Formulario de mantenimiento |
| `MaintenanceHistory` | records, filters | Historial con filtros |
| `StatsKpiCard` | label, value, unit, trend | Card de KPI numérico |
| `StatsBarChart` | data, labels | Gráfico de barras simple |
| `PeriodSelector` | from, to, onChange | Selector de período |
| `UserRoleManager` | users, roles, onAssign | Gestión de usuarios y roles |
| `ConfigForm` | config, onSave | Configuración de cooperativa |
