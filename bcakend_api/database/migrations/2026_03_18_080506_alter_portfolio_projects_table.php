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
        Schema::table('portfolio_projects', function (Blueprint $table): void {
			// $table->id()->primary()->autoIncrement()->change();
			$table->foreignId('portfolio_id')->constrained('portfolios')->cascadeOnDelete()->change();
            $table->index('portfolio_id')->change();
		});
        Schema::table('portfolio_media', function (Blueprint $table): void {
			$table->id()->primary()->autoIncrement()->change();
			$table->foreignId('project_id')->constrained('portfolio_projects')->cascadeOnDelete()->change();
            $table->index('project_id')->change();
		});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_projects', function (Blueprint $table): void {
			// $table->id()->primary()->autoIncrement()->change();
			$table->foreignId('portfolio_id')->constrained('portfolios')->cascadeOnDelete()->change();
            $table->index('portfolio_id')->change();
		});
        Schema::table('portfolio_media', function (Blueprint $table): void {
			$table->id()->primary()->autoIncrement()->change();
			$table->foreignId('project_id')->constrained('portfolio_projects')->cascadeOnDelete();
            $table->index('project_id')->change();
		});
    }
};
