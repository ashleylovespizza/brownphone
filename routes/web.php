<?php

Route::get('login', 'AuthController@redirectToProvider');
Route::get('oauth2callback', 'AuthController@handleProviderCallback');
Route::get('logout', 'AuthController@logout');
Route::get('feed', 'RecordingsController@feed');

Route::get('/', 'RecordingsController@index')->middleware('auth');
Route::delete('recordings/{id}', 'RecordingsController@destroy')->middleware('auth');
Route::post('submit', 'RecordingsController@post')->middleware('auth');

