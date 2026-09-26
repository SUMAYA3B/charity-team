<?php

namespace App\Services;

use App\Models\DonationCase;
use App\Models\News;
use App\Models\Event;

class SlugService
{
    public static function uniqueSlug(string $title, string $modelClass, ?int $ignoreId = null): string
    {
        $base = self::makeSlug($title);
        $slug = $base;
        $i = 1;

        while (self::exists($modelClass, $slug, $ignoreId)) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }

    private static function makeSlug(string $title): string
    {
        $transliterated = self::transliterateArabic($title);

        return \Illuminate\Support\Str::slug($transliterated) ?: 'item';
    }

    private static function transliterateArabic(string $text): string
    {
        $map = [
            'ا' => 'a', 'أ' => 'a', 'إ' => 'e', 'آ' => 'a',
            'ب' => 'b', 'ت' => 't', 'ث' => 'th', 'ج' => 'j',
            'ح' => 'h', 'خ' => 'kh', 'د' => 'd', 'ذ' => 'dh',
            'ر' => 'r', 'ز' => 'z', 'س' => 's', 'ش' => 'sh',
            'ص' => 's', 'ض' => 'd', 'ط' => 't', 'ظ' => 'z',
            'ع' => 'a', 'غ' => 'gh', 'ف' => 'f', 'ق' => 'q',
            'ك' => 'k', 'ل' => 'l', 'م' => 'm', 'ن' => 'n',
            'ه' => 'h', 'و' => 'w', 'ي' => 'y', 'ى' => 'a',
            'ة' => 't', 'ء' => '',
            ' ' => '-', '_' => '-',
        ];

        $result = '';
        foreach (mb_str_split($text) as $char) {
            $result .= $map[$char] ?? $char;
        }

        return $result;
    }

    private static function exists(string $modelClass, string $slug, ?int $ignoreId): bool
    {
        $query = $modelClass::where('slug', $slug);
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }
}
