<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cooperative extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'ruc', 'phone', 'email', 'address',
        'logo_url', 'scope', 'is_active', 'config',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'config' => 'array',
        ];
    }

    public function userCooperatives(): HasMany
    {
        return $this->hasMany(UserCooperative::class);
    }
}
