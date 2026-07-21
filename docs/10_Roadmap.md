# Manta en Ruta - Roadmap

## Hoja de Ruta del Proyecto

---

## Fases del Proyecto

```
Sprint 1  ████████████░░░░░░░  02 semanas  │ Fundación
Sprint 2  ████████████░░░░░░░  02 semanas  │ Auth + Base
Sprint 3  ████████████░░░░░░░  02 semanas  │ Conductor Base
Sprint 4  ████████████░░░░░░░  02 semanas  │ Conductor Full + Búsqueda
Sprint 5  ████████████░░░░░░░  02 semanas  │ Usuario + Admin Cooperativa
Sprint 6  ████████████░░░░░░░  02 semanas  │ Monitoreo + Superadmin
Sprint 7  ████████████░░░░░░░  02 semanas  │ Mantenimiento + Stats
Sprint 8  ████████████░░░░░░░  02 semanas  │ Reportes + Offline
Sprint 9  ████████████░░░░░░░  02 semanas  │ Notificaciones + QA
──────────┼──────────────────┼─────────────
Total:    ████████████████████  18 semanas (~4.5 meses)
```

## Hitos Clave

| Hito | Sprint | Fecha Estimada | Entregable |
|------|:------:|:---------------:|------------|
| M-01 | 1 | Semana 2 | Infraestructura base funcionando |
| M-02 | 2 | Semana 4 | Login + redirección por rol |
| M-03 | 3 | Semana 6 | Conductor puede iniciar/finalizar jornada |
| M-04 | 4 | Semana 8 | App conductor completa + API búsqueda |
| M-05 | 5 | Semana 10 | App usuario funcional + admin coop |
| M-06 | 6 | Semana 12 | Monitoreo en vivo + panel superadmin |
| M-07 | 7 | Semana 14 | Mantenimiento + estadísticas + roles |
| M-08 | 8 | Semana 16 | Reportes exportables + modo offline |
| M-09 | 9 | Semana 18 | MVP completo con notificaciones |

## Post-MVP (Futuro)

| Funcionalidad | Prioridad | Dependencia |
|---------------|:---------:|:-----------:|
| WebSockets para GPS en tiempo real | Alta | Migración de polling a push |
| PWA para usuarios del transporte | Media | App usuario existente |
| Dashboard web para cooperativas | Media | API ya existe |
| Algoritmo ML predictivo de llegada | Baja | Datos históricos suficientes |
| Pagos digitales integrados | Baja | API de terceros |
| Integración con ANT (Agencia Tránsito) | Media | Convenio institucional |
| Módulo de encuestas de satisfacción | Baja | Nueva épica |
| Aplicación web para superadmin | Media | API ya existe |
| Multi-idioma (inglés) | Baja | i18n |
| Tema oscuro | Baja | UI existente |
