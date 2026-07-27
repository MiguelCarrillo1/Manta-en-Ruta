<?php

namespace Database\Seeders;

use App\Models\Cooperative;
use App\Models\Driver;
use App\Models\FuelRecord;
use App\Models\Journey;
use App\Models\Line;
use App\Models\PointOfInterest;
use App\Models\Position;
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

        // Operator user
        $operatorRole = Role::where('name', 'operador')->first();
        $operatorUser = User::create([
            'name' => 'Carlos Montero',
            'email' => 'operador@coopmanta.com',
            'password' => bcrypt('Operador123!'),
            'phone' => '0987777777',
            'is_active' => true,
        ]);
        UserCooperative::create([
            'user_id' => $operatorUser->id,
            'cooperative_id' => $coop->id,
            'role_id' => $operatorRole->id,
            'is_active' => true,
        ]);

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

        // ======== STOPS (solo Línea 6 y Línea 17 FETUM) ========
        $stopData = [
            ['name' => 'Terminal Terrestre', 'address' => 'Av. Jaime Chávez y Av. 4', 'latitude' => -0.9511, 'longitude' => -80.7097],

            // Línea 6 FETUM - Ida
            ['name' => 'Coliseo Complejo Tohallí', 'address' => 'Vía a San Mateo', 'latitude' => -0.97541, 'longitude' => -80.75702],
            ['name' => 'Redondel de la Tejedora', 'address' => 'Vía San Mateo / Av. Circunvalación', 'latitude' => -0.97010, 'longitude' => -80.75051],
            ['name' => 'Av. 4 de Noviembre', 'address' => 'Frente a Paseo Shopping Manta', 'latitude' => -0.96342, 'longitude' => -80.71854],
            ['name' => 'Sector Nuevo Tarqui', 'address' => 'Calle 4 / Calle 1', 'latitude' => -0.95790, 'longitude' => -80.71021],
            ['name' => 'Plaza Mar', 'address' => 'Av. Malecón - Frente a Playita Mía', 'latitude' => -0.94905, 'longitude' => -80.70991],
            ['name' => 'Parada del Megaparque', 'address' => 'Av. Malecón', 'latitude' => -0.94589, 'longitude' => -80.72241],

            // Línea 6 FETUM - Retorno
            ['name' => 'Mall del Pacífico', 'address' => 'Av. Malecón', 'latitude' => -0.94931, 'longitude' => -80.72895],
            ['name' => 'Calle 15 y Av. 24', 'address' => 'Sector Mercado Central / Centro', 'latitude' => -0.95155, 'longitude' => -80.71882],
            ['name' => 'Av. Flavio Reyes y Calle 20', 'address' => 'Zona comercial y bancaria', 'latitude' => -0.95251, 'longitude' => -80.73812],
            ['name' => 'Av. Flavio Reyes - ULEAM', 'address' => 'Frente a la ULEAM', 'latitude' => -0.95408, 'longitude' => -80.74315],
            ['name' => 'Redondel de la Epam', 'address' => 'Vía Circunvalación Sur', 'latitude' => -0.95874, 'longitude' => -80.74681],

            // Línea 17 FETUM - Ida
            ['name' => 'Intercambiador de Inepaca', 'address' => 'Av. 4 de Noviembre / Av. La Cultura', 'latitude' => -0.95681, 'longitude' => -80.70752],
            ['name' => 'Entrada al Espigón', 'address' => 'Av. Malecón - Terminal Portuario', 'latitude' => -0.94723, 'longitude' => -80.71805],
            ['name' => 'Mega Parque', 'address' => 'Av. Malecón - Frente a Tarqui', 'latitude' => -0.94589, 'longitude' => -80.72241],
            ['name' => 'Av. Flavio Reyes y Calle 15', 'address' => 'Antiguo sector Madera Fina', 'latitude' => -0.95112, 'longitude' => -80.73347],
            ['name' => 'Vía Circunvalación - Manta 2000', 'address' => 'Entrada a Ur. Manta 2000', 'latitude' => -0.95945, 'longitude' => -80.74901],
            ['name' => 'Coliseo Lorgio Pinoargote', 'address' => 'Vía Manta - San Mateo - Ciudad Deportiva', 'latitude' => -0.97012, 'longitude' => -80.75544],

            // Línea 17 FETUM - Regreso
            ['name' => 'Redondel de los Eléctricos', 'address' => 'Vía Circunvalación', 'latitude' => -0.96310, 'longitude' => -80.74712],
            ['name' => 'Supercapi Marketplace', 'address' => 'Av. Circunvalación', 'latitude' => -0.95683, 'longitude' => -80.74551],
            ['name' => 'Calle 12 y Av. 24', 'address' => 'Conexión Barrio Stella Maris', 'latitude' => -0.95078, 'longitude' => -80.73012],
            ['name' => 'Banco del Pacífico', 'address' => 'Av. Malecón - Frente al Yacht Club', 'latitude' => -0.94892, 'longitude' => -80.72653],
            ['name' => 'Av. Puerto - Aeropuerto', 'address' => 'Frente a Playita Mía / Tarqui', 'latitude' => -0.94901, 'longitude' => -80.70994],
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

        // ======== LINES (solo L6 y L17) ========
        $lineData = [
            ['name' => 'Línea 6 FETUM', 'code' => 'L6', 'description' => 'Coliseo Tohallí → Flavio Reyes / Centro (Circular)', 'color' => '#8e44ad', 'direction' => 'circular'],
            ['name' => 'Línea 17 FETUM', 'code' => 'L17', 'description' => 'Terminal Terrestre → Ciudad Deportiva (Circular)', 'color' => '#d35400', 'direction' => 'circular'],
        ];

        $lines = [];
        foreach ($lineData as $l) {
            $lines[] = Line::create(array_merge($l, [
                'cooperative_id' => $coop->id,
                'is_active' => true,
            ]));
        }

        // Línea 6: Ida stops 1-6 (indices 1-6), Retorno stops 7-12 (indices 7-11, 1)
        $line6 = $lines[0];
        $l6Ida = [1, 2, 3, 4, 5, 6];
        $l6Ret = [7, 8, 9, 10, 11, 1];
        foreach ($l6Ida as $order => $stopIdx) {
            $line6->stops()->attach($stops[$stopIdx]->id, ['order' => $order + 1, 'tramo' => 'ida']);
        }
        foreach ($l6Ret as $order => $stopIdx) {
            $line6->stops()->attach($stops[$stopIdx]->id, ['order' => $order + 7, 'tramo' => 'regreso']);
        }

        // Línea 17: Ida stops 1-9 (indices 0,12-17), Retorno stops 10-15 (indices 18-22, 0)
        $line17 = $lines[1];
        $l17Ida = [0, 12, 13, 14, 7, 15, 10, 16, 17];
        $l17Ret = [18, 19, 20, 21, 22, 0];
        foreach ($l17Ida as $order => $stopIdx) {
            $line17->stops()->attach($stops[$stopIdx]->id, ['order' => $order + 1, 'tramo' => 'ida']);
        }
        foreach ($l17Ret as $order => $stopIdx) {
            $line17->stops()->attach($stops[$stopIdx]->id, ['order' => $order + 10, 'tramo' => 'regreso']);
        }

        // ======== ASSIGN DRIVERS TO VEHICLES & LINES ========
        // Driver 0 (Luis Zambrano) → L6, Driver 3 (Ana Macías) → L17
        $assignment = [
            ['driver' => $drivers[0], 'vehicle' => $vehicles[0], 'line' => $line6],
            ['driver' => $drivers[3], 'vehicle' => $vehicles[3], 'line' => $line17],
        ];

        foreach ($assignment as $a) {
            $a['vehicle']->drivers()->attach($a['driver']->id, ['is_primary' => true, 'is_active' => true]);
            $a['vehicle']->update(['line_id' => $a['line']->id, 'status' => 'in_journey']);

            $journey = Journey::create([
                'cooperative_id' => $coop->id,
                'vehicle_id' => $a['vehicle']->id,
                'driver_id' => $a['driver']->id,
                'start_km' => 1250,
                'start_at' => now()->subHours(2),
                'status' => 'active',
            ]);

            // Seed initial positions along the route
            $route = $a['line']->stops()
                ->select('stops.id', 'stops.latitude', 'stops.longitude')
                ->withPivot('order', 'tramo')
                ->orderByPivot('order')
                ->get();

            foreach ($route as $i => $stop) {
                Position::create([
                    'cooperative_id' => $coop->id,
                    'vehicle_id' => $a['vehicle']->id,
                    'journey_id' => $journey->id,
                    'latitude' => $stop->latitude,
                    'longitude' => $stop->longitude,
                    'speed' => rand(20, 35),
                    'heading' => 0,
                    'recorded_at' => now()->subHours(2)->addMinutes($i * 3),
                ]);

                if ($i === 3) {
                    $a['vehicle']->update([
                        'last_known_lat' => $stop->latitude,
                        'last_known_lng' => $stop->longitude,
                        'last_position_at' => now(),
                    ]);
                }
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
