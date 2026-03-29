// src/lib/api/tutor-earnings.ts
import client from "./client";

export interface EarningsOverview {
  total_earned: number;
  pending_earnings: number;
  this_month_earnings: number;
  total_students: number;
  total_sessions: number;
  total_classes: number;
  average_rating: number;
  completion_rate: number;
  average_per_student: number;
  average_per_session: number;
  total_reviews?: number;
}

export interface PeriodEarning {
  period: string;
  student_count: number;
  session_count: number;
  class_count: number;
  total_amount: number;
  average_amount: number;
  min_amount: number;
  max_amount: number;
  growth_percentage?: number;
}

// Updated: SessionEarning instead of CourseEarning
export interface SessionEarning {
  session_id: number;
  session_name: string;
  subject: string;
  session_code: string;
  student_count: number;
  total_earned: number;
  average_per_student: number;
  min_payment: number;
  max_payment: number;
  session_fee: number;
  max_capacity: number;
  current_enrollment: number;
  percentage?: number;
  occupancy_rate?: number;
}

export interface RecentPayout {
  enrollment_id: number;
  payment_amount: number;
  payment_status: string;
  payment_reference: string;
  payment_date: string;
  session_name: string;
  subject: string;
  first_name: string;
  last_name: string;
  student_email: string;
}

export interface PaymentSummary {
  daily: Array<{
    date: string;
    transaction_count: number;
    daily_total: number;
    transactions: Array<{
      student_name: string;
      amount: number;
      session: string;
      subject: string;
      reference: string;
    }>;
  }>;
  totals: {
    total_amount: number;
    total_transactions: number;
  };
}

export interface WithdrawalMethod {
  id: number;
  method_type: 'bank' | 'mobile_money' | 'paypal';
  account_name: string;
  account_number: string;
  bank_name?: string;
  bank_code?: string;
  branch_code?: string;
  swift_code?: string;
  mobile_number?: string;
  provider?: string;
  is_default: boolean;
}

export interface PayoutRequest {
  amount: number;
  method: string;
  details?: Record<string, any>;
  notes?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

const tutorEarningsApi = {
  // Get earnings overview
  getOverview: (): Promise<ApiResponse<EarningsOverview>> =>
    client.get("/tutor/earnings/overview"),

  // Get earnings by period (daily, weekly, monthly, yearly)
  getByPeriod: (period: string = 'monthly'): Promise<ApiResponse<PeriodEarning[]>> =>
    client.get("/tutor/earnings/by-period", { period }),

  // Get earnings by session (renamed from getByCourse)
  getBySession: (): Promise<ApiResponse<SessionEarning[]>> =>
    client.get("/tutor/earnings/by-session"),

  // Get recent payouts
  getRecentPayouts: (limit: number = 10): Promise<ApiResponse<RecentPayout[]>> =>
    client.get("/tutor/earnings/recent", { limit }),

  // Get payment summary for date range
  getPaymentSummary: (startDate?: string, endDate?: string): Promise<ApiResponse<PaymentSummary>> =>
    client.get("/tutor/earnings/summary", { startDate, endDate }),

  // Request payout
  requestPayout: (data: PayoutRequest): Promise<ApiResponse<any>> =>
    client.post("/tutor/earnings/payouts/request", data),

  // Get withdrawal methods
  getWithdrawalMethods: (): Promise<ApiResponse<WithdrawalMethod[]>> =>
    client.get("/tutor/earnings/withdrawal-methods"),

  // Add withdrawal method
  addWithdrawalMethod: (data: Omit<WithdrawalMethod, 'id'>): Promise<ApiResponse<WithdrawalMethod>> =>
    client.post("/tutor/earnings/withdrawal-methods", data),

  // Export earnings
  exportEarnings: (year?: number, month?: number, format: 'json' | 'csv' = 'json'): Promise<any> =>
    client.get("/tutor/earnings/export", { year, month, format }),
};

export default tutorEarningsApi;