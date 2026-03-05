// src/app/student/payments/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import studentApi from "@/lib/api/student";
import { formatDisplayName } from "@/lib/utils/format";
import {
  DollarSign,
  CreditCard,
  Calendar,
  Clock,
  ChevronRight,
  Download,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as ClockIcon,
  FileText,
  Eye,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Banknote,
  Smartphone,
  Landmark,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Info,
  Shield,
  Lock,
  HelpCircle,
  Plus,
  GraduationCap,
  User,
  Users,
  BookOpen,
} from "lucide-react";

interface Payment {
  id: number;
  reference: string;
  user_id: number;
  amount: number;
  currency: string;
  payment_type:
    | "tutor_onboarding"
    | "session_enrollment"
    | "community_membership"
    | "course_purchase";
  status: "pending" | "success" | "failed" | "refunded";
  paystack_reference?: string;
  metadata?: {
    session_id?: number;
    session_name?: string;
    course_id?: number;
    course_title?: string;
    enrollment_id?: number;
  };
  created_at: string;
  updated_at: string;

  // Joined fields
  session_name?: string;
  course_title?: string;
  enrollment_status?: string;
}

interface PaymentSummary {
  total_spent: number;
  total_payments: number;
  successful_payments: number;
  pending_payments: number;
  failed_payments: number;
  refunded_amount: number;
}
interface PaymentsResponse {
  success: boolean;
  data?: {
    payments: Payment[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export default function StudentPaymentsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>({
    total_spent: 0,
    total_payments: 0,
    successful_payments: 0,
    pending_payments: 0,
    failed_payments: 0,
    refunded_amount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [pagination.page, statusFilter, typeFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (typeFilter !== "all") {
        params.payment_type = typeFilter;
      }

      if (dateRange.from) {
        params.from_date = dateRange.from;
      }

      if (dateRange.to) {
        params.to_date = dateRange.to;
      }

      const response = (await studentApi.getPayments(
        params,
      )) as PaymentsResponse;

      if (response.success && response.data) {
        // Store data in a variable to avoid repeated optional chaining
        const data = response.data;

        setPayments(data.payments || []);
        setPagination({
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        });

        // Calculate summary
        const summaryData = calculateSummary(data.payments || []);
        setSummary(summaryData);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateSummary = (payments: Payment[]): PaymentSummary => {
    let totalSpent = 0;
    let successfulPayments = 0;
    let pendingPayments = 0;
    let failedPayments = 0;
    let refundedAmount = 0;

    payments.forEach((payment) => {
      if (payment.status === "success") {
        totalSpent += payment.amount;
        successfulPayments++;
      } else if (payment.status === "pending") {
        pendingPayments++;
      } else if (payment.status === "failed") {
        failedPayments++;
      } else if (payment.status === "refunded") {
        refundedAmount += payment.amount;
      }
    });

    return {
      total_spent: totalSpent,
      total_payments: payments.length,
      successful_payments: successfulPayments,
      pending_payments: pendingPayments,
      failed_payments: failedPayments,
      refunded_amount: refundedAmount,
    };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPayments();
    toast.success("Payments refreshed");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchPayments();
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleCopyReference = (reference: string) => {
    navigator.clipboard.writeText(reference);
    setCopiedRef(reference);
    setTimeout(() => setCopiedRef(null), 2000);
    toast.success("Reference copied to clipboard");
  };

  const formatCurrency = (amount: number, currency: string = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "pending":
        return <ClockIcon className="w-5 h-5 text-amber-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "refunded":
        return <RefreshCw className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "refunded":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case "session_enrollment":
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case "tutor_onboarding":
        return <User className="w-5 h-5 text-purple-600" />;
      case "community_membership":
        return <Users className="w-5 h-5 text-green-600" />;
      case "course_purchase":
        return <BookOpen className="w-5 h-5 text-orange-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case "session_enrollment":
        return "Session Enrollment";
      case "tutor_onboarding":
        return "Tutor Application";
      case "community_membership":
        return "Community Membership";
      case "course_purchase":
        return "Course Purchase";
      default:
        return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const paymentTypes = [
    { value: "all", label: "All Types" },
    { value: "session_enrollment", label: "Session Enrollment" },
    { value: "course_purchase", label: "Course Purchase" },
    { value: "community_membership", label: "Community Membership" },
    { value: "tutor_onboarding", label: "Tutor Application" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "success", label: "Successful" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  const summaryCards = [
    {
      title: "Total Spent",
      value: formatCurrency(summary.total_spent),
      icon: DollarSign,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      subtext: `${summary.successful_payments} successful payments`,
    },
    {
      title: "Pending Payments",
      value: summary.pending_payments,
      icon: ClockIcon,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      subtext: "Awaiting confirmation",
    },
    {
      title: "Failed Payments",
      value: summary.failed_payments,
      icon: XCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      subtext: "Need attention",
    },
    {
      title: "Refunded",
      value: formatCurrency(summary.refunded_amount),
      icon: RefreshCw,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      subtext: "Total refunded",
    },
  ];

  const handleDownloadReceipt = async (paymentId: number) => {
    try {
      await studentApi.downloadReceipt(paymentId);
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      toast.error("Failed to download receipt");
    }
  };

  const handleDownloadInvoice = async (paymentId: number) => {
    try {
      await studentApi.downloadInvoice(paymentId);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link
              href="/student/dashboard"
              className="hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Payments</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Payment History
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all your payments and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <Link
            href="/student/payments/methods"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Methods
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-gray-500">{card.title}</p>
                <div
                  className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {card.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="w-full lg:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                {paymentTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, from: e.target.value }))
                }
                className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                placeholder="From"
              />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, to: e.target.value }))
                }
                className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                placeholder="To"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {payment.reference}
                        </span>
                        <button
                          onClick={() => handleCopyReference(payment.reference)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy reference"
                        >
                          {copiedRef === payment.reference ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {payment.paystack_reference && (
                        <p className="text-xs text-gray-500 mt-1">
                          Paystack: {payment.paystack_reference}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getPaymentTypeIcon(payment.payment_type)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {getPaymentTypeLabel(payment.payment_type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {payment.course_title ||
                            payment.session_name ||
                            "Payment"}
                        </p>
                        {payment.metadata?.enrollment_id && (
                          <p className="text-xs text-gray-500 mt-1">
                            Enrollment ID: {payment.metadata.enrollment_id}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}
                      >
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {formatDate(payment.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Wallet className="w-12 h-12 text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No payments found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        You haven't made any payments yet
                      </p>
                      <Link
                        href="/courses"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Browse Courses
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} payments
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium">
                {pagination.page}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Payment Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedPayment.status)}`}
                  >
                    {getStatusIcon(selectedPayment.status)}
                    <span className="capitalize">{selectedPayment.status}</span>
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Amount</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(
                      selectedPayment.amount,
                      selectedPayment.currency,
                    )}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Reference</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPayment.reference}
                      </p>
                      <button
                        onClick={() =>
                          handleCopyReference(selectedPayment.reference)
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copiedRef === selectedPayment.reference ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Type</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center">
                        {getPaymentTypeIcon(selectedPayment.payment_type)}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {getPaymentTypeLabel(selectedPayment.payment_type)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(selectedPayment.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Currency</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {selectedPayment.currency}
                    </p>
                  </div>
                </div>

                {selectedPayment.paystack_reference && (
                  <div>
                    <p className="text-xs text-gray-500">Paystack Reference</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {selectedPayment.paystack_reference}
                    </p>
                  </div>
                )}
              </div>

              {/* Item Details */}
              {(selectedPayment.course_title ||
                selectedPayment.session_name) && (
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900">Item Details</h3>
                  <div>
                    {selectedPayment.course_title && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500">Course</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {selectedPayment.course_title}
                        </p>
                      </div>
                    )}
                    {selectedPayment.session_name && (
                      <div>
                        <p className="text-xs text-gray-500">Session</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {selectedPayment.session_name}
                        </p>
                      </div>
                    )}
                    {selectedPayment.metadata?.enrollment_id && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500">Enrollment ID</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {selectedPayment.metadata.enrollment_id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Receipt/Invoice Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownloadReceipt(selectedPayment.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Download Receipt
                </button>
                <button
                  onClick={() => handleDownloadInvoice(selectedPayment.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Receipt className="w-5 h-5" />
                  View Invoice
                </button>
              </div>

              {/* Support Link */}
              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Need help with this payment?
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    If you have any questions about this payment, please contact
                    our support team.
                  </p>
                  <Link
                    href="/support?category=payments"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium mt-2 hover:text-blue-700"
                  >
                    Contact Support
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
