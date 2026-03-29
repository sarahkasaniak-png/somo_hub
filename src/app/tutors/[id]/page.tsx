// src/app/tutors/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import tuitionApi from "@/lib/api/tuition";
import wishlistApi from "@/lib/api/wishlist";
import { Tutor, TutorSession } from "@/types/tuition.types";
import Login from "@/app/components/ui/Login";
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
  HeartOff,
  Check,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail as MailIcon,
  Link2,
  X,
} from "lucide-react";

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "sessions" | "reviews">(
    "about",
  );

  // Love/Share states
  const [isLoved, setIsLoved] = useState(false);
  const [loveLoading, setLoveLoading] = useState(false);
  const [loveCount, setLoveCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const tutorId = parseInt(params.id as string);

  // Single source of truth for loading all data
  const loadAllData = async () => {
    if (!tutorId) return;

    setLoading(true);
    try {
      // Load all data in parallel
      const [tutorRes, sessionsRes, loveStatusRes, loveCountRes] =
        await Promise.all([
          tuitionApi.getTutorById(tutorId),
          tuitionApi.getSessions({ tutor_id: tutorId, limit: 6 }),
          user
            ? wishlistApi.checkTutor(tutorId)
            : Promise.resolve({ data: { isLoved: false } }),
          wishlistApi.getTutorLoveCount(tutorId),
        ]);

      // Set tutor data
      if (tutorRes.success && tutorRes.data) {
        setTutor(tutorRes.data);
      }

      // Set sessions
      if (sessionsRes.success && sessionsRes.data) {
        setSessions(sessionsRes.data.sessions || []);
      }

      // Set love status
      if (user && loveStatusRes.data) {
        const isLovedValue = loveStatusRes.data.isLoved === true;
        console.log("Setting isLoved from direct check:", isLovedValue);
        setIsLoved(isLovedValue);
      }

      // Set love count
      if (loveCountRes.data && typeof loveCountRes.data.count === "number") {
        console.log("Setting love count to:", loveCountRes.data.count);
        setLoveCount(loveCountRes.data.count);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load tutor profile");
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or user changes
  useEffect(() => {
    loadAllData();
  }, [tutorId, user?.uuid]);

  // Toggle love/favorite
  const toggleLove = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!tutor) return;

    const wasLoved = isLoved;
    const previousCount = loveCount;

    setIsLoved(!wasLoved);
    setLoveCount(wasLoved ? previousCount - 1 : previousCount + 1);
    setLoveLoading(true);

    try {
      if (wasLoved) {
        await wishlistApi.removeTutor(tutorId);
        toast.success("Removed from favorites");
      } else {
        await wishlistApi.addTutor(tutorId);
        toast.success("Added to favorites");
      }
    } catch (error: any) {
      setIsLoved(wasLoved);
      setLoveCount(previousCount);
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setLoveLoading(false);
    }
  };

  // Share functionality
  const getShareUrl = () => {
    return `${window.location.origin}/tutors/${tutorId}`;
  };

  const getShareTitle = () => {
    return `${fullName} - Tutor on SomoHub`;
  };

  const getShareText = () => {
    return `Check out ${fullName} on SomoHub! ${tutor?.headline || "Experienced tutor"}`;
  };

  const shareOnSocial = (platform: string) => {
    const url = getShareUrl();
    const text = getShareText();
    const title = getShareTitle();

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + "\n\n" + url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const formatCurrency = (amount: number, currency: string = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to capitalize names properly
  const capitalizeName = (firstName: string, lastName: string): string => {
    const capitalize = (str: string) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

    return `${capitalize(firstName)} ${capitalize(lastName)}`.trim();
  };

  // Helper function to capitalize session names
  const capitalizeSessionName = (name: string): string => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const SessionCard = ({ session }: { session: TutorSession }) => {
    const capitalizedSessionName = capitalizeSessionName(session.name);
    const sessionStartDate = formatDate(session.start_date);

    return (
      <div
        onClick={() => router.push(`/tuitions/${session.uuid}`)}
        className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900">
            {capitalizedSessionName}
          </h3>
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
          {session.subject}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{sessionStartDate}</span>
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
  };

  // Share Modal Component
  const ShareModal = () => {
    if (!showShareModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fadeIn">
          <button
            onClick={() => setShowShareModal(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Share this tutor
          </h3>
          <p className="text-gray-500 mb-6">
            Share {fullName}&apos;s profile with friends and classmates
          </p>

          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 truncate">
                {getShareUrl()}
              </div>
              <button
                onClick={copyToClipboard}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Copy link"
              >
                {copySuccess ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => shareOnSocial("facebook")}
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Facebook className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-600">Facebook</span>
            </button>
            <button
              onClick={() => shareOnSocial("twitter")}
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                <Twitter className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-xs text-gray-600">X</span>
            </button>
            <button
              onClick={() => shareOnSocial("linkedin")}
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Linkedin className="w-5 h-5 text-blue-700" />
              </div>
              <span className="text-xs text-gray-600">LinkedIn</span>
            </button>
            <button
              onClick={() => shareOnSocial("whatsapp")}
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">WhatsApp</span>
            </button>
            <button
              onClick={() => shareOnSocial("email")}
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <MailIcon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-gray-600">Email</span>
            </button>
          </div>

          <button
            onClick={() => setShowShareModal(false)}
            className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (authLoading || loading) {
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

  const fullName = capitalizeName(tutor.first_name, tutor.last_name);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Modal */}
      <Login
        isLoginOpen={showLoginModal}
        setIsLoginOpen={setShowLoginModal}
        onSuccess={() => {
          setShowLoginModal(false);
          loadAllData();
        }}
      />

      {/* Share Modal */}
      <ShareModal />

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
          <span className="text-gray-900 font-medium truncate">{fullName}</span>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="h-28 bg-gradient-to-r from-gray-100 to-gray-50"></div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-4">
              <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden">
                {tutor.avatar_url ? (
                  <img
                    src={tutor.avatar_url}
                    alt={fullName}
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
                      {fullName}
                    </h1>
                    <p className="text-gray-500 mt-1">{tutor.headline}</p>
                    {tutor.tutor_level && (
                      <p className="text-sm text-purple-600 mt-1">
                        {tutor.tutor_level.level_name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <div className="flex items-center">
                      <button
                        onClick={toggleLove}
                        disabled={loveLoading}
                        className={`p-2 border border-gray-200 rounded-l-lg hover:bg-gray-50 transition-colors ${
                          isLoved ? "bg-red-50 border-red-200" : ""
                        }`}
                        title={
                          isLoved ? "Remove from favorites" : "Add to favorites"
                        }
                      >
                        {loveLoading ? (
                          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        ) : isLoved ? (
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        ) : (
                          <Heart className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <span className="px-3 py-2 border-t border-b border-r border-gray-200 rounded-r-lg bg-gray-50 text-sm font-medium text-gray-700">
                        {loveCount}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Share this profile"
                    >
                      <Share2 className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-4 border-t border-gray-200">
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
              <div>
                <p className="text-xs text-gray-500 mb-1">Favorites</p>
                <p className="font-semibold text-gray-900">{loveCount}</p>
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

                    {/* Curriculum Expertise - NEW SECTION */}
                    {tutor.curriculums && tutor.curriculums.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-green-600" />
                          Curriculum Expertise
                        </h3>
                        <div className="space-y-2">
                          {tutor.curriculums.map((curriculum, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <BadgeCheck className="w-4 h-4 text-green-600" />
                                  <p className="font-medium text-gray-900">
                                    {curriculum.curriculum_name}
                                  </p>
                                </div>
                                {curriculum.curriculum_level_name && (
                                  <p className="text-sm text-gray-600 mt-1 ml-6">
                                    Level: {curriculum.curriculum_level_name}
                                  </p>
                                )}
                                {curriculum.curriculum_code && (
                                  <p className="text-xs text-gray-500 mt-0.5 ml-6">
                                    Code: {curriculum.curriculum_code}
                                  </p>
                                )}
                              </div>
                              <Award className="w-5 h-5 text-green-500" />
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

                    {/* Tutor Level */}
                    {tutor.tutor_level && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Tutor Level
                        </h3>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">
                            {tutor.tutor_level.level_name}
                          </p>
                          {tutor.tutor_level.level_description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {tutor.tutor_level.level_description}
                            </p>
                          )}
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

            {/* Curriculum Expertise Card - NEW */}
            {tutor.curriculums && tutor.curriculums.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-600" />
                  Curriculum Expertise
                </h3>
                <div className="space-y-2">
                  {tutor.curriculums.map((curriculum, index) => (
                    <div
                      key={index}
                      className="p-2 bg-green-50 rounded-lg border border-green-100"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {curriculum.curriculum_name}
                      </p>
                      {curriculum.curriculum_level_name && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          {curriculum.curriculum_level_name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share this profile card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Share this profile
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => shareOnSocial("facebook")}
                  className="flex-1 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
                <button
                  onClick={() => shareOnSocial("twitter")}
                  className="flex-1 p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="text-sm">Tweet</span>
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Copy link"
                >
                  {copySuccess ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Link2 className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
