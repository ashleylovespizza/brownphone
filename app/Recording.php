<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

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
}
