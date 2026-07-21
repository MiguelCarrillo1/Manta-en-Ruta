# Manta en Ruta - Seguridad

## FASE 12: Diseño de Seguridad

---

## 1. Autenticación

### Estrategia
- **Mecanismo**: JWT (JSON Web Tokens) con access + refresh tokens
- **Librería Laravel**: `tymon/jwt-auth` o `laravel/sanctum` (modo stateless)
- **Algoritmo**: HS256 (HMAC-SHA256)
- **Almacenamiento**: Access token en memoria (app). Refresh token en `SecureStore` (expo-secure-store)

### Flujo de Autenticación

```
POST /api/v1/auth/login
├── Request: { email, password }
├── Validar credenciales contra tabla users
├── Verificar is_active = true
├── Generar access token (15 min)
│   Payload: { sub, name, email, role, cooperative_id, permissions[] }
├── Generar refresh token (7 días)
│   Almacenado en BD (tabla refresh_tokens) para revocación
├── Response: { access_token, refresh_token, expires_in, user, roles, cooperative }
└── Login fallido: contar intento → si > 5, bloquear 30 min
```

### Política de Contraseñas

| Requisito | Valor |
|-----------|-------|
| Longitud mínima | 8 caracteres |
| Mayúsculas | Al menos 1 |
| Minúsculas | Al menos 1 |
| Números | Al menos 1 |
| Caracteres especiales | Opcional |
| Hash | bcrypt (cost: 12) |
| Historial | No permitir últimas 5 contraseñas |
| Expiración | Opcional (configurable: 90 días) |

### Protección contra Fuerza Bruta

```
Login:
  - 5 intentos fallidos → bloqueo 30 min por email
  - 10 intentos fallidos → bloqueo 24h + notificación al usuario
  - Rate limit: 5 req/min por IP en /auth/login

Recuperación:
  - Token de recuperación: 1h de expiración
  - 3 solicitudes máximo por email en 24h
```

---

## 2. Autorización (RBAC)

### Modelo

```
Usuario → user_cooperative → Rol → role_permission → Permiso
                              ↑
                            (jerarquía por level)
```

### Jerarquía de Roles

| Nivel | Rol | Descripción |
|:-----:|-----|-------------|
| 1 | Superadministrador | Acceso total, cross-tenant |
| 2 | Gerente de Cooperativa | Full acceso a su tenant |
| 3 | Administrador de Cooperativa | Acceso operativo a su tenant |
| 4 | Operador | Monitoreo + alertas |
| 5 | Conductor | Solo su jornada |
| 6 | Usuario del Transporte | Solo consultas públicas |

### Middleware Pipeline

```php
// 1. JwtMiddleware: Valida token, extrae payload
// 2. TenantMiddleware: Establece cooperative_id en contexto
// 3. RoleMiddleware: Verifica nivel mínimo de rol
//    Ej: Route::middleware('role:gerente,admin')
// 4. PermissionMiddleware: Verifica permiso específico (opcional)
//    Ej: Route::middleware('permission:vehicles.create')
```

### Permisos (Ejemplos completos)

```
cooperatives.create    | superadmin
cooperatives.update    | superadmin
cooperatives.delete    | superadmin
vehicles.view          | gerente, admin, operador
vehicles.create        | gerente, admin
vehicles.update        | gerente, admin
vehicles.delete        | gerente, admin
drivers.view           | gerente, admin, operador
drivers.create         | gerente, admin
drivers.update         | gerente, admin
drivers.delete         | gerente, admin
lines.view             | gerente, admin, operador
lines.create           | gerente, admin
lines.update           | gerente, admin
lines.delete           | gerente, admin
stops.view             | gerente, admin, operador
stops.create           | gerente, admin
stops.update           | gerente, admin
stops.delete           | gerente, admin
monitoring.view        | gerente, admin, operador
alerts.view            | gerente, admin, operador
alerts.manage          | gerente, admin, operador
maintenance.view       | gerente, admin
maintenance.create     | gerente, admin
statistics.view        | superadmin, gerente, admin
reports.export         | gerente, admin
users.manage           | superadmin, gerente
config.update          | superadmin, gerente
journey.start          | conductor
journey.finish         | conductor
emergency.create       | conductor
fuel.create            | conductor
notes.create           | conductor
positions.send         | conductor
```

### Verificación de Permisos

```php
// En cada request:
$user = auth()->user();
$cooperativeId = request()->get('tenant_id');

// Verificar que el usuario pertenece a la cooperativa (si aplica)
if (!$user->isSuperAdmin()) {
    $userCooperative = $user->userCooperatives()
        ->where('cooperative_id', $cooperativeId)
        ->first();
    if (!$userCooperative) {
        abort(403, 'No pertenece a esta cooperativa');
    }
    // Cachear permisos del rol del usuario
    $permissions = cache()->remember(
        "user.{$user->id}.permissions",
        300,
        fn() => $userCooperative->role->permissions->pluck('name')
    );
}
```

---

## 3. JWT - Configuración

### Payload del Access Token

```json
{
  "sub": 1,
  "iss": "manta-en-ruta",
  "iat": 1689300000,
  "exp": 1689300900,
  "nbf": 1689300000,
  "jti": "unique-token-id",
  "user": {
    "id": 1,
    "name": "Pedro López",
    "email": "pedro@coop.com"
  },
  "role": "conductor",
  "role_level": 5,
  "cooperative_id": 1,
  "permissions": ["journey.start", "journey.finish", "positions.send", "emergency.create"]
}
```

### Refresh Tokens

```sql
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
```

### Ciclo de Vida

```
Access Token: 15 minutos (configurable)
Refresh Token: 7 días (configurable)

Renovación automática:
  - App detecta token próximo a expirar (< 5 min)
  - Llama a POST /auth/refresh con refresh_token
  - Recibe nuevo access_token + refresh_token rotado
  - Refresh token anterior se revoca (rotation)

Si refresh falla (expirado o revocado):
  - App borra tokens → redirige a login
```

---

## 4. Protección API (OWASP)

### Headers de Seguridad

```php
// Middleware SecurityHeaders.php
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('Content-Security-Policy: default-src \'self\'');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(self), camera=()');
```

### Rate Limiting

```php
// Laravel RateLimiter
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('auth', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});

RateLimiter::for('positions', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()->id);
});
```

### Validación de Entrada

```php
// Todas las entradas se validan con Form Requests de Laravel
// Ejemplo:
class StoreVehicleRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'plate' => 'required|string|max:20|regex:/^[A-Z0-9-]+$/',
            'brand' => 'required|string|max:100',
            'capacity' => 'nullable|integer|min:1|max:100',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ];
    }
}
```

### Protección contra Inyecciones

- **SQL**: Eloquent ORM (parameter binding automático). Queries raw prohibidas.
- **NoSQL**: PostgreSQL con sentencias preparadas.
- **XSS**: Respuestas JSON (no HTML). En frontend: React Native renderiza seguro (no dangerouslySetInnerHTML).
- **CSRF**: APIs stateless con JWT. No aplica CSRF tradicional.
- **IDOR**: Middleware TenantScope verifica que cada recurso pertenezca al cooperative_id del token.

---

## 5. Logs y Auditoría

### Logs de Actividad (Tabla `activity_logs`)

```sql
CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    cooperative_id BIGINT REFERENCES cooperatives(id),
    action VARCHAR(100) NOT NULL,       -- vehicle.created, journey.started, etc.
    description TEXT,
    metadata JSONB,                     -- { vehicle_id: 5, plate: "MNT-1234" }
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_cooperative ON activity_logs(cooperative_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);
```

### Auditoría de Acciones Críticas (Tabla `audit_trail`)

```sql
CREATE TABLE audit_trail (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,    -- cooperative.created, user.deleted, etc.
    entity_type VARCHAR(50) NOT NULL,    -- cooperative, user, vehicle
    entity_id BIGINT,
    previous_data JSONB,                 -- Snapshot antes del cambio
    new_data JSONB,                      -- Snapshot después del cambio
    ip_address INET NOT NULL,
    user_agent TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'info', -- info, warning, critical
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Acciones Consideradas Críticas (Auditoría Obligatoria)

| Acción | Severidad |
|--------|-----------|
| Crear cooperativa | info |
| Desactivar cooperativa | warning |
| Eliminar cooperativa | critical |
| Asignar/remover gerente | warning |
| Eliminar usuario | critical |
| Cambiar rol de usuario | warning |
| Modificar configuración global | info |
| Cambiar permisos de rol | warning |
| Desactivar vehículo | info |
| Eliminar conductor | warning |

### Retención

```
Activity logs: 90 días
Audit trail: 1 año
Posiciones GPS: 3 meses (luego resumen)
```

---

## 6. Seguridad GPS

### Ofuscación de Coordenadas

```php
class GpsService
{
    // Para usuarios del transporte: ±0.002° (~200m)
    public function obfuscate(float $lat, float $lng): array
    {
        $noiseLat = ($this->randomFloat() - 0.5) * 0.004;
        $noiseLng = ($this->randomFloat() - 0.5) * 0.004;
        return [
            'latitude' => round($lat + $noiseLat, 7),
            'longitude' => round($lng + $noiseLng, 7),
        ];
    }
}
```

### Transmisión Segura

- **HTTPS obligatorio** para todas las comunicaciones API
- Certificados SSL/TLS con Let's Encrypt (renovación automática)
- Cifrado en reposo para datos sensibles (coordenadas exactas, datos personales)

---

## 7. Protección Multi-tenant

### Aislamiento de Datos

```php
// TenantMiddleware.php
public function handle(Request $request, Closure $next)
{
    $cooperativeId = auth()->payload()->get('cooperative_id');

    // Superadmin puede acceder a todas
    if (auth()->payload()->get('role') === 'superadmin') {
        return $next($request);
    }

    // Forzar cooperative_id en request
    $request->merge(['tenant_cooperative_id' => $cooperativeId]);

    return $next($request);
}

// TenantScoped.php (Trait usado en modelos)
public function scopeTenant(Builder $query, ?int $cooperativeId = null): Builder
{
    $cooperativeId ??= request()->get('tenant_cooperative_id');
    if ($cooperativeId) {
        return $query->where('cooperative_id', $cooperativeId);
    }
    return $query;
}
```

### Validación de Pertenencia

```php
// Cada controlador verifica que el recurso pertenece a la cooperativa
$vehicle = Vehicle::where('id', $id)
    ->where('cooperative_id', request('tenant_cooperative_id'))
    ->firstOrFail();
```

---

## 8. Seguridad en Frontend

### Almacenamiento Seguro

```typescript
// expo-secure-store para tokens
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('access_token', token);
await SecureStore.setItemAsync('refresh_token', refreshToken);

// AsyncStorage solo para datos no sensibles (caché offline)
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('cached_lines', JSON.stringify(lines));
```

### Protección de Rutas

```typescript
// app/_layout.tsx - Root Layout
const { role, isLoading } = useAuth();

if (isLoading) return <SplashScreen />;
if (!role) return <Redirect href="/auth/login" />;

// Redirigir según rol
if (role === 'conductor') return <Redirect href="/(driver)" />;
if (role === 'usuario') return <Redirect href="/(user)" />;
// etc.
```

### Validación en Cliente

```typescript
// Interceptor Axios
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Intentar refresh
            const refreshed = await authStore.refreshAccessToken();
            if (refreshed) {
                // Reintentar request original
                error.config.headers.Authorization = `Bearer ${authStore.token}`;
                return api(error.config);
            }
            // Si no, logout
            authStore.logout();
        }
        if (error.response?.status === 403) {
            // No autorizado: mostrar alerta
            Alert.alert('Acceso denegado', 'No tienes permiso para esta acción');
        }
        return Promise.reject(error);
    }
);
```

---

## 9. Checklist de Seguridad OWASP

| # | Práctica | Estado |
|---|----------|--------|
| A1 | Control de acceso (RBAC + Tenant) | ✅ Implementado |
| A2 | Criptografía (bcrypt, JWT HS256, HTTPS) | ✅ Implementado |
| A3 | Inyección (ORM, parametrización) | ✅ Implementado |
| A4 | Validación de entrada (Form Requests) | ✅ Implementado |
| A5 | Exposición de datos (GPS ofuscado, respuestas filtradas) | ✅ Implementado |
| A6 | Logging y monitoreo (activity_logs, audit_trail) | ✅ Implementado |
| A7 | Rate limiting (por endpoint y rol) | ✅ Implementado |
| A8 | Seguridad en APIs (CORS, headers, JWT rotation) | ✅ Implementado |
| A9 | Autenticación segura (bloqueo, recovery, 2FA opcional futuro) | ✅ Implementado |
| A10 | Manejo de sesiones (stateless JWT, refresh rotation) | ✅ Implementado |
