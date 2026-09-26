<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\ApiFormRequest;
use Illuminate\Validation\Rule;

class DonationCaseRequest extends ApiFormRequest
{
    public function rules(): array
    {
        $caseId = $this->route('case')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('donation_cases', 'slug')->ignore($caseId)],
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'target_amount' => ['required', 'numeric', 'min:1'],
            'collected_amount' => ['nullable', 'numeric', 'min:0'],
            'featured_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'images' => ['nullable', 'array'],
            'images.*' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'status' => ['nullable', 'string', Rule::in(['draft', 'published', 'completed', 'archived'])],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'عنوان الحالة مطلوب.',
            'target_amount.required' => 'الهدف المالي مطلوب.',
            'target_amount.min' => 'الهدف المالي يجب أن يكون أكبر من صفر.',
            'featured_image.mimes' => 'الصيغ المسموحة: jpeg, jpg, png, webp, gif.',
            'end_date.after_or_equal' => 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية.',
        ];
    }
}
