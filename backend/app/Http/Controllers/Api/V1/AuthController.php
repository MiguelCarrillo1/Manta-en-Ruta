<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserCooperative;
use App\Models\Cooperative;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas',
            ], 401);
        }

        $user = auth()->user();

        $user->update(['last_login_at' => now()]);

        $activeCoop = $user->userCooperatives()
            ->where('is_active', true)
            ->with('cooperative', 'role')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'access_token' => $token,
                'refresh_token' => $token,
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ],
                'roles' => $activeCoop ? [$activeCoop->role->name] : [],
                'cooperative' => $activeCoop ? [
                    'id' => $activeCoop->cooperative->id,
                    'name' => $activeCoop->cooperative->name,
                    'slug' => $activeCoop->cooperative->slug,
                ] : null,
            ],
            'message' => 'Inicio de sesión exitoso',
        ]);
    }

    public function logout(): JsonResponse
    {
        auth()->logout();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }

    public function refresh(): JsonResponse
    {
        try {
            $token = auth()->refresh();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token inválido o expirado',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'access_token' => $token,
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
            ],
        ]);
    }

    public function me(): JsonResponse
    {
        $user = auth()->user();

        $activeCoop = $user->userCooperatives()
            ->where('is_active', true)
            ->with('cooperative', 'role')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ],
                'roles' => $activeCoop ? [$activeCoop->role->name] : [],
                'cooperative' => $activeCoop ? [
                    'id' => $activeCoop->cooperative->id,
                    'name' => $activeCoop->cooperative->name,
                    'slug' => $activeCoop->cooperative->slug,
                ] : null,
            ],
        ]);
    }

    public function recovery(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422);
        }

        // En producción: enviar email con token de recuperación
        return response()->json([
            'success' => true,
            'message' => 'Si el email existe, recibirás instrucciones de recuperación',
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422);
        }

        $usuarioRole = \App\Models\Role::where('name', 'usuario')->first();
        $coop = Cooperative::first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'is_active' => true,
        ]);

        if ($coop && $usuarioRole) {
            UserCooperative::create([
                'user_id' => $user->id,
                'cooperative_id' => $coop->id,
                'role_id' => $usuarioRole->id,
                'is_active' => true,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cuenta creada exitosamente',
            'data' => $user,
        ], 201);
    }
}
