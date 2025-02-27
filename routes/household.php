<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HouseholdController;

Route::middleware('auth')->group(function () {
    Route::get('/household', [HouseholdController::class, 'get'])->name('household.get');
    Route::patch('/household/join', [HouseholdController::class, 'join'])->name('household.join');
    Route::post('/household', [HouseholdController::class, 'create'])->name('household.create');
});
