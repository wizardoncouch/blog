<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    //
    protected $table = 'files';

    protected $fillable = [
        'user_id',
        'project_id',
        'category_id',
        'title',
        'filename',
        'website',
        'keywords',
        'description',
        'permission',
        'featured'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     *
     * @author Alex Culango
     */
    public function user()
    {
        return $this->belongsTo('App\User', 'user_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     *
     * @author Alex Culango
     */
    public function project()
    {
        return $this->belongsTo('App\Project', 'project_id');
    }
}
