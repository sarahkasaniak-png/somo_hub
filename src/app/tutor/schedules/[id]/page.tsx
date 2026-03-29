// src/app/tutor/sessions/[id]/schedules/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi from "@/lib/api/tutor";
import {
  Calendar,
  Clock,
  Video,
  ChevronRight,
  ArrowLeft,
  PlayCircle,
  CheckCircle,
  XCircle,
  Loader2,
  CalendarDays,
  MapPinned,
  Wifi,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Users,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Info,
  Edit,
  Trash2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

// Make these fields optional to match TutorSessionSchedule
interface ClassSchedule {
  id: number;
  class_number: number;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled" | "rescheduled";
  meeting_link: string | null;
  student_meeting_link?: string | null; // Made optional
  attendance_taken: boolean;
  recorded_session_url: string | null;
  topics: string[];
  learning_objectives: string[];
  materials: string[];
  assignments: any[];
}

interface SessionInfo {
  id: number;
  uuid: string;
  name: string;
  session_code: string;
  subject: string;
  start_date: string;
  end_date: string;
  session_type: string;
  batch_name: string | null;
  max_students: number;
  current_enrollment: number;
}

export default function SessionSchedulesPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(
    null,
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    fetchSessionAndSchedules();
  }, [sessionId]);

  const fetchSessionAndSchedules = async () => {
    try {
      setLoading(true);

      // Fetch session details
      const sessionResponse = await tutorApi.getSession(sessionId);
      if (sessionResponse.success) {
        const sessionData = sessionResponse.data;
        setSession({
          id: sessionData.id,
          uuid: sessionData.uuid,
          name: sessionData.name,
          session_code: sessionData.session_code,
          subject: sessionData.subject,
          start_date: sessionData.start_date,
          end_date: sessionData.end_date,
          session_type: sessionData.session_type,
          batch_name: sessionData.batch_name,
          max_students: sessionData.max_students,
          current_enrollment: sessionData.current_enrollment,
        });

        // Fetch schedules for this session
        const schedulesResponse = await tutorApi.schedules.getSessionSchedules(
          sessionData.id,
        );
        if (schedulesResponse.success) {
          // Map TutorSessionSchedule to ClassSchedule, handling optional fields
          const mappedSchedules: ClassSchedule[] = schedulesResponse.data.map(
            (schedule: any) => ({
              id: schedule.id,
              class_number: schedule.class_number,
              title: schedule.title,
              description: schedule.description || null,
              date: schedule.date,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              duration_minutes: schedule.duration_minutes,
              status: schedule.status,
              meeting_link: schedule.meeting_link || null,
              student_meeting_link: schedule.student_meeting_link,
              attendance_taken: schedule.attendance_taken || false,
              recorded_session_url: schedule.recorded_session_url || null,
              topics: schedule.topics || [],
              learning_objectives: schedule.learning_objectives || [],
              materials: schedule.materials || [],
              assignments: schedule.assignments || [],
            }),
          );
          setSchedules(mappedSchedules);
        }
      }
    } catch (error) {
      console.error("Failed to fetch session schedules:", error);
      toast.error("Failed to load class schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (scheduleId: number) => {
    try {
      setJoiningId(scheduleId);
      const response =
        await tutorApi.schedules.joinScheduledSession(scheduleId);

      if (response.success && response.data.meeting_link) {
        window.open(response.data.meeting_link, "_blank");
        toast.success("Joining class...");
      } else {
        toast.error("Meeting link not available");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to join class");
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
        year: "numeric",
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

  const isPast = (dateString: string, startTime: string) => {
    const classDateTime = new Date(`${dateString}T${startTime}`);
    return classDateTime < new Date();
  };

  const getStatusBadge = (status: string, date: string, startTime: string) => {
    if (status === "ongoing") {
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: <PlayCircle className="w-3.5 h-3.5" />,
        label: "Live Now",
      };
    }
    if (status === "completed") {
      return {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: "Completed",
      };
    }
    if (status === "cancelled") {
      return {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: <XCircle className="w-3.5 h-3.5" />,
        label: "Cancelled",
      };
    }
    if (isPast(date, startTime)) {
      return {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "Past",
      };
    }
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: <Calendar className="w-3.5 h-3.5" />,
      label: "Scheduled",
    };
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

  const getFilteredSchedules = () => {
    if (filter === "all") return schedules;
    if (filter === "upcoming") {
      return schedules.filter(
        (s) =>
          !isPast(s.date, s.start_time) &&
          s.status !== "cancelled" &&
          s.status !== "completed",
      );
    }
    if (filter === "past") {
      return schedules.filter(
        (s) => isPast(s.date, s.start_time) || s.status === "completed",
      );
    }
    return schedules;
  };

  const ClassCard = ({ classItem }: { classItem: ClassSchedule }) => {
    const classIsToday = isToday(classItem.date);
    const classIsPast = isPast(classItem.date, classItem.start_time);
    const statusConfig = getStatusBadge(
      classItem.status,
      classItem.date,
      classItem.start_time,
    );
    const canJoin =
      (classItem.status === "scheduled" || classItem.status === "ongoing") &&
      !classIsPast;
    const hasStudents =
      session?.current_enrollment && session.current_enrollment > 0;

    return (
      <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            classItem.status === "ongoing"
              ? "bg-emerald-500"
              : classItem.status === "cancelled"
                ? "bg-rose-500"
                : classIsToday
                  ? "bg-amber-500"
                  : "bg-blue-500"
          }`}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-main/10 to-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-main" />
                </div>
                {classIsToday && !classIsPast && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    Class {classItem.class_number}
                  </h3>
                  {classIsToday && !classIsPast && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{classItem.title}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              {/* Date & Time */}
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span
                    className={`text-gray-700 ${classIsToday ? "font-medium text-amber-700" : ""}`}
                  >
                    {formatDate(classItem.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {formatTime(classItem.start_time)} -{" "}
                    {formatTime(classItem.end_time)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({classItem.duration_minutes} min)
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>

                {!hasStudents && canJoin && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Users className="w-3.5 h-3.5" />
                    No Students
                  </span>
                )}
              </div>

              {/* Description */}
              {classItem.description && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {classItem.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 lg:self-center">
              {canJoin && hasStudents && (
                <button
                  onClick={() => handleJoinClass(classItem.id)}
                  disabled={joiningId === classItem.id}
                  className={`px-4 py-3 rounded-xl transition-all inline-flex items-center gap-2 ${
                    classItem.status === "ongoing"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 animate-pulse"
                      : classIsToday
                        ? "bg-amber-600 text-white hover:bg-amber-700"
                        : "bg-main text-white hover:bg-purple-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {joiningId === classItem.id ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {classItem.status === "ongoing"
                          ? "Join Live"
                          : "Join Class"}
                      </span>
                    </>
                  )}
                </button>
              )}

              {classItem.meeting_link && canJoin && hasStudents && (
                <button
                  onClick={() =>
                    handleCopyLink(classItem.meeting_link!, classItem.id)
                  }
                  className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  title="Copy meeting link"
                >
                  {copiedId === classItem.id ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedClass(classItem);
                  setShowDetailsModal(true);
                }}
                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                title="View details"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Info message for classes with no students */}
          {!hasStudents && canJoin && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                You can join once at least one student is enrolled
              </p>
            </div>
          )}
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

  const filteredSchedules = getFilteredSchedules();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
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
            <Link
              href={`/tutor/sessions/${session.uuid}`}
              className="hover:text-main transition-colors"
            >
              {session.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Class Schedules</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/tutor/sessions/${session.uuid}`}
                  className="p-2 hover:bg-white rounded-xl transition-colors group"
                  title="Back to Session"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-main transition-colors" />
                </Link>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Class Schedules
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {session.name} • {session.session_code}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchSessionAndSchedules()}
                disabled={loading}
                className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Classes</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {schedules.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Upcoming</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {
                schedules.filter(
                  (s) =>
                    !isPast(s.date, s.start_time) && s.status !== "cancelled",
                ).length
              }
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {
                schedules.filter(
                  (s) =>
                    s.status === "completed" || isPast(s.date, s.start_time),
                ).length
              }
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Enrolled Students</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {session.current_enrollment}/{session.max_students}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-main text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Classes
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "upcoming"
                  ? "bg-main text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "past"
                  ? "bg-main text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Class List */}
        {filteredSchedules.length > 0 ? (
          <div className="space-y-4">
            {filteredSchedules.map((classItem) => (
              <ClassCard key={classItem.id} classItem={classItem} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No classes found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filter === "all"
                ? "No class schedules have been generated for this session yet."
                : filter === "upcoming"
                  ? "No upcoming classes found."
                  : "No past classes found."}
            </p>
          </div>
        )}
      </div>

      {/* Class Details Modal */}
      {showDetailsModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Class {selectedClass.class_number}: {selectedClass.title}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {new Date(selectedClass.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {formatTime(selectedClass.start_time)} -{" "}
                    {formatTime(selectedClass.end_time)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {selectedClass.duration_minutes} minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {(() => {
                      const statusConfig = getStatusBadge(
                        selectedClass.status,
                        selectedClass.date,
                        selectedClass.start_time,
                      );
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedClass.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedClass.description}
                  </p>
                </div>
              )}

              {/* Topics */}
              {selectedClass.topics && selectedClass.topics.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Topics Covered</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedClass.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Objectives */}
              {selectedClass.learning_objectives &&
                selectedClass.learning_objectives.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Learning Objectives
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedClass.learning_objectives.map((obj, idx) => (
                        <li key={idx} className="text-gray-700">
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Materials */}
              {selectedClass.materials &&
                selectedClass.materials.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Materials</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedClass.materials.map((material, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Meeting Links */}
              {(selectedClass.meeting_link ||
                selectedClass.recorded_session_url) && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Meeting Information
                  </p>
                  <div className="space-y-2">
                    {selectedClass.meeting_link && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Meeting Link
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-md">
                            {selectedClass.meeting_link}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleCopyLink(
                              selectedClass.meeting_link!,
                              selectedClass.id,
                            )
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {copiedId === selectedClass.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                    {selectedClass.recorded_session_url && (
                      <a
                        href={selectedClass.recorded_session_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Recording
                          </p>
                          <p className="text-xs text-gray-500">
                            Watch recorded session
                          </p>
                        </div>
                        <Video className="w-4 h-4 text-main" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Attendance */}
              {selectedClass.attendance_taken && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                      Attendance has been taken for this class
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {!isPast(selectedClass.date, selectedClass.start_time) &&
                  selectedClass.status !== "completed" &&
                  selectedClass.status !== "cancelled" &&
                  session.current_enrollment > 0 && (
                    <button
                      onClick={() => {
                        handleJoinClass(selectedClass.id);
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-main text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      Join Class
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
