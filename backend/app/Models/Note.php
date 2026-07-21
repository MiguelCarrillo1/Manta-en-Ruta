<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = [
        'cooperative_id', 'vehicle_id', 'journey_id', 'driver_id',
        'content', 'note_type',
    ];

    public function cooperative() { return $this->belongsTo(Cooperative::class); }
    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function journey() { return $this->belongsTo(Journey::class); }
    public function driver() { return $this->belongsTo(Driver::class); }
}
