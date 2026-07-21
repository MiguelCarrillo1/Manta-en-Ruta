<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\TenantScoped;

class Vehicle extends Model
{
    use SoftDeletes, TenantScoped;

    protected $fillable = [
        'cooperative_id', 'plate', 'brand', 'model', 'year', 'capacity',
        'color', 'has_ac', 'has_wifi', 'ac_status', 'wifi_status',
        'last_known_lat', 'last_known_lng', 'last_position_at',
        'status', 'is_active', 'line_id',
    ];

    protected function casts(): array
    {
        return [
            'has_ac' => 'boolean',
            'has_wifi' => 'boolean',
            'ac_status' => 'boolean',
            'wifi_status' => 'boolean',
            'is_active' => 'boolean',
            'year' => 'integer',
            'capacity' => 'integer',
            'last_known_lat' => 'decimal:7',
            'last_known_lng' => 'decimal:7',
        ];
    }

    public function cooperative()
    {
        return $this->belongsTo(Cooperative::class);
    }

    public function drivers()
    {
        return $this->belongsToMany(Driver::class, 'vehicle_driver')
            ->withPivot('is_primary', 'is_active')
            ->wherePivot('is_active', true);
    }

    public function line()
    {
        return $this->belongsTo(Line::class);
    }

    public function activeJourney()
    {
        return $this->hasOne(Journey::class)->where('status', 'active');
    }
}
