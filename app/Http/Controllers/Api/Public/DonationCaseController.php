<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\DonationCaseResource;
use App\Models\DonationCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonationCaseController extends Controller
{
    /**
     * List published donation cases.
     */
    public function index(Request $request): JsonResponse
    {
        $cases = DonationCase::published()
            ->withCount('donations')
            ->when($request->filled('featured'), fn ($q) => $q->whereNotNull('featured_image'))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->orderByDesc('is_active')
            ->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 9));

        return response()->json([
            'message' => 'تم جلب الحالات بنجاح.',
            'data' => DonationCaseResource::collection($cases),
            'meta' => [
                'current_page' => $cases->currentPage(),
                'last_page' => $cases->lastPage(),
                'per_page' => $cases->perPage(),
                'total' => $cases->total(),
            ],
        ]);
    }

    /**
     * Show a single published donation case by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $case = DonationCase::published()
            ->with(['images', 'donations' => fn ($q) => $q->where('status', 'paid')->latest()->take(5)])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'message' => 'تم جلب الحالة بنجاح.',
            'data' => new DonationCaseResource($case),
        ]);
    }
}
