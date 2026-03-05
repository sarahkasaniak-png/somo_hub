// src/app/student/schedule/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import studentApi from "@/lib/api/student";
import {
  Calendar,
  Clock,
  Video,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  XCircle,
  Loader2,
  CalendarDays,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Info,
  Users,
  BookOpen,
  MapPinned,
  Wifi,
  Copy,
  Check,
} from "lucide-react";

interface Schedule {
  id: number;
  tutor_course_session_id: number;
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
  location: string | null;
  topics: string[];
  learning_objectives: string[];
  materials: string[];
  recorded_session_url: string | null;
  attendance_taken: boolean;

  // Joined fields
  course_title?: string;
  course_subject?: string;
  session_name?: string;
  session_code?: string;
  tutor_name?: string;
}

export default function StudentSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [groupedSchedules, setGroupedSchedules] = useState<
    Record<string, Schedule[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    groupSchedulesByDate();
  }, [schedules]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getUpcomingSessions(50);

      if (response.success) {
        setSchedules(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      toast.error("Failed to load your schedule");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSchedules();
    toast.success("Schedule refreshed");
  };

  const groupSchedulesByDate = () => {
    const grouped: Record<string, Schedule[]> = {};

    schedules.forEach((schedule) => {
      if (!grouped[schedule.date]) {
        grouped[schedule.date] = [];
      }
      grouped[schedule.date].push(schedule);
    });

    // Sort schedules within each day by time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });

    setGroupedSchedules(grouped);
  };

  const handleJoinSession = async (scheduleId: number) => {
    try {
      setJoiningId(scheduleId);
      const response = await studentApi.joinSession(scheduleId);

      if (response.success && response.data?.meeting_link) {
        window.open(response.data?.meeting_link, "_blank");
        toast.success("Joining session...");
        setTimeout(() => fetchSchedules(), 2000);
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
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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
      rescheduled: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "Rescheduled",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.scheduled;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getModeBadge = (mode: string) => {
    const modeConfig = {
      virtual: {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
        icon: <Video className="w-3.5 h-3.5" />,
        label: "Virtual",
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
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const sortedDates = Object.keys(groupedSchedules).sort((a, b) =>
    a.localeCompare(b),
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-gray-900 font-medium">My Schedule</span>
          </div>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Classes</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {schedules.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">
            {schedules.filter((s) => s.status === "scheduled").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Live Now</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">
            {schedules.filter((s) => s.status === "ongoing").length}
          </p>
        </div>
      </div>

      {/* Schedule by Date */}
      {sortedDates.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const daySchedules = groupedSchedules[date];
            const today = isToday(date);

            return (
              <div
                key={date}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div
                  className={`px-6 py-4 border-b border-gray-200 ${today ? "bg-amber-50" : "bg-gray-50"}`}
                >
                  <h2 className="text-lg font-semibold text-gray-900">
                    {formatDate(date)}
                    {today && (
                      <span className="ml-2 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        Today
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {daySchedules.length} class
                    {daySchedules.length !== 1 ? "es" : ""}
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {daySchedules.map((schedule) => {
                    const canJoin = ["scheduled", "ongoing"].includes(
                      schedule.status,
                    );
                    const isOngoing = schedule.status === "ongoing";

                    return (
                      <div
                        key={schedule.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          {/* Left side - Class info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              {/* Time Icon */}
                              <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  isOngoing
                                    ? "bg-green-100"
                                    : today
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
                                  {schedule.course_title} • Class{" "}
                                  {schedule.class_number}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 mt-3">
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
                                    <BookOpen className="w-4 h-4" />
                                    <span>{schedule.session_name}</span>
                                  </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                  {getStatusBadge(schedule.status)}
                                  {getModeBadge(schedule.mode)}
                                  {schedule.location &&
                                    schedule.mode === "in_person" && (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200">
                                        <MapPinned className="w-3.5 h-3.5" />
                                        {schedule.location}
                                      </span>
                                    )}
                                </div>

                                {/* Topics */}
                                {schedule.topics &&
                                  schedule.topics.length > 0 && (
                                    <div className="mt-3">
                                      <p className="text-xs text-gray-500 mb-1">
                                        Topics:
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {schedule.topics.map((topic, index) => (
                                          <span
                                            key={index}
                                            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                                          >
                                            {topic}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>

                          {/* Right side - Actions */}
                          <div className="flex items-center gap-2 lg:self-center">
                            {canJoin && (
                              <button
                                onClick={() => handleJoinSession(schedule.id)}
                                disabled={joiningId === schedule.id}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  isOngoing
                                    ? "bg-green-600 text-white hover:bg-green-700 animate-pulse"
                                    : today
                                      ? "bg-amber-600 text-white hover:bg-amber-700"
                                      : "bg-blue-600 text-white hover:bg-blue-700"
                                } disabled:opacity-50`}
                              >
                                {joiningId === schedule.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : isOngoing ? (
                                  "Join Live"
                                ) : today ? (
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

                            <Link
                              href={`/student/sessions/${schedule.tutor_course_session_id}`}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                              title="View session details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>

                        {/* Recorded session link */}
                        {schedule.status === "completed" &&
                          schedule.recorded_session_url && (
                            <div className="mt-4 pt-3 border-t border-gray-100">
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
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No upcoming classes
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You don't have any scheduled classes at the moment. Enroll in a
            course to get started!
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
