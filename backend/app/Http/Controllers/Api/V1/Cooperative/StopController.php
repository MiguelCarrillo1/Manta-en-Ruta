<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Stop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StopController extends Controller
{
    public function index(): JsonResponse
    {
        $stops = Stop::byTenant()->get();
        return response()->json(['success' => true, 'data' => $stops]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
            'address' => 'nullable|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $stop = Stop::create([
            'cooperative_id' => $request->tenant_cooperative_id,
            ...$validator->validated(),
        ]);

        return response()->json(['success' => true, 'data' => $stop, 'message' => 'Parada creada'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $stop = Stop::byTenant()->with('lines')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $stop]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $stop = Stop::byTenant()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:200',
            'address' => 'nullable|string|max:255',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $stop->update($validator->validated());

        return response()->json(['success' => true, 'data' => $stop, 'message' => 'Parada actualizada']);
    }

    public function destroy(int $id): JsonResponse
    {
        $stop = Stop::byTenant()->findOrFail($id);
        $stop->update(['is_active' => false]);
        return response()->json(['success' => true, 'message' => 'Parada desactivada']);
    }
}
