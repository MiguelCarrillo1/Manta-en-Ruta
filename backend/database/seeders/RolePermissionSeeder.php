<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $allPerms = Permission::pluck('name')->toArray();

        $rolesPerms = [
            'superadmin' => $allPerms,
            'gerente' => $this->getGerentePerms(),
            'admin' => $this->getAdminPerms(),
            'operador' => $this->getOperadorPerms(),
            'conductor' => $this->getConductorPerms(),
            'usuario' => [],
        ];

        foreach ($rolesPerms as $roleName => $perms) {
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $permIds = Permission::whereIn('name', $perms)->pluck('id');
                $role->permissions()->sync($permIds);
            }
        }
    }

    private function getGerentePerms(): array
    {
        return [
            'vehicles.view', 'vehicles.create', 'vehicles.update', 'vehicles.delete',
            'drivers.view', 'drivers.create', 'drivers.update', 'drivers.delete',
            'lines.view', 'lines.create', 'lines.update', 'lines.delete',
            'stops.view', 'stops.create', 'stops.update', 'stops.delete',
            'monitoring.view',
            'alerts.view', 'alerts.manage',
            'maintenance.view', 'maintenance.create',
            'statistics.view', 'reports.export',
            'users.manage', 'config.update',
            'pois.view', 'pois.create', 'pois.update', 'pois.delete',
        ];
    }

    private function getAdminPerms(): array
    {
        return [
            'vehicles.view', 'vehicles.create', 'vehicles.update', 'vehicles.delete',
            'drivers.view', 'drivers.create', 'drivers.update', 'drivers.delete',
            'lines.view', 'lines.create', 'lines.update', 'lines.delete',
            'stops.view', 'stops.create', 'stops.update', 'stops.delete',
            'monitoring.view',
            'alerts.view', 'alerts.manage',
            'maintenance.view', 'maintenance.create',
            'statistics.view',
            'pois.view', 'pois.create', 'pois.update', 'pois.delete',
        ];
    }

    private function getOperadorPerms(): array
    {
        return [
            'vehicles.view',
            'drivers.view',
            'lines.view',
            'stops.view',
            'monitoring.view',
            'alerts.view', 'alerts.manage',
            'maintenance.view',
        ];
    }

    private function getConductorPerms(): array
    {
        return [
            'vehicles.view',
            'journey.start', 'journey.finish',
            'emergency.create',
            'positions.send',
            'fuel.create',
            'notes.create',
        ];
    }
}
