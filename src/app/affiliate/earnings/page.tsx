// src/app/affiliate/earnings/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import affiliateApi from "@/lib/api/affiliate";

export default function AffiliateEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [earnings, setEarnings] = useState<any>(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await affiliateApi.getDashboard();
      if (response.success && response.data) {
        setEarnings(response.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
      toast.error("Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEarnings();
    setRefreshing(false);
    toast.success("Earnings refreshed");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Earnings Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Track your affiliate earnings and performance
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold mt-1 text-white">
                {formatCurrency(earnings?.total_earnings || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm">Paid</p>
            <p className="text-xl font-bold text-green-600 mt-1">
              {formatCurrency(earnings?.total_paid || 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-xl font-bold text-yellow-600 mt-1">
              {formatCurrency(earnings?.pending_amount || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {earnings?.total_referred_tutors || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600">Tutors Referred</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {earnings?.total_referred_students || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600">Students Enrolled</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {earnings?.pending_commissions || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600">Pending Commissions</p>
        </div>
      </div>

      {/* Commission Rate Info */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Commission Structure
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              You earn <strong className="text-amber-600">5% commission</strong>{" "}
              on every student enrolled by tutors you refer. This applies to the
              first 100 students per tutor.
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-500">Commission Rate:</span>
                <span className="font-semibold text-amber-600 ml-1">5%</span>
              </div>
              <div>
                <span className="text-gray-500">Per Student Cap:</span>
                <span className="font-semibold text-gray-900 ml-1">
                  100 students/tutor
                </span>
              </div>
              <div>
                <span className="text-gray-500">Payout Threshold:</span>
                <span className="font-semibold text-gray-900 ml-1">
                  KES 1,000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Example Earnings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Earnings Example</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Session Fee</p>
                <p className="text-sm text-gray-500">Average session price</p>
              </div>
              <p className="font-semibold text-gray-900">KES 5,000</p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Commission (5%)</p>
                <p className="text-sm text-gray-500">Per student enrollment</p>
              </div>
              <p className="font-semibold text-green-600">KES 250</p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">100 Students</p>
                <p className="text-sm text-gray-500">Maximum per tutor</p>
              </div>
              <p className="font-semibold text-purple-600">KES 25,000</p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="font-medium text-gray-900">Potential Earnings</p>
                <p className="text-sm text-gray-500">
                  Per referred tutor (max)
                </p>
              </div>
              <p className="text-xl font-bold text-purple-600">KES 25,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>
            • Share your affiliate code on social media and teaching forums
          </li>
          <li>• Encourage referred tutors to share their success stories</li>
          <li>
            • Track your referrals regularly to see which channels work best
          </li>
          <li>• Set up your payment method to receive payouts faster</li>
          <li>• Refer more tutors to increase your passive income</li>
        </ul>
      </div>
    </div>
  );
}
