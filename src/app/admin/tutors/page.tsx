// src/app/admin/tutors/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Star,
  DollarSign,
  BookOpen,
  Mail,
  Phone,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  Award,
  TrendingUp,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";
import client from "@/lib/api/client";

interface Tutor {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  bio: string;
  headline: string;
  rating: number | null;
  total_sessions: number;
  total_students: number;
  response_rate: number;
  response_time: string;
  hourly_rate: number;
  currency: string;
  is_featured: boolean;
  is_available: boolean;
  tutor_level_id: number;
  tutor_level_name: string;
  created_at: string;
  subjects: Array<{
    id: number;
    subject: string;
    hourly_rate: number;
    experience_years: number;
    levels: string[];
  }>;
  total_earnings?: number;
  total_courses?: number;
  total_active_sessions?: number;
}

interface TutorsResponse {
  success: boolean;
  data: {
    tutors: Tutor[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function AdminTutorsPage() {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [tutorLevels, setTutorLevels] = useState<
    Array<{ id: number; name: string }>
  >([]);

  useEffect(() => {
    fetchTutorLevels();
  }, []);

  useEffect(() => {
    fetchTutors();
  }, [pagination.page, filterLevel, filterAvailability, sortBy]);

  const fetchTutorLevels = async () => {
    try {
      const response = await client.get<{ success: boolean; data: any[] }>(
        "/tutor/levels",
      );

      if (response.success && response.data) {
        // Map the level_name from the API response
        const levels = response.data.map((level) => ({
          id: level.id,
          name: level.level_name, // Use level_name from the API
        }));
        setTutorLevels(levels);
      } else {
        // Fallback levels in case API fails
        setTutorLevels([
          { id: 1, name: "College Student" },
          { id: 2, name: "Junior High Teacher" },
          { id: 3, name: "Senior High Teacher" },
          { id: 4, name: "University Lecturer" },
          { id: 5, name: "Skilled Professional" },
          { id: 6, name: "Private Tutor" },
          { id: 7, name: "Primary School Teacher" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching tutor levels:", error);
      // Fallback levels
      setTutorLevels([
        { id: 1, name: "College Student" },
        { id: 2, name: "Junior High Teacher" },
        { id: 3, name: "Senior High Teacher" },
        { id: 4, name: "University Lecturer" },
        { id: 5, name: "Skilled Professional" },
        { id: 6, name: "Private Tutor" },
        { id: 7, name: "Primary School Teacher" },
      ]);
    }
  };

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: pagination.page,
        limit: 20,
        sort: sortBy,
      };

      if (filterLevel !== "all") {
        params.tutor_level_id = filterLevel;
      }

      if (filterAvailability !== "all") {
        params.is_available = filterAvailability === "available";
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await client.get<TutorsResponse>(
        "/admin/tutors/all",
        params,
      );

      if (response.success && response.data) {
        setTutors(response.data.tutors);
        setPagination({
          page: response.data.page,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
      } else {
        toast.error("Failed to load tutors");
      }
    } catch (error) {
      console.error("Error fetching tutors:", error);
      toast.error("Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchTutors();
  };

  const handleStatusToggle = async (
    tutorId: number,
    currentStatus: boolean,
  ) => {
    try {
      const response = await client.put<{ success: boolean }>(
        `/admin/tutors/${tutorId}/status`,
        { is_available: !currentStatus },
      );

      if (response.success) {
        toast.success(
          `Tutor ${!currentStatus ? "activated" : "deactivated"} successfully`,
        );
        fetchTutors();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating tutor status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleFeatureToggle = async (
    tutorId: number,
    currentFeatured: boolean,
  ) => {
    try {
      const response = await client.put<{ success: boolean }>(
        `/admin/tutors/${tutorId}/feature`,
        { is_featured: !currentFeatured },
      );

      if (response.success) {
        toast.success(
          `Tutor ${!currentFeatured ? "featured" : "unfeatured"} successfully`,
        );
        fetchTutors();
      } else {
        toast.error("Failed to update featured status");
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const getRatingStars = (rating: number | null) => {
    const safeRating = rating || 0;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(safeRating)
                ? "text-yellow-400 fill-yellow-400"
                : i < safeRating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">
          {safeRating.toFixed(1)}
        </span>
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTutors = tutors.filter(
    (tutor) =>
      tutor.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const averageRating =
    tutors.length > 0
      ? (
          tutors.reduce((sum, t) => sum + (t.rating || 0), 0) / tutors.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tutors</h1>
        <p className="text-gray-600 mt-1">
          Manage all registered tutors on the platform
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
              <p className="text-sm text-gray-500">Total Tutors</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tutors.filter((t) => t.is_available).length}
              </p>
              <p className="text-sm text-gray-500">Active Tutors</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {averageRating}
              </p>
              <p className="text-sm text-gray-500">Avg. Rating</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tutors.reduce((sum, t) => sum + (t.total_sessions || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Total Sessions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tutors.reduce((sum, t) => sum + (t.total_students || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 bg-white"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filterLevel !== "all" || filterAvailability !== "all") && (
              <span className="w-2 h-2 bg-purple-600 rounded-full" />
            )}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tutor Level
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white text-gray-900 cursor-pointer"
              >
                <option value="all" className="text-gray-900 bg-white">
                  All Levels
                </option>
                {tutorLevels.map((level) => (
                  <option
                    key={level.id}
                    value={level.id}
                    className="text-gray-900 bg-white"
                  >
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white text-gray-900 cursor-pointer"
              >
                <option value="all" className="text-gray-900 bg-white">
                  All
                </option>
                <option value="available" className="text-gray-900 bg-white">
                  Available
                </option>
                <option value="unavailable" className="text-gray-900 bg-white">
                  Unavailable
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white text-gray-900 cursor-pointer"
              >
                <option value="newest" className="text-gray-900 bg-white">
                  Newest First
                </option>
                <option value="oldest" className="text-gray-900 bg-white">
                  Oldest First
                </option>
                <option value="rating" className="text-gray-900 bg-white">
                  Highest Rated
                </option>
                <option value="sessions" className="text-gray-900 bg-white">
                  Most Sessions
                </option>
                <option value="students" className="text-gray-900 bg-white">
                  Most Students
                </option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tutors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tutors found</p>
            {(searchTerm ||
              filterLevel !== "all" ||
              filterAvailability !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterLevel("all");
                  setFilterAvailability("all");
                  setSortBy("newest");
                  fetchTutors();
                }}
                className="mt-2 text-purple-600 hover:text-purple-700 text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTutors.map((tutor) => (
                  <tr
                    key={tutor.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/tutors/${tutor.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                          {tutor.avatar_url ? (
                            <img
                              src={tutor.avatar_url}
                              alt={tutor.first_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-purple-600 font-semibold">
                              {tutor.first_name?.[0]}
                              {tutor.last_name?.[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {tutor.first_name} {tutor.last_name}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            {tutor.email}
                          </div>
                          {tutor.phone && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Phone className="w-3 h-3" />
                              {tutor.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {tutor.tutor_level_name || "Not set"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects?.slice(0, 2).map((subject) => (
                          <span
                            key={subject.id}
                            className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs"
                          >
                            {subject.subject}
                          </span>
                        ))}
                        {tutor.subjects && tutor.subjects.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{tutor.subjects.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRatingStars(tutor.rating)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(tutor.hourly_rate)}
                        <span className="text-xs text-gray-500">/hr</span>
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">
                          {tutor.total_sessions} sessions
                        </p>
                        <p className="text-gray-500 text-xs">
                          {tutor.total_students} students
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            tutor.is_available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tutor.is_available ? "Available" : "Unavailable"}
                        </span>
                        {tutor.is_featured && (
                          <div className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Award className="w-3 h-3 mr-1" />
                            Featured
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFeatureToggle(tutor.id, tutor.is_featured);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            tutor.is_featured
                              ? "text-yellow-600 hover:text-yellow-700"
                              : "text-gray-400 hover:text-yellow-600"
                          }`}
                          title={
                            tutor.is_featured
                              ? "Remove featured"
                              : "Make featured"
                          }
                        >
                          <Award className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle(tutor.id, tutor.is_available);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            tutor.is_available
                              ? "text-green-600 hover:text-red-600"
                              : "text-red-600 hover:text-green-600"
                          }`}
                          title={
                            tutor.is_available
                              ? "Mark unavailable"
                              : "Mark available"
                          }
                        >
                          {tutor.is_available ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/tutors/${tutor.id}`);
                          }}
                          className="p-2 text-gray-400 hover:text-purple-600 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
