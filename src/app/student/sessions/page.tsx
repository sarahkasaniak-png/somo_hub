// src/app/student/sessions/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  MapPinned,
  Wifi,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ExternalLink,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowRight,
  GraduationCap,
  Star,
  RefreshCw,
} from "lucide-react";

// Use the type from the API directly to avoid mismatch
import type { Enrollment as ApiEnrollment } from "@/lib/api/student";

// Define the component's Enrollment type based on what we actually need
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
    enrollment_status: string;
    description: string | null;
    session_type: string;
    subject?: string; // Make optional since API might not have it
    level?: string; // Make optional since API might not have it
    thumbnail_url?: string | null; // Make optional since API might not have it
    tutor: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      avatar_url: string | null;
      bio: string | null;
      rating: number | string | null;
    };
  };
}

export default function StudentSessionsPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "progress" | "name">("date");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
  });

  // Helper function to safely format rating
  const formatRating = (rating: any): string => {
    if (!rating && rating !== 0) return "0";
    const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
    if (isNaN(numRating)) return "0";
    return numRating.toFixed(1);
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [enrollments, filter, searchQuery, sortBy]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getMyEnrollments();

      console.log("Enrollments response:", response);

      if (response.success && response.data) {
        const enrollmentsData = response.data.enrollments || [];

        // Map the API response to our component's Enrollment type
        const mappedEnrollments: Enrollment[] = enrollmentsData.map(
          (item: any) => ({
            id: item.id,
            tutor_course_session_id: item.tutor_course_session_id,
            student_id: item.student_id,
            enrollment_status: item.enrollment_status,
            payment_status: item.payment_status,
            payment_amount: item.payment_amount,
            enrolled_at: item.enrolled_at,
            progress_percentage: item.progress_percentage,
            classes_attended: item.classes_attended,
            total_classes: item.total_classes,
            session: {
              id: item.session?.id,
              name: item.session?.name,
              session_code: item.session?.session_code,
              start_date: item.session?.start_date,
              end_date: item.session?.end_date,
              max_students: item.session?.max_students,
              fee_amount: item.session?.fee_amount,
              fee_currency: item.session?.fee_currency,
              status: item.session?.status,
              enrollment_status: item.session?.enrollment_status,
              description: item.session?.description,
              session_type: item.session?.session_type,
              subject: item.session?.subject,
              level: item.session?.level,
              thumbnail_url: item.session?.thumbnail_url,
              tutor: {
                id: item.session?.tutor?.id,
                first_name: item.session?.tutor?.first_name,
                last_name: item.session?.tutor?.last_name,
                email: item.session?.tutor?.email,
                avatar_url: item.session?.tutor?.avatar_url,
                bio: item.session?.tutor?.bio,
                rating: item.session?.tutor?.rating,
              },
            },
          }),
        );

        setEnrollments(mappedEnrollments);

        // Calculate stats
        const total = response.data.total || 0;
        const active = mappedEnrollments.filter(
          (e: Enrollment) => e.enrollment_status === "active",
        ).length;
        const pending = mappedEnrollments.filter(
          (e: Enrollment) => e.enrollment_status === "pending",
        ).length;
        const completed = mappedEnrollments.filter(
          (e: Enrollment) => e.enrollment_status === "completed",
        ).length;

        setStats({ total, active, pending, completed });
      } else {
        toast.error(response.message || "No enrollment data found");
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
      toast.error("Failed to load your sessions");
    } finally {
      setLoading(false);
    }
  };

  const filterEnrollments = () => {
    let filtered = [...enrollments];

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((e) => e.enrollment_status === filter);
    }

    // Apply search - use session.name and session.subject
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          (e.session.name || "").toLowerCase().includes(query) ||
          (e.session.subject || "").toLowerCase().includes(query) ||
          (e.session.session_code || "").toLowerCase().includes(query),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.enrolled_at).getTime() -
            new Date(a.enrolled_at).getTime()
          );
        case "progress":
          return b.progress_percentage - a.progress_percentage;
        case "name":
          return (a.session.name || "").localeCompare(b.session.name || "");
        default:
          return 0;
      }
    });

    setFilteredEnrollments(filtered);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
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
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      completed: "bg-purple-50 text-purple-700 border-purple-200",
      dropped: "bg-red-50 text-red-700 border-red-200",
      suspended: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      partial: "bg-blue-50 text-blue-700 border-blue-200",
      refunded: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const handleRefresh = async () => {
    await fetchEnrollments();
    toast.success("Refreshed successfully");
  };

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
            <span className="text-gray-900 font-medium">My Sessions</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-1">
            View and manage all your enrolled sessions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Sessions</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {stats.total}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">
            {stats.active}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold text-purple-600 mt-1">
            {stats.completed}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {["all", "active", "pending", "completed", "dropped"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ),
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="progress">Sort by Progress</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left side - Session Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {enrollment.session.thumbnail_url ? (
                          <img
                            src={enrollment.session.thumbnail_url}
                            alt={enrollment.session.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <BookOpen className="w-8 h-8 text-blue-600" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {enrollment.session.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {enrollment.session.subject || "General"} •{" "}
                          {enrollment.session.session_code}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            {enrollment.session.subject || "General"}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Tutor: {enrollment.session.tutor.first_name}{" "}
                            {enrollment.session.tutor.last_name}
                          </span>
                          {/* Rating display */}
                          {enrollment.session.tutor.rating && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              {formatRating(enrollment.session.tutor.rating)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Session Dates</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatDate(enrollment.session.start_date)} -{" "}
                          {formatDate(enrollment.session.end_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Enrolled On</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatDate(enrollment.enrolled_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fee Paid</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatCurrency(
                            enrollment.payment_amount,
                            enrollment.session.fee_currency,
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
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
                      <p className="text-xs text-gray-500 mt-2">
                        {enrollment.classes_attended} of{" "}
                        {enrollment.total_classes} classes attended
                      </p>
                    </div>
                  </div>

                  {/* Right side - Status and Actions */}
                  <div className="lg:w-64 space-y-4">
                    {/* Status Badges */}
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border w-full justify-center ${getStatusColor(enrollment.enrollment_status)}`}
                      >
                        Enrollment: {enrollment.enrollment_status}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border w-full justify-center ${getPaymentStatusColor(enrollment.payment_status)}`}
                      >
                        Payment: {enrollment.payment_status}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border w-full justify-center ${
                          enrollment.session.status === "scheduled"
                            ? "bg-blue-50 text-blue-700"
                            : enrollment.session.status === "ongoing"
                              ? "bg-green-50 text-green-700"
                              : enrollment.session.status === "completed"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        Session: {enrollment.session.status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/student/sessions/${enrollment.tutor_course_session_id}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Details
                      </Link>
                      <Link
                        href={`/student/schedule?session=${enrollment.tutor_course_session_id}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        <Calendar className="w-4 h-4" />
                        View Schedule
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No sessions found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery || filter !== "all"
              ? "No sessions match your search criteria. Try adjusting your filters."
              : "You haven't enrolled in any sessions yet. Browse our sessions to get started!"}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Sessions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
