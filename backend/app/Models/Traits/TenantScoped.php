<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait TenantScoped
{
    protected static function bootTenantScoped(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            $cooperativeId = request()->get('tenant_cooperative_id');
            if ($cooperativeId) {
                $builder->where('cooperative_id', $cooperativeId);
            }
        });
    }

    public function scopeByTenant(Builder $query, ?int $cooperativeId = null): Builder
    {
        $cooperativeId ??= request()->get('tenant_cooperative_id');
        if ($cooperativeId) {
            return $query->where('cooperative_id', $cooperativeId);
        }
        return $query;
    }
}
