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
        Schema::create('user_notification', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->unique() // one row per user
                ->constrained()
                ->cascadeOnDelete();

            // EMAIL
            $table->boolean('messages')->default(false);
            $table->boolean('order')->default(false);
            $table->boolean('reviews')->default(false);
            $table->boolean('payment')->default(false);
            $table->boolean('boost')->default(false);
            $table->boolean('listing')->default(false);
            $table->boolean('system')->default(false);

            // PUSH
            $table->boolean('project')->default(false);
            $table->boolean('comments')->default(false);
            $table->boolean('forum')->default(false);
            $table->boolean('team')->default(false);

            // MARKETING
            $table->boolean('marketing')->default(false);
            $table->boolean('product')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_notification');
    }
};
