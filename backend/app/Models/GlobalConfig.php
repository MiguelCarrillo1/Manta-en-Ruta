<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GlobalConfig extends Model
{
    protected $fillable = ['key', 'value', 'description', 'type'];

    protected function casts(): array
    {
        return [
            'value' => 'string',
        ];
    }
}
