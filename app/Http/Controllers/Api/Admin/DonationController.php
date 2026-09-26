<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DonationResource;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    /**
     * List donations with search, filter, sort, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $donations = Donation::with('donationCase:id,title,slug')
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->search;
                $q->where(function ($query) use ($search) {
                    $query->where('reference_number', 'like', "%{$search}%")
                        ->orWhere('donor_name', 'like', "%{$search}%")
                        ->orWhere('donor_email', 'like', "%{$search}%")
                        ->orWhere('transaction_id', 'like', "%{$search}%")
                        ->orWhereHas('donationCase', fn ($sub) => $sub->where('title', 'like', "%{$search}%"));
                });
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->when($request->filled('case_id'), fn ($q) => $q->where('donation_case_id', $request->case_id))
            ->when($request->filled('date_from'), fn ($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->filled('date_to'), fn ($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->orderBy($request->input('sort_by', 'created_at'), $request->input('sort_dir', 'desc'))
            ->paginate($request->integer('per_page', 10));

        return response()->json([
            'message' => 'تم جلب التبرعات بنجاح.',
            'data' => DonationResource::collection($donations),
            'meta' => [
                'current_page' => $donations->currentPage(),
                'last_page' => $donations->lastPage(),
                'per_page' => $donations->perPage(),
                'total' => $donations->total(),
            ],
        ]);
    }

    /**
     * Show a single donation.
     */
    public function show(Donation $donation): JsonResponse
    {
        return response()->json([
            'message' => 'تم جلب التبرع بنجاح.',
            'data' => new DonationResource($donation->load('donationCase', 'payment')),
        ]);
    }

    /**
     * Summary of donation statuses (for filters/dashboard).
     */
    public function summary(): JsonResponse
    {
        return response()->json([
            'message' => 'تم جلب ملخص التبرعات.',
            'data' => [
                'total' => Donation::count(),
                'paid' => Donation::where('status', 'paid')->count(),
                'pending' => Donation::whereIn('status', ['pending', 'processing'])->count(),
                'failed' => Donation::where('status', 'failed')->count(),
                'cancelled' => Donation::where('status', 'cancelled')->count(),
                'total_amount' => (float) Donation::where('status', 'paid')->sum('amount'),
            ],
        ]);
    }
}
