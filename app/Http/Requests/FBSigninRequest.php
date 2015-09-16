<?php

namespace App\Http\Requests;

class FBSigninRequest extends Request
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
        return [
            'first_name' => 'required',
            'last_name'  => 'required',
            'email'      => 'required|email',
            'id'         => 'required|integer',
            'gender'     => 'required|in:m,f,o',
            'url'        => 'required|string|url',
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
