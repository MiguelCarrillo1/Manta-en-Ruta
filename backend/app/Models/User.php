<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'phone', 'is_active',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        $claims = [
            'role' => null,
            'role_level' => null,
            'cooperative_id' => null,
            'permissions' => [],
        ];

        $activeCoop = $this->userCooperatives()
            ->where('is_active', true)
            ->with('role.permissions')
            ->first();

        if ($activeCoop) {
            $claims['role'] = $activeCoop->role->name;
            $claims['role_level'] = $activeCoop->role->level;
            $claims['cooperative_id'] = $activeCoop->cooperative_id;
            $claims['permissions'] = $activeCoop->role->permissions->pluck('name')->toArray();
        }

        return $claims;
    }

    public function userCooperatives()
    {
        return $this->hasMany(UserCooperative::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->userCooperatives()
            ->whereHas('role', fn($q) => $q->where('name', 'superadmin'))
            ->where('is_active', true)
            ->exists();
    }
}
