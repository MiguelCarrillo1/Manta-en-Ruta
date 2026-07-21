<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\TenantScoped;

class Emergency extends Model
{
    use TenantScoped;

    protected $fillable = [
        'cooperative_id', 'vehicle_id', 'journey_id', 'driver_id',
        'emergency_type', 'description', 'latitude', 'longitude',
        'status', 'attended_by', 'resolution_notes',
        'reported_at', 'attended_at', 'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'reported_at' => 'datetime',
            'attended_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function cooperative() { return $this->belongsTo(Cooperative::class); }
    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function journey() { return $this->belongsTo(Journey::class); }
    public function driver() { return $this->belongsTo(Driver::class); }
    public function attendedBy() { return $this->belongsTo(User::class, 'attended_by'); }
}
