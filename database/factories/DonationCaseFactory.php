<?php

namespace Database\Factories;

use App\Models\DonationCase;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DonationCase>
 */
class DonationCaseFactory extends Factory
{
    public function definition(): array
    {
        $target = $this->faker->randomElement([5000, 10000, 25000, 50000, 100000]);

        return [
            'title' => $this->faker->sentence(4),
            'slug' => fn (array $attrs) => \Illuminate\Support\Str::slug($attrs['title']) . '-' . substr(md5(uniqid()), 0, 6),
            'summary' => $this->faker->paragraph(2),
            'description' => $this->faker->paragraphs(4, true),
            'target_amount' => $target,
            'collected_amount' => $this->faker->numberBetween(0, (int) $target),
            'status' => $this->faker->randomElement(['draft', 'published', 'completed']),
            'is_active' => true,
            'start_date' => now()->subMonth(),
            'end_date' => now()->addMonths(2),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => ['status' => 'published', 'is_active' => true]);
    }

    public function completed(): static
    {
        return $this->state(fn () => ['status' => 'completed']);
    }
}
