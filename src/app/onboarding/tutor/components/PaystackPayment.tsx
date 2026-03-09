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

  // src/app/onboarding/tutor/components/PaystackPayment.tsx

  const handlePayment = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setProcessing(true);

    try {
      // Create metadata with only allowed fields
      const metadata = {
        payment_type: "tutor_onboarding",
        session_id: applicationId, // Use session_id to store application ID
        session_name: applicationId
          ? `Tutor Application #${applicationId}`
          : undefined,
      };

      // Initialize payment with Paystack
      const response = (await paymentApi.initializePayment({
        amount,
        currency: "KES",
        email,
        payment_method: "card",
        metadata: metadata as any,
      })) as PaymentResponse;

      if (response.success && response.data) {
        const { authorization_url, reference } = response.data;

        // Store reference in session storage
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
