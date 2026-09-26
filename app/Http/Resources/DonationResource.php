<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference_number' => $this->reference_number,
            'donor_name' => $this->donor_name,
            'donor_email' => $this->donor_email,
            'donor_phone' => $this->donor_phone,
            'amount' => (float) $this->amount,
            'status' => $this->status,
            'status_label' => $this->statusLabel(),
            'payment_method' => $this->payment_method,
            'transaction_id' => $this->transaction_id,
            'donation_case' => $this->whenLoaded('donationCase', fn () => new DonationCaseResource($this->donationCase)),
            'created_at' => $this->created_at?->toDateTimeString(),
            'created_at_formatted' => $this->created_at?->translatedFormat('d F Y h:i'),
        ];
    }

    private function statusLabel(): string
    {
        return match ($this->status) {
            'pending' => 'قيد الانتظار',
            'processing' => 'قيد المعالجة',
            'paid' => 'مكتمل',
            'failed' => 'فشل',
            'cancelled' => 'ملغي',
            default => $this->status,
        };
    }
}
