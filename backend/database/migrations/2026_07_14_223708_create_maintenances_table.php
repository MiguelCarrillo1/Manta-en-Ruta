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
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_id')->constrained('cooperatives')->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->string('type', 100);
            $table->text('description')->nullable();
            $table->date('scheduled_date')->nullable();
            $table->date('completed_date')->nullable();
            $table->integer('km_at_maintenance')->nullable();
            $table->decimal('cost', 12, 2)->nullable();
            $table->string('provider', 200)->nullable();
            $table->text('notes')->nullable();
            $table->string('status', 20)->default('scheduled');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['cooperative_id', 'vehicle_id']);
            $table->index(['cooperative_id', 'status']);
            $table->index(['cooperative_id', 'scheduled_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
