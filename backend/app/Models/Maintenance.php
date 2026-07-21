<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\TenantScoped;

class Maintenance extends Model
{
    use SoftDeletes, TenantScoped;

    protected $fillable = [
        'cooperative_id', 'vehicle_id', 'type', 'description',
        'scheduled_date', 'completed_date', 'km_at_maintenance',
        'cost', 'provider', 'notes', 'status', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_date' => 'date',
            'completed_date' => 'date',
            'km_at_maintenance' => 'integer',
            'cost' => 'decimal:2',
        ];
    }

    public function cooperative() { return $this->belongsTo(Cooperative::class); }
    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function createdBy() { return $this->belongsTo(User::class, 'created_by'); }
}
