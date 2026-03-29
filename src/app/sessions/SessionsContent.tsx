// src/app/sessions/SessionsContent.tsx
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

  // Get filter values from URL
  const categoryFilter = searchParams.get("category") || "all";
  const levelFilter = searchParams.get("level") || "all";
  const searchQuery = searchParams.get("q") || "";
  const curriculumIdFilter = searchParams.get("curriculum_id") || null;
  const curriculumLevelIdFilter =
    searchParams.get("curriculum_level_id") || null;
  const noCurriculumFilter = searchParams.get("no_curriculum") === "true";

  const [filters, setFilters] = useState({
    category: categoryFilter,
    level: levelFilter,
    search: searchQuery,
    curriculum_id: curriculumIdFilter,
    curriculum_level_id: curriculumLevelIdFilter,
    no_curriculum: noCurriculumFilter,
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      category: categoryFilter,
      level: levelFilter,
      search: searchQuery,
      curriculum_id: curriculumIdFilter,
      curriculum_level_id: curriculumLevelIdFilter,
      no_curriculum: noCurriculumFilter,
    });
  }, [
    categoryFilter,
    levelFilter,
    searchQuery,
    curriculumIdFilter,
    curriculumLevelIdFilter,
    noCurriculumFilter,
  ]);

  // Fetch sessions when filters change
  useEffect(() => {
    fetchSessions(1, true);
  }, [
    filters.category,
    filters.level,
    filters.search,
    filters.curriculum_id,
    filters.curriculum_level_id,
    filters.no_curriculum,
  ]);

  const fetchSessions = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);

      const params: any = {
        page: pageNum,
        limit: 12,
      };

      if (filters.search) params.search = filters.search;
      if (filters.level && filters.level !== "all") {
        params.level = filters.level;
      }
      if (filters.category && filters.category !== "all") {
        if (filters.category === "group" || filters.category === "one_on_one") {
          params.session_type = filters.category;
        }
      }

      // Handle curriculum filtering
      if (filters.no_curriculum) {
        params.no_curriculum = "true";
      } else if (
        filters.curriculum_id &&
        filters.curriculum_id !== "all" &&
        filters.curriculum_id !== "null"
      ) {
        params.curriculum_id = filters.curriculum_id;
        if (
          filters.curriculum_level_id &&
          filters.curriculum_level_id !== "all" &&
          filters.curriculum_level_id !== "null"
        ) {
          params.curriculum_level_id = filters.curriculum_level_id;
        }
      }

      console.log("Fetching sessions with params:", params);

      const response = await tuitionApi.getSessions(params);

      if (response.success) {
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
    if (
      newFilters.curriculum_id &&
      newFilters.curriculum_id !== "all" &&
      newFilters.curriculum_id !== "null"
    ) {
      params.append("curriculum_id", newFilters.curriculum_id);
    }
    if (
      newFilters.curriculum_level_id &&
      newFilters.curriculum_level_id !== "all" &&
      newFilters.curriculum_level_id !== "null"
    ) {
      params.append("curriculum_level_id", newFilters.curriculum_level_id);
    }
    if (newFilters.no_curriculum) {
      params.append("no_curriculum", "true");
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
      curriculum_id: null,
      curriculum_level_id: null,
      no_curriculum: false,
    });
    router.replace("/sessions", { scroll: false });
  };

  const removeFilter = (type: string) => {
    const newFilters = { ...filters };
    if (type === "category") {
      newFilters.category = "all";
    } else if (type === "level") {
      newFilters.level = "all";
    } else if (type === "curriculum") {
      newFilters.curriculum_id = null;
      newFilters.curriculum_level_id = null;
      newFilters.no_curriculum = false;
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
    if (
      newFilters.curriculum_id &&
      newFilters.curriculum_id !== "all" &&
      newFilters.curriculum_id !== "null"
    ) {
      params.append("curriculum_id", newFilters.curriculum_id);
    }
    if (
      newFilters.curriculum_level_id &&
      newFilters.curriculum_level_id !== "all" &&
      newFilters.curriculum_level_id !== "null"
    ) {
      params.append("curriculum_level_id", newFilters.curriculum_level_id);
    }
    if (newFilters.no_curriculum) {
      params.append("no_curriculum", "true");
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

  const getCategoryDisplay = (category: string) => {
    const map: Record<string, string> = {
      all: "All Sessions",
      group: "Group Sessions",
      one_on_one: "One-on-One",
    };
    return map[category] || category;
  };

  const getLevelDisplay = (level: string) => {
    const map: Record<string, string> = {
      all: "All Levels",
      primary: "Primary School",
      junior_high: "Junior High School",
      senior_high: "Senior High School",
      university: "University",
      adult: "Adult / Professional",
    };
    return map[level] || level;
  };

  const getCurriculumDisplay = () => {
    if (filters.no_curriculum) {
      return "Professional / No Curriculum";
    }
    if (filters.curriculum_id && filters.curriculum_id !== "null") {
      return `Curriculum: ${filters.curriculum_id}${filters.curriculum_level_id ? ` - Level ${filters.curriculum_level_id}` : ""}`;
    }
    return null;
  };

  const SessionCard = ({ session }: { session: TutorSession }) => {
    const tutorRating = parseRating(session.tutor_rating);
    const feeAmount = parseNumber(session.fee_amount);
    const classesPerWeek = parseNumber(session.classes_per_week) || 1;
    const duration = parseNumber(session.class_duration_minutes) || 90;

    const capitalizeName = (name: string): string => {
      if (!name) return "";
      return name
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    };

    const capitalizedTutorName = capitalizeName(session.tutor_name || "Tutor");
    const capitalizedSessionName = capitalizeName(session.name);

    const handleCardClick = () => {
      if (session.uuid) {
        router.push(`/tuitions/${session.uuid}`);
      } else {
        console.error("Session has no UUID:", session);
        toast.error("Unable to open session");
      }
    };

    return (
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="p-3 flex items-center gap-2 border-b border-gray-100">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden flex-shrink-0">
            {session.tutor_avatar ? (
              <img
                src={session.tutor_avatar}
                alt={capitalizedTutorName}
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
              {capitalizedTutorName}
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
            {capitalizedSessionName}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
            {session.subject && `Subject: ${session.subject}`}
          </p>

          {/* Curriculum Badge */}
          {session.curriculum_name && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                <Globe className="w-3 h-3" />
                {session.curriculum_name}
                {session.curriculum_level_name && (
                  <span className="text-green-500">
                    {" "}
                    - {session.curriculum_level_name}
                  </span>
                )}
              </span>
            </div>
          )}

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
              <span>{Math.floor(duration * classesPerWeek)}min</span>
            </div>
          </div>

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

    const capitalizeName = (name: string): string => {
      if (!name) return "";
      return name
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    };

    const capitalizedTutorName = capitalizeName(session.tutor_name || "Tutor");
    const capitalizedSessionName = capitalizeName(session.name);

    const handleCardClick = () => {
      if (session.uuid) {
        router.push(`/tuitions/${session.uuid}`);
      } else {
        console.error("Session has no UUID:", session);
        toast.error("Unable to open session");
      }
    };

    return (
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="p-4 flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden flex-shrink-0">
            {session.tutor_avatar ? (
              <img
                src={session.tutor_avatar}
                alt={capitalizedTutorName}
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
              <span className="text-sm font-medium text-gray-900">
                {capitalizedTutorName}
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

            <h3 className="font-semibold text-gray-800 mb-1">
              {capitalizedSessionName}
            </h3>

            <p className="text-sm text-gray-500 line-clamp-1 mb-2">
              {session.subject && `Subject: ${session.subject}`}
            </p>

            {/* Curriculum Badge for List View */}
            {session.curriculum_name && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                  <Globe className="w-3 h-3" />
                  {session.curriculum_name}
                  {session.curriculum_level_name && (
                    <span className="text-green-500">
                      {" "}
                      - {session.curriculum_level_name}
                    </span>
                  )}
                </span>
              </div>
            )}

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
                <span>{Math.floor(duration * classesPerWeek)}min total</span>
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
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Sessions</h1>
          <p className="text-gray-500 mt-1">
            Discover and enroll in learning sessions
          </p>
        </div>

        {(filters.category !== "all" ||
          filters.level !== "all" ||
          filters.search ||
          filters.curriculum_id ||
          filters.no_curriculum) && (
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

            {filters.no_curriculum && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                <Globe className="w-3 h-3" />
                Professional / No Curriculum
                <button
                  onClick={() => removeFilter("curriculum")}
                  className="ml-1 p-0.5 hover:bg-green-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.curriculum_id &&
              filters.curriculum_id !== "all" &&
              filters.curriculum_id !== "null" &&
              !filters.no_curriculum && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                  <BookOpen className="w-3 h-3" />
                  Curriculum: {filters.curriculum_id}
                  {filters.curriculum_level_id &&
                    filters.curriculum_level_id !== "all" &&
                    ` - Level ${filters.curriculum_level_id}`}
                  <button
                    onClick={() => removeFilter("curriculum")}
                    className="ml-1 p-0.5 hover:bg-green-200 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
                <Search className="w-3 h-3" />"{filters.search}"
                <button
                  onClick={() => removeFilter("search")}
                  className="ml-1 p-0.5 hover:bg-yellow-200 rounded-full transition-colors"
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

        {/* Adult Education Info Banner */}
        {filters.level === "adult" && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Professional & Adult Education
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Showing professional courses, certifications, and specialized
                  training programs designed for adult learners and career
                  advancement.
                </p>
              </div>
            </div>
          </div>
        )}

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
