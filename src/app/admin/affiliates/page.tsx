// src/app/admin/affiliates/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  UserPlus,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Users,
  ChevronRight,
  Mail,
  Ban,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminAffiliateApi from "@/lib/api/admin-affiliate";

interface Affiliate {
  id: number;
  user_id: number;
  affiliate_code: string;
  commission_rate: number;
  total_earnings: number | string;
  total_paid: number | string;
  total_referred_tutors: number;
  total_referred_students: number;
  is_active: boolean;
  email: string;
  first_name: string;
  last_name: string;
  referral_count: number;
  pending_commissions: number;
  created_at: string;
}

export default function AffiliatesPage() {
  const router = useRouter();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchAffiliates();
  }, [statusFilter, pagination.page]);

  const fetchAffiliates = async () => {
    setLoading(true);
    try {
      const response = await adminAffiliateApi.getAffiliates(
        pagination.page,
        20,
        statusFilter,
      );

      if (response.success && response.data) {
        // Parse numeric values from strings
        const parsedAffiliates = response.data.affiliates.map(
          (affiliate: any) => ({
            ...affiliate,
            id: parseInt(affiliate.id) || 0,
            total_earnings: parseFloat(affiliate.total_earnings) || 0,
            total_paid: parseFloat(affiliate.total_paid) || 0,
            commission_rate: parseFloat(affiliate.commission_rate) || 0,
            total_referred_tutors:
              parseInt(affiliate.total_referred_tutors) || 0,
            total_referred_students:
              parseInt(affiliate.total_referred_students) || 0,
          }),
        );

        setAffiliates(parsedAffiliates);
        setPagination({
          page: response.data.page,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      toast.error("Failed to load affiliates");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (
    affiliateId: number,
    currentStatus: boolean,
  ) => {
    if (!affiliateId || isNaN(affiliateId)) {
      console.error("Invalid affiliate ID:", affiliateId);
      toast.error("Invalid affiliate ID");
      return;
    }

    setActionLoading(affiliateId);
    try {
      const response = await adminAffiliateApi.updateAffiliateStatus(
        affiliateId,
        !currentStatus,
      );

      if (response.success) {
        toast.success(
          `Affiliate ${!currentStatus ? "activated" : "deactivated"} successfully`,
        );
        fetchAffiliates();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendCredentials = async (affiliateId: number) => {
    if (!affiliateId || isNaN(affiliateId)) {
      console.error("Invalid affiliate ID:", affiliateId);
      toast.error("Invalid affiliate ID");
      return;
    }

    setActionLoading(affiliateId);
    try {
      const response = await adminAffiliateApi.resendCredentials(affiliateId);
      if (response.success) {
        toast.success("Credentials resent successfully");
      } else {
        toast.error("Failed to resend credentials");
      }
    } catch (error) {
      console.error("Error resending credentials:", error);
      toast.error("Failed to resend credentials");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewAffiliate = (affiliateId: number) => {
    console.log(
      "Navigating to affiliate with ID:",
      affiliateId,
      "Type:",
      typeof affiliateId,
    );

    if (!affiliateId || isNaN(affiliateId) || affiliateId <= 0) {
      console.error("Invalid affiliate ID:", affiliateId);
      toast.error("Cannot view affiliate details - invalid ID");
      return;
    }

    // Use a direct string to ensure no NaN
    router.push(`/admin/affiliates/${affiliateId}`);
  };

  // Helper function to safely parse number
  const safeParseNumber = (value: any): number => {
    if (typeof value === "number" && !isNaN(value)) return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Calculate totals with safe parsing
  const totalEarnings = affiliates.reduce((sum, a) => {
    const earnings = safeParseNumber(a.total_earnings);
    return sum + earnings;
  }, 0);

  const totalReferrals = affiliates.reduce((sum, a) => {
    const referrals = safeParseNumber(a.total_referred_tutors);
    return sum + referrals;
  }, 0);

  const totalActive = affiliates.filter((a) => a.is_active).length;

  const filteredAffiliates = affiliates.filter(
    (aff) =>
      aff.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aff.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aff.affiliate_code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return "KES 0";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (isNaN(num)) return "0";
    return num.toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Affiliates</h1>
          <p className="text-gray-600 mt-1">
            Manage affiliate accounts and track performance
          </p>
        </div>
        <Link
          href="/admin/affiliates/create"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Create Affiliate
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(affiliates.length)}
              </p>
              <p className="text-sm text-gray-500">Total Affiliates</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(totalActive)}
              </p>
              <p className="text-sm text-gray-500">Active Affiliates</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(totalReferrals)}
              </p>
              <p className="text-sm text-gray-500">Total Referrals</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalEarnings)}
              </p>
              <p className="text-sm text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or affiliate code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "inactive"].map((status) => (
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
                  : status === "active"
                    ? "Active"
                    : "Inactive"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAffiliates.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No affiliates found</p>
            <Link
              href="/admin/affiliates/create"
              className="text-purple-600 hover:underline mt-2 inline-block"
            >
              Create your first affiliate
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affiliate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAffiliates.map((affiliate) => (
                  <tr
                    key={affiliate.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewAffiliate(affiliate.id)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {affiliate.first_name} {affiliate.last_name}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          {affiliate.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {affiliate.affiliate_code}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {affiliate.commission_rate}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {formatNumber(affiliate.total_referred_tutors)} tutors
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatNumber(affiliate.total_referred_students)}{" "}
                          students
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(
                            safeParseNumber(affiliate.total_earnings),
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          Paid:{" "}
                          {formatCurrency(
                            safeParseNumber(affiliate.total_paid),
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          affiliate.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {affiliate.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResendCredentials(affiliate.id);
                          }}
                          disabled={actionLoading === affiliate.id}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Resend credentials"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle(
                              affiliate.id,
                              affiliate.is_active,
                            );
                          }}
                          disabled={actionLoading === affiliate.id}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title={
                            affiliate.is_active ? "Deactivate" : "Activate"
                          }
                        >
                          {affiliate.is_active ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}
