// src/app/onboarding/tutor/components/PaystackPayment.tsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import paymentApi from "@/lib/api/payment";
import { Loader2 } from "lucide-react";

interface PaymentResponse {
  success: boolean;
  data?: {
    authorization_url: string;
    reference: string;
    access_code?: string;
  };
  message?: string;
}

interface PaystackPaymentProps {
  amount: number;
  email: string;
  onPaymentSuccess: (reference: string) => void;
  onPaymentError: (error: string) => void;
  applicationId?: number;
}

export default function PaystackPayment({
  amount,
  email,
  onPaymentSuccess,
  onPaymentError,
  applicationId,
}: PaystackPaymentProps) {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setProcessing(true);

    try {
      // Create a properly typed metadata object with all fields needed
      const metadata = {
        payment_type: "tutor_onboarding" as const,
        application_id: applicationId,
        session_id: undefined,
        session_name: undefined,
        course_id: undefined,
        course_title: undefined,
        enrollment_id: undefined,
        community_id: undefined,
        community_name: undefined,
      };

      // Initialize payment with Paystack
      const response = (await paymentApi.initializePayment({
        amount,
        currency: "KES",
        email,
        payment_method: "card",
        metadata: metadata as any, // Type assertion to bypass TypeScript
      })) as PaymentResponse;

      if (response.success && response.data) {
        const { authorization_url, reference } = response.data;

        // Store reference in session storage to verify after redirect
        sessionStorage.setItem("pending_payment_reference", reference);
        sessionStorage.setItem("pending_payment_type", "tutor_onboarding");
        if (applicationId) {
          sessionStorage.setItem(
            "pending_application_id",
            applicationId.toString(),
          );
        }

        // Redirect to Paystack
        window.location.href = authorization_url;
      } else {
        throw new Error(response.message || "Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      onPaymentError(error.message || "Failed to initialize payment");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={processing || !email}
      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {processing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay KES ${amount.toLocaleString()}`
      )}
    </button>
  );
}
