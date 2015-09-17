<?php

namespace App\Http\Controllers;

use App\Story;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $limit = $request->get('limit') ?: $this->app_list_limit;
        $filter = null;
        if ($request->has('filter')) {
            $filter = $request->get('filter');
        }
        switch ($filter) {
            case 'featured':
                $stories = Story::with('user')->whereFeatured(1);
                break;
            case 'popular':
                $stories = Story::with('user')->orderBy(\DB::raw('rand()'));
                break;
            case 'recent':
                $stories = Story::with('user')->orderBy('created_at', 'desc');
                break;
            default:
                $stories = Story::with('user');
        }

        if (!$stories) {
            $stories = Story::with('user');
        }
        $stories = $stories->paginate($limit);

        $stories->each(function ($story) {
            if (empty($story->excerpt)) {
                //extract the body..
                $text = trim(strip_tags($story->content));
                if (mb_strlen($text) != strlen($text)) {
                    if (mb_strlen($text) > 100) {
                        $text = mb_substr($text, 0, 100) . ' ...';
                    }
                } else {
                    if (strlen($text) > 200) {
                        $text = substr($text, 0, 200) . ' ...';
                    }
                }
                $story->excerpt = $text;
            }

            //extract images
            $dom = new \domDocument;
            $dom->loadHTML($story->content);
            $dom->preserveWhiteSpace = false;
            $image_tags = $dom->getElementsByTagName('img');
            $images = [];
            foreach ($image_tags as $img) {
                $images[] = $img->getAttribute('src');
            }
            if (empty($story->default_image) && count($images) > 0) {
                $story->default_image = $images[0];
            }
            if (filter_var($story->default_image, FILTER_VALIDATE_URL) === false) {
                $story->default_image = '/' . $story->default_image;
            }
            $story->images = $images;

            //readable dates
            $story->created = date('F j, Y', strtotime($story->created_at));
            $story->uri_title = urlencode($story->title);
        });

        return $this->xhr($stories, true);

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
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        try {
            $response = Story::find($id);
            $response->author = $response->user->first_name . ' ' . $response->user->last_name;
            if (!is_null($response->deleted_at)) {
                $status = 'trash';
            } elseif ($response->published) {
                $status = 'published';
            } else {
                $status = 'draft';
            }
            $response->status = $status;
            $response->created = date('F j, Y', strtotime($response->created_at));
            $code = 200;
            if (!$response) {
                $response = 'Story id ' . $id . ' does not exist.';
                $code = 404;
            }
        } catch (PDOException $e) {
            $response = $e->getMessage();
            $code = 500;
        }

        return $this->xhr($response, $code);
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
