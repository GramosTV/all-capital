<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up()
    {
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 8)->default(Str::random(8));
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('households');
    }
};
