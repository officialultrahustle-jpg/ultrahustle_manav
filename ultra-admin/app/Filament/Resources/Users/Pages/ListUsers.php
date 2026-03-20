<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\ExportAction;
use App\Filament\Exports\UserExporter;
use Filament\Actions\Exports\Enums\ExportFormat;

class ListUsers extends ListRecords
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // CreateAction::make(),
            ExportAction::make()->exporter(UserExporter::class)->formats([
                ExportFormat::Xlsx,
                ExportFormat::Csv,
            ]),
        ];
    }
}
