# Manta en Ruta - Diseño API REST

## FASE 6: Diseño de API

---

## 1. Estándares Generales

- **Base URL**: `/api/v1/`
- **Content-Type**: `application/json`
- **Autenticación**: `Authorization: Bearer {access_token}`
- **Paginación**: `?page=1&per_page=15` (máx 100)
- **Idioma de errores**: Español

### Estructura de Respuesta

**Éxito:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

**Lista paginada:**
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": {
    "email": ["El campo email es requerido"],
    "password": ["La contraseña debe tener al menos 8 caracteres"]
  }
}
```

---

## 2. Endpoints por Módulo

### 2.1 Autenticación

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| POST | `/auth/login` | Iniciar sesión | Todos |
| POST | `/auth/logout` | Cerrar sesión | Autenticados |
| POST | `/auth/refresh` | Renovar access token | Autenticados |
| POST | `/auth/recovery` | Solicitar recuperación de contraseña | Todos |
| POST | `/auth/reset` | Restablecer contraseña con token | Todos |
| GET  | `/auth/me` | Obtener perfil del usuario autenticado | Autenticados |

**POST /auth/login**
```json
// Request
{ "email": "conductor@coop1.com", "password": "xxxx" }

// Response 200
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900,
    "user": { "id": 1, "name": "Pedro", "email": "..." },
    "roles": ["conductor"],
    "cooperative": { "id": 1, "name": "Cooperativa 1" }
  }
}
```

---

### 2.2 Módulo Usuario (Público)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/user/lines` | Listar líneas activas | No requerida |
| GET | `/user/lines/{id}` | Detalle de línea (ruta, paradas) | No requerida |
| GET | `/user/lines/{id}/buses` | Buses activos en una línea | No requerida |
| GET | `/user/buses/{id}` | Detalle de un bus activo | No requerida |
| GET | `/user/buses/{id}/position` | Posición aproximada de un bus | No requerida |
| GET | `/user/buses/positions` | Posiciones de múltiples buses (?line_ids=1,2) | No requerida |
| GET | `/user/stops` | Listar paradas oficiales (?line_id=) | No requerida |
| GET | `/user/stops/{id}` | Detalle de parada | No requerida |
| GET | `/user/pois` | Listar lugares de interés (?category=) | No requerida |
| GET | `/user/pois/{id}` | Detalle de lugar de interés | No requerida |
| GET | `/user/search` | Búsqueda de destino | No requerida |
| GET | `/user/search/nearby` | Búsqueda por punto en mapa | No requerida |

**GET /user/search?q=centro&lat=-0.95&lng=-80.72**
```json
// Response 200
{
  "success": true,
  "data": {
    "results": [
      {
        "line": { "id": 1, "name": "Línea 8", "code": "L8" },
        "buses": [
          {
            "id": 5,
            "plate": "MNT-1234",
            "has_ac": true,
            "has_wifi": false,
            "distance_remaining_km": 3.2,
            "estimated_minutes": 12,
            "position": { "lat": -0.948, "lng": -80.715 },
            "last_update": "2026-07-14T10:30:00Z"
          }
        ],
        "total_buses_active": 3
      }
    ],
    "meta": {
      "destination": { "lat": -0.95, "lng": -80.72 },
      "search_mode": "text"
    }
  }
}
```

---

### 2.3 Módulo Conductor

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/driver/vehicles` | Listar vehículos asignados al conductor | Conductor |
| POST | `/driver/journeys` | Iniciar jornada | Conductor |
| PATCH | `/driver/journeys/active` | Actualizar jornada activa | Conductor |
| POST | `/driver/journeys/active/finish` | Finalizar jornada | Conductor |
| GET | `/driver/journeys/active` | Ver jornada activa actual | Conductor |
| GET | `/driver/journeys` | Historial de jornadas | Conductor |
| GET | `/driver/journeys/{id}` | Detalle de jornada | Conductor |
| POST | `/driver/positions` | Enviar posición GPS | Conductor |
| POST | `/driver/fuel` | Registrar carga de combustible | Conductor |
| POST | `/driver/notes` | Registrar nota | Conductor |
| PATCH | `/driver/vehicles/{id}/ac` | Cambiar estado AC | Conductor |
| PATCH | `/driver/vehicles/{id}/wifi` | Cambiar estado WiFi | Conductor |
| POST | `/driver/emergencies` | Reportar emergencia | Conductor |

**POST /driver/journeys**
```json
// Request
{
  "vehicle_id": 5,
  "start_km": 125430
}

// Response 201
{
  "success": true,
  "data": {
    "journey": {
      "id": 1024,
      "vehicle": { "id": 5, "plate": "MNT-1234" },
      "start_km": 125430,
      "start_at": "2026-07-14T06:00:00Z",
      "status": "active"
    }
  },
  "message": "Jornada iniciada exitosamente"
}
```

**POST /driver/positions**
```json
// Request
{
  "latitude": -0.9481234,
  "longitude": -80.7156789,
  "speed": 35.5,
  "heading": 180,
  "accuracy": 8.0,
  "recorded_at": "2026-07-14T10:30:00Z"
}

// Response 200
{
  "success": true,
  "message": "Posición registrada"
}
```

**POST /driver/emergencies**
```json
// Request
{
  "emergency_type_id": 2,
  "description": "Asalto en curso en km 5 vía a Tarqui",
  "latitude": -0.951,
  "longitude": -80.718
}

// Response 201
{
  "success": true,
  "data": {
    "emergency": {
      "id": 50,
      "type": "asalto",
      "status": "reported",
      "reported_at": "2026-07-14T10:35:00Z"
    },
    "alert": {
      "id": 200,
      "severity": "critical"
    }
  },
  "message": "Emergencia reportada. Un operador será notificado."
}
```

---

### 2.4 Módulo Cooperativa - Administrativo

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/cooperative/vehicles` | Listar vehículos | Gerente, Admin |
| POST | `/cooperative/vehicles` | Crear vehículo | Gerente, Admin |
| GET | `/cooperative/vehicles/{id}` | Detalle vehículo | Gerente, Admin |
| PUT | `/cooperative/vehicles/{id}` | Actualizar vehículo | Gerente, Admin |
| DELETE | `/cooperative/vehicles/{id}` | Desactivar vehículo | Gerente, Admin |
| GET | `/cooperative/drivers` | Listar conductores | Gerente, Admin |
| POST | `/cooperative/drivers` | Crear conductor | Gerente, Admin |
| PUT | `/cooperative/drivers/{id}` | Actualizar conductor | Gerente, Admin |
| DELETE | `/cooperative/drivers/{id}` | Desactivar conductor | Gerente, Admin |
| GET | `/cooperative/lines` | Listar líneas | Gerente, Admin |
| POST | `/cooperative/lines` | Crear línea | Gerente, Admin |
| GET | `/cooperative/lines/{id}` | Detalle línea con paradas | Gerente, Admin |
| PUT | `/cooperative/lines/{id}` | Actualizar línea | Gerente, Admin |
| DELETE | `/cooperative/lines/{id}` | Desactivar línea | Gerente, Admin |
| POST | `/cooperative/lines/{id}/stops` | Asignar paradas a línea | Gerente, Admin |
| GET | `/cooperative/stops` | Listar paradas | Gerente, Admin |
| POST | `/cooperative/stops` | Crear parada | Gerente, Admin |
| PUT | `/cooperative/stops/{id}` | Actualizar parada | Gerente, Admin |
| DELETE | `/cooperative/stops/{id}` | Desactivar parada | Gerente, Admin |
| GET | `/cooperative/pois` | Listar lugares de interés | Gerente, Admin |
| POST | `/cooperative/pois` | Crear lugar de interés | Gerente, Admin |
| PUT | `/cooperative/pois/{id}` | Actualizar lugar de interés | Gerente, Admin |
| DELETE | `/cooperative/pois/{id}` | Desactivar lugar de interés | Gerente, Admin |

---

### 2.5 Módulo Cooperativa - Gestión Operativa

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/cooperative/monitoring/vehicles` | Mapa con unidades activas (posición exacta) | Gerente, Admin, Operador |
| GET | `/cooperative/monitoring/vehicles/{id}` | Detalle de unidad en tiempo real | Gerente, Admin, Operador |
| GET | `/cooperative/monitoring/journeys/active` | Jornadas activas actuales | Gerente, Admin, Operador |
| GET | `/cooperative/alerts` | Listar alertas (?status=&severity=) | Gerente, Admin, Operador |
| PATCH | `/cooperative/alerts/{id}` | Atender/cerrar alerta | Gerente, Admin, Operador |
| GET | `/cooperative/emergencies` | Listar emergencias | Gerente, Admin |
| GET | `/cooperative/emergencies/{id}` | Detalle de emergencia | Gerente, Admin |
| PATCH | `/cooperative/emergencies/{id}` | Actualizar estado emergencia | Gerente, Admin |
| GET | `/cooperative/notes` | Listar notas (?journey_id=) | Gerente, Admin, Operador |

---

### 2.6 Módulo Cooperativa - Mantenimiento

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/cooperative/maintenance` | Listar mantenimientos (?vehicle_id=) | Gerente, Admin |
| POST | `/cooperative/maintenance` | Registrar mantenimiento | Gerente, Admin |
| GET | `/cooperative/maintenance/{id}` | Detalle mantenimiento | Gerente, Admin |
| GET | `/cooperative/maintenance/types` | Tipos de mantenimiento | Gerente, Admin |
| GET | `/cooperative/maintenance/upcoming` | Mantenimientos próximos | Gerente, Admin |

---

### 2.7 Módulo Cooperativa - Estadísticas

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/cooperative/statistics/dashboard` | Dashboard con KPIs | Gerente, Admin |
| GET | `/cooperative/statistics/kilometers` | Kilómetros por período | Gerente, Admin |
| GET | `/cooperative/statistics/fuel` | Consumo de combustible | Gerente, Admin |
| GET | `/cooperative/statistics/maintenance` | Costos de mantenimiento | Gerente, Admin |
| GET | `/cooperative/statistics/incidents` | Incidentes por período | Gerente, Admin |
| GET | `/cooperative/statistics/journeys` | Jornadas por período | Gerente, Admin |
| GET | `/cooperative/reports` | Generar reporte (exportable) | Gerente, Admin |

---

### 2.8 Módulo Superadministrador

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/superadmin/cooperatives` | Listar cooperativas | Superadmin |
| POST | `/superadmin/cooperatives` | Crear cooperativa | Superadmin |
| GET | `/superadmin/cooperatives/{id}` | Detalle cooperativa | Superadmin |
| PUT | `/superadmin/cooperatives/{id}` | Actualizar cooperativa | Superadmin |
| DELETE | `/superadmin/cooperatives/{id}` | Desactivar cooperativa | Superadmin |
| POST | `/superadmin/cooperatives/{id}/assign-gerente` | Asignar gerente | Superadmin |
| GET | `/superadmin/global-config` | Obtener configuración global | Superadmin |
| PUT | `/superadmin/global-config` | Actualizar configuración global | Superadmin |
| GET | `/superadmin/catalogs` | Listar catálogos globales | Superadmin |
| POST | `/superadmin/catalogs` | Crear catálogo | Superadmin |
| GET | `/superadmin/catalogs/{id}/items` | Items de un catálogo | Superadmin |
| POST | `/superadmin/catalogs/{id}/items` | Crear item de catálogo | Superadmin |
| GET | `/superadmin/statistics/global` | Estadísticas generales | Superadmin |
| GET | `/superadmin/logs` | Logs de actividad | Superadmin |
| GET | `/superadmin/audit` | Auditoría de acciones críticas | Superadmin |
| GET | `/superadmin/users` | Usuarios globales | Superadmin |
| POST | `/superadmin/users` | Crear usuario global | Superadmin |
| GET | `/superadmin/roles` | Listar roles y permisos | Superadmin |
| PUT | `/superadmin/roles/{id}/permissions` | Asignar permisos a rol | Superadmin |

---

## 3. Seguridad y Validación

### Rate Limiting

| Endpoint | Límite |
|----------|--------|
| `/auth/login` | 5 intentos por minuto por IP |
| `/driver/positions` | 60 requests por minuto por usuario |
| `/user/*` | 30 requests por minuto por IP |
| `/cooperative/*` | 60 requests por minuto por usuario |
| `/superadmin/*` | 120 requests por minuto por usuario |

### Validaciones Comunes

- Todos los endpoints POST/PUT validan entrada con Form Requests de Laravel
- Coordenadas: latitud [-90, 90], longitud [-180, 180], 7 decimales
- Fechas: ISO 8601 con timezone
- Paginación: page ≥ 1, per_page [1, 100]

### Códigos de Error HTTP por Endpoint

| Endpoint | 200 | 201 | 204 | 400 | 401 | 403 | 404 | 422 | 429 |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GET /user/* | ✓ | - | - | - | - | - | ✓ | - | ✓ |
| POST /auth/login | ✓ | - | - | - | - | - | - | ✓ | ✓ |
| POST /driver/journeys | - | ✓ | - | ✓ | ✓ | ✓ | - | ✓ | ✓ |
| PATCH /driver/journeys/active/finish | ✓ | - | - | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| POST /driver/positions | ✓ | - | - | ✓ | ✓ | ✓ | - | ✓ | ✓ |
| POST /driver/emergencies | - | ✓ | - | ✓ | ✓ | ✓ | - | ✓ | ✓ |
| POST /cooperative/vehicles | - | ✓ | - | - | ✓ | ✓ | - | ✓ | ✓ |
| PUT /cooperative/vehicles/{id} | ✓ | - | - | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| DELETE /cooperative/vehicles/{id} | - | - | ✓ | - | ✓ | ✓ | ✓ | - | ✓ |
| GET /cooperative/monitoring/* | ✓ | - | - | - | ✓ | ✓ | ✓ | - | ✓ |
| POST /superadmin/cooperatives | - | ✓ | - | - | ✓ | ✓ | - | ✓ | ✓ |
| GET /superadmin/logs | ✓ | - | - | ✓ | ✓ | ✓ | - | - | ✓ |

---

## 4. Middleware Pipeline

```
Request
  → TrimStrings
  → TrustProxies
  → CORS
  → RateLimit
  → JwtMiddleware (extrae y valida token)
    → [Si token válido]
      → TenantMiddleware (inyecta cooperative_id en request)
      → RoleMiddleware (verifica rol mínimo requerido)
      → PermissionMiddleware (verifica permiso específico si aplica)
        → Controller
          → FormRequest (validación)
            → Service (lógica de negocio)
              → Response
```

### Esquema de JWT Payload

```json
{
  "sub": 1,
  "name": "Pedro López",
  "email": "pedro@coop1.com",
  "role": "conductor",
  "cooperative_id": 1,
  "permissions": ["journey.start", "journey.finish", "emergency.create"],
  "iat": 1689300000,
  "exp": 1689300900
}
```
