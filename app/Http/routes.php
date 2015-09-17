<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/***** backend routes *****/
Route::group(['prefix' => 'api/1.0'], function () {
    Route::group(['prefix' => 'auth', 'namespace' => 'Auth'], function () {
        Route::get('refresh', [
            'middleware' => [
                'before' => 'jwt.auth',
                'after'  => 'jwt.refresh'
            ],
            function () {
                return response()->json(['code' => 200, 'text' => 'Token refreshed']);
            }
        ]);
        Route::post('signin', 'AuthController@signin');
        Route::post('fbsignin', 'AuthController@fbSignin');
        Route::post('signup', 'AuthController@signup');

        Route::get('signout', ['middleware' => 'jwt.auth', 'uses' => 'AuthController@signout']);
    });

    Route::get('stories', 'StoryController@index');
    Route::group(['prefix' => 'story'], function () {
        Route::get('{id}', 'StoryController@show');
        Route::post('create', [
            'middleware' => 'auth.token',
            'uses'       => 'StoryController@store'
        ]);
        Route::post('update', [
            'middleware' => 'auth.token',
            'uses'       => 'StoryController@store'
        ]);
        Route::post('delete', [
            'middleware' => 'auth.token',
            'uses'       => 'StoryController@destroy'
        ]);
    });

    Route::get('categories', 'CategoryController@index');
    Route::group(['prefix' => 'category'], function () {
        Route::get('{id}', 'CategoryController@show');
        Route::post('create', [
            'middleware' => 'auth.token',
            'uses'       => 'CategoryController@store'
        ]);
        Route::post('update', [
            'middleware' => 'auth.token',
            'uses'       => 'CategoryController@store'
        ]);
        Route::post('delete', [
            'middleware' => 'auth.token',
            'uses'       => 'CategoryController@destroy'
        ]);
    });

    Route::get('keywords', 'KeywordController@index');
    Route::group(['prefix' => 'keyword'], function () {
        Route::get('{id}', 'KeywordController@show');
        Route::post('create', [
            'middleware' => 'auth.token',
            'uses'       => 'KeywordController@store'
        ]);
        Route::post('update', [
            'middleware' => 'auth.token',
            'uses'       => 'KeywordController@store'
        ]);
        Route::post('delete', [
            'middleware' => 'auth.token',
            'uses'       => 'KeywordController@destroy'
        ]);
    });
});

/***** frontend routes *****/
Route::get('/admin/{subs?}', function () {
    return View::make('admin');
})->where(['subs' => '.*']);

Route::get('/@{user}/{subs?}', function () {
    return View::make('user');
})->where(['subs' => '.*']);

Route::get('/{subs?}', function () {
//    return View::make('default');
})->where(['subs' => '.*']);

