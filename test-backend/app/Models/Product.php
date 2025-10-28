<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'banner_image',
        'cost',       
    ];

    protected $casts = [
        'cost'=>'decimal:2'
    ];
}
