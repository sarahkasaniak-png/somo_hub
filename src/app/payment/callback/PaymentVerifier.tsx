// src/app/payment/callback/PaymentVerifier.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentVerifier() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying",
  );
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference =
        searchParams.get("reference") || searchParams.get("trxref");

      const sessionId = sessionStorage.getItem("pending_session_id");
      const applicationId = sessionStorage.getItem("pending_application_id");
      const paymentType = sessionStorage.getItem("pending_payment_type");

      console.log("🔍 PaymentVerifier - Reference:", reference);
      console.log("🔍 PaymentVerifier - Payment Type:", paymentType);
      console.log("🔍 PaymentVerifier - Application ID:", applicationId);
      console.log("🔍 PaymentVerifier - Session ID:", sessionId);

      if (!reference) {
        setStatus("failed");
        setMessage("No payment reference found");
        return;
      }

      try {
        // Show verifying state
        setStatus("verifying");

        // Wait a bit for webhook to process
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Determine redirect based on payment type
        if (paymentType === "session_enrollment" && sessionId) {
          // For session enrollment, go to the session page with reference
          router.push(`/tuitions/${sessionId}?reference=${reference}`);
        } else if (paymentType === "tutor_onboarding" || applicationId) {
          // For tutor onboarding, go back to the application summary page with reference
          // The ApplicationSummary component will handle the verification
          router.push(`/onboarding/tutor?reference=${reference}&step=summary`);
        } else {
          router.push(`/dashboard?reference=${reference}`);
        }

        // Clean up session storage after redirect
        // (note: this might not execute if redirect happens immediately)
        sessionStorage.removeItem("pending_session_id");
        sessionStorage.removeItem("pending_application_id");
        sessionStorage.removeItem("pending_payment_type");
        sessionStorage.removeItem("pending_payment_reference");
      } catch (error) {
        console.error("Error during payment verification:", error);
        setStatus("failed");
        setMessage("Failed to verify payment");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. You will be
              redirected shortly.
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {message ||
                "Your payment could not be processed. Please try again."}
            </p>
            <Link
              href="/sessions"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Browse Sessions
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
