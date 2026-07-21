<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Line;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LineController extends Controller
{
    public function index(): JsonResponse
    {
        $lines = Line::byTenant()->withCount('stops')->get();
        return response()->json(['success' => true, 'data' => $lines]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
            'code' => 'required|string|max:20',
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|max:7',
            'direction' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $line = Line::create([
            'cooperative_id' => $request->tenant_cooperative_id,
            ...$validator->validated(),
        ]);

        return response()->json(['success' => true, 'data' => $line, 'message' => 'Línea creada'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $line = Line::byTenant()->with(['stops', 'routeSegments'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $line]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $line = Line::byTenant()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:200',
            'code' => 'sometimes|string|max:20',
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|max:7',
            'direction' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $line->update($validator->validated());
        return response()->json(['success' => true, 'data' => $line, 'message' => 'Línea actualizada']);
    }

    public function destroy(int $id): JsonResponse
    {
        $line = Line::byTenant()->findOrFail($id);
        $line->update(['is_active' => false]);
        return response()->json(['success' => true, 'message' => 'Línea desactivada']);
    }

    public function assignStops(Request $request, int $id): JsonResponse
    {
        $line = Line::byTenant()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'stops' => 'required|array',
            'stops.*.stop_id' => 'required|exists:stops,id',
            'stops.*.order' => 'required|integer|min:1',
            'stops.*.distance_from_prev' => 'nullable|numeric|min:0',
            'stops.*.estimated_minutes_from_prev' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $line->stops()->detach();

        $data = collect($request->stops)->mapWithKeys(fn($s) => [
            $s['stop_id'] => [
                'order' => $s['order'],
                'distance_from_prev' => $s['distance_from_prev'] ?? null,
                'estimated_minutes_from_prev' => $s['estimated_minutes_from_prev'] ?? null,
            ],
        ])->toArray();

        $line->stops()->attach($data);

        return response()->json(['success' => true, 'message' => 'Paradas asignadas']);
    }
}
