// src/app/tutor/sessions/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi, { TutorSession, SessionEnrollment } from "@/lib/api/tutor";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Edit,
  Video,
  BookOpen,
  Tag,
  UserCheck,
  CreditCard,
  CalendarRange,
  ChevronRight,
  ArrowLeft,
  Settings,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Copy,
  Trash2,
  Loader2,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Globe,
  EyeOff,
  PlayCircle,
  MapPinned,
  Wifi,
  BarChart3,
  Target,
  BookText,
  FileText,
  Sparkle,
  Info,
  Clock4,
  Timer,
  Hourglass,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  Users2,
  GraduationCap,
  Pencil,
  Trash,
  ChevronDown,
  ChevronLeft,
  AlertTriangle,
  Code,
  ListChecks,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

// Types for schedule configs
interface ScheduleConfig {
  id?: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  is_active: boolean;
}

// Extended session type with schedule configs
interface ExtendedTutorSession extends TutorSession {
  schedule_configs?: ScheduleConfig[];
  schedules?: any[];
}

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<ExtendedTutorSession | null>(null);
  const [enrollments, setEnrollments] = useState<SessionEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "schedule" | "schedules" | "enrollments" | "settings"
  >("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);

  const [joiningScheduleId, setJoiningScheduleId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
      fetchEnrollments();
    }
  }, [sessionId]);

  // Add join schedule handler
  const handleJoinSchedule = async (scheduleId: number) => {
    try {
      setJoiningScheduleId(scheduleId);
      const response =
        await tutorApi.schedules.joinScheduledSession(scheduleId);

      if (response.success && response.data.meeting_link) {
        window.open(response.data.meeting_link, "_blank");
        toast.success("Joining session...");
        // Refresh to update status if needed
        setTimeout(() => fetchSessionDetails(), 2000);
      } else {
        toast.error("Meeting link not available");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to join session");
    } finally {
      setJoiningScheduleId(null);
    }
  };

  // Update the fetchSessionDetails function (around line 135)

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const response = await tutorApi.getSession(parseInt(sessionId));
      if (response.success) {
        // Map the response to ensure schedule_configs matches the expected type
        const sessionData = response.data;

        // Transform schedule_configs if they exist
        const extendedSession: ExtendedTutorSession = {
          ...sessionData,
          schedule_configs: sessionData.schedule_configs?.map((config) => ({
            id: config.id || 0,
            day_of_week: config.day_of_week,
            start_time: config.start_time,
            end_time: config.end_time,
            duration_minutes: config.duration_minutes || 0, // Provide default value
            is_active: config.is_active ?? true, // Provide default value
          })),
        };

        setSession(extendedSession);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      toast.error("Failed to load session details");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await tutorApi.getSessionEnrollments(
        parseInt(sessionId),
      );
      if (response.success) {
        setEnrollments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    }
  };

  const handleJoinSession = async () => {
    if (!session) return;

    try {
      const response = await tutorApi.joinSession(session.id);
      if (response.success && response.data.meeting_link) {
        window.open(response.data.meeting_link, "_blank");
      } else {
        toast.error("Meeting link not available");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to join session");
    }
  };

  const handleDeleteSession = async () => {
    if (!session) return;

    try {
      const response = await tutorApi.deleteSession(session.id);
      if (response.success) {
        toast.success("Session deleted successfully");
        router.push("/tutor/sessions");
      } else {
        toast.error("Failed to delete session");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete session");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <CalendarClock className="w-4 h-4" />;
      case "ongoing":
        return <PlayCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ongoing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "waiting_list":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "closed":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "completed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "virtual":
        return <Video className="w-4 h-4" />;
      case "in_person":
        return <MapPinned className="w-4 h-4" />;
      case "hybrid":
        return <Wifi className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 5 && hour < 12)
      return <Sunrise className="w-4 h-4 text-amber-500" />;
    if (hour >= 12 && hour < 17)
      return <Sun className="w-4 h-4 text-orange-500" />;
    if (hour >= 17 && hour < 20)
      return <Sunset className="w-4 h-4 text-purple-500" />;
    return <Moon className="w-4 h-4 text-indigo-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount: number, currency: string = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getDayName = (day: number): string => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day];
  };

  const getActiveEnrollments = () => {
    return enrollments.filter((e) => e.enrollment_status === "active").length;
  };

  const getPendingEnrollments = () => {
    return enrollments.filter((e) => e.enrollment_status === "pending").length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-main/20 border-t-main rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-main animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Session Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The session you're looking for doesn't exist or has been deleted.
          </p>
          <Link
            href="/tutor/sessions"
            className="inline-flex items-center px-6 py-3 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Sessions
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
              href="/tutor/sessions"
              className="hover:text-main transition-colors"
            >
              Sessions
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">
              {session.name}
            </span>
          </div>

          {/* Title and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-1">
              <Link
                href="/tutor/sessions"
                className="p-2 hover:bg-white rounded-xl transition-colors group hidden sm:block md:block."
                title="Back to Sessions"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-main transition-colors" />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-2xl font-semibold text-gray-900 ">
                    {session.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}
                    >
                      {getStatusIcon(session.status)}
                      {session.status.charAt(0).toUpperCase() +
                        session.status.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getEnrollmentStatusColor(session.enrollment_status)}`}
                    >
                      <Users className="w-4 h-4" />
                      {session.enrollment_status.replace("_", " ")}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                      <Code className="w-4 h-4" />
                      {session.session_code}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDateTime(session.start_date)} -{" "}
                    {formatDateTime(session.end_date)}
                  </span>
                  {session.batch_name && (
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      Batch: {session.batch_name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Actions - Professional with Labels */}
            <div className="hidden lg:flex items-center gap-2">
              {/* {session.status === "scheduled" && (
                <button
                  onClick={handleJoinSession}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-main hover:text-white hover:border-main transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  <Video className="w-4 h-4" />
                  Join Session
                </button>
              )} */}

              <Link
                href={`/tutor/sessions/create?courseId=${session.tutor_course_id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-700 font-medium rounded-xl border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm hover:shadow-md"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </Link>

              <Link
                href={`/tutor/sessions/${session.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 font-medium rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm hover:shadow-md"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-red-700 font-medium rounded-xl border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm hover:shadow-md"
              >
                <Trash className="w-4 h-4" />
                Delete
              </button>

              <button className="p-2.5 bg-white text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all shadow-sm hover:shadow-md">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Actions Menu */}
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
                    {/* {session.status === "scheduled" && (
                      <button
                        onClick={() => {
                          handleJoinSession();
                          setIsActionsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-main/5 rounded-lg transition-colors"
                      >
                        <Video className="w-5 h-5 text-main" />
                        <span>Join Session</span>
                      </button>
                    )} */}

                    <Link
                      href={`/tutor/sessions/create?courseId=${session.tutor_course_id}`}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-emerald-50 rounded-lg transition-colors"
                      onClick={() => setIsActionsMenuOpen(false)}
                    >
                      <Copy className="w-5 h-5 text-emerald-600" />
                      <span>Duplicate Session</span>
                    </Link>

                    <Link
                      href={`/tutor/sessions/${session.id}/edit`}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setIsActionsMenuOpen(false)}
                    >
                      <Pencil className="w-5 h-5 text-blue-600" />
                      <span>Edit Session</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setIsActionsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash className="w-5 h-5 text-red-600" />
                      <span>Delete Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Students Enrolled</p>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {session.current_enrollment}/{session.max_students}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="w-3 h-3" />
                {getActiveEnrollments()} active
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <Clock className="w-3 h-3" />
                {getPendingEnrollments()} pending
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Schedule Configs</p>
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <CalendarRange className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {session.schedule_configs?.length || 0}
            </p>
            <p className="mt-2 text-xs text-gray-500">Unique class times</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Session Fee</p>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(session.fee_amount, session.fee_currency)}
            </p>
            <p className="mt-2 text-xs text-gray-500">per student</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(
                session.fee_amount * session.current_enrollment,
                session.fee_currency,
              )}
            </p>
            <p className="mt-2 text-xs text-gray-500">projected</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50">
            <nav className="flex overflow-x-auto hide-scrollbar">
              {[
                { id: "overview", label: "Overview", icon: BookOpen },
                { id: "schedule", label: "Schedule Config", icon: Calendar },
                {
                  id: "schedules",
                  label: "Class Schedules",
                  icon: CalendarDays,
                }, // New tab
                {
                  id: "enrollments",
                  label: "Enrollments",
                  icon: Users,
                  count: enrollments.length,
                },
                { id: "settings", label: "Settings", icon: Settings },
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
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === tab.id
                            ? "bg-main/10 text-main"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-main" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {session.description || (
                      <span className="text-gray-400 italic">
                        No description provided
                      </span>
                    )}
                  </p>
                </div>

                {/* Session Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-main" />
                      Session Details
                    </h3>
                    <dl className="space-y-3">
                      {[
                        {
                          icon: BookOpen,
                          label: "Session Type",
                          value:
                            session.session_type?.replace("_", " ") ||
                            "Not specified",
                          capitalize: true,
                        },
                        {
                          icon: Tag,
                          label: "Batch",
                          value: session.batch_name || "Not specified",
                        },
                        {
                          icon: Users2,
                          label: "Max Students",
                          value: session.max_students || "Not specified",
                        },
                        {
                          icon: GraduationCap,
                          label: "Course ID",
                          value: session.tutor_course_id || "Not specified",
                        },
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                          >
                            <dt className="flex items-center gap-2 text-gray-500">
                              <Icon className="w-4 h-4" />
                              {item.label}:
                            </dt>
                            <dd
                              className={`font-medium text-gray-900 ${item.capitalize ? "capitalize" : ""}`}
                            >
                              {item.value}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CalendarRange className="w-5 h-5 text-main" />
                      Date & Time
                    </h3>
                    <dl className="space-y-3">
                      {[
                        {
                          icon: Calendar,
                          label: "Start Date",
                          value: formatDate(session.start_date),
                        },
                        {
                          icon: Calendar,
                          label: "End Date",
                          value: formatDate(session.end_date),
                        },
                        {
                          icon: Clock4,
                          label: "Duration",
                          value: `${Math.ceil(
                            (new Date(session.end_date).getTime() -
                              new Date(session.start_date).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )} days`,
                        },
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                          >
                            <dt className="flex items-center gap-2 text-gray-500">
                              <Icon className="w-4 h-4" />
                              {item.label}:
                            </dt>
                            <dd className="font-medium text-gray-900">
                              {item.value}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>

                {/* Schedule Configurations */}
                {session.schedule_configs &&
                  session.schedule_configs.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-main" />
                        Class Schedule
                      </h3>
                      <div className="space-y-3">
                        {session.schedule_configs.map((config, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-sm transition-shadow border border-gray-100"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                                {getTimeIcon(config.start_time)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {getDayName(config.day_of_week)}
                                </p>
                                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(config.start_time)} -{" "}
                                    {formatTime(config.end_time)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Timer className="w-3 h-3" />
                                    {config.duration_minutes} min
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                config.is_active
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-gray-50 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {config.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-main" />
                    Class Schedule
                  </h3>
                  <Link
                    href={`/tutor/sessions/${session.id}/edit?tab=schedule`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-main/10 text-main rounded-lg hover:bg-main/20 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Schedule
                  </Link>
                </div>

                {session.schedule_configs &&
                session.schedule_configs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {session.schedule_configs.map((config, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-5 border-l-4 border-main hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-white rounded-lg">
                              {getTimeIcon(config.start_time)}
                            </div>
                            <h4 className="font-semibold text-gray-900">
                              {getDayName(config.day_of_week)}
                            </h4>
                          </div>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            Week {Math.floor(index / 7) + 1}
                          </span>
                        </div>

                        <div className="space-y-2 mt-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-main" />
                            <span className="text-gray-700">
                              {formatTime(config.start_time)} -{" "}
                              {formatTime(config.end_time)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Timer className="w-4 h-4 text-main" />
                            <span className="text-gray-700">
                              {config.duration_minutes} minutes
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              config.is_active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {config.is_active ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      No schedule configured yet
                    </p>
                    <Link
                      href={`/tutor/sessions/${session.id}/edit?tab=schedule`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Schedule
                    </Link>
                  </div>
                )}
              </div>
            )}
            {/* Class Schedules Tab */}

            {activeTab === "schedules" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-main" />
                    Class Schedules
                  </h3>
                  <Link
                    href={`/tutor/sessions/${session.id}/schedules`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-main text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    View All Classes
                  </Link>
                </div>

                {/* Preview of upcoming classes with JOIN BUTTONS */}
                {session.schedules && session.schedules.length > 0 ? (
                  <div className="space-y-3">
                    {session.schedules
                      .filter((s: any) => {
                        const scheduleDate = new Date(s.date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return (
                          scheduleDate >= today &&
                          s.status !== "completed" &&
                          s.status !== "cancelled"
                        );
                      })
                      .slice(0, 5)
                      .map((schedule: any) => {
                        const canJoin =
                          schedule.status === "scheduled" ||
                          schedule.status === "ongoing";
                        const isToday =
                          new Date(schedule.date).toDateString() ===
                          new Date().toDateString();

                        return (
                          <div
                            key={schedule.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-sm transition-shadow border border-gray-100"
                          >
                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  schedule.status === "ongoing"
                                    ? "bg-green-100 animate-pulse"
                                    : isToday
                                      ? "bg-amber-100"
                                      : "bg-main/10"
                                }`}
                              >
                                {schedule.status === "ongoing" ? (
                                  <PlayCircle className="w-5 h-5 text-green-600" />
                                ) : isToday ? (
                                  <Sun className="w-5 h-5 text-amber-600" />
                                ) : (
                                  <Calendar className="w-5 h-5 text-main" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  Class {schedule.class_number}:{" "}
                                  {schedule.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(schedule.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                      },
                                    )}
                                    {isToday && (
                                      <span className="ml-1 text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                                        Today
                                      </span>
                                    )}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(schedule.start_time)} -{" "}
                                    {formatTime(schedule.end_time)}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                                      schedule.status === "ongoing"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : schedule.status === "scheduled"
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : "bg-gray-50 text-gray-700 border-gray-200"
                                    }`}
                                  >
                                    {schedule.status === "ongoing" && (
                                      <PlayCircle className="w-3 h-3" />
                                    )}
                                    {schedule.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* JOIN BUTTON - Only show for scheduled/ongoing classes */}
                            {canJoin && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleJoinSchedule(schedule.id)
                                  }
                                  disabled={joiningScheduleId === schedule.id}
                                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    schedule.status === "ongoing"
                                      ? "bg-green-600 text-white hover:bg-green-700"
                                      : isToday
                                        ? "bg-amber-600 text-white hover:bg-amber-700"
                                        : "bg-main text-white hover:bg-purple-700"
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {joiningScheduleId === schedule.id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Joining...
                                    </>
                                  ) : (
                                    <>
                                      <Video className="w-4 h-4" />
                                      {schedule.status === "ongoing"
                                        ? "Join Live"
                                        : "Join Class"}
                                    </>
                                  )}
                                </button>

                                <Link
                                  href={`/tutor/sessions/${session.id}/schedules?class=${schedule.id}`}
                                  className="p-2 text-gray-600 hover:text-main hover:bg-gray-100 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {session.schedules.filter((s: any) => {
                      const scheduleDate = new Date(s.date);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return (
                        scheduleDate >= today &&
                        s.status !== "completed" &&
                        s.status !== "cancelled"
                      );
                    }).length > 5 && (
                      <div className="text-center pt-2">
                        <Link
                          href={`/tutor/sessions/${session.id}/schedules`}
                          className="text-main hover:text-purple-700 font-medium text-sm inline-flex items-center gap-1"
                        >
                          View all {session.schedules.length} classes
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      No class schedules generated yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Class schedules will be generated based on your schedule
                      configuration
                    </p>
                  </div>
                )}
              </div>
            )}
            {/* Enrollments Tab */}
            {activeTab === "enrollments" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-main" />
                    Enrolled Students
                  </h3>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <Link
                      href={`/tutor/sessions/${session.id}/enrollments/manage`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-main text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      Manage
                    </Link>
                  </div>
                </div>

                {enrollments.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Payment
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Progress
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Enrolled Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {enrollments.map((enrollment) => (
                            <tr
                              key={enrollment.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-main to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {enrollment.student_id.toString()[0]}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      Student #{enrollment.student_id}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      ID: {enrollment.student_id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                                    enrollment.enrollment_status === "active"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : enrollment.enrollment_status ===
                                          "pending"
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : enrollment.enrollment_status ===
                                            "completed"
                                          ? "bg-purple-50 text-purple-700 border-purple-200"
                                          : "bg-gray-50 text-gray-700 border-gray-200"
                                  }`}
                                >
                                  {enrollment.enrollment_status ===
                                    "active" && (
                                    <CheckCircle className="w-3 h-3" />
                                  )}
                                  {enrollment.enrollment_status ===
                                    "pending" && <Clock className="w-3 h-3" />}
                                  {enrollment.enrollment_status ===
                                    "completed" && (
                                    <CheckCircle className="w-3 h-3" />
                                  )}
                                  {enrollment.enrollment_status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                                    enrollment.payment_status === "paid"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : enrollment.payment_status === "pending"
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                  }`}
                                >
                                  {enrollment.payment_status === "paid" ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : enrollment.payment_status ===
                                    "pending" ? (
                                    <Clock className="w-3 h-3" />
                                  ) : (
                                    <XCircle className="w-3 h-3" />
                                  )}
                                  {enrollment.payment_status}
                                </span>
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
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(enrollment.enrolled_at)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Link
                                  href={`/tutor/students/${enrollment.student_id}`}
                                  className="text-main hover:text-purple-700 font-medium"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      No students enrolled yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Students will appear here once they enroll in this
                      session.
                    </p>
                  </div>
                )}
              </div>
            )}
            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-main" />
                  Session Settings
                </h3>

                <div className="space-y-6">
                  {/* Danger Zone */}
                  <div className="border border-red-200 rounded-xl overflow-hidden">
                    <div className="bg-red-50 px-6 py-4 border-b border-red-200">
                      <h3 className="text-base font-semibold text-red-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Danger Zone
                      </h3>
                    </div>
                    <div className="p-6 bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            Delete this session
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Once deleted, this session and all associated data
                            cannot be recovered.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Session
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Settings could go here */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-medium text-gray-900 mb-4">
                      General Settings
                    </h4>
                    <p className="text-sm text-gray-500">
                      Additional session settings will be available here.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Delete Session
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete "{session?.name}"? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSession}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
