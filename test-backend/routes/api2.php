<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/wassup', function () {
    return response()->json(['message' => 'Hey bro!']);
});
