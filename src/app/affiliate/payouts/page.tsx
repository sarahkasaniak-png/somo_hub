// src/app/affiliate/payouts/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wallet,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronRight,
  RefreshCw,
  Plus,
  Banknote,
  Smartphone,
  CreditCard,
  Info,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import affiliateApi, { AffiliatePayout } from "@/lib/api/affiliate";

export default function AffiliatePayoutsPage() {
  const router = useRouter();
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [requestMethod, setRequestMethod] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [affiliateProfile, setAffiliateProfile] = useState<any>(null);

  useEffect(() => {
    fetchPayouts();
    fetchAffiliateProfile();
  }, [pagination.page]);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const response = await affiliateApi.getPayouts(pagination.page, 20);

      if (response.success && response.data) {
        // Safely get payouts array with fallback
        const payoutsData = response.data.data || [];
        setPayouts(payoutsData);
        setPagination({
          page: response.data.page || pagination.page,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 1,
        });

        // Calculate totals safely
        const paid = payoutsData
          .filter((p) => p?.payout_status === "completed")
          .reduce((sum, p) => sum + (p?.payout_amount || 0), 0);
        setTotalPaid(paid);
      } else {
        // Handle case where response is successful but no data
        setPayouts([]);
        setTotalPaid(0);
      }
    } catch (error) {
      console.error("Failed to fetch payouts:", error);
      toast.error("Failed to load payouts");
      setPayouts([]);
      setTotalPaid(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchAffiliateProfile = async () => {
    try {
      const response = await affiliateApi.getProfile();
      if (response.success && response.data) {
        setAffiliateProfile(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch affiliate profile:", error);
    }
  };

  const fetchPendingAmount = async () => {
    try {
      const response = await affiliateApi.getDashboard();
      if (response.success && response.data) {
        setPendingAmount(response.data.stats?.pending_amount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch pending amount:", error);
      setPendingAmount(0);
    }
  };

  const handleRequestPayout = async () => {
    const amountNum = parseFloat(requestAmount);

    if (!requestAmount || isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amountNum > pendingAmount) {
      toast.error("Request amount exceeds available balance");
      return;
    }

    if (amountNum < 1000) {
      toast.error("Minimum payout amount is KES 1,000");
      return;
    }

    if (!requestMethod) {
      toast.error("Please select a payout method");
      return;
    }

    setRequesting(true);
    try {
      const response = await affiliateApi.requestPayout({
        payout_method: requestMethod,
        payout_details: affiliateProfile?.payment_details || {},
      });

      // Check if response is successful and has data
      if (response.success && response.data) {
        toast.success(
          `Payout request of ${formatCurrency(response.data.amount)} submitted successfully!`,
        );
        setShowRequestModal(false);
        setRequestAmount("");
        setRequestMethod("");
        fetchPayouts();
        fetchPendingAmount();
      } else {
        // Handle case where response is successful but no data, or response has error
        toast.error("Failed to submit payout request. Please try again.");
      }
    } catch (error: any) {
      console.error("Failed to request payout:", error);
      // Check if error has a message property
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to submit payout request";
      toast.error(errorMessage);
    } finally {
      setRequesting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchPayouts(), fetchPendingAmount()]);
    setRefreshing(false);
    toast.success("Payouts refreshed");
  };

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return "KES 0";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "bank":
        return <CreditCard className="w-4 h-4" />;
      case "mobile_money":
        return <Smartphone className="w-4 h-4" />;
      case "paypal":
        return <Banknote className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case "bank":
        return "Bank Transfer";
      case "mobile_money":
        return "Mobile Money";
      case "paypal":
        return "PayPal";
      default:
        return method;
    }
  };

  useEffect(() => {
    fetchPendingAmount();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payouts</h1>
          <p className="text-gray-600 mt-1">
            Request and track your affiliate payouts
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            disabled={pendingAmount < 1000}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title={pendingAmount < 1000 ? "Minimum payout is KES 1,000" : ""}
          >
            <Plus className="w-4 h-4" />
            Request Payout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white">
          <p className="text-purple-100 text-sm">Available Balance</p>
          <p className="text-3xl font-bold mt-1 text-white">
            {formatCurrency(pendingAmount)}
          </p>
          <p className="text-purple-100 text-xs mt-2">
            Minimum payout: KES 1,000
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Total Paid</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {formatCurrency(totalPaid)}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Lifetime earnings paid out
          </p>
        </div>
      </div>

      {/* Payouts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Payout History</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : payouts.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No payouts yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Request your first payout when you have at least KES 1,000 in
              earnings
            </p>
            {pendingAmount >= 1000 && (
              <button
                onClick={() => setShowRequestModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                Request Payout
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payout.payout_status === "completed"
                            ? "bg-green-100"
                            : payout.payout_status === "failed"
                              ? "bg-red-100"
                              : "bg-yellow-100"
                        }`}
                      >
                        {getStatusIcon(payout.payout_status) || (
                          <Wallet
                            className={`w-5 h-5 ${
                              payout.payout_status === "completed"
                                ? "text-green-600"
                                : payout.payout_status === "failed"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(payout.payout_amount)}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payout.payout_status)}`}
                          >
                            {getStatusIcon(payout.payout_status)}
                            {payout.payout_status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            {getMethodIcon(payout.payout_method)}
                            {getMethodName(payout.payout_method)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Requested: {formatDate(payout.requested_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {payout.completed_at && (
                      <div className="mt-2 text-sm text-green-600">
                        Completed: {formatDate(payout.completed_at)}
                      </div>
                    )}

                    {payout.payout_reference && (
                      <div className="mt-1 text-xs text-gray-400 font-mono">
                        Ref: {payout.payout_reference}
                      </div>
                    )}

                    {payout.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        {payout.notes}
                      </div>
                    )}
                  </div>

                  {payout.payout_status === "pending" && (
                    <div className="flex items-center gap-1 text-yellow-600 text-sm">
                      <Clock className="w-4 h-4" />
                      Processing
                    </div>
                  )}
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

      {/* Request Payout Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Request Payout
              </h2>
              <p className="text-gray-600 mt-1">
                Withdraw your affiliate earnings
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {formatCurrency(pendingAmount)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (KES)
                </label>
                <input
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1000"
                  max={pendingAmount}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum payout: KES 1,000
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Method
                </label>
                <select
                  value={requestMethod}
                  onChange={(e) => setRequestMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select a method</option>
                  {affiliateProfile?.payment_method && (
                    <option value={affiliateProfile.payment_method}>
                      {getMethodName(affiliateProfile.payment_method)}
                    </option>
                  )}
                </select>
              </div>

              {!affiliateProfile?.payment_method && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    No payment method configured. Please{" "}
                    <Link
                      href="/affiliate/settings"
                      className="underline font-medium"
                    >
                      update your settings
                    </Link>{" "}
                    first.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestPayout}
                  disabled={
                    requesting ||
                    !affiliateProfile?.payment_method ||
                    parseFloat(requestAmount) > pendingAmount ||
                    parseFloat(requestAmount) < 1000 ||
                    !requestAmount
                  }
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {requesting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      Request Payout
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-800">
                  Payouts are processed within 3-5 business days after approval.
                  You'll receive a notification once your payout is completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
