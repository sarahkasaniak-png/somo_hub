// src/app/tutor/activity/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Activity,
  UserPlus,
  DollarSign,
  CalendarCheck,
  Star,
  Briefcase,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Download,
  RefreshCw,
  FileText,
  CreditCard,
  Users,
  BookOpen,
  Award,
  MessageSquare,
  Settings,
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Zap,
  Info,
} from "lucide-react";
import userApi from "@/lib/api/user";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ActivityItem {
  id: number;
  type:
    | "enrollment"
    | "payment"
    | "session"
    | "course"
    | "review"
    | "application"
    | "system";
  action: string;
  description: string;
  timestamp: string;
  date: string;
  time: string;
  metadata?: {
    course_id?: number;
    course_title?: string;
    session_id?: number;
    session_name?: string;
    student_id?: number;
    student_name?: string;
    amount?: number;
    currency?: string;
    rating?: number;
    status?: string;
    [key: string]: any;
  };
  status?: "success" | "pending" | "failed" | "info" | "warning";
}

interface ActivityFilters {
  type: string;
  dateRange: string;
  search: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function TutorActivityPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ActivityFilters>({
    type: "all",
    dateRange: "all",
    search: "",
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalActivities: 0,
    enrollments: 0,
    payments: 0,
    sessions: 0,
    reviews: 0,
  });

  useEffect(() => {
    fetchActivities();
  }, [pagination.page]);

  useEffect(() => {
    applyFilters();
  }, [activities, filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      // Fetch user status which contains recent activity
      const response = await userApi.getUserStatus();

      if (response.success && response.data) {
        const userData = response.data;

        // Format activities from userData.recentActivity
        if (userData.recentActivity && userData.recentActivity.length > 0) {
          const formattedActivities = userData.recentActivity.map(
            (activity: any, index: number) => {
              const timestamp = new Date(activity.created_at);

              // Determine activity type
              let type: ActivityItem["type"] = "system";
              let status: ActivityItem["status"] = "info";
              let description = "";

              const action = activity.action.toLowerCase();
              const metadata = activity.metadata || {};

              if (action.includes("enroll") || action.includes("enrollment")) {
                type = "enrollment";
                status =
                  metadata.status === "completed"
                    ? "success"
                    : metadata.status === "pending"
                      ? "pending"
                      : "info";
                description = metadata.course_title
                  ? `New enrollment in ${metadata.course_title}`
                  : "New student enrollment";
              } else if (action.includes("pay") || action.includes("payment")) {
                type = "payment";
                status =
                  metadata.status === "success"
                    ? "success"
                    : metadata.status === "failed"
                      ? "failed"
                      : "info";
                description = metadata.amount
                  ? `Payment received: ${formatCurrency(metadata.amount, metadata.currency || "KES")}`
                  : "Payment processed";
              } else if (action.includes("session")) {
                type = "session";
                status =
                  metadata.status === "completed"
                    ? "success"
                    : metadata.status === "cancelled"
                      ? "failed"
                      : metadata.status === "scheduled"
                        ? "pending"
                        : "info";
                description = metadata.session_name
                  ? `Session ${metadata.status || "updated"}: ${metadata.session_name}`
                  : "Session activity";
              } else if (action.includes("course")) {
                type = "course";
                status =
                  metadata.status === "published"
                    ? "success"
                    : metadata.status === "draft"
                      ? "pending"
                      : "info";
                description = metadata.course_title
                  ? `Course ${metadata.status || "updated"}: ${metadata.course_title}`
                  : "Course activity";
              } else if (action.includes("review")) {
                type = "review";
                status = "success";
                description = metadata.rating
                  ? `New ${metadata.rating}-star review received`
                  : "New review received";
              } else if (action.includes("application")) {
                type = "application";
                status =
                  metadata.status === "approved"
                    ? "success"
                    : metadata.status === "rejected"
                      ? "failed"
                      : metadata.status === "pending"
                        ? "pending"
                        : "info";
                description = `Application ${metadata.status || "updated"}`;
              }

              return {
                id: index,
                type,
                action: activity.action,
                description:
                  description ||
                  activity.action
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l: string) => l.toUpperCase()),
                timestamp: activity.created_at,
                date: formatDate(timestamp),
                time: formatTime(timestamp),
                metadata,
                status,
              };
            },
          );

          setActivities(formattedActivities);

          // Calculate stats
          setStats({
            totalActivities: formattedActivities.length,
            enrollments: formattedActivities.filter(
              (a) => a.type === "enrollment",
            ).length,
            payments: formattedActivities.filter((a) => a.type === "payment")
              .length,
            sessions: formattedActivities.filter((a) => a.type === "session")
              .length,
            reviews: formattedActivities.filter((a) => a.type === "review")
              .length,
          });
        } else {
          // Generate sample activities for demo/development
          generateSampleActivities();
        }
      } else {
        // Generate sample activities for demo/development
        generateSampleActivities();
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      toast.error("Failed to load activity data");

      // Generate sample activities on error
      generateSampleActivities();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleActivities = () => {
    const sampleActivities: ActivityItem[] = [
      {
        id: 1,
        type: "enrollment",
        action: "enrollment_completed",
        description: "New student enrolled in KCSE Mathematics Revision",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        date: "Today",
        time: "2 hours ago",
        metadata: {
          course_id: 1,
          course_title: "KCSE Mathematics Revision",
          student_id: 101,
          student_name: "John Kamau",
          status: "active",
        },
        status: "success",
      },
      {
        id: 2,
        type: "payment",
        action: "payment_received",
        description: "Payment received: KES 5,000",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        date: "Today",
        time: "5 hours ago",
        metadata: {
          amount: 5000,
          currency: "KES",
          reference: "PAY-2026-001",
          status: "success",
        },
        status: "success",
      },
      {
        id: 3,
        type: "session",
        action: "session_completed",
        description: "Session completed: Advanced Calculus - Week 3",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        date: "Yesterday",
        time: "4:30 PM",
        metadata: {
          session_id: 1,
          session_name: "Advanced Calculus - Week 3",
          status: "completed",
        },
        status: "success",
      },
      {
        id: 4,
        type: "review",
        action: "review_received",
        description: "New 5-star review received",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        date: "Feb 19",
        time: "10:15 AM",
        metadata: {
          rating: 5,
          comment: "Excellent tutor! Very patient and knowledgeable.",
          student_name: "Mary Wanjiku",
        },
        status: "success",
      },
      {
        id: 5,
        type: "course",
        action: "course_published",
        description: "Course published: Physics Form 4 Revision",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        date: "Feb 18",
        time: "2:00 PM",
        metadata: {
          course_id: 2,
          course_title: "Physics Form 4 Revision",
          status: "published",
        },
        status: "success",
      },
      {
        id: 6,
        type: "enrollment",
        action: "enrollment_pending",
        description: "Pending enrollment request for Chemistry Form 3",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        date: "Feb 17",
        time: "11:30 AM",
        metadata: {
          course_id: 3,
          course_title: "Chemistry Form 3",
          student_id: 102,
          student_name: "Peter Ochieng",
          status: "pending",
        },
        status: "pending",
      },
      {
        id: 7,
        type: "payment",
        action: "payment_pending",
        description: "Pending payment: KES 3,500",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        date: "Feb 17",
        time: "9:45 AM",
        metadata: {
          amount: 3500,
          currency: "KES",
          reference: "PAY-2026-002",
          status: "pending",
        },
        status: "pending",
      },
      {
        id: 8,
        type: "session",
        action: "session_scheduled",
        description: "Session scheduled: Chemistry Practical - Acid Bases",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        date: "Feb 16",
        time: "3:15 PM",
        metadata: {
          session_id: 2,
          session_name: "Chemistry Practical - Acid Bases",
          status: "scheduled",
        },
        status: "info",
      },
      {
        id: 9,
        type: "application",
        action: "application_approved",
        description: "Tutor application approved",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        date: "Feb 14",
        time: "10:00 AM",
        metadata: {
          status: "approved",
        },
        status: "success",
      },
      {
        id: 10,
        type: "system",
        action: "profile_updated",
        description: "Profile information updated",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        date: "Feb 13",
        time: "1:20 PM",
        metadata: {},
        status: "info",
      },
    ];

    setActivities(sampleActivities);

    // Calculate stats
    setStats({
      totalActivities: sampleActivities.length,
      enrollments: sampleActivities.filter((a) => a.type === "enrollment")
        .length,
      payments: sampleActivities.filter((a) => a.type === "payment").length,
      sessions: sampleActivities.filter((a) => a.type === "session").length,
      reviews: sampleActivities.filter((a) => a.type === "review").length,
    });
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string = "KES"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRelativeTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(date);
  };

  const applyFilters = () => {
    let filtered = [...activities];

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter((a) => a.type === filters.type);
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (filters.dateRange) {
        case "today":
          filtered = filtered.filter((a) => {
            const activityDate = new Date(a.timestamp);
            return activityDate >= today;
          });
          break;
        case "yesterday":
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          filtered = filtered.filter((a) => {
            const activityDate = new Date(a.timestamp);
            return activityDate >= yesterday && activityDate < today;
          });
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          filtered = filtered.filter((a) => {
            const activityDate = new Date(a.timestamp);
            return activityDate >= weekAgo;
          });
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filtered = filtered.filter((a) => {
            const activityDate = new Date(a.timestamp);
            return activityDate >= monthAgo;
          });
          break;
      }
    }

    // Filter by search
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.description.toLowerCase().includes(searchLower) ||
          a.action.toLowerCase().includes(searchLower) ||
          a.metadata?.student_name?.toLowerCase().includes(searchLower) ||
          a.metadata?.course_title?.toLowerCase().includes(searchLower) ||
          a.metadata?.session_name?.toLowerCase().includes(searchLower),
      );
    }

    setFilteredActivities(filtered);

    // Update pagination total
    setPagination((prev) => ({
      ...prev,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.limit),
    }));
  };

  const handleFilterChange = (key: keyof ActivityFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      dateRange: "all",
      search: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRefresh = async () => {
    toast.loading("Refreshing activity...", { id: "refresh" });
    await fetchActivities();
    toast.success("Activity refreshed", { id: "refresh" });
  };

  const handleExport = () => {
    try {
      // Create CSV content
      const headers = [
        "Date",
        "Time",
        "Type",
        "Action",
        "Description",
        "Status",
      ];
      const csvContent = [
        headers.join(","),
        ...filteredActivities.map((a) =>
          [
            a.date,
            a.time,
            a.type,
            a.action,
            `"${a.description.replace(/"/g, '""')}"`,
            a.status || "info",
          ].join(","),
        ),
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tutor-activity-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Activity exported successfully");
    } catch (error) {
      console.error("Failed to export:", error);
      toast.error("Failed to export activity");
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <UserPlus className="w-5 h-5" />;
      case "payment":
        return <DollarSign className="w-5 h-5" />;
      case "session":
        return <CalendarCheck className="w-5 h-5" />;
      case "course":
        return <BookOpen className="w-5 h-5" />;
      case "review":
        return <Star className="w-5 h-5" />;
      case "application":
        return <FileText className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case "enrollment":
        return "bg-emerald-100 text-emerald-600";
      case "payment":
        return "bg-blue-100 text-blue-600";
      case "session":
        return "bg-purple-100 text-purple-600";
      case "course":
        return "bg-amber-100 text-amber-600";
      case "review":
        return "bg-yellow-100 text-yellow-600";
      case "application":
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            Success
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Failed
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Info
          </span>
        );
    }
  };

  const getPaginatedActivities = () => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredActivities.slice(start, end);
  };

  const statCards = [
    {
      title: "Total Activities",
      value: stats.totalActivities,
      icon: Activity,
      color: "blue",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Enrollments",
      value: stats.enrollments,
      icon: UserPlus,
      color: "emerald",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Payments",
      value: stats.payments,
      icon: DollarSign,
      color: "purple",
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Sessions",
      value: stats.sessions,
      icon: CalendarDays,
      color: "amber",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Reviews",
      value: stats.reviews,
      icon: Star,
      color: "yellow",
      bg: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={["tutor"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Activity Log
              </h1>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Track all your teaching activities, enrollments, payments, and
              more
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div
                  className={`${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}
                >
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {stat.title}
                </p>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Activity Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Activities</option>
                    <option value="enrollment">Enrollments</option>
                    <option value="payment">Payments</option>
                    <option value="session">Sessions</option>
                    <option value="course">Courses</option>
                    <option value="review">Reviews</option>
                    <option value="application">Applications</option>
                    <option value="system">System</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) =>
                      handleFilterChange("dateRange", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </div>
            )}

            {/* Active Filters Summary */}
            {(filters.type !== "all" ||
              filters.dateRange !== "all" ||
              filters.search) && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.type !== "all" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                    Type: {filters.type}
                  </span>
                )}
                {filters.dateRange !== "all" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                    Date: {filters.dateRange}
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                    Search: "{filters.search}"
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Activity List */}
          <div className="divide-y divide-gray-200">
            {getPaginatedActivities().length > 0 ? (
              getPaginatedActivities().map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityIconColor(activity.type)}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {activity.date} at {activity.time}
                            </span>
                            {getStatusBadge(activity.status)}
                          </div>
                        </div>

                        {/* Metadata Preview */}
                        {activity.metadata &&
                          Object.keys(activity.metadata).length > 0 && (
                            <button
                              onClick={() => {
                                // You could show a modal with metadata details
                                console.log(
                                  "Activity metadata:",
                                  activity.metadata,
                                );
                              }}
                              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                            >
                              <Info className="w-4 h-4 mr-1" />
                              Details
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No activities found
                </h3>
                <p className="text-gray-600 mb-6">
                  {filters.type !== "all" ||
                  filters.dateRange !== "all" ||
                  filters.search
                    ? "Try adjusting your filters to see more activities"
                    : "Your activity log will appear here as you start teaching"}
                </p>
                {(filters.type !== "all" ||
                  filters.dateRange !== "all" ||
                  filters.search) && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredActivities.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} activities
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Quick Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use filters to narrow down specific activity types</li>
                <li>
                  • Click the "Details" button on any activity to see more
                  information
                </li>
                <li>
                  • Export your activity log for record keeping or analysis
                </li>
                <li>
                  • Activities are automatically tracked for all your teaching
                  actions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
