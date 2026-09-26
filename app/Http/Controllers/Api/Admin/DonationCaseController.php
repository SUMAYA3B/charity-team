<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DonationCaseRequest;
use App\Http\Resources\DonationCaseResource;
use App\Models\DonationCase;
use App\Models\DonationCaseImage;
use App\Services\FileUploadService;
use App\Services\SlugService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonationCaseController extends Controller
{
    public function __construct(private FileUploadService $fileUpload) {}

    /**
     * List all donation cases.
     */
    public function index(Request $request): JsonResponse
    {
        $cases = DonationCase::withCount('donations')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%');
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10));

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
     * Store a new donation case.
     */
    public function store(DonationCaseRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? SlugService::uniqueSlug($data['title'], DonationCase::class);
        $data['status'] = $data['status'] ?? 'draft';

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $this->fileUpload->uploadImage($request->file('featured_image'), 'cases');
        }

        $case = DonationCase::create($data);

        // Upload additional images
        if ($request->hasFile('images')) {
            $paths = $this->fileUpload->uploadImages($request->file('images'), 'cases/' . $case->id);
            foreach ($paths as $order => $path) {
                DonationCaseImage::create([
                    'donation_case_id' => $case->id,
                    'path' => $path,
                    'sort_order' => $order,
                ]);
            }
        }

        return response()->json([
            'message' => 'تم إنشاء الحالة بنجاح.',
            'data' => new DonationCaseResource($case->load('images')),
        ], 201);
    }

    /**
     * Show a single donation case.
     */
    public function show(DonationCase $case): JsonResponse
    {
        return response()->json([
            'message' => 'تم جلب الحالة بنجاح.',
            'data' => new DonationCaseResource($case->load('images')),
        ]);
    }

    /**
     * Update a donation case.
     */
    public function update(DonationCaseRequest $request, DonationCase $case): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? SlugService::uniqueSlug($data['title'], DonationCase::class, $case->id);

        // Keep collected amount immutable (only updated via successful payments)
        if (isset($data['collected_amount'])) {
            unset($data['collected_amount']);
        }

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $this->fileUpload->uploadImage($request->file('featured_image'), 'cases', $case->featured_image);
        }

        $case->update($data);

        // Add any new additional images
        if ($request->hasFile('images')) {
            $existingCount = $case->images()->count();
            $paths = $this->fileUpload->uploadImages($request->file('images'), 'cases/' . $case->id);
            foreach ($paths as $order => $path) {
                DonationCaseImage::create([
                    'donation_case_id' => $case->id,
                    'path' => $path,
                    'sort_order' => $existingCount + $order,
                ]);
            }
        }

        return response()->json([
            'message' => 'تم تحديث الحالة بنجاح.',
            'data' => new DonationCaseResource($case->fresh(['images'])),
        ]);
    }

    /**
     * Delete a donation case.
     */
    public function destroy(DonationCase $case): JsonResponse
    {
        $this->fileUpload->delete($case->featured_image);

        foreach ($case->images as $image) {
            $this->fileUpload->delete($image->path);
            $image->delete();
        }

        $case->delete();

        return response()->json(['message' => 'تم حذف الحالة بنجاح.'], 200);
    }

    /**
     * Toggle publish status.
     */
    public function toggleStatus(Request $request, DonationCase $case): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:draft,published,completed,archived'],
        ]);

        $case->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'تم تحديث حالة النشر.',
            'data' => new DonationCaseResource($case),
        ]);
    }
}
