<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Cooperative\AlertController;
use App\Http\Controllers\Api\V1\Cooperative\EmergencyController as CooperativeEmergencyController;
use App\Http\Controllers\Api\V1\Cooperative\LineController as CooperativeLineController;
use App\Http\Controllers\Api\V1\Cooperative\MaintenanceController;
use App\Http\Controllers\Api\V1\Cooperative\MonitoringController;
use App\Http\Controllers\Api\V1\Cooperative\ReportController;
use App\Http\Controllers\Api\V1\Cooperative\StatisticsController;
use App\Http\Controllers\Api\V1\Cooperative\StopController as CooperativeStopController;
use App\Http\Controllers\Api\V1\Cooperative\PoiController as CooperativePoiController;
use App\Http\Controllers\Api\V1\Driver\EmergencyController as DriverEmergencyController;
use App\Http\Controllers\Api\V1\Driver\FuelController as DriverFuelController;
use App\Http\Controllers\Api\V1\Driver\JourneyController as DriverJourneyController;
use App\Http\Controllers\Api\V1\Driver\NoteController as DriverNoteController;
use App\Http\Controllers\Api\V1\Driver\PositionController as DriverPositionController;
use App\Http\Controllers\Api\V1\Driver\VehicleStatusController as DriverVehicleStatusController;
use App\Http\Controllers\Api\V1\Superadmin\CatalogController;
use App\Http\Controllers\Api\V1\Superadmin\CooperativeController as SuperadminCooperativeController;
use App\Http\Controllers\Api\V1\Superadmin\GlobalConfigController;
use App\Http\Controllers\Api\V1\Superadmin\LogController;
use App\Http\Controllers\Api\V1\Superadmin\RoleController;
use App\Http\Controllers\Api\V1\Superadmin\StatisticsController as SuperadminStatisticsController;
use App\Http\Controllers\Api\V1\Superadmin\UserController as SuperadminUserController;
use App\Http\Controllers\Api\V1\User\BusController;
use App\Http\Controllers\Api\V1\User\LineController;
use App\Http\Controllers\Api\V1\User\PoiController;
use App\Http\Controllers\Api\V1\User\SearchController;
use App\Http\Controllers\Api\V1\User\StopController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/recovery', [AuthController::class, 'recovery']);

    // Auth required
    Route::middleware(['auth:api'])->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);
        Route::get('auth/me', [AuthController::class, 'me']);

        // Superadmin module (no tenant - global scope)
        Route::middleware(['role:superadmin'])->prefix('superadmin')->group(function () {
            Route::apiResource('cooperatives', SuperadminCooperativeController::class);
            Route::post('cooperatives/{id}/assign-gerente', [SuperadminCooperativeController::class, 'assignGerente']);
            Route::apiResource('catalogs', CatalogController::class);
            Route::get('catalogs/{id}/items', [CatalogController::class, 'items']);
            Route::post('catalogs/{id}/items', [CatalogController::class, 'storeItem']);
            Route::put('catalogs/{id}/items/{itemId}', [CatalogController::class, 'updateItem']);
            Route::delete('catalogs/{id}/items/{itemId}', [CatalogController::class, 'destroyItem']);
            Route::get('global-config', [GlobalConfigController::class, 'show']);
            Route::put('global-config', [GlobalConfigController::class, 'update']);
            Route::get('roles', [RoleController::class, 'index']);
            Route::get('roles/{id}', [RoleController::class, 'show']);
            Route::put('roles/{id}/permissions', [RoleController::class, 'assignPermissions']);
            Route::get('permissions', [RoleController::class, 'listPermissions']);
            Route::get('users', [SuperadminUserController::class, 'index']);
            Route::post('users', [SuperadminUserController::class, 'store']);
            Route::get('logs', [LogController::class, 'index']);
            Route::get('audit', [LogController::class, 'audit']);
            Route::get('statistics/global', [SuperadminStatisticsController::class, 'global']);
        });

        // Tenant-scoped routes
        Route::middleware(['tenant'])->group(function () {
            // Cooperative admin (Superadmin & Gerente & Admin)
            Route::middleware(['role:superadmin,gerente,admin'])->group(function () {
                Route::apiResource('cooperative/vehicles', \App\Http\Controllers\Api\V1\Cooperative\VehicleController::class);
                Route::apiResource('cooperative/drivers', \App\Http\Controllers\Api\V1\Cooperative\DriverController::class);
                Route::apiResource('cooperative/lines', CooperativeLineController::class);
                Route::post('cooperative/lines/{id}/stops', [CooperativeLineController::class, 'assignStops']);
                Route::apiResource('cooperative/stops', CooperativeStopController::class);
                Route::apiResource('cooperative/pois', CooperativePoiController::class);
                Route::get('cooperative/maintenance/upcoming', [MaintenanceController::class, 'upcoming']);
                Route::get('cooperative/maintenance/types/list', [MaintenanceController::class, 'types']);
                Route::apiResource('cooperative/maintenance', MaintenanceController::class);
                Route::get('cooperative/statistics/dashboard', [StatisticsController::class, 'dashboard']);
                Route::get('cooperative/statistics/kilometers', [StatisticsController::class, 'kilometers']);
                Route::get('cooperative/statistics/fuel', [StatisticsController::class, 'fuel']);
                Route::get('cooperative/statistics/maintenance', [StatisticsController::class, 'maintenance']);
                Route::get('cooperative/statistics/incidents', [StatisticsController::class, 'incidents']);
                Route::get('cooperative/statistics/journeys', [StatisticsController::class, 'journeys']);
                Route::get('cooperative/reports', [ReportController::class, 'generate']);
                Route::get('cooperative/emergencies', [CooperativeEmergencyController::class, 'index']);
                Route::get('cooperative/emergencies/{id}', [CooperativeEmergencyController::class, 'show']);
                Route::patch('cooperative/emergencies/{id}', [CooperativeEmergencyController::class, 'update']);
            });

            // Cooperative monitoring & operations (adds Operador)
            Route::middleware(['role:superadmin,gerente,admin,operador'])->group(function () {
                Route::get('cooperative/monitoring/vehicles', [MonitoringController::class, 'vehicles']);
                Route::get('cooperative/monitoring/vehicles/{id}', [MonitoringController::class, 'vehicleDetail']);
                Route::get('cooperative/monitoring/journeys/active', [MonitoringController::class, 'activeJourneys']);
                Route::get('cooperative/monitoring/positions', [MonitoringController::class, 'vehiclePositions']);
                Route::get('cooperative/alerts', [AlertController::class, 'index']);
                Route::get('cooperative/alerts/{id}', [AlertController::class, 'show']);
                Route::patch('cooperative/alerts/{id}/attend', [AlertController::class, 'attend']);
                Route::patch('cooperative/alerts/{id}/resolve', [AlertController::class, 'resolve']);
                Route::patch('cooperative/alerts/{id}/close', [AlertController::class, 'close']);
            });

            // Driver module (Conductor)
            Route::middleware(['role:conductor'])->prefix('driver')->group(function () {
                Route::get('journey/active', [DriverJourneyController::class, 'activeJourney']);
                Route::post('journey/start', [DriverJourneyController::class, 'start']);
                Route::put('journey/finish', [DriverJourneyController::class, 'finish']);
                Route::get('journey/history', [DriverJourneyController::class, 'history']);
                Route::post('position', [DriverPositionController::class, 'store']);
                Route::post('fuel', [DriverFuelController::class, 'store']);
                Route::post('emergency', [DriverEmergencyController::class, 'store']);
                Route::post('notes', [DriverNoteController::class, 'store']);
                Route::patch('vehicles/{id}/ac', [DriverVehicleStatusController::class, 'toggleAc']);
                Route::patch('vehicles/{id}/wifi', [DriverVehicleStatusController::class, 'toggleWifi']);
            });

            // User module (Usuario & all roles)
            Route::prefix('user')->group(function () {
                Route::get('search', [SearchController::class, 'search']);
                Route::get('search/nearby', [SearchController::class, 'nearby']);
                Route::get('lines', [LineController::class, 'index']);
                Route::get('lines/{id}', [LineController::class, 'show']);
                Route::get('stops', [StopController::class, 'index']);
                Route::get('stops/{id}', [StopController::class, 'show']);
                Route::get('pois/categories/list', [PoiController::class, 'categories']);
                Route::get('pois', [PoiController::class, 'index']);
                Route::get('pois/{id}', [PoiController::class, 'show']);
                Route::get('buses/active', [BusController::class, 'activeBuses']);
                Route::get('buses/nearby', [BusController::class, 'nearbyBuses']);
                Route::get('buses/{id}', [BusController::class, 'show']);
            });
        });
    });
});
