// src/app/tutor/courses/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi, { TutorCourse, TutorSession } from "@/lib/api/tutor";
import {
  BookOpen,
  Users,
  Clock,
  DollarSign,
  Calendar,
  GraduationCap,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Globe,
  Video,
  MapPin,
  Sparkles,
  ChevronRight,
  PlayCircle,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  EyeOff,
  Lock,
  Upload,
  Download,
  Share2,
  Copy,
  Star,
  TrendingUp,
  Award,
  Zap,
  Bell,
  Settings,
  LogOut,
  Menu,
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Home,
  Users2,
  CalendarDays,
  LayoutGrid,
  List,
  Grid,
  Loader2,
  Pencil,
  Trash,
  Eye as EyeIcon,
  ArrowLeft,
  Target,
  BookMarked,
  FileCheck,
  Video as VideoIcon,
  MapPinned,
  Wifi,
  WifiOff,
  AlertTriangle,
  Check,
  X,
  HelpCircle,
  Info,
  MessageSquare,
  Phone,
  Mail,
  Link as LinkIcon,
  ExternalLink,
  Settings2,
  MoreHorizontal,
  DownloadCloud,
  UploadCloud,
  Printer,
  Clock3,
  CalendarClock,
  CalendarRange,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  Clock4,
  Timer,
  Hourglass,
  Sparkle,
  Rocket,
  Lightbulb,
  Brain,
  Target as TargetIcon,
  BookText,
  Notebook,
  NotebookText,
  ClipboardList,
  ClipboardCheck,
  ClipboardX,
  ClipboardEdit,
  ClipboardSignature,
  ClipboardType,
  FileSpreadsheet,
  FileJson,
  FileCode,
  FileText as FileTextIcon,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  File,
  Folder,
  FolderOpen,
  FolderTree,
  FolderArchive,
  FolderClosed,
  FolderGit,
  FolderGit2,
  FolderKanban,
  FolderKey,
  FolderLock,
  FolderOutput,
  FolderSearch,
  FolderSearch2,
  FolderSymlink,
  FolderSync,
  FolderUp,
  FolderDown,
  FolderX,
  FolderCheck,
  FolderClock,
  FolderCog,
  FolderCode,
  FolderHeart,
  FolderMinus,
  FolderPlus,
} from "lucide-react";

export default function TutorCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<TutorCourse | null>(null);
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "sessions"
  >("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      const courseResponse = await tutorApi.getCourse(parseInt(courseId));

      if (courseResponse.success && courseResponse.data) {
        const courseData = courseResponse.data["0"] || courseResponse.data;
        setCourse(courseData);
      }

      const sessionsResponse = await tutorApi.getSessions({
        tutor_course_id: parseInt(courseId),
        limit: 50,
      });

      if (sessionsResponse.success && sessionsResponse.data) {
        setSessions(sessionsResponse.data.sessions);
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!course) return;

    try {
      const response = await tutorApi.publishCourse(course.id);
      if (response.success) {
        toast.success("Course published successfully!");
        setShowPublishModal(false);
        fetchCourseData();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to publish course");
    }
  };

  const handleDelete = async () => {
    if (!course) return;

    try {
      const response = await tutorApi.deleteCourse(course.id);
      if (response.success) {
        toast.success("Course deleted successfully!");
        setShowDeleteModal(false);
        router.push("/tutor/courses");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete course");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <Globe className="w-4 h-4" />;
      case "draft":
        return <EyeOff className="w-4 h-4" />;
      case "enrolling":
        return <Users className="w-4 h-4" />;
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
      case "published":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "draft":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "enrolling":
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

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "virtual":
        return <VideoIcon className="w-4 h-4" />;
      case "in_person":
        return <MapPinned className="w-4 h-4" />;
      case "hybrid":
        return <Wifi className="w-4 h-4" />;
      default:
        return <VideoIcon className="w-4 h-4" />;
    }
  };

  const getSessionStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <CalendarClock className="w-3 h-3" />;
      case "ongoing":
        return <PlayCircle className="w-3 h-3" />;
      case "completed":
        return <CheckCircle className="w-3 h-3" />;
      case "cancelled":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ongoing":
        return "bg-green-50 text-green-700 border-green-200";
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

  const formatCurrency = (amount: number, currency: string = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTotalEnrollments = () => {
    return sessions.reduce(
      (total, session) => total + (session.current_enrollment || 0),
      0,
    );
  };

  const getUpcomingSessions = () => {
    const now = new Date();
    return sessions.filter(
      (session) =>
        session.status === "scheduled" && new Date(session.start_date) > now,
    ).length;
  };

  const getActiveSessions = () => {
    return sessions.filter((session) => session.status === "ongoing").length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-main/20 border-t-main rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-main animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The course you're looking for doesn't exist or has been deleted.
          </p>
          <Link
            href="/tutor/courses"
            className="inline-flex items-center px-6 py-3 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
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
            <ChevronRightIcon className="w-4 h-4" />
            <Link
              href="/tutor/courses"
              className="hover:text-main transition-colors"
            >
              Courses
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">
              {course.title}
            </span>
          </div>

          {/* Title and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-1">
              <Link
                href="/tutor/courses"
                className="p-2 hover:bg-white rounded-xl transition-colors group hidden sm:block md:block"
                title="Back to Courses"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-main transition-colors" />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-2xl font-semibold text-gray-900">
                    {course.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}
                    >
                      {getStatusIcon(course.status)}
                      {course.status.charAt(0).toUpperCase() +
                        course.status.slice(1)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                      {getModeIcon(course.mode)}
                      {course.mode.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Created {formatDate(course.created_at)}
                  </span>
                  {course.updated_at !== course.created_at && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Updated {formatDate(course.updated_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Actions - Professional with Labels */}
            <div className="hidden lg:flex items-center gap-2 md:gap-1">
              <Link
                href={`/tutor/sessions/create?courseId=${course.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-main hover:text-white hover:border-main transition-all shadow-sm hover:shadow-md md:whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Session
              </Link>

              {course.status === "draft" && (
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-700 font-medium rounded-xl border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm hover:shadow-md"
                >
                  <Globe className="w-4 h-4" />
                  Publish
                </button>
              )}

              <Link
                href={`/tutor/courses/${course.id}/edit`}
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
                    <Link
                      href={`/tutor/sessions/create?courseId=${course.id}`}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-main/5 rounded-lg transition-colors"
                      onClick={() => setIsActionsMenuOpen(false)}
                    >
                      <Plus className="w-5 h-5 text-main" />
                      <span>Add Session</span>
                    </Link>

                    {course.status === "draft" && (
                      <button
                        onClick={() => {
                          setShowPublishModal(true);
                          setIsActionsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Globe className="w-5 h-5 text-emerald-600" />
                        <span>Publish Course</span>
                      </button>
                    )}

                    <Link
                      href={`/tutor/courses/${course.id}/edit`}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setIsActionsMenuOpen(false)}
                    >
                      <Pencil className="w-5 h-5 text-blue-600" />
                      <span>Edit Course</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setIsActionsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash className="w-5 h-5 text-red-600" />
                      <span>Delete Course</span>
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
              <p className="text-sm text-gray-500">Total Sessions</p>
              <div className="w-8 h-8 bg-main/10 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-4 h-4 text-main" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {sessions.length}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="w-3 h-3" />
                {getActiveSessions()} active
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <CalendarClock className="w-3 h-3" />
                {getUpcomingSessions()} upcoming
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Students</p>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {getTotalEnrollments()}
            </p>
            <p className="mt-2 text-xs text-gray-500">Across all sessions</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Duration</p>
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Hourglass className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {course.total_weeks} weeks
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {course.classes_per_week} class/week •{" "}
              {course.class_duration_minutes} min
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Price</p>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(course.total_price, course.currency)}
            </p>
            <p className="mt-2 text-xs text-gray-500">per student</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50">
            <nav className="flex overflow-x-auto hide-scrollbar">
              {[
                { id: "overview", label: "Overview", icon: BookOpen },
                { id: "curriculum", label: "Curriculum", icon: BookText },
                {
                  id: "sessions",
                  label: "Sessions",
                  icon: PlayCircle,
                  count: sessions.length,
                },
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
                    {tab.count !== undefined && (
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
                    <FileTextIcon className="w-5 h-5 text-main" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Course Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-main" />
                      Course Details
                    </h3>
                    <dl className="space-y-3">
                      {[
                        {
                          icon: BookOpen,
                          label: "Subject",
                          value: course.subject,
                        },
                        {
                          icon: GraduationCap,
                          label: "Level",
                          value:
                            course.level?.replace("_", " ") || "Not specified",
                          capitalize: true,
                        },
                        {
                          icon: MapPinned,
                          label: "Mode",
                          value:
                            course.mode?.replace("_", " ") || "Not specified",
                          capitalize: true,
                        },
                        {
                          icon: Users,
                          label: "Max Students",
                          value:
                            course.max_students_per_session || "Not specified",
                        },
                        {
                          icon: course.requires_approval
                            ? CheckCircle
                            : XCircle,
                          label: "Requires Approval",
                          value: course.requires_approval ? "Yes" : "No",
                          valueColor: course.requires_approval
                            ? "text-emerald-600"
                            : "text-gray-600",
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
                              className={`font-medium ${item.valueColor || "text-gray-900"} ${item.capitalize ? "capitalize" : ""}`}
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
                      Schedule
                    </h3>
                    <dl className="space-y-3">
                      {[
                        {
                          icon: Calendar,
                          label: "Total Weeks",
                          value: course.total_weeks || "Not specified",
                          suffix: " weeks",
                        },
                        {
                          icon: Clock,
                          label: "Classes/Week",
                          value: course.classes_per_week || "Not specified",
                        },
                        {
                          icon: Timer,
                          label: "Class Duration",
                          value:
                            course.class_duration_minutes || "Not specified",
                          suffix: " minutes",
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
                              {item.suffix || ""}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-main" />
                      Prerequisites
                    </h3>
                    <ul className="space-y-2">
                      {course.prerequisites.map((prereq, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Learning Outcomes */}
                {course.learning_outcomes &&
                  course.learning_outcomes.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <TargetIcon className="w-5 h-5 text-main" />
                        Learning Outcomes
                      </h3>
                      <ul className="space-y-2">
                        {course.learning_outcomes.map((outcome, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <Sparkle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>{outcome}</span>
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
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BookText className="w-5 h-5 text-main" />
                    Course Curriculum
                  </h3>
                  <Link
                    href={`/tutor/courses/${course.id}/edit?tab=curriculum`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-main/10 text-main rounded-lg hover:bg-main/20 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Curriculum
                  </Link>
                </div>

                {course.curriculum && course.curriculum.length > 0 ? (
                  <div className="space-y-4">
                    {course.curriculum.map((week, index) => (
                      <div
                        key={week.week}
                        className="bg-gray-50 rounded-xl p-5 border-l-4 border-main hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">
                            Week {week.week}: {week.topic}
                          </h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            Week {week.week}
                          </span>
                        </div>

                        {week.objectives && week.objectives.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <Target className="w-4 h-4 text-main" />
                              Objectives:
                            </p>
                            <ul className="space-y-1">
                              {week.objectives.map((obj, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-gray-600"
                                >
                                  <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {week.materials && week.materials.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <FileText className="w-4 h-4 text-main" />
                              Materials:
                            </p>
                            <ul className="space-y-1">
                              {week.materials.map((material, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-gray-600"
                                >
                                  <File className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>{material}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookText className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      No curriculum added yet
                    </p>
                    <Link
                      href={`/tutor/courses/${course.id}/edit?tab=curriculum`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Curriculum
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === "sessions" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-main" />
                    Course Sessions
                  </h3>
                  <Link
                    href={`/tutor/sessions/create?courseId=${course.id}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Session
                  </Link>
                </div>

                {sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <Link
                        key={session.id}
                        href={`/tutor/sessions/${session.id}`}
                        className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all group"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 group-hover:text-main transition-colors">
                                {session.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSessionStatusColor(session.status)}`}
                                >
                                  {getSessionStatusIcon(session.status)}
                                  {session.status}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                  {session.session_type === "one_on_one" ? (
                                    <>👤 1-on-1</>
                                  ) : (
                                    <>👥 Group</>
                                  )}
                                </span>
                              </div>
                            </div>

                            {session.description && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {session.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="flex items-center gap-1.5 text-gray-500">
                                <Calendar className="w-4 h-4" />
                                {formatDate(session.start_date)}
                              </span>
                              <span className="flex items-center gap-1.5 text-gray-500">
                                <Users className="w-4 h-4" />
                                {session.current_enrollment}/
                                {session.max_students} students
                              </span>
                              {session.fee_amount > 0 && (
                                <span className="flex items-center gap-1.5 text-gray-500">
                                  <DollarSign className="w-4 h-4" />
                                  {formatCurrency(
                                    session.fee_amount,
                                    session.fee_currency,
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getEnrollmentStatusColor(session.enrollment_status)}`}
                            >
                              {session.enrollment_status === "open" && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              {session.enrollment_status === "waiting_list" && (
                                <Clock className="w-3 h-3" />
                              )}
                              {session.enrollment_status === "closed" && (
                                <XCircle className="w-3 h-3" />
                              )}
                              {session.enrollment_status === "completed" && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              {session.enrollment_status.replace("_", " ")}
                            </span>
                            <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-main transition-colors" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      No sessions created yet
                    </p>
                    <Link
                      href={`/tutor/sessions/create?courseId=${course.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Create First Session
                    </Link>
                  </div>
                )}
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
              Delete Course
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete "{course?.title}"? This action
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
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Publish Course
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to publish "{course?.title}"? Students will
              be able to see and enroll in this course.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
