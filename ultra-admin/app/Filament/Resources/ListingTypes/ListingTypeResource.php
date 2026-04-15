<?php

namespace App\Filament\Resources\ListingTypes;

use App\Filament\Resources\ListingTypes\Pages\CreateListingType;
use App\Filament\Resources\ListingTypes\Pages\EditListingType;
use App\Filament\Resources\ListingTypes\Pages\ListListingTypes;
use App\Filament\Resources\ListingTypes\Pages\ViewListingType;
use App\Filament\Resources\ListingTypes\Schemas\ListingTypeForm;
use App\Filament\Resources\ListingTypes\Schemas\ListingTypeInfolist;
use App\Filament\Resources\ListingTypes\Tables\ListingTypesTable;
use App\Models\ListingType;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ListingTypeResource extends Resource
{
    protected static ?string $model = ListingType::class;
    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static string | UnitEnum | null $navigationGroup = 'Taxonomy';
    protected static ?string $navigationLabel = 'Listing Types';

    protected static ?string $recordTitleAttribute = 'Listing Type';

    public static function form(Schema $schema): Schema
    {
        return ListingTypeForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ListingTypeInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ListingTypesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListListingTypes::route('/'),
            'create' => CreateListingType::route('/create'),
            'view' => ViewListingType::route('/{record}'),
            'edit' => EditListingType::route('/{record}/edit'),
        ];
    }
}
