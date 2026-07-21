<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaintenanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Maintenance::byTenant()->with('vehicle:id,plate,brand,model');

        if ($request->vehicle_id) {
            $query->where('vehicle_id', $request->vehicle_id);
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->type) {
            $query->where('type', $request->type);
        }

        $maintenances = $query->orderBy('scheduled_date', 'desc')->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'data' => $maintenances]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|exists:vehicles,id',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string|max:1000',
            'scheduled_date' => 'nullable|date',
            'completed_date' => 'nullable|date',
            'km_at_maintenance' => 'nullable|integer|min:0',
            'cost' => 'nullable|numeric|min:0',
            'provider' => 'nullable|string|max:200',
            'notes' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:scheduled,in_progress,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $maintenance = Maintenance::create([
            'cooperative_id' => $request->tenant_cooperative_id,
            'created_by' => auth()->id(),
            ...$validator->validated(),
        ]);

        return response()->json(['success' => true, 'data' => $maintenance->load('vehicle:id,plate'), 'message' => 'Mantenimiento registrado'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $maintenance = Maintenance::byTenant()->with('vehicle', 'createdBy:id,name')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $maintenance]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $maintenance = Maintenance::byTenant()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'sometimes|exists:vehicles,id',
            'type' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:1000',
            'scheduled_date' => 'nullable|date',
            'completed_date' => 'nullable|date',
            'km_at_maintenance' => 'nullable|integer|min:0',
            'cost' => 'nullable|numeric|min:0',
            'provider' => 'nullable|string|max:200',
            'notes' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:scheduled,in_progress,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $maintenance->update($validator->validated());

        return response()->json(['success' => true, 'data' => $maintenance, 'message' => 'Mantenimiento actualizado']);
    }

    public function upcoming(): JsonResponse
    {
        $maintenances = Maintenance::byTenant()
            ->whereIn('status', ['scheduled', 'in_progress'])
            ->where(function ($q) {
                $q->whereNull('scheduled_date')
                  ->orWhere('scheduled_date', '<=', now()->addDays(30));
            })
            ->with('vehicle:id,plate,brand,model')
            ->orderBy('scheduled_date')
            ->get();

        return response()->json(['success' => true, 'data' => $maintenances]);
    }

    public function types(): JsonResponse
    {
        $types = Maintenance::byTenant()
            ->select('type')
            ->distinct()
            ->pluck('type');

        return response()->json(['success' => true, 'data' => $types]);
    }
}
