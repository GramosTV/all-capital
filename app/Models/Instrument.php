<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instrument extends Model
{
    protected $fillable = [
        'name',
        'yearly_return',
        'weight',
    ];

    protected $casts = [
        'yearly_return' => 'float',
        'weight' => 'float',
    ];
}
