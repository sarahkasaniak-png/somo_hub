// src/app/admin/affiliates/referrals/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  ChevronRight,
  Eye,
  RefreshCw,
  UserCheck,
  UserX,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { toast } from "react-hot-toast";
import client from "@/lib/api/client";

interface Referral {
  id: number;
  affiliate_id: number;
  referred_tutor_id: number;
  referred_user_id: number;
  referral_code_used: string;
  referral_status: "pending" | "approved" | "rejected" | "expired";
  created_at: string;
  approved_at: string | null;
  approved_by: number | null;
  notes: string | null;
  affiliate_email: string;
  affiliate_first_name: string;
  affiliate_last_name: string;
  affiliate_phone?: string;
  tutor_email: string;
  tutor_first_name: string;
  tutor_last_name: string;
  tutor_phone?: string;
  application_status: string;
  application_date: string;
  tutor_official_first_name?: string;
  tutor_official_last_name?: string;
  commission_count?: number;
  total_commission?: number;
}

interface ReferralStats {
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  total: number;
  total_commission_earned?: number;
  total_commissions?: number;
}

export default function AffiliateReferralsPage() {
  const router = useRouter();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState<ReferralStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0,
    total: 0,
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchReferrals();
    fetchStats();
  }, [statusFilter, pagination.page]);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const response = await client.get<{
        success: boolean;
        data: {
          referrals: Referral[];
          total: number;
          page: number;
          totalPages: number;
          stats: ReferralStats;
        };
      }>("/admin/referrals", {
        status: statusFilter,
        page: pagination.page,
        limit: 20,
        search: searchTerm || undefined,
      });

      if (response.success && response.data) {
        setReferrals(response.data.referrals);
        setPagination({
          page: response.data.page,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await client.get<{
        success: boolean;
        data: {
          stats: ReferralStats;
          monthly_trend: any[];
        };
      }>("/admin/referrals/stats");

      if (response.success && response.data) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleApprove = async (referralId: number) => {
    setActionLoading(referralId);
    try {
      const response = await client.post<{ success: boolean }>(
        `/admin/referrals/${referralId}/approve`,
      );

      if (response.success) {
        toast.success("Referral approved successfully");
        fetchReferrals();
        fetchStats();
      } else {
        toast.error("Failed to approve referral");
      }
    } catch (error) {
      console.error("Error approving referral:", error);
      toast.error("Failed to approve referral");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedReferral) return;

    setActionLoading(selectedReferral.id);
    try {
      const response = await client.post<{ success: boolean }>(
        `/admin/referrals/${selectedReferral.id}/reject`,
        { reason: rejectReason },
      );

      if (response.success) {
        toast.success("Referral rejected successfully");
        setShowRejectModal(false);
        setSelectedReferral(null);
        setRejectReason("");
        fetchReferrals();
        fetchStats();
      } else {
        toast.error("Failed to reject referral");
      }
    } catch (error) {
      console.error("Error rejecting referral:", error);
      toast.error("Failed to reject referral");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchReferrals();
  };

  const openRejectModal = (referral: Referral) => {
    setSelectedReferral(referral);
    setShowRejectModal(true);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      under_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount))
      return "KES 0";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/admin/affiliates" className="hover:text-purple-600">
            Affiliates
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Referrals</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Affiliate Referrals
        </h1>
        <p className="text-gray-600 mt-1">
          Manage all affiliate referrals across the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.total}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total Referrals</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.pending}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Pending</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.approved}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Approved</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.rejected}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Rejected</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.total_commission_earned)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total Commission</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by affiliate name, email, tutor name, or referral code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {["pending", "approved", "rejected", "all"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Search
          </button>
        </form>
      </div>

      {/* Referrals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No referrals found</p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="mt-2 text-purple-600 hover:text-purple-700 text-sm"
              >
                View all referrals
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Affiliate Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">
                          {referral.affiliate_first_name?.[0]}
                          {referral.affiliate_last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900">
                            {referral.affiliate_first_name}{" "}
                            {referral.affiliate_last_name}
                          </p>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                            Affiliate
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          {referral.affiliate_email}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Code:{" "}
                          <span className="font-mono">
                            {referral.referral_code_used}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="hidden lg:block">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Tutor Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {referral.tutor_first_name?.[0]}
                          {referral.tutor_last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900">
                            {referral.tutor_first_name}{" "}
                            {referral.tutor_last_name}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getApplicationStatusBadge(
                              referral.application_status,
                            )}`}
                          >
                            {referral.application_status?.toUpperCase() ||
                              "UNKNOWN"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          {referral.tutor_email}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Applied: {formatDate(referral.application_date)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(referral.referral_status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          referral.referral_status,
                        )}`}
                      >
                        {referral.referral_status.toUpperCase()}
                      </span>
                    </div>

                    {/* Commission info - with proper null check */}
                    {referral.commission_count !== undefined &&
                      referral.commission_count > 0 && (
                        <div className="text-xs text-gray-500">
                          {referral.commission_count}{" "}
                          {referral.commission_count === 1
                            ? "commission"
                            : "commissions"}{" "}
                          • {formatCurrency(referral.total_commission)}
                        </div>
                      )}

                    {/* Pending actions */}
                    {referral.referral_status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(referral.id)}
                          disabled={actionLoading === referral.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                        >
                          <UserCheck className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => openRejectModal(referral)}
                          disabled={actionLoading === referral.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                        >
                          <UserX className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/tutors/applications/${referral.referred_tutor_id}`,
                            )
                          }
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    )}

                    {/* Approved actions */}
                    {referral.referral_status === "approved" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/tutors/${referral.referred_tutor_id}`,
                            )
                          }
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Tutor
                        </button>
                        {referral.commission_count !== undefined &&
                          referral.commission_count > 0 && (
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/affiliates/commissions?referral=${referral.id}`,
                                )
                              }
                              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                              <DollarSign className="w-4 h-4" />
                              Commissions
                            </button>
                          )}
                      </div>
                    )}

                    {/* Rejected actions */}
                    {referral.referral_status === "rejected" && (
                      <button
                        onClick={() =>
                          router.push(
                            `/admin/tutors/applications/${referral.referred_tutor_id}`,
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Application
                      </button>
                    )}
                  </div>
                </div>

                {/* Rejection Reason */}
                {referral.notes && referral.referral_status === "rejected" && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-red-800">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-700">{referral.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval Info */}
                {referral.approved_at &&
                  referral.referral_status === "approved" && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-green-800">
                            Approved on:
                          </p>
                          <p className="text-sm text-green-700">
                            {formatDate(referral.approved_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reject Referral
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject the referral from{" "}
              <span className="font-medium">
                {selectedReferral.affiliate_first_name}{" "}
                {selectedReferral.affiliate_last_name}
              </span>{" "}
              for{" "}
              <span className="font-medium">
                {selectedReferral.tutor_first_name}{" "}
                {selectedReferral.tutor_last_name}
              </span>
              ?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection (optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedReferral(null);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === selectedReferral.id}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === selectedReferral.id
                  ? "Rejecting..."
                  : "Reject Referral"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
