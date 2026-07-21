<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journeys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_id')->constrained('cooperatives')->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->foreignId('driver_id')->constrained('drivers')->cascadeOnDelete();
            $table->integer('start_km');
            $table->integer('end_km')->nullable();
            $table->timestamp('start_at')->useCurrent();
            $table->timestamp('end_at')->nullable();
            $table->string('status', 20)->default('active');
            $table->decimal('total_distance_km', 10, 2)->nullable();
            $table->decimal('total_fuel_liters', 10, 2)->nullable();
            $table->text('notes_summary')->nullable();
            $table->timestamps();
            $table->index(['cooperative_id', 'status']);
            $table->index(['vehicle_id', 'status']);
            $table->index('start_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journeys');
    }
};
