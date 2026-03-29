// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import tuitionApi from "@/lib/api/tuition";
import { TutorSession, Tutor, Community } from "@/types/tuition.types";
import {
  Search,
  Star,
  Users,
  Calendar,
  Clock,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Award,
  Video,
  User,
  Briefcase,
  School,
  Building2,
  ArrowRight,
  Loader2,
  MapPin,
  DollarSign,
  Timer,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [groupSessions, setGroupSessions] = useState<TutorSession[]>([]);
  const [oneOnOneSessions, setOneOnOneSessions] = useState<TutorSession[]>([]);
  const [featuredTutors, setFeaturedTutors] = useState<Tutor[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [groupPage, setGroupPage] = useState(1);
  const [oneOnOnePage, setOneOnOnePage] = useState(1);
  const [tutorsPage, setTutorsPage] = useState(1);
  const [communitiesPage, setCommunitiesPage] = useState(1);
  const [hasMoreGroup, setHasMoreGroup] = useState(true);
  const [hasMoreOneOnOne, setHasMoreOneOnOne] = useState(true);
  const [hasMoreTutors, setHasMoreTutors] = useState(true);
  const [hasMoreCommunities, setHasMoreCommunities] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [groupRes, oneOnOneRes, tutorsRes, communitiesRes] =
        await Promise.allSettled([
          tuitionApi.getGroupSessions({ limit: 10 }),
          tuitionApi.getOneOnOneSessions({ limit: 10 }),
          tuitionApi.getFeaturedTutors(10),
          tuitionApi.getCommunities({ limit: 10 }),
        ]);

      if (groupRes.status === "fulfilled" && groupRes.value.success) {
        console.log("group res", groupRes);
        setGroupSessions(groupRes.value.data?.sessions || []);
        setHasMoreGroup((groupRes.value.data?.sessions || []).length === 10);
      }

      if (oneOnOneRes.status === "fulfilled" && oneOnOneRes.value.success) {
        setOneOnOneSessions(oneOnOneRes.value.data?.sessions || []);
        setHasMoreOneOnOne(
          (oneOnOneRes.value.data?.sessions || []).length === 10,
        );
      }

      if (tutorsRes.status === "fulfilled" && tutorsRes.value.success) {
        setFeaturedTutors(tutorsRes.value.data?.tutors || []);
        setHasMoreTutors((tutorsRes.value.data?.tutors || []).length === 10);
      }

      if (
        communitiesRes.status === "fulfilled" &&
        communitiesRes.value.success
      ) {
        setCommunities(communitiesRes.value.data?.communities || []);
        setHasMoreCommunities(
          (communitiesRes.value.data?.communities || []).length === 8,
        );
      }
    } catch (error) {
      console.error("Error fetching landing page data:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreGroup = async () => {
    try {
      const nextPage = groupPage + 1;
      const response = await tuitionApi.getGroupSessions({
        page: nextPage,
        limit: 10,
      });

      if (response.success && response.data?.sessions) {
        const sessions = response.data.sessions;

        if (sessions.length > 0) {
          setGroupSessions((prev) => [...prev, ...sessions]);
          setGroupPage(nextPage);
          setHasMoreGroup(sessions.length === 10);
        } else {
          setHasMoreGroup(false);
        }
      }
    } catch (error) {
      toast.error("Failed to load more sessions");
    }
  };

  const loadMoreOneOnOne = async () => {
    try {
      const nextPage = oneOnOnePage + 1;
      const response = await tuitionApi.getOneOnOneSessions({
        page: nextPage,
        limit: 10,
      });

      if (response.success && response.data?.sessions) {
        const sessions = response.data.sessions;

        if (sessions.length > 0) {
          setOneOnOneSessions((prev) => [...prev, ...sessions]);
          setOneOnOnePage(nextPage);
          setHasMoreOneOnOne(sessions.length === 10);
        } else {
          setHasMoreOneOnOne(false);
        }
      }
    } catch (error) {
      toast.error("Failed to load more sessions");
    }
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

  // Compact Session Card with minimalistic design
  const SessionCard = ({ session }: { session: TutorSession }) => {
    const tutorRating = parseRating(session.tutor_rating);
    const feeAmount = parseNumber(session.fee_amount);
    const classesPerWeek = parseNumber(session.classes_per_week) || 1;
    const duration = parseNumber(session.class_duration_minutes) || 90;

    // Helper function to capitalize names properly
    const capitalizeName = (name: string): string => {
      if (!name) return "";
      return name
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    };

    // Capitalize tutor name and session name
    const capitalizedTutorName = capitalizeName(session.tutor_name || "Tutor");
    const capitalizedSessionName = capitalizeName(session.name);

    // Use session.uuid for navigation
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
        className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
      >
        {/* Compact Header with Tutor Avatar and Session Type */}
        <div className="p-3 flex items-center gap-2 border-b border-gray-50">
          {/* Tutor Avatar - Prominently displayed */}
          <div className="w-12 h-12 md:w-12 md:h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
            {session.tutor_avatar ? (
              <img
                src={session.tutor_avatar}
                alt={capitalizedTutorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>

          {/* Tutor Name and Session Type */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {capitalizedTutorName}
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  session.session_type === "one_on_one"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {session.session_type === "one_on_one" ? "1:1" : "Group"}
              </span>
              {tutorRating > 0 && (
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-gray-300 text-gray-300" />
                  <span className="text-xs text-gray-500">
                    {tutorRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Session Content */}
        <div className="p-3">
          <h3 className="font-medium text-gray-800 text-sm md:text-md line-clamp-1 mb-1">
            {capitalizedSessionName}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
            {session.subject}
          </p>

          {/* Minimalistic Curriculum Badge */}
          {session.curriculum_name && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                <Globe className="w-3 h-3 text-gray-400" />
                {session.curriculum_name}
                {session.curriculum_level_name && (
                  <span className="text-gray-400">
                    {" "}
                    · {session.curriculum_level_name}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Session Meta - Compact grid */}
          <div className="grid grid-cols-3 gap-1 text-xs text-gray-400 mb-2">
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

          {/* Price - Compact */}
          <div className="text-left">
            <p className="text-sm font-medium text-gray-700">
              {formatCurrency(feeAmount, session.fee_currency)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const TutorCard = ({ tutor }: { tutor: Tutor }) => {
    const tutorRating = parseRating(tutor.rating);
    const hourlyRate = parseNumber(tutor.hourly_rate);

    // Helper function to capitalize names properly
    const capitalizeName = (firstName: string, lastName: string): string => {
      const capitalize = (str: string) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

      return `${capitalize(firstName)} ${capitalize(lastName)}`.trim();
    };

    const fullName = capitalizeName(tutor.first_name, tutor.last_name);

    return (
      <div
        onClick={() => router.push(`/tutors/${tutor.id}`)}
        className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
      >
        <div className="p-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
              {tutor.avatar_url ? (
                <img
                  src={tutor.avatar_url}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 group-hover:text-gray-600 transition-colors truncate">
                {fullName}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {tutor.headline || "Tutor"}
              </p>

              {/* Rating and Rate */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-gray-300 text-gray-300" />
                  <span className="text-xs text-gray-500">
                    {tutorRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {formatCurrency(hourlyRate, tutor.currency)}
                  <span className="text-gray-400">/hr</span>
                </span>
              </div>
            </div>
          </div>

          {/* Subjects */}
          {tutor.subjects && tutor.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tutor.subjects.slice(0, 2).map((subject, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 bg-gray-50 text-gray-500 text-xs rounded"
                >
                  {subject.subject}
                </span>
              ))}
              {(tutor.subjects?.length || 0) > 2 && (
                <span className="px-1.5 py-0.5 bg-gray-50 text-gray-500 text-xs rounded">
                  +{tutor.subjects.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const CommunityCard = ({ community }: { community: Community }) => (
    <div
      onClick={() => router.push(`/communities/${community.slug}`)}
      className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
    >
      {/* Banner */}
      <div className="relative h-20 bg-gray-100">
        {community.banner_url ? (
          <img
            src={community.banner_url}
            alt={community.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <School className="w-8 h-8 text-gray-300" />
          </div>
        )}

        {/* Logo */}
        <div className="absolute -bottom-6 left-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 shadow-sm overflow-hidden">
            {community.logo_url ? (
              <img
                src={community.logo_url}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-8 p-3">
        <h3 className="font-medium text-gray-800 group-hover:text-gray-600 transition-colors text-sm">
          {community.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {community.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{community.member_count}</span>
          </div>
          {community.category && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              <span className="truncate">{community.category}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({
    title,
    subtitle,
    onViewAll,
  }: {
    title: string;
    subtitle: string;
    onViewAll?: () => void;
  }) => (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 group"
        >
          View all
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-gray-300 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-gray-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-4 sm:px-20 lg:px-20 py-8 space-y-8">
        {/* Group Sessions Section */}
        <section>
          <SectionHeader
            title="Group Sessions"
            subtitle="Learn together with peers"
            onViewAll={() => router.push("/sessions?type=group")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {groupSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>

          {hasMoreGroup && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreGroup}
                className="px-4 py-2 border border-gray-200 bg-white text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                Load More
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* One-on-One Sessions Section */}
        <section>
          <SectionHeader
            title="One-on-One Sessions"
            subtitle="Personalized attention"
            onViewAll={() => router.push("/sessions?type=one_on_one")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {oneOnOneSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>

          {hasMoreOneOnOne && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreOneOnOne}
                className="px-4 py-2 border border-gray-200 bg-white text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                Load More
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* Featured Tutors Section */}
        <section>
          <SectionHeader
            title="Featured Tutors"
            subtitle="Learn from the best"
            onViewAll={() => router.push("/tutors")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {featuredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>

          {hasMoreTutors && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setTutorsPage((p) => p + 1)}
                className="px-4 py-2 bg-white text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-1"
              >
                View All Tutors
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
