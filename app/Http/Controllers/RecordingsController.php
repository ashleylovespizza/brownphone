<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\User;
use Auth;
use App\Recording;
use Storage;

class RecordingsController extends Controller
{
    
    public function isApi()
    {
    	return true;
    }

    public function post(Request $request)
    {
    	$rules = ['audio_file' => 'required'];
    	$this->validate($request, $rules);

        $file = $request->file('audio_file');
        $filename = uniqid().'.wav';
    	Storage::put($filename, file_get_contents($file->getRealPath()), 'public');
		$file_url = Storage::url($filename);

    	$recording = Recording::create([
    		'user_id' => Auth::user()->id,
    		'audio_file' => $file_url
    	]);

    	return $this->resourceCreated(['recording'=>$recording]);


    }
}
