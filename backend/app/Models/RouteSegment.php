<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RouteSegment extends Model
{
    protected $fillable = ['line_id', 'sequence', 'start_stop_id', 'end_stop_id', 'polyline', 'distance_km'];

    public function line() { return $this->belongsTo(Line::class); }
    public function startStop() { return $this->belongsTo(Stop::class, 'start_stop_id'); }
    public function endStop() { return $this->belongsTo(Stop::class, 'end_stop_id'); }
}
