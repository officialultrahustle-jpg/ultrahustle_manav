<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingProductType extends Model
{
    protected $fillable = [
        'listing_type_id',
        'listing_category_id',
        'listing_sub_category_id',
        'name',
        'slug',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function listingType(): BelongsTo
    {
        return $this->belongsTo(ListingType::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ListingCategory::class, 'listing_category_id');
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(ListingSubCategory::class, 'listing_sub_category_id');
    }
}
