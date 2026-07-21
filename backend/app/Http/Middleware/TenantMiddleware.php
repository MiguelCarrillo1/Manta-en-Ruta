<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $cooperativeId = auth()->payload()->get('cooperative_id');
        $role = auth()->payload()->get('role');

        if ($cooperativeId) {
            $request->merge(['tenant_cooperative_id' => $cooperativeId]);
        }

        return $next($request);
    }
}
