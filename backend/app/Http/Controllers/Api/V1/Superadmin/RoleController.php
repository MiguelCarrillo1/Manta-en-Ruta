<?php

namespace App\Http\Controllers\Api\V1\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        $roles = Role::with('permissions:id,name,display_name,module')->get();
        return response()->json(['success' => true, 'data' => $roles]);
    }

    public function show(int $id): JsonResponse
    {
        $role = Role::with('permissions')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $role]);
    }

    public function assignPermissions(Request $request, int $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $role->permissions()->sync($request->permission_ids);

        return response()->json([
            'success' => true,
            'data' => $role->load('permissions'),
            'message' => 'Permisos asignados exitosamente',
        ]);
    }

    public function listPermissions(): JsonResponse
    {
        $permissions = Permission::all()->groupBy('module');
        return response()->json(['success' => true, 'data' => $permissions]);
    }
}
