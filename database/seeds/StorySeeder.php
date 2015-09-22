<?php

use App\Category;
use App\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class StorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $footless = User::whereUsername('footless.hero')->first();
        $category = Category::find(rand(2, 10));
        DB::table('stories')->delete();
        DB::table('stories')->insert([
            [
                'id'            => 1,
                'user_id'       => $footless->id,
                'category_id'   => $category->id,
                'title'         => 'Wedding of the Month',
                'content'       => '<div class="article-image pad-20-y">
                                      <a href="#0" title="Wedding of the Month">
                                        <img width="870" height="300" src="//bridalgallery.jp/wp-content/uploads/2015/03/featured_image5.jpg" class="attachment-featured img-rounded" alt="Wedding of the Month">
                                      </a>
                                  </div><p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
<p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>',
                'excerpt'       => '',
                'keywords'      => json_encode(['Wedding', 'Party', 'Bridal']),
                'default_image' => '//bridalgallery.jp/wp-content/uploads/2015/03/featured_image5.jpg',
                'featured'      => 1,
                'published'     => 1,
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now()
            ]
        ]);
    }
}
