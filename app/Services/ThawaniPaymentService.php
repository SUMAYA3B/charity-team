<?php

namespace App\Services;

use App\Models\Donation;
use App\Models\Payment;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;

class ThawaniPaymentService
{
    private string $secretKey;
    private string $publishableKey;
    private string $apiUrl;
    private string $checkoutUrl;
    private string $frontendUrl;

    public function __construct()
    {
        $this->secretKey = (string) Config::get('thawani.secret_key');
        $this->publishableKey = (string) Config::get('thawani.publishable_key');
        $this->apiUrl = (string) Config::get('thawani.api_url');
        $this->checkoutUrl = (string) Config::get('thawani.checkout_url');
        $this->frontendUrl = rtrim((string) Config::get('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');

        $this->ensureStageMode();
    }

    /**
     * Stage/UAT safety guard. Blocks accidental use of production endpoints
     * until explicitly enabled via .env.
     */
    private function ensureStageMode(): void
    {
        if ((bool) Config::get('thawani.stage_only', true) === false) {
            throw new \RuntimeException('Thawani integration is not configured for stage mode.');
        }
    }

    /**
     * Create a Thawani payment session for a donation.
     *
     * @return array{session_id: string, payment_url: string}
     */
    public function createSession(Donation $donation): array
    {
        $amountBaisa = (int) round($donation->amount * 1000);

        $response = Http::timeout(30)
            ->withHeaders([
                'thawani-api-key' => $this->secretKey,
                'Content-Type' => 'application/json',
            ])
            ->post($this->apiUrl . '/api/v1/checkout/session', [
                'client_reference_id' => $donation->reference_number,
                'mode' => 'payment',
                'products' => [
                    [
                        'name' => 'تبرع - ' . $donation->reference_number,
                        'quantity' => 1,
                        'unit_amount' => $amountBaisa,
                    ],
                ],
                'success_url' => $this->frontendUrl . '/donate/success?ref=' . $donation->reference_number,
                'cancel_url' => $this->frontendUrl . '/donate/cancelled?ref=' . $donation->reference_number,
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException(
                'فشل إنشاء جلسة الدفع: ' . ($response->json('detail') ?? $response->body()),
                502
            );
        }

        $payload = $response->json();
        $sessionId = $payload['data']['session_id'] ?? null;

        if (! $sessionId) {
            throw new \RuntimeException('لم يتم الحصول على session_id من بوابة الدفع.', 502);
        }

        // مزامنة حالة التبرع
        $donation->update([
            'status' => Donation::STATUS_PROCESSING,
            'thawani_session_id' => $sessionId,
        ]);

        // حفظ سجل الدفع
        Payment::updateOrCreate(
            ['donation_id' => $donation->id],
            [
                'session_id' => $sessionId,
                'amount' => $donation->amount,
                'status' => Payment::STATUS_PENDING,
                'payment_method' => 'thawani',
            ]
        );

        $paymentUrl = $this->checkoutUrl . '/' . $sessionId;

        if ($this->publishableKey !== '') {
            $paymentUrl .= '?key=' . urlencode($this->publishableKey);
        }

        return [
            'session_id' => $sessionId,
            'payment_url' => $paymentUrl,
        ];
    }

    /**
     * Verify a Thawani session and update donation + collected amount.
     *
     * @return array{success: bool, status: string, donation?: Donation}
     */
    public function verifySession(string $sessionId): array
    {
        $response = Http::timeout(30)
            ->withHeaders(['thawani-api-key' => $this->secretKey])
            ->get($this->apiUrl . '/api/v1/checkout/session/' . $sessionId);

        if (! $response->successful()) {
            throw new \RuntimeException('فشل التحقق من جلسة الدفع.', 502);
        }

        $data = $response->json('data') ?? [];
        $paymentStatus = $data['payment_status'] ?? null;

        $donation = Donation::where('thawani_session_id', $sessionId)->first();
        $payment = Payment::where('session_id', $sessionId)->first();

        if (! $donation || ! $payment) {
            return ['success' => false, 'status' => 'not_found'];
        }

        if ($paymentStatus === 'paid') {
            // منع تكرار الاحتساب
            if ($payment->status === Payment::STATUS_PAID) {
                return [
                    'success' => true,
                    'status' => 'already_paid',
                    'donation' => $donation,
                ];
            }

            $payment->markAsPaid([
                'transaction_id' => $data['transaction_id'] ?? null,
                'payment_method' => $data['payment_method'] ?? null,
            ]);

            $donation->markAsPaid([
                'transaction_id' => $data['transaction_id'] ?? null,
            ]);

            // تحديث المبلغ المحصل للحالة فقط عند الدفع الناجح
            if ($donation->donation_case_id) {
                $donation->donationCase()->increment('collected_amount', $donation->amount);
            }

            return [
                'success' => true,
                'status' => 'paid',
                'donation' => $donation,
            ];
        }

        if (in_array($paymentStatus, ['failed', 'cancelled'], true)) {
            $payment->markAsFailed();
            $donation->markAsFailed();

            return [
                'success' => false,
                'status' => $paymentStatus,
                'donation' => $donation,
            ];
        }

        return ['success' => false, 'status' => 'pending'];
    }

    /**
     * Extract session id from webhook/callback payload.
     */
    public function extractSessionId(array $payload): ?string
    {
        return $payload['session_id']
            ?? $payload['data']['session_id']
            ?? $payload['session']['id'] ?? null;
    }

    /**
     * Handle a Thawani webhook.
     *
     * @return array{success: bool, status: string}
     */
    public function handleWebhook(array $payload): array
    {
        $sessionId = $this->extractSessionId($payload);

        if (! $sessionId) {
            return ['success' => false, 'status' => 'invalid_payload'];
        }

        return $this->verifySession($sessionId);
    }
}
