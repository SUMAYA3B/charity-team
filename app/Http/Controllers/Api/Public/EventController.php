<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * List published events, optionally filtered by upcoming/past.
     */
    public function index(Request $request): JsonResponse
    {
        $events = Event::published()
            ->when($request->filled('filter'), function ($q) use ($request) {
                if ($request->filter === 'upcoming') {
                    $q->where('start_at', '>=', now());
                } elseif ($request->filter === 'past') {
                    $q->where('start_at', '<', now());
                }
            })
            ->when($request->filled('city'), fn ($q) => $q->where('city', $request->city))
            ->orderBy('start_at', 'asc')
            ->paginate($request->integer('per_page', 9));

        return response()->json([
            'message' => 'تم جلب الفعاليات بنجاح.',
            'data' => EventResource::collection($events),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
            ],
        ]);
    }

    /**
     * Show a single published event by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $event = Event::published()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'message' => 'تم جلب الفعالية بنجاح.',
            'data' => new EventResource($event),
        ]);
    }

    /**
     * Latest upcoming events (for homepage).
     */
    public function latest(): JsonResponse
    {
        $events = Event::published()
            ->upcoming()
            ->orderBy('start_at', 'asc')
            ->take(3)
            ->get();

        return response()->json([
            'message' => 'تم جلب الفعاليات القادمة بنجاح.',
            'data' => EventResource::collection($events),
        ]);
    }
}
