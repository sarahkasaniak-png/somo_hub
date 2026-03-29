// src/lib/api/affiliate.ts
import client from "./client";

export interface Affiliate {
  id: number;
  user_id: number;
  affiliate_code: string;
  commission_rate: number;
  total_earnings: number;
  total_paid: number;
  total_referred_tutors: number;
  total_referred_students: number;
  is_active: boolean;
  payment_method: string | null;
  payment_details: any;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AffiliateStats {
  total_earnings: number;
  total_paid: number;
  total_referred_tutors: number;
  total_referred_students: number;
  pending_commissions: number;
  pending_amount: number;
  paid_amount: number;
}

export interface AffiliateDashboard {
  stats: AffiliateStats;
  recent_referrals: AffiliateReferral[];
  recent_commissions: AffiliateCommission[];
  affiliate_code: string;
  commission_rate: number;
}

export interface AffiliateReferral {
  id: number;
  affiliate_id: number;
  referred_tutor_id: number;
  referred_user_id: number;
  referral_code_used: string;
  referral_status: 'pending' | 'approved' | 'rejected' | 'expired';
  approved_at: string | null;
  approved_by: number | null;
  notes: string | null;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  application_status: string;
  application_date: string;
}

export interface AffiliateCommission {
  id: number;
  affiliate_id: number;
  referral_id: number;
  tutor_id: number;
  student_id: number;
  enrollment_id: number;
  session_id: number;
  enrollment_amount: number;
  commission_rate: number;
  commission_amount: number;
  student_number: number | null;
  is_eligible: boolean;
  commission_status: 'pending' | 'approved' | 'paid' | 'cancelled';
  payment_reference: string | null;
  paid_at: string | null;
  created_at: string;
  student_email: string;
  student_first_name: string;
  student_last_name: string;
  session_name: string;
  tutor_first_name: string;
  tutor_last_name: string;
}

export interface AffiliatePayout {
  id: number;
  affiliate_id: number;
  payout_amount: number;
  commission_ids: number[];
  payout_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payout_method: string;
  payout_details: any;
  payout_reference: string | null;
  requested_at: string;
  processed_at: string | null;
  completed_at: string | null;
  notes: string | null;
  admin_notes: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

const affiliateApi = {
  // Create affiliate account
  createAffiliate: (data: { commission_rate?: number; terms_accepted: boolean }) =>
    client.post<{ success: boolean; data: Affiliate }>("/affiliate/create", data),

  // Get affiliate profile
  getProfile: () =>
    client.get<{ success: boolean; data: Affiliate }>("/affiliate/profile"),

  // Get dashboard data
  getDashboard: () =>
    client.get<{ success: boolean; data: AffiliateDashboard }>("/affiliate/dashboard"),

  // Get referrals
  getReferrals: (page: number = 1, limit: number = 20) =>
    client.get<{ success: boolean; data: PaginatedResponse<AffiliateReferral> }>(
      "/affiliate/referrals",
      { page, limit }
    ),

  // Get commissions
  getCommissions: (page: number = 1, limit: number = 20) =>
    client.get<{ success: boolean; data: PaginatedResponse<AffiliateCommission> }>(
      "/affiliate/commissions",
      { page, limit }
    ),

  // Request payout
  requestPayout: (data: { payout_method: string; payout_details: any }) =>
    client.post<{ success: boolean; data: { id: number; amount: number; commission_count: number } }>(
      "/affiliate/payouts/request",
      data
    ),

  // Get payouts
  getPayouts: (page: number = 1, limit: number = 20) =>
    client.get<{ success: boolean; data: PaginatedResponse<AffiliatePayout> }>(
      "/affiliate/payouts",
      { page, limit }
    ),

  // Update payment method
  updatePaymentMethod: (data: { payment_method: string; payment_details: any }) =>
    client.put<{ success: boolean }>("/affiliate/payment-method", data),

  // Validate affiliate code (public)
  validateCode: (code: string) =>
    client.get<{ success: boolean; data: { affiliate_code: string; affiliate_name: string } }>(
      `/affiliate/validate/${code}`
    ),
};

export default affiliateApi;