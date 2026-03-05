// src/app/tutor/schedules/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi from "@/lib/api/tutor";
import type { TutorSessionSchedule } from "@/lib/api/tutor";
import {
  Calendar,
  Clock,
  Video,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  MapPinned,
  Wifi,
  MapPin,
  ArrowRight,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Users,
  GraduationCap,
  BookOpen,
  ExternalLink,
  MoreVertical,
  Copy,
  Check,
  RefreshCw,
  Info,
} from "lucide-react";
interface ScheduleResponse {
  success: boolean;
  data?:
    | TutorSessionSchedule[]
    | {
        data?: TutorSessionSchedule[];
        schedules?: TutorSessionSchedule[];
      };
  message?: string;
}

export default function TutorSchedulesPage() {
  const [todaySchedules, setTodaySchedules] = useState<TutorSessionSchedule[]>(
    [],
  );
  const [upcomingSchedules, setUpcomingSchedules] = useState<
    TutorSessionSchedule[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    todayCount: 0,
    liveNow: 0,
    upcomingCount: 0,
    thisWeekCount: 0,
    totalCount: 0,
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    // Update stats whenever schedules change
    updateStats();
  }, [todaySchedules, upcomingSchedules]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const [todayRes, upcomingRes] = await Promise.all([
        tutorApi.schedules.getTodaySchedules() as Promise<ScheduleResponse>,
        tutorApi.schedules.getUpcomingSchedules(
          10,
        ) as Promise<ScheduleResponse>,
      ]);
      // Safely extract data from responses
      if (todayRes.success) {
        // Handle different possible response structures
        let todayData: TutorSessionSchedule[] = [];

        if (todayRes.data) {
          if (Array.isArray(todayRes.data)) {
            todayData = todayRes.data;
          } else if (typeof todayRes.data === "object") {
            todayData = todayRes.data.data || todayRes.data.schedules || [];
          }
        }

        setTodaySchedules(todayData);
      } else {
        setTodaySchedules([]);
      }

      if (upcomingRes.success) {
        // Handle different possible response structures
        let upcomingData: TutorSessionSchedule[] = [];

        if (upcomingRes.data) {
          if (Array.isArray(upcomingRes.data)) {
            upcomingData = upcomingRes.data;
          } else if (typeof upcomingRes.data === "object") {
            upcomingData =
              upcomingRes.data.data || upcomingRes.data.schedules || [];
          }
        }

        setUpcomingSchedules(upcomingData);
      } else {
        setUpcomingSchedules([]);
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      toast.error("Failed to load schedules");
      setTodaySchedules([]);
      setUpcomingSchedules([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSchedules();
    toast.success("Schedules refreshed");
  };

  const updateStats = () => {
    const todayCount = todaySchedules.length;
    const liveNow = todaySchedules.filter((s) => s.status === "ongoing").length;
    const upcomingCount = upcomingSchedules.length;

    // Calculate this week's count
    const allSchedules = [...todaySchedules, ...upcomingSchedules];
    const thisWeekCount = allSchedules.filter((s) => {
      const date = new Date(s.date);
      const today = new Date();
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + (7 - today.getDay()));
      return date >= today && date <= weekEnd;
    }).length;

    setStats({
      todayCount,
      liveNow,
      upcomingCount,
      thisWeekCount,
      totalCount: allSchedules.length,
    });
  };

  const handleJoinSession = async (scheduleId: number) => {
    try {
      setJoiningId(scheduleId);
      const response =
        await tutorApi.schedules.joinScheduledSession(scheduleId);

      if (response.success && response.data?.meeting_link) {
        window.open(response.data.meeting_link, "_blank");
        toast.success("Joining session...");
        setTimeout(() => fetchSchedules(), 2000);
      } else {
        toast.error("Meeting link not available");
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

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: <Calendar className="w-3.5 h-3.5" />,
        label: "Scheduled",
      },
      ongoing: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: <PlayCircle className="w-3.5 h-3.5" />,
        label: "Live Now",
      },
      completed: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: "Completed",
      },
      cancelled: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: <XCircle className="w-3.5 h-3.5" />,
        label: "Cancelled",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.scheduled;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getModeBadge = (mode: string, platform?: string) => {
    const modeConfig = {
      virtual: {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
        icon: <Video className="w-3.5 h-3.5" />,
        label: platform ? platform.replace("_", " ") : "Virtual",
      },
      in_person: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: <MapPinned className="w-3.5 h-3.5" />,
        label: "In Person",
      },
      hybrid: {
        bg: "bg-teal-50",
        text: "text-teal-700",
        border: "border-teal-200",
        icon: <Wifi className="w-3.5 h-3.5" />,
        label: "Hybrid",
      },
    };

    const config =
      modeConfig[mode as keyof typeof modeConfig] || modeConfig.virtual;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Updated ScheduleCard component with right-aligned actions

  // Compact version with icons only
  const ScheduleCard = ({ schedule }: { schedule: TutorSessionSchedule }) => {
    const scheduleIsToday = isToday(schedule.date);
    const canJoin =
      schedule.status === "scheduled" || schedule.status === "ongoing";
    const isOngoing = schedule.status === "ongoing";

    return (
      <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Status Indicator Line */}
        <div
          className={`h-[1px] absolute top-0 left-0 right-0 h-1 ${
            isOngoing
              ? "bg-emerald-500"
              : schedule.status === "scheduled"
                ? "bg-blue-500"
                : schedule.status === "completed"
                  ? "bg-purple-500"
                  : "bg-rose-500"
          }`}
        />

        <div className="p-6">
          {/* Header with Course Info */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-main/10 to-purple-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-main" />
                </div>
                {scheduleIsToday && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {schedule.course_title || "Course"}
                  </h3>
                  {scheduleIsToday && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {schedule.session_name || "Session"}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left side - Class info */}
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {schedule.title}
              </h4>

              {/* Date & Time */}
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span
                    className={`text-gray-700 ${scheduleIsToday ? "font-medium text-amber-700" : ""}`}
                  >
                    {formatDate(schedule.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {formatTime(schedule.start_time)} -{" "}
                    {formatTime(schedule.end_time)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({schedule.duration_minutes} min)
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(schedule.status)}
                {getModeBadge(schedule.mode)}
              </div>
            </div>

            {/* Right side - Action Buttons */}
            <div className="flex items-center gap-2 lg:self-center ">
              {canJoin && (
                <button
                  onClick={() => handleJoinSession(schedule.id)}
                  disabled={joiningId === schedule.id}
                  className={`cursor-pointer flex items-center gap-2 p-3 rounded-xl transition-all ${
                    isOngoing
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 animate-pulse"
                      : scheduleIsToday
                        ? "bg-amber-600 text-white hover:bg-amber-700"
                        : "bg-main text-white hover:bg-purple-700"
                  } disabled:opacity-50`}
                  title={
                    isOngoing
                      ? "Join Live"
                      : scheduleIsToday
                        ? "Join Today"
                        : "Join Class"
                  }
                >
                  {joiningId === schedule.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      <span className="text-sm font-medium">Join Class</span>
                    </>
                  )}
                </button>
              )}

              {/* {schedule.meeting_link && (
                <button
                  onClick={() =>
                    handleCopyLink(schedule.meeting_link!, schedule.id)
                  }
                  className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  title="Copy link"
                >
                  {copiedId === schedule.id ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              )} */}

              <Link
                href={`/tutor/sessions/${schedule.tutor_course_session_id}/schedules`}
                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                title="View details"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>

              <Link
                href={`/tutor/sessions/${schedule.tutor_course_session_id}`}
                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                title="View session"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
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
            <span className="text-gray-900 font-medium">My Schedule</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                My Class Schedule
              </h1>
              <p className="text-gray-600 mt-1">
                View and join your scheduled classes
              </p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Today's Classes</p>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.todayCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.liveNow} live now
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Upcoming</p>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.upcomingCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">Next 7 days</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">This Week</p>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.thisWeekCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">Total sessions</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Classes</p>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">Active courses</p>
          </div>
        </div>

        {/* Today's Classes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              Today's Classes
              {stats.todayCount > 0 && (
                <span className="ml-2 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  {stats.todayCount} class{stats.todayCount !== 1 ? "es" : ""}
                </span>
              )}
            </h2>
            <Link
              href="/tutor/sessions"
              className="text-sm text-main hover:text-purple-700 font-medium flex items-center gap-1 group"
            >
              View All Sessions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {todaySchedules.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {todaySchedules.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sun className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No classes scheduled for today
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Take a break or prepare for your upcoming classes. You have no
                sessions scheduled for today.
              </p>
              <Link
                href="/tutor/sessions/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm hover:shadow"
              >
                <Calendar className="w-4 h-4" />
                Create New Session
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Classes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-main" />
            Upcoming Classes
            {stats.upcomingCount > 0 && (
              <span className="ml-2 px-2.5 py-1 bg-main/10 text-main text-xs font-medium rounded-full">
                {stats.upcomingCount} upcoming
              </span>
            )}
          </h2>

          {upcomingSchedules.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {upcomingSchedules.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No upcoming classes scheduled
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start planning your next session. Create a new class to get
                started.
              </p>
              <Link
                href="/tutor/sessions/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm hover:shadow"
              >
                <Calendar className="w-4 h-4" />
                Create New Session
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
