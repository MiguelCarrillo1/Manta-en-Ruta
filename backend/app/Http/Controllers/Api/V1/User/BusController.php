<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Stop;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusController extends Controller
{
    public function activeBuses(): JsonResponse
    {
        $buses = Vehicle::byTenant()
            ->where('status', 'in_journey')
            ->whereHas('activeJourney')
            ->with('activeJourney.driver:id,full_name')
            ->get()
            ->map(fn($v) => [
                'id' => $v->id,
                'plate' => $v->plate,
                'brand' => $v->brand,
                'model' => $v->model,
                'last_known_lat' => $v->last_known_lat ? $v->last_known_lat + (mt_rand(-200, 200) / 100000) : null,
                'last_known_lng' => $v->last_known_lng ? $v->last_known_lng + (mt_rand(-200, 200) / 100000) : null,
                'ac_status' => $v->ac_status,
                'wifi_status' => $v->wifi_status,
                'occupancy' => rand(20, 85),
                'driver_name' => $v->activeJourney?->driver?->full_name,
                'last_update' => $v->last_position_at,
            ]);

        return response()->json(['success' => true, 'data' => $buses]);
    }

    public function show(int $id): JsonResponse
    {
        $vehicle = Vehicle::byTenant()
            ->where('status', 'in_journey')
            ->with('activeJourney.driver:id,full_name', 'line')
            ->findOrFail($id);

        return response()->json(['success' => true, 'data' => [
            'id' => $vehicle->id,
            'plate' => $vehicle->plate,
            'brand' => $vehicle->brand,
            'model' => $vehicle->model,
            'last_known_lat' => $vehicle->last_known_lat,
            'last_known_lng' => $vehicle->last_known_lng,
            'ac_status' => $vehicle->ac_status,
            'wifi_status' => $vehicle->wifi_status,
            'occupancy' => rand(20, 85),
            'driver_name' => $vehicle->activeJourney?->driver?->full_name,
            'last_update' => $vehicle->last_position_at,
        ]]);
    }

    public function nearbyBuses(Request $request): JsonResponse
    {
        $lat = $request->lat;
        $lng = $request->lng;

        $buses = Vehicle::byTenant()
            ->where('status', 'in_journey')
            ->whereNotNull('last_known_lat')
            ->get()
            ->filter(function ($v) use ($lat, $lng) {
                $dist = $this->haversineDistance($lat, $lng, $v->last_known_lat, $v->last_known_lng);
                return $dist <= 5;
            })
            ->values()
            ->map(fn($v) => [
                'id' => $v->id,
                'plate' => $v->plate,
                'brand' => $v->brand,
                'last_known_lat' => $v->last_known_lat,
                'last_known_lng' => $v->last_known_lng,
                'occupancy' => rand(20, 85),
                'distance_km' => round($this->haversineDistance($lat, $lng, $v->last_known_lat, $v->last_known_lng), 2),
            ]);

        return response()->json(['success' => true, 'data' => $buses]);
    }

    public function eta(Request $request, int $id): JsonResponse
    {
        $stopId = $request->stop_id;
        if (!$stopId) {
            return response()->json(['success' => false, 'message' => 'stop_id required'], 422);
        }

        $vehicle = Vehicle::byTenant()->where('status', 'in_journey')->find($id);
        $stop = Stop::byTenant()->find($stopId);

        if (!$vehicle || !$stop) {
            return response()->json(['success' => false, 'message' => 'Vehicle or stop not found'], 404);
        }

        $distanceKm = $this->haversineDistance(
            $vehicle->last_known_lat, $vehicle->last_known_lng,
            $stop->latitude, $stop->longitude
        );

        $avgSpeedKmh = rand(20, 35);
        $hours = $distanceKm / $avgSpeedKmh;
        $minutes = round($hours * 60);

        return response()->json(['success' => true, 'data' => [
            'vehicle_id' => $vehicle->id,
            'stop_id' => $stop->id,
            'distance_km' => round($distanceKm, 2),
            'avg_speed_kmh' => $avgSpeedKmh,
            'eta_minutes' => max(1, $minutes),
            'eta' => now()->addMinutes(max(1, $minutes))->toIso8601String(),
        ]]);
    }

    private function haversineDistance($lat1, $lng1, $lat2, $lng2): float
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);
        return $earthRadius * (2 * atan2(sqrt($a), sqrt(1 - $a)));
    }
}
