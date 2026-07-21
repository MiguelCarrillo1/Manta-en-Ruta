<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DriverController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $drivers = Driver::byTenant()
            ->with('vehicles:id,plate')
            ->when($request->q, fn($q, $s) => $q->where('full_name', 'ilike', "%{$s}%"))
            ->when($request->has('is_active'), fn($q) => $q->where('is_active', $request->is_active))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'data' => $drivers]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:200',
            'license_number' => 'required|string|max:50',
            'license_type' => 'required|string|max:20',
            'license_expires_at' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['cooperative_id'] = $request->tenant_cooperative_id;

        $driver = Driver::create($data);

        return response()->json(['success' => true, 'data' => $driver, 'message' => 'Conductor creado'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $driver = Driver::byTenant()->with('vehicles')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $driver]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $driver = Driver::byTenant()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'full_name' => 'string|max:200',
            'license_number' => 'string|max:50',
            'license_type' => 'string|max:20',
            'license_expires_at' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $driver->update($validator->validated());

        return response()->json(['success' => true, 'data' => $driver, 'message' => 'Conductor actualizado']);
    }

    public function destroy(int $id): JsonResponse
    {
        $driver = Driver::byTenant()->findOrFail($id);
        $driver->delete();

        return response()->json(['success' => true, 'message' => 'Conductor desactivado'], 204);
    }
}
