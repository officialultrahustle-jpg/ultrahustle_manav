<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProject extends Model
{
	protected $table = 'portfolio_projects';
	protected $fillable = [
		'portfolio_id',
        'title',
        'description',
        'cost_cents',
        'currency',
        'sort_order',
        'cover_media_id',
	];

	public function portfolio()
	{
		return $this->belongsTo(Portfolio::class);
	}

	public function media()
	{
		return $this->hasMany(PortfolioMedia::class, 'project_id')->orderBy('sort_order');
	}

	public function coverMedia()
	{
		return $this->belongsTo(PortfolioMedia::class, 'cover_media_id');
	}
}
