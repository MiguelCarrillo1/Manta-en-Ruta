<?php

namespace Database\Seeders;

use App\Models\Cooperative;
use App\Models\Driver;
use App\Models\Line;
use App\Models\PointOfInterest;
use App\Models\Role;
use App\Models\Stop;
use App\Models\User;
use App\Models\UserCooperative;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class MantaDataSeeder extends Seeder
{
    public function run(): void
    {
        $coop = Cooperative::first();
        $conductorRole = Role::where('name', 'conductor')->first();
        $coopAdminRole = Role::where('name', 'admin')->first();

        // ======== USERS ========
        $coopAdmin = User::create([
            'name' => 'Carlos Vera',
            'email' => 'carlos@coopmanta.com',
            'password' => bcrypt('Admin123!'),
            'phone' => '0987654321',
            'is_active' => true,
        ]);

        UserCooperative::create([
            'user_id' => $coopAdmin->id,
            'cooperative_id' => $coop->id,
            'role_id' => $coopAdminRole->id,
            'is_active' => true,
        ]);

        $driverUsers = [];
        $driverNames = [
            ['name' => 'Luis Zambrano', 'email' => 'luis.z@coopmanta.com', 'phone' => '0981111111'],
            ['name' => 'María Párraga', 'email' => 'maria.p@coopmanta.com', 'phone' => '0982222222'],
            ['name' => 'Pedro Cevallos', 'email' => 'pedro.c@coopmanta.com', 'phone' => '0983333333'],
            ['name' => 'Ana Macías', 'email' => 'ana.m@coopmanta.com', 'phone' => '0984444444'],
            ['name' => 'José Ruiz', 'email' => 'jose.r@coopmanta.com', 'phone' => '0985555555'],
            ['name' => 'Rosa Delgado', 'email' => 'rosa.d@coopmanta.com', 'phone' => '0986666666'],
        ];

        foreach ($driverNames as $i => $d) {
            $user = User::create([
                'name' => $d['name'],
                'email' => $d['email'],
                'password' => bcrypt('Conductor123!'),
                'phone' => $d['phone'],
                'is_active' => true,
            ]);
            UserCooperative::create([
                'user_id' => $user->id,
                'cooperative_id' => $coop->id,
                'role_id' => $conductorRole->id,
                'is_active' => true,
            ]);
            $driverUsers[] = $user;
        }

        // ======== VEHICLES ========
        $vehicleData = [
            ['plate' => 'MNT-1001', 'brand' => 'Hino', 'model' => 'AK8J', 'year' => 2022, 'capacity' => 40, 'color' => 'Azul', 'has_ac' => true, 'has_wifi' => true],
            ['plate' => 'MNT-1002', 'brand' => 'Hino', 'model' => 'AK8J', 'year' => 2022, 'capacity' => 40, 'color' => 'Rojo', 'has_ac' => true, 'has_wifi' => true],
            ['plate' => 'MNT-1003', 'brand' => 'Hino', 'model' => 'FC9J', 'year' => 2021, 'capacity' => 35, 'color' => 'Verde', 'has_ac' => true, 'has_wifi' => false],
            ['plate' => 'MNT-1004', 'brand' => 'Hyundai', 'model' => 'County', 'year' => 2023, 'capacity' => 30, 'color' => 'Blanco', 'has_ac' => true, 'has_wifi' => true],
            ['plate' => 'MNT-1005', 'brand' => 'Hyundai', 'model' => 'County', 'year' => 2023, 'capacity' => 30, 'color' => 'Plateado', 'has_ac' => true, 'has_wifi' => false],
            ['plate' => 'MNT-1006', 'brand' => 'JAC', 'model' => 'Sunray', 'year' => 2024, 'capacity' => 25, 'color' => 'Gris', 'has_ac' => false, 'has_wifi' => true],
        ];

        $vehicles = [];
        foreach ($vehicleData as $v) {
            $vehicles[] = Vehicle::create(array_merge($v, [
                'cooperative_id' => $coop->id,
                'status' => 'available',
                'is_active' => true,
            ]));
        }

        // ======== DRIVERS ========
        $licenseTypes = ['A', 'B', 'C', 'E'];
        $drivers = [];
        foreach ($driverUsers as $i => $user) {
            $drivers[] = Driver::create([
                'cooperative_id' => $coop->id,
                'user_id' => $user->id,
                'full_name' => $user->name,
                'license_number' => 'LIC-' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                'license_type' => $licenseTypes[$i % count($licenseTypes)],
                'license_expires_at' => now()->addYears(2),
                'phone' => $user->phone,
                'is_active' => true,
            ]);
        }

        // ======== STOPS (Manta real coordinates) ========
        $stopData = [
            ['name' => 'Terminal Terrestre', 'address' => 'Av. Jaime Chávez y Av. 4', 'latitude' => -0.9511, 'longitude' => -80.7097],
            ['name' => 'Mercado Central', 'address' => 'Calle 10 y Av. 2', 'latitude' => -0.9489, 'longitude' => -80.7128],
            ['name' => 'Parque Central', 'address' => 'Av. 4 y Calle 9', 'latitude' => -0.9489, 'longitude' => -80.7153],
            ['name' => 'Catedral de Manta', 'address' => 'Av. 4 y Calle 11', 'latitude' => -0.9497, 'longitude' => -80.7161],
            ['name' => 'Hospital Regional', 'address' => 'Av. Eloy Alfaro', 'latitude' => -0.9531, 'longitude' => -80.7119],
            ['name' => 'ULEAM (Universidad)', 'address' => 'Av. Universitaria', 'latitude' => -0.9447, 'longitude' => -80.7244],
            ['name' => 'Malecón Escénico', 'address' => 'Av. Malecón', 'latitude' => -0.9422, 'longitude' => -80.7247],
            ['name' => 'Barbasquillo', 'address' => 'Calle 24 y Av. 24', 'latitude' => -0.9319, 'longitude' => -80.7314],
            ['name' => 'Tarqui (Playa)', 'address' => 'Av. Tarqui', 'latitude' => -0.9392, 'longitude' => -80.7411],
            ['name' => 'Los Esteros', 'address' => 'Av. 6 y Calle 20', 'latitude' => -0.9600, 'longitude' => -80.7200],
            ['name' => 'El Palmar', 'address' => 'Vía El Palmar', 'latitude' => -0.9344, 'longitude' => -80.6933],
            ['name' => 'Ciudadela Eloy Alfaro', 'address' => 'Av. Eloy Alfaro Norte', 'latitude' => -0.9550, 'longitude' => -80.7100],
            ['name' => 'San Mateo', 'address' => 'Vía San Mateo', 'latitude' => -0.9172, 'longitude' => -80.7483],
            ['name' => 'Colegio 5 de Junio', 'address' => 'Av. 24 y Calle 13', 'latitude' => -0.9408, 'longitude' => -80.7192],
            ['name' => 'Paseo Shopping', 'address' => 'Av. Flavio Reyes', 'latitude' => -0.9425, 'longitude' => -80.7283],
            ['name' => 'Centro Comercial La Piazza', 'address' => 'Av. Malecón y Calle 24', 'latitude' => -0.9411, 'longitude' => -80.7275],
            ['name' => 'Barrio Jocay', 'address' => 'Av. Jocay', 'latitude' => -0.9367, 'longitude' => -80.7183],
            ['name' => 'Miraflores', 'address' => 'Calle 15 y Av. 15', 'latitude' => -0.9439, 'longitude' => -80.7089],
            ['name' => 'Cuerpo de Bomberos', 'address' => 'Av. 2 y Calle 14', 'latitude' => -0.9467, 'longitude' => -80.7133],
            ['name' => 'RECOPE (Refinería)', 'address' => 'Vía a la Refinería', 'latitude' => -0.8683, 'longitude' => -80.7306],
        ];

        $stops = [];
        foreach ($stopData as $s) {
            $stops[] = Stop::create([
                'cooperative_id' => $coop->id,
                'name' => $s['name'],
                'address' => $s['address'],
                'latitude' => $s['latitude'],
                'longitude' => $s['longitude'],
                'is_active' => true,
            ]);
        }

        // ======== LINES ========
        $lineData = [
            ['name' => 'Centro - Tarqui', 'code' => 'R1', 'description' => 'Recorre el centro hasta la playa de Tarqui', 'color' => '#1a73e8', 'direction' => 'outbound'],
            ['name' => 'Centro - Barbasquillo', 'code' => 'R2', 'description' => 'Del centro al sector de Barbasquillo', 'color' => '#e74c3c', 'direction' => 'outbound'],
            ['name' => 'Terminal - ULEAM', 'code' => 'R3', 'description' => 'Terminal Terrestre a la Universidad ULEAM', 'color' => '#27ae60', 'direction' => 'outbound'],
            ['name' => 'Los Esteros - El Palmar', 'code' => 'R4', 'description' => 'Cruza la ciudad de Los Esteros a El Palmar', 'color' => '#f39c12', 'direction' => 'outbound'],
            ['name' => 'San Mateo - Centro', 'code' => 'R5', 'description' => 'San Mateo hasta el centro de Manta', 'color' => '#9b59b6', 'direction' => 'outbound'],
        ];

        $lines = [];
        foreach ($lineData as $l) {
            $lines[] = Line::create(array_merge($l, [
                'cooperative_id' => $coop->id,
                'is_active' => true,
            ]));
        }

        // ======== LINE-STOP assignments ========
        $lineStops = [
            1 => [1, 2, 3, 4, 6, 7, 9],          // Centro - Tarqui
            2 => [3, 4, 7, 8, 14, 15, 16],        // Centro - Barbasquillo
            3 => [1, 5, 12, 18, 13, 6],            // Terminal - ULEAM
            4 => [10, 5, 12, 3, 20, 11],           // Los Esteros - El Palmar
            5 => [19, 9, 8, 7, 3, 2, 1],           // San Mateo - Centro
        ];

        foreach ($lineStops as $lineIdx => $stopIndices) {
            $line = $lines[$lineIdx - 1];
            foreach ($stopIndices as $order => $stopIdx) {
                $stop = $stops[$stopIdx - 1];
                $line->stops()->attach($stop->id, ['order' => $order + 1]);
            }
        }

        // ======== POINTS OF INTEREST ========
        $poiData = [
            ['name' => 'PLAYA DE TARQUI', 'category' => 'Playa', 'address' => 'Av. Tarqui', 'latitude' => -0.9383, 'longitude' => -80.7417, 'phone' => null, 'description' => 'Principal playa turística de Manta'],
            ['name' => 'PLAYA DE BARBASQUILLO', 'category' => 'Playa', 'address' => 'Barbasquillo', 'latitude' => -0.9306, 'longitude' => -80.7336, 'phone' => null, 'description' => 'Playa tranquila al norte de la ciudad'],
            ['name' => 'MUSEO DEL BANCO CENTRAL', 'category' => 'Cultura', 'address' => 'Av. Malecón y Calle 13', 'latitude' => -0.9478, 'longitude' => -80.7192, 'phone' => '052626000', 'description' => 'Museo arqueológico con piezas Valdivia y Manteño'],
            ['name' => 'CATEDRAL DE MANTA', 'category' => 'Religioso', 'address' => 'Av. 4 y Calle 11', 'latitude' => -0.9497, 'longitude' => -80.7161, 'phone' => null, 'description' => 'Catedral Nuestra Señora de la Presentación'],
            ['name' => 'MALECÓN ESCÉNICO', 'category' => 'Turístico', 'address' => 'Av. Malecón', 'latitude' => -0.9425, 'longitude' => -80.7244, 'phone' => null, 'description' => 'Malecón turístico con vista al mar'],
            ['name' => 'TERMINAL TERRESTRE', 'category' => 'Transporte', 'address' => 'Av. Jaime Chávez', 'latitude' => -0.9511, 'longitude' => -80.7097, 'phone' => '052630300', 'description' => 'Terminal de buses interprovinciales'],
            ['name' => 'HOSPITAL REGIONAL', 'category' => 'Salud', 'address' => 'Av. Eloy Alfaro', 'latitude' => -0.9531, 'longitude' => -80.7119, 'phone' => '052620200', 'description' => 'Hospital Dr. Rafael Rodríguez Zambrano'],
            ['name' => 'MERCADO CENTRAL', 'category' => 'Comercio', 'address' => 'Calle 10 y Av. 2', 'latitude' => -0.9489, 'longitude' => -80.7128, 'phone' => null, 'description' => 'Mercado de abastos principal de la ciudad'],
            ['name' => 'ULEAM', 'category' => 'Educación', 'address' => 'Av. Universitaria', 'latitude' => -0.9447, 'longitude' => -80.7244, 'phone' => '052624000', 'description' => 'Universidad Laica Eloy Alfaro de Manabí'],
            ['name' => 'PASEO SHOPPING MANTA', 'category' => 'Comercial', 'address' => 'Av. Flavio Reyes', 'latitude' => -0.9422, 'longitude' => -80.7286, 'phone' => '052696000', 'description' => 'Centro comercial principal de Manta'],
        ];

        foreach ($poiData as $poi) {
            PointOfInterest::create(array_merge($poi, [
                'cooperative_id' => $coop->id,
                'is_active' => true,
            ]));
        }

        $this->command->info('Data de Manta creada exitosamente: ' .
            count($vehicles) . ' vehículos, ' . count($drivers) . ' conductores, ' .
            count($stops) . ' paradas, ' . count($lines) . ' líneas, ' .
            count($poiData) . ' POIs');
    }
}
