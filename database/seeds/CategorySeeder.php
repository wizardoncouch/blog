<?php

use App\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
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
        DB::table('categories')->delete();
        DB::table('categories')->insert(
            [
                [
                    'id'          => 1,
                    'user_id'     => $footless->id,
                    'name'        => 'Wedding Ceremony Hall',
                    'description' => 'Your reception site sets the stage for the entire party.'
                        . 'Think about your wedding style, your guest list size and '
                        . 'the general mood you want to set as you tour venues.',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ],
                [
                    'id'          => 2,
                    'user_id'     => $footless->id,
                    'name'        => 'Party Decoration',
                    'description' => 'Create a fantastic party full of bright colours with'
                        . 'our fabulous range of balloons, decorations and bunting!',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ],
                [
                    'id'          => 3,
                    'user_id'     => $footless->id,
                    'name'        => 'Food & Drink',
                    'description' => 'The Perfect Cocktail Party: Delightful Food and Drink.',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ],
                [
                    'id'          => 4,
                    'user_id'     => $footless->id,
                    'name'        => 'Wedding Dress',
                    'description' => 'Browse our elegant collection of affordable wedding dresses at Davids Bridal',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ],
                [
                    'id'          => 5,
                    'user_id'     => $footless->id,
                    'name'        => 'Bridal Bouquet',
                    'description' => 'Ivory Rose and Ranunculus Bridal Bouquet ... Bold Purple and Fuchsia Bridal'
                        . ' Bouquet ... Lush Autumnal Cascade Wedding Bouquet',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ],
                [
                    'id'          => 6,
                    'user_id'     => $footless->id,
                    'name'        => 'Hair Style and Accessory',
                    'description' => 'he fast-track to pretty party hair? A sparkling accessory of course!'
                        . 'the A-list work the trend with our round-up of the coolest accessorised styles.',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ],
                [
                    'id'          => 7,
                    'user_id'     => $footless->id,
                    'name'        => 'Wedding Cake',
                    'description' => 'Browse the most creative wedding cake photos and designs for a sweet and unique dessert table',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ],
                [
                    'id'          => 8,
                    'user_id'     => $footless->id,
                    'name'        => 'Gift',
                    'description' => 'A gift or a present is an item given to someone without the expectation of payment.'
                        . 'The gifted item should not be owned by the recipient.',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ],
                [
                    'id'          => 9,
                    'user_id'     => $footless->id,
                    'name'        => 'Paper Item',
                    'description' => 'simple item object for use in menus. When the user touches the item,'
                        . 'a ripple effect emanates from the point of contact. If used in a core-selector,'
                        . 'the selected item will be highlighted.',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ]
            ]
        );
    }
}
