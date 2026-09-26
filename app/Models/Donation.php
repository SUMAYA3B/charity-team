<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'donation_case_id',
        'donor_name',
        'donor_email',
        'donor_phone',
        'donor_type',
        'amount',
        'status',
        'payment_method',
        'thawani_session_id',
        'transaction_id',
        'payment_metadata',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'payment_metadata' => 'array',
        ];
    }

    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_PAID = 'paid';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';

    public function donationCase(): BelongsTo
    {
        return $this->belongsTo(DonationCase::class);
    }

    public function payment(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function scopePaid($query)
    {
        return $query->where('status', self::STATUS_PAID);
    }

    public function scopePending($query)
    {
        return $query->whereIn('status', [self::STATUS_PENDING, self::STATUS_PROCESSING]);
    }

    public static function generateReferenceNumber(): string
    {
        do {
            $ref = 'DON-' . strtoupper(substr(uniqid(), -8)) . '-' . random_int(100, 999);
        } while (static::where('reference_number', $ref)->exists());

        return $ref;
    }

    public function markAsPaid(array $data = []): void
    {
        $this->update([
            'status' => self::STATUS_PAID,
            'transaction_id' => $data['transaction_id'] ?? $this->transaction_id,
            'payment_metadata' => array_merge($this->payment_metadata ?? [], $data),
        ]);
    }

    public function markAsFailed(array $data = []): void
    {
        $this->update([
            'status' => self::STATUS_FAILED,
            'payment_metadata' => array_merge($this->payment_metadata ?? [], $data),
        ]);
    }

    public function markAsCancelled(array $data = []): void
    {
        $this->update([
            'status' => self::STATUS_CANCELLED,
            'payment_metadata' => array_merge($this->payment_metadata ?? [], $data),
        ]);
    }
}
