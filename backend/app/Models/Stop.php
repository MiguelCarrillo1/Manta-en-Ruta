<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\TenantScoped;

class Stop extends Model
{
    use SoftDeletes, TenantScoped;

    protected $fillable = [
        'cooperative_id', 'name', 'address', 'latitude', 'longitude', 'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function cooperative() { return $this->belongsTo(Cooperative::class); }
    public function lines() { return $this->belongsToMany(Line::class, 'line_stop')->withPivot('order'); }
}
