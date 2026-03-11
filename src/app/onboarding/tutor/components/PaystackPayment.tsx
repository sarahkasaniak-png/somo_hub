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
  disabled?: boolean;
}

export default function PaystackPayment({
  amount,
  email,
  onPaymentSuccess,
  onPaymentError,
  applicationId,
  disabled = false,
}: PaystackPaymentProps) {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (disabled) {
      toast.error("Please accept the Terms of Service to proceed");
      return;
    }

    setProcessing(true);

    try {
      // Create metadata with only allowed fields
      const metadata: any = {
        payment_type: "tutor_onboarding",
      };

      // Only add application_id if it exists
      if (applicationId) {
        metadata.application_id = applicationId;
      }

      console.log("🚀 Initializing payment with metadata:", metadata);

      // Initialize payment with Paystack
      const response = (await paymentApi.initializePayment({
        amount,
        currency: "KES",
        email,
        payment_method: "card",
        metadata,
      })) as PaymentResponse;

      console.log("✅ Payment initialization response:", response);

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
      console.error("❌ Payment initialization error:", error);
      onPaymentError(error.message || "Failed to initialize payment");
    } finally {
      setProcessing(false);
    }
  };

  const isButtonDisabled = processing || !email || disabled;

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={isButtonDisabled}
      className={`w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
        isButtonDisabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
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
