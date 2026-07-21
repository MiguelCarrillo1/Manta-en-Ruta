<?php

namespace App\Http\Controllers\Api\V1\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Emergency;
use App\Models\Journey;
use App\Models\FuelRecord;
use App\Models\Maintenance;
use App\Models\Vehicle;
use App\Models\Driver;
use App\Models\Position;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $coopId = request()->get('tenant_cooperative_id');

        $totalVehicles = Vehicle::byTenant()->count();
        $activeVehicles = Vehicle::byTenant()->where('status', 'in_journey')->count();
        $totalDrivers = Driver::byTenant()->count();
        $activeJourneys = Journey::byTenant()->where('status', 'active')->count();
        $activeAlerts = Alert::byTenant()->whereIn('status', ['reported', 'attending'])->count();
        $upcomingMaintenance = Maintenance::byTenant()
            ->whereIn('status', ['scheduled', 'in_progress'])
            ->where(function ($q) {
                $q->whereNull('scheduled_date')
                  ->orWhere('scheduled_date', '<=', now()->addDays(30));
            })->count();

        $kmToday = Journey::byTenant()
            ->whereDate('start_at', today())
            ->sum('total_distance_km');

        $emergenciesToday = Emergency::byTenant()
            ->whereDate('reported_at', today())
            ->count();

        return response()->json(['success' => true, 'data' => [
            'total_vehicles' => $totalVehicles,
            'active_vehicles' => $activeVehicles,
            'total_drivers' => $totalDrivers,
            'active_journeys' => $activeJourneys,
            'active_alerts' => $activeAlerts,
            'upcoming_maintenance' => $upcomingMaintenance,
            'km_today' => (float) $kmToday,
            'emergencies_today' => $emergenciesToday,
        ]]);
    }

    public function kilometers(Request $request): JsonResponse
    {
        $period = $request->period ?? 'month';
        $data = $this->periodQuery(
            Journey::byTenant()->where('status', 'finished'),
            'total_distance_km',
            'sum',
            $period,
            'start_at',
        );
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function fuel(Request $request): JsonResponse
    {
        $period = $request->period ?? 'month';
        $liters = $this->periodQuery(FuelRecord::byTenant(), 'liters', 'sum', $period);
        $cost = $this->periodQuery(FuelRecord::byTenant(), 'cost', 'sum', $period);
        return response()->json(['success' => true, 'data' => ['liters' => $liters, 'cost' => $cost]]);
    }

    public function maintenance(Request $request): JsonResponse
    {
        $period = $request->period ?? 'month';
        $cost = $this->periodQuery(
            Maintenance::byTenant()->where('status', 'completed'),
            'cost',
            'sum',
            $period,
            'completed_date',
        );
        $count = $this->periodQuery(
            Maintenance::byTenant()->where('status', 'completed'),
            DB::raw('count(*)'),
            'raw',
            $period,
            'completed_date',
        );
        return response()->json(['success' => true, 'data' => ['count' => $count, 'cost' => $cost]]);
    }

    public function incidents(Request $request): JsonResponse
    {
        $period = $request->period ?? 'month';
        $emergencies = $this->periodQuery(Emergency::byTenant(), DB::raw('count(*)'), 'raw', $period, 'reported_at');

        $alertsQuery = Alert::byTenant();
        if ($request->type) {
            $alertsQuery->where('type', $request->type);
        }
        $alerts = $this->periodQuery($alertsQuery, DB::raw('count(*)'), 'raw', $period);

        return response()->json(['success' => true, 'data' => [
            'emergencies' => $emergencies,
            'alerts' => $alerts,
        ]]);
    }

    public function journeys(Request $request): JsonResponse
    {
        $period = $request->period ?? 'month';
        $count = $this->periodQuery(Journey::byTenant(), DB::raw('count(*)'), 'raw', $period);

        $avgDuration = Journey::byTenant()
            ->whereNotNull('end_at')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (end_at - start_at)) / 60) as avg_minutes')
            ->value('avg_minutes');

        $avgKm = Journey::byTenant()
            ->whereNotNull('total_distance_km')
            ->avg('total_distance_km');

        return response()->json(['success' => true, 'data' => [
            'count' => $count,
            'avg_duration_minutes' => round((float) $avgDuration, 1),
            'avg_km' => round((float) $avgKm, 2),
        ]]);
    }

    private function periodQuery($query, $column, string $aggregate, string $period, string $dateColumn = 'created_at'): array
    {
        $format = match ($period) {
            'year' => 'YYYY',
            'month' => 'YYYY-MM',
            'week' => 'IYYY-IW',
            default => 'YYYY-MM-DD',
        };

        $results = $query
            ->select(
                DB::raw("TO_CHAR($dateColumn, '$format') as label"),
                $aggregate === 'raw' ? DB::raw("$column as value") : DB::raw("$aggregate($column) as value")
            )
            ->groupBy('label')
            ->orderBy('label')
            ->get();

        return $results->toArray();
    }
}
