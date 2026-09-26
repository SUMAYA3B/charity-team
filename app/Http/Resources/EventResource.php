<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'description' => $this->description,
            'image' => $this->image ? url('storage/' . $this->image) : null,
            'start_at' => $this->start_at?->toIso8601String(),
            'start_at_formatted' => $this->start_at?->translatedFormat('l d F Y'),
            'end_at' => $this->end_at?->toIso8601String(),
            'location' => $this->location,
            'city' => $this->city,
            'is_published' => $this->is_published,
            'is_upcoming' => $this->start_at ? $this->start_at->isFuture() : false,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
