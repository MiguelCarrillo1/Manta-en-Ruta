# Manta en Ruta - Requisitos del Sistema

## FASE 2: Levantamiento de Requisitos

---

## Requisitos Funcionales

### Módulo Usuario (RF-01 a RF-12)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-01 | Consultar líneas de transporte disponibles | Must Have |
| RF-02 | Consultar información detallada de una línea (nombre, ruta, horarios referenciales) | Must Have |
| RF-03 | Visualizar unidades activas en un mapa con posición aproximada | Must Have |
| RF-04 | Buscar destino por nombre de lugar o dirección | Must Have |
| RF-05 | Buscar lugares de interés (hospitales, mercados, universidades, parques) | Should Have |
| RF-06 | Buscar por punto en el mapa (seleccionar destino tocando el mapa) | Must Have |
| RF-07 | Visualizar paradas oficiales de cada línea | Must Have |
| RF-08 | Ordenar autobuses por distancia de recorrido restante al destino | Must Have |
| RF-09 | Mostrar tiempo estimado como dato secundario | Must Have |
| RF-10 | Mostrar características del autobús (aire acondicionado, WiFi) | Should Have |
| RF-11 | Sugerir líneas alternativas cuando una no pasa exactamente por el destino (umbral < 200m) | Should Have |
| RF-12 | Recibir alerta visual para solicitar parada al acercarse al destino | Could Have |

### Módulo Conductor (RF-13 a RF-25)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-13 | Iniciar sesión con credenciales de conductor | Must Have |
| RF-14 | Seleccionar vehículo (placa) al iniciar jornada | Must Have |
| RF-15 | Registrar kilometraje inicial al comenzar jornada | Must Have |
| RF-16 | Registrar kilometraje final al terminar jornada | Must Have |
| RF-17 | Registrar carga de combustible (galones/litros, costo, proveedor) | Should Have |
| RF-18 | Registrar notas durante la jornada (incidencias, observaciones) | Should Have |
| RF-19 | Cambiar estado del aire acondicionado (encendido/apagado) | Could Have |
| RF-20 | Cambiar estado del WiFi (encendido/apagado) | Could Have |
| RF-21 | Reportar avería mecánica con descripción | Must Have |
| RF-22 | Reportar emergencia (robo, asalto, accidente) | Must Have |
| RF-23 | Finalizar jornada confirmando kilometraje final | Must Have |
| RF-24 | Visualizar estado de su jornada actual (activa, pausada) | Must Have |
| RF-25 | Recibir notificaciones de la cooperativa | Could Have |

### Módulo Cooperativa - Administrativo (RF-26 a RF-35)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-26 | Gestionar vehículos (alta, edición, baja, asignación de conductor) | Must Have |
| RF-27 | Gestionar conductores (alta, edición, baja, asignación de vehículo) | Must Have |
| RF-28 | Gestionar líneas/rutas (crear, editar, desactivar) | Must Have |
| RF-29 | Gestionar paradas (asignar a rutas, orden, coordenadas) | Must Have |
| RF-30 | Gestionar lugares de interés (crear, editar, desactivar) | Should Have |
| RF-31 | Gestionar usuarios internos (admins, operadores) con roles | Must Have |
| RF-32 | Configurar parámetros propios de la cooperativa (nombre, logo, horarios) | Must Have |
| RF-33 | Visualizar historial de vehículos (asignaciones, cambios) | Should Have |
| RF-34 | Gestionar documentos de conductores (licencias, permisos) | Could Have |
| RF-35 | Gestionar documentos de vehículos (matrícula, seguro, revisión) | Could Have |

### Módulo Cooperativa - Gestión Operativa (RF-36 a RF-45)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-36 | Monitorear unidades activas en mapa con posición exacta (solo cooperativa) | Must Have |
| RF-37 | Visualizar estado de cada unidad (activa, inactiva, averiada, emergencia) | Must Have |
| RF-38 | Ver jornadas activas por conductor y vehículo | Must Have |
| RF-39 | Gestionar alertas (visualizar, atender, cerrar) | Must Have |
| RF-40 | Visualizar incidencias reportadas por conductores | Must Have |
| RF-41 | Ver notas registradas por conductores durante jornada | Should Have |
| RF-42 | Asignar/reasignar conductores a vehículos en tiempo real | Should Have |
| RF-43 | Comunicarse con conductores (notificaciones internas) | Could Have |
| RF-44 | Generar reporte diario de operaciones | Should Have |
| RF-45 | Visualizar histórico de rutas recorridas por unidad | Could Have |

### Módulo Cooperativa - Mantenimiento (RF-46 a RF-53)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-46 | Registrar cambios de aceite (fecha, kilometraje, tipo, costo) | Should Have |
| RF-47 | Registrar cambios de filtros (fecha, kilometraje, tipo, costo) | Should Have |
| RF-48 | Registrar cambios de neumáticos (fecha, kilometraje, posición, costo) | Should Have |
| RF-49 | Registrar reparaciones generales (fecha, descripción, costo, proveedor) | Should Have |
| RF-50 | Visualizar historial de mantenimiento por vehículo | Should Have |
| RF-51 | Recibir alertas de mantenimiento programado por kilometraje o fecha | Could Have |
| RF-52 | Registrar costos asociados a cada mantenimiento | Should Have |
| RF-53 | Generar reporte de costos de mantenimiento por período | Could Have |

### Módulo Cooperativa - Estadísticas (RF-54 a RF-60)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-54 | Visualizar kilómetros recorridos por unidad y período | Should Have |
| RF-55 | Visualizar consumo de combustible por unidad y período | Should Have |
| RF-56 | Visualizar costos de mantenimiento por unidad y período | Should Have |
| RF-57 | Visualizar jornadas realizadas por conductor y período | Should Have |
| RF-58 | Visualizar incidentes reportados (averías, emergencias) por período | Should Have |
| RF-59 | Generar reportes exportables (PDF, CSV) | Could Have |
| RF-60 | Dashboard con indicadores clave (KPI) en tiempo real | Could Have |

### Módulo Superadministrador (RF-61 a RF-70)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-61 | Gestionar cooperativas (crear, editar, desactivar, eliminar) | Must Have |
| RF-62 | Gestionar usuarios globales (superadmins) | Must Have |
| RF-63 | Configurar parámetros globales de la plataforma | Must Have |
| RF-64 | Administrar catálogos globales (tipos de vehículo, tipos de mantenimiento, etc.) | Must Have |
| RF-65 | Visualizar estadísticas generales (usuarios totales, cooperativas activas, jornadas) | Should Have |
| RF-66 | Visualizar logs de actividad del sistema | Should Have |
| RF-67 | Gestionar permisos globales y plantillas de roles | Must Have |
| RF-68 | Monitorear estado de salud del sistema (uptime, rendimiento) | Could Have |
| RF-69 | Gestionar versiones y actualizaciones de la plataforma | Could Have |
| RF-70 | Auditoría de acciones críticas (cambios en cooperativas, eliminaciones) | Must Have |

### Seguridad y Autenticación (RF-71 a RF-78)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-71 | Autenticación mediante JWT (login/logout/refresh) | Must Have |
| RF-72 | Autorización basada en roles (RBAC) con 6 niveles | Must Have |
| RF-73 | Protección de endpoints API con rate limiting | Must Have |
| RF-74 | Cifrado de datos sensibles en reposo y tránsito | Must Have |
| RF-75 | Registro de auditoría para acciones críticas | Must Have |
| RF-76 | Política de contraseñas seguras | Must Have |
| RF-77 | Bloqueo de cuenta por intentos fallidos | Should Have |
| RF-78 | Recuperación de contraseña | Must Have |

---

## Requisitos No Funcionales

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RNF-01 | La aplicación debe responder en menos de 2 segundos para consultas de rutas y líneas | Must Have |
| RNF-02 | La plataforma debe soportar al menos 1000 usuarios concurrentes en fase inicial | Must Have |
| RNF-03 | La posición GPS debe actualizarse cada 10-30 segundos en unidades activas | Must Have |
| RNF-04 | El sistema debe estar disponible 99.5% del tiempo (excluyendo mantenimiento programado) | Must Have |
| RNF-05 | Los datos de ubicación exacta solo serán accesibles por roles de cooperativa (nunca por usuarios) | Must Have |
| RNF-06 | La aplicación debe funcionar en dispositivos Android 8+ y iOS 13+ | Must Have |
| RNF-07 | El sistema debe soportar crecimiento horizontal (escalabilidad) | Should Have |
| RNF-08 | El backend debe responder con códigos HTTP estándar y mensajes de error descriptivos | Must Have |
| RNF-09 | La base de datos debe realizar backups automáticos diarios | Must Have |
| RNF-10 | El frontend debe permitir uso offline parcial con sincronización al recuperar conexión | Should Have |
| RNF-11 | El sistema debe cumplir con la Ley de Protección de Datos Personales de Ecuador | Must Have |

---

## Restricciones

| ID | Restricción |
|----|-------------|
| RES-01 | Stack tecnológico fijo: Laravel + PostgreSQL + React Native (Expo) + TypeScript |
| RES-02 | Proyecto universitario con presupuesto cero para infraestructura cloud inicial |
| RES-03 | Sin acceso a APIs de Google Maps Premium (usar alternativas gratuitas como OpenStreetMap + Leaflet) |
| RES-04 | El equipo de desarrollo inicial tiene conocimiento limitado en sistemas GIS/GPS |
| RES-05 | No se permite el uso de servicios de pago para autenticación (usar JWT propio) |
| RES-06 | El despliegue inicial debe ser en servidor local o VPS de bajo costo |

---

## Supuestos

| ID | Supuesto |
|----|----------|
| SUP-01 | Las cooperativas proporcionarán la información de rutas, paradas y horarios |
| SUP-02 | Los conductores poseen un smartphone con plan de datos básico |
| SUP-03 | Los usuarios del transporte tienen acceso a internet móvil |
| SUP-04 | Las cooperativas asignarán un responsable técnico para la administración del sistema |
| SUP-05 | La precisión GPS estándar de dispositivos móviles es suficiente para el funcionamiento |
| SUP-06 | El gobierno local no proporcionará datos abiertos de transporte público |

---

## Dependencias

| ID | Dependencia | Afecta a |
|----|-------------|----------|
| DEP-01 | Laravel 11+ requiere PHP 8.2+ y Composer | Backend |
| DEP-02 | React Native requiere Node.js 18+ y npm/yarn | Frontend |
| DEP-03 | PostgreSQL 16+ debe estar instalado y configurado | Base de datos |
| DEP-04 | OpenStreetMap requiere conexión a internet para tiles de mapa | Frontend |
| DEP-05 | Expo SDK requiere cuenta de desarrollador para build final | Frontend |
| DEP-06 | Sistema de GPS requiere permiso de ubicación en dispositivo | Móvil |
| DEP-07 | Multi-tenancy requiere aislamiento por esquema o por columnas en BD | Base de datos |

---

## Priorización (MoSCoW)

### Must Have (Imprescindible para MVP)
- Módulo Usuario: RF-01, RF-02, RF-03, RF-04, RF-06, RF-07, RF-08, RF-09
- Módulo Conductor: RF-13, RF-14, RF-15, RF-16, RF-21, RF-22, RF-23, RF-24
- Módulo Cooperativa: RF-26, RF-27, RF-28, RF-29, RF-31, RF-32, RF-36, RF-37, RF-38, RF-39, RF-40
- Superadmin: RF-61, RF-62, RF-63, RF-64, RF-67, RF-70
- Seguridad: RF-71, RF-72, RF-73, RF-74, RF-75, RF-76, RF-78
- No funcionales: RNF-01, RNF-02, RNF-03, RNF-04, RNF-05, RNF-06, RNF-08, RNF-09, RNF-11
- Restricciones: todas aplican

### Should Have (Importante pero no crítico)
- RF-05, RF-10, RF-11, RF-17, RF-18, RF-30, RF-33, RF-41, RF-42, RF-44
- RF-46, RF-47, RF-48, RF-49, RF-50, RF-52
- RF-54, RF-55, RF-56, RF-57, RF-58
- RF-65, RF-77
- RNF-07, RNF-10

### Could Have (Deseable)
- RF-12, RF-19, RF-20, RF-25, RF-34, RF-35, RF-43, RF-45, RF-51, RF-53, RF-59, RF-60
- RF-68, RF-69

### Won't Have (por ahora)
- Pagos digitales
- Venta de pasajes / reserva de asientos
- Calificación de conductores
- Chat usuarios-conductores
- Algoritmos predictivos ML/IA
- Aplicación web para usuarios del transporte
