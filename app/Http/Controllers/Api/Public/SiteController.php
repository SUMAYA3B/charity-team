<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\ContactRequest;
use App\Http\Resources\ContactMessageResource;
use App\Http\Resources\DonationCaseResource;
use App\Http\Resources\EventResource;
use App\Http\Resources\NewsResource;
use App\Models\ContactMessage;
use App\Models\Donation;
use App\Models\DonationCase;
use App\Models\Event;
use App\Models\News;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SiteController extends Controller
{
    /**
     * Homepage aggregated data.
     */
    public function home(): JsonResponse
    {
        $stats = [
            'total_donated_amount' => (float) Donation::where('status', 'paid')->sum('amount'),
            'total_donation_count' => Donation::where('status', 'paid')->count(),
            'completed_cases' => DonationCase::where('status', 'completed')->count(),
            'active_cases' => DonationCase::published()->count(),
            'news_count' => News::published()->count(),
            'upcoming_events' => Event::published()->upcoming()->count(),
        ];

        return response()->json([
            'message' => 'تم جلب بيانات الرئيسية بنجاح.',
            'data' => [
                'stats' => $stats,
                'featured_cases' => DonationCaseResource::collection(
                    DonationCase::published()->orderByDesc('collected_amount')->take(3)->get()
                ),
                'latest_news' => NewsResource::collection(
                    News::published()->with('author:id,name')->latest('published_at')->take(3)->get()
                ),
                'latest_events' => EventResource::collection(
                    Event::published()->upcoming()->orderBy('start_at', 'asc')->take(3)->get()
                ),
            ],
        ]);
    }

    /**
     * Platform statistics.
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'message' => 'تم جلب الإحصائيات بنجاح.',
            'data' => [
                'total_donated_amount' => (float) Donation::where('status', 'paid')->sum('amount'),
                'total_donation_count' => Donation::where('status', 'paid')->count(),
                'active_cases' => DonationCase::published()->count(),
                'completed_cases' => DonationCase::where('status', 'completed')->count(),
                'total_donors' => Donation::where('status', 'paid')->count(),
            ],
        ]);
    }

    /**
     * Site-wide settings (about, contact details, social links).
     */
    public function settings(): JsonResponse
    {
        $keys = ['about_us', 'mission', 'vision', 'contact_email', 'contact_phone', 'contact_address',
            'facebook', 'twitter', 'instagram', 'youtube', 'linkedin', 'privacy_policy', 'terms'];

        $data = [];
        foreach ($keys as $key) {
            $data[$key] = SiteSetting::get($key);
        }

        return response()->json([
            'message' => 'تم جلب الإعدادات بنجاح.',
            'data' => $data,
        ]);
    }

    /**
     * Store a contact message.
     */
    public function contact(ContactRequest $request): JsonResponse
    {
        $message = ContactMessage::create($request->validated());

        return response()->json([
            'message' => 'تم إرسال رسالتك بنجاح، سنتواصل معك قريبًا.',
            'data' => (new ContactMessageResource($message))->only(['name', 'subject']),
        ], 201);
    }
}
