// src/app/student/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import studentApi, { StudentProfileData, Education } from "@/lib/api/student";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  GraduationCap,
  DollarSign,
  Star,
  Users,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  Edit,
  Save,
  X,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
  FileText,
  Image as ImageIcon,
  Shield,
  Lock,
  Bell,
  Settings,
  LogOut,
  HelpCircle,
  Info,
  BadgeCheck,
  Building,
  School,
  University,
  Heart,
  Share2,
  MoreHorizontal,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Crown,
  Medal,
  Trophy,
  Video,
  Globe,
  BookMarked,
  CalendarClock,
  ChevronDown,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ProfileData {
  // Basic Info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  avatar_url: string | null;

  // Location
  country: string;
  city: string;

  // Education
  education: Education[];

  // Interests
  interests: string[];

  // Learning Goals
  learning_goals: string[];

  // Stats
  stats: {
    courses_completed: number;
    sessions_attended: number;
    learning_hours: number;
    certificates_earned: number;
    average_rating: number;
    reviews_left: number;
  };

  // Verification
  verification: {
    email_verified: boolean;
    phone_verified: boolean;
  };
}

interface AvatarUploadResponse {
  success: boolean;
  data?: {
    url: string;
    // Add any other fields your API returns
  };
  message?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  data?: ProfileData; // The API returns the updated profile data
  message?: string;
}

export default function StudentProfile() {
  const {
    user,
    userStatus,
    profileData: authProfileData,
    refreshUserData,
    refreshProfileData,
  } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState<ProfileData | null>(null);

  // State for tag inputs
  const [newInterest, setNewInterest] = useState("");
  const [newGoal, setNewGoal] = useState("");

  // Education level options
  const educationLevels = [
    { value: "high_school", label: "High School" },
    { value: "certificate", label: "Certificate" },
    { value: "diploma", label: "Diploma" },
    { value: "bachelors", label: "Bachelor's Degree" },
    { value: "masters", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
    { value: "other", label: "Other" },
  ];

  // Main data loading effect - depends only on AuthContext data
  useEffect(() => {
    // Use profileData from AuthContext as the single source of truth
    if (authProfileData) {
      console.log(
        "📊 Student Profile - Using authProfileData:",
        authProfileData,
      );

      const profileData: ProfileData = {
        first_name: authProfileData.first_name || "",
        last_name: authProfileData.last_name || "",
        email: authProfileData.email || "",
        phone: authProfileData.phone || "",
        date_of_birth: authProfileData.date_of_birth || "",
        avatar_url: authProfileData.avatar_url || null,
        country: authProfileData.country || "",
        city: authProfileData.city || "",
        education: (authProfileData.education || []).map((edu) => ({
          id: edu.id || 0,
          institution: edu.institution || "",
          degree: edu.degree || "",
          field_of_study: edu.field_of_study || "",
          level: edu.level || "other",
          grade: edu.grade || "",
          score: edu.score || "",
          start_date: edu.start_date || "", // Ensure string, not undefined
          end_date: edu.end_date || "",
          current: edu.current || false,
          description: edu.description || "",
          achievements: edu.achievements || "",
        })),
        interests: authProfileData.interests || [],
        learning_goals: authProfileData.learning_goals || [],
        stats: authProfileData.stats || {
          courses_completed: 0,
          sessions_attended: 0,
          learning_hours: 0,
          certificates_earned: 0,
          average_rating: 0,
          reviews_left: 0,
        },
        verification: authProfileData.verification || {
          email_verified: user?.is_verified || false,
          phone_verified: user?.phone_verified || false,
        },
      };

      setProfile(profileData);
      setFormData(profileData);
      setLoading(false);
    } else {
      // Fallback to building from user and userStatus if authProfileData not available
      console.log("📊 Student Profile - Building from user and userStatus");

      if (user) {
        const profileData: ProfileData = {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          date_of_birth: user.date_of_birth || "",
          avatar_url: user.avatar_url || null,
          country: user.country || "",
          city: user.city || "",
          education:
            userStatus?.education?.map((edu: any) => ({
              id: edu.id,
              institution: edu.institution || "",
              degree: edu.degree || "",
              field_of_study: edu.field_of_study || "",
              level: edu.level || "other",
              grade: edu.grade || "",
              score: edu.score || "",
              start_date: edu.start_date || "",
              end_date: edu.end_date || "",
              current: edu.current || false,
              description: edu.description || "",
              achievements: edu.achievements || "",
            })) || [],
          interests: userStatus?.interests || [],
          learning_goals: userStatus?.learning_goals || [],
          stats: {
            courses_completed: 0,
            sessions_attended: 0,
            learning_hours: 0,
            certificates_earned: 0,
            average_rating: 0,
            reviews_left: 0,
          },
          verification: {
            email_verified: user.is_verified || false,
            phone_verified: user.phone_verified || false,
          },
        };

        setProfile(profileData);
        setFormData(profileData);
        setLoading(false);
      }
    }
  }, [authProfileData, user, userStatus]); // Removed refreshProfileData from dependencies

  // Separate effect for background refresh - runs once after mount
  // useEffect(() => {
  //   let isMounted = true;

  //   const refreshData = async () => {
  //     try {
  //       await refreshProfileData();
  //     } catch (error) {
  //       console.error("Failed to refresh profile data:", error);
  //     }
  //   };

  //   // Only refresh if we have user data and it's been mounted for a while
  //   if (user && isMounted) {
  //     const timer = setTimeout(() => {
  //       refreshData();
  //     }, 2000); // Delay refresh to avoid race conditions

  //     return () => {
  //       isMounted = false;
  //       clearTimeout(timer);
  //     };
  //   }
  // }, [user]); // Only depend on user, not refreshProfileData

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Interest handlers
  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setFormData((prev) => {
        if (!prev) return null;
        const currentInterests = prev.interests || [];
        if (!currentInterests.includes(newInterest.trim())) {
          return {
            ...prev,
            interests: [...currentInterests, newInterest.trim()],
          };
        }
        return prev;
      });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = prev.interests.filter((_, i) => i !== index);
      return { ...prev, interests: updated };
    });
  };

  // Goal handlers
  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFormData((prev) => {
        if (!prev) return null;
        const currentGoals = prev.learning_goals || [];
        if (!currentGoals.includes(newGoal.trim())) {
          return {
            ...prev,
            learning_goals: [...currentGoals, newGoal.trim()],
          };
        }
        return prev;
      });
      setNewGoal("");
    }
  };

  const handleRemoveGoal = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = prev.learning_goals.filter((_, i) => i !== index);
      return { ...prev, learning_goals: updated };
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "interest" | "goal",
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (type === "interest") {
        handleAddInterest();
      } else {
        handleAddGoal();
      }
    }
  };

  // Education handlers
  const handleAddEducation = () => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            education: [
              ...prev.education,
              {
                institution: "",
                degree: "",
                field_of_study: "",
                level: "other",
                grade: "",
                score: "",
                start_date: "",
                end_date: "",
                current: false,
                description: "",
                achievements: "",
              },
            ],
          }
        : null,
    );
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof Education,
    value: any,
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };

      // If current is true, clear end_date
      if (field === "current" && value === true) {
        updated[index].end_date = "";
      }

      return { ...prev, education: updated };
    });
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = prev.education.filter((_, i) => i !== index);
      return { ...prev, education: updated };
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select an image file (JPEG, PNG, GIF, or WEBP)");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("fileType", "avatar");

    try {
      setUploadingAvatar(true);
      toast.loading("Uploading...", { id: "avatar-upload" });

      const response = (await studentApi.uploadAvatar(
        formData,
      )) as AvatarUploadResponse;

      // Check both success and data existence
      if (response.success && response.data) {
        const newAvatarUrl = response.data.url;

        setFormData((prev) =>
          prev ? { ...prev, avatar_url: newAvatarUrl } : null,
        );
        setProfile((prev) =>
          prev ? { ...prev, avatar_url: newAvatarUrl } : null,
        );

        await refreshUserData();
        await refreshProfileData();
        toast.success("Avatar uploaded successfully", { id: "avatar-upload" });
      } else {
        // Handle case where success is true but data is missing
        toast.error(response.message || "Failed to upload avatar", {
          id: "avatar-upload",
        });
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar", { id: "avatar-upload" });
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);

    try {
      // Only send the fields that have been edited
      const changedFields: Partial<StudentProfileData> = {};

      // Define updatable fields
      const updatableFields = [
        "first_name",
        "last_name",
        "phone",
        "date_of_birth",
        "country",
        "city",
        "interests",
        "learning_goals",
        "education",
      ];

      updatableFields.forEach((field) => {
        const formValue = formData[field as keyof typeof formData];
        const originalValue = profile?.[field as keyof typeof profile];

        // Only include if changed
        if (JSON.stringify(formValue) !== JSON.stringify(originalValue)) {
          (changedFields as any)[field] = formValue;
        }
      });

      // If no changes, show message and exit
      if (Object.keys(changedFields).length === 0) {
        toast.success("No changes to save");
        setIsEditing(false);
        return;
      }

      console.log("Saving changed fields:", changedFields);

      const response = (await studentApi.updateProfile(
        changedFields,
      )) as UpdateProfileResponse;

      // Check if response is successful and data exists
      if (response.success && response.data) {
        setProfile(response.data);
        setIsEditing(false);
        toast.success("Profile updated successfully");
        await refreshUserData();
        await refreshProfileData();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getLevelLabel = (level: string) => {
    const levelMap: Record<string, string> = {
      high_school: "High School",
      certificate: "Certificate",
      diploma: "Diploma",
      bachelors: "Bachelor's Degree",
      masters: "Master's Degree",
      phd: "PhD",
      other: "Other",
    };
    return levelMap[level] || level;
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    // { id: "education", label: "Education", icon: GraduationCap },
    // { id: "interests", label: "Interests & Goals", icon: Target },
    // { id: "stats", label: "Learning Stats", icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link
                href="/student/dashboard"
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Profile</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your personal information and learning preferences
            </p>
          </div>
          <div className="flex gap-3">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
              {/* Profile Summary */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="relative group mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={`${profile.first_name} ${profile.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {getInitials(
                            profile?.first_name || "",
                            profile?.last_name || "",
                          ) || "S"}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                        {uploadingAvatar ? (
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4 text-white" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                          disabled={uploadingAvatar}
                        />
                      </label>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Student</p>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    {profile?.verification?.email_verified && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <BadgeCheck className="w-3 h-3" />
                        Email Verified
                      </span>
                    )}
                    {profile?.verification?.phone_verified && (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        <BadgeCheck className="w-3 h-3" />
                        Phone Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{profile?.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.country && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        {profile.city ? `${profile.city}, ` : ""}
                        {profile.country}
                      </span>
                    </div>
                  )}
                  {profile?.date_of_birth && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(profile.date_of_birth)}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Quick Stats */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Learning Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Courses Completed
                    </span>
                    <span className="font-semibold text-gray-900">
                      {profile?.stats?.courses_completed || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Sessions Attended
                    </span>
                    <span className="font-semibold text-gray-900">
                      {profile?.stats?.sessions_attended || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Learning Hours
                    </span>
                    <span className="font-semibold text-gray-900">
                      {profile?.stats?.learning_hours || 0}
                    </span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Certificates</span>
                  <span className="font-semibold text-gray-900">
                    {profile?.stats?.certificates_earned || 0}
                  </span>
                </div> */}
                  {/* <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    {profile?.stats?.average_rating || 0}
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </span>
                </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 overflow-x-auto">
                <div className="flex">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    {/* Profile Tab - Edit Mode */}
                    {activeTab === "profile" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              value={formData?.first_name || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="last_name"
                              value={formData?.last_name || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData?.phone || ""}
                              onChange={handleInputChange}
                              placeholder="+254 700 000 000"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              name="date_of_birth"
                              value={formData?.date_of_birth || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <select
                              name="country"
                              value={formData?.country || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            >
                              <option value="">Select country</option>
                              <option value="Kenya">Kenya</option>
                              <option value="Uganda">Uganda</option>
                              <option value="Tanzania">Tanzania</option>
                              <option value="Rwanda">Rwanda</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData?.city || ""}
                              onChange={handleInputChange}
                              placeholder="e.g., Nairobi"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Education Tab - Edit Mode */}
                    {activeTab === "education" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Education History
                          </h3>
                          <button
                            type="button"
                            onClick={handleAddEducation}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Education
                          </button>
                        </div>

                        <div className="space-y-6">
                          {formData?.education?.map((edu, index) => (
                            <div
                              key={index}
                              className="p-6 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="font-medium text-gray-900">
                                  Education #{index + 1}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEducation(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Institution
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "institution",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="University of Nairobi"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Degree
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "degree",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Bachelor of Science"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Field of Study
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.field_of_study}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "field_of_study",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Computer Science"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Education Level
                                  </label>
                                  <select
                                    value={edu.level || "other"}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "level",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                  >
                                    {educationLevels.map((level) => (
                                      <option
                                        key={level.value}
                                        value={level.value}
                                      >
                                        {level.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Grade/Score (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.grade || ""}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "grade",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="e.g., First Class, A, 85%"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Score (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.score || ""}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "score",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="e.g., 3.8 GPA, 320/500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                  </label>
                                  <input
                                    type="date"
                                    value={edu.start_date || ""}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "start_date",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                  </label>
                                  <input
                                    type="date"
                                    value={edu.end_date || ""}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "end_date",
                                        e.target.value,
                                      )
                                    }
                                    disabled={edu.current}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={edu.current}
                                      onChange={(e) =>
                                        handleUpdateEducation(
                                          index,
                                          "current",
                                          e.target.checked,
                                        )
                                      }
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                      I am currently studying here
                                    </span>
                                  </label>
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                  </label>
                                  <textarea
                                    value={edu.description || ""}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Additional details about your studies..."
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Achievements (Optional)
                                  </label>
                                  <textarea
                                    value={edu.achievements || ""}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "achievements",
                                        e.target.value,
                                      )
                                    }
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Awards, honors, publications, etc."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          {formData?.education?.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                              <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                              <h4 className="text-lg font-medium text-gray-900 mb-2">
                                No education history yet
                              </h4>
                              <p className="text-gray-600 mb-6">
                                Add your educational background to help tutors
                                understand your learning journey
                              </p>
                              <button
                                type="button"
                                onClick={handleAddEducation}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Education
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Interests & Goals Tab - Edit Mode */}
                    {activeTab === "interests" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Interests
                          </h3>

                          {/* Interest Tags */}
                          {formData?.interests &&
                            formData.interests.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {formData.interests.map((interest, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full"
                                  >
                                    {interest}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveInterest(index)
                                      }
                                      className="ml-1.5 hover:text-blue-900 focus:outline-none"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}

                          {/* Add Interest Input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newInterest}
                              onChange={(e) => setNewInterest(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, "interest")}
                              placeholder="Type an interest and press Enter or comma"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={handleAddInterest}
                              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Type an interest and press Enter or comma to add it.
                            Click the × to remove.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Learning Goals
                          </h3>

                          {/* Goal Tags */}
                          {formData?.learning_goals &&
                            formData.learning_goals.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {formData.learning_goals.map((goal, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-full"
                                  >
                                    {goal}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveGoal(index)}
                                      className="ml-1.5 hover:text-green-900 focus:outline-none"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}

                          {/* Add Goal Input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newGoal}
                              onChange={(e) => setNewGoal(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, "goal")}
                              placeholder="Type a goal and press Enter or comma"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={handleAddGoal}
                              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Type a goal and press Enter or comma to add it.
                            Click the × to remove.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Stats Tab - Edit Mode (Read-only) */}
                    {activeTab === "stats" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Learning Statistics
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Your learning progress and achievements. Stats are
                          automatically updated.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">
                              Courses Completed
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                              {profile?.stats?.courses_completed}
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">
                              Sessions Attended
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                              {profile?.stats?.sessions_attended}
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">
                              Learning Hours
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                              {profile?.stats?.learning_hours}
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">
                              Certificates Earned
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                              {profile?.stats?.certificates_earned}
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">
                              Average Rating Given
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1 flex items-center gap-1">
                              {profile?.stats?.average_rating}
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">
                              Reviews Left
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                              {profile?.stats?.reviews_left}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Save/Cancel Buttons */}
                    <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(profile);
                        }}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* View Mode */
                  <>
                    {/* Profile Tab - View Mode */}
                    {activeTab === "profile" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Personal Information
                        </h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <dt className="text-sm text-gray-500">Full Name</dt>
                            <dd className="mt-1 font-medium text-gray-900">
                              {profile?.first_name} {profile?.last_name}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Email</dt>
                            <dd className="mt-1 font-medium text-gray-900">
                              {profile?.email}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Phone</dt>
                            <dd className="mt-1 font-medium text-gray-900">
                              {profile?.phone || "Not provided"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">
                              Date of Birth
                            </dt>
                            <dd className="mt-1 font-medium text-gray-900">
                              {profile?.date_of_birth
                                ? formatDate(profile.date_of_birth)
                                : "Not provided"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Country</dt>
                            <dd className="mt-1 font-medium text-gray-900">
                              {profile?.country || "Not provided"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">City</dt>
                            <dd className="mt-1 font-medium text-gray-900">
                              {profile?.city || "Not provided"}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {/* Education Tab - View Mode */}
                    {activeTab === "education" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Education History
                        </h3>
                        {profile?.education && profile.education.length > 0 ? (
                          <div className="space-y-4">
                            {profile.education.map((edu, index) => (
                              <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {edu.institution}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {edu.degree} in {edu.field_of_study}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Level: {getLevelLabel(edu.level || "other")}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(edu.start_date || "")} -{" "}
                                    {edu.current
                                      ? "Present"
                                      : formatDate(edu.end_date || "")}
                                  </p>
                                  {edu.grade && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Grade: {edu.grade}
                                    </p>
                                  )}
                                  {edu.score && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Score: {edu.score}
                                    </p>
                                  )}
                                  {edu.description && (
                                    <p className="text-sm text-gray-700 mt-2">
                                      {edu.description}
                                    </p>
                                  )}
                                  {edu.achievements && (
                                    <p className="text-sm text-gray-700 mt-2">
                                      <span className="font-medium">
                                        Achievements:
                                      </span>{" "}
                                      {edu.achievements}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                            <GraduationCap className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600">
                              No education history added yet
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interests & Goals Tab - View Mode */}
                    {activeTab === "interests" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Interests
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {profile?.interests?.map((interest, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                            {(!profile?.interests ||
                              profile.interests.length === 0) && (
                              <p className="text-sm text-gray-500">
                                No interests added yet
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Learning Goals
                          </h3>
                          <div className="space-y-3">
                            {profile?.learning_goals?.map((goal, index) => (
                              <div
                                key={index}
                                className="p-3 bg-green-50 rounded-lg border border-green-100 flex items-start gap-2"
                              >
                                <Target className="w-4 h-4 text-green-600 mt-0.5" />
                                <span className="text-gray-700">{goal}</span>
                              </div>
                            ))}
                            {(!profile?.learning_goals ||
                              profile.learning_goals.length === 0) && (
                              <p className="text-sm text-gray-500">
                                No learning goals added yet
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stats Tab - View Mode */}
                    {activeTab === "stats" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Learning Statistics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Courses Completed
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                  {profile?.stats?.courses_completed}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Video className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Sessions Attended
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                  {profile?.stats?.sessions_attended}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Learning Hours
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                  {profile?.stats?.learning_hours}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Award className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Certificates Earned
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                  {profile?.stats?.certificates_earned}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
