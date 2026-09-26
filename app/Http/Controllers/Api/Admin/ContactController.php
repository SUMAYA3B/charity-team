<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $messages = ContactMessage::query()
            ->when($request->filled('status'), fn ($q) => $q->where('is_read', $request->boolean('status')))
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10));

        return response()->json([
            'message' => 'تم جلب الرسائل بنجاح.',
            'data' => ContactMessageResource::collection($messages),
            'meta' => [
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
            ],
        ]);
    }

    public function show(ContactMessage $message): JsonResponse
    {
        return response()->json([
            'message' => 'تم جلب الرسالة بنجاح.',
            'data' => new ContactMessageResource($message),
        ]);
    }

    public function markAsRead(ContactMessage $message): JsonResponse
    {
        $message->update(['is_read' => true]);

        return response()->json([
            'message' => 'تم تحديث حالة الرسالة.',
            'data' => new ContactMessageResource($message->fresh()),
        ]);
    }

    public function destroy(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return response()->json(['message' => 'تم حذف الرسالة بنجاح.'], 200);
    }
}
