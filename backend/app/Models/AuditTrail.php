<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditTrail extends Model
{
    public $timestamps = false;
    protected $table = 'audit_trails';

    protected $fillable = [
        'user_id', 'action', 'description', 'model_type', 'model_id',
        'old_values', 'new_values', 'ip_address', 'user_agent',
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
}
