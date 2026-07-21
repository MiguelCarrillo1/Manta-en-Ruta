<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\PointOfInterest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PoiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PointOfInterest::byTenant()->where('is_active', true);

        if ($request->category) {
            $query->where('category', $request->category);
        }

        if ($request->q) {
            $query->where('name', 'ilike', '%' . $request->q . '%');
        }

        $pois = $query->get(['id', 'name', 'category', 'address', 'latitude', 'longitude', 'phone', 'photo_url']);

        return response()->json(['success' => true, 'data' => $pois]);
    }

    public function show(int $id): JsonResponse
    {
        $poi = PointOfInterest::byTenant()->where('is_active', true)->findOrFail($id);
        return response()->json(['success' => true, 'data' => $poi]);
    }

    public function categories(): JsonResponse
    {
        $categories = PointOfInterest::byTenant()
            ->where('is_active', true)
            ->whereNotNull('category')
            ->select('category')
            ->distinct()
            ->pluck('category');

        return response()->json(['success' => true, 'data' => $categories]);
    }
}
