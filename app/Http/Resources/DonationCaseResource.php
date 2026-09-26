<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationCaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'description' => $this->description,
            'target_amount' => (float) $this->target_amount,
            'collected_amount' => (float) $this->collected_amount,
            'completion_percentage' => $this->completionPercentage(),
            'status' => $this->status,
            'is_active' => $this->is_active,
            'featured_image' => $this->featured_image ? url('storage/' . $this->featured_image) : null,
            'images' => DonationCaseImageResource::collection($this->whenLoaded('images')),
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'donors_count' => $this->whenCounted('donations'),
            'days_left' => $this->end_date ? max(0, now()->diffInDays($this->end_date, false)) : null,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
