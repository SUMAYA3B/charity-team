<?php

namespace Database\Seeders;

use App\Models\Donation;
use App\Models\DonationCase;
use App\Models\Event;
use App\Models\News;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    /**
     * Seed sample site content for development/demo.
     */
    public function run(): void
    {
        // Donation cases
        $cases = DonationCase::factory()->count(5)->published()->createQuietly();
        DonationCase::factory()->count(2)->createQuietly(); // drafts

        // Paid donations that increase collected amount for first 3 cases
        foreach ($cases->take(3) as $case) {
            $donations = Donation::factory()->count(10)->paid()->createQuietly([
                'donation_case_id' => $case->id,
            ]);
            $case->update(['collected_amount' => $donations->sum('amount')]);
        }

        // Pending / failed donations
        Donation::factory()->count(8)->pending()->createQuietly();
        Donation::factory()->count(4)->createQuietly(['status' => 'failed']);

        // News
        News::factory()->count(8)->createQuietly();
        News::factory()->count(2)->draft()->createQuietly();

        // Events
        Event::factory()->count(4)->createQuietly();
        Event::factory()->count(3)->past()->createQuietly();
        Event::factory()->count(2)->draft()->createQuietly();
    }
}
