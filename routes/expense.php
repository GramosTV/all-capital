<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ExpenseController;

Route::middleware('auth')->group(function () {
    Route::post('/expense', [ExpenseController::class, 'create'])->name('expense.create');
    Route::delete('/expense', [ExpenseController::class, 'delete'])->name('expense.delete');
});
