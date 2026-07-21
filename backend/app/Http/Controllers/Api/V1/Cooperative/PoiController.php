<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\PointOfInterest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PoiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PointOfInterest::byTenant();

        if ($request->category) {
            $query->where('category', $request->category);
        }

        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
            'category' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'photo_url' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $poi = PointOfInterest::create([
            'cooperative_id' => $request->tenant_cooperative_id,
            ...$validator->validated(),
        ]);

        return response()->json(['success' => true, 'data' => $poi, 'message' => 'Lugar de interés creado'], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(['success' => true, 'data' => PointOfInterest::byTenant()->findOrFail($id)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $poi = PointOfInterest::byTenant()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:200',
            'category' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'photo_url' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $poi->update($validator->validated());

        return response()->json(['success' => true, 'data' => $poi, 'message' => 'Lugar de interés actualizado']);
    }

    public function destroy(int $id): JsonResponse
    {
        $poi = PointOfInterest::byTenant()->findOrFail($id);
        $poi->update(['is_active' => false]);
        return response()->json(['success' => true, 'message' => 'Lugar de interés desactivado']);
    }
}
