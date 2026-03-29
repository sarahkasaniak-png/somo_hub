// src/app/tutor/enrollments/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi from "@/lib/api/tutor";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Download,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  CreditCard,
  Wallet,
  TrendingUp,
  BarChart3,
  Activity,
  FileText,
  MessageSquare,
  Send,
  AlertTriangle,
  Loader2,
  Check,
  X,
  Clock3,
  CalendarDays,
  Users,
  Target,
  Award,
  Star,
  MessageCircle,
  Share2,
  Printer,
  Settings,
  RefreshCw,
  UserCheck,
  UserX,
  Video,
  MapPin,
  Globe,
} from "lucide-react";

interface EnrollmentDetail {
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
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    date_of_birth: string | null;
    created_at: string;
  };
  session: {
    id: number;
    uuid: string;
    name: string;
    description: string | null;
    session_code: string;
    session_type: string;
    start_date: string;
    end_date: string;
    max_students: number;
    current_enrollment: number;
    fee_amount: number;
    fee_currency: string;
    status: string;
    enrollment_status: string;
    subject: string;
    level: string;
    curriculum_id?: number | null;
    curriculum_level_id?: number | null;
  };
  payment_history?: Array<{
    id: number;
    amount: number;
    status: string;
    reference: string;
    created_at: string;
  }>;
  attendance_history?: Array<{
    id: number;
    schedule_id: number;
    class_date: string;
    class_title: string;
    attended: boolean;
    attended_at: string | null;
  }>;
}

export default function EnrollmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const enrollmentId = params.id as string;

  const [enrollment, setEnrollment] = useState<EnrollmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "attendance" | "payments" | "notes"
  >("overview");
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    reference: "",
    notes: "",
  });

  useEffect(() => {
    fetchEnrollmentDetails();
  }, [enrollmentId]);

  const fetchEnrollmentDetails = async () => {
    try {
      setLoading(true);
      const response = await tutorApi.getEnrollmentById(parseInt(enrollmentId));
      console.log("API Response:", response);
      if (response.success) {
        setEnrollment(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch enrollment:", error);
      toast.error("Failed to load enrollment details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    setUpdating(true);
    try {
      const response = await tutorApi.updateEnrollmentStatus(
        parseInt(enrollmentId),
        {
          status: newStatus,
        },
      );
      if (response.success) {
        toast.success(`Enrollment status updated to ${newStatus}`);
        setShowStatusModal(false);
        fetchEnrollmentDetails();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddPayment = async () => {
    if (paymentData.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setUpdating(true);
    try {
      const response = await tutorApi.recordPayment(
        parseInt(enrollmentId),
        paymentData,
      );
      if (response.success) {
        toast.success("Payment recorded successfully");
        setShowPaymentModal(false);
        setPaymentData({ amount: 0, reference: "", notes: "" });
        fetchEnrollmentDetails();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to record payment");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock3 className="w-5 h-5" />;
      case "completed":
        return <Award className="w-5 h-5" />;
      case "dropped":
        return <XCircle className="w-5 h-5" />;
      case "suspended":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
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
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStudentFullName = () => {
    if (!enrollment?.student) return "Unknown Student";
    return (
      `${enrollment.student.first_name || ""} ${enrollment.student.last_name || ""}`.trim() ||
      "Unknown Student"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-main/20 border-t-main rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-6 h-6 text-main animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Enrollment Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The enrollment you're looking for doesn't exist.
          </p>
          <Link
            href="/tutor/enrollments"
            className="inline-flex items-center px-6 py-3 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Enrollments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header with Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link
              href="/tutor/dashboard"
              className="hover:text-main transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/tutor/enrollments"
              className="hover:text-main transition-colors"
            >
              Enrollments
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">
              Enrollment #{enrollment.id}
            </span>
          </div>

          {/* Title and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Link
                href="/tutor/enrollments"
                className="p-2 hover:bg-white rounded-xl transition-colors group hidden sm:block"
                title="Back to Enrollments"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-main transition-colors" />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-2xl font-semibold text-gray-900">
                    {getStudentFullName()}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(enrollment.enrollment_status)}`}
                    >
                      {getStatusIcon(enrollment.enrollment_status)}
                      {enrollment.enrollment_status.charAt(0).toUpperCase() +
                        enrollment.enrollment_status.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(enrollment.payment_status)}`}
                    >
                      {enrollment.payment_status === "paid" && (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      {enrollment.payment_status === "pending" && (
                        <Clock3 className="w-3 h-3" />
                      )}
                      {enrollment.payment_status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {enrollment.student.email}
                  </span>
                  {enrollment.student.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      {enrollment.student.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-700 font-medium rounded-xl border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm hover:shadow-md"
              >
                <CreditCard className="w-4 h-4" />
                Record Payment
              </button>
              <button
                onClick={() => setShowStatusModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 font-medium rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm hover:shadow-md"
              >
                <Settings className="w-4 h-4" />
                Update Status
              </button>
              <button
                onClick={() =>
                  router.push(
                    `/tutor/messages?student=${enrollment.student_id}`,
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-purple-700 font-medium rounded-xl border border-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-sm hover:shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
              <button className="p-2.5 bg-white text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all shadow-sm hover:shadow-md">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200"
              >
                <span className="font-medium">Actions</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${isActionsMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isActionsMenuOpen && (
                <div className="absolute right-0 left-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowPaymentModal(true);
                        setIsActionsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      <span>Record Payment</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowStatusModal(true);
                        setIsActionsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5 text-blue-600" />
                      <span>Update Status</span>
                    </button>
                    <Link
                      href={`/tutor/messages?student=${enrollment.student_id}`}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-purple-50 rounded-lg transition-colors"
                      onClick={() => setIsActionsMenuOpen(false)}
                    >
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <span>Send Message</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Progress</p>
              <div className="w-8 h-8 bg-main/10 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-main" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {enrollment.progress_percentage}%
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-main rounded-full h-2"
                style={{ width: `${enrollment.progress_percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Classes Attended</p>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {enrollment.classes_attended}/{enrollment.total_classes}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {enrollment.total_classes - enrollment.classes_attended} remaining
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Payment</p>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(
                enrollment.payment_amount,
                enrollment.session.fee_currency,
              )}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Status: {enrollment.payment_status}
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Last Active</p>
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {enrollment.last_accessed_at
                ? formatDate(enrollment.last_accessed_at)
                : "Never"}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Enrolled: {formatDate(enrollment.enrolled_at)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50">
            <nav className="flex overflow-x-auto hide-scrollbar">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "attendance", label: "Attendance", icon: Calendar },
                { id: "payments", label: "Payments", icon: CreditCard },
                { id: "notes", label: "Notes", icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-main text-main bg-main/5"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-main" />
                    Student Information
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-gray-500">Full Name</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-1">
                        {getStudentFullName()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Email</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-1">
                        {enrollment.student.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Phone</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-1">
                        {enrollment.student.phone || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Joined</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-1">
                        {formatDate(enrollment.student.created_at)}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Session Info - Updated without course reference */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-main" />
                    Session Information
                  </h3>
                  <dl className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <dt className="flex items-center gap-2 text-gray-500">
                        <GraduationCap className="w-4 h-4" />
                        Session:
                      </dt>
                      <dd className="font-medium text-gray-900">
                        <Link
                          href={`/tutor/sessions/${enrollment.session.uuid || enrollment.session.id}`}
                          className="text-main hover:underline"
                        >
                          {enrollment.session.name}
                        </Link>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <dt className="flex items-center gap-2 text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        Subject:
                      </dt>
                      <dd className="font-medium text-gray-900">
                        {enrollment.session.subject || "Not specified"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <dt className="flex items-center gap-2 text-gray-500">
                        <CalendarDays className="w-4 h-4" />
                        Date Range:
                      </dt>
                      <dd className="font-medium text-gray-900">
                        {formatDate(enrollment.session.start_date)} -{" "}
                        {formatDate(enrollment.session.end_date)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <dt className="flex items-center gap-2 text-gray-500">
                        <Users className="w-4 h-4" />
                        Enrollment:
                      </dt>
                      <dd className="font-medium text-gray-900">
                        {enrollment.session.current_enrollment}/
                        {enrollment.session.max_students}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <dt className="flex items-center gap-2 text-gray-500">
                        <Target className="w-4 h-4" />
                        Level:
                      </dt>
                      <dd className="font-medium text-gray-900">
                        {enrollment.session.level || "Not specified"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Progress Details */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-main" />
                    Progress Details
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-gray-500">Progress</dt>
                      <dd className="text-lg font-semibold text-gray-900 mt-1">
                        {enrollment.progress_percentage}%
                      </dd>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-main rounded-full h-2"
                          style={{
                            width: `${enrollment.progress_percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Classes</dt>
                      <dd className="text-lg font-semibold text-gray-900 mt-1">
                        {enrollment.classes_attended} /{" "}
                        {enrollment.total_classes}
                      </dd>
                      <p className="text-xs text-gray-500 mt-1">
                        {enrollment.classes_attended === 0
                          ? "Not started"
                          : enrollment.classes_attended ===
                              enrollment.total_classes
                            ? "Completed"
                            : "In progress"}
                      </p>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === "attendance" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-main" />
                  Attendance History
                </h3>

                {enrollment.attendance_history &&
                enrollment.attendance_history.length > 0 ? (
                  <div className="space-y-3">
                    {enrollment.attendance_history.map((attendance) => (
                      <div
                        key={attendance.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-sm transition-shadow border border-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              attendance.attended
                                ? "bg-emerald-100"
                                : "bg-red-100"
                            }`}
                          >
                            {attendance.attended ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {attendance.class_title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDateTime(attendance.class_date)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            attendance.attended
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {attendance.attended ? "Present" : "Absent"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No attendance records found</p>
                  </div>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-main" />
                    Payment History
                  </h3>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-main text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Record Payment
                  </button>
                </div>

                {enrollment.payment_history &&
                enrollment.payment_history.length > 0 ? (
                  <div className="space-y-3">
                    {enrollment.payment_history.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-sm transition-shadow border border-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatCurrency(
                                payment.amount,
                                enrollment.session.fee_currency,
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              Ref: {payment.reference}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                              payment.status === "paid"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {payment.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(payment.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      No payment records found
                    </p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-main text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Record First Payment
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === "notes" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-main" />
                    Notes
                  </h3>
                  <button
                    onClick={() => {
                      /* Add note handler */
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-main text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Add Note
                  </button>
                </div>

                {enrollment.notes ? (
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {enrollment.notes}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Added on {formatDate(enrollment.enrolled_at)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">No notes added yet</p>
                    <button
                      onClick={() => {
                        /* Add note handler */
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-main text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Add First Note
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Update Enrollment Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus || updating}
                className="flex-1 px-4 py-3 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Record Payment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {enrollment.session.fee_currency}
                  </span>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    min="0"
                    step="0.01"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference
                </label>
                <input
                  type="text"
                  value={paymentData.reference}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      reference: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="Payment reference"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                disabled={paymentData.amount <= 0 || updating}
                className="flex-1 px-4 py-3 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Recording...
                  </span>
                ) : (
                  "Record Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
