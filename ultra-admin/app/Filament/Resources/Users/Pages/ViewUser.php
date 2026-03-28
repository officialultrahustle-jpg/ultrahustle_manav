<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;

class ViewUser extends ViewRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // EditAction::make(),
        ];
    }
    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                // USER DATA
                Section::make('User Details')
                    ->schema([
                        TextEntry::make('full_name'),
                        TextEntry::make('email'),
                        TextEntry::make('username'),
                        TextEntry::make('created_at')->dateTime()->label('User Created At'),
                        TextEntry::make('role')
                            ->label('Role')->formatStateUsing(fn ($state) => $state === 'freelancer' ? 'Creator' : ucfirst($state))->badge(),
                    ])
                    ->columns(2),
                    // Creator ONBOARDING DATA
                Section::make('Onboarding Info')
                    ->schema([
                        TextEntry::make('freelancerOnboarding.onboarding_role')
                            ->label('Role')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : '')->badge(),
                        TextEntry::make('freelancerOnboarding.work_type')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('freelancerOnboarding.team_industry')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('freelancerOnboarding.team_build_plan')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('freelancerOnboarding.goals_json')
                            ->label('Goals')
                            ->formatStateUsing(fn ($state) => is_array($state) ? implode(', ', $state) : $state),

                        TextEntry::make('freelancerOnboarding.service_categories_json')
                            ->label('Service Categories')
                            ->formatStateUsing(fn ($state) => is_array($state) ? implode(', ', $state) : $state),
                        TextEntry::make('freelancerOnboarding.primary_skill')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('freelancerOnboarding.experience_level')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('freelancerOnboarding.rate_range'),
                        TextEntry::make('freelancerOnboarding.has_portfolio'),
                        TextEntry::make('freelancerOnboarding.portfolio_links'),
                        TextEntry::make('freelancerOnboarding.current_step'),
                        TextEntry::make('freelancerOnboarding.completed_at'),
                    ])
                    ->visible(fn ($record) => $record->role === 'freelancer')
                    ->columns(2),

                // 🏢 CLIENT ONBOARDING
                Section::make('Client Onboarding')
                    ->schema([
                        TextEntry::make('clientOnboarding.company_name')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('clientOnboarding.industry')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                    ])
                    ->visible(fn ($record) => $record->role === 'client')
                    ->columns(2),
                    
                // 📄 PERSONAL INFO
                Section::make('Personal Info')
                    ->schema([
                        TextEntry::make('personalInfo.phone_number'),
                        TextEntry::make('address')
                            ->label('Address')
                            ->state(function ($record) {
                                return collect([
                                    $record->personalInfo->street ?? null,
                                    $record->personalInfo->city ?? null,
                                    $record->personalInfo->state ?? null,
                                    $record->personalInfo->country ?? null,
                                    $record->personalInfo->pincode ?? null,
                                ])->filter()->map(fn ($item) => ucfirst($item))->implode(', ');
                            }),
                        TextEntry::make('personalInfo.date_of_birth'),
                        TextEntry::make('personalInfo.gender')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('personalInfo.title'),
                        TextEntry::make('personalInfo.short_bio'),
                        TextEntry::make('personalInfo.about'),
                        TextEntry::make('personalInfo.availability')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('personalInfo.hashtags')
                            ->label('Hashtags')
                            ->state(function ($record) {
                                $hashtags = $record->personalInfo?->hashtags;

                                if (blank($hashtags)) {
                                    return [];
                                }

                                // If stored as JSON array
                                if (is_array($hashtags)) {
                                    return collect($hashtags)
                                        ->filter()
                                        ->map(fn ($tag) => '#' . trim($tag))
                                        ->toArray();
                                }

                                // If stored as comma-separated string
                                if (is_string($hashtags)) {
                                    return collect(explode(',', $hashtags))
                                        ->map(fn ($tag) => trim($tag))
                                        ->filter()
                                        ->map(fn ($tag) => '#' . $tag)
                                        ->toArray();
                                }

                                return [];
                            })
                            ->badge(),
                        TextEntry::make('personalInfo.skills')->state(function ($record) {
                                $skills = $record->personalInfo?->skills;

                                if (blank($skills)) {
                                    return [];
                                }

                                // If stored as JSON array
                                if (is_array($skills)) {
                                    return collect($skills)
                                        ->filter()
                                        ->map(fn ($tag) => trim($tag))
                                        ->toArray();
                                }

                                // If stored as comma-separated string
                                if (is_string($skills)) {
                                    return collect(explode(',', $skills))
                                        ->map(fn ($tag) => trim($tag))
                                        ->filter()
                                        ->map(fn ($tag) => $tag)
                                        ->toArray();
                                }

                                return [];
                            })
                            ->badge()->color('success'),
                        TextEntry::make('personalInfo.tools')
                            ->state(function ($record) {
                                $tools = $record->personalInfo?->tools;

                                if (blank($tools)) {
                                    return [];
                                }

                                // If stored as JSON array
                                if (is_array($tools)) {
                                    return collect($tools)
                                        ->filter()
                                        ->map(fn ($tag) =>trim($tag))
                                        ->toArray();
                                }

                                // If stored as comma-separated string
                                if (is_string($tools)) {
                                    return collect(explode(',', $tools))
                                        ->map(fn ($tag) => trim($tag))
                                        ->filter()
                                        ->map(fn ($tag) => $tag)
                                        ->toArray();
                                }

                                return [];
                            })
                            ->badge()->color('info'),
                        TextEntry::make('personalInfo.languages')
                            ->state(function ($record) {
                                $languages = $record->personalInfo?->languages;

                                if (blank($languages)) {
                                    return [];
                                }

                                // If stored as JSON array
                                if (is_array($languages)) {
                                    return collect($languages)
                                        ->filter()
                                        ->map(fn ($tag) =>trim($tag))
                                        ->toArray();
                                }

                                // If stored as comma-separated string
                                if (is_string($languages)) {
                                    return collect(explode(',', $languages))
                                        ->map(fn ($tag) => trim($tag))
                                        ->filter()
                                        ->map(fn ($tag) => $tag)
                                        ->toArray();
                                }

                                return [];
                            })
                            ->badge()->color('gray'),
                    ])
                    ->columns(2),
                // User Notifications
                Section::make('Notifications')
                    ->schema([
                        TextEntry::make('notifications')
                            ->label('Notifications')
                            ->state(function ($record) {
                                if (!$record->userNotification) return [];
                                return collect($record->userNotification->toArray())
                                    ->filter(function ($value, $key) {
                                        return $value == 1 && !in_array($key, ['id', 'user_id', 'created_at', 'updated_at']);
                                    })
                                    ->keys()
                                    ->map(function ($key) {
                                        return ucfirst(str_replace('_', ' ', $key));
                                    })
                                    ->toArray();
                            })
                            ->badge()
                            ->color('primary')
                    ])
                    ->columns(2),
            ]);
    }
}
