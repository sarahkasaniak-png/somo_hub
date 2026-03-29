// src/app/student/sessions/[sessionId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import studentApi from "@/lib/api/student";
import {
  Calendar,
  Clock,
  Video,
  BookOpen,
  Users,
  DollarSign,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  MapPinned,
  Wifi,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ExternalLink,
  ArrowLeft,
  Star,
  Award,
  GraduationCap,
  User,
  Mail,
  Phone,
  Info,
  FileText,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

interface SessionDetails {
  id: number;
  uuid: string;
  name: string;
  description: string;
  subject: string;
  level: string;
  session_type: "one_on_one" | "group";
  session_code: string;
  start_date: string;
  end_date: string;
  max_students: number;
  current_enrollment: number;
  fee_amount: number;
  fee_currency: string;
  enrollment_status: "open" | "waiting_list" | "closed" | "completed";
  session_status: "scheduled" | "ongoing" | "completed" | "cancelled";
  prerequisites: string[];
  learning_outcomes: string[];
  curriculum_data: Array<{
    week: number;
    topic: string;
    objectives?: string[];
    materials?: string[];
  }>;
  total_duration_hours?: number;
  total_duration_minutes?: number;
  total_duration_string?: string;
  classes_per_week?: number;
  schedules_count?: number;
  schedules?: Schedule[];
  schedules_by_week?: Record<number, Schedule[]>;
  tutor: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    rating: number;
    total_sessions: number;
    total_students: number;
    hourly_rate: number;
    currency: string;
  };
  enrollment?: {
    id: number;
    enrollment_status: string;
    payment_status: string;
    payment_amount: number;
    progress_percentage: number;
    classes_attended: number;
    total_classes: number;
    enrolled_at: string;
  };
}

interface Schedule {
  id: number;
  week_number: number;
  class_number: number;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  mode: "virtual" | "in_person" | "hybrid";
  meeting_platform: string;
  meeting_link: string | null;
  student_meeting_link: string | null;
  status: "scheduled" | "ongoing" | "completed" | "cancelled" | "rescheduled";
  recorded_session_url: string | null;
  attendance_taken: boolean;
}

export default function StudentSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "schedule"
  >("overview");
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSessionDetails();
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      // Fetch session details from API
      const response = await studentApi.getSessionDetails(parseInt(sessionId));

      console.log("Session details response:", response);

      if (response.success && response.data) {
        setSession(response.data);
      } else {
        toast.error(response.message || "Failed to load session details");
        router.push("/student/sessions");
      }
    } catch (error) {
      console.error("Failed to fetch session details:", error);
      toast.error("Failed to load session details");
      router.push("/student/sessions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSessionDetails();
    toast.success("Session details refreshed");
  };

  const handleJoinSession = async (scheduleId: number) => {
    try {
      setJoiningId(scheduleId);
      const response = await studentApi.joinSession(scheduleId);

      if (response.success && response.data?.meeting_link) {
        window.open(response.data.meeting_link, "_blank");
        toast.success("Joining session...");
        setTimeout(() => fetchSessionDetails(), 2000);
      } else {
        toast.error("Unable to join session at this time");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to join session");
    } finally {
      setJoiningId(null);
    }
  };

  const handleCopyLink = async (link: string, scheduleId: number) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(scheduleId);
      toast.success("Meeting link copied!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRating = (rating: any): string => {
    if (!rating && rating !== 0) return "0";
    const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
    if (isNaN(numRating)) return "0";
    return numRating.toFixed(1);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      completed: "bg-purple-50 text-purple-700 border-purple-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      scheduled: "bg-blue-50 text-blue-700 border-blue-200",
      ongoing: "bg-green-50 text-green-700 border-green-200",
      open: "bg-emerald-50 text-emerald-700 border-emerald-200",
      waiting_list: "bg-amber-50 text-amber-700 border-amber-200",
      closed: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    if (status === "ongoing") return <PlayCircle className="w-4 h-4" />;
    if (status === "completed") return <CheckCircle className="w-4 h-4" />;
    if (status === "cancelled") return <XCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Session Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The session you're looking for doesn't exist or you don't have access.
        </p>
        <Link
          href="/student/sessions"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sessions
        </Link>
      </div>
    );
  }

  const isEnrolled = !!session.enrollment;
  const enrollment = session.enrollment;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link
          href="/student/dashboard"
          className="hover:text-blue-600 transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href="/student/sessions"
          className="hover:text-blue-600 transition-colors"
        >
          My Sessions
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{session.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {session.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.session_status)}`}
                >
                  {getStatusIcon(session.session_status)}
                  <span className="ml-1 capitalize">
                    {session.session_status}
                  </span>
                </span>
              </div>
              <p className="text-gray-600">
                {session.description || "No description provided."}
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{session.subject}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span className="capitalize">
                    {session.level?.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {session.session_type === "group"
                      ? "Group Session"
                      : "One-on-One"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {formatCurrency(session.fee_amount, session.fee_currency)}
                  </span>
                </div>
              </div>
            </div>
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
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            {["overview", "curriculum", "schedule"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Progress Section */}
              {isEnrolled && enrollment && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Your Progress
                  </h3>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">
                      {enrollment.progress_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${enrollment.progress_percentage}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Classes Attended</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {enrollment.classes_attended} /{" "}
                        {enrollment.total_classes}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Enrolled Since</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(enrollment.enrolled_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Session Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Session Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Session Dates
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(session.start_date)} -{" "}
                          {formatDate(session.end_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Duration
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.total_duration_string ||
                            `${session.total_duration_hours || 0}h ${session.total_duration_minutes || 0}m`}
                        </p>
                        {session.classes_per_week && (
                          <p className="text-xs text-gray-500">
                            {session.classes_per_week} classes per week
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Capacity
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.current_enrollment} / {session.max_students}{" "}
                          students enrolled
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Session Code
                        </p>
                        <p className="text-sm font-mono text-gray-600">
                          {session.session_code}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tutor Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Tutor Information
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                      {session.tutor.avatar_url ? (
                        <img
                          src={session.tutor.avatar_url}
                          alt={session.tutor.first_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {session.tutor.first_name} {session.tutor.last_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">
                          {formatRating(session.tutor.rating)}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {session.tutor.total_sessions} sessions
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {session.tutor.total_students} students
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {session.tutor.bio || "No bio provided."}
                      </p>
                      <Link
                        href={`/tutors/${session.tutor.id}`}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                      >
                        View Profile
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {session.tutor.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {session.prerequisites && session.prerequisites.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Prerequisites</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {session.prerequisites.map((prereq, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Outcomes */}
              {session.learning_outcomes &&
                session.learning_outcomes.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">
                      What You'll Learn
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {session.learning_outcomes.map((outcome, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === "curriculum" && (
            <div className="space-y-6">
              {session.curriculum_data && session.curriculum_data.length > 0 ? (
                session.curriculum_data.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">
                        Week {week.week}: {week.topic}
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {week.objectives && week.objectives.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Learning Objectives:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {week.objectives.map((obj, idx) => (
                              <li key={idx} className="text-sm text-gray-600">
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {week.materials && week.materials.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Materials:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {week.materials.map((material, idx) => (
                              <li key={idx} className="text-sm text-gray-600">
                                {material}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Curriculum information not available yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              {session.schedules && session.schedules.length > 0 ? (
                session.schedules.map((schedule) => {
                  const isToday =
                    schedule.date === new Date().toISOString().split("T")[0];
                  const canJoin = ["scheduled", "ongoing"].includes(
                    schedule.status,
                  );
                  const isOngoing = schedule.status === "ongoing";

                  return (
                    <div
                      key={schedule.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                isOngoing
                                  ? "bg-green-100"
                                  : isToday
                                    ? "bg-amber-100"
                                    : "bg-blue-100"
                              }`}
                            >
                              {getTimeIcon(schedule.start_time)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {schedule.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Week {schedule.week_number} • Class{" "}
                                {schedule.class_number}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(schedule.date)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {formatTime(schedule.start_time)} -{" "}
                                    {formatTime(schedule.end_time)}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    ({schedule.duration_minutes} min)
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                  {schedule.mode === "virtual" ? (
                                    <Video className="w-4 h-4" />
                                  ) : schedule.mode === "in_person" ? (
                                    <MapPinned className="w-4 h-4" />
                                  ) : (
                                    <Wifi className="w-4 h-4" />
                                  )}
                                  <span className="capitalize">
                                    {schedule.mode.replace("_", " ")}
                                  </span>
                                </div>
                              </div>
                              {schedule.description && (
                                <p className="text-sm text-gray-500 mt-2">
                                  {schedule.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {canJoin && (
                            <button
                              onClick={() => handleJoinSession(schedule.id)}
                              disabled={joiningId === schedule.id}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                isOngoing
                                  ? "bg-green-600 text-white hover:bg-green-700 animate-pulse"
                                  : isToday
                                    ? "bg-amber-600 text-white hover:bg-amber-700"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                              } disabled:opacity-50`}
                            >
                              {joiningId === schedule.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : isOngoing ? (
                                "Join Live"
                              ) : isToday ? (
                                "Join Today"
                              ) : (
                                "Join"
                              )}
                            </button>
                          )}

                          {schedule.student_meeting_link && canJoin && (
                            <button
                              onClick={() =>
                                handleCopyLink(
                                  schedule.student_meeting_link!,
                                  schedule.id,
                                )
                              }
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                              title="Copy meeting link"
                            >
                              {copiedId === schedule.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {schedule.status === "completed" &&
                            schedule.recorded_session_url && (
                              <a
                                href={schedule.recorded_session_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                title="Watch recording"
                              >
                                <PlayCircle className="w-4 h-4" />
                              </a>
                            )}
                        </div>
                      </div>

                      {schedule.status === "completed" &&
                        schedule.recorded_session_url && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <a
                              href={schedule.recorded_session_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
                            >
                              <PlayCircle className="w-4 h-4" />
                              Watch Recording
                            </a>
                          </div>
                        )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No schedule available for this session yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Link
          href="/student/sessions"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sessions
        </Link>
      </div>
    </div>
  );
}
