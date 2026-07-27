<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('line_stop', function (Blueprint $table) {
            $table->string('tramo', 10)->nullable()->after('order');
        });
    }

    public function down(): void
    {
        Schema::table('line_stop', function (Blueprint $table) {
            $table->dropColumn('tramo');
        });
    }
};
