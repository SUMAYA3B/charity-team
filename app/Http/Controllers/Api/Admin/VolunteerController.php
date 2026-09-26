<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VolunteerStatusRequest;
use App\Http\Resources\VolunteerResource;
use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $volunteers = Volunteer::query()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('search'), function ($q) use ($request) {
                $s = '%' . $request->string('search')->trim() . '%';
                $q->where(function ($w) use ($s) {
                    $w->where('name', 'like', $s)
                      ->orWhere('email', 'like', $s)
                      ->orWhere('phone', 'like', $s)
                      ->orWhere('city', 'like', $s)
                      ->orWhere('skills', 'like', $s);
                });
            })
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10));

        return response()->json([
            'message' => 'تم جلب المتطوعين بنجاح.',
            'data' => VolunteerResource::collection($volunteers),
            'meta' => [
                'current_page' => $volunteers->currentPage(),
                'last_page' => $volunteers->lastPage(),
                'per_page' => $volunteers->perPage(),
                'total' => $volunteers->total(),
            ],
        ]);
    }

    public function show(Volunteer $volunteer): JsonResponse
    {
        return response()->json([
            'message' => 'تم جلب بيانات المتطوع بنجاح.',
            'data' => new VolunteerResource($volunteer),
        ]);
    }

    public function updateStatus(VolunteerStatusRequest $request, Volunteer $volunteer): JsonResponse
    {
        $volunteer->update(['status' => $request->string('status')]);

        return response()->json([
            'message' => 'تم تحديث حالة المتطوع.',
            'data' => new VolunteerResource($volunteer->fresh()),
        ]);
    }

    public function destroy(Volunteer $volunteer): JsonResponse
    {
        $volunteer->delete();

        return response()->json(['message' => 'تم حذف الطلب بنجاح.'], 200);
    }
}
