<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\ApiFormRequest;

class ContactUpdateRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'is_read' => ['required', 'boolean'],
            'reply' => ['nullable', 'string'],
        ];
    }
}
