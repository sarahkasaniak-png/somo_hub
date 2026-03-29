// src/app/tutor/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import tutorApi, { TutorSession } from "@/lib/api/tutor";
import tutorEarningsApi from "@/lib/api/tutor-earnings";
import userApi from "@/lib/api/user";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  BookOpen,
  Users,
  Clock,
  DollarSign,
  Calendar,
  Plus,
  ChevronRight,
  Star,
  Activity,
  Zap,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  DollarSign as DollarSignIcon,
  UserPlus,
  CalendarCheck,
  Briefcase,
  CalendarDays,
  Star as StarIcon,
} from "lucide-react";

interface DashboardStats {
  totalSessions: number;
  activeSessions: number;
  totalStudents: number;
  totalEarnings: number;
  pendingApplications: number;
  totalEnrollments: number;
  completionRate: number;
  upcomingSessionsCount: number;
  averageRating?: number;
  totalReviews?: number;
}

interface SessionDisplay {
  id: number;
  uuid: string;
  name: string;
  enrolled: number;
  status: string;
  subject: string;
  level: string;
  session_code: string;
  start_date?: string;
  end_date?: string;
  max_students?: number;
  current_enrollment?: number;
}

interface UpcomingSessionDisplay {
  id: number;
  uuid: string;
  title: string;
  subject: string;
  session_code: string;
  date: string;
  time: string;
  start_time?: string;
  end_time?: string;
  status: string;
  enrolled_count?: number;
  max_students?: number;
}

interface Activity {
  id: number;
  type: "enrollment" | "payment" | "session" | "review";
  description: string;
  timestamp: string;
  metadata?: any;
}

const formatDisplayName = (
  firstName?: string,
  lastName?: string,
  fullName?: string,
): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName.charAt(0)}.`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else if (fullName) {
    const nameParts = fullName.trim().split(" ");
    if (nameParts.length > 1) {
      const firstName = nameParts[0];
      const lastNamePart = nameParts[nameParts.length - 1];
      return `${firstName} ${lastNamePart.charAt(0)}.`;
    } else {
      return nameParts[0];
    }
  }
  return "Tutor";
};

const getLevelDisplay = (level?: string): string => {
  const levelMap: Record<string, string> = {
    primary: "Primary",
    junior_high: "Junior High",
    senior_high: "Senior High",
    university: "University",
    adult: "Adult",
  };
  return level && levelMap[level] ? levelMap[level] : "Not specified";
};

export default function TutorDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    activeSessions: 0,
    totalStudents: 0,
    totalEarnings: 0,
    pendingApplications: 0,
    totalEnrollments: 0,
    completionRate: 0,
    upcomingSessionsCount: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [recentSessions, setRecentSessions] = useState<SessionDisplay[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<
    UpcomingSessionDisplay[]
  >([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [tutorName, setTutorName] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        sessionsResponse,
        upcomingResponse,
        statsResponse,
        earningsResponse,
        userStatusResponse,
        tutorProfileResponse,
      ] = await Promise.allSettled([
        tutorApi.getSessions({ limit: 5 }),
        tutorApi.getSessions({ enrollment_status: "open", limit: 5 }),
        tutorApi.getDashboardStats(),
        tutorEarningsApi.getOverview(),
        userApi.getUserStatus(),
        tutorApi.getTutorProfile(),
      ]);

      // Process sessions (recent sessions)
      if (
        sessionsResponse.status === "fulfilled" &&
        sessionsResponse.value.success
      ) {
        const sessionsData = sessionsResponse.value.data;
        const formattedSessions: SessionDisplay[] = (
          sessionsData.sessions || []
        ).map((session: TutorSession) => ({
          id: session.id,
          uuid: session.uuid,
          name: session.name,
          enrolled: session.current_enrollment || 0,
          status: session.session_status,
          subject: session.subject,
          level: getLevelDisplay(session.level), // Fixed: session.level is now typed
          session_code: session.session_code,
          start_date: session.start_date,
          end_date: session.end_date,
          max_students: session.max_students,
          current_enrollment: session.current_enrollment,
        }));
        setRecentSessions(formattedSessions);
        setStats((prev) => ({
          ...prev,
          totalSessions: sessionsData.total || 0,
        }));
      }

      // Process upcoming sessions
      if (
        upcomingResponse.status === "fulfilled" &&
        upcomingResponse.value.success
      ) {
        const sessionsData = upcomingResponse.value.data;
        const formattedSessions: UpcomingSessionDisplay[] = (
          sessionsData.sessions || []
        ).map((session: TutorSession) => ({
          id: session.id,
          uuid: session.uuid,
          title: session.name,
          subject: session.subject,
          session_code: session.session_code,
          date: formatDate(session.start_date),
          time: formatTimeRange(session.start_date, session.end_date),
          start_time: session.start_date,
          end_time: session.end_date,
          status: session.session_status,
          enrolled_count: session.current_enrollment,
          max_students: session.max_students,
        }));
        setUpcomingSessions(formattedSessions);
        setStats((prev) => ({
          ...prev,
          activeSessions: sessionsData.total || 0,
          upcomingSessionsCount: sessionsData.total || 0,
        }));
      }

      // Process dashboard stats
      if (statsResponse.status === "fulfilled" && statsResponse.value.success) {
        const statsData = statsResponse.value.data;
        setStats((prev) => ({
          ...prev,
          totalStudents: statsData.totalStudents || prev.totalStudents,
          totalEarnings: statsData.totalEarnings || prev.totalEarnings,
          pendingApplications: statsData.pendingApplications || 0,
        }));
      }

      // Process earnings - use this for additional stats
      if (
        earningsResponse.status === "fulfilled" &&
        earningsResponse.value.success
      ) {
        const earningsData = earningsResponse.value.data;
        setStats((prev) => ({
          ...prev,
          totalEarnings: earningsData?.total_earned || prev.totalEarnings,
          totalEnrollments:
            earningsData?.total_students || prev.totalEnrollments,
          completionRate: earningsData?.completion_rate || prev.completionRate,
          averageRating: earningsData?.average_rating || prev.averageRating,
          totalReviews: earningsData?.total_reviews || prev.totalReviews,
        }));
      }

      // Process user status for recent activity
      if (
        userStatusResponse.status === "fulfilled" &&
        userStatusResponse.value.success
      ) {
        const userData = userStatusResponse.value.data;

        if (userData.recentActivity) {
          const activities = userData.recentActivity.map(
            (activity: any, index: number) => {
              let type: Activity["type"] = "session";
              if (activity.action.includes("enroll")) {
                type = "enrollment";
              } else if (activity.action.includes("pay")) {
                type = "payment";
              } else if (activity.action.includes("session")) {
                type = "session";
              } else if (activity.action.includes("review")) {
                type = "review";
              }

              return {
                id: index,
                type: type,
                description: formatActivityDescription(activity),
                timestamp: formatRelativeTime(activity.created_at),
                metadata: activity.metadata,
              };
            },
          );
          setRecentActivity(activities.slice(0, 5));
        }

        setTutorName((prevName) => {
          if (prevName) return prevName;
          let firstName = "";
          let lastName = "";

          if (userData.tutorData?.profile) {
            firstName = userData.tutorData.profile.first_name || "";
            lastName = userData.tutorData.profile.last_name || "";
          } else if (userData.tutorData) {
            firstName = userData.tutorData.first_name || "";
            lastName = userData.tutorData.last_name || "";
          } else if (userData.user) {
            firstName = userData.user.first_name || "";
            lastName = userData.user.last_name || "";
          }

          let displayName = "";
          if (firstName && lastName) {
            displayName = `${firstName} ${lastName.charAt(0)}.`;
          } else if (firstName) {
            displayName = firstName;
          } else if (lastName) {
            displayName = lastName;
          }
          return displayName || "Tutor";
        });
      }

      // Process tutor profile for name
      if (
        tutorProfileResponse.status === "fulfilled" &&
        tutorProfileResponse.value.success
      ) {
        const profileData = tutorProfileResponse.value.data;
        let firstName = "";
        let lastName = "";
        let fullName = "";

        if (profileData.first_name) firstName = profileData.first_name;
        else if (profileData.official_first_name)
          firstName = profileData.official_first_name;
        else if (profileData.profile?.first_name)
          firstName = profileData.profile.first_name;

        if (profileData.last_name) lastName = profileData.last_name;
        else if (profileData.official_last_name)
          lastName = profileData.official_last_name;
        else if (profileData.profile?.last_name)
          lastName = profileData.profile.last_name;

        if (profileData.name) fullName = profileData.name;
        else if (profileData.full_name) fullName = profileData.full_name;
        else if (profileData.display_name) fullName = profileData.display_name;

        let displayName = "";
        if (firstName && lastName) {
          displayName = `${firstName} ${lastName.charAt(0)}.`;
        } else if (firstName) {
          displayName = firstName;
        } else if (lastName) {
          displayName = lastName;
        } else if (fullName) {
          const nameParts = fullName.trim().split(" ");
          if (nameParts.length > 1) {
            const firstNamePart = nameParts[0];
            const lastNamePart = nameParts[nameParts.length - 1];
            displayName = `${firstNamePart} ${lastNamePart.charAt(0)}.`;
          } else {
            displayName = nameParts[0];
          }
        }

        if (displayName) {
          setTutorName(displayName);
        } else {
          setTutorName((prev) => prev || "Tutor");
        }
      }

      setTutorName((prev) => prev || "Tutor");
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatActivityDescription = (activity: any): string => {
    const action = activity.action;
    const metadata = activity.metadata || {};

    if (action.includes("session_created"))
      return `Created new session: ${metadata.session_name || ""}`;
    if (action.includes("session_scheduled"))
      return `Scheduled session: ${metadata.session_name || ""}`;
    if (action.includes("enrollment_completed"))
      return `New student enrolled in ${metadata.session_name || ""}`;
    if (action.includes("payment_received"))
      return `Payment received: KES ${metadata.amount || 0}`;
    if (action.includes("review_received"))
      return `New ${metadata.rating || ""}-star review received`;

    return action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startTime = startDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const endTime = endDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${startTime} - ${endTime}`;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleJoinSession = async (sessionUuid: string) => {
    try {
      toast.loading("Preparing your session...", { id: "join-session" });

      const response = await tutorApi.joinSession(sessionUuid);

      if (response.success && response.data.meeting_link) {
        toast.success("Joining session...", { id: "join-session" });
        window.open(response.data.meeting_link, "_blank");
      } else {
        toast.error("Unable to join session at this time", {
          id: "join-session",
        });
      }
    } catch (error) {
      console.error("Failed to join session:", error);
      toast.error("Failed to join session", { id: "join-session" });
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      scheduled: "bg-purple-50 text-purple-700 border-purple-200",
      ongoing: "bg-amber-50 text-amber-700 border-amber-200",
      completed: "bg-indigo-50 text-indigo-700 border-indigo-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      open: "bg-emerald-50 text-emerald-700 border-emerald-200",
      waiting_list: "bg-blue-50 text-blue-700 border-blue-200",
      closed: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return statusMap[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case "payment":
        return <DollarSignIcon className="w-4 h-4 text-blue-600" />;
      case "session":
        return <CalendarCheck className="w-4 h-4 text-purple-600" />;
      case "review":
        return <StarIcon className="w-4 h-4 text-yellow-600" />;
      default:
        return <Briefcase className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case "enrollment":
        return "bg-emerald-100";
      case "payment":
        return "bg-blue-100";
      case "session":
        return "bg-purple-100";
      case "review":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  const statCards = [
    {
      title: "Total Sessions",
      value: stats.totalSessions,
      icon: BookOpen,
      change: "+2",
      changeType: "increase",
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/tutor/sessions",
    },
    {
      title: "Active Sessions",
      value: stats.activeSessions,
      icon: Target,
      subtext: `${stats.upcomingSessionsCount} upcoming`,
      bgLight: "bg-emerald-50",
      iconColor: "text-emerald-600",
      link: "/tutor/sessions",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      subtext: `${stats.totalEnrollments} enrollments`,
      bgLight: "bg-purple-50",
      iconColor: "text-purple-600",
      link: "/tutor/enrollments",
    },
    {
      title: "Total Earnings",
      value: formatCurrency(stats.totalEarnings),
      icon: DollarSignIcon,
      subtext: `${stats.completionRate}% completion`,
      bgLight: "bg-amber-50",
      iconColor: "text-amber-600",
      link: "/tutor/earnings",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={["tutor"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-2xl font-semibold text-gray-900">
              {greeting}, {tutorName || "Tutor"}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {stats.pendingApplications > 0
                ? `You have ${stats.pendingApplications} pending application${stats.pendingApplications > 1 ? "s" : ""} to review`
                : stats.upcomingSessionsCount > 0
                  ? `You have ${stats.upcomingSessionsCount} upcoming session${stats.upcomingSessionsCount > 1 ? "s" : ""}`
                  : "Ready to start teaching? Create your first session!"}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/tutor/sessions/create"
              className="inline-flex items-center px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/25"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Session
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
                  {stat.change && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        stat.changeType === "increase"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {stat.changeType === "increase" ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {stat.change}
                    </span>
                  )}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Sessions */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Recent Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Recent Sessions
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Your latest created sessions
                    </p>
                  </div>
                  <Link
                    href="/tutor/sessions"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() =>
                        router.push(`/tutor/sessions/${session.uuid}`)
                      }
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {session.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {session.subject} • {session.level} • Code:{" "}
                                {session.session_code}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border w-fit ${getStatusColor(session.status)}`}
                            >
                              {session.status.charAt(0).toUpperCase() +
                                session.status.slice(1)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{session.enrolled} students</span>
                            </div>
                            {session.start_date && (
                              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                                <CalendarDays className="w-4 h-4" />
                                <span>{formatDate(session.start_date)}</span>
                              </div>
                            )}
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
                      No sessions yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start your teaching journey by creating your first session
                    </p>
                    <Link
                      href="/tutor/sessions/create"
                      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Session
                    </Link>
                  </div>
                )}
              </div>
            </div>

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
                    href="/tutor/sessions"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex flex-col items-center justify-center flex-shrink-0 border border-blue-100">
                          <span className="text-xs font-medium text-blue-600">
                            {session.date === "Today"
                              ? "TODAY"
                              : session.date === "Tomorrow"
                                ? "TOM"
                                : session.date.split(" ")[0]}
                          </span>
                          <span className="text-base sm:text-lg font-semibold text-blue-700">
                            {session.date === "Today" ||
                            session.date === "Tomorrow"
                              ? session.time.split("-")[0].trim()
                              : session.date.split(" ")[1]}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {session.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {session.subject} • Code: {session.session_code}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border w-fit ${getStatusColor(session.status)}`}
                            >
                              {session.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{session.time}</span>
                            </div>
                            {session.enrolled_count !== undefined && (
                              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>
                                  {session.enrolled_count}/
                                  {session.max_students || "∞"} enrolled
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {session.date === "Today" && (
                            <button
                              onClick={() => handleJoinSession(session.uuid)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Join Now
                            </button>
                          )}
                          <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <CalendarDays className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No upcoming sessions
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Schedule your first session to start teaching
                    </p>
                    <Link
                      href="/tutor/sessions/create"
                      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule a Session
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Activity and Quick Actions */}
          <div className="space-y-6 sm:space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
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
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityBg(activity.type)}`}
                        >
                          {getActivityIcon(activity.type)}
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
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Activity className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">No recent activity</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Link
                  href="/tutor/activity"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
                >
                  View All Activity
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Quick Actions
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Frequently used tools
                </p>
              </div>

              <div className="p-4 grid grid-cols-2 gap-3">
                <Link
                  href="/tutor/sessions/create"
                  className="group p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all text-center border border-purple-100"
                >
                  <CalendarDays className="w-6 h-6 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-gray-900 text-sm">
                    New Session
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Create</p>
                </Link>

                <Link
                  href="/tutor/enrollments"
                  className="group p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg hover:shadow-md transition-all text-center border border-emerald-100"
                >
                  <Users className="w-6 h-6 mx-auto mb-2 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-gray-900 text-sm">Students</p>
                  <p className="text-xs text-gray-500 mt-1">Manage</p>
                </Link>

                <Link
                  href="/tutor/earnings"
                  className="group p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg hover:shadow-md transition-all text-center border border-amber-100"
                >
                  <DollarSignIcon className="w-6 h-6 mx-auto mb-2 text-amber-600 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-gray-900 text-sm">Earnings</p>
                  <p className="text-xs text-gray-500 mt-1">Reports</p>
                </Link>

                <Link
                  href="/tutor/schedule"
                  className="group p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all text-center border border-blue-100"
                >
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-gray-900 text-sm">Schedule</p>
                  <p className="text-xs text-gray-500 mt-1">View</p>
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
                    Check out our tutor resources and FAQs
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
