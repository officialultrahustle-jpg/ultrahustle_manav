<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
	protected $fillable = [
		'owner_type',
        'owner_id',
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function projects()
	{
		return $this->hasMany(PortfolioProject::class);
	}

	public function owner()
    {
        if ($this->owner_type === 'user') {
            return $this->belongsTo(User::class, 'owner_id');
        }

        if ($this->owner_type === 'team') {
            return $this->belongsTo(Team::class, 'owner_id');
        }

        return null;
    }
}
