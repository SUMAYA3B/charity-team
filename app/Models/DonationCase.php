<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DonationCase extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'description',
        'target_amount',
        'collected_amount',
        'status',
        'featured_image',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'target_amount' => 'decimal:2',
            'collected_amount' => 'decimal:2',
            'is_active' => 'boolean',
            'start_date' => 'date',
            'end_date' => 'date',
            'published_at' => 'datetime',
        ];
    }

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_ARCHIVED = 'archived';

    public function images(): HasMany
    {
        return $this->hasMany(DonationCaseImage::class);
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function donorsCount(): int
    {
        return $this->donations()->where('status', Donation::STATUS_PAID)->count();
    }

    public function completionPercentage(): float
    {
        if ($this->target_amount <= 0) {
            return 0;
        }

        return round(($this->collected_amount / $this->target_amount) * 100, 1);
    }

    public function isActive(): bool
    {
        return $this->is_active && $this->status === self::STATUS_PUBLISHED;
    }

    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED)->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->whereNotNull('featured_image');
    }

    public static function calculateSlug(string $title): string
    {
        return \Illuminate\Support\Str::slug($title);
    }
}
