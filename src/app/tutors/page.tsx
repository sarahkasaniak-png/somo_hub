// src/app/tutors/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tuitionApi from "@/lib/api/tuition";
import { Tutor } from "@/types/tuition.types";
import {
  Search,
  Star,
  User,
  BookOpen,
  Clock,
  Users,
  GraduationCap,
  Loader2,
  BadgeCheck,
  X,
  Award,
  ChevronRight,
} from "lucide-react";

export default function TutorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Get filter values from URL
  const categoryFilter = searchParams.get("category") || "all";
  const levelFilter = searchParams.get("level") || "all";
  const searchQuery = searchParams.get("q") || "";
  const subjectFilter = searchParams.get("subject") || "";

  const [filters, setFilters] = useState({
    category: categoryFilter,
    level: levelFilter,
    subject: subjectFilter,
    search: searchQuery,
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      category: categoryFilter,
      level: levelFilter,
      subject: subjectFilter,
      search: searchQuery,
    });
  }, [categoryFilter, levelFilter, subjectFilter, searchQuery]);

  // Fetch tutors when filters change
  useEffect(() => {
    fetchTutors(1, true);
  }, [filters.category, filters.level, filters.subject, filters.search]);

  const fetchTutors = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);

      // Build API params based on filters
      const params: any = {
        page: pageNum,
        limit: 12,
      };

      if (filters.search) params.search = filters.search;
      if (filters.subject) params.subject = filters.subject;
      if (filters.level && filters.level !== "all")
        params.level = filters.level;

      // Category mapping to API params
      if (filters.category && filters.category !== "all") {
        if (filters.category === "featured") {
          params.is_featured = true;
        } else if (filters.category === "popular") {
          params.sort = "popular";
        } else if (filters.category === "new") {
          params.sort = "newest";
        }
      }

      const response = await tuitionApi.getTutors(params);

      if (response.success) {
        const tutorsData = response.data?.tutors || [];
        const totalCount = response.data?.total || 0;

        if (reset) {
          setTutors(tutorsData);
        } else {
          setTutors((prev) => [...prev, ...tutorsData]);
        }
        setTotal(totalCount);
        setHasMore(tutorsData.length === 12);
        setPage(pageNum);
      }
    } catch (error) {
      toast.error("Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchTutors(page + 1);
    }
  };

  const removeFilter = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type === "category") {
      params.delete("category");
    } else if (type === "level") {
      params.delete("level");
    } else if (type === "search") {
      params.delete("q");
    } else if (type === "subject") {
      params.delete("subject");
    }

    const queryString = params.toString();
    router.replace(`/tutors${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    router.replace("/tutors", { scroll: false });
  };

  const formatCurrency = (amount: number, currency: string = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Category display mapping
  const getCategoryDisplay = (category: string) => {
    const map: Record<string, string> = {
      all: "All Tutors",
      featured: "Featured Tutors",
      popular: "Most Popular",
      new: "New Tutors",
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

  const TutorCard = ({ tutor }: { tutor: Tutor }) => {
    return (
      <div
        onClick={() => router.push(`/tutors/${tutor.id}`)}
        className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
              {tutor.avatar_url ? (
                <img
                  src={tutor.avatar_url}
                  alt={`${tutor.first_name} ${tutor.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-main transition-colors">
                {tutor.first_name} {tutor.last_name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-1">
                {tutor.headline || "Tutor"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">
                  {(tutor.rating &&
                    parseFloat(tutor.rating.toString()).toFixed(1)) ||
                    "New"}
                </span>
                {tutor.is_featured && (
                  <BadgeCheck className="w-4 h-4 text-blue-500 ml-1" />
                )}
              </div>
            </div>
          </div>

          {/* Subjects */}
          {tutor.subjects && tutor.subjects.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {tutor.subjects.slice(0, 3).map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {subject.subject}
                  </span>
                ))}
                {tutor.subjects.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{tutor.subjects.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{tutor.total_students || 0} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{tutor.response_time || "24hrs"}</span>
            </div>
          </div>

          {/* Rate */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(tutor.hourly_rate, tutor.currency)}
              <span className="text-sm font-normal text-gray-500">/hr</span>
            </p>
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
          <h1 className="text-2xl font-semibold text-gray-900">Tutors</h1>
          <p className="text-gray-500 mt-1">
            Find the perfect tutor for your learning needs
          </p>
        </div>

        {/* Active Filters */}
        {(filters.category !== "all" ||
          filters.level !== "all" ||
          filters.search ||
          filters.subject) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
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
            {filters.subject && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full">
                <BookOpen className="w-3 h-3" />
                {filters.subject}
                <button
                  onClick={() => removeFilter("subject")}
                  className="ml-1 p-0.5 hover:bg-amber-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-purple-600 hover:text-main font-medium ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500">
          Showing {tutors.length} of {total} tutor{total !== 1 ? "s" : ""}
        </div>

        {/* Tutors Grid */}
        {loading && tutors.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tutors found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-main"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Load More Tutors
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
