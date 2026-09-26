<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\DonateRequest;
use App\Http\Requests\Public\VerifyPaymentRequest;
use App\Http\Resources\DonationResource;
use App\Models\Donation;
use App\Services\DonationService;
use App\Services\ThawaniPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class DonationController extends Controller
{
    public function __construct(
        protected DonationService $donationService,
        protected ThawaniPaymentService $thawani,
    ) {}

    /**
     * Create a donation and open a Thawani payment session.
     */
    public function createSession(DonateRequest $request): JsonResponse
    {
        // Rate limit: prevent spam on sensitive payment endpoint
        $key = 'donate:' . ($request->ip() ?: 'guest');
        if (RateLimiter::tooManyAttempts($key, 10)) {
            return response()->json([
                'message' => 'لقد أرسلت طلبات كثيرة، يرجى المحاولة لاحقًا.',
            ], 429);
        }
        RateLimiter::hit($key, 300);

        try {
            $validated = $request->validated();
            $this->donationService->validateCase($validated['donation_case_id'] ?? null);

            $donation = $this->donationService->createPendingDonation([
                ...$validated,
                'ip_address' => $request->ip(),
            ]);

            $session = $this->thawani->createSession($donation);

            return response()->json([
                'message' => 'تم إنشاء جلسة الدفع بنجاح.',
                'data' => [
                    'donation' => new DonationResource($donation),
                    'session_id' => $session['session_id'],
                    'payment_url' => $session['payment_url'],
                ],
            ], 201);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 422);
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['message' => 'حدث خطأ أثناء إنشاء جلسة الدفع.'], 500);
        }
    }

    /**
     * Verify a payment after callback / manually.
     */
    public function verify(VerifyPaymentRequest $request): JsonResponse
    {
        try {
            $result = $this->thawani->verifySession($request->session_id);

            return response()->json([
                'message' => 'تم التحقق من حالة الدفع.',
                'data' => [
                    'status' => $result['status'],
                    'success' => $result['success'],
                    'donation' => isset($result['donation'])
                        ? new DonationResource($result['donation'])
                        : null,
                ],
            ]);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 502);
        }
    }

    /**
     * DEV-ONLY: confirm a donation as paid after arriving from a ref-based
     * success URL, when no real payment gateway/webhook is wired up.
     *
     * This endpoint is harmless in production: it bails out unless APP_ENV is local.
     */
    public function confirmDemoPayment(Request $request): JsonResponse
    {
        // Guard: never allow in production.
        if (app()->environment('production')) {
            return response()->json(['message' => 'هذه الميزة متاحة في بيئة التطوير فقط.'], 403);
        }

        $validated = $request->validate([
            'ref' => ['required', 'string'],
        ]);

        $donation = Donation::where('reference_number', $validated['ref'])
            ->with('donationCase')
            ->first();

        if (! $donation) {
            return response()->json(['message' => 'التبرع غير موجود.'], 404);
        }

        // Already in a final state → do not re-process (prevents double counting).
        if (in_array($donation->status, [Donation::STATUS_PAID, Donation::STATUS_FAILED, Donation::STATUS_CANCELLED], true)) {
            return response()->json([
                'message' => 'وصلت الحالة النهائية للتبرع.',
                'data' => new DonationResource($donation),
            ]);
        }

        // Mark as paid + reflect on the payment row (if any).
        if ($donation->payment) {
            $donation->payment->markAsPaid([
                'transaction_id' => 'DEMO-' . strtoupper(substr((string) $donation->id, 0, 12)),
                'payment_method' => 'thawani',
                'demo_confirmed' => true,
            ]);
        }

        $donation->markAsPaid(['demo_confirmed' => true]);

        // Increase the case collected amount exactly once (we are outside the
        // "final" guard above, so this can never run twice).
        if ($donation->donation_case_id) {
            $donation->donationCase()->increment('collected_amount', $donation->amount);
        }

        return response()->json([
            'message' => 'تم تأكيد التبرع (وضع تجريبي).',
            'data' => new DonationResource($donation->fresh('donationCase')),
        ]);
    }

    /**
     * Public donation lookup by reference number (for result pages).
     */
    public function show(Request $request, string $referenceNumber): JsonResponse
    {
        $donation = Donation::where('reference_number', $referenceNumber)
            ->with('donationCase')
            ->firstOrFail();

        return response()->json([
            'message' => 'تم جلب التبرع بنجاح.',
            'data' => new DonationResource($donation),
        ]);
    }

    /**
     * Thawani webhook handler.
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();

        try {
            $result = $this->thawani->handleWebhook($payload);

            if ($result['success'] && in_array($result['status'], ['paid', 'already_paid'], true)) {
                return response()->json(['status' => 'success'], 200);
            }

            return response()->json(['status' => $result['status']], 200);
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['status' => 'error'], 500);
        }
    }
}
