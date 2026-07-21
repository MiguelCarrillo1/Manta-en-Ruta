<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\TenantScoped;

class Driver extends Model
{
    use SoftDeletes, TenantScoped;

    protected $fillable = [
        'cooperative_id', 'user_id', 'full_name', 'license_number',
        'license_type', 'license_expires_at', 'phone', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'license_expires_at' => 'date',
        ];
    }

    public function cooperative()
    {
        return $this->belongsTo(Cooperative::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicles()
    {
        return $this->belongsToMany(Vehicle::class, 'vehicle_driver')
            ->withPivot('is_primary', 'is_active')
            ->wherePivot('is_active', true);
    }
}
