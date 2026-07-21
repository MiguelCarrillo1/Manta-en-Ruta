<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_id')->constrained('cooperatives')->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('code', 20);
            $table->text('description')->nullable();
            $table->string('color', 7)->nullable();
            $table->string('direction', 10)->default('outbound');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['cooperative_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lines');
    }
};
