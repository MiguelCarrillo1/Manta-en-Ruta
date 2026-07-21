<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\TenantScoped;

class FuelRecord extends Model
{
    use TenantScoped;
{
    protected $fillable = [
        'cooperative_id', 'vehicle_id', 'journey_id', 'driver_id',
        'liters', 'cost', 'provider', 'current_km', 'recorded_at',
    ];

    public function cooperative() { return $this->belongsTo(Cooperative::class); }
    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function journey() { return $this->belongsTo(Journey::class); }
    public function driver() { return $this->belongsTo(Driver::class); }
}
