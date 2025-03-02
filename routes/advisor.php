<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\AdvisorController;

Route::middleware('auth')->group(function () {
    Route::get('/advisor', [AdvisorController::class, 'get'])->name('advisor.get');
    Route::post('/advisor', [AdvisorController::class, 'generateContent'])->name('advisor.generate');
});
