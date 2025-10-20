<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        // ensure there's an authenticated user
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $products = Product::where('user_id', $user->id)->get();

        return response()->json([
            "status" => true,
            "message" => "Products fetched successfully",
            "products" => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // ensure authenticated
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            // 'description' => 'nullable|string',
            // 'price' => 'required|numeric',
        ]);
        $data['user_id'] = $user->id;
        if($request->hasFile('banner_image')) {
            $file = $request->file('banner_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('products', $filename, 'public');
            $data['banner_image'] = '/storage/' . $filePath;

        }

        $product = Product::create($data);

        return response()->json([
            "status" => true,
            "message" => "Product created successfully",
            "product" => $product,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // ensure authenticated
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // ensure the product belongs to the authenticated user
        if ($product->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json([
            "status" => true,
            "message" => "Product fetched successfully",
            "product" => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // ensure authenticated
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // ensure the product belongs to the authenticated user
        if ($product->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            // 'description' => 'nullable|string',
            // 'price' => 'required|numeric',
        ]);
        //need to update the image if new image is uploaded and delete the old image from storage
        if($request->hasFile('banner_image')) {
            //delete old image
            if($product->banner_image) {
                $oldImagePath = str_replace('/storage/', '', $product->banner_image);
                Storage::disk('public')->delete($oldImagePath);
            }
            $file = $request->file('banner_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('products', $filename, 'public');
            $data['banner_image'] = '/storage/' . $filePath;
        }
        
        


        $product->update($data);

        return response()->json([
            "status" => true,
            "message" => "Product updated successfully",
            "product" => $product,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // ensure authenticated
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        // ensure the product belongs to the authenticated user
        if ($product->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
        $product->delete();

        return response()->json([
            "status" => true,
            "message" => "Product deleted successfully",
        ]);
    }
}
