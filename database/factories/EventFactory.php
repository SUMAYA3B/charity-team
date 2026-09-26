<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(5),
            'slug' => fn (array $attrs) => Str::slug($attrs['title']) . '-' . substr(md5(uniqid()), 0, 5),
            'summary' => $this->faker->paragraph(2),
            'description' => $this->faker->paragraphs(4, true),
            'start_at' => now()->addDays(rand(1, 30))->addHours(rand(9, 18)),
            'end_at' => fn (array $attrs) => \Illuminate\Support\Carbon::parse($attrs['start_at'])->addHours(3),
            'location' => $this->faker->streetAddress(),
            'city' => $this->faker->randomElement(['مسقط', 'صلالة', 'نزوى', 'صحار', 'البريمي']),
            'is_published' => true,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['is_published' => false]);
    }

    public function past(): static
    {
        return $this->state(fn () => [
            'start_at' => now()->subDays(rand(5, 30))->addHours(11),
            'end_at' => now()->subDays(rand(5, 30))->addHours(14),
        ]);
    }
}
