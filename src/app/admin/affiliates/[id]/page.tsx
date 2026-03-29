// src/app/admin/affiliates/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Copy,
  Edit,
  Ban,
  Check,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminAffiliateApi from "@/lib/api/admin-affiliate";

interface AffiliateDetails {
  affiliate: {
    id: number;
    user_id: number;
    affiliate_code: string;
    commission_rate: number;
    total_earnings: number;
    total_paid: number;
    total_referred_tutors: number;
    total_referred_students: number;
    is_active: boolean;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
  };
  referrals: any[];
  commissions: any[];
  payouts: any[];
}

export default function AffiliateDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const [data, setData] = useState<AffiliateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "referrals" | "commissions" | "payouts"
  >("referrals");
  const [showEditRateModal, setShowEditRateModal] = useState(false);
  const [newRate, setNewRate] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [affiliateId, setAffiliateId] = useState<number | null>(null);

  // Handle params properly for Next.js 15+
  useEffect(() => {
    const unwrapParams = async () => {
      try {
        // params can be a Promise in Next.js 15+
        const unwrappedParams =
          params instanceof Promise ? await params : params;
        const id = unwrappedParams?.id;

        console.log("Raw params:", params);
        console.log("Unwrapped params:", unwrappedParams);
        console.log("ID from params:", id);

        if (id) {
          const parsedId = parseInt(id);
          if (!isNaN(parsedId) && parsedId > 0) {
            setAffiliateId(parsedId);
            console.log("Set affiliate ID to:", parsedId);
          } else {
            console.error("Invalid affiliate ID:", id);
            toast.error("Invalid affiliate ID");
          }
        } else {
          console.error("No ID found in params");
          toast.error("Invalid affiliate ID");
        }
      } catch (error) {
        console.error("Error unwrapping params:", error);
        toast.error("Failed to load affiliate ID");
      }
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (affiliateId) {
      console.log("Fetching affiliate details for ID:", affiliateId);
      fetchAffiliateDetails();
    }
  }, [affiliateId]);

  const fetchAffiliateDetails = async () => {
    if (!affiliateId) {
      console.error("No affiliate ID available to fetch");
      return;
    }

    setLoading(true);
    try {
      console.log("Calling API with ID:", affiliateId);
      const response = await adminAffiliateApi.getAffiliateDetails(affiliateId);

      console.log("API Response:", response);

      if (response.success && response.data) {
        setData(response.data);
      } else {
        toast.error("Failed to load affiliate details");
      }
    } catch (error) {
      console.error("Error fetching affiliate details:", error);
      toast.error("Failed to load affiliate details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!affiliateId || !data) return;
    setActionLoading(true);
    try {
      const response = await adminAffiliateApi.updateAffiliateStatus(
        affiliateId,
        !data.affiliate.is_active,
      );

      if (response.success) {
        toast.success(
          `Affiliate ${!data.affiliate.is_active ? "activated" : "deactivated"} successfully`,
        );
        fetchAffiliateDetails();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCommissionRate = async () => {
    if (!affiliateId || !data || !newRate) return;
    setActionLoading(true);
    try {
      const rate = parseFloat(newRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        toast.error("Commission rate must be between 0 and 100");
        return;
      }

      const response = await adminAffiliateApi.updateCommissionRate(
        affiliateId,
        rate,
      );

      if (response.success) {
        toast.success("Commission rate updated successfully");
        setShowEditRateModal(false);
        fetchAffiliateDetails();
      } else {
        toast.error("Failed to update commission rate");
      }
    } catch (error) {
      console.error("Error updating commission rate:", error);
      toast.error("Failed to update commission rate");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendCredentials = async () => {
    if (!affiliateId || !data) return;
    setActionLoading(true);
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
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return "KES 0";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Affiliate not found</p>
        <Link
          href="/admin/affiliates"
          className="text-purple-600 hover:underline mt-2 inline-block"
        >
          Back to affiliates
        </Link>
      </div>
    );
  }

  const { affiliate } = data;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/affiliates"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to affiliates
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {affiliate.first_name} {affiliate.last_name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-600">{affiliate.email}</p>
              <button
                onClick={() => copyToClipboard(affiliate.affiliate_code)}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
              >
                <Copy className="w-3 h-3" />
                {affiliate.affiliate_code}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleResendCredentials}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Resend Credentials
            </button>
            <button
              onClick={() => setShowEditRateModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Rate
            </button>
            <button
              onClick={handleStatusToggle}
              disabled={actionLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                affiliate.is_active
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {affiliate.is_active ? (
                <>
                  <Ban className="w-4 h-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Activate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {affiliate.total_referred_tutors}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Tutors Referred</p>
          <p className="text-xs text-gray-400">
            {affiliate.total_referred_students} students
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(affiliate.total_earnings)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total Earnings</p>
          <p className="text-xs text-gray-400">
            Paid: {formatCurrency(affiliate.total_paid)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {affiliate.commission_rate}%
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Commission Rate</p>
          <p className="text-xs text-gray-400">
            On first 100 students per tutor
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {new Date(affiliate.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Joined</p>
        </div>
      </div>

      {/* Tabs - Keep the same as before */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {(["referrals", "commissions", "payouts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content - Keep the same as before */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === "referrals" && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Referred Tutors</h2>
            </div>
            {data.referrals.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No referrals yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {data.referrals.map((ref) => (
                  <div key={ref.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {ref.first_name} {ref.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{ref.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              ref.referral_status === "approved"
                                ? "bg-green-100 text-green-800"
                                : ref.referral_status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {ref.referral_status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">
                            Applied:{" "}
                            {new Date(
                              ref.application_date,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {ref.referral_status === "pending" && (
                        <Link
                          href={`/admin/tutors/applications/${ref.referred_tutor_id}`}
                          className="text-purple-600 hover:text-purple-700 text-sm"
                        >
                          Review Application
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "commissions" && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Commission History
              </h2>
            </div>
            {data.commissions.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No commissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Tutor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Session
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.commissions.map((comm) => (
                      <tr key={comm.id}>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(comm.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {comm.tutor_first_name} {comm.tutor_last_name}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {comm.student_first_name} {comm.student_last_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {comm.session_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          KES {comm.enrollment_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                          KES {comm.commission_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              comm.commission_status === "paid"
                                ? "bg-green-100 text-green-800"
                                : comm.commission_status === "approved"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {comm.commission_status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "payouts" && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Payout History</h2>
            </div>
            {data.payouts.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payouts yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {data.payouts.map((payout) => (
                  <div key={payout.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-gray-900">
                            KES {payout.payout_amount.toLocaleString()}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              payout.payout_status === "completed"
                                ? "bg-green-100 text-green-800"
                                : payout.payout_status === "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : payout.payout_status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {payout.payout_status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Method:{" "}
                          {payout.payout_method.replace("_", " ").toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400">
                          Requested:{" "}
                          {new Date(payout.requested_at).toLocaleString()}
                        </p>
                        {payout.completed_at && (
                          <p className="text-xs text-gray-400">
                            Completed:{" "}
                            {new Date(payout.completed_at).toLocaleString()}
                          </p>
                        )}
                        {payout.payout_reference && (
                          <p className="text-xs text-gray-400 font-mono mt-1">
                            Ref: {payout.payout_reference}
                          </p>
                        )}
                      </div>
                      {payout.payout_status === "pending" && (
                        <Link
                          href={`/admin/affiliates/payouts/${payout.id}`}
                          className="text-purple-600 hover:text-purple-700 text-sm"
                        >
                          Process Payout
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Commission Rate Modal */}
      {showEditRateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Commission Rate
            </h2>
            <p className="text-gray-600 mb-4">
              Current rate: {affiliate.commission_rate}%
            </p>
            <input
              type="number"
              step="0.5"
              min="0"
              max="100"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="Enter new commission rate"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditRateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCommissionRate}
                disabled={actionLoading || !newRate}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
