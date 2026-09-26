<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'description',
        'image',
        'start_at',
        'end_at',
        'location',
        'city',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_at', '>=', now());
    }

    public function scopePast($query)
    {
        return $query->where('start_at', '<', now());
    }

    public static function calculateSlug(string $title): string
    {
        return \Illuminate\Support\Str::slug($title);
    }
}
