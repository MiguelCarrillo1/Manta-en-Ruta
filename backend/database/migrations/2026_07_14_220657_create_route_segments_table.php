<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('route_segments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('line_id')->constrained('lines')->cascadeOnDelete();
            $table->smallInteger('sequence');
            $table->foreignId('start_stop_id')->constrained('stops')->cascadeOnDelete();
            $table->foreignId('end_stop_id')->constrained('stops')->cascadeOnDelete();
            $table->text('polyline')->nullable();
            $table->decimal('distance_km', 10, 2)->nullable();
            $table->timestamps();
            $table->index(['line_id', 'sequence']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('route_segments');
    }
};
