<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ListingController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'listing_type' => 'required|in:course,digital_product,webinar,service',
            'status' => 'nullable|in:draft,published',

            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:150',
            'sub_category' => 'nullable|string|max:150',
            'short_description' => 'nullable|string',
            'about' => 'nullable|string',

            'ai_powered' => 'nullable|boolean',
            'seller_mode' => 'nullable|in:Solo,Team',
            'team_name' => 'nullable|string|max:255',

            'cover_file' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,avi,mkv|max:20480',

            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string|max:100',

            'details.tools' => 'nullable|array',
            'details.tools.*' => 'nullable|string|max:255',

            'faqs' => 'nullable|array',
            'faqs.*.q' => 'nullable|string',
            'faqs.*.a' => 'nullable|string',

            'links' => 'nullable|array',
            'links.*' => 'nullable|string',

            'deliverables' => 'nullable|array',
            'deliverables.*.file' => 'nullable|file|max:20480',
            'deliverables.*.notes' => 'nullable|string',

            'details' => 'nullable|array',
            'details.product_type' => 'nullable|string|max:150',

            'details.packages' => 'nullable|array',
            'details.packages.*.package_name' => 'required_with:details.packages|string|in:Basic,Standard,Premium',
            'details.packages.*.price' => 'nullable',
            'details.packages.*.included' => 'nullable|array',
            'details.packages.*.included.*' => 'nullable|string|max:255',
            'details.packages.*.deliveryFormats' => 'nullable|array',
            'details.packages.*.deliveryFormats.*' => 'nullable|string|max:255',
        ]);

        $listing = DB::transaction(function () use ($request, $user, $validated) {
            $coverPath = null;

            if ($request->hasFile('cover_file')) {
                $coverPath = $request->file('cover_file')->store('listings/covers', 'public');
            }

            $cleanTags = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                $validated['tags'] ?? []
            )));

            $cleanTools = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                data_get($validated, 'details.tools', [])
            )));

            $listingId = DB::table('listings')->insertGetId([
                'user_id' => $user->id,
                'listing_type' => $validated['listing_type'],
                'title' => $validated['title'],
                'category' => $validated['category'] ?? null,
                'sub_category' => $validated['sub_category'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'about' => $validated['about'] ?? null,
                'seller_mode' => $validated['seller_mode'] ?? 'Solo',
                'team_name' => $validated['team_name'] ?? null,
                'tags_json' => !empty($cleanTags) ? json_encode($cleanTags) : null,
                'tools_json' => !empty($cleanTools) ? json_encode($cleanTools) : null,
                'ai_powered' => (int) ($validated['ai_powered'] ?? false),
                'cover_media_path' => $coverPath,
                'status' => $validated['status'] ?? 'published',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

           /*  foreach (($validated['tags'] ?? []) as $index => $tag) {
                if (!filled($tag)) continue;

                DB::table('listing_tags')->insert([
                    'listing_id' => $listingId,
                    'tag' => $tag,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } */

            foreach (($validated['faqs'] ?? []) as $index => $faq) {
                $question = trim((string) ($faq['q'] ?? ''));
                $answer = trim((string) ($faq['a'] ?? ''));

                if ($question === '' && $answer === '') continue;

                DB::table('listing_faqs')->insert([
                    'listing_id' => $listingId,
                    'question' => $question,
                    'answer' => $answer,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach (($validated['links'] ?? []) as $index => $link) {
                $value = trim((string) $link);
                if ($value === '') continue;

                DB::table('listing_links')->insert([
                    'listing_id' => $listingId,
                    'link_url' => $value,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach (($request->input('deliverables', []) ?? []) as $index => $deliverableInput) {
                $file = $request->file("deliverables.$index.file");
                $notes = trim((string) ($deliverableInput['notes'] ?? ''));

                if (!$file && $notes === '') continue;

                $filePath = null;
                $fileName = null;
                $fileMime = null;
                $fileSize = null;

                if ($file) {
                    $filePath = $file->store('listings/deliverables', 'public');
                    $fileName = $file->getClientOriginalName();
                    $fileMime = $file->getMimeType();
                    $fileSize = $file->getSize();
                }

                DB::table('listing_deliverables')->insert([
                    'listing_id' => $listingId,
                    'file_path' => $filePath,
                    'file_name' => $fileName,
                    'file_mime' => $fileMime,
                    'file_size' => $fileSize,
                    'notes' => $notes ?: null,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            if (($validated['listing_type'] ?? '') === 'digital_product') {
                if (Schema::hasTable('digital_product_details')) {
                    DB::table('digital_product_details')->insert([
                        'listing_id' => $listingId,
                        'product_type' => data_get($validated, 'details.product_type'),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                foreach ((data_get($validated, 'details.packages') ?? []) as $package) {
                    $price = $package['price'] ?? null;

                    $included = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        $package['included'] ?? []
                    )));

                    $deliveryFormats = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        $package['deliveryFormats'] ?? []
                    )));

                    $hasData =
                        ($price !== null && $price !== '') ||
                        !empty($included) ||
                        !empty($deliveryFormats);

                    if (!$hasData) {
                        continue;
                    }

                    $packageId = DB::table('digital_product_packages')->insertGetId([
                        'listing_id' => $listingId,
                        'package_name' => $package['package_name'],
                        'price' => ($price !== '' && $price !== null) ? $price : null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    if (!empty($included)) {
                        DB::table('digital_product_package_items')->insert([
                            'package_id' => $packageId,
                            'item_type' => 'included',
                            'item_value_json' => json_encode($included),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }

                    if (!empty($deliveryFormats)) {
                        DB::table('digital_product_package_items')->insert([
                            'package_id' => $packageId,
                            'item_type' => 'delivery_format',
                            'item_value_json' => json_encode($deliveryFormats),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            return DB::table('listings')->where('id', $listingId)->first();
        });

        return response()->json([
            'success' => true,
            'message' => 'Listing saved successfully.',
            'listing_id' => $listing->id,
            'listing' => $listing,
        ]);
    }
}