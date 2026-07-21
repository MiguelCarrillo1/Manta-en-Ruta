# Manta en Ruta - Arquitectura del Sistema

## FASE 4: Arquitectura

---

## 1. Arquitectura General (Vista de Alto Nivel)

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENTES (Frontend)                         │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐  │
│  │  App Usuario        │  │  App Conductor                  │  │
│  │  (React Native/Expo)│  │  (React Native/Expo)            │  │
│  └──────────┬──────────┘  └───────────────┬─────────────────┘  │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐  │
│  │  App Cooperativa    │  │  Panel Superadmin               │  │
│  │  (React Native/Expo)│  │  (React Native/Expo o Web)      │  │
│  └──────────┬──────────┘  └───────────────┬─────────────────┘  │
└─────────────┼──────────────────────────────┼────────────────────┘
              │           HTTPS/REST         │
              ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API GATEWAY / LOAD BALANCER                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Middleware: Autenticación JWT, Rate Limiting, CORS, Logs │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Laravel)                           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Módulo     │  │  Módulo     │  │  Módulo Cooperativa     │ │
│  │  Usuario    │  │  Conductor  │  │  (Admin/Operador)       │ │
│  ├─────────────┤  ├─────────────┤  ├─────────────────────────┤ │
│  │  - Rutas    │  │  - Jornada  │  │  - Vehículos            │ │
│  │  - Líneas   │  │  - GPS      │  │  - Conductores          │ │
│  │  - Búsqueda │  │  - Emergenc │  │  - Rutas/Paradas        │ │
│  │  - Mapas    │  │  - Combust  │  │  - Mantenimiento        │ │
│  └──────┬──────┘  └──────┬──────┘  │  - Estadísticas         │ │
│         │                │         │  - Alertas              │ │
│         │                │         └─────────────────────────┘ │
│         │                │         ┌─────────────────────────┐ │
│         │                │         │  Módulo Superadmin      │ │
│         │                │         │  - Cooperativas         │ │
│         │                │         │  - Catálogos Globales   │ │
│         │                │         │  - Logs/Auditoría       │ │
│         │                │         │  - Estadísticas Globales│ │
│  ┌──────┴──────────────┴─────────┴─────────────────────────┐  │
│  │                   CAPA COMÚN                             │  │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐  │  │
│  │  │ Auth   │ │ RBAC    │ │ Multi-   │ │ Notificac. │  │  │
│  │  │ JWT    │ │ Permisos│ │ Tenant   │ │ (Internal)  │  │  │
│  │  └─────────┘ └──────────┘ └──────────┘ └─────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BASE DE DATOS (PostgreSQL)                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Schema public: catálogos globales, cooperativas         │   │
│  │  Schema por cooperativa (multi-tenant): datos propios    │   │
│  │  Índices espaciales (PostGIS) para consultas GPS         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Decisión**: Arquitectura Cliente-Servidor con API REST. Se elige REST (vs GraphQL) por simplicidad, compatibilidad universal, y porque los patrones de consulta son predecibles. Laravel como backend por su ecosistema maduro, ORM Eloquent, y soporte nativo para autenticación JWT.

---

## 2. Arquitectura Backend (Laravel)

### Estructura de Carpetas

```
app/
├── Console/
│   └── Commands/              # Comandos Artisan (cron, purgas, etc.)
├── Exceptions/                 # Manejadores de excepción personalizados
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── V1/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── User/
│   │   │   │   │   ├── LineController.php
│   │   │   │   │   ├── RouteController.php
│   │   │   │   │   ├── BusController.php
│   │   │   │   │   ├── StopController.php
│   │   │   │   │   ├── SearchController.php
│   │   │   │   │   └── MapController.php
│   │   │   │   ├── Driver/
│   │   │   │   │   ├── JourneyController.php
│   │   │   │   │   ├── FuelController.php
│   │   │   │   │   ├── EmergencyController.php
│   │   │   │   │   └── VehicleStatusController.php
│   │   │   │   ├── Cooperative/
│   │   │   │   │   ├── VehicleController.php
│   │   │   │   │   ├── DriverManagementController.php
│   │   │   │   │   ├── LineManagementController.php
│   │   │   │   │   ├── StopManagementController.php
│   │   │   │   │   ├── MaintenanceController.php
│   │   │   │   │   ├── MonitoringController.php
│   │   │   │   │   ├── AlertController.php
│   │   │   │   │   ├── StatisticsController.php
│   │   │   │   │   └── ReportController.php
│   │   │   │   └── SuperAdmin/
│   │   │   │       ├── CooperativeController.php
│   │   │   │       ├── GlobalConfigController.php
│   │   │   │       ├── GlobalCatalogController.php
│   │   │   │       ├── LogController.php
│   │   │   │       └── AuditController.php
│   ├── Middleware/
│   │   ├── JwtMiddleware.php          # Validación JWT
│   │   ├── TenantMiddleware.php       # Filtro multi-tenant
│   │   ├── RoleMiddleware.php         # Verificación de rol
│   │   ├── PermissionMiddleware.php   # Verificación de permiso específico
│   │   └── RateLimitMiddleware.php    # Límite de peticiones
│   └── Requests/                      # Form Requests con validación
├── Models/
│   ├── User.php
│   ├── Cooperative.php
│   ├── Role.php
│   ├── Permission.php
│   ├── Vehicle.php
│   ├── Driver.php
│   ├── Line.php
│   ├── Stop.php
│   ├── RouteSegment.php
│   ├── PointOfInterest.php
│   ├── Journey.php
│   ├── Position.php
│   ├── FuelRecord.php
│   ├── Maintenance.php
│   ├── Emergency.php
│   ├── Alert.php
│   ├── Note.php
│   └── GlobalCatalog.php
├── Services/
│   ├── AuthService.php                # Lógica de autenticación
│   ├── GpsService.php                 # Procesamiento de GPS / ofuscación
│   ├── SearchService.php              # Algoritmo de búsqueda de rutas
│   ├── DistanceService.php            # Cálculos de distancia
│   ├── TenantService.php              # Aislamiento multi-tenant
│   ├── StatisticsService.php          # Generación de estadísticas
│   └── NotificationService.php        # Notificaciones internas
├── Repositories/                      # Patrón Repository (opcional, para consultas complejas)
│   ├── PositionRepository.php
│   ├── JourneyRepository.php
│   └── SearchRepository.php
└── Traits/
    ├── TenantScoped.php               # Scope global para multi-tenant
    └── ApiResponse.php                # Respuestas estandarizadas
```

**Decisión**: Se usa arquitectura por módulos dentro de Laravel (no módulos externos como nWidart) para mantener simplicidad inicial. Los Services encapsulan la lógica de negocio pesada. Se separan Controllers por módulo (User, Driver, Cooperative, SuperAdmin).

---

## 3. Arquitectura Frontend (React Native + Expo)

### Estructura de Carpetas

```
src/
├── app/                              # Expo Router (file-based routing)
│   ├── (auth)/                       # Grupo de rutas de autenticación
│   │   ├── login.tsx
│   │   └── recovery.tsx
│   ├── (user)/                       # Grupo de rutas de usuario transporte
│   │   ├── (tabs)/
│   │   │   ├── index.tsx             # Mapa principal
│   │   │   ├── search.tsx           # Búsqueda
│   │   │   ├── lines.tsx            # Líneas
│   │   │   └── profile.tsx          # Perfil
│   │   ├── bus-detail.tsx
│   │   └── line-detail.tsx
│   ├── (driver)/                     # Grupo de rutas de conductor
│   │   ├── (tabs)/
│   │   │   ├── journey.tsx          # Jornada activa
│   │   │   ├── history.tsx          # Historial
│   │   │   └── profile.tsx
│   │   └── emergency.tsx
│   ├── (cooperative)/                # Grupo de rutas de cooperativa
│   │   ├── (tabs)/
│   │   │   ├── dashboard.tsx        # Monitoreo/Mapa
│   │   │   ├── management/          # Gestión
│   │   │   │   ├── vehicles.tsx
│   │   │   │   ├── drivers.tsx
│   │   │   │   ├── lines.tsx
│   │   │   │   ├── stops.tsx
│   │   │   │   └── maintenance.tsx
│   │   │   ├── alerts.tsx
│   │   │   └── statistics.tsx
│   │   └── reports/
│   └── (superadmin)/                 # Grupo de rutas de superadmin
│       ├── (tabs)/
│       │   ├── cooperatives.tsx
│       │   ├── global-config.tsx
│       │   ├── logs.tsx
│       │   └── statistics.tsx
├── components/                        # Componentes reutilizables
│   ├── ui/                           # Componentes base (Button, Input, Card)
│   ├── map/                          # Componentes de mapa
│   │   ├── BusMarker.tsx
│   │   ├── StopMarker.tsx
│   │   ├── RoutePolyline.tsx
│   │   └── MapView.tsx
│   ├── bus/                          # Componentes de bus
│   │   ├── BusCard.tsx
│   │   ├── BusList.tsx
│   │   └── BusStatus.tsx
│   ├── journey/                      # Componentes de jornada
│   │   ├── JourneyHeader.tsx
│   │   ├── FuelForm.tsx
│   │   └── EmergencyButton.tsx
│   └── common/                       # Componentes compartidos
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       └── OfflineNotice.tsx
├── hooks/                            # Custom hooks
│   ├── useAuth.ts
│   ├── useLocation.ts
│   ├── useGpsTracking.ts
│   ├── useSearch.ts
│   └── useOffline.ts
├── services/                         # Llamadas API
│   ├── api.ts                        # Axios instance + interceptors
│   ├── authService.ts
│   ├── searchService.ts
│   ├── journeyService.ts
│   ├── vehicleService.ts
│   └── cooperativeService.ts
├── store/                            # Estado global
│   ├── authStore.ts
│   ├── journeyStore.ts
│   └── uiStore.ts
├── utils/                            # Utilidades
│   ├── distance.ts                   # Cálculos de distancia
│   ├── obfuscation.ts               # Ofuscación de coordenadas
│   ├── formatters.ts
│   └── validators.ts
└── types/                            # Tipos TypeScript
    ├── api.ts
    ├── models.ts
    └── navigation.ts
```

**Decisión**: Expo Router para navegación basada en archivos (similar a Next.js). Separación por grupos de rutas según rol: `(user)`, `(driver)`, `(cooperative)`, `(superadmin)`. Esto permite compilar apps independientes o una app unificada con login que redirige según rol. Se usa Zustand para estado global por su simplicidad vs Redux.

---

## 4. Arquitectura API (REST)

### Estándares

- **Base URL**: `/api/v1/`
- **Formato**: JSON
- **Autenticación**: Bearer Token (JWT)
- **Versionado**: URL prefix (`v1`, `v2`, etc.)
- **Paginación**: Cursor-based para posiciones GPS, offset-based para listas estáticas
- **Respuesta estándar**:

```json
{
  "success": true,
  "data": {},
  "message": "Operación exitosa",
  "meta": {
    "page": 1,
    "per_page": 15,
    "total": 100
  },
  "errors": []
}
```

### Códigos HTTP

| Código | Uso |
|--------|-----|
| 200 | Éxito (GET, PUT, PATCH) |
| 201 | Creación exitosa (POST) |
| 204 | Eliminación exitosa (DELETE) |
| 400 | Error de validación / solicitud incorrecta |
| 401 | No autenticado |
| 403 | No autorizado (rol sin permiso) |
| 404 | Recurso no encontrado |
| 429 | Demasiadas solicitudes (rate limit) |
| 500 | Error interno del servidor |

---

## 5. Arquitectura de Autenticación

```
[Cliente] ─POST /api/v1/auth/login─→ [Middleware] ─→ [AuthController@login]
  │                                       │
  │  ← { token, refresh_token, user } ────┘
  │
  │  Cada request:
  │  Header: Authorization: Bearer {token}
  │
[Cliente] ─GET /api/v1/...─→ [JwtMiddleware] ─→ [TenantMiddleware] ─→ [RoleMiddleware]
                                   │                    │                    │
                                   │ Valida JWT         │ Extrae tenant_id  │ Verifica rol
                                   │ Verifica exp       │ del JWT           │ y permiso
                                   │ Verifica firma     │                   │
```

**Decisión**: JWT con access token (corta duración: 15 min) + refresh token (larga duración: 7 días). Los tokens incluyen: `user_id`, `role`, `tenant_id` (cooperativa), `permissions[]`. Esto evita consultas a BD en cada request para autorización básica.

---

## 6. Arquitectura GPS

### Flujo de Transmisión

```
[App Conductor]
    ├── Obtiene coordenadas cada 10 segundos (frecuencia configurable)
    ├── Envía a: POST /api/v1/driver/positions
    │   Body: { vehicle_id, latitude, longitude, speed, heading, timestamp }
    │
    ▼
[Backend]
    ├── Valida JWT (rol=conductor)
    ├── Guarda en tabla "positions"
    │   └── Particionada por mes para rendimiento
    ├── Actualiza última posición en tabla "vehicles" (caché)
    │
    ▼
[Consultas]
    ├── Usuario: GET /api/v1/user/buses/{id}/position
    │   └── Devuelve posición ofuscada (lat ± 0.002, lng ± 0.002 ≈ ~200m de error)
    │
    └── Cooperativa: GET /api/v1/cooperative/monitoring/vehicles
        └── Devuelve posición exacta
```

### Estrategia de Ofuscación GPS

- **Usuarios**: Se añade ruido aleatorio de ±0.002° (aprox 200m) a cada coordenada
- **Cooperativa**: Coordenadas exactas (precisión real del dispositivo ~5-10m)
- **Implementación**: `GpsService::obfuscate(float $lat, float $lng): array`

### Optimizaciones

- Caché en Redis (si disponible) o en memoria para última posición de cada bus
- Endpoint específico para consultas masivas de usuarios (`/buses/positions?line_ids=1,2,3`)
- Las posiciones históricas se almacenan en tabla particionada por mes
- Política de retención: 3 meses de datos históricos, luego resumen diario

---

## 7. Arquitectura de Permisos (RBAC)

### Modelo de Permisos

```
Rol → Permisos (muchos a muchos)
Usuario → Rol (dentro de un tenant)

Jerarquía de roles:
Superadmin → Acceso global, ignora tenant
Gerente    → Full acceso a su tenant
Admin      → Acceso operativo a su tenant
Operador   → Acceso de solo lectura + gestión de alertas
Conductor  → Solo su jornada, su vehículo
Usuario    → Solo consultas públicas
```

### Permisos por Módulo (Ejemplos)

| Permiso | Superadmin | Gerente | Admin | Operador | Conductor |
|---------|:----------:|:-------:|:-----:|:--------:|:---------:|
| cooperatives.create | ✓ | ✗ | ✗ | ✗ | ✗ |
| cooperatives.update | ✓ | ✗ | ✗ | ✗ | ✗ |
| vehicles.create | ✗ | ✓ | ✓ | ✗ | ✗ |
| vehicles.update | ✗ | ✓ | ✓ | ✗ | ✗ |
| vehicles.view | ✗ | ✓ | ✓ | ✓ | ✓ (solo suyo) |
| drivers.manage | ✗ | ✓ | ✓ | ✗ | ✗ |
| lines.manage | ✗ | ✓ | ✓ | ✗ | ✗ |
| monitoring.view | ✗ | ✓ | ✓ | ✓ | ✗ |
| alerts.manage | ✗ | ✓ | ✓ | ✓ | ✗ |
| maintenance.create | ✗ | ✓ | ✓ | ✗ | ✗ |
| statistics.view | ✓ | ✓ | ✓ | ✗ | ✗ |
| journey.start | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## 8. Arquitectura Multi-Cooperativa (Multi-Tenant)

### Estrategia: Shared Database + Tenant ID Column

```
Cada tabla con datos de cooperativa tiene: cooperative_id (foreign key)

Tablas compartidas (globales):
├── cooperatives
├── roles
├── permissions
├── global_catalogs
├── users (con cooperative_id nullable para superadmins)

Tablas con scope por tenant (cooperative_id en todas):
├── vehicles
├── drivers
├── lines
├── stops
├── points_of_interest
├── journeys
├── positions
├── fuel_records
├── maintenance_records
├── emergencies
├── alerts
├── notes
├── user_cooperative (pivot: user_id + cooperative_id + role_id)
```

### Implementación

```php
// TenantMiddleware: Extrae cooperative_id del JWT y lo inyecta en el request
// TenantScoped (trait): Aplica where('cooperative_id', $cooperativeId) a toda query
// Superadmin puede bypass: el JWT de superadmin no tiene cooperative_id
```

**Decisión**: Se elige "shared database + tenant column" sobre "separate schema" porque:
- **Ventajas**: Mantenimiento simple, backups unificados, consultas cross-tenant para superadmin, menor costo
- **Desventajas**: Riesgo de fuga de datos entre tenants (mitigado con middleware robusto y scopes)
- Para fase inicial es suficiente; si el volumen crece, se migra a "schema per tenant"

---

## 9. Arquitectura para Futuras Expansiones

### Crecimiento Horizontal

```
Fase Inicial (Universitaria)
├── 1 servidor: Laravel + PostgreSQL
├── Despliegue: VPS bajo costo (DigitalOcean, Linode)
└── Stack monolítico

Fase Intermedia (Producto Comercial)
├── Load Balancer
├── Múltiples nodos Laravel (horizontal scaling)
├── PostgreSQL con replicación lectura/escritura
├── Redis para caché y sesiones
└── Contenedores Docker + Kubernetes (opcional)

Fase Avanzada (Escala Nacional)
├── Microservicios (opcional: separar GPS, notificaciones)
├── PostgreSQL particionado y sharding
├── CDN para assets estáticos
├── WebSockets para tiempo real (Laravel Reverb)
└── Cola de trabajos (Redis + Laravel Horizon)
```

### Expansión Geográfica

- La tabla `cooperatives` tiene campo `scope: enum(urban, intercantonal, interprovincial)`
- Las rutas pueden atravesar múltiples cantones/provincias
- El sistema multi-tenant soporta cooperativas sin límite geográfico
- La búsqueda de rutas puede filtrar por `scope` y por ubicación geográfica

### Puntos de Extensión

| Componente | Estrategia de Extensión |
|------------|------------------------|
| Nuevos roles | Tabla `roles` + `permissions` configurables desde superadmin |
| Nuevos módulos | Nuevos controladores + servicios + modelos, sin tocar existentes |
| Nuevos tipos de notificación | NotificationService extensible por tipo |
| Nuevos catálogos | Tabla `global_catalogs` + `catalog_items` genérica |
| Reportes personalizados | Sistema de report query builder en lugar de SQL fijo |

---

## Decisiones Arquitectónicas Clave (Registro)

| Decisión | Alternativa | Por qué se eligió esta |
|----------|-------------|------------------------|
| REST API | GraphQL | Simplicidad, madurez de Laravel con REST, consultas predecibles |
| JWT con RBAC | OAuth2 completo | Menor complejidad, suficiente para los roles definidos |
| Shared DB + tenant_id | Schema per tenant | Menor costo operativo inicial, backups simples |
| Expo Router | React Navigation manual | Routing file-based, más organizado, menos boilerplate |
| Zustand | Redux Toolkit | Menor curva de aprendizaje, menos código boilerplate |
| OpenStreetMap + Leaflet | Google Maps | Sin costo, licencia abierta, suficiente precisión |
| Monolítico inicial | Microservicios | Equipo pequeño, evitar complejidad distribuida prematura |
| Partición por mes en positions | Tabla única sin partición | Volumen alto de datos GPS, necesario para rendimiento |
| Ofuscación en backend | Ofuscación en frontend | Control centralizado, no confiar en cliente para seguridad |
