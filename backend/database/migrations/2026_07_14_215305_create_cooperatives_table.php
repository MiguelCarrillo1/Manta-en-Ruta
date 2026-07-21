<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cooperatives', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('slug', 200)->unique();
            $table->string('ruc', 13)->unique();
            $table->string('phone', 20)->nullable();
            $table->string('email', 200)->nullable();
            $table->text('address')->nullable();
            $table->string('logo_url', 500)->nullable();
            $table->string('scope', 20)->default('urban');
            $table->boolean('is_active')->default(true);
            $table->jsonb('config')->default('{}');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cooperatives');
    }
};
