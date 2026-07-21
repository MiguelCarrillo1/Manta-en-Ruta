<?php

namespace App\Http\Controllers\Api\V1\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AuditTrail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::with('user:id,name');

        if ($request->action) {
            $query->where('action', $request->action);
        }
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->cooperative_id) {
            $query->where('cooperative_id', $request->cooperative_id);
        }
        if ($request->from) {
            $query->where('created_at', '>=', $request->from);
        }
        if ($request->to) {
            $query->where('created_at', '<=', $request->to);
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 30),
        ]);
    }

    public function audit(Request $request): JsonResponse
    {
        $query = AuditTrail::with('user:id,name');

        if ($request->action) {
            $query->where('action', $request->action);
        }
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->from) {
            $query->where('created_at', '>=', $request->from);
        }
        if ($request->to) {
            $query->where('created_at', '<=', $request->to);
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 30),
        ]);
    }
}
