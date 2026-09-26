<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'city',
        'gender',
        'age_group',
        'skills',
        'availability',
        'notes',
        'status',
    ];

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function statusLabel(): string
    {
        return $this->status === self::STATUS_COMPLETED ? 'مكتمل' : 'في الانتظار';
    }
}
