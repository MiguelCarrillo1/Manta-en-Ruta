<?php

namespace App\Http\Controllers\Api\V1\Driver;

use App\Http\Controllers\Controller;
use App\Models\Journey;
use App\Models\Vehicle;
use App\Models\Driver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JourneyController extends Controller
{
    public function activeJourney(): JsonResponse
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return response()->json(['success' => false, 'message' => 'Conductor no encontrado'], 404);
        }

        $journey = Journey::where('driver_id', $driver->id)
            ->where('status', 'active')
            ->with('vehicle:id,plate,brand,model,has_ac,has_wifi,ac_status,wifi_status,status,last_known_lat,last_known_lng')
            ->first();

        return response()->json(['success' => true, 'data' => $journey]);
    }

    public function start(Request $request): JsonResponse
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return response()->json(['success' => false, 'message' => 'Conductor no encontrado'], 404);
        }

        $hasActive = Journey::where('driver_id', $driver->id)->where('status', 'active')->exists();
        if ($hasActive) {
            return response()->json(['success' => false, 'message' => 'Ya tienes una jornada activa'], 400);
        }

        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_km' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $vehicle = Vehicle::findOrFail($request->vehicle_id);
        if ($vehicle->status !== 'available') {
            return response()->json(['success' => false, 'message' => 'El vehículo no está disponible'], 400);
        }

        $journey = Journey::create([
            'cooperative_id' => $request->tenant_cooperative_id,
            'vehicle_id' => $request->vehicle_id,
            'driver_id' => $driver->id,
            'start_km' => $request->start_km,
            'start_at' => now(),
            'status' => 'active',
        ]);

        $vehicle->update(['status' => 'in_journey']);

        return response()->json([
            'success' => true,
            'data' => $journey->load('vehicle:id,plate,brand,model'),
            'message' => 'Jornada iniciada exitosamente',
        ], 201);
    }

    public function finish(Request $request): JsonResponse
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return response()->json(['success' => false, 'message' => 'Conductor no encontrado'], 404);
        }

        $journey = Journey::where('driver_id', $driver->id)
            ->where('status', 'active')->first();

        if (!$journey) {
            return response()->json(['success' => false, 'message' => 'No tienes una jornada activa'], 404);
        }

        $validator = Validator::make($request->all(), [
            'end_km' => 'required|integer|min:' . $journey->start_km,
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $journey->update([
            'end_km' => $request->end_km,
            'end_at' => now(),
            'status' => 'finished',
            'total_distance_km' => $request->end_km - $journey->start_km,
        ]);

        $journey->vehicle()->update(['status' => 'available']);

        return response()->json([
            'success' => true,
            'data' => $journey,
            'message' => 'Jornada finalizada exitosamente',
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return response()->json(['success' => false, 'message' => 'Conductor no encontrado'], 404);
        }

        $journeys = Journey::where('driver_id', $driver->id)
            ->with('vehicle:id,plate')
            ->orderBy('start_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'data' => $journeys]);
    }

    private function getDriver(): ?Driver
    {
        $userId = auth()->id();
        return Driver::where('user_id', $userId)->first();
    }
}
