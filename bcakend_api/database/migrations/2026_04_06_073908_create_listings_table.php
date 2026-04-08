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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->enum('listing_type', ['course','digital_product','webinar','service']);

            $table->string('title');
            $table->string('category')->nullable();
            $table->string('sub_category')->nullable();

            $table->text('short_description')->nullable();
            $table->longText('about')->nullable();

            $table->boolean('ai_powered')->default(false);

            $table->enum('seller_mode', ['Solo','Team'])->default('Solo');
            $table->string('team_name')->nullable();

            $table->string('cover_media_path')->nullable();

            $table->enum('status', ['draft','published'])->default('draft');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
