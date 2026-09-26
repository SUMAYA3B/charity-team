<?php

namespace App\Http\Requests\Public;

use App\Http\Requests\ApiFormRequest;

class StoreVolunteerRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'city' => ['nullable', 'string', 'max:100'],
            'gender' => ['nullable', 'string', 'max:20', 'in:ذكر,أنثى'],
            'age_group' => ['nullable', 'string', 'max:20', 'in:10-14,14-18,18-30,30-50,50-70'],
            'skills' => ['nullable', 'string', 'max:2000'],
            'availability' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:3000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'الاسم الكامل مطلوب.',
            'phone.required' => 'رقم الهاتف مطلوب.',
            'email.email' => 'البريد الإلكتروني غير صحيح.',
            'gender.in' => 'قيمة الجنس غير صحيحة.',
            'age_group.in' => 'الفئة العمرية غير صحيحة.',
        ];
    }
}
