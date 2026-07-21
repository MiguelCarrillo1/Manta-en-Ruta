<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Journey;
use App\Models\Vehicle;
use App\Models\Position;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MonitoringController extends Controller
{
    public function vehicles(): JsonResponse
    {
        $vehicles = Vehicle::byTenant()
            ->with(['activeJourney.driver:id,full_name', 'line:id,name,code,color'])
            ->get()
            ->map(fn($v) => [
                'id' => $v->id,
                'plate' => $v->plate,
                'brand' => $v->brand,
                'model' => $v->model,
                'status' => $v->status,
                'latitude' => $v->last_known_lat,
                'longitude' => $v->last_known_lng,
                'last_position_at' => $v->last_position_at,
                'has_ac' => $v->has_ac,
                'has_wifi' => $v->has_wifi,
                'ac_status' => $v->ac_status,
                'wifi_status' => $v->wifi_status,
                'line' => $v->line ? ['id' => $v->line->id, 'name' => $v->line->name, 'code' => $v->line->code, 'color' => $v->line->color] : null,
                'active_journey' => $v->activeJourney ? [
                    'id' => $v->activeJourney->id,
                    'driver' => $v->activeJourney->driver,
                    'start_at' => $v->activeJourney->start_at,
                    'start_km' => $v->activeJourney->start_km,
                ] : null,
            ]);

        return response()->json(['success' => true, 'data' => $vehicles]);
    }

    public function vehicleDetail(int $id): JsonResponse
    {
        $vehicle = Vehicle::byTenant()
            ->with(['activeJourney.driver', 'line', 'activeJourney.positions' => fn($q) => $q->latest()->take(50)])
            ->findOrFail($id);

        return response()->json(['success' => true, 'data' => $vehicle]);
    }

    public function activeJourneys(): JsonResponse
    {
        $journeys = Journey::byTenant()
            ->where('status', 'active')
            ->with([
                'vehicle:id,plate,brand,model,last_known_lat,last_known_lng,last_position_at',
                'driver:id,full_name,phone',
            ])
            ->orderBy('start_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $journeys]);
    }

    public function vehiclePositions(Request $request): JsonResponse
    {
        $vehicleId = $request->vehicle_id;
        $since = $request->since;

        $query = Position::byTenant()
            ->when($vehicleId, fn($q, $id) => $q->where('vehicle_id', $id))
            ->when($since, fn($q, $d) => $q->where('created_at', '>=', $d))
            ->latest();

        if ($vehicleId) {
            $query->limit(200);
        } else {
            $query->where('created_at', '>=', now()->subMinutes(5));
        }

        $positions = $query->get(['id', 'vehicle_id', 'latitude', 'longitude', 'speed', 'heading', 'recorded_at', 'created_at']);

        return response()->json(['success' => true, 'data' => $positions]);
    }
}
