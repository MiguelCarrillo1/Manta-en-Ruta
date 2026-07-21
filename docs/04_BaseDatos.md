# Manta en Ruta - Base de Datos

## FASE 5: Diseño de Base de Datos PostgreSQL

---

## 1. Modelo Entidad-Relación (Descripción)

### Entidades Globales (sin cooperative_id)

| Entidad | Descripción |
|---------|-------------|
| `cooperatives` | Cooperativas de transporte registradas en la plataforma |
| `roles` | Catálogo de roles del sistema (6 roles) |
| `permissions` | Catálogo de permisos disponibles |
| `role_permission` | Pivote: qué permisos tiene cada rol |
| `users` | Usuarios del sistema (todos los roles excepto usuario transporte) |
| `global_catalogs` | Catálogos globales configurables por superadmin |
| `catalog_items` | Items de cada catálogo global |

### Entidades por Cooperativa (con cooperative_id)

| Entidad | Descripción |
|---------|-------------|
| `user_cooperative` | Pivote: usuarios asociados a cooperativas con su rol |
| `vehicles` | Unidades de transporte de la cooperativa |
| `drivers` | Conductores registrados |
| `vehicle_driver` | Asignación conductor-vehículo |
| `lines` | Líneas de transporte (ej: Línea 8, Línea 12) |
| `stops` | Paradas oficiales |
| `line_stop` | Pivote ordenado: paradas de cada línea (orden secuencial) |
| `route_segments` | Segmentos de ruta entre paradas (polilínea) |
| `points_of_interest` | Lugares de interés asociados a rutas |
| `journeys` | Jornadas de conductores |
| `positions` | Posiciones GPS durante jornada |
| `fuel_records` | Registros de combustible |
| `maintenance_records` | Registros de mantenimiento |
| `maintenance_types` | Tipos de mantenimiento (aceite, filtros, neumáticos, reparación) |
| `maintenance_details` | Detalle de cada mantenimiento |
| `emergencies` | Reportes de emergencia |
| `alerts` | Alertas del sistema |
| `alert_types` | Tipos de alerta |
| `notes` | Notas registradas por conductores |
| `incidents` | Incidencias reportadas |

---

## 2. Diccionario de Tablas

### cooperatives

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | Identificador único |
| name | VARCHAR(200) | NOT NULL | Nombre de la cooperativa |
| slug | VARCHAR(200) | UNIQUE, NOT NULL | Slug para URLs |
| ruc | VARCHAR(13) | UNIQUE, NOT NULL | RUC ecuatoriano |
| phone | VARCHAR(20) | NULL | Teléfono de contacto |
| email | VARCHAR(200) | NULL | Email de contacto |
| address | TEXT | NULL | Dirección |
| logo_url | VARCHAR(500) | NULL | Logo de la cooperativa |
| scope | VARCHAR(20) | NOT NULL, DEFAULT 'urban' | urban, intercantonal, interprovincial |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Estado de la cooperativa |
| config | JSONB | NOT NULL, DEFAULT '{}' | Configuración propia (horarios, parámetros) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete |

**Índices**: `idx_cooperatives_slug`, `idx_cooperatives_scope`

---

### roles

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | SMALLSERIAL | PK | |
| name | VARCHAR(50) | UNIQUE, NOT NULL | superadmin, gerente, admin, operador, conductor, usuario |
| display_name | VARCHAR(100) | NOT NULL | Nombre legible |
| level | SMALLINT | NOT NULL | Nivel jerárquico (1=superadmin...6=usuario) |
| description | TEXT | NULL | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Datos precargados**: Los 6 roles se insertan en la primera migración.

---

### permissions

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | SMALLSERIAL | PK | |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Ej: vehicles.create |
| display_name | VARCHAR(200) | NOT NULL | |
| module | VARCHAR(50) | NOT NULL | Módulo al que pertenece |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

---

### role_permission

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| role_id | SMALLINT | PK, FK → roles.id |
| permission_id | SMALLINT | PK, FK → permissions.id |

---

### users

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| name | VARCHAR(200) | NOT NULL | |
| email | VARCHAR(200) | UNIQUE, NOT NULL | |
| password | VARCHAR(255) | NOT NULL | Hash bcrypt |
| phone | VARCHAR(20) | NULL | |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |
| email_verified_at | TIMESTAMPTZ | NULL | |
| last_login_at | TIMESTAMPTZ | NULL | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete |

**Índices**: `idx_users_email`

---

### user_cooperative

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| user_id | BIGINT | FK → users.id | |
| cooperative_id | BIGINT | FK → cooperatives.id | |
| role_id | SMALLINT | FK → roles.id | Rol del usuario en esta cooperativa |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |
| assigned_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deactivated_at | TIMESTAMPTZ | NULL | |

**Índices**: `idx_user_cooperative_user`, `idx_user_cooperative_coop`
**Unique**: UNIQUE(user_id, cooperative_id) — un usuario solo una vez por cooperativa

---

### vehicles

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| plate | VARCHAR(20) | NOT NULL | Placa ecuatoriana |
| brand | VARCHAR(100) | NOT NULL | Marca |
| model | VARCHAR(100) | NOT NULL | Modelo |
| year | SMALLINT | NULL | Año de fabricación |
| capacity | SMALLINT | NULL | Capacidad de pasajeros |
| color | VARCHAR(50) | NULL | |
| has_ac | BOOLEAN | NOT NULL, DEFAULT false | Tiene aire acondicionado |
| has_wifi | BOOLEAN | NOT NULL, DEFAULT false | Tiene WiFi |
| ac_status | BOOLEAN | NULL | Estado actual del AC (solo durante jornada) |
| wifi_status | BOOLEAN | NULL | Estado actual del WiFi (solo durante jornada) |
| last_known_lat | DECIMAL(10,7) | NULL | Última posición conocida (caché) |
| last_known_lng | DECIMAL(10,7) | NULL | |
| last_position_at | TIMESTAMPTZ | NULL | |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'available' | available, in_journey, maintenance, out_of_service |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULL | |

**Índices**: `idx_vehicles_cooperative`, `idx_vehicles_plate`, `idx_vehicles_status`

---

### drivers

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| user_id | BIGINT | FK → users.id, NULL | Relación con usuario del sistema (opcional para conductores sin app) |
| full_name | VARCHAR(200) | NOT NULL | |
| license_number | VARCHAR(50) | NOT NULL | Número de licencia |
| license_type | VARCHAR(20) | NOT NULL | Tipo de licencia (B, C, D, E, etc.) |
| license_expires_at | DATE | NULL | Fecha de vencimiento de licencia |
| phone | VARCHAR(20) | NULL | |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULL | |

**Índices**: `idx_drivers_cooperative`

---

### vehicle_driver

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| vehicle_id | BIGINT | FK → vehicles.id | |
| driver_id | BIGINT | FK → drivers.id | |
| is_primary | BOOLEAN | NOT NULL, DEFAULT false | Conductor principal |
| assigned_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| unassigned_at | TIMESTAMPTZ | NULL | |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |

**Índices**: `idx_vehicle_driver_vehicle`, `idx_vehicle_driver_driver`
**Unique**: UNIQUE(vehicle_id, driver_id, is_active) — una asignación activa por par

---

### lines

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| name | VARCHAR(100) | NOT NULL | Nombre o número de línea (ej: "Línea 8") |
| code | VARCHAR(20) | NOT NULL | Código corto (ej: "L8") |
| description | TEXT | NULL | Descripción de la ruta |
| color | VARCHAR(7) | NULL | Color hexadecimal para representación en mapa |
| direction | VARCHAR(10) | NOT NULL, DEFAULT 'outbound' | outbound (ida), inbound (vuelta) |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULL | |

**Índices**: `idx_lines_cooperative`
**Unique**: UNIQUE(cooperative_id, code)

---

### stops

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| name | VARCHAR(200) | NOT NULL | Nombre de la parada |
| address | TEXT | NULL | Dirección referencial |
| latitude | DECIMAL(10,7) | NOT NULL | Latitud exacta |
| longitude | DECIMAL(10,7) | NOT NULL | Longitud exacta |
| location | GEOGRAPHY(Point, 4326) | NULL | Tipo PostGIS para consultas espaciales |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULL | |

**Índices**: `idx_stops_cooperative`, `idx_stops_location` (GIST sobre location)

---

### line_stop

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| line_id | BIGINT | FK → lines.id | |
| stop_id | BIGINT | FK → stops.id | |
| order | SMALLINT | NOT NULL | Orden de la parada en la ruta |
| distance_from_prev | DECIMAL(10,2) | NULL | Distancia en km desde la parada anterior |
| estimated_minutes_from_prev | SMALLINT | NULL | Tiempo estimado desde la parada anterior |

**Índices**: `idx_line_stop_line`
**Unique**: UNIQUE(line_id, stop_id)

---

### route_segments

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| line_id | BIGINT | FK → lines.id | |
| sequence | SMALLINT | NOT NULL | Orden del segmento |
| start_stop_id | BIGINT | FK → stops.id | Parada de inicio |
| end_stop_id | BIGINT | FK → stops.id | Parada de fin |
| polyline | TEXT | NULL | Polilínea codificada (encoded polyline) |
| distance_km | DECIMAL(10,2) | NULL | Distancia del segmento |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Índices**: `idx_route_segments_line`

---

### points_of_interest

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| name | VARCHAR(200) | NOT NULL | Nombre del lugar |
| category | VARCHAR(50) | NOT NULL | hospital, mercado, universidad, parque, terminal, etc. |
| address | TEXT | NULL | |
| latitude | DECIMAL(10,7) | NOT NULL | |
| longitude | DECIMAL(10,7) | NOT NULL | |
| location | GEOGRAPHY(Point, 4326) | NULL | |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULL | |

**Índices**: `idx_poi_cooperative`, `idx_poi_location` (GIST), `idx_poi_category`

---

### journeys

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| vehicle_id | BIGINT | FK → vehicles.id | |
| driver_id | BIGINT | FK → drivers.id | |
| start_km | INTEGER | NOT NULL | Kilometraje al inicio |
| end_km | INTEGER | NULL | Kilometraje al final |
| start_at | TIMESTAMPTZ | NOT NULL | Inicio de jornada |
| end_at | TIMESTAMPTZ | NULL | Fin de jornada |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | active, finished, cancelled, emergency |
| total_distance_km | DECIMAL(10,2) | NULL | Calculado al finalizar |
| total_fuel_liters | DECIMAL(10,2) | NULL | Sumarizado al finalizar |
| notes_summary | TEXT | NULL | Resumen de notas |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Índices**: `idx_journeys_cooperative`, `idx_journeys_vehicle`, `idx_journeys_driver`, `idx_journeys_status`, `idx_journeys_start_at`
**Unique**: UNIQUE(vehicle_id, status) WHERE status = 'active' — solo una jornada activa por vehículo

---

### positions

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| vehicle_id | BIGINT | FK → vehicles.id | |
| journey_id | BIGINT | FK → journeys.id | |
| latitude | DECIMAL(10,7) | NOT NULL | |
| longitude | DECIMAL(10,7) | NOT NULL | |
| location | GEOGRAPHY(Point, 4326) | NULL | |
| speed | DECIMAL(5,2) | NULL | Velocidad en km/h |
| heading | SMALLINT | NULL | Rumbo en grados (0-360) |
| accuracy | DECIMAL(5,2) | NULL | Precisión en metros |
| recorded_at | TIMESTAMPTZ | NOT NULL | Timestamp del dispositivo |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Índices**: `idx_positions_vehicle`, `idx_positions_journey`, `idx_positions_recorded_at`, `idx_positions_location` (GIST)
**Partición**: Por rango de `recorded_at` (por mes)
**Retención**: Datos > 3 meses se resumen y eliminan

---

### fuel_records

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| vehicle_id | BIGINT | FK → vehicles.id | |
| journey_id | BIGINT | FK → journeys.id | |
| driver_id | BIGINT | FK → drivers.id | |
| liters | DECIMAL(10,2) | NOT NULL | Cantidad en litros |
| cost | DECIMAL(10,2) | NULL | Costo total |
| provider | VARCHAR(200) | NULL | Proveedor/gasolinera |
| current_km | INTEGER | NULL | Kilometraje al momento de la carga |
| recorded_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Índices**: `idx_fuel_vehicle`, `idx_fuel_journey`, `idx_fuel_recorded_at`

---

### maintenance_types

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | SMALLSERIAL | PK | |
| name | VARCHAR(100) | UNIQUE, NOT NULL | oil_change, filter_change, tires, repair |
| display_name | VARCHAR(200) | NOT NULL | |

**Datos precargados**: Cambio de aceite, Cambio de filtros, Neumáticos, Reparación general

---

### maintenance_records

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| vehicle_id | BIGINT | FK → vehicles.id | |
| maintenance_type_id | SMALLINT | FK → maintenance_types.id | |
| description | TEXT | NULL | Descripción detallada |
| current_km | INTEGER | NOT NULL | Kilometraje al momento del mantenimiento |
| cost | DECIMAL(10,2) | NULL | Costo total |
| provider | VARCHAR(200) | NULL | Proveedor/taller |
| performed_at | DATE | NOT NULL | Fecha del mantenimiento |
| next_maintenance_km | INTEGER | NULL | Kilometraje sugerido para próximo mantenimiento |
| created_by | BIGINT | FK → users.id | Usuario que registró |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Índices**: `idx_mt_vehicle`, `idx_mt_type`, `idx_mt_performed_at`

---

### emergency_types

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | SMALLSERIAL | PK | |
| name | VARCHAR(100) | UNIQUE, NOT NULL | mechanical_breakdown, robbery, assault, accident, other |
| display_name | VARCHAR(200) | NOT NULL | |

---

### emergencies

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| vehicle_id | BIGINT | FK → vehicles.id | |
| journey_id | BIGINT | FK → journeys.id | |
| driver_id | BIGINT | FK → drivers.id | |
| emergency_type_id | SMALLINT | FK → emergency_types.id | |
| description | TEXT | NULL | |
| latitude | DECIMAL(10,7) | NULL | Posición al momento de la emergencia |
| longitude | DECIMAL(10,7) | NULL | |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'reported' | reported, attending, resolved |
| attended_by | BIGINT | FK → users.id, NULL | Operador que atendió |
| resolution_notes | TEXT | NULL | |
| reported_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| attended_at | TIMESTAMPTZ | NULL | |
| resolved_at | TIMESTAMPTZ | NULL | |

**Índices**: `idx_emergencies_vehicle`, `idx_emergencies_status`, `idx_emergencies_reported_at`

---

### alerts

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| alert_type_id | SMALLINT | FK → alert_types.id | |
| vehicle_id | BIGINT | FK → vehicles.id, NULL | |
| journey_id | BIGINT | FK → journeys.id, NULL | |
| title | VARCHAR(200) | NOT NULL | |
| description | TEXT | NULL | |
| severity | VARCHAR(20) | NOT NULL, DEFAULT 'info' | info, warning, critical |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'generated' | generated, attending, resolved, escalated |
| assigned_to | BIGINT | FK → users.id, NULL | |
| resolved_by | BIGINT | FK → users.id, NULL | |
| resolved_at | TIMESTAMPTZ | NULL | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Índices**: `idx_alerts_cooperative`, `idx_alerts_status`, `idx_alerts_severity`

---

### alert_types

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | SMALLSERIAL | PK |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| display_name | VARCHAR(200) | NOT NULL |

---

### notes

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | |
| cooperative_id | BIGINT | FK, NOT NULL | |
| vehicle_id | BIGINT | FK → vehicles.id | |
| journey_id | BIGINT | FK → journeys.id | |
| driver_id | BIGINT | FK → drivers.id | |
| content | TEXT | NOT NULL | |
| note_type | VARCHAR(50) | NOT NULL, DEFAULT 'general' | general, incident, observation |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Índices**: `idx_notes_journey`

---

### global_catalogs

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | SMALLSERIAL | PK | |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Ej: vehicle_types, fuel_types |
| display_name | VARCHAR(200) | NOT NULL | |
| description | TEXT | NULL | |

---

### catalog_items

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | SMALLSERIAL | PK | |
| catalog_id | SMALLINT | FK → global_catalogs.id | |
| code | VARCHAR(50) | NOT NULL | |
| value | VARCHAR(200) | NOT NULL | |
| order | SMALLINT | NOT NULL, DEFAULT 0 | |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |

**Índices**: `idx_catalog_items_catalog`
**Unique**: UNIQUE(catalog_id, code)

---

## 3. Relaciones Clave (Diagrama de Referencias)

```
cooperatives ─1:N→ vehicles
cooperatives ─1:N→ drivers
cooperatives ─1:N→ lines
cooperatives ─1:N→ stops
cooperatives ─1:N→ points_of_interest
cooperatives ─1:N→ journeys
cooperatives ─1:N→ positions
cooperatives ─1:N→ fuel_records
cooperatives ─1:N→ maintenance_records
cooperatives ─1:N→ emergencies
cooperatives ─1:N→ alerts
cooperatives ─1:N→ notes

users ─N:M→ cooperatives (via user_cooperative)
users ─N:M→ roles (via user_cooperative.role_id)

vehicles ─1:N→ journeys
vehicles ─1:N→ positions
vehicles ─1:N→ fuel_records
vehicles ─1:N→ maintenance_records
vehicles ─1:N→ emergencies
vehicles ─1:N→ vehicle_driver

drivers ─1:N→ journeys
drivers ─1:N→ fuel_records
drivers ─1:N→ emergencies
drivers ─1:N→ vehicle_driver

lines ─N:M→ stops (via line_stop, ordenado)
lines ─1:N→ route_segments

journeys ─1:N→ positions
journeys ─1:N→ fuel_records
journeys ─1:N→ emergencies
journeys ─1:N→ notes
```

---

## 4. Normalización

La base de datos está en **3FN (Tercera Forma Normal)**:

- **1FN**: Todos los campos son atómicos. No hay grupos repetitivos. Ej: las posiciones GPS son registros individuales, no arrays.
- **2FN**: Cada tabla tiene una clave primaria simple (id). No hay dependencias parciales. Ej: en `journey`, todos los campos dependen de `journey_id`.
- **3FN**: No hay dependencias transitivas. Ej: en `vehicles`, `cooperative_id` depende de `vehicle_id` (PK), no de otro campo. `ac_status` depende directamente del vehículo.

### Desnormalización Intencional

- `vehicles.last_known_lat/lng`: Se almacena la última posición conocida para evitar JOIN con `positions` en consultas de listado de unidades. Se actualiza con cada nueva posición GPS.
- `journeys.total_distance_km` y `total_fuel_liters`: Campos calculados pre-agregados para evitar consultas pesadas en reportes. Se calculan al finalizar la jornada.

---

## 5. Índices y Optimización

### Índices Espaciales (PostGIS)

```sql
-- Búsqueda de paradas cercanas a un punto
CREATE INDEX idx_stops_location ON stops USING GIST (location);
-- Búsqueda de POIs cercanos
CREATE INDEX idx_poi_location ON points_of_interest USING GIST (location);
-- Búsqueda de posiciones por área
CREATE INDEX idx_positions_location ON positions USING GIST (location);
```

### Índices Compuestos

```sql
-- Consultas frecuentes: posiciones por vehículo y tiempo
CREATE INDEX idx_positions_vehicle_time ON positions (vehicle_id, recorded_at);
-- Jornadas activas por cooperativa
CREATE INDEX idx_journeys_coop_status ON journeys (cooperative_id, status);
-- Alertas por cooperativa y estado
CREATE INDEX idx_alerts_coop_status ON alerts (cooperative_id, status);
```

### Particionamiento

```sql
-- Tabla positions particionada por mes
CREATE TABLE positions (
    ...
) PARTITION BY RANGE (recorded_at);

CREATE TABLE positions_2026_01 PARTITION OF positions
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE positions_2026_02 PARTITION OF positions
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- etc.
```

---

## 6. Justificación de Entidades

### Entidades Principales

| Entidad | Justificación |
|---------|---------------|
| `cooperatives` | Base del multi-tenant. Cada cooperativa es un tenant independiente. |
| `users` | Centraliza todos los usuarios del sistema (admins, conductores). Separado de `drivers` porque un conductor puede no tener acceso digital. |
| `drivers` | Entidad separada de `users` porque un conductor puede existir sin usuario de sistema (registro manual). |
| `vehicles` | Núcleo operativo. Todos los módulos giran en torno a unidades de transporte. |

### Entidades de Rutas

| Entidad | Justificación |
|---------|---------------|
| `lines` | Representa una línea de transporte (concepto real del negocio). Separada de rutas porque una línea puede tener ida y vuelta. |
| `stops` | Paradas físicas. Se reutilizan entre líneas. La relación N:M con orden (`line_stop`) permite flexibilidad. |
| `route_segments` | Almacena la polilínea entre paradas para dibujar la ruta exacta en el mapa. |

### Entidades Operativas

| Entidad | Justificación |
|---------|---------------|
| `journeys` | Registro de cada jornada laboral, vinculando conductor, vehículo y período. |
| `positions` | Core del GPS. Volumen alto —particionada por mes— para consultas históricas y tiempo real. |
| `fuel_records` | Seguimiento de combustible, clave para estadísticas de costos y consumo. |

### Entidades de Incidencias

| Entidad | Justificación |
|---------|---------------|
| `emergencies` | Separada de `alerts` porque una emergencia tiene flujo y datos específicos (posición, tipo, resolución). |
| `alerts` | Sistema genérico de alertas que puede originarse de emergencias, mantenimientos, o eventos del sistema. |

### Entidades de Soporte

| Entidad | Justificación |
|---------|---------------|
| `global_catalogs` + `catalog_items` | Sistema genérico de catálogos configurables por superadmin. Evita crear tablas nuevas para cada tipo de catálogo. |
| `user_cooperative` | Pivote que asigna usuarios a cooperativas con un rol específico, permitiendo que un usuario pertenezca a múltiples cooperativas (caso superadmin). |
| `role_permission` | RBAC flexible: roles y permisos configurables sin cambiar código. |
