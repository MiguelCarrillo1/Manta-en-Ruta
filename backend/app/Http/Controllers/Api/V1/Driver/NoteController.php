<?php

namespace App\Http\Controllers\Api\V1\Driver;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\Journey;
use App\Models\Driver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NoteController extends Controller
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
            'content' => 'required|string|max:500',
            'note_type' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $note = Note::create([
            'cooperative_id' => $journey->cooperative_id,
            'vehicle_id' => $journey->vehicle_id,
            'journey_id' => $journey->id,
            'driver_id' => $driver->id,
            'content' => $request->content,
            'note_type' => $request->note_type ?? 'general',
        ]);

        return response()->json(['success' => true, 'data' => $note, 'message' => 'Nota registrada'], 201);
    }
}
