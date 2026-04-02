<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {   
        Schema::table('portfolio_projects', function (Blueprint $table) {
            if (!Schema::hasColumn('portfolio_projects', 'cover_media_id')) {
                $table->unsignedBigInteger('cover_media_id')->nullable()->after('sort_order');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
