<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // register api
    public function register(Request $request) {
        // Validate and create user
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|min:6'
        ]);
        
        // Hash password before storing
        $data['password'] = Hash::make($data['password']);
        User::create($data);

        return response()->json(['message' => 'User registered successfully'], 201);
 
    }
    // login api
    public function login(Request $request) {

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if(!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }
        
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            "status" => true,
            "message" => "User logged in successfully",
            "token" => $token,
            "user" => $user
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

        $token = Auth::user()->currentAccessToken();
        if ($token) {
            // delete via tokens() relation to ensure delete() is executed on the query
            Auth::user()->tokens()->where('id', $token->id)->delete();
        }
        
        return response()->json([
            "status" => true,
            "message" => "User logged out successfully"
        ]);

    }
}
