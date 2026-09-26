<?php

use App\Http\Controllers\Api\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\DonationCaseController as AdminDonationCaseController;
use App\Http\Controllers\Api\Admin\DonationController as AdminDonationController;
use App\Http\Controllers\Api\Admin\EventController as AdminEventController;
use App\Http\Controllers\Api\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Api\Admin\VolunteerController as AdminVolunteerController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Public\DonationCaseController;
use App\Http\Controllers\Api\Public\DonationController;
use App\Http\Controllers\Api\Public\EventController;
use App\Http\Controllers\Api\Public\NewsController;
use App\Http\Controllers\Api\Public\SiteController;
use App\Http\Controllers\Api\Public\VolunteerController as PublicVolunteerController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes are prefixed with /api/v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // =====================
    // Public / Site
    // =====================
    Route::get('/', [SiteController::class, 'home']);
    Route::get('/home', [SiteController::class, 'home']);
    Route::get('/stats', [SiteController::class, 'stats']);
    Route::get('/settings', [SiteController::class, 'settings']);
    Route::post('/contact', [SiteController::class, 'contact'])->middleware('throttle:5,1');

    // Public Volunteer registration
    Route::post('/volunteers', [PublicVolunteerController::class, 'store'])->middleware('throttle:10,1');

    // Public News
    Route::get('/news/latest', [NewsController::class, 'latest']);
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{slug}', [NewsController::class, 'show']);

    // Public Events
    Route::get('/events/latest', [EventController::class, 'latest']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{slug}', [EventController::class, 'show']);

    // Public Donation Cases
    Route::get('/cases', [DonationCaseController::class, 'index']);
    Route::get('/cases/{slug}', [DonationCaseController::class, 'show']);

    // =====================
    // Donations & Payment
    // =====================
    Route::prefix('donations')->group(function () {
        Route::post('/create-session', [DonationController::class, 'createSession']);
        Route::post('/verify', [DonationController::class, 'verify']);
        // DEV-ONLY: used by the success page (ref-based return) when no real webhook
        Route::post('/confirm-demo', [DonationController::class, 'confirmDemoPayment']);
        Route::get('/{referenceNumber}', [DonationController::class, 'show']);
    });

    // Thawani webhook (signed / verified in controller via session lookup)
    Route::post('/webhook/thawani', [DonationController::class, 'webhook'])->middleware('throttle:30,1');

    // =====================
    // Auth
    // =====================
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
    });

    // =====================
    // Admin
    // =====================
    Route::prefix('admin')->group(function () {

        Route::post('/auth/login', [AuthController::class, 'adminLogin']);

        Route::middleware(['auth:sanctum', 'admin'])->group(function () {

            Route::get('/dashboard', [DashboardController::class, 'index']);
            Route::get('/donations/summary', [AdminDonationController::class, 'summary']);

            Route::apiResource('news', AdminNewsController::class);
            Route::apiResource('events', AdminEventController::class);
            Route::apiResource('cases', AdminDonationCaseController::class);
            Route::post('/cases/{case}/toggle-status', [AdminDonationCaseController::class, 'toggleStatus']);

            Route::get('/donations', [AdminDonationController::class, 'index']);
            Route::get('/donations/{donation}', [AdminDonationController::class, 'show']);

            Route::get('/contacts', [AdminContactController::class, 'index']);
            Route::get('/contacts/{message}', [AdminContactController::class, 'show']);
            Route::patch('/contacts/{message}/read', [AdminContactController::class, 'markAsRead']);
            Route::delete('/contacts/{message}', [AdminContactController::class, 'destroy']);

            // سجل المتطوعين
            Route::get('/volunteers', [AdminVolunteerController::class, 'index']);
            Route::get('/volunteers/{volunteer}', [AdminVolunteerController::class, 'show']);
            Route::patch('/volunteers/{volunteer}/status', [AdminVolunteerController::class, 'updateStatus']);
            Route::delete('/volunteers/{volunteer}', [AdminVolunteerController::class, 'destroy']);
        });
    });
});
