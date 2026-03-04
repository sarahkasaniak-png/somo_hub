// src/app/tutor/courses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi, { TutorCourse } from "@/lib/api/tutor";
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
} from "lucide-react";

export default function TutorCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (filter !== "all") {
        params.status = filter;
      }

      const response = await tutorApi.getMyCourses(params);
      console.log("Fetched courses response:", response.data);
      if (response.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (courseId: number) => {
    try {
      const response = await tutorApi.publishCourse(courseId);
      if (response.success) {
        toast.success("Course published successfully!");
        fetchCourses();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to publish course");
    }
  };

  const handleDelete = async (courseId: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await tutorApi.deleteCourse(courseId);
      if (response.success) {
        toast.success("Course deleted successfully!");
        setCourses(courses.filter((course) => course.id !== courseId));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete course");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <Globe className="w-3 h-3" />;
      case "draft":
        return <EyeOff className="w-3 h-3" />;
      case "enrolling":
        return <Users className="w-3 h-3" />;
      case "ongoing":
        return <PlayCircle className="w-3 h-3" />;
      case "completed":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
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
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "virtual":
        return <Video className="w-4 h-4" />;
      case "in_person":
        return <MapPin className="w-4 h-4" />;
      case "hybrid":
        return <Globe className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
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
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-main/20 border-t-main rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-main animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <Link
                href="/tutor/dashboard"
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Courses</span>
            </div>
            <h1 className="text-2xl sm:text-2xl font-semibold text-gray-900">
              My Courses
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage and track all your courses in one place
            </p>
          </div>
          <Link
            href="/tutor/courses/create"
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-main to-purple-600 text-white text-sm sm:text-base font-medium rounded-xl hover:from-purple-700 hover:to-main transition-all duration-200 shadow-lg shadow-main/25 hover:shadow-xl hover:shadow-main/30 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden xs:inline">Create New Course</span>
            <span className="xs:hidden">Create</span>
          </Link>
        </div>

        {/* Stats Overview - Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Total Courses
                </p>
                <p className="text-xl sm:text-xl font-bold text-gray-900 mt-1">
                  {courses.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-main/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-main" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Published</p>
                <p className="text-xl sm:text-xl font-bold text-green-600 mt-1">
                  {courses.filter((c) => c.status === "published").length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow xs:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Drafts</p>
                <p className="text-xl sm:text-xl font-bold text-amber-600 mt-1">
                  {courses.filter((c) => c.status === "draft").length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search - Mobile Optimized */}
        <div className="mt-4 sm:mt-6 bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter by Status
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isFilterMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Filter Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { value: "all", label: "All Courses", icon: LayoutGrid },
                { value: "draft", label: "Drafts", icon: EyeOff },
                { value: "published", label: "Published", icon: Globe },
                { value: "enrolling", label: "Enrolling", icon: Users },
                { value: "ongoing", label: "Ongoing", icon: PlayCircle },
                { value: "completed", label: "Completed", icon: CheckCircle },
              ].map((status) => {
                const Icon = status.icon;
                return (
                  <button
                    key={status.value}
                    onClick={() => setFilter(status.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filter === status.value
                        ? "bg-main text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {status.label}
                  </button>
                );
              })}
            </div>

            {/* Filter Buttons - Mobile Dropdown */}
            {isFilterMenuOpen && (
              <div className="lg:hidden grid grid-cols-2 gap-2 mt-2">
                {[
                  { value: "all", label: "All Courses", icon: LayoutGrid },
                  { value: "draft", label: "Drafts", icon: EyeOff },
                  { value: "published", label: "Published", icon: Globe },
                  { value: "enrolling", label: "Enrolling", icon: Users },
                  { value: "ongoing", label: "Ongoing", icon: PlayCircle },
                  {
                    value: "completed",
                    label: "Completed",
                    icon: CheckCircle,
                  },
                ].map((status) => {
                  const Icon = status.icon;
                  return (
                    <button
                      key={status.value}
                      onClick={() => {
                        setFilter(status.value);
                        setIsFilterMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === status.value
                          ? "bg-main text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {status.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courses List - Responsive Cards */}
      <div className="space-y-3 sm:space-y-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => router.push(`/tutor/courses/${course.id}`)}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <div className="p-4 sm:p-6">
              {/* Header Row - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-base sm:text-xl font-semibold text-gray-900 group-hover:text-main transition-colors">
                      {course.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}
                      >
                        {getStatusIcon(course.status)}
                        <span className="hidden xs:inline">
                          {course.status.charAt(0).toUpperCase() +
                            course.status.slice(1)}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                        {getModeIcon(course.mode)}
                        <span className="hidden xs:inline">
                          {course.mode.replace("_", " ")}
                        </span>
                      </span>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-2 max-w-3xl">
                    {course.description}
                  </p>
                </div>

                {/* Action Buttons - Mobile Horizontal Scroll */}
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
                  <Link
                    href={`/tutor/courses/${course.id}`}
                    className="flex-shrink-0 p-1.5 sm:p-2 text-gray-600 hover:text-main hover:bg-main/10 rounded-lg transition-colors"
                    title="View Details"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <Link
                    href={`/tutor/courses/${course.id}/edit`}
                    className="flex-shrink-0 p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Course"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  {course.status === "draft" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePublish(course.id);
                      }}
                      className="flex-shrink-0 p-1.5 sm:p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Publish Course"
                    >
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(course.id);
                    }}
                    className="flex-shrink-0 p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Course"
                  >
                    <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Details Grid - Responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-main/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-main" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 truncate">Subject</p>
                    <p className="font-medium text-gray-900 truncate">
                      {course.subject}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 truncate">Level</p>
                    <p className="font-medium text-gray-900 truncate capitalize">
                      {course.level?.replace("_", " ") || "N/A"}
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 truncate">Enrollment</p>
                    <p className="font-medium text-gray-900 truncate">
                      {(course as any).current_enrollment || 0}/
                      {course.max_students_per_session}
                    </p>
                  </div>
                </div> */}

                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 truncate">Price</p>
                    <p className="font-medium text-gray-900 truncate">
                      {formatCurrency(course.total_price, course.currency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Row - Responsive */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">
                      {course.total_weeks}w • {course.classes_per_week}c/w •{" "}
                      {course.class_duration_minutes}m
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(course.created_at)}
                    </span>
                  </div>
                </div>

                {/* Session Quick Actions - Mobile Scroll */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
                  <Link
                    href={`/tutor/sessions?courseId=${course.id}`}
                    className="flex-shrink-0 inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">View</span>
                    Sessions
                  </Link>
                  <Link
                    href={`/tutor/sessions/create?courseId=${course.id}`}
                    className="flex-shrink-0 inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Add</span>
                    Session
                  </Link>
                  <button
                    className="flex-shrink-0 p-1 sm:p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {(course as any).progress !== undefined && (
              <div className="h-1 bg-gray-100">
                <div
                  className="h-full bg-gradient-to-r from-main to-purple-600 transition-all duration-500"
                  style={{ width: `${(course as any).progress}%` }}
                />
              </div>
            )}
          </div>
        ))}

        {/* Empty State - Responsive */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-gray-200 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              {searchQuery
                ? "No courses match your search criteria"
                : "Create your first course to get started"}
            </p>
            {!searchQuery && (
              <Link
                href="/tutor/courses/create"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-main text-white text-sm sm:text-base font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Create First Course
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
    // </div>
  );
}
