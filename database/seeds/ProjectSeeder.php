<?php

use App\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
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
        DB::table('projects')->delete();
        DB::table('projects')->insert(
            [
                [
                    'id'          => 1,
                    'user_id'     => $footless->id,
                    'name'        => 'Ideabook',
                    'description' => 'Project name for all ideabooks files.',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ],
                [
                    'id'          => 2,
                    'user_id'     => $footless->id,
                    'name'        => 'Story',
                    'description' => 'Project name for all stories files.',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now()

                ]
            ]
        );
    }
}
