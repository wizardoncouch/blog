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
Route::get('/', function () {
    $string = 'eyJzdWIiOjIsImlzcyI6Imh0dHA6XC9cL2Jsb2cuZGV2XC9hcGlcLzEuMFwvYXV0aFwvc2lnbmluIiwiaWF0IjoiMTQ0MTk1NjM4NyIsImV4cCI6IjE0NDE5NTk5ODciLCJuYmYiOiIxNDQxOTU2Mzg3IiwianRpIjoiNmM5OTRkNWZhZjcwMWZkMjEyODFlOTFmNTM1Mjc3OWEifQ';
    dd(base64_decode($string));
    return view('welcome');
});

/***** admin routes *****/
Route::get('/admin', function () {
    return View::make('admin');
});

/***** backend routes *****/
Route::group(['prefix' => 'api/1.0'], function () {
    Route::group(['prefix' => 'auth', 'namespace' => 'Auth'], function () {
        Route::post('signin', 'AuthController@signin');
        Route::post('fbsignin', 'AuthController@fbSignin');
        Route::post('signup', 'AuthController@signup');
        Route::get('signout', ['middleware' => 'auth.token', 'uses' => 'AuthController@signout']);
    });
});
