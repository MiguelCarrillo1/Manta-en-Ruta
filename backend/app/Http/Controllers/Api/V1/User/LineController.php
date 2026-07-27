<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Line;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;

class LineController extends Controller
{
    public function index(): JsonResponse
    {
        $lines = Line::byTenant()
            ->where('is_active', true)
            ->with(['stops' => fn($q) => $q->select('stops.id', 'stops.name', 'stops.latitude', 'stops.longitude')->orderByPivot('order')])
            ->get()
            ->map(fn($l) => [
                'id' => $l->id,
                'name' => $l->name,
                'code' => $l->code,
                'color' => $l->color,
                'direction' => $l->direction,
                'stops' => $l->stops->map(fn($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                    'latitude' => $s->latitude,
                    'longitude' => $s->longitude,
                    'order' => $s->pivot->order,
                    'tramo' => $s->pivot->tramo,
                ]),
                'active_buses_count' => Vehicle::whereHas('activeJourney')->whereHas('line', fn($q) => $q->where('lines.id', $l->id))->count(),
            ]);

        return response()->json(['success' => true, 'data' => $lines]);
    }

    public function show(int $id): JsonResponse
    {
        $line = Line::byTenant()
            ->with(['stops', 'stops.cooperative'])
            ->findOrFail($id);

        $buses = Vehicle::byTenant()
            ->whereHas('activeJourney')
            ->with('activeJourney')
            ->get()
            ->map(fn($v) => [
                'id' => $v->id,
                'plate' => $v->plate,
                'last_known_lat' => $v->last_known_lat,
                'last_known_lng' => $v->last_known_lng,
                'has_ac' => $v->has_ac,
                'has_wifi' => $v->has_wifi,
                'ac_status' => $v->ac_status,
                'wifi_status' => $v->wifi_status,
            ]);

        return response()->json(['success' => true, 'data' => ['line' => $line, 'active_buses' => $buses]]);
    }
}
