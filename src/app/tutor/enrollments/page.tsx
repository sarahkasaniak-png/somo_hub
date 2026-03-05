// src/app/tutor/enrollments/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi from "@/lib/api/tutor";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  UserCheck,
  UserX,
  Clock3,
  Download,
  Eye,
  MoreHorizontal,
  Loader2,
  BookOpen,
  GraduationCap,
  ArrowUpDown,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  FileText,
  Mail,
  Phone,
  CalendarDays,
  CreditCard,
  Wallet,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Home,
  ChevronRight,
} from "lucide-react";

interface Enrollment {
  id: number;
  tutor_course_session_id: number;
  student_id: number;
  enrollment_status:
    | "pending"
    | "active"
    | "completed"
    | "dropped"
    | "suspended";
  payment_status: "pending" | "paid" | "partial" | "refunded";
  payment_amount: number;
  payment_reference: string | null;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
  classes_attended: number;
  total_classes: number;
  last_accessed_at: string | null;
  notes: string | null;
  // Joined fields
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
    phone: string | null;
  };
  session?: {
    id: number;
    name: string;
    session_code: string;
    start_date: string;
    end_date: string;
    max_students: number;
    fee_amount: number;
    fee_currency: string;
    course: {
      id: number;
      title: string;
      subject: string;
    };
  };
}

export default function TutorEnrollmentsPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedEnrollments, setSelectedEnrollments] = useState<number[]>([]);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [sortField, setSortField] = useState<
    "enrolled_at" | "student_name" | "progress"
  >("enrolled_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
    dropped: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
  });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      // You'll need to add this endpoint to your tutorApi
      const response = await tutorApi.getAllEnrollments();
      if (response.success) {
        setEnrollments(response.data.enrollments);
        calculateStats(response.data.enrollments);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
      toast.error("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (enrollmentsList: Enrollment[]) => {
    const stats = {
      total: enrollmentsList.length,
      active: enrollmentsList.filter((e) => e.enrollment_status === "active")
        .length,
      pending: enrollmentsList.filter((e) => e.enrollment_status === "pending")
        .length,
      completed: enrollmentsList.filter(
        (e) => e.enrollment_status === "completed",
      ).length,
      dropped: enrollmentsList.filter(
        (e) =>
          e.enrollment_status === "dropped" ||
          e.enrollment_status === "suspended",
      ).length,
      totalRevenue: enrollmentsList
        .filter((e) => e.payment_status === "paid")
        .reduce((sum, e) => sum + e.payment_amount, 0),
      pendingRevenue: enrollmentsList
        .filter((e) => e.payment_status === "pending")
        .reduce((sum, e) => sum + e.payment_amount, 0),
    };
    setStats(stats);
  };

  const handleStatusUpdate = async (
    enrollmentId: number,
    newStatus: string,
  ) => {
    try {
      const response = await tutorApi.updateEnrollmentStatus(enrollmentId, {
        status: newStatus,
      });
      if (response.success) {
        toast.success(`Enrollment ${newStatus} successfully`);
        fetchEnrollments();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedEnrollments.length === 0) {
      toast.error("Please select at least one enrollment");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to ${action} ${selectedEnrollments.length} enrollment(s)?`,
      )
    ) {
      return;
    }

    try {
      const response = await tutorApi.bulkUpdateEnrollments({
        enrollment_ids: selectedEnrollments,
        action: action,
      });
      if (response.success) {
        toast.success(
          `Successfully updated ${selectedEnrollments.length} enrollments`,
        );
        setSelectedEnrollments([]);
        setBulkActionMode(false);
        fetchEnrollments();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update enrollments");
    }
  };

  const toggleSelectAll = () => {
    if (selectedEnrollments.length === filteredEnrollments.length) {
      setSelectedEnrollments([]);
    } else {
      setSelectedEnrollments(filteredEnrollments.map((e) => e.id));
    }
  };

  const toggleSelect = (enrollmentId: number) => {
    if (selectedEnrollments.includes(enrollmentId)) {
      setSelectedEnrollments(
        selectedEnrollments.filter((id) => id !== enrollmentId),
      );
    } else {
      setSelectedEnrollments([...selectedEnrollments, enrollmentId]);
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock3 className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "dropped":
        return <XCircle className="w-4 h-4" />;
      case "suspended":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "dropped":
        return "bg-red-50 text-red-700 border-red-200";
      case "suspended":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "partial":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "refunded":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStudentName = (enrollment: Enrollment) => {
    if (enrollment.student) {
      return (
        `${enrollment.student.first_name || ""} ${enrollment.student.last_name || ""}`.trim() ||
        `Student #${enrollment.student_id}`
      );
    }
    return `Student #${enrollment.student_id}`;
  };

  const getStudentEmail = (enrollment: Enrollment) => {
    return enrollment.student?.email || "No email";
  };

  const filteredEnrollments = enrollments
    .filter((enrollment) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const studentName = getStudentName(enrollment).toLowerCase();
        const studentEmail = getStudentEmail(enrollment).toLowerCase();
        const sessionName = enrollment.session?.name.toLowerCase() || "";
        // Update this line to use nested course object
        const courseTitle =
          enrollment.session?.course?.title.toLowerCase() || "";

        return (
          studentName.includes(searchLower) ||
          studentEmail.includes(searchLower) ||
          sessionName.includes(searchLower) ||
          courseTitle.includes(searchLower)
        );
      }
      return true;
    })
    .filter((enrollment) => {
      // Status filter
      if (
        statusFilter !== "all" &&
        enrollment.enrollment_status !== statusFilter
      ) {
        return false;
      }
      return true;
    })
    .filter((enrollment) => {
      // Payment filter
      if (
        paymentFilter !== "all" &&
        enrollment.payment_status !== paymentFilter
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Sorting
      if (sortField === "enrolled_at") {
        return sortDirection === "asc"
          ? new Date(a.enrolled_at).getTime() -
              new Date(b.enrolled_at).getTime()
          : new Date(b.enrolled_at).getTime() -
              new Date(a.enrolled_at).getTime();
      }
      if (sortField === "student_name") {
        const nameA = getStudentName(a);
        const nameB = getStudentName(b);
        return sortDirection === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      if (sortField === "progress") {
        return sortDirection === "asc"
          ? a.progress_percentage - b.progress_percentage
          : b.progress_percentage - a.progress_percentage;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-main/20 border-t-main rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-6 h-6 text-main animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
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
              <span className="text-gray-900 font-medium">Enrollments</span>
            </div>
            <h1 className="text-2xl sm:text-2xl font-semibold text-gray-900">
              Enrollments
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage all student enrollments across your sessions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkActionMode(!bulkActionMode)}
              className={`inline-flex items-center px-4 py-2.5 rounded-xl font-medium transition-all ${
                bulkActionMode
                  ? "bg-main text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Bulk Actions
            </button>
            <button
              onClick={() => window.location.reload()}
              className="p-2.5 bg-white text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Total Enrollments
                </p>
                <p className="text-xl sm:text-xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-main/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-main" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Active</p>
                <p className="text-xl sm:text-xl font-bold text-emerald-600 mt-1">
                  {stats.active}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                <p className="text-xl sm:text-xl font-bold text-amber-600 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock3 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Revenue</p>
                <p className="text-xl sm:text-xl font-bold text-purple-600 mt-1">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 sm:mt-6 bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name, email, or session..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter Enrollments
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isFilterMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Filter Options */}
            <div
              className={`${isFilterMenuOpen ? "block" : "hidden"} lg:block`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                  <option value="suspended">Suspended</option>
                </select>

                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent bg-white"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="refunded">Refunded</option>
                </select>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setPaymentFilter("all");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {bulkActionMode && (
        <div className="mb-4 bg-white rounded-xl p-4 shadow-sm border border-main/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                selectedEnrollments.length === filteredEnrollments.length &&
                filteredEnrollments.length > 0
              }
              onChange={toggleSelectAll}
              className="w-4 h-4 text-main rounded border-gray-300 focus:ring-main"
            />
            <span className="text-sm text-gray-700">
              {selectedEnrollments.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBulkAction("approve")}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => handleBulkAction("reject")}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={() => handleBulkAction("mark-paid")}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Mark Paid
            </button>
            <button
              onClick={() => setBulkActionMode(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Enrollments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {bulkActionMode && (
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedEnrollments.length ===
                          filteredEnrollments.length &&
                        filteredEnrollments.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-main rounded border-gray-300 focus:ring-main"
                    />
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("student_name")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Student
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session / Course
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("progress")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Progress
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("enrolled_at")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Enrolled
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnrollments.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {bulkActionMode && (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEnrollments.includes(enrollment.id)}
                        onChange={() => toggleSelect(enrollment.id)}
                        className="w-4 h-4 text-main rounded border-gray-300 focus:ring-main"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-main to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getStudentName(enrollment).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getStudentName(enrollment)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getStudentEmail(enrollment)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.session?.name ||
                        `Session #${enrollment.tutor_course_session_id}`}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <BookOpen className="w-3 h-3" />
                      {enrollment.session?.course?.title || "Course"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(enrollment.enrollment_status)}`}
                    >
                      {getStatusIcon(enrollment.enrollment_status)}
                      {enrollment.enrollment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(enrollment.payment_status)}`}
                      >
                        {enrollment.payment_status === "paid" && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {enrollment.payment_status === "pending" && (
                          <Clock3 className="w-3 h-3" />
                        )}
                        {enrollment.payment_status === "partial" && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {enrollment.payment_status === "refunded" && (
                          <XCircle className="w-3 h-3" />
                        )}
                        {enrollment.payment_status}
                      </span>
                      {enrollment.payment_amount > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {formatCurrency(enrollment.payment_amount)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-main rounded-full h-2"
                          style={{
                            width: `${enrollment.progress_percentage}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {enrollment.progress_percentage}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {enrollment.classes_attended}/{enrollment.total_classes}{" "}
                      classes
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(enrollment.enrolled_at)}
                    {enrollment.last_accessed_at && (
                      <div className="text-xs text-gray-400">
                        Last active: {formatDate(enrollment.last_accessed_at)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/tutor/enrollments/${enrollment.id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View
                      </Link>

                      {enrollment.enrollment_status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(enrollment.id, "active")
                            }
                            className="text-emerald-600 hover:text-emerald-900 font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(enrollment.id, "dropped")
                            }
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {enrollment.enrollment_status === "active" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(enrollment.id, "completed")
                          }
                          className="text-purple-600 hover:text-purple-900 font-medium"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEnrollments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No enrollments found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== "all" || paymentFilter !== "all"
                ? "Try adjusting your filters"
                : "You don't have any enrollments yet"}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Students</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock3 className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total > 0
                  ? Math.round((stats.completed / stats.total) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
