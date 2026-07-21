<?php

namespace App\Http\Controllers\Api\V1\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Catalog;
use App\Models\CatalogItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CatalogController extends Controller
{
    public function index(): JsonResponse
    {
        $catalogs = Catalog::withCount('items')->get();
        return response()->json(['success' => true, 'data' => $catalogs]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
            'code' => 'required|string|max:50|unique:catalogs,code',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $catalog = Catalog::create($validator->validated());

        return response()->json(['success' => true, 'data' => $catalog, 'message' => 'Catálogo creado'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $catalog = Catalog::with('items')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $catalog]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $catalog = Catalog::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:200',
            'code' => 'sometimes|string|max:50|unique:catalogs,code,' . $id,
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $catalog->update($validator->validated());

        return response()->json(['success' => true, 'data' => $catalog, 'message' => 'Catálogo actualizado']);
    }

    public function destroy(int $id): JsonResponse
    {
        $catalog = Catalog::findOrFail($id);
        $catalog->delete();
        return response()->json(['success' => true, 'message' => 'Catálogo eliminado']);
    }

    public function items(int $id): JsonResponse
    {
        $catalog = Catalog::findOrFail($id);
        return response()->json(['success' => true, 'data' => $catalog->items]);
    }

    public function storeItem(Request $request, int $id): JsonResponse
    {
        $catalog = Catalog::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
            'code' => 'nullable|string|max:50|unique:catalog_items,code,NULL,id,catalog_id,' . $id,
            'value' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $item = CatalogItem::create([
            'catalog_id' => $id,
            ...$validator->validated(),
        ]);

        return response()->json(['success' => true, 'data' => $item, 'message' => 'Item creado'], 201);
    }

    public function updateItem(Request $request, int $id, int $itemId): JsonResponse
    {
        $item = CatalogItem::where('catalog_id', $id)->findOrFail($itemId);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:200',
            'code' => 'nullable|string|max:50|unique:catalog_items,code,' . $itemId . ',id,catalog_id,' . $id,
            'value' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $item->update($validator->validated());

        return response()->json(['success' => true, 'data' => $item, 'message' => 'Item actualizado']);
    }

    public function destroyItem(int $id, int $itemId): JsonResponse
    {
        $item = CatalogItem::where('catalog_id', $id)->findOrFail($itemId);
        $item->delete();
        return response()->json(['success' => true, 'message' => 'Item eliminado']);
    }
}
