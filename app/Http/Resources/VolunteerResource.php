<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VolunteerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'city' => $this->city,
            'gender' => $this->gender,
            'age_group' => $this->age_group,
            'skills' => $this->skills,
            'availability' => $this->availability,
            'notes' => $this->notes,
            'status' => $this->status,
            'status_label' => $this->statusLabel(),
            'created_at' => $this->created_at?->toDateTimeString(),
            'created_at_formatted' => $this->created_at?->translatedFormat('d F Y h:i'),
        ];
    }
}
