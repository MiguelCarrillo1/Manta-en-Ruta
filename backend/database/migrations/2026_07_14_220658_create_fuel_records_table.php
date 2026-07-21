<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fuel_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_id')->constrained('cooperatives')->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->foreignId('journey_id')->constrained('journeys')->cascadeOnDelete();
            $table->foreignId('driver_id')->constrained('drivers')->cascadeOnDelete();
            $table->decimal('liters', 10, 2);
            $table->decimal('cost', 10, 2)->nullable();
            $table->string('provider', 200)->nullable();
            $table->integer('current_km')->nullable();
            $table->timestamp('recorded_at')->useCurrent();
            $table->timestamps();
            $table->index(['vehicle_id', 'recorded_at']);
            $table->index('journey_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fuel_records');
    }
};
