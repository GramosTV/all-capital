<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('household', function () {
        return Inertia::render('household');
    })->name('household');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/expense.php';
require __DIR__ . '/household.php';
require __DIR__ . '/retirement.php';
require __DIR__ . '/auth.php';
