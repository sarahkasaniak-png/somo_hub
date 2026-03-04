// src/app/onboarding/tutor/components/MpesaPayment.tsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { initiateMpesaPayment } from "@/lib/api/payments";

interface MpesaPaymentProps {
  amount: number;
  phoneNumber: string;
  onPaymentSuccess: (reference: string) => void;
  onPaymentError: (error: string) => void;
}

export default function MpesaPayment({
  amount,
  phoneNumber,
  onPaymentSuccess,
  onPaymentError,
}: MpesaPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(!phoneNumber);
  const [phone, setPhone] = useState(phoneNumber);

  const handleMpesaPayment = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setIsLoading(true);

      // Format phone number (remove leading 0 or country code if present)
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "254" + formattedPhone.substring(1);
      } else if (formattedPhone.startsWith("+254")) {
        formattedPhone = formattedPhone.substring(1);
      }

      // Initiate M-Pesa STK Push
      const response = await initiateMpesaPayment({
        amount,
        phoneNumber: formattedPhone,
        accountReference: "TUTOR_APP_FEE",
        transactionDesc: `Tutor Application Fee - $${amount}`,
      });

      toast.success(
        "M-Pesa prompt sent to your phone. Please check to complete payment."
      );

      // Poll for payment status (in a real app, you'd use webhooks)
      setTimeout(() => {
        // Simulate payment success after 30 seconds
        // In production, you'd listen for webhook events
        onPaymentSuccess(`MPESA-${Date.now()}`);
      }, 30000);
    } catch (error: any) {
      console.error("M-Pesa payment error:", error);
      toast.error(error.message || "Failed to initiate M-Pesa payment");
      onPaymentError(error.message || "Payment initialization failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (showPhoneInput) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            M-Pesa Phone Number *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="0712345678 or +254712345678"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            You will receive an M-Pesa prompt on this number
          </p>
        </div>
        <button
          onClick={handleMpesaPayment}
          disabled={isLoading}
          className="w-full px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </span>
          ) : (
            "Send M-Pesa Prompt"
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleMpesaPayment}
      disabled={isLoading}
      className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Processing...
        </span>
      ) : (
        <>
          <svg
            className="w-5 h-5 mr-2 inline-block"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Pay with M-Pesa (${amount.toFixed(2)})
        </>
      )}
    </button>
  );
}
