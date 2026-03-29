// src/app/affiliate/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  TrendingUp,
  DollarSign,
  Users,
  Copy,
  Check,
  Wallet,
  Clock,
  Calendar,
  ChevronRight,
  Eye,
  Share2,
  Gift,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";
import affiliateApi, { AffiliateDashboard } from "@/lib/api/affiliate";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<AffiliateDashboard | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await affiliateApi.getDashboard();
      if (response.success && response.data) {
        // Ensure all arrays exist with fallbacks
        const data = {
          ...response.data,
          recent_referrals: response.data.recent_referrals || [],
          recent_commissions: response.data.recent_commissions || [],
          stats: {
            total_earnings: response.data.stats?.total_earnings || 0,
            total_paid: response.data.stats?.total_paid || 0,
            total_referred_tutors:
              response.data.stats?.total_referred_tutors || 0,
            total_referred_students:
              response.data.stats?.total_referred_students || 0,
            pending_commissions: response.data.stats?.pending_commissions || 0,
            pending_amount: response.data.stats?.pending_amount || 0,
            paid_amount: response.data.stats?.paid_amount || 0,
          },
          affiliate_code: response.data.affiliate_code || "",
          commission_rate: response.data.commission_rate || 5,
        };
        setDashboard(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  const copyToClipboard = () => {
    if (dashboard?.affiliate_code) {
      navigator.clipboard.writeText(dashboard.affiliate_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Affiliate code copied to clipboard!");
    }
  };

  const shareOnWhatsApp = () => {
    if (dashboard?.affiliate_code) {
      const message = `Join SomoHub as a tutor using my affiliate code: ${dashboard.affiliate_code}\n\nEarn 5% commission on your first 100 students!\nSign up here: ${window.location.origin}/onboarding/tutor?affiliate=${dashboard.affiliate_code}`;
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank",
      );
    }
  };

  const shareOnTwitter = () => {
    if (dashboard?.affiliate_code) {
      const text = `Become a tutor on @SomoHub and start teaching! Use my affiliate code: ${dashboard.affiliate_code} to get started. Earn 5% commission on your first 100 students! #SomoHub #TutorLife`;
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        "_blank",
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "paid":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome to Affiliate Program!
          </h2>
          <p className="text-gray-600 mb-6">
            Start earning by referring tutors to SomoHub. You'll get 5%
            commission on every student enrolled by tutors you refer.
          </p>
          <div className="space-y-3">
            <Link
              href="/affiliate/signup"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Become an Affiliate
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboard.stats;
  const recentReferrals = dashboard.recent_referrals || [];
  const recentCommissions = dashboard.recent_commissions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Affiliate Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track your referrals, commissions, and earnings
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Code
          </button>
        </div>
      </div>

      {/* Affiliate Code Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-purple-100 text-sm">Your Affiliate Code</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-mono font-bold tracking-wider">
                {dashboard.affiliate_code}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-purple-100 text-sm mt-2">
              Share this code with potential tutors. You'll earn{" "}
              {dashboard.commission_rate}% commission on their first 100
              students!
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={shareOnWhatsApp}
              className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 text-sm"
            >
              WhatsApp
            </button>
            <button
              onClick={shareOnTwitter}
              className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 text-sm"
            >
              Twitter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {formatCurrency(stats.total_earnings)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Paid:</span>
            <span className="text-sm font-medium text-green-600">
              {formatCurrency(stats.total_paid)}
            </span>
            <span className="text-sm text-gray-500 mx-2">|</span>
            <span className="text-sm text-gray-500">Pending:</span>
            <span className="text-sm font-medium text-amber-600">
              {formatCurrency(stats.pending_amount)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tutors Referred</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.total_referred_tutors}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link
            href="/affiliate/referrals"
            className="mt-4 text-sm text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students Enrolled</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.total_referred_students}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              From {stats.total_referred_tutors} tutor
              {stats.total_referred_tutors !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Commissions</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.pending_commissions}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-amber-600">
              {formatCurrency(stats.pending_amount)} waiting
            </span>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Referrals
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tutors who signed up using your affiliate code
            </p>
          </div>
          <Link
            href="/affiliate/referrals"
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentReferrals.length > 0 ? (
            recentReferrals.map((referral) => (
              <div
                key={referral.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {referral.first_name} {referral.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{referral.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.referral_status)}`}
                    >
                      {referral.referral_status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(referral.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No referrals yet</p>
              <p className="text-sm mt-1">
                Share your affiliate code to start earning!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Commissions
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your latest earnings from referred tutors
            </p>
          </div>
          <Link
            href="/affiliate/commissions"
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentCommissions.length > 0 ? (
            recentCommissions.map((commission) => (
              <div
                key={commission.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {commission.session_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Student: {commission.student_first_name}{" "}
                        {commission.student_last_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Tutor: {commission.tutor_first_name}{" "}
                        {commission.tutor_last_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      +{formatCurrency(commission.commission_amount)}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(commission.commission_status)}`}
                    >
                      {commission.commission_status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(commission.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No commissions yet</p>
              <p className="text-sm mt-1">
                Once your referred tutors start teaching, you'll earn
                commissions!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/affiliate/referrals"
          className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900">View Referrals</h3>
              <p className="text-sm text-gray-600 mt-1">
                Track all your referred tutors
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/affiliate/commissions"
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <DollarSign className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900">View Commissions</h3>
              <p className="text-sm text-gray-600 mt-1">
                See your earnings breakdown
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/affiliate/payouts"
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <Wallet className="w-8 h-8 text-amber-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Request Payout</h3>
              <p className="text-sm text-gray-600 mt-1">
                Withdraw your earnings
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                <Share2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Share Your Affiliate Code
              </h3>
              <p className="text-gray-600 mt-1">
                Share your code with potential tutors and start earning!
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-bold text-purple-600">
                  {dashboard.affiliate_code}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={shareOnWhatsApp}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                Share on WhatsApp
              </button>
              <button
                onClick={shareOnTwitter}
                className="w-full px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.465-11.438c0-.213-.005-.425-.014-.637A9.935 9.935 0 0024 4.59z" />
                </svg>
                Share on Twitter
              </button>
              <button
                onClick={() => {
                  copyToClipboard();
                  toast.success(
                    "Affiliate code copied! You can now share it manually.",
                  );
                }}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Code
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-800">
                  Share your affiliate code with tutors. You'll earn 5%
                  commission on every student they enroll (first 100 students
                  per tutor). Track your earnings in real-time!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
