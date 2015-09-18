<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'projects';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'permission'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     *
     * @author Alex Culango
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     *
     * @author Alex Culango
     */
    public function files()
    {
        return $this->hasMany('App\File');
    }
}
