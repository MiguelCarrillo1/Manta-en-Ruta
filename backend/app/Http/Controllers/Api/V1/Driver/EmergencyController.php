<?php

namespace App\Http\Controllers\Api\V1\Driver;

use App\Http\Controllers\Controller;
use App\Models\Emergency;
use App\Models\Journey;
use App\Models\Driver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmergencyController extends Controller
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
            'emergency_type' => 'required|string|max:50',
            'description' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $emergency = Emergency::create([
            'cooperative_id' => $journey->cooperative_id,
            'vehicle_id' => $journey->vehicle_id,
            'journey_id' => $journey->id,
            'driver_id' => $driver->id,
            'emergency_type' => $request->emergency_type,
            'description' => $request->description,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'status' => 'reported',
            'reported_at' => now(),
        ]);

        // En producción: notificar al operador vía push notification

        return response()->json([
            'success' => true,
            'data' => $emergency,
            'message' => 'Emergencia reportada. Un operador será notificado.',
        ], 201);
    }
}
