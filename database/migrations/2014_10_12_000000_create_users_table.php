<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password', 60);
            $table->string('first_name');
            $table->string('last_name');
            $table->boolean('active')->default(0);
            $table->enum('permission',['personal', 'professional', 'admin', 'root'])->default('personal');
            $table->char('language', 2)->default('en');
            $table->string('activation_code')->nullable();
            $table->string('avatar')->default('/images/default-profile.png');
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('language')
                ->references('alias')->on('languages')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
    }
}
