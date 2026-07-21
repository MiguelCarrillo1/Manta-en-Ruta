<?php

namespace App\Http\Controllers\Api\V1\Driver;

use App\Http\Controllers\Controller;
use App\Models\FuelRecord;
use App\Models\Journey;
use App\Models\Driver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FuelController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $driver = Driver::where('user_id', auth()->id())->first();
        if (!$driver) {
            return response()->json(['success' => false, 'message' => 'Conductor no encontrado'], 404);
        }

        $journey = Journey::where('driver_id', $driver->id)->where('status', 'active')->first();
        if (!$journey) {
            return response()->json(['success' => false, 'message' => 'No hay jornada activa'], 400);
        }

        $validator = Validator::make($request->all(), [
            'liters' => 'required|numeric|min:0.01',
            'cost' => 'nullable|numeric|min:0',
            'provider' => 'nullable|string|max:200',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $record = FuelRecord::create([
            'cooperative_id' => $journey->cooperative_id,
            'vehicle_id' => $journey->vehicle_id,
            'journey_id' => $journey->id,
            'driver_id' => $driver->id,
            'liters' => $request->liters,
            'cost' => $request->cost,
            'provider' => $request->provider,
            'current_km' => $journey->vehicle->last_known_lat ? null : null,
            'recorded_at' => now(),
        ]);

        return response()->json(['success' => true, 'data' => $record, 'message' => 'Combustible registrado'], 201);
    }
}
