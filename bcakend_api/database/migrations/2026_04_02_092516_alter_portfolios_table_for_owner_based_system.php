<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
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

        // migrate old user_id data into owner fields
        if (Schema::hasColumn('portfolios', 'user_id')) {
            DB::statement("
                UPDATE portfolios
                SET owner_type = 'user'
                WHERE owner_type IS NULL
            ");

            DB::statement("
                UPDATE portfolios
                SET owner_id = user_id
                WHERE owner_id IS NULL
            ");
        }

        // make owner fields required
        DB::statement("
            UPDATE portfolios
            SET owner_type = 'user'
            WHERE owner_type IS NULL
        ");

        Schema::table('portfolios', function (Blueprint $table) {
            $table->string('owner_type')->nullable(false)->change();
            $table->unsignedBigInteger('owner_id')->nullable(false)->change();
        });

        // drop old user_id column if it exists
        if (Schema::hasColumn('portfolios', 'user_id')) {
            Schema::table('portfolios', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            });
        }

        // add index / uniqueness
        Schema::table('portfolios', function (Blueprint $table) {
            $table->index(['owner_type', 'owner_id'], 'portfolios_owner_idx');
            $table->unique(['owner_type', 'owner_id'], 'portfolios_owner_unique');
        });
    }

    public function down(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            if (!Schema::hasColumn('portfolios', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            }
        });

        DB::statement("
            UPDATE portfolios
            SET user_id = owner_id
            WHERE owner_type = 'user'
        ");

        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropUnique('portfolios_owner_unique');
            $table->dropIndex('portfolios_owner_idx');
            $table->dropColumn(['owner_type', 'owner_id']);
        });
    }
};