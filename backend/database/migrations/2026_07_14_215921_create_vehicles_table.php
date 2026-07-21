<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_id')->constrained('cooperatives')->cascadeOnDelete();
            $table->string('plate', 20);
            $table->string('brand', 100);
            $table->string('model', 100);
            $table->smallInteger('year')->nullable();
            $table->smallInteger('capacity')->nullable();
            $table->string('color', 50)->nullable();
            $table->boolean('has_ac')->default(false);
            $table->boolean('has_wifi')->default(false);
            $table->boolean('ac_status')->nullable();
            $table->boolean('wifi_status')->nullable();
            $table->decimal('last_known_lat', 10, 7)->nullable();
            $table->decimal('last_known_lng', 10, 7)->nullable();
            $table->timestamp('last_position_at')->nullable();
            $table->string('status', 20)->default('available');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['cooperative_id', 'plate']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
