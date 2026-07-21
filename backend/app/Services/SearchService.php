<?php

namespace App\Services;

use App\Models\Journey;
use App\Models\Line;
use App\Models\Stop;
use App\Models\PointOfInterest;
use App\Models\Vehicle;
use Illuminate\Support\Collection;

class SearchService
{
    private const EARTH_RADIUS_KM = 6371;
    private const PROXIMITY_METERS = 200;
    private const AVG_SPEED_KMH = 20;
    private const MAX_RESULTS = 10;

    public function searchByText(string $query, ?float $userLat = null, ?float $userLng = null): array
    {
        $destinations = $this->findDestinationsByText($query);
        return $this->processDestinations($destinations, $userLat, $userLng);
    }

    public function searchByCoordinates(float $lat, float $lng, ?float $userLat = null, ?float $userLng = null): array
    {
        $destinations = collect([['lat' => $lat, 'lng' => $lng, 'source' => 'coordinates']]);
        return $this->processDestinations($destinations, $userLat, $userLng);
    }

    private function findDestinationsByText(string $query): Collection
    {
        $results = collect();
        $like = '%' . $query . '%';

        $pois = PointOfInterest::byTenant()
            ->where('is_active', true)
            ->where('name', 'ilike', $like)
            ->take(5)
            ->get(['id', 'name', 'latitude', 'longitude', 'category']);

        foreach ($pois as $poi) {
            $results->push([
                'lat' => (float) $poi->latitude,
                'lng' => (float) $poi->longitude,
                'source' => 'poi',
                'label' => $poi->name,
                'poi_id' => $poi->id,
                'category' => $poi->category,
            ]);
        }

        $stops = Stop::byTenant()
            ->where('is_active', true)
            ->where('name', 'ilike', $like)
            ->take(5)
            ->get(['id', 'name', 'latitude', 'longitude']);

        foreach ($stops as $stop) {
            $results->push([
                'lat' => (float) $stop->latitude,
                'lng' => (float) $stop->longitude,
                'source' => 'stop',
                'label' => $stop->name,
                'stop_id' => $stop->id,
            ]);
        }

        return $results;
    }

    private function processDestinations(Collection $destinations, ?float $userLat, ?float $userLng): array
    {
        $lines = Line::byTenant()->where('is_active', true)->with(['stops'])->get();
        $activeVehicles = Vehicle::byTenant()
            ->where('status', 'in_journey')
            ->whereHas('activeJourney')
            ->with('activeJourney.driver:id,full_name')
            ->get();

        $allResults = [];

        foreach ($destinations as $dest) {
            $candidateLines = $this->findCandidateLines($lines, $dest['lat'], $dest['lng']);

            foreach ($candidateLines as $line) {
                $buses = $this->findBusesForLine($line, $activeVehicles, $dest['lat'], $dest['lng']);

                if ($buses->isNotEmpty()) {
                    $allResults[] = [
                        'destination' => $dest,
                        'line' => [
                            'id' => $line->id,
                            'name' => $line->name,
                            'code' => $line->code,
                            'color' => $line->color,
                        ],
                        'buses' => $buses->sortBy('distance_remaining_km')->values()->toArray(),
                        'total_buses_active' => $buses->count(),
                    ];
                }
            }
        }

        $grouped = $this->groupResults($allResults);

        return [
            'results' => array_slice($grouped, 0, self::MAX_RESULTS),
            'meta' => [
                'search_mode' => $destinations->first()['source'] ?? 'text',
                'suggestions' => $destinations->map(fn($d) => [
                    'label' => $d['label'] ?? null,
                    'source' => $d['source'],
                    'lat' => $d['lat'],
                    'lng' => $d['lng'],
                    'poi_id' => $d['poi_id'] ?? null,
                    'stop_id' => $d['stop_id'] ?? null,
                    'category' => $d['category'] ?? null,
                ])->toArray(),
            ],
        ];
    }

    private function findCandidateLines(Collection $lines, float $destLat, float $destLng): Collection
    {
        return $lines->filter(function ($line) use ($destLat, $destLng) {
            foreach ($line->stops as $stop) {
                $dist = $this->haversine($destLat, $destLng, (float) $stop->latitude, (float) $stop->longitude);
                if ($dist * 1000 <= self::PROXIMITY_METERS) {
                    return true;
                }
            }
            return false;
        })->values();
    }

    private function findBusesForLine(Line $line, Collection $activeVehicles, float $destLat, float $destLng): Collection
    {
        $lineVehicleIds = $activeVehicles->where('line_id', $line->id)->pluck('id');

        $journeyVehicles = Journey::whereIn('vehicle_id', $lineVehicleIds)
            ->where('status', 'active')
            ->with('vehicle')
            ->get();

        $results = collect();

        foreach ($journeyVehicles as $journey) {
            $vehicle = $journey->vehicle;
            if (!$vehicle->last_known_lat || !$vehicle->last_known_lng) continue;

            $distance = $this->calculateDistanceRemaining(
                (float) $vehicle->last_known_lat,
                (float) $vehicle->last_known_lng,
                $destLat,
                $destLng,
                $line
            );

            $results->push([
                'id' => $vehicle->id,
                'plate' => $vehicle->plate,
                'has_ac' => $vehicle->has_ac,
                'has_wifi' => $vehicle->has_wifi,
                'ac_status' => $vehicle->ac_status,
                'wifi_status' => $vehicle->wifi_status,
                'distance_remaining_km' => round($distance, 2),
                'estimated_minutes' => $distance > 0 ? max(1, (int) round(($distance / self::AVG_SPEED_KMH) * 60)) : 1,
                'position' => [
                    'lat' => (float) $vehicle->last_known_lat,
                    'lng' => (float) $vehicle->last_known_lng,
                ],
                'last_update' => $vehicle->last_position_at,
            ]);
        }

        return $results;
    }

    private function calculateDistanceRemaining(float $busLat, float $busLng, float $destLat, float $destLng, Line $line): float
    {
        $stops = $line->stops;
        if ($stops->isEmpty()) {
            return $this->haversine($busLat, $busLng, $destLat, $destLng);
        }

        $busStopIdx = $this->findNearestStopIndex($busLat, $busLng, $stops);
        $destStopIdx = $this->findNearestStopIndex($destLat, $destLng, $stops);

        if ($busStopIdx === null || $destStopIdx === null) {
            return $this->haversine($busLat, $busLng, $destLat, $destLng);
        }

        $total = 0.0;
        $start = min($busStopIdx, $destStopIdx);
        $end = max($busStopIdx, $destStopIdx);

        for ($i = $start; $i < $end; $i++) {
            $total += $this->haversine(
                (float) $stops[$i]->latitude,
                (float) $stops[$i]->longitude,
                (float) $stops[$i + 1]->latitude,
                (float) $stops[$i + 1]->longitude,
            );
        }

        return $total;
    }

    private function findNearestStopIndex(float $lat, float $lng, Collection $stops): ?int
    {
        $minDist = PHP_FLOAT_MAX;
        $nearestIdx = null;

        foreach ($stops as $idx => $stop) {
            $dist = $this->haversine($lat, $lng, (float) $stop->latitude, (float) $stop->longitude);
            if ($dist < $minDist) {
                $minDist = $dist;
                $nearestIdx = $idx;
            }
        }

        return $nearestIdx;
    }

    private function groupResults(array $results): array
    {
        $grouped = [];
        foreach ($results as $r) {
            $key = $r['line']['id'];
            if (!isset($grouped[$key])) {
                $grouped[$key] = $r;
            } else {
                $existingIds = collect($grouped[$key]['buses'])->pluck('id');
                foreach ($r['buses'] as $bus) {
                    if (!$existingIds->contains($bus['id'])) {
                        $grouped[$key]['buses'][] = $bus;
                        $grouped[$key]['total_buses_active']++;
                    }
                }
                usort($grouped[$key]['buses'], fn($a, $b) => $a['distance_remaining_km'] <=> $b['distance_remaining_km']);
            }
        }
        return array_values($grouped);
    }

    public static function haversine(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2 +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) ** 2;
        return self::EARTH_RADIUS_KM * (2 * atan2(sqrt($a), sqrt(1 - $a)));
    }
}
