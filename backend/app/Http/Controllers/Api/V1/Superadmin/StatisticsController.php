<?php

namespace App\Http\Controllers\Api\V1\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Cooperative;
use App\Models\Journey;
use App\Models\User;
use App\Models\Vehicle;

class StatisticsController extends Controller
{
    public function global()
    {
        $stats = [
            'total_cooperatives' => Cooperative::count(),
            'active_cooperatives' => Cooperative::where('is_active', true)->count(),
            'total_users' => User::count(),
            'total_vehicles' => Vehicle::count(),
            'total_journeys' => Journey::count(),
            'active_journeys' => Journey::where('status', 'active')->count(),
        ];

        return response()->json(['success' => true, 'data' => $stats]);
    }
}
