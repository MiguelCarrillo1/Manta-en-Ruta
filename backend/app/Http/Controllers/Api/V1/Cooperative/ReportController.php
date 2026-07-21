<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Emergency;
use App\Models\FuelRecord;
use App\Models\Journey;
use App\Models\Maintenance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|string|in:kilometers,fuel,maintenance,incidents,journeys',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'format' => 'nullable|string|in:json,csv',
        ]);

        $data = match ($request->type) {
            'kilometers' => $this->kmReport($request),
            'fuel' => $this->fuelReport($request),
            'maintenance' => $this->maintenanceReport($request),
            'incidents' => $this->incidentsReport($request),
            'journeys' => $this->journeysReport($request),
            default => [],
        };

        if ($request->format === 'csv') {
            return $this->csvResponse($data, $request->type);
        }

        return response()->json(['success' => true, 'data' => $data]);
    }

    private function kmReport(Request $request): array
    {
        $query = Journey::byTenant()->where('status', 'finished');
        $query = $this->applyDateFilter($query, $request, 'start_at');
        return [
            'total_km' => (float) $query->sum('total_distance_km'),
            'total_journeys' => $query->count(),
            'avg_km_per_journey' => round((float) $query->avg('total_distance_km'), 2),
        ];
    }

    private function fuelReport(Request $request): array
    {
        $query = FuelRecord::byTenant();
        $query = $this->applyDateFilter($query, $request);
        return [
            'total_liters' => (float) $query->sum('liters'),
            'total_cost' => (float) $query->sum('cost'),
            'avg_liter_price' => $query->sum('liters') > 0
                ? round((float) $query->sum('cost') / $query->sum('liters'), 2) : 0,
        ];
    }

    private function maintenanceReport(Request $request): array
    {
        $query = Maintenance::byTenant()->where('status', 'completed');
        $query = $this->applyDateFilter($query, $request, 'completed_date');
        return [
            'total_cost' => (float) $query->sum('cost'),
            'total_count' => $query->count(),
            'by_type' => $query->groupBy('type')->selectRaw('type, count(*) as count, sum(cost) as cost')->get()->toArray(),
        ];
    }

    private function incidentsReport(Request $request): array
    {
        $eQuery = Emergency::byTenant();
        $eQuery = $this->applyDateFilter($eQuery, $request, 'reported_at');
        $aQuery = Alert::byTenant();
        $aQuery = $this->applyDateFilter($aQuery, $request);
        return [
            'emergencies' => [
                'total' => $eQuery->count(),
                'by_type' => $eQuery->groupBy('emergency_type')->selectRaw('emergency_type, count(*) as count')->get()->toArray(),
            ],
            'alerts' => [
                'total' => $aQuery->count(),
                'by_type' => $aQuery->groupBy('type')->selectRaw('type, count(*) as count')->get()->toArray(),
            ],
        ];
    }

    private function journeysReport(Request $request): array
    {
        $query = Journey::byTenant();
        $query = $this->applyDateFilter($query, $request, 'start_at');
        return [
            'total' => $query->count(),
            'active' => (clone $query)->where('status', 'active')->count(),
            'finished' => (clone $query)->where('status', 'finished')->count(),
            'total_km' => (float) $query->sum('total_distance_km'),
            'avg_duration_min' => round((float) $query->whereNotNull('end_at')->selectRaw('AVG(EXTRACT(EPOCH FROM (end_at - start_at)) / 60) as avg')->value('avg') ?? 0, 1),
        ];
    }

    private function applyDateFilter($query, Request $request, string $column = 'created_at')
    {
        if ($request->from) {
            $query->where($column, '>=', $request->from);
        }
        if ($request->to) {
            $query->where($column, '<=', $request->to);
        }
        return $query;
    }

    private function csvResponse(array $data, string $type): JsonResponse
    {
        $filename = "reporte_{$type}_" . now()->format('Ymd_His') . '.csv';
        $path = storage_path("app/reports/{$filename}");
        $dir = dirname($path);

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $fp = fopen($path, 'w');
        fputcsv($fp, array_keys($data));
        fputcsv($fp, array_map(fn($v) => is_array($v) ? json_encode($v) : $v, $data));
        fclose($fp);

        return response()->json(['success' => true, 'data' => ['url' => url("storage/reports/{$filename}"), 'filename' => $filename]]);
    }
}
