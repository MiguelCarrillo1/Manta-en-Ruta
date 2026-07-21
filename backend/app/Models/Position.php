<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = [
        'cooperative_id', 'vehicle_id', 'journey_id',
        'latitude', 'longitude', 'speed', 'heading',
        'accuracy', 'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'recorded_at' => 'datetime',
        ];
    }

    public function cooperative() { return $this->belongsTo(Cooperative::class); }
    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function journey() { return $this->belongsTo(Journey::class); }
}
