<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['platform_name', 'فريق الخيري', 'general'],
            ['tagline', 'نصنع الفرق معًا من أجل حياة أفضل', 'general'],
            ['about_us', 'فريق خيري يهدف إلى جمع التبرعات لدعم المشاريع الإنسانية والخيرية، وتمكين المجتمع من المساهمة بشكل آمن وشفاف.', 'general'],
            ['mission', 'توفير قناة آمنة وشفافة للتبرع ودعم المشاريع الإنسانية.', 'general'],
            ['vision', 'أن نكون المنصة الأولى في المنطقة لتمكين العطاء بثقة وسهولة.', 'general'],
            ['contact_email', 'info@example.com', 'contact'],
            ['contact_phone', '+968 00000000', 'contact'],
            ['contact_address', 'مسقط، سلطنة عُمان', 'contact'],
            ['facebook', 'https://facebook.com', 'social'],
            ['twitter', 'https://twitter.com', 'social'],
            ['instagram', 'https://instagram.com', 'social'],
            ['youtube', 'https://youtube.com', 'social'],
            ['linkedin', 'https://linkedin.com', 'social'],
            ['privacy_policy', 'نلتزم بحماية خصوصية بيانات المستخدمين ونتعامل مع كافة البيانات بسرية تامة.', 'legal'],
            ['terms', 'باستخدامك هذه المنصة فإنك توافق على الشروط والأحكام الخاصة بالتبرع واستخدام الموقع.', 'legal'],
        ];

        foreach ($settings as [$key, $value, $group]) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'group' => $group]
            );
        }
    }
}
