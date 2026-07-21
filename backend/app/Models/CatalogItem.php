<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'catalog_id', 'name', 'code', 'value', 'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'sort_order' => 'integer'];
    }

    public function catalog()
    {
        return $this->belongsTo(Catalog::class);
    }
}
