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
                'id'         => 1,
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
                'id'         => 2,
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
                'id'         => 3,
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
