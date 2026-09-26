<?php

namespace App\Services;

use App\Models\Donation;
use App\Models\DonationCase;

class DonationService
{
    /**
     * Create a pending donation record.
     *
     * @param  array<string, mixed>  $data
     */
    public function createPendingDonation(array $data): Donation
    {
        $donation = Donation::create([
            'reference_number' => Donation::generateReferenceNumber(),
            'donation_case_id' => $data['donation_case_id'] ?? null,
            'donor_name' => $data['donor_name'] ?? null,
            'donor_email' => $data['donor_email'] ?? null,
            'donor_phone' => $data['donor_phone'] ?? null,
            'donor_type' => $data['donor_type'] ?? 'general',
            'amount' => $data['amount'],
            'status' => Donation::STATUS_PENDING,
            'payment_method' => 'thawani',
            'ip_address' => $data['ip_address'] ?? null,
        ]);

        return $donation;
    }

    /**
     * Validate that a donation case is active & accepting donations.
     *
     * @throws \RuntimeException
     */
    public function validateCase(?int $donationCaseId): ?DonationCase
    {
        if (! $donationCaseId) {
            return null;
        }

        $case = DonationCase::published()->find($donationCaseId);

        if (! $case) {
            throw new \RuntimeException('حالة التبرع غير موجودة أو غير نشطة.', 404);
        }

        if ($case->completionPercentage() >= 100) {
            throw new \RuntimeException('اكتمل الهدف المالي لهذه الحالة.', 422);
        }

        if ($case->end_date && $case->end_date->isPast()) {
            throw new \RuntimeException('انتهت هذه الحالة ولم تعد تقبل التبرعات.', 422);
        }

        return $case;
    }

    /**
     * Get platform statistics used by homepage + dashboard.
     *
     * @return array<string, mixed>
     */
    public function getStatistics(): array
    {
        $totalDonations = Donation::where('status', Donation::STATUS_PAID)->sum('amount');
        $totalDonationCount = Donation::where('status', Donation::STATUS_PAID)->count();
        $totalCollectPerTarget = DonationCase::where('status', 'published')->get()
            ->sum(fn ($case) => $case->completionPercentage());

        return [
            'total_donated_amount' => round((float) $totalDonations, 2),
            'total_donation_count' => $totalDonationCount,
            'active_cases' => DonationCase::published()->count(),
            'completed_cases' => DonationCase::where('status', 'completed')->count(),
            'total_target_amount' => (float) DonationCase::published()->sum('target_amount'),
            'total_collected_amount' => (float) DonationCase::published()->sum('collected_amount'),
            'avg_completion_percentage' => $totalCollectPerTarget,
            'news_count' => \App\Models\News::published()->count(),
            'upcoming_events' => \App\Models\Event::published()->upcoming()->count(),
        ];
    }
}
