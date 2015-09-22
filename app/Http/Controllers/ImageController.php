<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param $type
     * @param  int $id
     * @param string $filename
     * @return Response
     */
    public function show($type, $id = 0, $filename = '')
    {
        $file = 'uploads';
        switch ($type) {
            case 'projects':
                $file .= DIRECTORY_SEPARATOR . $type;
                if ($id > 0) {
                    $file .= DIRECTORY_SEPARATOR . $id;
                }
                if (!empty($filename)) {
                    $file .= DIRECTORY_SEPARATOR . $filename;
                }
                break;
            case 'users':
                $file .= DIRECTORY_SEPARATOR . $type;
                break;
        }
        if (Storage::exists($file)) {
            $content = Storage::get($file);
        } else {
            $content = file_get_contents(public_path() . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'image-not-found.jpg');
        }

        return response($content)->header('Content-Type', 'image/jpeg');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
