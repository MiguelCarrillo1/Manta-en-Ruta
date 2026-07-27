<?php

namespace Database\Seeders;

use App\Models\Cooperative;
use App\Models\Driver;
use App\Models\FuelRecord;
use App\Models\Journey;
use App\Models\Position;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $coop = Cooperative::where('slug', 'cooperativa-manta')->first();
        if (!$coop) {
            $this->command->warn('Cooperative not found, skipping TestDataSeeder');
            return;
        }

        $vehicles = Vehicle::where('cooperative_id', $coop->id)->get();
        $drivers = Driver::where('cooperative_id', $coop->id)->get();

        if ($vehicles->isEmpty()) {
            $this->command->warn('No vehicles found, skipping TestDataSeeder');
            return;
        }

        $now = Carbon::now();

        // Active journey 1: Línea 6
        $v1 = $vehicles[0] ?? null;
        $d1 = $drivers->isNotEmpty() ? $drivers[0] : null;
        if ($v1) {
            $j1 = Journey::create([
                'cooperative_id' => $coop->id,
                'vehicle_id' => $v1->id,
                'driver_id' => $d1?->id,
                'start_km' => 1250,
                'end_km' => null,
                'start_at' => $now->copy()->subHours(2),
                'end_at' => null,
                'status' => 'active',
                'total_distance_km' => 0,
                'total_fuel_liters' => 0,
            ]);

            $positions1 = [
                ['lat' => -0.9489, 'lng' => -80.7128, 'speed' => 25],
                ['lat' => -0.9489, 'lng' => -80.7153, 'speed' => 30],
                ['lat' => -0.9497, 'lng' => -80.7161, 'speed' => 15],
                ['lat' => -0.9422, 'lng' => -80.7247, 'speed' => 35],
                ['lat' => -0.9392, 'lng' => -80.7411, 'speed' => 20],
                ['lat' => -0.9350, 'lng' => -80.7350, 'speed' => 22],
            ];

            $baseTime = $now->copy()->subMinutes(30);
            foreach ($positions1 as $i => $p) {
                Position::create([
                    'cooperative_id' => $coop->id,
                    'vehicle_id' => $v1->id,
                    'journey_id' => $j1->id,
                    'latitude' => $p['lat'],
                    'longitude' => $p['lng'],
                    'speed' => $p['speed'],
                    'heading' => rand(0, 360),
                    'accuracy' => rand(5, 20),
                    'recorded_at' => $baseTime->copy()->addMinutes($i * 5),
                ]);
            }

            $v1->update([
                'status' => 'in_journey',
                'line_id' => 1,
                'last_known_lat' => $positions1[count($positions1)-1]['lat'],
                'last_known_lng' => $positions1[count($positions1)-1]['lng'],
                'last_position_at' => $now,
            ]);
        }

        // Active journey 2: Línea 17
        $v2 = $vehicles[1] ?? null;
        $d2 = $drivers->count() > 1 ? $drivers[1] : null;
        if ($v2) {
            $j2 = Journey::create([
                'cooperative_id' => $coop->id,
                'vehicle_id' => $v2->id,
                'driver_id' => $d2?->id,
                'start_km' => 980,
                'end_km' => null,
                'start_at' => $now->copy()->subHours(3),
                'end_at' => null,
                'status' => 'active',
                'total_distance_km' => 0,
                'total_fuel_liters' => 0,
            ]);

            $positions2 = [
                ['lat' => -0.9511, 'lng' => -80.7097, 'speed' => 18],
                ['lat' => -0.9489, 'lng' => -80.7128, 'speed' => 22],
                ['lat' => -0.9447, 'lng' => -80.7244, 'speed' => 28],
                ['lat' => -0.9422, 'lng' => -80.7247, 'speed' => 32],
                ['lat' => -0.9319, 'lng' => -80.7314, 'speed' => 25],
                ['lat' => -0.9280, 'lng' => -80.7280, 'speed' => 30],
            ];

            $baseTime = $now->copy()->subMinutes(35);
            foreach ($positions2 as $i => $p) {
                Position::create([
                    'cooperative_id' => $coop->id,
                    'vehicle_id' => $v2->id,
                    'journey_id' => $j2->id,
                    'latitude' => $p['lat'],
                    'longitude' => $p['lng'],
                    'speed' => $p['speed'],
                    'heading' => rand(0, 360),
                    'accuracy' => rand(5, 20),
                    'recorded_at' => $baseTime->copy()->addMinutes($i * 4),
                ]);
            }

            $v2->update([
                'status' => 'in_journey',
                'line_id' => 2,
                'last_known_lat' => $positions2[count($positions2)-1]['lat'],
                'last_known_lng' => $positions2[count($positions2)-1]['lng'],
                'last_position_at' => $now,
            ]);
        }

        // Completed journey for history
        $v3 = $vehicles[2] ?? null;
        $d3 = $drivers->count() > 2 ? $drivers[2] : null;
        if ($v3) {
            $j3 = Journey::create([
                'cooperative_id' => $coop->id,
                'vehicle_id' => $v3->id,
                'driver_id' => $d3?->id,
                'start_km' => 1250,
                'end_km' => 1320,
                'start_at' => $now->copy()->subHours(8),
                'end_at' => $now->copy()->subHours(2),
                'status' => 'completed',
                'total_distance_km' => 70,
                'total_fuel_liters' => 35.5,
            ]);

            Position::create([
                'cooperative_id' => $coop->id,
                'vehicle_id' => $v3->id,
                'journey_id' => $j3->id,
                'latitude' => -0.9489,
                'longitude' => -80.7153,
                'speed' => 0,
                'heading' => 0,
                'recorded_at' => $now->copy()->subHours(2),
            ]);

            FuelRecord::create([
                'cooperative_id' => $coop->id,
                'vehicle_id' => $v3->id,
                'journey_id' => $j3->id,
                'driver_id' => $j3->driver_id,
                'liters' => 35.5,
                'cost' => 42.60,
                'provider' => 'Petroecuador',
                'current_km' => 1320,
                'recorded_at' => $now->copy()->subHours(2),
            ]);
        }

        // Fuel records for active journeys
        if (isset($j1)) {
            FuelRecord::create([
                'cooperative_id' => $coop->id,
                'vehicle_id' => $v1->id,
                'journey_id' => $j1->id,
                'driver_id' => $j1->driver_id,
                'liters' => 25.0,
                'cost' => 30.00,
                'provider' => 'Petroecuador',
                'current_km' => 1280,
                'recorded_at' => $now->copy()->subHours(1),
            ]);
        }

        if (isset($j2)) {
            FuelRecord::create([
                'cooperative_id' => $coop->id,
                'vehicle_id' => $v2->id,
                'journey_id' => $j2->id,
                'driver_id' => $j2->driver_id,
                'liters' => 18.0,
                'cost' => 21.60,
                'provider' => 'Petroecuador',
                'current_km' => 1010,
                'recorded_at' => $now->copy()->subHours(2),
            ]);
        }

        $activeCount = Vehicle::where('cooperative_id', $coop->id)->where('status', 'in_journey')->count();
        $this->command->info("Test data seeded: {$activeCount} in-journey vehicles with positions");
    }
}
