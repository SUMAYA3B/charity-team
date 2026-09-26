<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DonationCaseImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'donation_case_id',
        'path',
        'sort_order',
    ];

    public function donationCase(): BelongsTo
    {
        return $this->belongsTo(DonationCase::class);
    }
}
