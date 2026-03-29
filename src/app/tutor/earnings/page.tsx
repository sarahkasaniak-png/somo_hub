// src/app/tutor/earnings/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { KenyanBanksDropdown } from "@/components/kenyan-banks-dropdown";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Banknote,
  Clock,
  Star,
  BarChart3,
  PieChart,
  LineChart,
  DownloadCloud,
  Plus,
  MoreVertical,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  CalendarDays,
  CreditCard,
  Smartphone,
  Landmark,
  Globe,
  X,
  ChevronRight,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import tutorEarningsApi, {
  EarningsOverview,
  PeriodEarning,
  SessionEarning, // Changed from CourseEarning
  RecentPayout,
  PaymentSummary,
  WithdrawalMethod,
} from "@/lib/api/tutor-earnings";

const COLORS = [
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#6366F1",
];

export default function TutorEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<EarningsOverview | null>(null);
  const [periodEarnings, setPeriodEarnings] = useState<PeriodEarning[]>([]);
  const [sessionEarnings, setSessionEarnings] = useState<SessionEarning[]>([]); // Renamed from courseEarnings
  const [recentPayouts, setRecentPayouts] = useState<RecentPayout[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(
    null,
  );
  const [withdrawalMethods, setWithdrawalMethods] = useState<
    WithdrawalMethod[]
  >([]);

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("");
  const [payoutDetails, setPayoutDetails] = useState({});
  const [selectedMethodType, setSelectedMethodType] = useState<
    "bank" | "mobile_money" | "paypal"
  >("bank");

  const [newMethod, setNewMethod] = useState({
    method_type: "bank" as "bank" | "mobile_money" | "paypal",
    account_name: "",
    account_number: "",
    bank_name: "",
    bank_code: "",
    branch_code: "",
    swift_code: "",
    mobile_number: "",
    provider: "",
    is_default: false,
  });

  useEffect(() => {
    fetchEarningsData();
  }, [selectedPeriod]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);

      // Fetch all earnings data in parallel
      const [
        overviewRes,
        periodRes,
        sessionRes, // Renamed from courseRes
        recentRes,
        summaryRes,
        methodsRes,
      ] = await Promise.all([
        tutorEarningsApi.getOverview(),
        tutorEarningsApi.getByPeriod(selectedPeriod),
        tutorEarningsApi.getBySession(), // Changed from getByCourse
        tutorEarningsApi.getRecentPayouts(10),
        tutorEarningsApi.getPaymentSummary(),
        tutorEarningsApi.getWithdrawalMethods(),
      ]);

      if (overviewRes.success && overviewRes.data) {
        setOverview(overviewRes.data);
      }
      if (periodRes.success && periodRes.data) {
        setPeriodEarnings(periodRes.data);
      }
      if (sessionRes.success && sessionRes.data) {
        setSessionEarnings(sessionRes.data);
      }
      if (recentRes.success && recentRes.data) {
        setRecentPayouts(recentRes.data);
      }
      if (summaryRes.success && summaryRes.data) {
        setPaymentSummary(summaryRes.data);
      }
      if (methodsRes.success && methodsRes.data) {
        setWithdrawalMethods(methodsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch earnings data:", error);
      toast.error("Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    try {
      if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      if (!payoutMethod) {
        toast.error("Please select a payout method");
        return;
      }

      const response = await tutorEarningsApi.requestPayout({
        amount: parseFloat(payoutAmount),
        method: payoutMethod,
        details: payoutDetails,
      });

      if (response.success) {
        toast.success("Payout requested successfully!");
        setShowPayoutModal(false);
        setPayoutAmount("");
        fetchEarningsData(); // Refresh data
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to request payout");
    }
  };

  const handleAddWithdrawalMethod = async () => {
    try {
      // Validate based on method type
      if (selectedMethodType === "bank") {
        if (
          !newMethod.account_name ||
          !newMethod.account_number ||
          !newMethod.bank_name
        ) {
          toast.error("Please fill all bank account details");
          return;
        }
      } else if (selectedMethodType === "mobile_money") {
        if (
          !newMethod.account_name ||
          !newMethod.mobile_number ||
          !newMethod.provider
        ) {
          toast.error("Please fill all mobile money details");
          return;
        }

        // Only allow M-PESA for now
        if (newMethod.provider !== "M-PESA") {
          toast.error("Only M-PESA is available at this time");
          return;
        }
      } else if (selectedMethodType === "paypal") {
        toast.error("PayPal withdrawals are coming soon");
        return;
      }

      const response = await tutorEarningsApi.addWithdrawalMethod({
        ...newMethod,
        method_type: selectedMethodType,
      });

      if (response.success) {
        toast.success("Withdrawal method added successfully!");
        setShowWithdrawalModal(false);
        setNewMethod({
          method_type: "bank",
          account_name: "",
          account_number: "",
          bank_name: "",
          bank_code: "",
          branch_code: "",
          swift_code: "",
          mobile_number: "",
          provider: "",
          is_default: false,
        });
        fetchEarningsData();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add withdrawal method");
    }
  };

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return "KES 0";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGrowthIcon = (growth?: number) => {
    if (!growth) return null;
    if (growth > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (growth < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Landmark className="w-5 h-5" />;
      case "mobile_money":
        return <Smartphone className="w-5 h-5" />;
      case "paypal":
        return <Globe className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  // Custom tooltip formatter for charts
  const tooltipFormatter = (value: any) => {
    if (typeof value === "number") {
      return formatCurrency(value);
    }
    return value;
  };

  // Custom label formatter for axis
  const axisFormatter = (value: any) => {
    if (typeof value === "number") {
      return `KES ${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-main/20 border-t-main rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-main animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <Link
                href="/tutor/dashboard"
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Earnings</span>
            </div>
            <h1 className="text-2xl sm:text-2xl font-semibold text-gray-900">
              Earnings
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Track your income, manage payouts, and analyze your earnings from
              tutoring sessions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Method
            </button>
            <button
              onClick={() => setShowPayoutModal(true)}
              disabled={!overview || (overview.total_earned || 0) < 1000}
              className="px-4 py-2 bg-main text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="w-4 h-4" />
              Request Payout
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earned</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {formatCurrency(overview.total_earned)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Pending:</span>
                <span className="text-sm font-medium text-amber-600">
                  {formatCurrency(overview.pending_earnings)}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {formatCurrency(overview.this_month_earnings)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Avg per session:</span>
                <span className="text-sm font-medium text-blue-600">
                  {formatCurrency(overview.average_per_session)}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {overview.total_students}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Avg per student:</span>
                <span className="text-sm font-medium text-purple-600">
                  {formatCurrency(overview.average_per_student)}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {overview.completion_rate || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    {overview.average_rating
                      ? Number(overview.average_rating).toFixed(1)
                      : "0.0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earnings Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Earnings Trend
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-main focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={periodEarnings}>
                  <defs>
                    <linearGradient
                      id="colorEarnings"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="period"
                    stroke="#6B7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={axisFormatter}
                  />
                  <Tooltip
                    formatter={tooltipFormatter}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="total_amount"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                    name="Earnings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Earnings by Session */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Earnings by Session
            </h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={sessionEarnings}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="total_earned"
                    nameKey="session_name"
                  >
                    {sessionEarnings.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={tooltipFormatter} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
              {sessionEarnings.slice(0, 5).map((session, index) => (
                <div
                  key={session.session_id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-700 truncate max-w-[150px]">
                      {session.session_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {(session.percentage || 0).toFixed(1)}%
                    </span>
                    <span className="text-gray-500">
                      {formatCurrency(session.total_earned)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Session Performance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupancy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg/Student
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessionEarnings.map((session) => (
                  <tr key={session.session_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {session.session_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {session.session_code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {session.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      {session.session_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {session.student_count} / {session.max_capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-main rounded-full"
                            style={{ width: `${session.occupancy_rate || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {(session.occupancy_rate || 0).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(session.total_earned)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(session.average_per_student)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions and Withdrawal Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h2>
              <Link
                href="/tutor/earnings/history"
                className="text-sm text-main hover:text-purple-700"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentPayouts.map((payout) => (
                <div
                  key={payout.enrollment_id}
                  className="p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {payout.student_email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {payout.subject} • {payout.session_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(payout.payment_amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payout.payment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {recentPayouts.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No recent transactions found
                </div>
              )}
            </div>
          </div>

          {/* Withdrawal Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Withdrawal Methods
              </h2>
              <button
                onClick={() => setShowWithdrawalModal(true)}
                className="text-sm text-main hover:text-purple-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {withdrawalMethods.map((method) => (
                <div key={method.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {getMethodIcon(method.method_type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {method.account_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {method.method_type === "bank" &&
                            `${method.bank_name} • ${method.account_number}`}
                          {method.method_type === "mobile_money" &&
                            `${method.provider} • ${method.mobile_number}`}
                          {method.method_type === "paypal" &&
                            method.account_number}
                        </p>
                      </div>
                    </div>
                    {method.is_default && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {withdrawalMethods.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>No withdrawal methods added yet</p>
                  <button
                    onClick={() => setShowWithdrawalModal(true)}
                    className="mt-2 text-main hover:text-purple-700"
                  >
                    Add your first method
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payout Modal */}
        {showPayoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setShowPayoutModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Request Payout
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Balance
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(overview?.total_earned)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Withdraw (KES)
                  </label>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    min="1000"
                    max={overview?.total_earned}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="Enter amount"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum withdrawal: KES 1,000
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Withdrawal Method
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  >
                    <option value="">Select a method</option>
                    {withdrawalMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.method_type === "bank" &&
                          `${method.bank_name} - ${method.account_number}`}
                        {method.method_type === "mobile_money" &&
                          `${method.provider} - ${method.mobile_number}`}
                        {method.method_type === "paypal" &&
                          `PayPal - ${method.account_number}`}
                        {method.is_default && " (Default)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestPayout}
                    className="flex-1 px-4 py-3 bg-main text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Request Payout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Withdrawal Method Modal */}
        {showWithdrawalModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Add Withdrawal Method
              </h3>

              <div className="space-y-4">
                {/* Method Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Method Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethodType("bank")}
                      className={`p-3 border rounded-lg flex flex-col items-center gap-2 ${
                        selectedMethodType === "bank"
                          ? "border-main bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Landmark
                        className={`w-5 h-5 ${selectedMethodType === "bank" ? "text-main" : "text-gray-600"}`}
                      />
                      <span className="text-xs">Bank</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethodType("mobile_money")}
                      className={`p-3 border rounded-lg flex flex-col items-center gap-2 ${
                        selectedMethodType === "mobile_money"
                          ? "border-main bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Smartphone
                        className={`w-5 h-5 ${selectedMethodType === "mobile_money" ? "text-main" : "text-gray-600"}`}
                      />
                      <span className="text-xs">Mobile Money</span>
                    </button>

                    <button
                      type="button"
                      disabled
                      className="p-3 border border-gray-200 rounded-lg flex flex-col items-center gap-2 opacity-50 cursor-not-allowed relative group"
                      title="PayPal coming soon"
                    >
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span className="text-xs">PayPal</span>
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        Soon
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMethod.account_name}
                    onChange={(e) =>
                      setNewMethod({
                        ...newMethod,
                        account_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="Full name on account"
                  />
                </div>

                {/* Bank Form */}
                {selectedMethodType === "bank" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                      <KenyanBanksDropdown
                        value={newMethod.bank_name}
                        onChange={(bankName, bankCode, swiftCode) => {
                          setNewMethod({
                            ...newMethod,
                            bank_name: bankName,
                            bank_code: bankCode,
                            swift_code: swiftCode,
                          });
                        }}
                        placeholder="Search and select your bank..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newMethod.account_number}
                        onChange={(e) =>
                          setNewMethod({
                            ...newMethod,
                            account_number: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        placeholder="Enter account number"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Code
                        </label>
                        <input
                          type="text"
                          value={newMethod.bank_code}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                          placeholder="Auto-filled"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Branch Code
                        </label>
                        <input
                          type="text"
                          value={newMethod.branch_code}
                          onChange={(e) =>
                            setNewMethod({
                              ...newMethod,
                              branch_code: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SWIFT Code
                      </label>
                      <input
                        type="text"
                        value={newMethod.swift_code}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        placeholder="Auto-filled for international transfers"
                      />
                    </div>
                  </>
                )}

                {/* Mobile Money Form */}
                {selectedMethodType === "mobile_money" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provider <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newMethod.provider}
                        onChange={(e) =>
                          setNewMethod({
                            ...newMethod,
                            provider: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      >
                        <option value="">Select provider</option>
                        <option value="M-PESA">M-PESA</option>
                        <option
                          value="Airtel Money"
                          disabled
                          className="text-gray-400"
                        >
                          Airtel Money (Coming Soon)
                        </option>
                        <option
                          value="T-Kash"
                          disabled
                          className="text-gray-400"
                        >
                          T-Kash (Coming Soon)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={newMethod.mobile_number}
                        onChange={(e) =>
                          setNewMethod({
                            ...newMethod,
                            mobile_number: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        placeholder="e.g., 0712345678"
                      />
                    </div>
                  </>
                )}

                {/* PayPal Form - Disabled */}
                {selectedMethodType === "paypal" && (
                  <div className="space-y-4 opacity-60">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayPal Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value={newMethod.account_number}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        placeholder="PayPal temporarily unavailable"
                      />
                    </div>
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                      ⚠️ PayPal withdrawals are coming soon. Please check back
                      later.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newMethod.is_default}
                    onChange={(e) =>
                      setNewMethod({
                        ...newMethod,
                        is_default: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-main focus:ring-main"
                  />
                  <label htmlFor="isDefault" className="text-sm text-gray-700">
                    Set as default withdrawal method
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawalModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddWithdrawalMethod}
                    className="flex-1 px-4 py-3 bg-main text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Method
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
