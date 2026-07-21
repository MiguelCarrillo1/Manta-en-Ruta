# Manta en Ruta - Módulo Usuario

## FASE 8: Diseño Completo del Módulo Usuario

---

## 1. Funcionalidades

| # | Función | Descripción | Prioridad |
|---|---------|-------------|-----------|
| 1 | Consultar líneas | Listar todas las líneas de transporte activas | Must Have |
| 2 | Consultar rutas | Ver el recorrido de una línea en el mapa | Must Have |
| 3 | Buscar destino | Buscar por texto (dirección, nombre de lugar) | Must Have |
| 4 | Buscar lugar de interés | Buscar hospitales, mercados, universidades, etc. | Should Have |
| 5 | Buscar por mapa | Seleccionar un punto en el mapa como destino | Must Have |
| 6 | Consultar buses | Ver unidades activas con distancia restante | Must Have |
| 7 | Consultar paradas | Ver paradas oficiales de una línea | Must Have |
| 8 | Alerta para marcar parada | Notificación al acercarse al destino | Could Have |
| 9 | Ordenar buses por distancia | Ordenar resultados según recorrido restante al destino | Must Have |

---

## 2. Flujo de Búsqueda (Core del Módulo)

### Algoritmo de Búsqueda (Backend - SearchService)

```
Input: destino (lat, lng) o texto
Output: lista de buses recomendados ordenados por distancia restante

1. Si es texto:
   a. Buscar en points_of_interest por nombre similar (ILIKE)
   b. Buscar en stops por nombre similar
   c. Geocodificar texto a coordenadas (OSM Nominatim)

2. Con coordenadas destino (dest_lat, dest_lng):
   a. Obtener todas las líneas activas de la cooperativa
   b. Para cada línea:
      - Obtener la ruta (secuencia de paradas con coordenadas)
      - Determinar si el destino está cerca de alguna parada (< 200m)
      - Si sí: la línea es candidata
      - Si no: verificar si el destino está a < 200m de la polilínea de la ruta
   c. Para cada línea candidata:
      - Obtener unidades activas (con jornada activa)
      - Para cada unidad:
        * Obtener su última posición conocida
        * Calcular distancia restante desde su posición hasta el destino
          (siguiendo la ruta, no distancia lineal)
        * Determinar sentido de la ruta
   d. Ordenar resultados por distancia restante ascendente
   e. Limitar a top N resultados (ej: 10)

3. Respuesta: lista de { línea, bus, distancia_restante_km, tiempo_estimado_min }
```

### Lógica de Distancia Restante

```
Para calcular distancia restante de un bus a un destino:

1. Obtener la posición actual del bus (último punto GPS)
2. Obtener la ruta de la línea (secuencia de paradas con coordenadas)
3. Encontrar la parada más cercana al destino (o al punto de la ruta más cercano)
4. Encontrar la parada más cercana a la posición actual del bus
5. Calcular la distancia a lo largo de la ruta:
   distancia_restante = sum(distancia entre paradas desde la posición actual hasta el destino)

Nota: El tiempo estimado se calcula como: distancia_restante / velocidad_promedio_histórica
El tiempo SIEMPRE es secundario. La distancia es el indicador principal.
```

---

## 3. Pantallas

### 3.1 Pantalla Principal - Mapa (index.tsx)

```
┌──────────────────────────────┐
│  ┌─🔍────────────────────┐  │  ← SearchBar (tocar abre search.tsx)
│  │  ¿A dónde vas?        │  │
│  └────────────────────────┘  │
│                              │
│         ┌─────┐              │
│         │ 🚌  │              │  ← BusMarker (posición aprox, color según línea)
│         └─────┘              │
│              ┌───┐           │
│              │ 📍 │          │  ← StopMarker (parada oficial)
│              └───┘           │
│    ┌───┐                     │
│    │ 🏛 │                    │  ← PoiMarker (lugar de interés)
│    └───┘                     │
│                              │
│  ┌────────────────────────┐  │
│  │ 📍 Mi ubicación        │  │  ← UserLocationButton
│  └────────────────────────┘  │
└──────────────────────────────┘
  ┌────────────────────────────┐
  │  Línea 8 │ 🚌 3 activos  │  │  ← Mini card inferior (selector de línea)
  │  A 2.3 km de tu destino   │  │
  └────────────────────────────┘
```

**Funcionalidad**:
- Mapa centrado en la ubicación del usuario
- Marcadores de buses activos cercanos (posición aproximada)
- Marcadores de paradas oficiales
- Marcadores de lugares de interés
- Al tocar un bus → navega a bus/[id]
- Al tocar una parada → navega a stop/[id]
- Al tocar el mapa sin marcador → inicia búsqueda por coordenadas

### 3.2 Pantalla de Búsqueda (search.tsx)

```
┌──────────────────────────────┐
│  ← Búsqueda              🔍  │  ← Header con back
├──────────────────────────────┤
│  ┌────────────────────────┐  │
│  │ Centro de Manta     ✕  │  │  ← Input de búsqueda
│  └────────────────────────┘  │
│                              │
│  ┌──────────────────────┐   │
│  │ 📍 Mi ubicación      │   │  ← Botón de búsqueda por ubicación actual
│  └──────────────────────┘   │
│                              │
│  📌 Sugerencias:              │
│  ┌──────────────────────┐   │
│  │ 🏥 Hospital Manta    │   │  ← Resultados de POIs
│  │ 🏛 Municipio de Manta│   │
│  │ 🏫 Universidad Laica │   │
│  │ 🏬 Mercado Central   │   │
│  └──────────────────────┘   │
│                              │
│  🚌 Líneas que pasan cerca:  │
│  ┌──────────────────────┐   │
│  │ Línea 8 │ 🚌 3 buses │   │  ← Resultados de líneas
│  │ A 1.2 km │ 5 min     │   │  (con distancia al destino)
│  ├──────────────────────┤   │
│  │ Línea 12 │ 🚌 2 buses│   │
│  │ A 2.5 km │ 10 min    │   │
│  └──────────────────────┘   │
└──────────────────────────────┘
```

**Funcionalidad**:
- Búsqueda en tiempo real (debounce 300ms)
- Resultados agrupados: lugares de interés + líneas con buses activos
- Cada resultado de bus muestra: línea, distancia restante (principal), tiempo estimado (secundario)
- Tocar un resultado → navega a bus/[id]

### 3.3 Pantalla de Líneas (lines.tsx)

```
┌──────────────────────────────┐
│  Líneas de Transporte     🔍 │
├──────────────────────────────┤
│                              │
│  ┌──────────────────────┐   │
│  │ 🚌 Línea 8           │   │  ← Card de línea
│  │ Centro ↔ Tarqui      │   │
│  │ 🚦 12 paradas        │   │
│  │ 🟢 3 buses activos   │   │  ← Badge con count
│  ├──────────────────────┤   │
│  │ 🚌 Línea 12          │   │
│  │ Terminal ↔ Los Esteros│   │
│  │ 🚦 8 paradas         │   │
│  │ 🟡 1 bus activo      │   │
│  ├──────────────────────┤   │
│  │ 🚌 Línea 15          │   │
│  │ ...                  │   │
│  └──────────────────────┘   │
└──────────────────────────────┘
```

### 3.4 Detalle de Línea (line/[id].tsx)

```
┌──────────────────────────────┐
│  ← Línea 8              ⋮   │
├──────────────────────────────┤
│  ┌──────────────────────┐   │
│  │    Mapa de la ruta   │   │  ← Mapa con polilínea de la ruta
│  │ ───────────────────  │   │  y marcadores de paradas
│  │  ●──●──●──●──●──●   │   │
│  └──────────────────────┘   │
│                              │
│  🚌 Buses activos (3):       │
│  ┌──────────────────────┐   │
│  │ MNT-1234 │ Pedro     │   │  ← Lista de buses activos
│  │ Dirección: al Centro  │   │
│  │ A 5 paradas           │   │  ← Posición relativa en la ruta
│  ├──────────────────────┤   │
│  │ MNT-5678 │ José      │   │
│  │ ...                  │   │
│  └──────────────────────┘   │
│                              │
│  🚏 Paradas (12):            │
│  ┌──────────────────────┐   │
│  1. Terminal Terrestre   │   │  ← Lista ordenada de paradas
│  2. Av. 24 de Mayo       │   │
│  3. Mercado Central      │   │
│  4. ...                  │   │
│  └──────────────────────┘   │
└──────────────────────────────┘
```

### 3.5 Detalle de Bus (bus/[id].tsx)

```
┌──────────────────────────────┐
│  ← Bus MNT-1234              │
├──────────────────────────────┤
│                              │
│  ┌──────────────────────┐   │
│  │    Mapa              │   │  ← Mapa con posición del bus
│  │    🚌 ─────📍        │   │  y destino del usuario
│  │    → dirección       │   │
│  └──────────────────────┘   │
│                              │
│  📏 A 2.3 km de tu destino  │  ← DISTANCIA (indicador principal)
│  ⏱ ~8 minutos aprox.        │  ← Tiempo (dato secundario)
│                              │
│  ┌──────────────────────┐   │
│  │ Línea 8              │   │
│  │ Centro ↔ Tarqui      │   │
│  ├──────────────────────┤   │
│  │ Características:     │   │
│  │ ❄️ Aire encendido    │   │
│  │ 📶 WiFi disponible    │   │
│  └──────────────────────┘   │
│                              │
│  🚏 Próximas paradas:        │
│  ┌──────────────────────┐   │
│  │ ▸ Mercado Central    │   │  ← Próximas 3 paradas
│  │ ▸ Av. 24 de Mayo     │   │
│  │ ▸ Colegio Manta      │   │
│  └──────────────────────┘   │
│                              │
│  [🔔 Activara alerta parada] │  ← Botón para notificar al llegar
└──────────────────────────────┘
```

---

## 4. Componentes Específicos del Módulo

| Componente | Props | Descripción |
|------------|-------|-------------|
| `SearchBar` | onSearch, placeholder, value | Barra de búsqueda con debounce |
| `SearchResultsList` | results, loading, onSelect, emptyMessage | Lista de resultados de búsqueda |
| `SearchResultCard` | type, title, subtitle, distance, badge | Card individual de resultado |
| `LineCard` | line, activeBusesCount, onPress | Card de línea en lista |
| `LineRouteMap` | line, stops, buses | Mapa con ruta de línea, paradas y buses |
| `BusDetailCard` | bus, distance, estimatedTime | Detalle de bus con distancia y tiempo |
| `BusFeaturesIndicator` | hasAc, hasWifi, acStatus, wifiStatus | Indicadores visuales de características |
| `UpcomingStopsList` | stops, nextStopIndex | Lista de próximas paradas |
| `AlertStopButton` | onPress, isActive | Botón de alerta para marcar parada |
| `EmptySearchState` | query | Estado cuando no hay resultados de búsqueda |
| `MapLegend` | - | Leyenda del mapa (colores de líneas, iconos) |

---

## 5. API Calls desde Frontend

```typescript
// searchService.ts
async function searchDestinations(query: string, userLat: number, userLng: number)
async function searchByMapPoint(lat: number, lng: number)
async function searchByPoiCategory(category: string)

// lineService.ts
async function getLines(): Promise<Line[]>
async function getLineDetail(id: number): Promise<LineDetail>
async function getLineBuses(id: number): Promise<ActiveBus[]>

// busService.ts
async function getBusDetail(id: number): Promise<BusDetail>
async function getBusPosition(id: number): Promise<ApproximatePosition>
async function getBusesPositions(lineIds: number[]): Promise<BusPosition[]>

// stopService.ts
async function getStops(lineId?: number): Promise<Stop[]>
async function getStopDetail(id: number): Promise<StopDetail>

// poiService.ts
async function getPois(category?: string): Promise<PointOfInterest[]>
async function getPoiDetail(id: number): Promise<PointOfInterest>
```

---

## 6. Reglas de Visualización

| Regla | Implementación |
|-------|---------------|
| Solo mostrar buses con jornada activa | Backend filtra `journeys.status = 'active'` en todas las consultas |
| Posición aproximada para usuarios | `GpsService::obfuscate()` suma ruido de ±0.002° |
| Tiempo estimado es secundario | UI muestra distancia en tamaño grande, tiempo en tamaño reducido |
| Ordenar por distancia ascendente | Backend ordena resultados por `distance_remaining_km ASC` |
| Destino a <200m de la ruta | Consulta espacial PostGIS ST_DWithin |
| Actualización periódica de posiciones | Frontend pool cada 15s: `GET /user/buses/positions` |
| Características del bus (AC/WiFi) | Mostrar iconos solo si el bus tiene `has_ac=true` o `has_wifi=true` |
