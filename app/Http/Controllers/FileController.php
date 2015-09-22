<?php

namespace App\Http\Controllers;

use App\Category;
use App\File;
use App\Http\Requests\EditFileRequest;
use App\Http\Requests\StoreFileRequest;
use App\Project;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Image;


class FileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        //
        try {
            $filter = null;
            $user_id = 0;
            $project_id = 0;
            $category_id = 0;
            if ($request->has('filter')) {
                $filter = $request->get('filter');
            }
            if ($request->has('user_id')) {
                $user_id = $request->get('user_id');
            }
            if ($request->has('project_id')) {
                $project_id = $request->get('project_id');
            }
            if ($request->has('category_id')) {
                $category_id = $request->get('category_id');
            }
            switch ($filter) {
                case 'story':
                    $project = Project::whereName('Story')->first();
                    $files = File::whereProjectId($project->id)->get();
                    break;
                default:
                    $files = File::whereRaw('1');
                    if ($user_id > 0) {
                        $files->whereUserId($user_id);
                    }
                    if ($project_id > 0) {
                        $files->whereProjectId($project_id);
                    }
                    if ($category_id > 0) {
                        $files->whereCategoryId($category_id);
                    }
                    $files = $files->get();
                    break;
            }
            if ($files) {
                $files->each(function ($file) {
                    $exp = explode('.', $file->filename);
                    array_pop($exp);
                    $file->thumb = implode('.', $exp) . '-thumb.jpg';
                    $file->data = json_decode($file->data);
                });
                $response = $files;
            } else {
                $response = 'No result found.';
            }

            return $this->xhr($response);
        } catch (\Exception $e) {
            return $this->xhr($e->getMessage(), 500);
        }


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
     * @param  StoreFileRequest $request
     * @return Response
     */
    public function store(StoreFileRequest $request)
    {
        //
        try {
            $thumb = false;
            $type = $request->get('type');
            $f = $request->file('file');
            $id = $request->get('id');
            $directory = DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'projects';
            switch ($type) {
                case 'story':
                    $project = Project::whereName('Story')->first();
                    break;
                case 'book':
                    $project = Project::whereName('Ideabook')->first();
                    break;
                case 'project':
                    $project = Project::find($id);
                    break;
                case 'avatar':
                case 'cover':
                    $directory = 'uploads/users';
                    $user = User::find($id);
                    break;
            }
            $save_to_db = false;
            if (in_array($type, ['avatar', 'cover'])) {
                $filename = $type . '-' . $user->id . '.' . $f->getClientOriginalExtension();
            } else {
                $save_to_db = true;
                $thumb = true;
                $directory = $directory . DIRECTORY_SEPARATOR . $project->id;
                $basename = md5(mt_rand());
                $filename = $basename . '.' . $f->getClientOriginalExtension();
            }
            //save image
            $image = Image::make($f->getRealPath())->encode('jpg');
            if (Storage::put($directory . DIRECTORY_SEPARATOR . $filename, $image->__toString())) {

                if ($save_to_db) {
                    $image_height = $image->height();
                    $image_width = $image->width();

                    $file = new File();
                    $file->user_id = $this->logged_user->id;
                    $file->project_id = $project->id;
                    if ($type == 'project') {
                        $file->category_id = $request->get('category_id');
                        $file->website = $request->get('website');
                        $file->keywords = $request->get('keywords');
                        $file->description = $request->get('description');
                    } else {
                        $category = Category::whereName('Other')->first();
                        $file->category_id = $category->id;
                    }
                    $file->title = $project->name;

                    $file->filename = $directory . DIRECTORY_SEPARATOR . $filename;
                    $file->data = json_encode(
                        [
                            'width'  => $image_width,
                            'height' => $image_height
                        ]
                    );

                    $file->save();
                } else {
                    $file = new \stdClass();
                    $file->filename = $filename;
                }

            }

            //create thumbnail
            if ($thumb) {
                $thumb = Image::make($f->getRealPath());
                $attr = ($image_width > $image_height) ? $image_height : $image_width;
                $thumb->crop($attr, $attr);
                if ($image_width > $image_height) {
                    $thumb->resize(null, 300, function ($constraint) {
                        $constraint->aspectRatio();
                    });
                } else {
                    $thumb->resize(300, null, function ($constraint) {
                        $constraint->aspectRatio();
                    });
                }
                $thumb->encode('jpg');
                if (Storage::put($directory . DIRECTORY_SEPARATOR . $basename . '-thumb.jpg', $thumb->__toString())) {
                    $file->thumb = $directory . DIRECTORY_SEPARATOR . $basename . '-thumb.jpg';
                }
            }

            return $this->xhr($file);

        } catch (\Exception $e) {
            return $this->xhr($e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        //
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
     * @param  EditFileRequest $request
     * @param  int $id
     * @return Response
     */
    public function update(EditFileRequest $request, $id)
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
