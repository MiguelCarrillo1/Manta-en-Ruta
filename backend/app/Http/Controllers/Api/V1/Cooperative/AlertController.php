<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AlertController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Alert::byTenant()->with(['vehicle:id,plate', 'assignedTo:id,name', 'reportedBy:id,name']);

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->severity) {
            $query->where('severity', $request->severity);
        }
        if ($request->type) {
            $query->where('type', $request->type);
        }

        $alerts = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'data' => $alerts]);
    }

    public function show(int $id): JsonResponse
    {
        $alert = Alert::byTenant()->with(['vehicle', 'journey', 'assignedTo', 'reportedBy'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $alert]);
    }

    public function attend(int $id): JsonResponse
    {
        $alert = Alert::byTenant()->whereIn('status', ['reported'])->findOrFail($id);

        $alert->update([
            'status' => 'attending',
            'assigned_to' => auth()->id(),
            'attended_at' => now(),
        ]);

        return response()->json(['success' => true, 'data' => $alert, 'message' => 'Alerta atendida']);
    }

    public function resolve(Request $request, int $id): JsonResponse
    {
        $alert = Alert::byTenant()->whereIn('status', ['reported', 'attending'])->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'resolution_notes' => 'nullable|string|max:500',
        ]);

        $alert->update([
            'status' => 'resolved',
            'description' => $request->resolution_notes
                ? ($alert->description ? $alert->description . "\n---\nResolución: " . $request->resolution_notes : 'Resolución: ' . $request->resolution_notes)
                : $alert->description,
            'resolved_at' => now(),
        ]);

        return response()->json(['success' => true, 'data' => $alert, 'message' => 'Alerta resuelta']);
    }

    public function close(int $id): JsonResponse
    {
        $alert = Alert::byTenant()->where('status', 'resolved')->findOrFail($id);

        $alert->update([
            'status' => 'closed',
            'closed_at' => now(),
        ]);

        return response()->json(['success' => true, 'data' => $alert, 'message' => 'Alerta cerrada']);
    }
}
