// src/lib/api/payments.ts
import apiClient  from "./client";

export interface PaystackPaymentRequest {
  amount: number;
  email: string;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface MpesaPaymentRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
}

export interface PaymentResponse {
  success: boolean;
  data: {
    reference: string;
    amount: number;
    checkout_url?: string;
    message?: string;
  };
  message: string;
}

export const processPaystackPayment = async (data: PaystackPaymentRequest): Promise<PaymentResponse> => {
  return await apiClient.post("/payments/paystack/initialize", data);
};

export const initiateMpesaPayment = async (data: MpesaPaymentRequest): Promise<PaymentResponse> => {
  return await apiClient.post("/payments/mpesa/stk-push", data);
};

export const verifyPayment = async (reference: string): Promise<{
  success: boolean;
  data: {
    status: string;
    amount: number;
    payment_method: string;
  };
}> => {
  return await apiClient.get(`/payments/verify/${reference}`);
};

// Webhook handler for payment verification
export const handlePaymentWebhook = async (payload: any): Promise<void> => {
  // This would be called by your backend webhook endpoint
  await apiClient.post("/payments/webhook", payload);
};