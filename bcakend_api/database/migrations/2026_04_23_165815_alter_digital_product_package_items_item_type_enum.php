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
        DB::statement("
            ALTER TABLE digital_product_package_items
            MODIFY COLUMN item_type ENUM('included','tool','delivery_format') NOT NULL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            ALTER TABLE digital_product_package_items
            MODIFY COLUMN item_type ENUM('included','delivery_format') NOT NULL
        ");
    }
};
