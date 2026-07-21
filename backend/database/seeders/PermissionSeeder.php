<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Cooperativas
            ['name' => 'cooperatives.view', 'display_name' => 'Ver cooperativas', 'module' => 'cooperatives'],
            ['name' => 'cooperatives.create', 'display_name' => 'Crear cooperativas', 'module' => 'cooperatives'],
            ['name' => 'cooperatives.update', 'display_name' => 'Actualizar cooperativas', 'module' => 'cooperatives'],
            ['name' => 'cooperatives.delete', 'display_name' => 'Eliminar cooperativas', 'module' => 'cooperatives'],
            // Vehículos
            ['name' => 'vehicles.view', 'display_name' => 'Ver vehículos', 'module' => 'vehicles'],
            ['name' => 'vehicles.create', 'display_name' => 'Crear vehículos', 'module' => 'vehicles'],
            ['name' => 'vehicles.update', 'display_name' => 'Actualizar vehículos', 'module' => 'vehicles'],
            ['name' => 'vehicles.delete', 'display_name' => 'Eliminar vehículos', 'module' => 'vehicles'],
            // Conductores
            ['name' => 'drivers.view', 'display_name' => 'Ver conductores', 'module' => 'drivers'],
            ['name' => 'drivers.create', 'display_name' => 'Crear conductores', 'module' => 'drivers'],
            ['name' => 'drivers.update', 'display_name' => 'Actualizar conductores', 'module' => 'drivers'],
            ['name' => 'drivers.delete', 'display_name' => 'Eliminar conductores', 'module' => 'drivers'],
            // Líneas
            ['name' => 'lines.view', 'display_name' => 'Ver líneas', 'module' => 'lines'],
            ['name' => 'lines.create', 'display_name' => 'Crear líneas', 'module' => 'lines'],
            ['name' => 'lines.update', 'display_name' => 'Actualizar líneas', 'module' => 'lines'],
            ['name' => 'lines.delete', 'display_name' => 'Eliminar líneas', 'module' => 'lines'],
            // Paradas
            ['name' => 'stops.view', 'display_name' => 'Ver paradas', 'module' => 'stops'],
            ['name' => 'stops.create', 'display_name' => 'Crear paradas', 'module' => 'stops'],
            ['name' => 'stops.update', 'display_name' => 'Actualizar paradas', 'module' => 'stops'],
            ['name' => 'stops.delete', 'display_name' => 'Eliminar paradas', 'module' => 'stops'],
            // Monitoreo
            ['name' => 'monitoring.view', 'display_name' => 'Ver monitoreo', 'module' => 'monitoring'],
            // Alertas
            ['name' => 'alerts.view', 'display_name' => 'Ver alertas', 'module' => 'alerts'],
            ['name' => 'alerts.manage', 'display_name' => 'Gestionar alertas', 'module' => 'alerts'],
            // Mantenimiento
            ['name' => 'maintenance.view', 'display_name' => 'Ver mantenimientos', 'module' => 'maintenance'],
            ['name' => 'maintenance.create', 'display_name' => 'Crear mantenimientos', 'module' => 'maintenance'],
            // Estadísticas
            ['name' => 'statistics.view', 'display_name' => 'Ver estadísticas', 'module' => 'statistics'],
            ['name' => 'reports.export', 'display_name' => 'Exportar reportes', 'module' => 'reports'],
            // Jornada
            ['name' => 'journey.start', 'display_name' => 'Iniciar jornada', 'module' => 'journey'],
            ['name' => 'journey.finish', 'display_name' => 'Finalizar jornada', 'module' => 'journey'],
            // Emergencias
            ['name' => 'emergency.create', 'display_name' => 'Reportar emergencia', 'module' => 'emergency'],
            // GPS
            ['name' => 'positions.send', 'display_name' => 'Enviar posición GPS', 'module' => 'gps'],
            // Combustible
            ['name' => 'fuel.create', 'display_name' => 'Registrar combustible', 'module' => 'fuel'],
            // Notas
            ['name' => 'notes.create', 'display_name' => 'Crear notas', 'module' => 'notes'],
            // Usuarios
            ['name' => 'users.manage', 'display_name' => 'Gestionar usuarios', 'module' => 'users'],
            // Configuración
            ['name' => 'config.update', 'display_name' => 'Actualizar configuración', 'module' => 'config'],
            // POIs
            ['name' => 'pois.view', 'display_name' => 'Ver lugares de interés', 'module' => 'pois'],
            ['name' => 'pois.create', 'display_name' => 'Crear lugares de interés', 'module' => 'pois'],
            ['name' => 'pois.update', 'display_name' => 'Actualizar lugares de interés', 'module' => 'pois'],
            ['name' => 'pois.delete', 'display_name' => 'Eliminar lugares de interés', 'module' => 'pois'],
        ];

        foreach ($permissions as $perm) {
            Permission::create($perm);
        }
    }
}
