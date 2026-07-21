<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $permissions = auth()->payload()->get('permissions', []);

        if (!in_array($permission, $permissions)) {
            $userRole = auth()->payload()->get('role');
            if ($userRole === 'superadmin') {
                return $next($request);
            }

            return response()->json([
                'success' => false,
                'message' => 'No tienes el permiso requerido: ' . $permission,
            ], 403);
        }

        return $next($request);
    }
}
