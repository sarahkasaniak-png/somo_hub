// src/app/admin/tutors/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  BookOpen,
  Users,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Languages,
  FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";
import client from "@/lib/api/client";

interface TutorDetail {
  id: number;
  user_id: number;
  tutor_application_id: number;
  bio: string | null;
  headline: string | null;
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
  tutor_level_description: string;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  country: string | null;
  city: string | null;
  user_joined: string;
  total_earnings: number;
  total_active_sessions: number;
  subjects: Array<{
    id: number;
    subject: string;
    hourly_rate: number;
    experience_years: number;
    is_verified: boolean;
    levels: string[];
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  education: Array<{
    id: number;
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string | null;
    current: boolean;
    description: string | null;
  }>;
  recent_sessions: Array<{
    id: number;
    name: string;
    session_code: string;
    session_type: string;
    start_date: string;
    end_date: string;
    fee_amount: number;
    enrollment_status: string;
    session_status: string;
    enrolled_count: number;
  }>;
  recent_enrollments: Array<{
    id: number;
    student_id: number;
    student_first_name: string;
    student_last_name: string;
    student_email: string;
    session_name: string;
    enrollment_status: string;
    payment_status: string;
    payment_amount: number;
    enrolled_at: string;
  }>;
}

export default function AdminTutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const [tutor, setTutor] = useState<TutorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "sessions" | "enrollments" | "education"
  >("sessions");
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [showEditRateModal, setShowEditRateModal] = useState(false);
  const [newRate, setNewRate] = useState("");

  // Handle params properly for Next.js 15+
  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const unwrappedParams =
          params instanceof Promise ? await params : params;
        const id = unwrappedParams?.id;
        if (id) {
          setTutorId(id);
        } else {
          toast.error("Invalid tutor ID");
        }
      } catch (error) {
        console.error("Error unwrapping params:", error);
        toast.error("Failed to load tutor ID");
      }
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (tutorId) {
      fetchTutorDetails();
      fetchTutorStats();
    }
  }, [tutorId]);

  const fetchTutorDetails = async () => {
    if (!tutorId) return;

    setLoading(true);
    try {
      const response = await client.get<{
        success: boolean;
        data: TutorDetail;
      }>(`/admin/tutors/${tutorId}`);

      if (response.success && response.data) {
        setTutor(response.data);
      } else {
        toast.error("Failed to load tutor details");
      }
    } catch (error) {
      console.error("Error fetching tutor details:", error);
      toast.error("Failed to load tutor details");
    } finally {
      setLoading(false);
    }
  };

  const fetchTutorStats = async () => {
    if (!tutorId) return;

    try {
      const response = await client.get<{ success: boolean; data: any }>(
        `/admin/tutors/${tutorId}/stats`,
      );

      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching tutor stats:", error);
    }
  };

  const handleStatusToggle = async () => {
    if (!tutorId || !tutor) return;

    setActionLoading(true);
    try {
      const response = await client.put<{ success: boolean }>(
        `/admin/tutors/${tutorId}/status`,
        { is_available: !tutor.is_available },
      );

      if (response.success) {
        toast.success(
          `Tutor ${!tutor.is_available ? "activated" : "deactivated"} successfully`,
        );
        fetchTutorDetails();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeatureToggle = async () => {
    if (!tutorId || !tutor) return;

    setActionLoading(true);
    try {
      const response = await client.put<{ success: boolean }>(
        `/admin/tutors/${tutorId}/feature`,
        { is_featured: !tutor.is_featured },
      );

      if (response.success) {
        toast.success(
          `Tutor ${!tutor.is_featured ? "featured" : "unfeatured"} successfully`,
        );
        fetchTutorDetails();
      } else {
        toast.error("Failed to update featured status");
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateHourlyRate = async () => {
    if (!tutorId || !newRate) return;

    setActionLoading(true);
    try {
      const rate = parseFloat(newRate);
      if (isNaN(rate) || rate < 0) {
        toast.error("Please enter a valid hourly rate");
        return;
      }

      const response = await client.put<{ success: boolean }>(
        `/admin/tutors/${tutorId}/rate`,
        { hourly_rate: rate },
      );

      if (response.success) {
        toast.success("Hourly rate updated successfully");
        setShowEditRateModal(false);
        fetchTutorDetails();
      } else {
        toast.error("Failed to update hourly rate");
      }
    } catch (error) {
      console.error("Error updating hourly rate:", error);
      toast.error("Failed to update hourly rate");
    } finally {
      setActionLoading(false);
    }
  };

  const getRatingStars = (rating: number | null) => {
    const safeRating = rating || 0;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(safeRating)
                ? "text-yellow-400 fill-yellow-400"
                : i < safeRating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      scheduled: "bg-purple-100 text-purple-800",
      ongoing: "bg-orange-100 text-orange-800",
      open: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
      waiting_list: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      partial: "bg-yellow-100 text-yellow-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return badges[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tutor not found</p>
        <Link
          href="/admin/tutors"
          className="text-purple-600 hover:underline mt-2 inline-block"
        >
          Back to tutors
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/tutors"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tutors
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
              {tutor.avatar_url ? (
                <img
                  src={tutor.avatar_url}
                  alt={tutor.first_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-purple-600 font-semibold text-2xl">
                  {tutor.first_name?.[0]}
                  {tutor.last_name?.[0]}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {tutor.first_name} {tutor.last_name}
              </h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <div className="flex items-center gap-1 text-gray-500">
                  <Mail className="w-4 h-4" />
                  {tutor.email}
                </div>
                {tutor.phone && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Phone className="w-4 h-4" />
                    {tutor.phone}
                  </div>
                )}
                {tutor.headline && (
                  <span className="text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    {tutor.headline}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleFeatureToggle}
              disabled={actionLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                tutor.is_featured
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Award className="w-4 h-4" />
              {tutor.is_featured ? "Featured" : "Make Featured"}
            </button>
            <button
              onClick={() => setShowEditRateModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Rate
            </button>
            <button
              onClick={handleStatusToggle}
              disabled={actionLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                tutor.is_available
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {tutor.is_available ? (
                <>
                  <XCircle className="w-4 h-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Activate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {(tutor.rating || 0).toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Rating</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {tutor.total_sessions}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total Sessions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {tutor.total_students}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total Students</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(tutor.hourly_rate)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Hourly Rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(tutor.total_earnings || 0)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total Earnings</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          {/* About */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">About</h2>
            </div>
            <div className="p-6">
              {tutor.bio ? (
                <p className="text-gray-600 whitespace-pre-wrap">{tutor.bio}</p>
              ) : (
                <p className="text-gray-400">No bio provided</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Contact Information
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{tutor.email}</span>
              </div>
              {tutor.phone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{tutor.phone}</span>
                </div>
              )}
              {(tutor.country || tutor.city) && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {tutor.city}
                    {tutor.city && tutor.country ? ", " : ""}
                    {tutor.country}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(tutor.user_joined)}</span>
              </div>
            </div>
          </div>

          {/* Tutor Level */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Tutor Level</h2>
            </div>
            <div className="p-6">
              <div className="mb-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {tutor.tutor_level_name || "Not specified"}
                </span>
              </div>
              {tutor.tutor_level_description && (
                <p className="text-sm text-gray-500 mt-2">
                  {tutor.tutor_level_description}
                </p>
              )}
            </div>
          </div>

          {/* Languages */}
          {tutor.languages && tutor.languages.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Languages</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {tutor.languages.map((lang) => (
                    <span
                      key={lang.language}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {lang.language} ({lang.proficiency})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subjects */}
          {tutor.subjects && tutor.subjects.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Subjects</h2>
              </div>
              <div className="p-6 space-y-3">
                {tutor.subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {subject.subject}
                        </p>
                        <p className="text-sm text-gray-500">
                          {subject.experience_years} years experience
                        </p>
                        {subject.levels && subject.levels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {subject.levels.map((level) => (
                              <span
                                key={level}
                                className="text-xs px-2 py-0.5 bg-gray-100 rounded-full"
                              >
                                {level.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-green-600">
                        {formatCurrency(subject.hourly_rate)}/hr
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sessions, Enrollments, Education */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              {["sessions", "enrollments", "education"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-3 px-1 text-sm font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Recent Sessions</h2>
              </div>
              {tutor.recent_sessions && tutor.recent_sessions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {tutor.recent_sessions.map((session) => (
                    <div key={session.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span>Code: {session.session_code}</span>
                            <span>Type: {session.session_type}</span>
                            <span>Students: {session.enrolled_count}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-400">
                              {formatDate(session.start_date)} -{" "}
                              {formatDate(session.end_date)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(session.session_status)}`}
                            >
                              {session.session_status}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(session.enrollment_status)}`}
                            >
                              {session.enrollment_status}
                            </span>
                          </div>
                        </div>
                        <p className="font-medium text-green-600">
                          {formatCurrency(session.fee_amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No sessions found</p>
                </div>
              )}
            </div>
          )}

          {/* Enrollments Tab */}
          {activeTab === "enrollments" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Recent Enrollments
                </h2>
              </div>
              {tutor.recent_enrollments &&
              tutor.recent_enrollments.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {tutor.recent_enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {enrollment.student_first_name}{" "}
                            {enrollment.student_last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {enrollment.student_email}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Session: {enrollment.session_name}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(enrollment.enrollment_status)}`}
                            >
                              {enrollment.enrollment_status}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(enrollment.payment_status)}`}
                            >
                              {enrollment.payment_status}
                            </span>
                            <span className="text-xs text-gray-400">
                              Enrolled: {formatDate(enrollment.enrolled_at)}
                            </span>
                          </div>
                        </div>
                        <p className="font-medium text-green-600">
                          {formatCurrency(enrollment.payment_amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No enrollments found</p>
                </div>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Education</h2>
              </div>
              {tutor.education && tutor.education.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {tutor.education.map((edu) => (
                    <div key={edu.id} className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <GraduationCap className="w-5 h-5 text-purple-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {edu.degree}
                          </p>
                          <p className="text-sm text-gray-600">
                            {edu.field_of_study}
                          </p>
                          <p className="text-sm text-gray-500">
                            {edu.institution}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {edu.start_date && formatDate(edu.start_date)} -{" "}
                            {edu.current
                              ? "Present"
                              : edu.end_date
                                ? formatDate(edu.end_date)
                                : "Completed"}
                          </p>
                          {edu.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No education records found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Hourly Rate Modal */}
      {showEditRateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Hourly Rate
            </h2>
            <p className="text-gray-600 mb-4">
              Current rate: {formatCurrency(tutor.hourly_rate)}/hour
            </p>
            <input
              type="number"
              step="100"
              min="0"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="Enter new hourly rate"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditRateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateHourlyRate}
                disabled={actionLoading || !newRate}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
