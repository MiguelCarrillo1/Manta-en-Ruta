<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('line_stop', function (Blueprint $table) {
            $table->dropUnique('line_stop_line_id_stop_id_unique');
            $table->unique(['line_id', 'stop_id', 'tramo']);
        });
    }

    public function down(): void
    {
        Schema::table('line_stop', function (Blueprint $table) {
            $table->dropUnique(['line_id', 'stop_id', 'tramo']);
            $table->unique(['line_id', 'stop_id']);
        });
    }
};
