<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')->delete();

        DB::table('users')->insert([
            [
                'email'      => 'footless.hero@gmail.com',
                'username'   => 'footless.hero',
                'password'   => Hash::make('password'),
                'active'     => 1,
                'first_name' => 'Footless',
                'last_name'  => 'Hero',
                'gender'     => 'm',
                'permission' => 'root'
            ],
            [
                'email'      => 'admin@nstpictures.jp',
                'username'   => 'admin',
                'password'   => Hash::make('admin123'),
                'active'     => 1,
                'first_name' => 'Admin',
                'last_name'  => 'User',
                'gender'     => 'm',
                'permission' => 'admin'
            ],
            [
                'email'      => 'john@nstpictures.jp',
                'username'   => 'john',
                'password'   => Hash::make('demo123'),
                'active'     => 1,
                'first_name' => 'John',
                'last_name'  => 'Doe',
                'gender'     => 'm',
                'permission' => 'admin'
            ]
        ]);
    }
}
