<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\FileUploadService;
use App\Services\SlugService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function __construct(private FileUploadService $fileUpload) {}

    /**
     * List all events.
     */
    public function index(Request $request): JsonResponse
    {
        $events = Event::query()
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%');
            })
            ->when($request->filled('filter'), function ($q) use ($request) {
                if ($request->filter === 'upcoming') {
                    $q->where('start_at', '>=', now());
                } elseif ($request->filter === 'past') {
                    $q->where('start_at', '<', now());
                }
            })
            ->orderByDesc('start_at')
            ->paginate($request->integer('per_page', 10));

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
     * Store a new event.
     */
    public function store(EventRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? SlugService::uniqueSlug($data['title'], Event::class);

        if ($request->hasFile('image')) {
            $data['image'] = $this->fileUpload->uploadImage($request->file('image'), 'events');
        }

        $event = Event::create($data);

        return response()->json([
            'message' => 'تم إنشاء الفعالية بنجاح.',
            'data' => new EventResource($event),
        ], 201);
    }

    /**
     * Show a single event.
     */
    public function show(Event $event): JsonResponse
    {
        return response()->json([
            'message' => 'تم جلب الفعالية بنجاح.',
            'data' => new EventResource($event),
        ]);
    }

    /**
     * Update an event.
     */
    public function update(EventRequest $request, Event $event): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? SlugService::uniqueSlug($data['title'], Event::class, $event->id);

        if ($request->hasFile('image')) {
            $data['image'] = $this->fileUpload->uploadImage($request->file('image'), 'events', $event->image);
        }

        $event->update($data);

        return response()->json([
            'message' => 'تم تحديث الفعالية بنجاح.',
            'data' => new EventResource($event->fresh()),
        ]);
    }

    /**
     * Delete an event.
     */
    public function destroy(Event $event): JsonResponse
    {
        $this->fileUpload->delete($event->image);
        $event->delete();

        return response()->json(['message' => 'تم حذف الفعالية بنجاح.'], 200);
    }
}
