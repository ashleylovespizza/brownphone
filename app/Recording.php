<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Recording extends Model
{
   protected $fillable = [
                'audio_file',
                'name',
                'email'
                ];
}
