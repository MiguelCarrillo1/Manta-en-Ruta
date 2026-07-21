<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'superadmin', 'display_name' => 'Superadministrador', 'level' => 1, 'description' => 'Acceso total a la plataforma'],
            ['name' => 'gerente', 'display_name' => 'Gerente de Cooperativa', 'level' => 2, 'description' => 'Máximo nivel dentro de una cooperativa'],
            ['name' => 'admin', 'display_name' => 'Administrador de Cooperativa', 'level' => 3, 'description' => 'Gestión operativa de la cooperativa'],
            ['name' => 'operador', 'display_name' => 'Operador', 'level' => 4, 'description' => 'Monitoreo y gestión de alertas'],
            ['name' => 'conductor', 'display_name' => 'Conductor', 'level' => 5, 'description' => 'Gestión de jornada a bordo'],
            ['name' => 'usuario', 'display_name' => 'Usuario del Transporte', 'level' => 6, 'description' => 'Consulta de rutas y buses'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
