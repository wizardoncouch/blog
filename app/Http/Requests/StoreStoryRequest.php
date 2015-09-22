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
                'title'       => 'required',
                'category_id' => 'required|integer|exists:categories,id'
            ];
        }

        return [
            'id'          => 'required|integer|exists:stories,id',
            'category_id' => 'required|integer|exists:categories,id',
            'title'       => 'required'
        ];
    }

    /**
     * @param array $errors
     * @return \Illuminate\Http\JsonResponse
     */
    public function response(array $errors)
    {
        $errors = array_merge(['code' => 422], $errors);

        return response()->json($errors);
    }
}
