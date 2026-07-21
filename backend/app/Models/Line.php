<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\TenantScoped;

class Line extends Model
{
    use SoftDeletes, TenantScoped;

    protected $fillable = [
        'cooperative_id', 'name', 'code', 'description',
        'color', 'direction', 'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function cooperative() { return $this->belongsTo(Cooperative::class); }
    public function stops() { return $this->belongsToMany(Stop::class, 'line_stop')->withPivot('order', 'distance_from_prev', 'estimated_minutes_from_prev')->orderByPivot('order'); }
    public function routeSegments() { return $this->hasMany(RouteSegment::class)->orderBy('sequence'); }
}
