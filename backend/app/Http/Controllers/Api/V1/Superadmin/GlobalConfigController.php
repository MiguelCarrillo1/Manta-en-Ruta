<?php

namespace App\Http\Controllers\Api\V1\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\GlobalConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlobalConfigController extends Controller
{
    public function index(): JsonResponse
    {
        $configs = GlobalConfig::all();
        $data = $configs->pluck('value', 'key')->toArray();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'config' => 'required|array',
            'config.*' => 'nullable|string',
        ]);

        foreach ($request->config as $key => $value) {
            GlobalConfig::updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }

        $updated = GlobalConfig::all()->pluck('value', 'key')->toArray();

        return response()->json([
            'success' => true,
            'data' => $updated,
            'message' => 'Configuración actualizada',
        ]);
    }

    public function show(): JsonResponse
    {
        $allConfigs = GlobalConfig::all()->keyBy('key');

        return response()->json([
            'success' => true,
            'data' => [
                'config' => $allConfigs->pluck('value', 'key'),
                'meta' => $allConfigs->map(fn($c) => [
                    'key' => $c->key,
                    'description' => $c->description,
                    'type' => $c->type,
                ])->values(),
            ],
        ]);
    }

    public function raw(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => GlobalConfig::all()]);
    }
}
