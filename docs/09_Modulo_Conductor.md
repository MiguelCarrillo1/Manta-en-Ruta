# Manta en Ruta - Módulo Conductor

## FASE 9: Diseño Completo del Módulo Conductor

---

## 1. Funcionalidades

| # | Función | Descripción | Prioridad |
|---|---------|-------------|-----------|
| 1 | Iniciar sesión | Autenticación del conductor en la app | Must Have |
| 2 | Iniciar jornada | Seleccionar vehículo + registrar km inicial | Must Have |
| 3 | Registrar kilometraje inicial | Input obligatorio al iniciar jornada | Must Have |
| 4 | Registrar combustible | Galones/litros, costo, proveedor | Should Have |
| 5 | Registrar notas | Notas libres durante la jornada | Should Have |
| 6 | Cambiar estado AC | Encender/apagar aire acondicionado | Could Have |
| 7 | Cambiar estado WiFi | Encender/apagar WiFi | Could Have |
| 8 | Reportar emergencia | Robo, asalto, accidente | Must Have |
| 9 | Reportar avería | Avería mecánica con descripción | Must Have |
| 10 | Finalizar jornada | Registrar km final + cerrar jornada | Must Have |

---

## 2. Flujo Principal

```
App Conductor Inicia
  → Login (email + password)
    → ¿Última jornada activa?
      ├── Sí → Pantalla de jornada activa
      └── No → Pantalla de inicio
                ├── Botón: "Iniciar nueva jornada"
                └── Botón: "Historial"

Iniciar Jornada:
  → Seleccionar vehículo (lista de asignados)
  → Ingresar kilometraje inicial (input numérico)
  → Confirmar inicio
  → GPS comienza a transmitir cada 10s
  → Pantalla de jornada activa

Jornada Activa:
  ┌──────────────────────────────┐
  │  🟢 Jornada Activa           │
  │  ⏱ 03:25:30                  │  ← Temporizador en vivo
  │  🚌 MNT-1234                  │  ← Placa del vehículo
  │  📏 125,430 km                │  ← Km inicial
  │                              │
  │  📋 Acciones:                 │
  │  [⛽ Registrar Combustible]   │
  │  [📝 Agregar Nota]           │
  │  ❄️ Aire: ENCENDIDO [✕]      │  ← Toggle
  │  📶 WiFi: APAGADO [✓]        │  ← Toggle
  │                              │
  │  ⚠️ Emergencias:              │
  │  [🔧 Avería Mecánica]        │
  │  [🚨 Emergencia]             │
  │                              │
  │  [🛑 Finalizar Jornada]      │
  └──────────────────────────────┘

Finalizar Jornada:
  → Ingresar kilometraje final
  → Sistema valida: km_final >= km_inicial
  → Confirmar cierre
  → GPS detiene transmisión
  → Jornada cerrada → redirige a historial
```

---

## 3. Pantallas

### 3.1 Login (auth/login.tsx)

```
┌──────────────────────────────┐
│                              │
│       🚌 Manta en Ruta       │
│       App Conductores        │
│                              │
│  ┌──────────────────────┐   │
│  │ Correo electrónico   │   │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ Contraseña           │   │
│  └──────────────────────┘   │
│                              │
│  [🔑 Iniciar Sesión]        │
│                              │
│  ¿Olvidaste tu contraseña?   │
│                              │
│  v1.0.0                      │
│  © Manta en Ruta             │
└──────────────────────────────┘
```

### 3.2 Inicio de Jornada (start-journey.tsx)

```
┌──────────────────────────────┐
│  ← Iniciar Jornada           │
├──────────────────────────────┤
│                              │
│  🚌 Seleccionar vehículo:     │
│  ┌──────────────────────┐   │
│  │ ○ MNT-1234 (Chevrolet)│   │  ← Lista de vehículos asignados
│  │ ○ MNT-5678 (Hyundai) │   │     (radio button)
│  │ ○ MNT-9012 (Kia)     │   │
│  └──────────────────────┘   │
│                              │
│  📏 Kilometraje inicial:     │
│  ┌──────────────────────┐   │
│  │ 125430               │   │  ← Input numérico
│  └──────────────────────┘   │
│                              │
│  📍 Permiso de ubicación     │
│  ✓ Concedido                 │
│                              │
│  [🚀 Iniciar Jornada]        │
└──────────────────────────────┘
```

### 3.3 Jornada Activa (active-journey.tsx)

```
┌──────────────────────────────┐
│  🟢 Jornada Activa       ⋮   │
├──────────────────────────────┤
│  ┌──────────────────────┐   │
│  │ ⏱ 03:25:30           │   │  ← Temporizador grande
│  │ 🚌 MNT-1234          │   │
│  │ 📏 Km inicio: 125430 │   │
│  │ 📍 Velocidad: 35 km/h│   │  ← Del GPS
│  └──────────────────────┘   │
│                              │
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │⛽    │ │📝    │ │🔧   ││  ← Acciones rápidas
│  │Comb. │ │Nota  │ │Avería││
│  └──────┘ └──────┘ └──────┘│
│                              │
│  ┌──────────────────────┐   │
│  │ Aire Acondicionado   │   │
│  │ [🔵 ENCENDIDO]       │   │  ← Toggle button
│  ├──────────────────────┤   │
│  │ WiFi                 │   │
│  │ [⚪ APAGADO]         │   │  ← Toggle button
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │ 🚨 Reportar        │   │
│  │    Emergencia       │   │  ← Botón rojo (destacado)
│  └──────────────────────┘   │
│                              │
│  [🛑 Finalizar Jornada]     │  ← Botón secundario
└──────────────────────────────┘
```

### 3.4 Registrar Combustible (add-fuel.tsx)

```
┌──────────────────────────────┐
│  ← Registrar Combustible     │
├──────────────────────────────┤
│  🚌 MNT-1234                 │
│  📏 Km actual: 125,530       │
│                              │
│  Cantidad:                   │
│  ┌──────────────────────┐   │
│  │    50.00             │   │  ← Input decimal
│  └──────────────────────┘   │
│  [📏 Litros] [⛽ Galones]   │  ← Toggle unidad
│                              │
│  Costo total ($):            │
│  ┌──────────────────────┐   │
│  │    62.50             │   │
│  └──────────────────────┘   │
│                              │
│  Proveedor:                  │
│  ┌──────────────────────┐   │
│  │ Gasolinera "El Sol"  │   │
│  └──────────────────────┘   │
│                              │
│  [💾 Guardar]               │
└──────────────────────────────┘
```

### 3.5 Emergencia (emergency.tsx)

```
┌──────────────────────────────┐
│  ← Reportar Emergencia       │
├──────────────────────────────┤
│  ⚠️ Selecciona el tipo:      │
│                              │
│  ┌──────────────────────┐   │
│  │ 🔧 Avería Mecánica   │   │
│  ├──────────────────────┤   │
│  │ 🚨 Robo / Asalto     │   │  ← Opciones con iconos
│  ├──────────────────────┤   │
│  │ 💥 Accidente         │   │
│  ├──────────────────────┤   │
│  │ 🆘 Otra emergencia   │   │
│  └──────────────────────┘   │
│                              │
│  Descripción:                │
│  ┌──────────────────────┐   │
│  │ Describa la situación │   │  ← TextArea opcional
│  │ ...                  │   │
│  └──────────────────────┘   │
│                              │
│  📍 Tu ubicación será        │
│  enviada automáticamente     │
│                              │
│  [🚨 REPORTAR EMERGENCIA]   │  ← Botón rojo grande
└──────────────────────────────┘
```

### 3.6 Confirmación de Emergencia

```
┌──────────────────────────────┐
│                              │
│       🆘 ¡Emergencia        │
│       Reportada!            │
│                              │
│  📋 Tipo: Avería Mecánica    │
│  📍 Ubicación enviada        │
│  🕐 10:35:20                 │
│                              │
│  Un operador será notificado │
│  y se pondrá en contacto.    │
│                              │
│  [✓ Entendido]              │
│                              │
│  ┌──────────────────────┐   │
│  │ Si es una emergencia  │   │
│  │ grave, llama al 911   │   │
│  └──────────────────────┘   │
└──────────────────────────────┘
```

---

## 4. Estados de la Jornada

```
        ┌──────────┐
        │ Inactiva  │
        └────┬─────┘
             │ Iniciar jornada
             ▼
        ┌──────────┐
        │  Activa   │◄────────────────┐
        └────┬─────┘                  │
             │                        │
     ┌───────┼───────┐               │
     │       │       │               │
     ▼       ▼       ▼               │
 ┌──────┐ ┌──────┐ ┌──────┐         │
 │Comb. │ │Nota  │ │Toggle│         │
 │      │ │      │ │AC/WiF│         │
 └──────┘ └──────┘ └──────┘         │
     │       │       │               │
     └───────┼───────┘               │
             │                       │
     ┌───────┴───────┐              │
     ▼               ▼               │
 ┌──────────┐  ┌──────────┐         │
 │ Avería   │  │Emergencia│         │
 └────┬─────┘  └────┬─────┘         │
      │              │              │
      ▼              ▼              │
 ┌──────────┐  ┌──────────┐         │
 │ Continúa │  │Finaliza  │         │
 │ jornada  │  │jornada   │         │
 └──────────┘  └────┬─────┘         │
                    │              │
                    ▼              │
               ┌──────────┐        │
               │Finalizada│        │
               └──────────┘        │
                    │              │
                    ▼              │
               ┌──────────┐        │
               │ Inactiva │────────┘
               └──────────┘
```

---

## 5. Validaciones

| Campo | Validación |
|-------|------------|
| Kilometraje inicial | Entero positivo ≥ 0. Requerido. |
| Kilometraje final | Entero ≥ km_inicial. Requerido. |
| Selección de vehículo | Requerido. Solo vehículos asignados al conductor. |
| Combustible - litros | Decimal positivo. Requerido. |
| Combustible - costo | Decimal ≥ 0. Opcional. |
| Tipo de emergencia | Requerido. Debe seleccionar uno. |
| Nota - contenido | Texto. Requerido. Máximo 500 caracteres. |

---

## 6. GPS Tracking (Lógica Interna)

```typescript
// Configuración tracking
const TRACKING_CONFIG = {
  timeInterval: 10000,          // 10 segundos
  distanceInterval: 50,         // 50 metros
  accuracy: 'high',
  foregroundService: true,
  notificationTitle: 'Manta en Ruta',
  notificationBody: 'Jornada activa - enviando ubicación',
};

// Estados del tracking
type TrackingState = 'stopped' | 'starting' | 'active' | 'error';

// Batch de envío
// Acumula 3 posiciones o 30 segundos, lo que ocurra primero
// Envía POST /driver/positions con array de posiciones
```

---

## 7. Componentes Específicos del Módulo

| Componente | Props | Descripción |
|------------|-------|-------------|
| `VehicleSelector` | vehicles, selectedId, onSelect | Lista de vehículos asignados (radio) |
| `JourneyTimer` | startAt, running | Temporizador en vivo HH:MM:SS |
| `QuickActionsRow` | onFuel, onNote, onBreakdown | Botones de acción rápida |
| `FuelForm` | onSubmit, loading, vehicleKm | Formulario de combustible |
| `NoteForm` | onSubmit, loading | Formulario de nota |
| `EmergencyTypeSelector` | types, selected, onSelect | Selector de tipo de emergencia |
| `EmergencyButton` | onPress | Botón rojo grande de emergencia |
| `KmInput` | label, value, onChange, error | Input numérico para km |
| `ActiveJourneyCard` | journey, elapsed | Card resumen de jornada activa |
| `ToggleFeature` | label, icon, active, onToggle | Toggle para AC/WiFi |
| `EmergencyConfirmation` | type, location, time | Confirmación post-emergencia |

---

## 8. API Calls

```typescript
// journeyService.ts
async function startJourney(vehicleId: number, startKm: number): Promise<Journey>
async function getActiveJourney(): Promise<Journey | null>
async function finishJourney(journeyId: number, endKm: number): Promise<Journey>
async function getJourneyHistory(page: number): Promise<PaginatedResult<Journey>>
async function getJourneyDetail(id: number): Promise<JourneyDetail>

// positionService.ts
async function sendPosition(position: GpsPosition): Promise<void>
async function sendPositionBatch(positions: GpsPosition[]): Promise<void>

// fuelService.ts
async function registerFuel(data: FuelRecord): Promise<FuelRecord>

// noteService.ts
async function createNote(data: { content: string }): Promise<Note>

// vehicleService.ts
async function toggleAc(vehicleId: number, status: boolean): Promise<void>
async function toggleWifi(vehicleId: number, status: boolean): Promise<void>

// emergencyService.ts
async function reportEmergency(data: EmergencyInput): Promise<Emergency>
```

---

## 9. Manejo Offline (Conductor)

| Acción | Estrategia Offline |
|--------|-------------------|
| Iniciar jornada | **Requiere conexión** (validar vehículo, crear jornada) |
| Enviar posición GPS | Cola local + batch cuando reconecte |
| Registrar combustible | Guardar local + sincronizar |
| Registrar nota | Guardar local + sincronizar |
| Cambiar AC/WiFi | Enviar inmediatamente si hay conexión, si no: cola |
| Reportar emergencia | **Requiere conexión** (prioridad máxima, reintentar cada 5s) |
| Finalizar jornada | **Requiere conexión** (validar km final, cerrar jornada) |
