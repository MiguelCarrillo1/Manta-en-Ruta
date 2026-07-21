<?php

namespace App\Http\Controllers\Api\V1\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Cooperative;
use App\Models\Role;
use App\Models\User;
use App\Models\UserCooperative;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CooperativeController extends Controller
{
    public function index(): JsonResponse
    {
        $cooperatives = Cooperative::withCount(['userCooperatives'])->get();
        return response()->json(['success' => true, 'data' => $cooperatives]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
            'slug' => 'required|string|max:50|unique:cooperatives,slug',
            'ruc' => 'nullable|string|max:13',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:200',
            'address' => 'nullable|string|max:255',
            'logo_url' => 'nullable|string|max:500',
            'scope' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $cooperative = Cooperative::create($validator->validated());

        return response()->json(['success' => true, 'data' => $cooperative, 'message' => 'Cooperativa creada'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $cooperative = Cooperative::with('userCooperatives.user', 'userCooperatives.role')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $cooperative]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $cooperative = Cooperative::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:200',
            'slug' => 'sometimes|string|max:50|unique:cooperatives,slug,' . $id,
            'ruc' => 'nullable|string|max:13',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:200',
            'address' => 'nullable|string|max:255',
            'logo_url' => 'nullable|string|max:500',
            'scope' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $cooperative->update($validator->validated());

        return response()->json(['success' => true, 'data' => $cooperative, 'message' => 'Cooperativa actualizada']);
    }

    public function destroy(int $id): JsonResponse
    {
        $cooperative = Cooperative::findOrFail($id);
        $cooperative->update(['is_active' => false]);
        return response()->json(['success' => true, 'message' => 'Cooperativa desactivada']);
    }

    public function assignGerente(Request $request, int $id): JsonResponse
    {
        $cooperative = Cooperative::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $gerenteRole = Role::where('name', 'gerente')->firstOrFail();

        UserCooperative::updateOrCreate(
            ['user_id' => $request->user_id, 'cooperative_id' => $id],
            ['role_id' => $gerenteRole->id, 'is_active' => true, 'assigned_at' => now()],
        );

        return response()->json(['success' => true, 'message' => 'Gerente asignado exitosamente']);
    }
}
