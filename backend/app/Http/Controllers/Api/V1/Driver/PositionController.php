<?php

namespace App\Http\Controllers\Api\V1\Driver;

use App\Http\Controllers\Controller;
use App\Models\Journey;
use App\Models\Position;
use App\Models\Driver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PositionController extends Controller
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
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'speed' => 'nullable|numeric|min:0',
            'heading' => 'nullable|integer|between:0,360',
            'accuracy' => 'nullable|numeric|min:0',
            'recorded_at' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['cooperative_id'] = $journey->cooperative_id;
        $data['vehicle_id'] = $journey->vehicle_id;
        $data['journey_id'] = $journey->id;

        Position::create($data);

        $journey->vehicle()->update([
            'last_known_lat' => $data['latitude'],
            'last_known_lng' => $data['longitude'],
            'last_position_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Posición registrada']);
    }
}
