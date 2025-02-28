<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retirement extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'instruments'];

    protected $casts = [
        'instruments' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
