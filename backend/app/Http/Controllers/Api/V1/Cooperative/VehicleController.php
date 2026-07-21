<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $vehicles = Vehicle::byTenant()
            ->with('drivers:id,full_name')
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->q, fn($q, $s) => $q->where('plate', 'ilike', "%{$s}%"))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'data' => $vehicles]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'plate' => 'required|string|max:20',
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'nullable|integer|min:1990|max:2030',
            'capacity' => 'nullable|integer|min:1|max:100',
            'color' => 'nullable|string|max:50',
            'has_ac' => 'boolean',
            'has_wifi' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['cooperative_id'] = $request->tenant_cooperative_id;

        $vehicle = Vehicle::create($data);

        return response()->json(['success' => true, 'data' => $vehicle, 'message' => 'Vehículo creado'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $vehicle = Vehicle::byTenant()->with('drivers')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $vehicle]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $vehicle = Vehicle::byTenant()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'plate' => 'string|max:20',
            'brand' => 'string|max:100',
            'model' => 'string|max:100',
            'year' => 'nullable|integer|min:1990|max:2030',
            'capacity' => 'nullable|integer|min:1|max:100',
            'color' => 'nullable|string|max:50',
            'has_ac' => 'boolean',
            'has_wifi' => 'boolean',
            'status' => 'string|in:available,in_journey,maintenance,out_of_service',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $vehicle->update($validator->validated());

        return response()->json(['success' => true, 'data' => $vehicle, 'message' => 'Vehículo actualizado']);
    }

    public function destroy(int $id): JsonResponse
    {
        $vehicle = Vehicle::byTenant()->findOrFail($id);
        $vehicle->delete();

        return response()->json(['success' => true, 'message' => 'Vehículo desactivado'], 204);
    }
}
