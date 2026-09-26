<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreVolunteerRequest;
use App\Http\Resources\VolunteerResource;
use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;

class VolunteerController extends Controller
{
    /**
     * Store a public volunteer application.
     */
    public function store(StoreVolunteerRequest $request): JsonResponse
    {
        $volunteer = Volunteer::create([
            ...$request->validated(),
            'status' => Volunteer::STATUS_PENDING,
        ]);

        return response()->json([
            'message' => 'تم تسجيلك بنجاح، وسيتواصل معك فريق الجمعية الخيرية عند توفر الفرص والمبادرات المناسبة.',
            'data' => new VolunteerResource($volunteer),
        ], 201);
    }
}
