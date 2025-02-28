<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RetirementController;

Route::middleware('auth')->group(function () {
    Route::get('/retirement', [RetirementController::class, 'get'])->name('retirement.get');
    Route::get('/search-etfs', [RetirementController::class, 'searchEtfs'])->name('etf.search');
});
