<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'content' => $this->when($this->resource->relationLoaded('author') || $request->routeIs('news.show'), $this->content),
            'image' => $this->image ? url('storage/' . $this->image) : null,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->format('Y-m-d H:i'),
            'author' => [
                'name' => $this->author?->name,
            ],
            'excerpt' => \Illuminate\Support\Str::limit(strip_tags($this->content), 160),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
