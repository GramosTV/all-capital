<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'amount', 'date', 'household_id'];

    protected $casts = [
        'amount' => 'float',
    ];

    public function household()
    {
        return $this->belongsTo(Household::class);
    }
}
