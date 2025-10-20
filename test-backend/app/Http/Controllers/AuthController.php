<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use phpDocumentor\Reflection\PseudoTypes\True_;

class AuthController extends Controller
{
    // register api
    public function register(Request $request) {
        // Validate and create user
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required'
        ]);
        User::create($data);

        return response()->json(['message' => 'User registered successfully'], 201);
 
    }
    // login api
    public function login(Request $request) {

        $request->validate([
            'email' => 'required |email',
            'password' => 'required',
        ]);

        if(!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }
        $user =Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            "status" => true,
            "message" => "User logged in successfully",
            "token" => $token
        ]);
    }

    //profile api
    public function profile() {
        return response()->json([
            "status" => true,
            "message" => "User profile fetched successfully",
            "data" => Auth::user()
        ]);

    }
    // logout api
    public function logout() {

        // Auth::user()->tokens()->delete();
        Auth::logout();
        return response()->json([
            "status" => true,
            "message" => "User logged out successfully"
        ]);


    }

}
