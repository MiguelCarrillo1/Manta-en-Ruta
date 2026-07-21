# Manta en Ruta - Diseño Frontend

## FASE 7: Diseño de Frontend (React Native + Expo)

---

## 1. Estructura de Navegación (Expo Router)

```
RootNavigator
├── (auth)                         # No autenticado
│   ├── index.tsx                  # Login
│   └── recovery.tsx               # Recuperar contraseña
│
├── (user)                         # Rol: usuario_transporte
│   ├── (tabs)/
│   │   ├── index.tsx              # Mapa principal (home)
│   │   ├── search.tsx             # Búsqueda de destino
│   │   ├── lines.tsx              # Lista de líneas
│   │   └── profile.tsx            # Perfil / configuración
│   ├── line/[id].tsx              # Detalle de línea
│   ├── bus/[id].tsx               # Detalle de bus activo
│   ├── stop/[id].tsx              # Detalle de parada
│   └── poi/[id].tsx               # Detalle de lugar de interés
│
├── (driver)                       # Rol: conductor
│   ├── (tabs)/
│   │   ├── active-journey.tsx     # Jornada activa (principal)
│   │   ├── history.tsx            # Historial de jornadas
│   │   └── profile.tsx            # Perfil
│   ├── start-journey.tsx          # Iniciar jornada
│   ├── finish-journey.tsx         # Finalizar jornada
│   ├── add-fuel.tsx               # Registrar combustible
│   ├── add-note.tsx               # Agregar nota
│   ├── emergency.tsx              # Reportar emergencia
│   └── emergency/[id].tsx         # Estado de emergencia reportada
│
├── (cooperative)                  # Rol: gerente, admin, operador
│   ├── (tabs)/
│   │   ├── monitoring.tsx         # Monitoreo (mapa + unidades)
│   │   ├── alerts.tsx              # Alertas
│   │   ├── management.tsx          # Gestión (submenú)
│   │   └── statistics.tsx          # Estadísticas
│   ├── management/
│   │   ├── vehicles.tsx            # Lista de vehículos
│   │   ├── vehicle/[id].tsx        # Detalle/edición vehículo
│   │   ├── vehicle/new.tsx         # Nuevo vehículo
│   │   ├── drivers.tsx             # Lista de conductores
│   │   ├── driver/[id].tsx         # Detalle/edición conductor
│   │   ├── driver/new.tsx          # Nuevo conductor
│   │   ├── lines.tsx              # Lista de líneas
│   │   ├── line/[id].tsx          # Detalle/edición línea
│   │   ├── line/new.tsx           # Nueva línea
│   │   ├── stops.tsx              # Lista de paradas
│   │   ├── stop/[id].tsx          # Detalle/edición parada
│   │   └── maintenance.tsx        # Módulo de mantenimiento
│   ├── maintenance/
│   │   ├── list.tsx               # Historial de mantenimientos
│   │   ├── new.tsx                # Nuevo mantenimiento
│   │   └── [id].tsx               # Detalle mantenimiento
│   ├── alerts/[id].tsx            # Detalle de alerta
│   └── reports/
│       └── generate.tsx           # Generar reporte
│
└── (superadmin)                   # Rol: superadministrador
    ├── (tabs)/
    │   ├── cooperatives.tsx        # Cooperativas
    │   ├── global-config.tsx       # Configuración global
    │   ├── catalogs.tsx            # Catálogos globales
    │   ├── logs.tsx               # Logs / auditoría
    │   └── statistics.tsx          # Estadísticas globales
    ├── cooperative/[id].tsx        # Detalle/edición cooperativa
    ├── cooperative/new.tsx         # Nueva cooperativa
    ├── users.tsx                  # Usuarios globales
    └── roles.tsx                  # Roles y permisos
```

---

## 2. Flujos de Pantallas

### Flujo de Autenticación

```
App Inicia
  → ¿Token válido?
    ├── Sí → ¿Rol?
    │         ├── usuario → (user)/index
    │         ├── conductor → (driver)/active-journey
    │         ├── gerente/admin/operador → (cooperative)/monitoring
    │         └── superadmin → (superadmin)/cooperatives
    └── No → (auth)/login
              ├── Login exitoso → Redirigir según rol
              └── ¿Olvidó contraseña? → (auth)/recovery
```

### Flujo Usuario Transporte

```
(user)/index (Mapa)
  ├── Toca marcador de bus → bus/[id]
  ├── Toca marcador de parada → stop/[id]
  ├── Toca barra de búsqueda → search
  └── Toca icono de líneas → lines

search
  ├── Escribe texto → resultados en lista
  ├── Selecciona resultado → bus/[id] o line/[id]
  └── Toca mapa → busca por coordenadas

lines
  ├── Lista de líneas
  └── Toca línea → line/[id] (detalle con paradas + buses activos)
```

### Flujo Conductor

```
(driver)/active-journey
  ├── ¿Jornada activa?
  │    ├── No → start-journey
  │    │         ├── Selecciona vehículo
  │    │         ├── Ingresa km inicial
  │    │         └── Confirma → jornada activa
  │    └── Sí → Pantalla de jornada activa
  │              ├── Muestra: tiempo, km, velocidad
  │              ├── Botón: "Registrar combustible" → add-fuel
  │              ├── Botón: "Agregar nota" → add-note
  │              ├── Toggle: AC encendido/apagado
  │              ├── Toggle: WiFi encendido/apagado
  │              ├── Botón: "Emergencia" → emergency
  │              └── Botón: "Finalizar jornada" → finish-journey
  │
  emergency
    ├── Selecciona tipo de emergencia
    ├── Ingresa descripción (opcional)
    └── Confirma → Estado de emergencia enviada
```

### Flujo Cooperativa

```
(cooperative)/monitoring
  ├── Mapa con todas las unidades activas
  ├── Cada unidad: placa, conductor, estado, velocidad
  ├── Panel lateral: resumen de alertas activas
  └── Toca unidad → Detalle de unidad en tiempo real

(cooperative)/alerts
  ├── Lista de alertas (filtro por estado/severidad)
  └── Toca alerta → Detalle + botón "Atender" / "Cerrar"

(cooperative)/management
  ├── Submenú: Vehículos | Conductores | Líneas | Paradas | Mantenimiento
  ├── management/vehicles → Lista + CRUD
  ├── management/drivers → Lista + CRUD
  ├── management/lines → Lista + CRUD (con asignación de paradas)
  ├── management/stops → Lista + CRUD (con mapa para coordenadas)
  └── management/maintenance → Historial + CRUD
```

### Flujo Superadmin

```
(superadmin)/cooperatives
  ├── Lista de todas las cooperativas
  ├── Crear nueva cooperativa (formulario completo)
  └── Toca cooperativa → Detalle + asignar gerente

(superadmin)/global-config
  ├── Parámetros globales de la plataforma
  └── Editar parámetros

(superadmin)/catalogs
  ├── Lista de catálogos (tipos vehículo, combustible, etc.)
  └── CRUD de items por catálogo

(superadmin)/logs
  ├── Logs de actividad del sistema (filtro por fecha/usuario/acción)
  └── Auditoría de acciones críticas
```

---

## 3. Estados de Pantalla

Cada pantalla debe manejar los siguientes estados:

| Estado | Comportamiento |
|--------|----------------|
| **Loading** | Skeleton loader o spinner mientras se cargan datos |
| **Success** | Renderizado normal de datos |
| **Empty** | Mensaje "No hay resultados" con icono ilustrativo |
| **Error** | Mensaje de error + botón "Reintentar" |
| **Offline** | Banner persistente "Sin conexión" + datos cacheados si disponibles |

### Ejemplo de Manejo de Estados

```typescript
// useQuery hook (TanStack Query)
const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ['lines'],
  queryFn: () => api.get('/user/lines'),
});

// UI
if (isLoading) return <SkeletonList />;
if (isError) return <ErrorState message={error.message} onRetry={refetch} />;
if (!data?.length) return <EmptyState message="No hay líneas disponibles" />;
return <LineList lines={data} />;
```

---

## 4. Componentes Reutilizables

### UI Base

| Componente | Props | Uso |
|------------|-------|-----|
| `Button` | variant, size, loading, disabled, onPress | Botón primario, secundario, peligro |
| `Input` | label, value, onChange, error, type | Campos de formulario |
| `Card` | title, children, onPress | Contenedor de información |
| `Modal` | visible, title, children, onClose | Diálogos modales |
| `Badge` | text, variant | Estados, etiquetas |
| `Chip` | label, selected, onPress | Filtros, categorías |
| `Divider` | - | Separador visual |

### Mapa

| Componente | Props | Descripción |
|------------|-------|-------------|
| `MapView` | region, markers, onPress, polylines | Mapa base con OpenStreetMap |
| `BusMarker` | bus, variant (exact/approximate) | Marcador de bus (color según estado) |
| `StopMarker` | stop | Marcador de parada oficial |
| `PoiMarker` | poi, category | Marcador de lugar de interés |
| `RoutePolyline` | coordinates, color | Línea de ruta en mapa |
| `UserLocationMarker` | - | Posición actual del usuario |

### Bus

| Componente | Props | Descripción |
|------------|-------|-------------|
| `BusCard` | bus, onPress | Tarjeta resumen de bus |
| `BusList` | buses, loading, onRefresh | Lista de buses con distancia |
| `BusStatus` | status | Indicador visual de estado |
| `BusFeatures` | hasAc, hasWifi | Iconos de AC y WiFi |

### Jornada (Conductor)

| Componente | Props | Descripción |
|------------|-------|-------------|
| `JourneyHeader` | journey | Cabecera de jornada activa (tiempo, km) |
| `JourneyTimer` | startAt | Temporizador en vivo |
| `FuelForm` | onSubmit, loading | Formulario de registro de combustible |
| `EmergencyTypeSelector` | types, onSelect | Selección de tipo de emergencia |
| `KmInput` | value, onChange | Input numérico para kilometraje |

### Comunes

| Componente | Props | Descripción |
|------------|-------|-------------|
| `Loading` | message | Spinner de carga |
| `ErrorState` | message, onRetry | Estado de error con retry |
| `EmptyState` | message, icon | Estado vacío |
| `OfflineNotice` | isOffline | Banner de conexión |
| `SearchBar` | value, onChange, onSubmit | Barra de búsqueda universal |
| `FilterChips` | options, selected, onChange | Filtros tipo chip |
| `Pagination` | page, totalPages, onChange | Paginación inferior |
| `ConfirmDialog` | title, message, onConfirm | Diálogo de confirmación |
| `RefreshControl` | refreshing, onRefresh | Pull-to-refresh |

---

## 5. Manejo de Sesión

### Estrategia

```typescript
// authStore.ts (Zustand)
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  role: Role | null;
  cooperativeId: number | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;  // Al iniciar la app
  refreshAccessToken: () => Promise<void>;
}
```

### Flujo de Sesión

```
App Inicia
  → restoreSession()
    → Lee token de SecureStore
    → ¿Token válido?
      ├── Sí → Decodifica JWT → establece user/role/cooperativeId
      │        → Programa refresh automático (5 min antes de expirar)
      └── No → ¿Refresh token válido?
                ├── Sí → refreshAccessToken() → guarda nuevo token
                └── No → logout() → redirige a login

Interceptor Axios:
  → Cada request: añade Authorization header
  → Si response 401: intenta refreshAccessToken()
    → Éxito: re-intenta request original
    → Fracaso: logout()
```

### Almacenamiento Seguro

- **Tokens**: `expo-secure-store` (cifrado nativo)
- **Datos de sesión**: Zustand store en memoria
- **Cache offline**: `AsyncStorage` con límite de tamaño

---

## 6. Manejo Offline

### Estrategia General

| Tipo de Dato | Estrategia Offline |
|-------------|-------------------|
| Rutas, líneas, paradas | Cachear en AsyncStorage al cargar. Servir desde caché si offline. |
| Posición GPS del conductor | Almacenar en cola local. Enviar cuando haya conexión. |
| Registro de combustible | Guardar localmente con flag pendiente. Sincronizar al reconectar. |
| Notas del conductor | Igual que combustible. |
| Emergencias | NO offline. Requiere conexión inmediata. |
| Alertas recibidas | Solo con conexión. |
| Búsqueda de destinos | Cachear últimas búsquedas. Sin conexión: resultados limitados. |

### Implementación

```typescript
// useOffline.ts
// Hook que monitorea conectividad con NetInfo
// Expone: isOffline, pendingSync, syncNow()

// Cola de sincronización:
interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH';
  body: any;
  createdAt: string;
  retries: number;
}

// Al reconectar:
// 1. Procesar cola FIFO
// 2. Si falla: reintentar hasta 3 veces
// 3. Si persiste: marcar como fallido y notificar usuario
```

### Cache de Datos Estáticos

```typescript
// Líneas, paradas, lugares de interés
// Se cachean al cargar con TTL de 24h
// En online: servir desde API (stale-while-revalidate)
// En offline: servir desde caché con indicador visual
```

---

## 7. Manejo de GPS (App Conductor)

### Configuración

```typescript
// useGpsTracking.ts
const config = {
  // Android
  foregroundService: true,        // Servicio en foreground para no matar proceso
  showsBackgroundLocationIndicator: true,
  // Intervalos
  timeInterval: 10000,            // 10 segundos entre envíos
  distanceInterval: 50,           // O cada 50 metros
  // Precisión
  accuracy: LocationAccuracy.High,
  // Deferred updates (ahorro batería cuando el dispositivo está quieto)
  deferredUpdatesInterval: 30000,
  deferredUpdatesDistance: 100,
};
```

### Lógica de Tracking

```
useGpsTracking activo SOLO durante jornada activa
  → Obtiene posición cada 10s
  → Filtra si precisión > 50m (descartar lecturas malas)
  → Encola en array de batch
  → Cada 30s envía batch a API
  → Si falla: guarda en cola offline
  → Si jornada termina: detiene tracking
```
