<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\TenantScoped;

class Alert extends Model
{
    use SoftDeletes, TenantScoped;

    protected $fillable = [
        'cooperative_id', 'vehicle_id', 'journey_id', 'type', 'severity',
        'title', 'description', 'status', 'assigned_to', 'reported_by',
        'latitude', 'longitude', 'attended_at', 'resolved_at', 'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'attended_at' => 'datetime',
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function cooperative() { return $this->belongsTo(Cooperative::class); }
    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function journey() { return $this->belongsTo(Journey::class); }
    public function assignedTo() { return $this->belongsTo(User::class, 'assigned_to'); }
    public function reportedBy() { return $this->belongsTo(User::class, 'reported_by'); }
}
