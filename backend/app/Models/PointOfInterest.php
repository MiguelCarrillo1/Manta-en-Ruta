<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\TenantScoped;

class PointOfInterest extends Model
{
    use SoftDeletes, TenantScoped;

    protected $table = 'points_of_interest';

    protected $fillable = [
        'cooperative_id', 'name', 'category', 'address',
        'latitude', 'longitude', 'phone', 'website',
        'description', 'photo_url', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'is_active' => 'boolean',
        ];
    }
}
