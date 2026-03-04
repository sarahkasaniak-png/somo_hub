// src/app/tutors/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tuitionApi from "@/lib/api/tuition";
import { Tutor, TutorSession } from "@/types/tuition.types";
import {
  Star,
  MapPin,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  User,
  Briefcase,
  School,
  Heart,
  Share2,
  Loader2,
  DollarSign,
  Languages,
  BadgeCheck,
  TrendingUp,
  Target,
  Zap,
  Crown,
  Medal,
  Trophy,
  Sparkles,
  Video,
  CalendarDays,
  Timer,
  Clock3,
  ExternalLink,
  Info,
} from "lucide-react";

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "sessions" | "reviews">(
    "about",
  );

  const tutorId = parseInt(params.id as string);

  useEffect(() => {
    if (tutorId) {
      fetchTutorData();
    }
  }, [tutorId]);

  const fetchTutorData = async () => {
    try {
      setLoading(true);
      const [tutorRes, sessionsRes] = await Promise.all([
        tuitionApi.getTutorById(tutorId),
        tuitionApi.getSessions({ tutor_id: tutorId, limit: 6 }),
      ]);

      if (tutorRes.success && tutorRes.data) {
        setTutor(tutorRes.data);
      }

      if (sessionsRes.success && sessionsRes.data) {
        setSessions(sessionsRes.data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching tutor:", error);
      toast.error("Failed to load tutor profile");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const SessionCard = ({ session }: { session: TutorSession }) => (
    <div
      onClick={() => router.push(`/tuitions/${session.id}`)}
      className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{session.name}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            session.session_type === "one_on_one"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {session.session_type === "one_on_one" ? "1-on-1" : "Group"}
        </span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {session.course_title}
      </p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date(session.start_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Users className="w-4 h-4" />
          <span>
            {session.current_enrollment}/{session.max_students}
          </span>
        </div>
        <span className="font-semibold text-gray-900">
          {formatCurrency(session.fee_amount, session.fee_currency)}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Tutor Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The tutor you're looking for doesn't exist.
          </p>
          <Link
            href="/tutors"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Browse Tutors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href="/tutors"
            className="hover:text-purple-600 transition-colors"
          >
            Tutors
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">
            {tutor.first_name} {tutor.last_name}
          </span>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-28 bg-gradient-to-r from-gray-100 to-gray-50"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-4">
              <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden">
                {tutor.avatar_url ? (
                  <img
                    src={tutor.avatar_url}
                    alt={`${tutor.first_name} ${tutor.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 mt-4 sm:mt-0 sm:ml-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {tutor.first_name} {tutor.last_name}
                    </h1>
                    <p className="text-gray-500 mt-1">{tutor.headline}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    {/* <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Contact
                    </button> */}
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-4 border-t border-gray-200">
              {/* <div>
                <p className="text-xs text-gray-500 mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {tutor.rating && parseInt(tutor.rating).toFixed(1)}
                  </span>
                </div>
              </div> */}
              {/* <div>
                <p className="text-xs text-gray-500 mb-1">Students</p>
                <p className="font-semibold text-gray-900">
                  {tutor.total_students}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Sessions</p>
                <p className="font-semibold text-gray-900">
                  {tutor.total_sessions}
                </p>
              </div> */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Response Rate</p>
                <p className="font-semibold text-gray-900">
                  {tutor.response_rate}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Hourly Rate</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(tutor.hourly_rate, tutor.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === "about"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab("sessions")}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === "sessions"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sessions ({sessions.length})
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === "reviews"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews
                </button>
              </div>

              <div className="p-6">
                {activeTab === "about" && (
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Bio</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {tutor.bio}
                      </p>
                    </div>

                    {/* Subjects */}
                    {tutor.subjects && tutor.subjects.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Subjects
                        </h3>
                        <div className="space-y-3">
                          {tutor.subjects.map((subject, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {subject.subject}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {subject.levels?.map((level, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full"
                                    >
                                      {level.replace("_", " ")}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(subject.hourly_rate)}
                                <span className="text-xs text-gray-500">
                                  /hr
                                </span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {tutor.languages && tutor.languages.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {tutor.languages.map((lang, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {lang.language} • {lang.proficiency}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "sessions" && (
                  <div>
                    <div className="grid grid-cols-1 gap-4">
                      {sessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                      ))}
                      {sessions.length === 0 && (
                        <p className="text-center text-gray-500 py-8">
                          No active sessions available
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Reviews coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Contact Info */}
            {/* <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a
                    href={`mailto:${tutor.email}`}
                    className="text-gray-600 hover:text-purple-600"
                  >
                    {tutor.email}
                  </a>
                </div>
                {tutor.response_time && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Response time: {tutor.response_time}
                    </span>
                  </div>
                )}
              </div>
            </div> */}

            {/* Expertise */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Expertise</h3>
              <div className="space-y-3">
                {tutor.subjects?.map((subject, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">
                      {subject.subject}
                    </span>
                    {subject.experience_years > 0 && (
                      <span className="text-xs text-gray-500 ml-auto">
                        {subject.experience_years} years
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
