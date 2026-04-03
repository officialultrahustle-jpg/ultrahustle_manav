<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // If portfolios table doesn't exist, stop
        if (!Schema::hasTable('portfolios')) {
            return;
        }

        // 1) Add new owner columns if not present
        Schema::table('portfolios', function (Blueprint $table) {
            if (!Schema::hasColumn('portfolios', 'owner_type')) {
                $table->string('owner_type')->nullable()->after('id');
            }

            if (!Schema::hasColumn('portfolios', 'owner_id')) {
                $table->unsignedBigInteger('owner_id')->nullable()->after('owner_type');
            }
        });

        // 2) Copy old user_id data into owner_type / owner_id if user_id exists
        if (Schema::hasColumn('portfolios', 'user_id')) {
            DB::table('portfolios')
                ->whereNull('owner_type')
                ->whereNull('owner_id')
                ->update([
                    'owner_type' => 'user',
                    'owner_id'   => DB::raw('user_id'),
                ]);
        }

        // 3) Drop old constraints/indexes safely
        $this->dropForeignIfExists('portfolios', 'portfolios_user_id_foreign');
        $this->dropIndexIfExists('portfolios', 'portfolios_user_id_unique');
        $this->dropIndexIfExists('portfolios', 'portfolios_user_id_index');

        // 4) Drop old user_id column if exists
        if (Schema::hasColumn('portfolios', 'user_id')) {
            Schema::table('portfolios', function (Blueprint $table) {
                $table->dropColumn('user_id');
            });
        }

        // 5) Make owner columns required + indexed
        // MySQL requires separate table calls sometimes for change()
        Schema::table('portfolios', function (Blueprint $table) {
            // Add composite unique if not already there
            // We do this raw-safe below instead of relying on duplicate checks here
        });

        // Fill any still-null rows just in case
        DB::table('portfolios')
            ->whereNull('owner_type')
            ->update(['owner_type' => 'user']);

        DB::table('portfolios')
            ->whereNull('owner_id')
            ->update(['owner_id' => 0]);

        // If doctrine/dbal is not installed, avoid ->change()
        // So we leave nullable state if needed; app logic still works fine.
        // If you want strict NOT NULL later, we can do a second clean migration.

        // 6) Add composite unique/index safely
        $this->createUniqueIfNotExists(
            'portfolios',
            'portfolios_owner_type_owner_id_unique',
            ['owner_type', 'owner_id']
        );
    }

    public function down(): void
    {
        if (!Schema::hasTable('portfolios')) {
            return;
        }

        // 1) Add user_id back if needed
        Schema::table('portfolios', function (Blueprint $table) {
            if (!Schema::hasColumn('portfolios', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }
        });

        // 2) Restore user_id only for user portfolios
        if (
            Schema::hasColumn('portfolios', 'owner_type') &&
            Schema::hasColumn('portfolios', 'owner_id') &&
            Schema::hasColumn('portfolios', 'user_id')
        ) {
            DB::table('portfolios')
                ->where('owner_type', 'user')
                ->update([
                    'user_id' => DB::raw('owner_id'),
                ]);
        }

        // 3) Drop new unique safely
        $this->dropIndexIfExists('portfolios', 'portfolios_owner_type_owner_id_unique');

        // 4) Drop owner columns if exist
        Schema::table('portfolios', function (Blueprint $table) {
            if (Schema::hasColumn('portfolios', 'owner_type')) {
                $table->dropColumn('owner_type');
            }

            if (Schema::hasColumn('portfolios', 'owner_id')) {
                $table->dropColumn('owner_id');
            }
        });

        // 5) Re-add user_id FK only if users table exists
        if (Schema::hasTable('users') && Schema::hasColumn('portfolios', 'user_id')) {
            try {
                Schema::table('portfolios', function (Blueprint $table) {
                    $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
                    $table->unique('user_id');
                });
            } catch (\Throwable $e) {
                // ignore if already exists or fails in rollback
            }
        }
    }

    /* =========================================================
     |  HELPERS
     * ========================================================= */

    private function dropForeignIfExists(string $table, string $foreignName): void
    {
        try {
            DB::statement("ALTER TABLE `{$table}` DROP FOREIGN KEY `{$foreignName}`");
        } catch (\Throwable $e) {
            // ignore if not exists
        }
    }

    private function dropIndexIfExists(string $table, string $indexName): void
    {
        try {
            DB::statement("ALTER TABLE `{$table}` DROP INDEX `{$indexName}`");
        } catch (\Throwable $e) {
            // ignore if not exists
        }
    }

    private function createUniqueIfNotExists(string $table, string $indexName, array $columns): void
    {
        try {
            $cols = collect($columns)->map(fn ($col) => "`{$col}`")->implode(', ');
            DB::statement("ALTER TABLE `{$table}` ADD UNIQUE `{$indexName}` ({$cols})");
        } catch (\Throwable $e) {
            // ignore if already exists
        }
    }
};