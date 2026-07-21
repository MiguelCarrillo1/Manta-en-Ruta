<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_driver', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->foreignId('driver_id')->constrained('drivers')->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamp('unassigned_at')->nullable();
            $table->boolean('is_active')->default(true);

            $table->index('vehicle_id');
            $table->index('driver_id');
            $table->index(['vehicle_id', 'driver_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_driver');
    }
};
