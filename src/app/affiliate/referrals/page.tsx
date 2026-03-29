// src/app/affiliate/referrals/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  ChevronRight,
  Eye,
  Calendar,
  RefreshCw,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";
import affiliateApi, { AffiliateReferral } from "@/lib/api/affiliate";

export default function AffiliateReferralsPage() {
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, [pagination.page]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const response = await affiliateApi.getReferrals(pagination.page, 20);

      if (response.success && response.data) {
        // Safely get referrals data with fallback
        const referralsData = response.data.data || [];
        setReferrals(referralsData);
        setPagination({
          page: response.data.page || pagination.page,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 1,
        });
      } else {
        // Handle case where response is successful but no data
        setReferrals([]);
      }
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
      toast.error("Failed to load referrals");
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReferrals();
    setRefreshing(false);
    toast.success("Referrals refreshed");
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Safe filtering - ensure referrals is an array
  const filteredReferrals = (referrals || []).filter((ref) => {
    if (!ref) return false;
    if (statusFilter !== "all" && ref.referral_status !== statusFilter)
      return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        ref.first_name?.toLowerCase().includes(search) ||
        ref.last_name?.toLowerCase().includes(search) ||
        ref.email?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // Safe stats calculation
  const stats = {
    total: (referrals || []).length,
    pending: (referrals || []).filter((r) => r?.referral_status === "pending")
      .length,
    approved: (referrals || []).filter((r) => r?.referral_status === "approved")
      .length,
    rejected: (referrals || []).filter((r) => r?.referral_status === "rejected")
      .length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Referrals</h1>
          <p className="text-gray-600 mt-1">
            Track all tutors who signed up using your affiliate code
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw
            className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Referrals</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
              <p className="text-sm text-gray-500">Approved</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
              <p className="text-sm text-gray-500">Rejected</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tutor name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((status) => (
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
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No referrals found</p>
            <p className="text-sm text-gray-400 mt-1">
              Share your affiliate code to start earning!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReferrals.map((referral) => (
              <div
                key={referral.id}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">
                          {referral.first_name?.[0]}
                          {referral.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900">
                            {referral.first_name} {referral.last_name}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(referral.referral_status)}`}
                          >
                            {getStatusIcon(referral.referral_status)}
                            {referral.referral_status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Mail className="w-3 h-3" />
                          {referral.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Applied: {formatDate(referral.created_at)}
                      </span>
                      {referral.application_status && (
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Status: {referral.application_status}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/tutors/${referral.referred_tutor_id}`}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
