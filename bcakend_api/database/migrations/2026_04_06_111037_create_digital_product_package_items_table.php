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
        Schema::create('digital_product_package_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained('digital_product_packages')->cascadeOnDelete();

            $table->enum('item_type', ['included','tool','delivery_format']);
            $table->json('item_value_json')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('digital_product_package_items');
    }
};
