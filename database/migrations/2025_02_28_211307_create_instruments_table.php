<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('instruments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('retirement_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('yearly_return', 8, 2);
            $table->decimal('weight', 5, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('instruments');
    }
};
