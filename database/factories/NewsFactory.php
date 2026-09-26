<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\News>
 */
class NewsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(6),
            'slug' => fn (array $attrs) => Str::slug($attrs['title']) . '-' . substr(md5(uniqid()), 0, 5),
            'summary' => $this->faker->paragraph(2),
            'content' => $this->faker->paragraphs(6, true),
            'is_published' => true,
            'published_at' => now(),
            'author_id' => 1,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['is_published' => false, 'published_at' => null]);
    }
}
