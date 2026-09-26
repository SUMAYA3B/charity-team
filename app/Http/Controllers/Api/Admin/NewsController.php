<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NewsRequest;
use App\Http\Resources\NewsResource;
use App\Models\News;
use App\Services\FileUploadService;
use App\Services\SlugService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function __construct(private FileUploadService $fileUpload) {}

    /**
     * List all news (including drafts).
     */
    public function index(Request $request): JsonResponse
    {
        $news = News::with('author:id,name')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%');
            })
            ->when($request->filled('status'), fn ($q) => $q->where('is_published', $request->boolean('status')))
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10));

        return response()->json([
            'message' => 'تم جلب الأخبار بنجاح.',
            'data' => NewsResource::collection($news),
            'meta' => [
                'current_page' => $news->currentPage(),
                'last_page' => $news->lastPage(),
                'per_page' => $news->perPage(),
                'total' => $news->total(),
            ],
        ]);
    }

    /**
     * Store a new news item.
     */
    public function store(NewsRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? SlugService::uniqueSlug($data['title'], News::class);
        $data['author_id'] = $request->user()->id;

        if ($request->filled('is_published') && $request->boolean('is_published')) {
            $data['published_at'] = $data['published_at'] ?? now();
        }

        if ($request->hasFile('image')) {
            $data['image'] = $this->fileUpload->uploadImage($request->file('image'), 'news');
        }

        $news = News::create($data);

        return response()->json([
            'message' => 'تم إنشاء الخبر بنجاح.',
            'data' => new NewsResource($news->load('author:id,name')),
        ], 201);
    }

    /**
     * Show a single news item.
     */
    public function show(News $news): JsonResponse
    {
        return response()->json([
            'message' => 'تم جلب الخبر بنجاح.',
            'data' => new NewsResource($news->load('author:id,name')),
        ]);
    }

    /**
     * Update a news item.
     */
    public function update(NewsRequest $request, News $news): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? SlugService::uniqueSlug($data['title'], News::class, $news->id);

        if ($request->has('is_published') && $request->boolean('is_published') && ! $news->published_at) {
            $data['published_at'] = now();
        }

        if ($request->hasFile('image')) {
            $data['image'] = $this->fileUpload->uploadImage($request->file('image'), 'news', $news->image);
        }

        $news->update($data);

        return response()->json([
            'message' => 'تم تحديث الخبر بنجاح.',
            'data' => new NewsResource($news->fresh('author:id,name')),
        ]);
    }

    /**
     * Delete a news item.
     */
    public function destroy(News $news): JsonResponse
    {
        $this->fileUpload->delete($news->image);
        $news->delete();

        return response()->json(['message' => 'تم حذف الخبر بنجاح.'], 200);
    }
}
