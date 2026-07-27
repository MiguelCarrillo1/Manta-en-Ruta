<?php

namespace App\Console\Commands;

use App\Models\Journey;
use App\Models\Line;
use App\Models\Position;
use App\Models\Vehicle;
use Illuminate\Console\Command;

class SimulateBuses extends Command
{
    protected $signature = 'buses:simulate';
    protected $description = 'Simulate bus movement along assigned lines';

    private array $segments = [];

    public function handle(): int
    {
        $journeys = Journey::where('status', 'active')
            ->with('vehicle.line')
            ->get();

        if ($journeys->isEmpty()) {
            $this->warn('No active journeys found');
            return 0;
        }

        foreach ($journeys as $journey) {
            $vehicle = $journey->vehicle;
            $line = $vehicle->line;

            if (!$line) {
                $this->warn("Vehicle {$vehicle->id} has no assigned line, skipping");
                continue;
            }

            $route = $this->buildRoute($line);
            if (count($route) < 2) {
                $this->warn("Line {$line->id} has insufficient stops");
                continue;
            }

            $currentLat = $vehicle->last_known_lat ? (float) $vehicle->last_known_lat : (float) $route[0]['lat'];
            $currentLng = $vehicle->last_known_lng ? (float) $vehicle->last_known_lng : (float) $route[0]['lng'];

            $next = $this->findNextStop($currentLat, $currentLng, $route);

            if (!$next) {
                // reached end, loop to start
                $next = $route[0];
            }

            $step = 0.0003;
            $dlat = (float) $next['lat'] - $currentLat;
            $dlng = (float) $next['lng'] - $currentLng;
            $dist = sqrt($dlat * $dlat + $dlng * $dlng);

            if ($dist < $step) {
                $newLat = (float) $next['lat'];
                $newLng = (float) $next['lng'];
            } else {
                $ratio = $step / $dist;
                $newLat = $currentLat + $dlat * $ratio;
                $newLng = $currentLng + $dlng * $ratio;
            }

            $heading = $dist > 0 ? (rad2deg(atan2($dlng, $dlat)) + 360) % 360 : 0;

            $vehicle->update([
                'last_known_lat' => $newLat,
                'last_known_lng' => $newLng,
                'last_position_at' => now(),
            ]);

            if ($journey->cooperative_id && $vehicle->id) {
                Position::create([
                    'cooperative_id' => $journey->cooperative_id,
                    'vehicle_id' => $vehicle->id,
                    'journey_id' => $journey->id,
                    'latitude' => $newLat,
                    'longitude' => $newLng,
                    'speed' => rand(20, 40),
                    'heading' => (int) round($heading),
                    'recorded_at' => now(),
                ]);
            }

            $this->info("Vehicle {$vehicle->plate}: moved to ({$newLat}, {$newLng}) heading {$heading}");
        }

        return 0;
    }

    private function buildRoute(Line $line): array
    {
        $stops = $line->stops()
            ->select('stops.id', 'stops.latitude', 'stops.longitude')
            ->withPivot('order', 'tramo')
            ->orderByPivot('order')
            ->get();

        if ($stops->isEmpty()) return [];

        return $stops->map(fn($s) => [
            'id' => $s->id,
            'lat' => (float) $s->latitude,
            'lng' => (float) $s->longitude,
            'tramo' => $s->pivot->tramo,
        ])->toArray();
    }

    private function findNextStop(float $lat, float $lng, array $route): ?array
    {
        $minDist = 999;
        $nearestIdx = 0;

        foreach ($route as $i => $point) {
            $d = sqrt(($point['lat'] - $lat) ** 2 + ($point['lng'] - $lng) ** 2);
            if ($d < $minDist) {
                $minDist = $d;
                $nearestIdx = $i;
            }
        }

        $nextIdx = $nearestIdx + 1;
        return $route[$nextIdx] ?? $route[0] ?? null;
    }
}
