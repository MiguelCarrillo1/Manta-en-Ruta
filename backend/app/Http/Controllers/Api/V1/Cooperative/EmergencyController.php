<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Emergency;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmergencyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Emergency::byTenant()->with(['vehicle:id,plate', 'driver:id,full_name']);

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->emergency_type) {
            $query->where('emergency_type', $request->emergency_type);
        }

        return response()->json(['success' => true, 'data' => $query->orderBy('reported_at', 'desc')->paginate($request->per_page ?? 15)]);
    }

    public function show(int $id): JsonResponse
    {
        $emergency = Emergency::byTenant()->with(['vehicle', 'driver', 'journey'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $emergency]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $emergency = Emergency::byTenant()->findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:reported,attending,resolved,closed',
            'resolution_notes' => 'nullable|string|max:500',
        ]);

        $emergency->update([
            'status' => $request->status,
            'description' => $request->resolution_notes
                ? ($emergency->description ? $emergency->description . "\n---\n" . $request->resolution_notes : $request->resolution_notes)
                : $emergency->description,
        ]);

        return response()->json(['success' => true, 'data' => $emergency, 'message' => 'Emergencia actualizada']);
    }
}
