# Manta en Ruta - Modelado del Negocio

## FASE 3: Modelado del Negocio

---

## Reglas del Negocio

| ID | Regla | Clasificación |
|----|-------|---------------|
| RN-01 | Una unidad solamente será visible para el público (usuarios) cuando su jornada esté activa | Restricción operativa |
| RN-02 | El GPS exacto de las unidades solo podrá visualizarlo la cooperativa (roles: gerente, admin, operador) | Seguridad |
| RN-03 | Los pasajeros únicamente verán información aproximada de posición del bus | Seguridad |
| RN-04 | El sistema permitirá buscar un destino sin necesidad de conocer la línea de bus | Funcional |
| RN-05 | Las búsquedas podrán realizarse por: línea, lugar de interés o punto en el mapa | Funcional |
| RN-06 | El sistema clasificará resultados según: distancia restante del recorrido, sentido de la ruta y distancia entre el recorrido y el destino | Funcional |
| RN-07 | Si una línea no pasa exactamente por el destino, podrá sugerirse cuando pase a menos de 200 metros | Funcional |
| RN-08 | El indicador principal será la distancia; el tiempo estimado será solo referencia secundaria | Funcional |
| RN-09 | Cada cooperativa únicamente visualiza y administra su propia información (multi-tenant) | Arquitectura |
| RN-10 | Un conductor solo puede tener una jornada activa a la vez | Operativa |
| RN-11 | Una unidad solo puede tener un conductor asignado por jornada | Operativa |
| RN-12 | No se puede iniciar jornada sin seleccionar un vehículo y registrar kilometraje inicial | Operativa |
| RN-13 | No se puede finalizar jornada sin registrar kilometraje final | Operativa |
| RN-14 | El kilometraje final debe ser mayor o igual al kilometraje inicial | Validación |
| RN-15 | Un reporte de emergencia tiene prioridad máxima sobre cualquier otra acción del conductor | Operativa |
| RN-16 | Las alertas deben ser atendidas por un operador antes de cerrarse | Operativa |
| RN-17 | Un superadministrador puede gestionar todas las cooperativas; un gerente solo la suya | Seguridad |
| RN-18 | Los roles dentro de una cooperativa son jerárquicos: gerente > admin > operador > conductor | Seguridad |
| RN-19 | Un administrador de cooperativa no puede crear otros administradores (solo el gerente) | Seguridad |
| RN-20 | Los mantenimientos deben registrarse con fecha, kilometraje y costo asociado | Operativa |

---

## Estados del Sistema

### Estado de Jornada (Conductor)
```
Inactiva → Activa → Finalizada
                    ↘ Emergencia → Finalizada
                    ↘ Avería → Activa (si continúa) o Finalizada (si termina)
```

### Estado de Unidad (Vehículo)
```
Disponible → En Jornada → En Mantenimiento
            ↘ En Jornada → Averiada → En Mantenimiento
            ↘ En Jornada → Emergencia → Disponible (tras protocolo)
```

### Estado de Alerta
```
Generada → Atendida → Cerrada
         ↘ Escalada → Cerrada
```

### Estado de Conductor
```
Disponible → En Jornada → Descanso
                          ↘ Disponible
```

---

## Flujos Principales

### Flujo 1: Búsqueda de Transporte (Usuario)

```
[Usuario abre app] 
    → [Selecciona método de búsqueda: texto | mapa | lugar de interés]
    → [Ingresa destino]
    → [Sistema consulta líneas activas que pasan por el destino o a <200m]
    → [Sistema obtiene unidades activas en esas líneas]
    → [Calcula distancia restante de cada unidad al destino]
    → [Ordena resultados por distancia ascendente]
    → [Muestra lista de buses con: línea, distancia restante, tiempo estimado]
    → [Usuario selecciona un bus]
    → [Muestra posición aproximada en mapa + paradas oficiales]
```

### Flujo 2: Jornada de Conductor

```
[Conductor inicia sesión]
    → [Selecciona vehículo de su lista asignada]
    → [Registra kilometraje inicial]
    → [Inicia jornada → GPS comienza a enviar posición]
    → [Durante jornada puede:]
    │   ├─ Registrar combustible
    │   ├─ Registrar notas
    │   ├─ Cambiar estado AC
    │   ├─ Cambiar estado WiFi
    │   └─ Reportar avería o emergencia
    → [Finaliza jornada]
    → [Registra kilometraje final]
    → [Sistema valida km final ≥ km inicial]
    → [Jornada cerrada]
```

### Flujo 3: Monitoreo de Cooperativa

```
[Operador abre dashboard]
    → [Mapa muestra todas las unidades activas con posición exacta]
    → [Cada unidad muestra: placa, conductor, estado, velocidad]
    → [Si hay alertas:]
    │   ├─ Alerta de emergencia → resalte rojo → operador atiende
    │   └─ Alerta de avería → resalte amarillo → operador evalúa
    → [Operador puede ver detalles de cualquier unidad]
    → [Operador cierra alertas atendidas]
```

### Flujo 4: Mantenimiento de Unidad

```
[Admin de cooperativa accede a módulo de mantenimiento]
    → [Selecciona vehículo]
    → [Visualiza historial de mantenimientos]
    → [Registra nuevo mantenimiento:]
    │   ├─ Cambio de aceite
    │   ├─ Cambio de filtros
    │   ├─ Cambio de neumáticos
    │   └─ Reparación general
    → [Ingresa: fecha, kilometraje, costo, descripción, proveedor]
    → [Sistema actualiza historial del vehículo]
```

---

## Diagrama de Casos de Uso (Narrativo)

### Actor: Usuario del Transporte

| CU-01 | Consultar líneas disponibles |
|-------|------------------------------|
| Descripción | El usuario visualiza todas las líneas de transporte activas |
| Precondición | Ninguna |
| Postcondición | El sistema muestra lista de líneas |
| Flujo | 1. Usuario abre app 2. Selecciona "Líneas" 3. Sistema muestra líneas activas con nombre y ruta |

| CU-02 | Buscar destino |
|-------|---------------|
| Descripción | El usuario busca un destino por texto, mapa o lugar de interés |
| Precondición | Ninguna |
| Postcondición | El sistema muestra buses recomendados para ese destino |
| Flujo | 1. Usuario ingresa destino 2. Sistema busca líneas que pasan por el destino 3. Obtiene unidades activas 4. Ordena por distancia restante 5. Muestra resultados |

| CU-03 | Visualizar mapa con unidades |
|-------|------------------------------|
| Descripción | El usuario ve en el mapa la posición aproximada de los buses activos |
| Precondición | Permiso de ubicación concedido |
| Postcondición | Mapa muestra unidades activas cercanas |
| Flujo | 1. Usuario abre mapa 2. Sistema muestra posición aproximada de unidades activas 3. Usuario puede seleccionar una unidad para ver detalles |

### Actor: Conductor

| CU-04 | Iniciar jornada |
|-------|-----------------|
| Descripción | El conductor inicia su jornada laboral |
| Precondición | Conductor autenticado, vehículo asignado, sin jornada activa |
| Postcondición | Jornada activa, GPS transmitiendo posición |
| Flujo | 1. Conductor selecciona "Iniciar jornada" 2. Selecciona vehículo 3. Registra km inicial 4. Confirma inicio 5. Sistema activa jornada |

| CU-05 | Reportar emergencia |
|-------|---------------------|
| Descripción | El conductor reporta una emergencia (robo, asalto, accidente) |
| Precondición | Jornada activa |
| Postcondición | Alerta de emergencia generada, operador notificado |
| Flujo | 1. Conductor presiona "Emergencia" 2. Selecciona tipo 3. Confirma 4. Sistema genera alerta prioritaria 5. Operador recibe notificación |

| CU-06 | Finalizar jornada |
|-------|-------------------|
| Descripción | El conductor finaliza su jornada |
| Precondición | Jornada activa |
| Postcondición | Jornada cerrada, GPS detenido |
| Flujo | 1. Conductor selecciona "Finalizar jornada" 2. Registra km final 3. Sistema valida datos 4. Cierra jornada 5. Unidad deja de ser visible al público |

### Actor: Administrador de Cooperativa

| CU-07 | Gestionar vehículos |
|-------|---------------------|
| Descripción | El admin administra los vehículos de la cooperativa |
| Precondición | Autenticado con rol admin o gerente |
| Postcondición | Vehículo creado/editado/desactivado |
| Flujo | 1. Admin accede a "Vehículos" 2. CRUD de vehículos 3. Asigna conductores 4. Guarda cambios |

| CU-08 | Ver estadísticas |
|-------|------------------|
| Descripción | El admin consulta estadísticas operativas |
| Precondición | Autenticado |
| Postcondición | Dashboard con indicadores |
| Flujo | 1. Admin accede a "Estadísticas" 2. Selecciona período 3. Sistema muestra km, consumo, mantenimientos, incidentes |

### Actor: Superadministrador

| CU-09 | Gestionar cooperativas |
|-------|------------------------|
| Descripción | El superadmin crea y administra cooperativas en la plataforma |
| Precondición | Autenticado como superadmin |
| Postcondición | Cooperativa creada/configurada |
| Flujo | 1. Superadmin accede a "Cooperativas" 2. Crea nueva cooperativa 3. Configura parámetros 4. Asigna gerente 5. Cooperativa activa en plataforma |

---

## Matriz de Roles vs. Casos de Uso

| Caso de Uso | Superadmin | Gerente | Admin | Operador | Conductor | Usuario |
|-------------|:----------:|:-------:|:-----:|:--------:|:---------:|:-------:|
| Gestionar cooperativas | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Configurar plataforma | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Gestionar admins coop | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Gestionar vehículos | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Gestionar conductores | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Gestionar rutas/paradas | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Monitorear unidades | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Gestionar alertas | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Iniciar/finalizar jornada | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Reportar emergencia | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Consultar rutas/buses | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Buscar destino | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Ver estadísticas | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Gestionar mantenimiento | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |

---

## Procesos Transversales

### Proceso de Autenticación y Autorización
```
[Usuario] → [Login con credenciales] → [JWT emitido con rol y tenant_id]
           → [Cada request valida JWT + permisos del rol + tenant]
           → [Acceso concedido o denegado]
```

### Proceso de Transmisión GPS
```
[App Conductor] → [Cada N segundos obtiene coordenadas GPS]
                → [Envía a API: {vehiculo_id, lat, lng, timestamp}]
                → [Backend almacena en tabla posiciones]
                → [Usuarios consultan: backend devuelve posición ofuscada ±0.002°]
                → [Cooperativa consulta: backend devuelve posición exacta]
```

### Proceso Multi-tenant
```
[Request entrante] → [Middleware extrae tenant_id del JWT]
                   → [Todas las consultas SQL filtran por tenant_id]
                   → [Datos devueltos: solo del tenant autorizado]
                   → [Superadmin puede omitir filtro tenant]
```
