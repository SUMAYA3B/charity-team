<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\NewsResource;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    /**
     * List published news.
     */
    public function index(Request $request): JsonResponse
    {
        $news = News::published()
            ->with('author:id,name')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where(fn ($query) => $query
                    ->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('summary', 'like', '%' . $request->search . '%'));
            })
            ->orderByDesc('published_at')
            ->paginate($request->integer('per_page', 9));

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
     * Show a single published news article by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $news = News::published()
            ->with('author:id,name')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'message' => 'تم جلب الخبر بنجاح.',
            'data' => new NewsResource($news),
        ]);
    }

    /**
     * Latest news (for homepage).
     */
    public function latest(): JsonResponse
    {
        $news = News::published()
            ->with('author:id,name')
            ->latest('published_at')
            ->take(3)
            ->get();

        return response()->json([
            'message' => 'تم جلب آخر الأخبار بنجاح.',
            'data' => NewsResource::collection($news),
        ]);
    }
}
