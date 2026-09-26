<?php

namespace Database\Factories;

use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContactMessage>
 */
class ContactMessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'phone' => $this->faker->numerify('##########'),
            'subject' => $this->faker->sentence(3),
            'message' => $this->faker->paragraph(),
            'is_read' => false,
        ];
    }

    public function read(): static
    {
        return $this->state(fn () => ['is_read' => true]);
    }
}
