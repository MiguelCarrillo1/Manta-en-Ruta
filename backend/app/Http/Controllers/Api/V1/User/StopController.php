<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Stop;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StopController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $stops = Stop::byTenant()
            ->where('is_active', true)
            ->when($request->line_id, fn($q, $id) => $q->whereHas('lines', fn($l) => $l->where('lines.id', $id)))
            ->get(['id', 'name', 'address', 'latitude', 'longitude']);

        return response()->json(['success' => true, 'data' => $stops]);
    }

    public function show(int $id): JsonResponse
    {
        $stop = Stop::byTenant()->with('lines')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $stop]);
    }
}
