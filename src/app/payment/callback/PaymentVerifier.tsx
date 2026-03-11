// src/app/payment/callback/PaymentVerifier.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import paymentApi from "@/lib/api/payment";

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

      if (!reference) {
        setStatus("failed");
        setMessage("No payment reference found");
        return;
      }

      try {
        setStatus("verifying");

        // Verify the payment with backend
        console.log("🔍 Calling payment verification API...");
        const verifyResponse = await paymentApi.verifyPayment(reference);
        console.log("✅ Verification response:", verifyResponse);

        if (
          verifyResponse.success &&
          verifyResponse.data?.status === "success"
        ) {
          setStatus("success");

          // Show success message for 3 seconds before redirect
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);

                // Determine redirect based on payment type
                if (paymentType === "session_enrollment" && sessionId) {
                  // For session enrollment, go to the session page
                  router.push(`/tuitions/${sessionId}`);
                } else if (
                  paymentType === "tutor_onboarding" ||
                  applicationId
                ) {
                  // For tutor onboarding, go directly to status page
                  router.push("/onboarding/tutor/status");
                } else {
                  router.push("/dashboard");
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
        } else {
          setStatus("failed");
          setMessage(verifyResponse.message || "Payment verification failed");

          // Clean up session storage on failure
          sessionStorage.removeItem("pending_session_id");
          sessionStorage.removeItem("pending_application_id");
          sessionStorage.removeItem("pending_payment_type");
          sessionStorage.removeItem("pending_payment_reference");
        }
      } catch (error: any) {
        console.error("Error during payment verification:", error);
        setStatus("failed");
        setMessage(error.message || "Failed to verify payment");

        // Clean up session storage on error
        sessionStorage.removeItem("pending_session_id");
        sessionStorage.removeItem("pending_application_id");
        sessionStorage.removeItem("pending_payment_type");
        sessionStorage.removeItem("pending_payment_reference");
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
              Redirecting to status page in {countdown} seconds...
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
            <div className="space-y-3">
              <Link
                href="/onboarding/tutor"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Return to Application
              </Link>
              <p className="text-sm text-gray-500">
                Need help?{" "}
                <Link
                  href="/contact"
                  className="text-purple-600 hover:underline"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
