// src/app/affiliate/commissions/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Search,
  TrendingUp,
  Calendar,
  ChevronRight,
  Eye,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import affiliateApi, { AffiliateCommission } from "@/lib/api/affiliate";

export default function AffiliateCommissionsPage() {
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [paidEarnings, setPaidEarnings] = useState(0);

  useEffect(() => {
    fetchCommissions();
  }, [pagination.page]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const response = await affiliateApi.getCommissions(pagination.page, 20);

      if (response.success && response.data) {
        // Safely get commissions data with fallback
        const commissionsData = response.data.data || [];
        setCommissions(commissionsData);
        setPagination({
          page: response.data.page || pagination.page,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 1,
        });

        // Calculate totals safely
        const total = commissionsData.reduce(
          (sum, c) => sum + (c?.commission_amount || 0),
          0,
        );
        const pending = commissionsData
          .filter((c) => c?.commission_status === "pending")
          .reduce((sum, c) => sum + (c?.commission_amount || 0), 0);
        const paid = commissionsData
          .filter((c) => c?.commission_status === "paid")
          .reduce((sum, c) => sum + (c?.commission_amount || 0), 0);

        setTotalEarnings(total);
        setPendingEarnings(pending);
        setPaidEarnings(paid);
      } else {
        // Handle case where response is successful but no data
        setCommissions([]);
        setTotalEarnings(0);
        setPendingEarnings(0);
        setPaidEarnings(0);
      }
    } catch (error) {
      console.error("Failed to fetch commissions:", error);
      toast.error("Failed to load commissions");
      setCommissions([]);
      setTotalEarnings(0);
      setPendingEarnings(0);
      setPaidEarnings(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCommissions();
    setRefreshing(false);
    toast.success("Commissions refreshed");
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
      });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  // Safe filtering - ensure commissions is an array
  const filteredCommissions = (commissions || []).filter((comm) => {
    if (!comm) return false;
    if (statusFilter !== "all" && comm.commission_status !== statusFilter)
      return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        comm.student_first_name?.toLowerCase().includes(search) ||
        comm.student_last_name?.toLowerCase().includes(search) ||
        comm.session_name?.toLowerCase().includes(search) ||
        comm.tutor_first_name?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Commissions</h1>
          <p className="text-gray-600 mt-1">
            Track your earnings from referred tutors
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white">
          <p className="text-purple-100 text-sm">Total Earnings</p>
          <p className="text-3xl font-bold mt-1 text-white">
            {formatCurrency(totalEarnings)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {formatCurrency(pendingEarnings)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Paid</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {formatCurrency(paidEarnings)}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, session, or tutor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "approved", "paid"].map((status) => (
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

      {/* Commissions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCommissions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No commissions yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Once your referred tutors start teaching, you'll earn commissions!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(commission.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {commission.student_first_name}{" "}
                        {commission.student_last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {commission.student_email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {commission.session_name}
                      </p>
                      {commission.student_number && (
                        <p className="text-xs text-gray-500">
                          Student #{commission.student_number}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {commission.tutor_first_name}{" "}
                        {commission.tutor_last_name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatCurrency(commission.enrollment_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-green-600">
                        +{formatCurrency(commission.commission_amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ({commission.commission_rate}%)
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(commission.commission_status)}`}
                      >
                        {commission.commission_status.toUpperCase()}
                      </span>
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
