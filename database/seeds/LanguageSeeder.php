<?php

use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('languages')->delete();
        DB::table('languages')->insert([
            [
                'alias' => 'en',
                'language'  => 'English'
            ],
            [
                'alias' => 'ja',
                'language'  => 'Japanese'
            ],
            [
                'alias' => 'de',
                'language'  => 'German'
            ],
            [
                'alias' => 'fr',
                'language'  => 'French'
            ],
            [
                'alias' => 'ph',
                'language'  => 'Filipino'
            ]
        ]);
    }
}
