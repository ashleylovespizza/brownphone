<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Storage;
class Recording extends Model
{
   protected $fillable = [
                'audio_file',
                'user_id'
                ];

    public function user()
    {
    	return $this->belongsTo('App\User');
    }

    public function delete()
    {
    	if($this->audio_file) {
    		Storage::delete($this->audio_file);
    	}
    	parent::delete();
    }
}
