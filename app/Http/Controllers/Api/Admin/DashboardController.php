<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\DonationCase;
use App\Models\Event;
use App\Models\News;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $stats = [
            'total_donations' => (float) Donation::where('status', 'paid')->sum('amount'),
            'total_donation_count' => Donation::where('status', 'paid')->count(),
            'pending_donations' => Donation::whereIn('status', ['pending', 'processing'])->count(),
            'active_cases' => DonationCase::where('status', 'published')->where('is_active', true)->count(),
            'published_news' => News::where('is_published', true)->count(),
            'total_news' => News::count(),
            'upcoming_events' => Event::where('is_published', true)->where('start_at', '>=', now())->count(),
            'published_events' => Event::where('is_published', true)->count(),
            'unread_messages' => \App\Models\ContactMessage::where('is_read', false)->count(),
            'total_collected' => (float) DonationCase::published()->sum('collected_amount'),
            'total_target' => (float) DonationCase::published()->sum('target_amount'),
        ];

        // Latest donations
        $recentDonations = Donation::with('donationCase:id,title')
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'reference_number' => $d->reference_number,
                'donor_name' => $d->donor_name,
                'amount' => (float) $d->amount,
                'status' => $d->status,
                'case_title' => $d->donationCase?->title,
                'created_at' => $d->created_at?->toDateTimeString(),
            ]);

        // Weekly donation trend (last 7 days)
        $weeklyDonations = $this->weeklyDonationTrend();

        return response()->json([
            'message' => 'تم جلب إحصائيات لوحة التحكم بنجاح.',
            'data' => [
                'stats' => $stats,
                'recent_donations' => $recentDonations,
                'weekly_donations' => $weeklyDonations,
            ],
        ]);
    }

    private function weeklyDonationTrend(): array
    {
        return collect(range(6, 0))
            ->map(function ($i) {
                $date = now()->subDays($i);

                $sum = (float) Donation::where('status', 'paid')
                    ->whereDate('created_at', $date->toDateString())
                    ->sum('amount');

                return [
                    'date' => $date->format('Y-m-d'),
                    'label' => $date->translatedFormat('D'),
                    'amount' => $sum,
                ];
            })
            ->all();
    }
}
