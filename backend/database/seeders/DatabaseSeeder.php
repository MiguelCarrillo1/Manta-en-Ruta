<?php

namespace Database\Seeders;

use App\Models\Cooperative;
use App\Models\Role;
use App\Models\User;
use App\Models\UserCooperative;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
        ]);

        $this->call(RolePermissionSeeder::class);

        $superadminRole = Role::where('name', 'superadmin')->first();
        $gerenteRole = Role::where('name', 'gerente')->first();
        $adminRole = Role::where('name', 'admin')->first();
        $operadorRole = Role::where('name', 'operador')->first();
        $usuarioRole = Role::where('name', 'usuario')->first();

        $admin = User::create([
            'name' => 'Superadmin',
            'email' => 'admin@mantaruta.com',
            'password' => bcrypt('Admin123!'),
            'phone' => '0999999999',
            'is_active' => true,
        ]);

        $guest = User::create([
            'name' => 'Invitado',
            'email' => 'invitado@mantaruta.com',
            'password' => bcrypt('Invitado123!'),
            'phone' => '0999999998',
            'is_active' => true,
        ]);

        $coop = Cooperative::create([
            'name' => 'Cooperativa de Transporte Manta',
            'slug' => 'cooperativa-manta',
            'ruc' => '1791234567001',
            'phone' => '052620000',
            'email' => 'info@coopmanta.com',
            'address' => 'Av. Malecón y Calle 10, Manta',
            'scope' => 'urban',
            'is_active' => true,
        ]);

        UserCooperative::create([
            'user_id' => $admin->id,
            'cooperative_id' => $coop->id,
            'role_id' => $superadminRole->id,
            'is_active' => true,
        ]);

        UserCooperative::create([
            'user_id' => $guest->id,
            'cooperative_id' => $coop->id,
            'role_id' => $usuarioRole->id,
            'is_active' => true,
        ]);

        $gerente = User::create([
            'name' => 'Gerente Cooperativa',
            'email' => 'gerente@coopmanta.com',
            'password' => bcrypt('Gerente123!'),
            'phone' => '0987777777',
            'is_active' => true,
        ]);

        UserCooperative::create([
            'user_id' => $gerente->id,
            'cooperative_id' => $coop->id,
            'role_id' => $gerenteRole->id,
            'is_active' => true,
        ]);

        $operador = User::create([
            'name' => 'Operador Cooperativa',
            'email' => 'operador@coopmanta.com',
            'password' => bcrypt('Operador123!'),
            'phone' => '0988888888',
            'is_active' => true,
        ]);

        UserCooperative::create([
            'user_id' => $operador->id,
            'cooperative_id' => $coop->id,
            'role_id' => $operadorRole->id,
            'is_active' => true,
        ]);

        $this->call(MantaDataSeeder::class);
    }
}
