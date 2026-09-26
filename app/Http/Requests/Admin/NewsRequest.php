<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\ApiFormRequest;
use Illuminate\Validation\Rule;

class NewsRequest extends ApiFormRequest
{
    public function rules(): array
    {
        $newsId = $this->route('news')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('news', 'slug')->ignore($newsId)],
            'summary' => ['nullable', 'string', 'max:1000'],
            'content' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'عنوان الخبر مطلوب.',
            'content.required' => 'محتوى الخبر مطلوب.',
            'image.image' => 'يجب أن يكون الملف صورة.',
            'image.mimes' => 'الصيغ المسموحة: jpeg, jpg, png, webp, gif.',
            'image.max' => 'حجم الصورة يتجاوز 5MB.',
        ];
    }
}
