<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Create the first admin account(s).
     *
     * The default credentials are read from env so real secrets are not
     * committed. Change them via the .env file or after first login.
     */
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@donation.test');
        $adminPassword = env('ADMIN_PASSWORD', 'password123');

        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'مدير النظام',
                'email' => $adminEmail,
                'password' => Hash::make($adminPassword),
                'role' => User::ROLE_SUPER_ADMIN,
                'is_active' => true,
            ]
        );

        $this->command?->info('تم إنشاء حساب المدير الأول بنجاح.');
    }
}
