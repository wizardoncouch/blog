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
/***** frontend routes *****/
Route::get('/admin/{subs?}', function () {
    return View::make('admin');
})->where(['subs' => '.*']);

Route::get('/@{user}/{subs?}', function () {
    return View::make('user');
})->where(['subs' => '.*']);

Route::get('/{subs?}', function () {
    return View::make('default');
})->where(['subs' => '.*']);

/***** backend routes *****/
Route::group(['prefix' => 'api/1.0'], function () {
    Route::group(['prefix' => 'auth', 'namespace' => 'Auth'], function () {
        Route::post('signin', 'AuthController@signin');
        Route::post('fbsignin', 'AuthController@fbSignin');
        Route::post('signup', 'AuthController@signup');
        Route::get('signout', ['middleware' => 'auth.token', 'uses' => 'AuthController@signout']);
    });
});
