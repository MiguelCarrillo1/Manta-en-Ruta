<?php

namespace App\Http\Controllers\Api\V1\Driver;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Driver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleStatusController extends Controller
{
    public function toggleAc(int $id): JsonResponse
    {
        $vehicle = $this->getAssignedVehicle($id);
        if (!$vehicle) {
            return response()->json(['success' => false, 'message' => 'Vehículo no asignado'], 403);
        }

        $vehicle->update(['ac_status' => !$vehicle->ac_status]);
        return response()->json(['success' => true, 'data' => ['ac_status' => $vehicle->fresh()->ac_status]]);
    }

    public function toggleWifi(int $id): JsonResponse
    {
        $vehicle = $this->getAssignedVehicle($id);
        if (!$vehicle) {
            return response()->json(['success' => false, 'message' => 'Vehículo no asignado'], 403);
        }

        $vehicle->update(['wifi_status' => !$vehicle->wifi_status]);
        return response()->json(['success' => true, 'data' => ['wifi_status' => $vehicle->fresh()->wifi_status]]);
    }

    private function getAssignedVehicle(int $vehicleId): ?Vehicle
    {
        $driver = Driver::where('user_id', auth()->id())->first();
        if (!$driver) return null;

        return Vehicle::whereHas('drivers', fn($q) => $q->where('driver_id', $driver->id))
            ->find($vehicleId);
    }
}
