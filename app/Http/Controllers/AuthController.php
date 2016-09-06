<?php

namespace App\Http\Controllers;

use Socialite;
use Auth;
use App\User;
use Hash;
use Redirect;

class AuthController extends Controller
{
    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return Response
     */
    public function redirectToProvider()
    {
        return Socialite::driver('google')->redirect();
    }

    public function logout()
    {
        Auth::logout();
        return env('APP_ENV') == 'local' ? Redirect::to('/') : Redirect::secure('/');
    }
    /**
     * Obtain the user information from GitHub.
     *
     * @return Response
     */
    public function handleProviderCallback()
    {
        $user = Socialite::driver('google')->user();
        $existing_user = User::where('email', $user->email)->first();

        if(!$existing_user) {
        	$existing_user = User::create([
        		'email'=>$user->email, 
        		'name'=>$user->name,
        		'avatar'=>$user->avatar,
        		'google_id'=>$user->id,
        		'password'=>Hash::make(str_random(8)),
        	]);
        }
    	
    	Auth::login($existing_user, true);
    	return env('APP_ENV') == 'local' ? Redirect::to('/')->with(['user'=>$existing_user]) : Redirect::secure('/')->with(['user'=>$existing_user]);
        // $user->token;
    }
}
