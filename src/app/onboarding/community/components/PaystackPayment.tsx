// src/app/onboarding/tutor/components/PaystackPayment.tsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { processPaystackPayment } from "@/lib/api/payments";

interface PaystackPaymentProps {
  amount: number;
  email: string;
  onPaymentSuccess: (reference: string) => void;
  onPaymentError: (error: string) => void;
}

export default function PaystackPayment({
  amount,
  email,
  onPaymentSuccess,
  onPaymentError,
}: PaystackPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePaystackPayment = async () => {
    try {
      setIsLoading(true);

      // Initialize Paystack payment
      const response = await processPaystackPayment({
        amount: amount * 100, // Convert to kobo/pesewas
        email,
        currency: "GHS",
        metadata: {
          payment_type: "tutor_application_fee",
        },
      });

      // Open Paystack payment modal
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email,
        amount: response.data.amount,
        ref: response.data.reference,
        currency: "GHS",
        callback: async (paymentResponse: any) => {
          if (paymentResponse.status === "success") {
            toast.success("Payment successful!");
            onPaymentSuccess(paymentResponse.reference);
          } else {
            onPaymentError("Payment failed. Please try again.");
          }
        },
        onClose: () => {
          toast.error("Payment was cancelled");
          setIsLoading(false);
        },
      });

      handler.openIframe();
    } catch (error: any) {
      console.error("Paystack payment error:", error);
      toast.error(error.message || "Failed to initialize payment");
      onPaymentError(error.message || "Payment initialization failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePaystackPayment}
      disabled={isLoading}
      className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
          Pay with Paystack (${amount.toFixed(2)})
        </>
      )}
    </button>
  );
}
