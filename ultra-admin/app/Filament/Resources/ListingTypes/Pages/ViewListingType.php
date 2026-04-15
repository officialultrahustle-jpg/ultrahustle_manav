<?php

namespace App\Filament\Resources\ListingTypes\Pages;

use App\Filament\Resources\ListingTypes\ListingTypeResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewListingType extends ViewRecord
{
    protected static string $resource = ListingTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
