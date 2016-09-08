<?php

namespace App\Http\Controllers;

use Socialite;
use Auth;
use App\User;
use Hash;
use Redirect;
use Config;

class AuthController extends Controller
{

    protected $driver;
    public function __construct()
    {
        $this->driver = $this->createGoogleDriver();
    }

    protected function createGoogleDriver()
    {

        $config = Config::get('services.google');
        $config['redirect'] = $this->getRedirectURI();

        return Socialite::buildProvider('Laravel\Socialite\Two\GoogleProvider', $config);
    }

    public function getRedirectURI()
    {
        $base_redirect_uri = env('APP_ENV')=='local'?url()->to('/'):url()->secure('/');
        $redirect_uri = $base_redirect_uri.'/'.env('GOOGLE_REDIRECT');
        return $redirect_uri;
    }
    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return Response
     */
    public function redirectToProvider()
    {
        return $this->driver->redirect();
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
        $user = $this->driver->user();
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
    	
        // update the avatar image
        $existing_user->avatar = $user->avatar;
        $existing_user->save();
        
    	Auth::login($existing_user, true);
    	return env('APP_ENV') == 'local' ? Redirect::to('/')->with(['user'=>$existing_user]) : Redirect::secure('/')->with(['user'=>$existing_user]);
        // $user->token;
    }
}
