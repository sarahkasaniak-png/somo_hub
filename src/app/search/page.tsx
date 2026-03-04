// src/app/search/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import client from "@/lib/api/client";
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
  ArrowLeft,
  BookOpen,
  Tag,
} from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get filter values from URL
  const category = searchParams.get("category") || "all";
  const level = searchParams.get("level") || "all";
  const searchQuery = searchParams.get("q") || "";

  // Level display mapping
  const levelDisplayMap: Record<string, string> = {
    all: "All Levels",
    primary: "Primary School",
    junior_high: "Junior High School",
    senior_high: "Senior High School",
    university: "University",
    adult: "Adult Education",
  };

  // Category display mapping
  const categoryDisplayMap: Record<string, string> = {
    all: "All Sessions",
    group: "Group Sessions",
    one_on_one: "One-on-One",
  };

  useEffect(() => {
    fetchSearchResults(1, true);
  }, [category, level, searchQuery]);

  const fetchSearchResults = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const response = await client.get("/tuitions/search", {
        page: pageNum,
        limit: 12,
        session_type: category !== "all" ? category : undefined,
        level: level !== "all" ? level : undefined,
        search: searchQuery || undefined,
      });

      if (response.success && response.data) {
        if (reset) {
          setSessions(response.data.sessions);
        } else {
          setSessions((prev) => [...prev, ...response.data.sessions]);
        }
        setTotal(response.data.total);
        setHasMore(response.data.sessions.length === 12);
        setPage(pageNum);
      }
    } catch (error) {
      toast.error("Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchSearchResults(page + 1);
    }
  };

  const removeFilter = (filterType: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filterType === "category") {
      params.delete("category");
    } else if (filterType === "level") {
      params.delete("level");
    } else if (filterType === "search") {
      params.delete("q");
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  const clearAllFilters = () => {
    router.push("/search");
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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden flex-shrink-0">
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
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              Search Results
            </h1>
          </div>

          {/* Active Filters */}
          {(category !== "all" || level !== "all" || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
              <span className="text-sm text-gray-500">Active filters:</span>

              {/* Category filter */}
              {category !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                  <Tag className="w-3 h-3" />
                  {categoryDisplayMap[category] || category}
                  <button
                    onClick={() => removeFilter("category")}
                    className="ml-1 p-0.5 hover:bg-purple-200 rounded-full transition-colors"
                    title="Remove category filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Level filter */}
              {level !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                  <BookOpen className="w-3 h-3" />
                  {levelDisplayMap[level] || level}
                  <button
                    onClick={() => removeFilter("level")}
                    className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                    title="Remove level filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Search query filter */}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                  <Search className="w-3 h-3" />"{searchQuery}"
                  <button
                    onClick={() => removeFilter("search")}
                    className="ml-1 p-0.5 hover:bg-green-200 rounded-full transition-colors"
                    title="Remove search filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Clear all button */}
              <button
                onClick={clearAllFilters}
                className="text-sm text-main hover:text-purple-700 font-medium ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count and View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Found {total} session{total !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-purple-50 text-main" : "bg-white text-gray-500"}`}
              title="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-purple-50 text-main" : "bg-white text-gray-500"}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Grid */}
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
              onClick={clearAllFilters}
              className="px-6 py-2 bg-main text-white rounded-lg hover:bg-purple-700"
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
                  Load More Results
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
