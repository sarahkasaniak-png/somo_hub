// src/lib/api/payment.ts
import client from "./client";

export interface InitializePaymentData {
  amount: number;
  currency: string;
  email: string;
  phone?: string;
  payment_method: 'card' | 'mobile_money' | 'bank_transfer';
  metadata: {
    // Make session fields optional
    session_id?: number;
    session_name?: string;
    // Add application fields for tutor onboarding
    application_id?: number;
    // Payment type determines how to handle the payment
    payment_type: 'tutor_onboarding' | 'session_enrollment' | 'community_membership' | 'course_purchase';
  };
}

// Application data returned in payment verification
export interface ApplicationData {
  id: number;
  application_status: string;
  payment_status: string;
  payment_reference: string | null;
}

export interface VerifyPaymentResponse {
  success: boolean;
  data?: {
    status: 'success' | 'failed' | 'pending';
    reference: string;
    amount: number;
    currency: string;
    payment_type: string;
    paid_at?: string;
    metadata: any;
    // Add these fields for application update status
    application?: ApplicationData;
    application_updated?: boolean;
    application_status?: string;
  };
  message?: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  data: {
    payments: any[];
    total: number;
    page: number;
    limit: number;
  };
}

const paymentApi = {
  // Initialize payment with Paystack
  initializePayment: (data: InitializePaymentData) =>
    client.post("/payments/initialize", data),

  // Verify payment after redirect
  verifyPayment: (reference: string): Promise<VerifyPaymentResponse> =>
    client.get(`/payments/verify/${reference}`),

  // Get payment methods saved by user
  getPaymentMethods: () =>
    client.get("/payments/methods"),

  // Save a payment method for future use
  savePaymentMethod: (data: any) =>
    client.post("/payments/methods", data),

  // Delete a saved payment method
  deletePaymentMethod: (methodId: number) =>
    client.delete(`/payments/methods/${methodId}`),

  // Get user's payment history
  getPaymentHistory: (params?: { page?: number; limit?: number }): Promise<PaymentHistoryResponse> =>
    client.get("/payments/history", params),

  // Get payment details by reference
  getPaymentByReference: (reference: string) =>
    client.get(`/payments/${reference}`),

  // Handle Paystack webhook (called by backend)
  handleWebhook: (payload: any) =>
    client.post("/payments/webhook", payload),
};

export default paymentApi;