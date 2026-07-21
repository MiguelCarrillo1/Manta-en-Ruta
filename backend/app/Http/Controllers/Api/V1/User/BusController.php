<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;

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
                'latitude' => $v->last_known_lat ? $v->last_known_lat + (mt_rand(-200, 200) / 100000) : null,
                'longitude' => $v->last_known_lng ? $v->last_known_lng + (mt_rand(-200, 200) / 100000) : null,
                'has_ac' => $v->has_ac,
                'has_wifi' => $v->has_wifi,
                'ac_status' => $v->ac_status,
                'wifi_status' => $v->wifi_status,
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
            'latitude' => $vehicle->last_known_lat,
            'longitude' => $vehicle->last_known_lng,
            'has_ac' => $vehicle->has_ac,
            'has_wifi' => $vehicle->has_wifi,
            'ac_status' => $vehicle->ac_status,
            'wifi_status' => $vehicle->wifi_status,
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
                'latitude' => $v->last_known_lat,
                'longitude' => $v->last_known_lng,
                'distance_km' => round($this->haversineDistance($lat, $lng, $v->last_known_lat, $v->last_known_lng), 2),
            ]);

        return response()->json(['success' => true, 'data' => $buses]);
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
