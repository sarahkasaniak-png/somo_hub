// src/app/tutor/sessions/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi from "@/lib/api/tutor";
import ScheduleConfig from "../../create/components/ScheduleConfig";
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  Tag,
  Info,
  CalendarRange,
  Loader2,
  AlertCircle,
  Save,
  X,
  Video,
  MapPinned,
  Wifi,
  Globe,
  EyeOff,
  PlayCircle,
  CheckCircle,
  XCircle,
  Pencil,
  Trash,
  MoreHorizontal,
  ChevronDown,
  AlertTriangle,
  FileText,
  Timer,
  Hourglass,
} from "lucide-react";

interface ScheduleConfig {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface SessionData {
  id: number;
  tutor_course_id: number;
  name: string;
  description: string | null;
  batch_name: string | null;
  session_type: "one_on_one" | "group";
  max_students: number;
  start_date: string;
  end_date: string;
  fee_amount: number;
  fee_currency: string;
  status: string;
  enrollment_status: string;
  session_code: string;
  schedule_configs?: ScheduleConfig[];
}

interface CourseData {
  id: number;
  title: string;
  subject: string;
  description?: string;
}

export default function EditSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [scheduleConfigs, setScheduleConfigs] = useState<ScheduleConfig[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "schedule">("basic");
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    tutor_course_id: 0,
    name: "",
    description: "",
    batch_name: "",
    session_type: "group" as "one_on_one" | "group",
    max_students: 10,
    start_date: "",
    end_date: "",
    fee_amount: 0,
    fee_currency: "KES",
  });

  useEffect(() => {
    fetchData();
  }, [sessionId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch session details first
      const sessionResponse = await tutorApi.getSession(parseInt(sessionId));
      if (sessionResponse.success) {
        const sessionData = sessionResponse.data;
        setSession(sessionData);

        // Populate form data
        setFormData({
          tutor_course_id: sessionData.tutor_course_id,
          name: sessionData.name,
          description: sessionData.description || "",
          batch_name: sessionData.batch_name || "",
          session_type: sessionData.session_type,
          max_students: sessionData.max_students,
          start_date: sessionData.start_date.split("T")[0],
          end_date: sessionData.end_date.split("T")[0],
          fee_amount: sessionData.fee_amount,
          fee_currency: sessionData.fee_currency,
        });

        // Populate schedule configs
        if (sessionData.schedule_configs) {
          setScheduleConfigs(sessionData.schedule_configs);
        }

        // Fetch the specific course for this session
        const courseResponse = await tutorApi.getCourse(
          sessionData.tutor_course_id,
        );
        if (courseResponse.success) {
          setCourse(courseResponse.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load session details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "max_students" || name === "fee_amount"
          ? Number(value)
          : value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.name.trim()) {
      toast.error("Please enter a session name");
      return false;
    }

    if (!formData.start_date) {
      toast.error("Please select a start date");
      return false;
    }

    if (!formData.end_date) {
      toast.error("Please select an end date");
      return false;
    }

    if (scheduleConfigs.length === 0) {
      toast.error("Please add at least one class schedule");
      return false;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return false;
    }

    // Check if any schedule configs would actually generate classes
    let hasValidClasses = false;
    scheduleConfigs.forEach((config) => {
      const current = new Date(startDate);
      while (current <= endDate) {
        if (current.getDay() === config.day_of_week) {
          hasValidClasses = true;
          break;
        }
        current.setDate(current.getDate() + 1);
      }
    });

    if (!hasValidClasses) {
      toast.error(
        "No classes will be generated with the current schedule and date range.",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Format the schedule configs to remove seconds from time strings
      const formattedScheduleConfigs = scheduleConfigs.map((config) => ({
        ...config,
        start_time: config.start_time.substring(0, 5), // Takes only HH:MM part
        end_time: config.end_time.substring(0, 5), // Takes only HH:MM part
      }));

      const finalData = {
        ...formData,
        schedule_configs: formattedScheduleConfigs,
      };

      const response = await tutorApi.updateSession(
        parseInt(sessionId),
        finalData,
      );

      if (response.success) {
        const totalClasses = scheduleConfigs.reduce((total, config) => {
          const start = new Date(formData.start_date);
          const end = new Date(formData.end_date);
          let count = 0;
          const current = new Date(start);
          while (current <= end) {
            if (current.getDay() === config.day_of_week) {
              count++;
            }
            current.setDate(current.getDate() + 1);
          }
          return total + count;
        }, 0);

        toast.success(
          `Session updated successfully with ${scheduleConfigs.length} schedule configuration${scheduleConfigs.length !== 1 ? "s" : ""} and ${totalClasses} total classes!`,
        );
        router.push(`/tutor/sessions/${sessionId}`);
      } else {
        toast.error("Failed to update session");
      }
    } catch (error: any) {
      console.error("Update session error:", error);
      toast.error(
        error.message || "Failed to update session. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!session) return;

    try {
      const response = await tutorApi.deleteSession(parseInt(sessionId));
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
            The session you're trying to edit doesn't exist or has been deleted.
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
            <Link
              href={`/tutor/sessions/${sessionId}`}
              className="hover:text-main transition-colors"
            >
              {session.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Edit</span>
          </div>

          {/* Title and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <Link
                href={`/tutor/sessions/${sessionId}`}
                className="p-2 hover:bg-white rounded-xl transition-colors group"
                title="Back to Session"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-main transition-colors" />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-2xl font-semibold text-gray-900">
                    Edit Session
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}
                    >
                      {session.status.charAt(0).toUpperCase() +
                        session.status.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getEnrollmentStatusColor(session.enrollment_status)}`}
                    >
                      {session.enrollment_status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(session.start_date)} -{" "}
                    {formatDate(session.end_date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    {session.session_code}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href={`/tutor/sessions/${sessionId}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
              >
                <X className="w-4 h-4" />
                Cancel
              </Link>

              <button
                type="submit"
                form="edit-session-form"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2.5 bg-white text-red-600 rounded-xl border border-red-200 hover:bg-red-50 transition-all shadow-sm hover:shadow-md"
                title="Delete Session"
              >
                <Trash className="w-5 h-5" />
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
                    <Link
                      href={`/tutor/sessions/${sessionId}`}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsActionsMenuOpen(false)}
                    >
                      <X className="w-5 h-5 text-gray-600" />
                      <span>Cancel</span>
                    </Link>

                    <button
                      type="submit"
                      form="edit-session-form"
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-main/5 rounded-lg transition-colors"
                      onClick={() => setIsActionsMenuOpen(false)}
                    >
                      <Save className="w-5 h-5 text-main" />
                      <span>Save Changes</span>
                    </button>

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

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50/50">
            <nav className="flex overflow-x-auto hide-scrollbar">
              {[
                { id: "basic", label: "Basic Information", icon: Info },
                { id: "schedule", label: "Schedule", icon: Calendar },
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
            <form id="edit-session-form" onSubmit={handleSubmit}>
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  {/* Course Information - Read Only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course
                    </label>
                    {course ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-main mt-0.5" />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Subject: {course.subject}
                            </p>
                            {course.description && (
                              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                {course.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-2 text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading course details...</span>
                      </div>
                    )}
                  </div>

                  {/* Session Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      placeholder="e.g., January 2024 Batch"
                      required
                    />
                  </div>

                  {/* Session Type and Batch */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Type
                      </label>
                      <select
                        name="session_type"
                        value={formData.session_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      >
                        <option value="group">Group Session</option>
                        <option value="one_on_one">One-on-One</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Batch Name (Optional)
                      </label>
                      <input
                        type="text"
                        name="batch_name"
                        value={formData.batch_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        placeholder="e.g., Morning Batch"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      placeholder="Additional details about this session..."
                    />
                  </div>

                  {/* Session Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        required
                        min={formData.start_date}
                      />
                    </div>
                  </div>

                  {/* Capacity & Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Students
                      </label>
                      <input
                        type="number"
                        name="max_students"
                        value={formData.max_students}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Maximum number of students allowed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Fee ({formData.fee_currency})
                      </label>
                      <input
                        type="number"
                        name="fee_amount"
                        value={formData.fee_amount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === "schedule" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-main" />
                      Class Schedule Configuration
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Configure recurring class times for this session. Changes
                      to the schedule will affect future classes.
                    </p>

                    <ScheduleConfig
                      value={scheduleConfigs}
                      onChange={setScheduleConfigs}
                      startDate={formData.start_date}
                      endDate={formData.end_date}
                    />
                  </div>

                  {/* Schedule Summary */}
                  {scheduleConfigs.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Schedule Summary
                      </h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <p>• Total configurations: {scheduleConfigs.length}</p>
                        <p>
                          • Date range: {formatDate(formData.start_date)} -{" "}
                          {formatDate(formData.end_date)}
                        </p>
                        <p>
                          • Classes will be generated for each configured day of
                          week within the date range
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Form Actions - Mobile/Tablet */}
          <div className="border-t border-gray-200 bg-gray-50/50 p-4 lg:hidden">
            <div className="flex gap-3">
              <Link
                href={`/tutor/sessions/${sessionId}`}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                form="edit-session-form"
                disabled={saving}
                className="flex-1 px-4 py-3 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Editing Tips
          </h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>
              Changes to basic information will update the session immediately
            </li>
            <li>
              Schedule changes will affect future classes based on the new
              configuration
            </li>
            <li>
              You can add multiple time slots for the same day (e.g., Monday
              morning AND afternoon)
            </li>
            <li>
              Duration is automatically calculated from start and end times
            </li>
            <li>
              Make sure your date range includes at least one instance of each
              scheduled day
            </li>
          </ul>
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
              cannot be undone and will affect all associated data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
