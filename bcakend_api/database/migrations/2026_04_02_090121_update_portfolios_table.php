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
        Schema::table('portfolios', function (Blueprint $table) {
            if (!Schema::hasColumn('portfolios', 'owner_type')) {
                $table->string('owner_type')->nullable()->after('id');
            }

            if (!Schema::hasColumn('portfolios', 'owner_id')) {
                $table->unsignedBigInteger('owner_id')->nullable()->after('owner_type');
            }
        });

        // migrate old user_id data into owner_type/owner_id
        if (Schema::hasColumn('portfolios', 'user_id')) {
            DB::table('portfolios')
                ->whereNull('owner_type')
                ->update([
                    'owner_type' => 'user',
                ]);

            DB::statement("UPDATE portfolios SET owner_id = user_id WHERE owner_id IS NULL");
        }

        Schema::table('portfolios', function (Blueprint $table) {
            $table->index(['owner_type', 'owner_id'], 'portfolios_owner_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropIndex('portfolios_owner_index');
            $table->dropColumn(['owner_type', 'owner_id']);
        });
    }
};
