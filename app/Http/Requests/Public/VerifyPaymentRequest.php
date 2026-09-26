<?php

namespace App\Http\Requests\Public;

use App\Http\Requests\ApiFormRequest;

class VerifyPaymentRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'session_id' => ['required', 'string'],
            'reference_number' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'session_id.required' => 'معرف الجلسة مطلوب.',
        ];
    }
}
