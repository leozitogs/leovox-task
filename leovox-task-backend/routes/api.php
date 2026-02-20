<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CronController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Leovox Task API Routes
| Author: Leonardo Gonçalves Sobral
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Tasks CRUD
    Route::apiResource('tasks', TaskController::class);

    // Task status actions
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus']);

    // AI - Create task from natural language
    Route::post('/tasks/ai/parse', [TaskController::class, 'parseWithAI']);

    // Dashboard stats
    Route::get('/dashboard/stats', [TaskController::class, 'stats']);
});

// Cron routes (protected by secret header)
Route::post('/cron/send-reminders', [CronController::class, 'sendReminders']);
