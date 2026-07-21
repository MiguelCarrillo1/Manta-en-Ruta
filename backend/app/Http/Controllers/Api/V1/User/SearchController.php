<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(
        private readonly SearchService $searchService
    ) {}

    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required_without_all:lat,lng|string|max:200',
            'lat' => 'required_with:lng|numeric|between:-90,90',
            'lng' => 'required_with:lat|numeric|between:-180,180',
        ]);

        if ($request->q) {
            $results = $this->searchService->searchByText(
                $request->q,
                $request->lat,
                $request->lng
            );
        } else {
            $results = $this->searchService->searchByCoordinates(
                (float) $request->lat,
                (float) $request->lng
            );
        }

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }

    public function nearby(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
        ]);

        $results = $this->searchService->searchByCoordinates(
            (float) $request->lat,
            (float) $request->lng
        );

        return response()->json(['success' => true, 'data' => $results]);
    }
}
