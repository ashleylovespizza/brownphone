<?php

Route::get('login', 'AuthController@redirectToProvider');
Route::get('oauth2callback', 'AuthController@handleProviderCallback');
Route::get('/', function () {
    return view('recording');
})->middleware('auth');

Route::post('submit', 'RecordingsController@post')->middleware('auth');
