// src/types/payment.types.ts

export interface Payment {
  id: number;
  reference: string;
  user_id: number;
  amount: number;
  currency: string;
  payment_type: 'tutor_onboarding' | 'session_enrollment' | 'community_membership' | 'course_purchase';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paystack_reference?: string;
  paystack_response?: any;
  metadata?: {
    session_id?: number;
    session_name?: string;
    course_id?: number;
    course_title?: string;
    enrollment_id?: number;
  };
  created_at: string;
  updated_at: string;
  
  // Joined fields from API
  session_name?: string;
  course_title?: string;
  enrollment_status?: string;
}

export interface PaymentSummary {
  total_spent: number;
  total_payments: number;
  successful_payments: number;
  pending_payments: number;
  failed_payments: number;
  refunded_amount: number;
  last_payment_date?: string;
}

export interface PaymentsResponse {
  success: boolean;
  message?: string;
  data: {
    payments: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentDetailsResponse {
  success: boolean;
  message?: string;
  data: Payment;
}

export interface PaymentMethod {
  id: number;
  type: 'card' | 'mobile_money' | 'bank_transfer';
  provider: string;
  last4?: string;
  expiry_month?: number;
  expiry_year?: number;
  mobile_number?: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  is_default: boolean;
}

export interface Invoice {
  id: number;
  payment_id: number;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue';
  due_date: string;
  paid_at?: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  pdf_url?: string;
}