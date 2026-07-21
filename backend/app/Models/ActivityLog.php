<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    public $timestamps = false;
    protected $table = 'activity_logs';

    protected $fillable = [
        'cooperative_id', 'user_id', 'action', 'model_type', 'model_id',
        'description', 'old_values', 'new_values', 'ip_address', 'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function user() { return $this->belongsTo(User::class); }
    public function cooperative() { return $this->belongsTo(Cooperative::class); }
}
