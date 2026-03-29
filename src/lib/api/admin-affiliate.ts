// src/lib/api/admin-affiliate.ts
import client from "./client";

export interface AdminAffiliate {
  id: number;
  user_id: number;
  affiliate_code: string;
  commission_rate: number;
  total_earnings: number;
  total_paid: number;
  total_referred_tutors: number;
  total_referred_students: number;
  is_active: boolean;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  referral_count: number;
  pending_commissions: number;
}

export interface CreateAffiliateData {
  email: string;
  first_name: string;
  last_name: string;
  commission_rate?: number;
}

export interface CreateAffiliateResponse {
  success: boolean;
  data: {
    affiliate: AdminAffiliate;
    temporary_password: string;
    is_new_user: boolean;
  };
}

export interface AdminAffiliateDetails {
  affiliate: AdminAffiliate;
  referrals: any[];
  commissions: any[];
  payouts: any[];
}

export interface PendingReferral {
  id: number;
  affiliate_id: number;
  referred_tutor_id: number;
  referred_user_id: number;
  referral_code_used: string;
  referral_status: string;
  created_at: string;
  affiliate_email: string;
  affiliate_first_name: string;
  affiliate_last_name: string;
  tutor_email: string;
  tutor_first_name: string;
  tutor_last_name: string;
  application_status: string;
  application_date: string;
}

export interface AffiliateStatsOverview {
  overview: {
    total_active_affiliates: number;
    total_affiliates: number;
    total_earnings: number;
    total_paid: number;
    total_referrals: number;
    pending_referrals: number;
    pending_commissions_amount: number;
    paid_commissions_count: number;
  };
  monthly_trend: Array<{ month: string; total: number }>;
}

const adminAffiliateApi = {
  // Create a new affiliate
  createAffiliate: (data: CreateAffiliateData) =>
    client.post<CreateAffiliateResponse>("/admin/affiliates/affiliates", data),

  // Resend affiliate credentials
  resendCredentials: (affiliateId: number) =>
    client.post<{ success: boolean }>(`/admin/affiliates/affiliates/${affiliateId}/resend-credentials`),

  // Get all affiliates
  getAffiliates: (page: number = 1, limit: number = 20, status: string = 'all') =>
    client.get<{ success: boolean; data: { affiliates: AdminAffiliate[]; total: number; page: number; totalPages: number } }>(
      "/admin/affiliates/affiliates",
      { page, limit, status }
    ),

  // Get affiliate details
  getAffiliateDetails: (affiliateId: number) =>
    client.get<{ success: boolean; data: AdminAffiliateDetails }>(
      `/admin/affiliates/affiliates/${affiliateId}`
    ),

  // Update affiliate status
  updateAffiliateStatus: (affiliateId: number, isActive: boolean) =>
    client.put<{ success: boolean }>(
      `/admin/affiliates/affiliates/${affiliateId}/status`,
      { is_active: isActive }
    ),

  // Update commission rate
  updateCommissionRate: (affiliateId: number, commissionRate: number) =>
    client.put<{ success: boolean }>(
      `/admin/affiliates/affiliates/${affiliateId}/commission-rate`,
      { commission_rate: commissionRate }
    ),

  // Get pending referrals
  getPendingReferrals: (page: number = 1, limit: number = 20) =>
    client.get<{ success: boolean; data: { referrals: PendingReferral[]; total: number; page: number; totalPages: number } }>(
      "/admin/affiliates/referrals/pending",
      { page, limit }
    ),

  // Approve referral
  approveReferral: (referralId: number) =>
    client.post<{ success: boolean }>(`/admin/affiliates/referrals/${referralId}/approve`),

  // Reject referral
  rejectReferral: (referralId: number, reason?: string) =>
    client.post<{ success: boolean }>(`/admin/affiliates/referrals/${referralId}/reject`, { reason }),

  // Process payout
  processPayout: (payoutId: number, status: string, transactionReference?: string, notes?: string) =>
    client.post<{ success: boolean }>(`/admin/affiliates/payouts/${payoutId}/process`, {
      status,
      transaction_reference: transactionReference,
      notes
    }),

  // Get stats overview
  getStatsOverview: () =>
    client.get<{ success: boolean; data: AffiliateStatsOverview }>(
      "/admin/affiliates/stats/overview"
    ),
};

export default adminAffiliateApi;