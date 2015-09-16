<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use JWTAuth;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected $logged_user = null;

    protected $app_list_limit;

    /**
     * Check the logged user from the given token.
     */
    public function __construct()
    {
        $this->app_list_limit = env('APP_LIST_LIMIT', 50);
        $token = JWTAuth::getToken();
        if (!empty($token)) {
            $this->logged_user = JWTAuth::toUser($token);
        }
    }

    public function xhr($data, $codeOrPaginate = false)
    {
        $code = 200;
        if (!is_bool($codeOrPaginate)) {
            $code = $codeOrPaginate;
        } else {
            $paginate = $codeOrPaginate;
        }
        $response = [];
        $response['code'] = $code;

        if (is_array($data) && count($data) > 0) {
            if ($paginate) {
                $response['paginator'] = [
                    'total_count'  => $data->total(),
                    'total_pages'  => ceil($data->total() / $data->perPage()),
                    'current_page' => $data->currentPage(),
                    'limit'        => $data->count()
                ];
                $data = $data->items();
            }
            $response['data'] = $data;
        } else {
            if (empty($data) || count($data) == 0) {
                $data = 'Empty result';
            }
            $response['text'] = $data;
        }

        $response['@meta'] = [
            'server_time'     => date('Y-m-d H:i:s'),
            'server_timezone' => date_default_timezone_get(),
            'api_version'     => '1.0',
            'execution_time'  => ''
        ];

        return response()->json($response);
    }
}
