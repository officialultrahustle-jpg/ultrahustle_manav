<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'ip_address',
        'device',
        'platform',
        'browser',
        'location',
        'last_active_at',
        'is_current',
    ];

    protected $casts = [
        'last_active_at' => 'datetime',
        'is_current' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
