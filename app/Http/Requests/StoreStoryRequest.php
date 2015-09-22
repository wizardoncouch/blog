<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class StoreStoryRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if (!$this->has('id')) {
            return [
                'title' => 'required'
            ];
        }

        return [
            'id'    => 'required|integer|exists:stories,id',
            'title' => 'required'
        ];
    }
}
