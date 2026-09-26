<?php

namespace Database\Factories;

use App\Models\Donation;
use App\Models\DonationCase;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Donation>
 */
class DonationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'reference_number' => fn () => Donation::generateReferenceNumber(),
            'donation_case_id' => DonationCase::factory(),
            'donor_name' => $this->faker->name(),
            'donor_email' => $this->faker->safeEmail(),
            'donor_phone' => $this->faker->numerify('##########'),
            'donor_type' => 'general',
            'amount' => $this->faker->numberBetween(5, 500),
            'status' => $this->faker->randomElement(['pending', 'processing', 'paid', 'failed', 'cancelled']),
            'payment_method' => 'thawani',
        ];
    }

    public function paid(): static
    {
        return $this->state(fn () => ['status' => 'paid', 'transaction_id' => 'TX' . strtoupper(substr(uniqid(), -10))]);
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'pending']);
    }
}
