// src/app/payment/callback/PaymentVerifier.tsx
"use client";

import { useEffect, useState, useRef } from "react";
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

  // Use refs to prevent multiple executions
  const verificationStarted = useRef<boolean>(false);
  const hasRedirected = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      // Prevent multiple verification attempts
      if (verificationStarted.current) {
        console.log("⏳ Verification already in progress, skipping...");
        return;
      }

      verificationStarted.current = true;

      const reference =
        searchParams.get("reference") || searchParams.get("trxref");

      console.log("🔍 PaymentVerifier - Reference:", reference);

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

        // ONLY proceed if payment was successful
        if (
          verifyResponse.success &&
          verifyResponse.data?.status === "success"
        ) {
          setStatus("success");

          // Clean up session storage
          sessionStorage.removeItem("pending_session_id");
          sessionStorage.removeItem("pending_application_id");
          sessionStorage.removeItem("pending_payment_type");
          sessionStorage.removeItem("pending_payment_reference");

          // Start countdown for redirect to home page
          let count = 3;
          setCountdown(count);

          const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);

            if (count <= 0) {
              clearInterval(timer);
              timerRef.current = null;

              // Prevent multiple redirects
              if (!hasRedirected.current) {
                hasRedirected.current = true;
                // Redirect to home page after successful payment
                router.push("/");
              }
            }
          }, 1000);

          timerRef.current = timer;
        } else {
          // Payment failed
          setStatus("failed");
          setMessage(verifyResponse.message || "Payment verification failed");

          // Clean up session storage on failure
          sessionStorage.removeItem("pending_session_id");
          sessionStorage.removeItem("pending_application_id");
          sessionStorage.removeItem("pending_payment_type");
          sessionStorage.removeItem("pending_payment_reference");

          // Reset verification flag so user can try again
          setTimeout(() => {
            verificationStarted.current = false;
          }, 5000);
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

        // Reset verification flag so user can try again
        setTimeout(() => {
          verificationStarted.current = false;
        }, 5000);
      }
    };

    verifyPayment();

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
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
              Redirecting to home page in {countdown} seconds...
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
