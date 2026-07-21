# Manta en Ruta - Decisiones Arquitectónicas

## Registro de Decisiones de Arquitectura (ADR)

---

### ADR-001: Elección de Stack Tecnológico

**Contexto**: Definir las tecnologías base del proyecto.
**Decisión**: Laravel (PHP) + PostgreSQL + React Native (Expo) + TypeScript.
**Justificación**: Stack definido por el documento base. Laravel ofrece ORM maduro (Eloquent), autenticación JWT nativa (Laravel Sanctum/Passport), y ecosistema para APIs REST. PostgreSQL con PostGIS permite consultas espaciales necesarias para GPS. React Native + Expo permite desarrollo cross-platform rápido.
**Consecuencias**: Limitado a PHP en backend; no se puede migrar a Node.js o Python sin reescribir.

---

### ADR-002: API REST vs GraphQL

**Contexto**: Definir el protocolo de comunicación entre frontend y backend.
**Decisión**: REST API con JSON.
**Justificación**: Los patrones de consulta de la aplicación son predecibles y mayormente CRUD. REST es más simple de implementar, cachear, y documentar. GraphQL añadiría complejidad innecesaria para este alcance.
**Consecuencias**: Múltiples endpoints pueden generar over-fetching en algunos casos, pero es aceptable.

---

### ADR-003: Multi-Tenancy (Shared DB vs Schema per Tenant)

**Contexto**: Aislar datos entre cooperativas.
**Decisión**: Shared database con columna `cooperative_id` en todas las tablas.
**Justificación**: Menor complejidad operativa, backups unificados, consultas cross-tenant para superadmin. La migración a schema-per-tenant es posible en el futuro si el volumen lo requiere.
**Riesgo**: Fuga de datos entre tenants. Mitigación: middleware obligatorio + scopes globales de Laravel + pruebas de integración.

---

### ADR-004: Autenticación JWT

**Contexto**: Sistema de autenticación stateless.
**Decisión**: JWT con access token (15 min) + refresh token (7 días).
**Justificación**: Stateless, escalable horizontalmente sin sesiones compartidas. Los claims del JWT incluyen `role` y `cooperative_id` para autorización sin consultas a BD en cada request.
**Consecuencias**: Los tokens revocados no pueden invalidarse hasta su expiración (a menos que se implemente blacklist en Redis).

---

### ADR-005: GPS y PostGIS

**Contexto**: Almacenamiento y consulta de posiciones GPS.
**Decisión**: PostgreSQL con extensión PostGIS, tabla `positions` particionada por mes.
**Justificación**: Las consultas de distancia y proximidad requieren índices espaciales que PostGIS provee nativamente. La partición por mes evita degradación por volumen histórico de datos GPS.
**Consecuencias**: Dependencia de PostGIS; la migración a otra BD (MySQL) requeriría cambios significativos.

---

### ADR-006: Ofuscación de Posición GPS para Usuarios

**Contexto**: Los conductores y cooperativas no quieren que su posición exacta sea pública.
**Decisión**: El backend aplica ruido aleatorio de ±0.002° (~200m) a las coordenadas devueltas a usuarios no autorizados.
**Justificación**: La ofuscación centralizada en backend es segura (no confía en el cliente). El margen de 200m es suficiente para que el usuario sepa si el bus se acerca sin revelar posición exacta.
**Consecuencias**: Los usuarios verán el bus "saltar" ligeramente en el mapa.

---

### ADR-007: Monolítico con Separación por Módulos

**Contexto**: ¿Microservicios o monolito?
**Decisión**: Monolito Laravel con separación lógica por módulos (Controllers, Services, Models).
**Justificación**: Equipo pequeño (universitario), evitar complejidad distribuida prematura. La separación por módulos facilita una futura extracción a microservicios si es necesario.
**Consecuencias**: El despliegue es un solo artefacto; no hay escalado independiente por módulo.

---

### ADR-008: OpenStreetMap + Leaflet vs Google Maps

**Contexto**: Proveedor de mapas para la aplicación.
**Decisión**: OpenStreetMap con Leaflet (o react-native-maps con OSM provider).
**Justificación**: Sin costo, licencia abierta (ODbL), suficiente precisión para el caso de uso. Google Maps requeriría API key con costo recurrente.
**Consecuencias**: Menor calidad de mapas en zonas rurales, menos POIs pre-cargados, requiere tiles propios si el volumen de consultas es alto.
