<?php

namespace App\Http\Requests\Public;

use App\Http\Requests\ApiFormRequest;
use Illuminate\Validation\Rule;

class DonateRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'donation_case_id' => ['nullable', 'integer', 'exists:donation_cases,id'],
            'amount' => ['required', 'numeric', 'min:1', 'max:1000000'],
            'donor_name' => ['nullable', 'string', 'max:150'],
            'donor_email' => ['nullable', 'email', 'max:255'],
            'donor_phone' => ['nullable', 'string', 'max:20'],
            'donor_type' => ['sometimes', 'string', Rule::in(['general', 'specific'])],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'يرجى تحديد مبلغ التبرع.',
            'amount.numeric' => 'مبلغ التبرع يجب أن يكون رقمًا.',
            'amount.min' => 'الحد الأدنى للتبرع هو 1.',
            'donation_case_id.exists' => 'حالة التبرع غير موجودة.',
            'donor_email.email' => 'البريد الإلكتروني غير صحيح.',
        ];
    }
}
