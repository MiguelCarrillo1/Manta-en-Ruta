# Manta en Ruta - Visión del Proyecto

## FASE 1: Análisis del Problema

---

### Problema Principal

Los usuarios del transporte público urbano en el cantón Manta no tienen información en tiempo real sobre qué bus les conviene tomar según su destino, la posición actual de las unidades ni el recorrido restante, lo que genera incertidumbre, tiempos de espera prolongados y una experiencia de movilidad deficiente.

---

### Problemas Secundarios

1. **Falta de visibilidad**: Los ciudadanos desconocen la ubicación aproximada de los buses y no pueden planificar sus rutas eficientemente.
2. **Ineficiencia operativa**: Las cooperativas no tienen herramientas digitales para monitorear sus unidades, conductores ni jornadas.
3. **Gestión manual**: Los procesos de registro de jornadas, combustible, kilometraje y mantenimiento se realizan de forma manual o no se registran.
4. **Nula trazabilidad**: No existe un historial de rutas, incidencias ni desempeño de conductores y unidades.
5. **Comunicación limitada**: Los conductores no tienen un canal eficiente para reportar emergencias, averías o incidencias.
6. **Crecimiento desordenado**: Cada cooperativa opera de forma aislada sin posibilidad de integración futura entre rutas urbanas, inter cantonales e inter provinciales.

---

### Objetivo General

Reducir la incertidumbre del usuario del transporte público en Manta permitiéndole conocer qué bus le conviene tomar según su destino y la posición actual de las unidades, utilizando la distancia real como indicador principal.

---

### Objetivos Específicos

1. Proveer a los ciudadanos una aplicación móvil para consultar rutas, líneas y ubicación aproximada de unidades activas.
2. Permitir a las cooperativas gestionar digitalmente sus vehículos, conductores, rutas y jornadas.
3. Proveer a los conductores una herramienta móvil para registrar jornadas, kilometraje, combustible e incidencias.
4. Implementar un módulo de monitoreo GPS en tiempo real con diferenciación de precisión por rol.
5. Establecer una arquitectura multi-cooperativa (multi-tenant) que permita escalar a nivel intercantonal e interprovincial.
6. Generar estadísticas operativas para la toma de decisiones.

---

### Alcance

- Aplicación móvil para usuarios del transporte (consulta de rutas, líneas, buses, paradas)
- Aplicación móvil para conductores (gestión de jornada, combustible, incidencias)
- Plataforma web/app para administración de cooperativas (gestión de vehículos, conductores, rutas, mantenimiento, estadísticas)
- Panel de superadministrador para gestión global de cooperativas
- API REST para la comunicación entre frontend y backend
- Base de datos PostgreSQL con esquema multi-tenant
- Sistema de autenticación y autorización basado en JWT con 6 roles

---

### Fuera del Alcance (por ahora)

- Pagos digitales integrados (tarjetas, transferencias)
- Venta de pasajes o reserva de asientos
- Sistema de calificación de conductores por usuarios
- Chat en tiempo real entre usuarios y conductores
- Notificaciones push avanzadas (por definir en fases posteriores)
- Aplicación web para usuarios del transporte (solo móvil)
- Integración con sistemas externos de recaudo o GPS no propietarios
- Algoritmos predictivos de llegada basados en ML/IA

---

### Actores (Usuarios del Sistema)

| Actor | Descripción |
|-------|-------------|
| Superadministrador | Desarrolladores de la plataforma. Administración global de cooperativas, configuración, logs, estadísticas generales. |
| Propietario/Gerente de Cooperativa | Máximo nivel dentro de una cooperativa. Gestiona admins, operadores, conductores y configuración. |
| Administrador de Cooperativa | Gestión de vehículos, conductores, rutas, paradas, mantenimiento, reportes. |
| Operador | Monitoreo de unidades activas, gestión de incidencias, alertas, supervisión de jornadas. |
| Conductor | Gestión de jornada a bordo: inicio/fin, kilometraje, combustible, estado AC/WiFi, emergencias. |
| Usuario del Transporte | Consulta de rutas, líneas, paradas, buses activos, búsqueda por destino. |

---

### Riesgos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Precisión de GPS en zonas urbanas densas | Alto | Usar proveedores GPS robustos, considerar datos móviles y torres de red como respaldo |
| Baja adopción por cooperativas | Alto | Diseñar interfaz simple, beneficios claros, costo cero inicial |
| Conectividad intermitente en rutas | Medio | Modo offline con sincronización diferida |
| Rotación de conductores sin capacitación técnica | Medio | Interfaz intuitiva, onboarding guiado, flujos simples |
| Crecimiento no planificado de datos GPS | Medio | Arquitectura escalable, particionamiento de tablas, purga periódica |
| Seguridad en transmisión de datos GPS | Alto | Cifrado extremo a extremo, JWT con rotación, HTTPS obligatorio |
| Resistencia al cambio por gestión manual actual | Medio | Capacitación, soporte, periodo de prueba paralelo |

---

### Oportunidades

1. **Diferenciación tecnológica**: Ser la primera plataforma de transporte público digital en Manta
2. **Expansión geográfica**: Arquitectura preparada para escalar a nivel provincial y nacional
3. **Generación de datos**: Historial de movilidad urbana valioso para planificación municipal
4. **Alianzas estratégicas**: Posible integración futura con la Agencia Nacional de Tránsito (ANT) y municipios
5. **Monetización futura**: Modelo SaaS por cooperativa, reportes premium, publicidad segmentada
6. **Mejora de movilidad urbana**: Contribución directa a la eficiencia del transporte público local

---

### Casos Reales que Resolverá el Sistema

1. **María (estudiante)**: Necesita ir desde la Ciudadela Universitaria hasta el centro. Abre la app, busca "Centro de Manta" y la app le muestra qué líneas pasan cerca, qué buses están activos y cuál tiene menor distancia restante a su destino.

2. **Carlos (trabajador)**: Está en la parada del Mercado Central y quiere saber cuánto falta para que pase un bus de la línea 8 con dirección a Tarqui. La app le muestra los buses activos ordenados por distancia restante al recorrido.

3. **Pedro (conductor)**: Inicia su jornada, selecciona su vehículo, registra kilometraje inicial. Durante el día reporta una avería mecánica menor. Al finalizar, registra kilometraje final y cierra jornada.

4. **Ana (gerente de cooperativa)**: Revisa el dashboard de su cooperativa. Ve que la unidad BUS-001 ha recorrido 230 km hoy, que hay 3 jornadas activas y que una unidad reportó una emergencia. Reasigna un conductor de respaldo.

5. **José (operador)**: Monitorea en tiempo real las unidades activas en el mapa. Recibe una alerta de emergencia (asalto) de la unidad BUS-015. Activa el protocolo de seguridad y contacta a las autoridades.

6. **Superadministrador**: Crea una nueva cooperativa en la plataforma, configura sus parámetros iniciales y asigna un gerente. Revisa estadísticas globales de uso del sistema.
