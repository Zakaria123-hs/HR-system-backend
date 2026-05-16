<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\ManagerLeaveController;
use App\Http\Controllers\HRLeaveContoller;
use App\Http\Controllers\leaveNotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware(['auth:sanctum', 'role:employee'])->group(function () {
    Route::get('/leave-types', function () {
        $types = DB::table('leave_types')->get();
        return response()->json($types); 
    });
    Route::get('/my-leave-requests', [LeaveRequestController::class, 'leaveRequests']);
    Route::get('/my-balances', [LeaveRequestController::class, 'myBalances']);
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
    // Optional: Route to see my own history (it's good to have this too)
    // Route::get('/leave-requests/me', [LeaveRequestController::class, 'myHistory']);

    Route::get('/my-notifications', [leaveNotificationController::class, 'myNotifications']);
    Route::post('/notifications/{id}/read', [leaveNotificationController::class, 'readNotification']);
});

Route::middleware(['auth:sanctum', 'role:manager'])->group(function () {
    Route::post('/leave/approve/{id}', [ManagerLeaveController::class, 'approve']);
    Route::post('/leave/reject/{id}', [ManagerLeaveController::class, 'reject']);
    Route::get('/leave-requests/pending', [ManagerLeaveController::class, 'pendingRequests']);
});

Route::middleware(['auth:sanctum', 'role:hr'])->group( function () {
    Route::get('/hr/approved-requests', [HRLeaveContoller::class, 'hrReport']);
});


