// src/app/student/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import studentApi from "@/lib/api/student";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  Calendar,
  Clock,
  Video,
  BookOpen,
  Users,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Award,
  Star,
  ArrowRight,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ExternalLink,
  RefreshCw,
  Bell,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  Home,
  CalendarDays,
  User,
  CreditCard,
  Sparkles,
  Target,
  Zap,
  Crown,
  Medal,
  Trophy,
  BadgeCheck,
  Building,
  School,
  University,
  Heart,
  Share2,
  MoreHorizontal,
  ArrowLeft,
  Info,
} from "lucide-react";

// Types
interface DashboardStats {
  enrolledCourses: number;
  activeEnrollments: number;
  completedCourses: number;
  totalSessions: number;
  upcomingSessions: number;
  completedSessions: number;
  totalSpent: number;
  averageRating: number;
  certificates: number;
  learningHours: number;
}

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
  enrolled_at: string;
  progress_percentage: number;
  classes_attended: number;
  total_classes: number;
  session: {
    id: number;
    name: string;
    session_code: string;
    start_date: string;
    end_date: string;
    max_students: number;
    fee_amount: number;
    fee_currency: string;
    status: string;
    course: {
      id: number;
      title: string;
      subject: string;
      level: string;
      thumbnail_url: string | null;
    };
    tutor: {
      id: number;
      first_name: string;
      last_name: string;
      avatar_url: string | null;
    };
  };
}

interface Schedule {
  id: number;
  tutor_course_session_id: number;
  class_number: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  mode: "virtual" | "in_person" | "hybrid";
  meeting_link: string | null;
  student_meeting_link: string | null;
  status: "scheduled" | "ongoing" | "completed" | "cancelled" | "rescheduled";
  course_title?: string;
  session_name?: string;
  session_code?: string;
}

interface Activity {
  id: number;
  type: "enrollment" | "payment" | "session" | "course" | "review";
  description: string;
  timestamp: string;
  metadata?: any;
}

export default function StudentDashboard() {
  const router = useRouter();
  const { user, userStatus, profileData, refreshUserData } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    activeEnrollments: 0,
    completedCourses: 0,
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    totalSpent: 0,
    averageRating: 0,
    certificates: 0,
    learningHours: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState<Enrollment[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [studentName, setStudentName] = useState("");
  const [joiningId, setJoiningId] = useState<number | null>(null);

  useEffect(() => {
    setGreeting(getGreeting());

    // Format name from profileData (which now has all user info)
    const formatDisplayName = (): string => {
      // Use profileData as the primary source
      if (profileData) {
        const firstName = profileData.first_name || "";
        const lastName = profileData.last_name || "";

        if (firstName && lastName) {
          return `${firstName} ${lastName.charAt(0)}.`;
        } else if (firstName) {
          return firstName;
        } else if (lastName) {
          return lastName;
        } else if (profileData.email) {
          return profileData.email.split("@")[0];
        }
      }

      // Fallback to user object
      if (user) {
        const firstName = user.first_name || "";
        const lastName = user.last_name || "";

        if (firstName && lastName) {
          return `${firstName} ${lastName.charAt(0)}.`;
        } else if (firstName) {
          return firstName;
        } else if (lastName) {
          return lastName;
        } else if (user.email) {
          return user.email.split("@")[0];
        }
      }

      return "Student";
    };

    const displayName = formatDisplayName();
    setStudentName(displayName);

    // Debug logs (commented out in production)
    // console.log("📊 Student Dashboard - profileData:", {
    //   first_name: profileData?.first_name,
    //   last_name: profileData?.last_name,
    //   email: profileData?.email,
    //   stats: profileData?.stats,
    // });
    // console.log("📊 Student Dashboard - formatted name:", displayName);

    fetchDashboardData();
  }, [user, profileData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard data from APIs
      const [enrollmentsResponse, upcomingResponse, statsResponse] =
        await Promise.allSettled([
          studentApi.getMyEnrollments({ limit: 5 }),
          studentApi.getUpcomingSessions(10),
          studentApi.getDashboardStats(),
        ]);

      // Process enrollments
      if (
        enrollmentsResponse.status === "fulfilled" &&
        enrollmentsResponse.value.success
      ) {
        const enrollmentsData = enrollmentsResponse.value.data;
        setRecentEnrollments(enrollmentsData?.enrollments || []);
        setStats((prev) => ({
          ...prev,
          enrolledCourses: enrollmentsData?.total || 0,
        }));
      }

      // Process upcoming sessions
      if (
        upcomingResponse.status === "fulfilled" &&
        upcomingResponse.value.success
      ) {
        const schedulesData = upcomingResponse.value.data;
        setUpcomingSchedules(schedulesData || []);
        setStats((prev) => ({
          ...prev,
          upcomingSessions: (schedulesData || []).length,
        }));
      }

      // Process dashboard stats
      if (statsResponse.status === "fulfilled" && statsResponse.value.success) {
        const statsData = statsResponse.value.data;
        console.log("stats data:", statsData);
        setStats((prev) => ({
          ...prev,
          activeEnrollments:
            statsData?.activeEnrollments || prev.activeEnrollments,
          completedCourses:
            statsData?.completedCourses || prev.completedCourses,
          totalSessions: statsData?.totalSessions || prev.totalSessions,
          completedSessions:
            statsData?.completedSessions || prev.completedSessions,
          totalSpent: statsData?.totalSpent || prev.totalSpent,
          averageRating: statsData?.averageRating || prev.averageRating,
          certificates: statsData?.certificates || prev.certificates,
          learningHours: statsData?.learningHours || prev.learningHours,
        }));
      }

      // Use profileData from context to enhance stats
      if (profileData?.stats) {
        setStats((prev) => ({
          ...prev,
          learningHours:
            profileData.stats?.learning_hours || prev.learningHours,
          certificates:
            profileData.stats?.certificates_earned || prev.certificates,
          averageRating:
            profileData.stats?.average_rating || prev.averageRating,
          completedCourses:
            profileData.stats?.courses_completed || prev.completedCourses,
        }));
      }

      // Format recent activity from userStatus if available
      if (userStatus?.recentActivity) {
        const activities = userStatus.recentActivity.map(
          (activity: any, index: number) => ({
            id: index,
            type: getActivityType(activity.action),
            description: formatActivityDescription(activity),
            timestamp: formatRelativeTime(activity.created_at),
            metadata: activity.metadata,
          }),
        );
        setRecentActivity(activities.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getActivityType = (action: string): Activity["type"] => {
    if (action.includes("enroll")) return "enrollment";
    if (action.includes("pay")) return "payment";
    if (action.includes("session")) return "session";
    if (action.includes("review")) return "review";
    return "course";
  };

  const formatActivityDescription = (activity: any): string => {
    const action = activity.action;
    const metadata = activity.metadata || {};

    if (action.includes("enrollment_created"))
      return `Enrolled in: ${metadata.course_title || ""}`;
    if (action.includes("payment_completed"))
      return `Payment completed: ${metadata.amount || ""}`;
    if (action.includes("session_attended"))
      return `Attended: ${metadata.session_name || ""}`;
    if (action.includes("review_submitted"))
      return `Left a review for ${metadata.course_title || ""}`;

    return action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleJoinSession = async (scheduleId: number) => {
    try {
      setJoiningId(scheduleId);
      const response = await studentApi.joinSession(scheduleId);

      if (response.success && response.data?.meeting_link) {
        toast.success("Joining session...");
        window.open(response.data.meeting_link, "_blank");
        setTimeout(() => fetchDashboardData(), 2000);
      } else {
        toast.error("Unable to join session at this time");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to join session");
    } finally {
      setJoiningId(null);
    }
  };

  const handleRefresh = async () => {
    await refreshUserData();
    await fetchDashboardData();
    toast.success("Dashboard refreshed");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      completed: "bg-purple-50 text-purple-700 border-purple-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      scheduled: "bg-blue-50 text-blue-700 border-blue-200",
      ongoing: "bg-green-50 text-green-700 border-green-200 animate-pulse",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
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

  const statCards = [
    {
      title: "Enrolled Courses",
      value: stats.enrolledCourses,
      icon: BookOpen,
      color: "blue",
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/student/courses",
      subtext: `${stats.activeEnrollments} active`,
    },
    {
      title: "Upcoming Sessions",
      value: stats.upcomingSessions,
      icon: Calendar,
      color: "amber",
      bgLight: "bg-amber-50",
      iconColor: "text-amber-600",
      link: "/student/schedule",
      subtext: "Next 7 days",
    },
    {
      title: "Completed",
      value: stats.completedCourses,
      icon: Award,
      color: "purple",
      bgLight: "bg-purple-50",
      iconColor: "text-purple-600",
      link: "/student/history",
      subtext: `${stats.completedSessions} sessions`,
    },
    {
      title: "Total Spent",
      value: formatCurrency(stats.totalSpent),
      icon: DollarSign,
      color: "emerald",
      bgLight: "bg-emerald-50",
      iconColor: "text-emerald-600",
      link: "/student/payments",
      subtext: `${stats.certificates} certificates`,
    },
  ];

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

  return (
    <ProtectedRoute requiredRoles={["student"]}>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Header with Refresh Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {greeting}, {studentName}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {stats.upcomingSessions > 0
                ? `You have ${stats.upcomingSessions} upcoming session${stats.upcomingSessions > 1 ? "s" : ""} to attend`
                : stats.activeEnrollments > 0
                  ? `You're enrolled in ${stats.activeEnrollments} active course${stats.activeEnrollments > 1 ? "s" : ""}`
                  : "Ready to start learning? Browse our courses!"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="p-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-600/25"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Courses
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                href={stat.link}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className={`${stat.bgLight} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  {stat.subtext && (
                    <p className="text-xs text-gray-500 mt-2">{stat.subtext}</p>
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Main Content Grid - Upcoming Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Upcoming Sessions and Enrollments */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Upcoming Sessions
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Your scheduled classes
                    </p>
                  </div>
                  <Link
                    href="/student/schedule"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {upcomingSchedules.length > 0 ? (
                  upcomingSchedules.slice(0, 3).map((schedule) => {
                    const isToday =
                      schedule.date === new Date().toISOString().split("T")[0];
                    const isOngoing = schedule.status === "ongoing";
                    const canJoin = ["scheduled", "ongoing"].includes(
                      schedule.status,
                    );

                    return (
                      <div
                        key={schedule.id}
                        className="p-4 sm:p-6 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-start gap-4">
                          {/* Date Badge */}
                          <div
                            className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center flex-shrink-0 border ${
                              isToday
                                ? "bg-amber-50 border-amber-200"
                                : "bg-blue-50 border-blue-100"
                            }`}
                          >
                            <span
                              className={`text-xs font-medium ${
                                isToday ? "text-amber-600" : "text-blue-600"
                              }`}
                            >
                              {formatDate(schedule.date).substring(0, 3)}
                            </span>
                            <span
                              className={`text-lg font-semibold ${
                                isToday ? "text-amber-700" : "text-blue-700"
                              }`}
                            >
                              {new Date(schedule.date).getDate()}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {schedule.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {schedule.course_title} • Class{" "}
                                  {schedule.class_number}
                                </p>
                              </div>
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border w-fit ${getStatusColor(schedule.status)}`}
                              >
                                {schedule.status === "ongoing" && (
                                  <PlayCircle className="w-3 h-3 mr-1" />
                                )}
                                {schedule.status.charAt(0).toUpperCase() +
                                  schedule.status.slice(1)}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mt-3">
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                {getTimeIcon(schedule.start_time)}
                                <span>
                                  {formatTime(schedule.start_time)} -{" "}
                                  {formatTime(schedule.end_time)}
                                </span>
                                <span className="text-xs text-gray-400">
                                  ({schedule.duration_minutes} min)
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Video className="w-4 h-4" />
                                <span className="capitalize">
                                  {schedule.mode.replace("_", " ")}
                                </span>
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
                            <Link
                              href={`/student/sessions/${schedule.tutor_course_session_id}`}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No upcoming sessions
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You don't have any scheduled classes yet
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Browse Courses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Enrollments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Recent Enrollments
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Your latest course enrollments
                    </p>
                  </div>
                  <Link
                    href="/student/courses"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {recentEnrollments.length > 0 ? (
                  recentEnrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        {/* Course Thumbnail */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {enrollment.session.course.thumbnail_url ? (
                            <img
                              src={enrollment.session.course.thumbnail_url}
                              alt={enrollment.session.course.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {enrollment.session.course.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {enrollment.session.name} •{" "}
                                {enrollment.session.session_code}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border w-fit ${getStatusColor(enrollment.enrollment_status)}`}
                            >
                              {enrollment.enrollment_status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>
                                Tutor: {enrollment.session.tutor.first_name}{" "}
                                {enrollment.session.tutor.last_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              <span>
                                {formatCurrency(
                                  enrollment.payment_amount,
                                  enrollment.session.fee_currency,
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium text-gray-900">
                                {enrollment.progress_percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                                style={{
                                  width: `${enrollment.progress_percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No enrollments yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start your learning journey by enrolling in a course
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Browse Courses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Activity and Stats */}
          <div className="space-y-6 sm:space-y-8">
            {/* Recent Activity */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Your latest actions
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => {
                  const icons = {
                    enrollment: (
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                    ),
                    payment: <DollarSign className="w-4 h-4 text-blue-600" />,
                    session: <Video className="w-4 h-4 text-purple-600" />,
                    course: (
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                    ),
                    review: <Star className="w-4 h-4 text-yellow-600" />,
                  };
                  const bgColors = {
                    enrollment: "bg-emerald-100",
                    payment: "bg-blue-100",
                    session: "bg-purple-100",
                    course: "bg-amber-100",
                    review: "bg-yellow-100",
                  };

                  return (
                    <div
                      key={activity.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bgColors[activity.type]}`}
                        >
                          {icons[activity.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">No recent activity</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Link
                href="/student/activity"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
              >
                View All Activity
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div> */}

            {/* Quick Stats from Profile - Using profileData */}
            {/* <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Learning Stats</h3>
                <p className="text-sm text-white/80 mt-1">
                  Your progress summary
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{stats.learningHours}</p>
                <p className="text-xs text-white/80">Hours Learned</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedSessions}</p>
                <p className="text-xs text-white/80">Sessions Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.certificates}</p>
                <p className="text-xs text-white/80">Certificates</p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">
                    {stats.averageRating.toFixed(1)}
                  </p>
                  <Star className="w-4 h-4 fill-current text-yellow-300" />
                </div>
                <p className="text-xs text-white/80">Average Rating</p>
              </div>
            </div>
          </div> */}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/"
                  className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors"
                >
                  <BookOpen className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <span className="text-xs font-medium text-gray-700">
                    Browse
                  </span>
                </Link>
                <Link
                  href="/student/schedule"
                  className="p-3 bg-amber-50 rounded-lg text-center hover:bg-amber-100 transition-colors"
                >
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <span className="text-xs font-medium text-gray-700">
                    Schedule
                  </span>
                </Link>
                <Link
                  href="/student/profile"
                  className="p-3 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"
                >
                  <User className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                  <span className="text-xs font-medium text-gray-700">
                    Profile
                  </span>
                </Link>
                <Link
                  href="/student/payments"
                  className="p-3 bg-emerald-50 rounded-lg text-center hover:bg-emerald-100 transition-colors"
                >
                  <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  <span className="text-xs font-medium text-gray-700">
                    Payments
                  </span>
                </Link>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Need Help?
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Check out our student resources and FAQs
                  </p>
                  <Link
                    href="/help"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    Visit Help Center
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
