// src/app/sessions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tuitionApi from "@/lib/api/tuition";
import { TutorSession } from "@/types/tuition.types";
import {
  Search,
  Filter,
  Grid3x3,
  List,
  SlidersHorizontal,
  X,
  Calendar,
  Clock,
  Users,
  Star,
  User,
  ChevronRight,
  GraduationCap,
  Loader2,
  Timer,
  BookOpen,
  Globe,
  Award,
  DollarSign,
} from "lucide-react";

function hasSessionsData(
  data: any,
): data is { sessions: TutorSession[]; total: number } {
  return data && Array.isArray(data.sessions) && typeof data.total === "number";
}

export default function SessionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Get filter values from URL - match what Navbar sends
  const categoryFilter = searchParams.get("category") || "all";
  const levelFilter = searchParams.get("level") || "all";
  const searchQuery = searchParams.get("q") || "";

  const [filters, setFilters] = useState({
    category: categoryFilter,
    level: levelFilter,
    search: searchQuery,
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      category: categoryFilter,
      level: levelFilter,
      search: searchQuery,
    });
  }, [categoryFilter, levelFilter, searchQuery]);

  // Fetch sessions when filters change
  useEffect(() => {
    fetchSessions(1, true);
  }, [filters.category, filters.level, filters.search]);

  const fetchSessions = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);

      // Build API params based on filters
      const params: any = {
        page: pageNum,
        limit: 12,
      };

      // Map the filters to what the API expects
      if (filters.search) params.search = filters.search;

      // Map level filter
      if (filters.level && filters.level !== "all") {
        params.level = filters.level;
      }

      // Map category to session_type if needed
      if (filters.category && filters.category !== "all") {
        // If category is group or one_on_one, map to session_type
        if (filters.category === "group" || filters.category === "one_on_one") {
          params.session_type = filters.category;
        }
      }

      console.log("Fetching sessions with params:", params);

      const response = await tuitionApi.getSessions(params);

      if (response.success) {
        // Use non-null assertion operator since we know data exists on success
        const data = response.data!;

        if (reset) {
          setSessions(data.sessions);
        } else {
          setSessions((prev) => [...prev, ...data.sessions]);
        }
        setTotal(data.total);
        setHasMore(data.sessions.length === 12);
        setPage(pageNum);
      }
    } catch (error) {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchSessions(page + 1);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category && newFilters.category !== "all") {
      params.append("category", newFilters.category);
    }
    if (newFilters.level && newFilters.level !== "all") {
      params.append("level", newFilters.level);
    }
    if (newFilters.search) {
      params.append("q", newFilters.search);
    }

    const queryString = params.toString();
    router.replace(`/sessions${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      level: "all",
      search: "",
    });
    router.replace("/sessions", { scroll: false });
  };

  const removeFilter = (type: string) => {
    const newFilters = { ...filters };
    if (type === "category") {
      newFilters.category = "all";
    } else if (type === "level") {
      newFilters.level = "all";
    } else if (type === "search") {
      newFilters.search = "";
    }
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (newFilters.category && newFilters.category !== "all") {
      params.append("category", newFilters.category);
    }
    if (newFilters.level && newFilters.level !== "all") {
      params.append("level", newFilters.level);
    }
    if (newFilters.search) {
      params.append("q", newFilters.search);
    }

    const queryString = params.toString();
    router.replace(`/sessions${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Started";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Helper function to safely parse numeric values
  const parseRating = (rating: any): number => {
    if (!rating) return 0;
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? 0 : parsed;
  };

  const parseNumber = (value: any): number => {
    if (!value) return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Category display mapping
  const getCategoryDisplay = (category: string) => {
    const map: Record<string, string> = {
      all: "All Sessions",
      group: "Group Sessions",
      one_on_one: "One-on-One",
    };
    return map[category] || category;
  };

  // Level display mapping
  const getLevelDisplay = (level: string) => {
    const map: Record<string, string> = {
      all: "All Levels",
      primary: "Primary School",
      junior_high: "Junior High School",
      senior_high: "Senior High School",
      university: "University",
      adult: "Adult Education",
    };
    return map[level] || level;
  };

  const SessionCard = ({ session }: { session: TutorSession }) => {
    const tutorRating = parseRating(session.tutor_rating);
    const feeAmount = parseNumber(session.fee_amount);
    const classesPerWeek = parseNumber(session.classes_per_week) || 1;
    const duration = parseNumber(session.class_duration_minutes) || 90;

    const formatLevel = (level?: string) => {
      if (!level) return null;
      const levelMap: Record<string, string> = {
        primary: "Primary",
        junior_high: "Junior High",
        senior_high: "Senior High",
        university: "University",
        adult: "Adult",
        all: "All Levels",
      };
      return levelMap[level] || level;
    };

    const courseLevel = formatLevel(session.course_level);

    return (
      <div
        onClick={() => router.push(`/tuitions/${session.id}`)}
        className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="p-3 flex items-center gap-2 border-b border-gray-100">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden flex-shrink-0">
            {session.tutor_avatar ? (
              <img
                src={session.tutor_avatar}
                alt={session.tutor_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {session.tutor_name || "Tutor"}
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  session.session_type === "one_on_one"
                    ? "bg-purple-50 text-main"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {session.session_type === "one_on_one" ? "1:1" : "Group"}
              </span>
              {courseLevel && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {courseLevel}
                </span>
              )}
              {tutorRating > 0 && (
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-600">
                    {tutorRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 mb-1">
            {session.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
            {session.course_title || session.description}
          </p>

          <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className="truncate">{formatDate(session.start_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{classesPerWeek}x/wk</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              <span>{duration * classesPerWeek}min</span>
            </div>
          </div>

          {courseLevel && (
            <div className="mb-2">
              <span className="text-xs px-2 py-1 bg-purple-50 text-zinc-700 rounded">
                {courseLevel} Level
              </span>
            </div>
          )}

          <div className="text-left">
            <p className="text-sm text-gray-700">
              {formatCurrency(feeAmount, session.fee_currency)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const SessionListItem = ({ session }: { session: TutorSession }) => {
    const tutorRating = parseRating(session.tutor_rating);
    const feeAmount = parseNumber(session.fee_amount);
    const classesPerWeek = parseNumber(session.classes_per_week) || 1;
    const duration = parseNumber(session.class_duration_minutes) || 90;

    const formatLevel = (level?: string) => {
      if (!level) return null;
      const levelMap: Record<string, string> = {
        primary: "Primary",
        junior_high: "Junior High",
        senior_high: "Senior High",
        university: "University",
        adult: "Adult",
        all: "All Levels",
      };
      return levelMap[level] || level;
    };

    const courseLevel = formatLevel(session.course_level);

    return (
      <div
        onClick={() => router.push(`/tuitions/${session.id}`)}
        className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="p-4 flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden flex-shrink-0">
            {session.tutor_avatar ? (
              <img
                src={session.tutor_avatar}
                alt={session.tutor_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  session.session_type === "one_on_one"
                    ? "bg-purple-50 text-main"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {session.session_type === "one_on_one" ? "1:1" : "Group"}
              </span>
              {courseLevel && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {courseLevel}
                </span>
              )}
              <span className="text-sm font-medium text-gray-900">
                {session.tutor_name || "Tutor"}
              </span>
              {tutorRating > 0 && (
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-600">
                    {tutorRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-gray-800 mb-1">{session.name}</h3>

            <p className="text-sm text-gray-500 line-clamp-1 mb-2">
              {session.course_title || session.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Starts {formatDate(session.start_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{classesPerWeek} classes/week</span>
              </div>
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                <span>{duration * classesPerWeek}min total</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>
                  {session.current_enrollment}/{session.max_students}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(feeAmount, session.fee_currency)}
            </p>
            <p className="text-xs text-gray-500">per student</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Sessions</h1>
          <p className="text-gray-500 mt-1">
            Discover and enroll in learning sessions
          </p>
        </div>

        {/* Active Filters */}
        {(filters.category !== "all" ||
          filters.level !== "all" ||
          filters.search) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.category !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-main text-sm rounded-full">
                <Award className="w-3 h-3" />
                {getCategoryDisplay(filters.category)}
                <button
                  onClick={() => removeFilter("category")}
                  className="ml-1 p-0.5 hover:bg-purple-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.level !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                <GraduationCap className="w-3 h-3" />
                {getLevelDisplay(filters.level)}
                <button
                  onClick={() => removeFilter("level")}
                  className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                <Search className="w-3 h-3" />"{filters.search}"
                <button
                  onClick={() => removeFilter("search")}
                  className="ml-1 p-0.5 hover:bg-green-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-main hover:text-purple-700 font-medium ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Filters Panel */}
        {/* <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">Filters</span>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                showFilters ? "rotate-90" : ""
              }`}
            />
          </button>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Filter Options</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-main hover:text-purple-700"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Session Type
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Sessions</option>
                    <option value="group">Group Sessions</option>
                    <option value="one_on_one">One-on-One</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Level
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) =>
                      handleFilterChange("level", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Levels</option>
                    <option value="primary">Primary School</option>
                    <option value="junior_high">Junior High School</option>
                    <option value="senior_high">Senior High School</option>
                    <option value="university">University</option>
                    <option value="adult">Adult Education</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div> */}

        {/* Results Count and View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing {sessions.length} of {total} session{total !== 1 ? "s" : ""}
          </p>
          <div className="hidden md:flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-purple-50 text-main" : "bg-white text-gray-500"}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-purple-50 text-main" : "bg-white text-gray-500"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sessions Grid/List */}
        {loading && sessions.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-main" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-main text-white rounded-lg hover:bg-main"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <SessionListItem key={session.id} session={session} />
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Load More Sessions
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
