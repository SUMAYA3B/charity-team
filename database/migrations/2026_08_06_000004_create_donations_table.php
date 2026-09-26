<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();
            $table->foreignId('donation_case_id')->nullable()->constrained()->nullOnDelete();
            $table->string('donor_name')->nullable();
            $table->string('donor_email')->nullable();
            $table->string('donor_phone')->nullable();
            $table->string('donor_type')->default('general'); // general | specific
            $table->decimal('amount', 15, 2);
            $table->enum('status', [
                'pending', 'processing', 'paid', 'failed', 'cancelled'
            ])->default('pending');
            $table->string('payment_method')->nullable(); // thawani
            $table->string('thawani_session_id')->nullable()->index();
            $table->string('transaction_id')->nullable();
            $table->json('payment_metadata')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('reference_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
