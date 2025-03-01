<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\InstrumentController;

Route::middleware('auth')->group(function () {
    Route::post('/instruments', [InstrumentController::class, 'create'])->name('instruments.create');
    Route::delete('/instruments/{id}', [InstrumentController::class, 'delete'])->name('instruments.delete');
});
