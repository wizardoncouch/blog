<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;

class KeywordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('keywords')->delete();
        DB::table('keywords')->insert(
            [
                [
                    'id'         => 1,
                    'keyword'    => 'Wedding',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()

                ],
                [
                    'id'         => 2,
                    'keyword'    => 'Party',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()

                ],
                [
                    'id'         => 3,
                    'keyword'    => 'Bridal',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()

                ],
                [
                    'id'         => 4,
                    'keyword'    => 'Dress',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()

                ],
                [
                    'id'         => 5,
                    'keyword'    => 'Bouquet',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()

                ],
                [
                    'id'         => 6,
                    'keyword'    => 'Accessories',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()

                ],
                [
                    'id'         => 7,
                    'keyword'    => 'Cake',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()

                ],
                [
                    'id'         => 8,
                    'keyword'    => 'Gift',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()

                ],
                [
                    'id'         => 9,
                    'keyword'    => 'Prenuptials',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()

                ]
            ]
        );
    }
}
