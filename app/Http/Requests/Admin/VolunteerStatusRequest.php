<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\ApiFormRequest;
use Illuminate\Validation\Rule;

class VolunteerStatusRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['pending', 'completed'])],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'الحالة مطلوبة.',
            'status.in' => 'الحالة يجب أن تكون في الانتظار أو مكتمل.',
        ];
    }
}
