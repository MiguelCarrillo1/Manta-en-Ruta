<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserCooperative extends Pivot
{
    public $timestamps = false;

    protected $table = 'user_cooperative';

    protected $fillable = [
        'user_id', 'cooperative_id', 'role_id',
        'is_active', 'assigned_at', 'deactivated_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'assigned_at' => 'datetime',
            'deactivated_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cooperative()
    {
        return $this->belongsTo(Cooperative::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
