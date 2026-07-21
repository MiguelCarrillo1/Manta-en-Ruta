<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $userRole = auth()->payload()->get('role');

        if (!in_array($userRole, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para acceder a este recurso',
            ], 403);
        }

        return $next($request);
    }
}
