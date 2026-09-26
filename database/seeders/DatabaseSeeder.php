<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SiteSettingSeeder::class,
        ]);

        // Sample content (optional in production / local)
        if (app()->environment('local', 'staging') || env('SEED_DEMO_DATA', false)) {
            $this->call([
                SiteContentSeeder::class,
            ]);
        }
    }
}
