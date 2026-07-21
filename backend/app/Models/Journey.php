<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\TenantScoped;

class Journey extends Model
{
    use TenantScoped;

    protected $fillable = [
        'cooperative_id', 'vehicle_id', 'driver_id',
        'start_km', 'end_km', 'start_at', 'end_at',
        'status', 'total_distance_km', 'total_fuel_liters', 'notes_summary',
    ];

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'start_km' => 'integer',
            'end_km' => 'integer',
        ];
    }

    public function cooperative() { return $this->belongsTo(Cooperative::class); }
    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function driver() { return $this->belongsTo(Driver::class); }
    public function positions() { return $this->hasMany(Position::class); }
    public function fuelRecords() { return $this->hasMany(FuelRecord::class); }
    public function notes() { return $this->hasMany(Note::class); }
    public function emergencies() { return $this->hasMany(Emergency::class); }
}
