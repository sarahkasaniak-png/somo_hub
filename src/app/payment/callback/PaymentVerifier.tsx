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

      if (!reference) {
        setStatus("failed");
        setMessage("No payment reference found");
        return;
      }

      try {
        // Wait a bit for webhook to process
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Optionally verify with your backend
        // const verifyResponse = await fetch(`/api/payments/verify/${reference}`);
        // const data = await verifyResponse.json();

        setStatus("success");
        setMessage("Payment verified successfully!");

        // Start countdown for redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);

              // Redirect based on payment type
              if (paymentType === "session_enrollment" && sessionId) {
                router.push(`/tuitions/${sessionId}?reference=${reference}`);
              } else if (paymentType === "tutor_onboarding") {
                router.push(`/onboarding/tutor/status?reference=${reference}`);
              } else if (applicationId) {
                router.push(`/onboarding/tutor/status?reference=${reference}`);
              } else {
                router.push(`/dashboard?reference=${reference}`);
              }

              // Clean up session storage
              sessionStorage.removeItem("pending_session_id");
              sessionStorage.removeItem("pending_application_id");
              sessionStorage.removeItem("pending_payment_type");
              sessionStorage.removeItem("pending_payment_reference");
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
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
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting in {countdown} seconds...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              ></div>
            </div>
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
