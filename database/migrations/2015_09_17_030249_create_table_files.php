<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');
            $table->integer('user_id')->unsigned()->index();
            $table->integer('project_id')->unsigned()->index();
            $table->integer('category_id')->unsigned()->index();
            $table->string('title');
            $table->string('filename');
            $table->json('data')->nullable();
            $table->string('website')->nullable();
            $table->text('keywords')->nullable();
            $table->text('description')->nullable();
            $table->enum('permission', ['all', 'followers', 'me'])->default('all');
            $table->boolean('featured');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('files');
    }
}
