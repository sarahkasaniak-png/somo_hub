// src/app/tutor/sessions/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi, { Curriculum, TutorLevelInfo } from "@/lib/api/tutor";
import ScheduleConfig from "../../create/components/ScheduleConfig";
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  Tag,
  Info,
  CalendarRange,
  Loader2,
  AlertCircle,
  Save,
  X,
  Video,
  MapPinned,
  Wifi,
  Globe,
  EyeOff,
  PlayCircle,
  CheckCircle,
  XCircle,
  Pencil,
  Trash,
  MoreHorizontal,
  ChevronDown,
  AlertTriangle,
  FileText,
  Timer,
  Hourglass,
  GraduationCap,
} from "lucide-react";

interface ScheduleConfigType {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface CurriculumWeek {
  week: number;
  topic: string;
  objectives?: string[];
  materials?: string[];
}

// Updated SessionData to match TutorSession from API
interface SessionData {
  id: number;
  uuid: string;
  tutor_id: number;
  name: string;
  description: string | null;
  subject: string;
  curriculum_id?: number;
  curriculum_level_id?: number;
  prerequisites?: string[] | string;
  learning_outcomes?: string[] | string;
  curriculum?: CurriculumWeek[] | string;
  batch_name: string | null;
  session_type: "one_on_one" | "group";
  max_students: number;
  start_date: string;
  end_date: string;
  session_code: string;
  enrollment_status: string;
  session_status: string;
  fee_amount: number;
  fee_currency: string;
  current_enrollment: number;
  schedule_configs?: ScheduleConfigType[];
}

export default function EditSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [session, setSession] = useState<SessionData | null>(null);
  const [scheduleConfigs, setScheduleConfigs] = useState<ScheduleConfigType[]>(
    [],
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "schedule">("basic");
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);

  // Curriculum state
  const [allCurriculums, setAllCurriculums] = useState<Curriculum[]>([]);
  const [tutorCurriculums, setTutorCurriculums] = useState<Curriculum[]>([]);
  const [tutorLevel, setTutorLevel] = useState<TutorLevelInfo | null>(null);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<
    number | null
  >(null);
  const [selectedCurriculumLevelId, setSelectedCurriculumLevelId] = useState<
    number | null
  >(null);
  const [loadingCurriculums, setLoadingCurriculums] = useState(true);

  // Form data - includes all fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject: "",
    batch_name: "",
    session_type: "group" as "one_on_one" | "group",
    max_students: 10,
    start_date: "",
    end_date: "",
    fee_amount: 0,
    fee_currency: "KES",
    curriculum_id: undefined as number | undefined,
    curriculum_level_id: undefined as number | undefined,
    prerequisites: [] as string[],
    learning_outcomes: [] as string[],
    curriculum: [] as CurriculumWeek[],
  });

  // Separate state for new prerequisite/outcome inputs
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newOutcome, setNewOutcome] = useState("");

  useEffect(() => {
    fetchData();
  }, [sessionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setLoadingCurriculums(true);

      const sessionResponse = await tutorApi.getSession(sessionId);
      if (sessionResponse.success) {
        const sessionData = sessionResponse.data;

        // Parse JSON fields if they're strings, ensure they're always arrays
        let prerequisites: string[] = [];
        let learningOutcomes: string[] = [];
        let curriculumData: CurriculumWeek[] = [];

        // Handle prerequisites
        if (sessionData.prerequisites) {
          if (typeof sessionData.prerequisites === "string") {
            try {
              prerequisites = JSON.parse(sessionData.prerequisites);
            } catch (e) {
              prerequisites = [];
            }
          } else if (Array.isArray(sessionData.prerequisites)) {
            prerequisites = sessionData.prerequisites;
          }
        }

        // Handle learning outcomes
        if (sessionData.learning_outcomes) {
          if (typeof sessionData.learning_outcomes === "string") {
            try {
              learningOutcomes = JSON.parse(sessionData.learning_outcomes);
            } catch (e) {
              learningOutcomes = [];
            }
          } else if (Array.isArray(sessionData.learning_outcomes)) {
            learningOutcomes = sessionData.learning_outcomes;
          }
        }

        // Handle curriculum
        if (sessionData.curriculum) {
          if (typeof sessionData.curriculum === "string") {
            try {
              const parsed = JSON.parse(sessionData.curriculum);
              curriculumData = Array.isArray(parsed)
                ? parsed.map((week: any) => ({
                    week: week.week,
                    topic: week.topic || "",
                    objectives: week.objectives || [],
                    materials: week.materials || [],
                  }))
                : [];
            } catch (e) {
              curriculumData = [];
            }
          } else if (Array.isArray(sessionData.curriculum)) {
            curriculumData = sessionData.curriculum;
          }
        }

        // Ensure all fields have proper default values
        setSession({
          ...sessionData,
          prerequisites: prerequisites,
          learning_outcomes: learningOutcomes,
          curriculum: curriculumData,
        });

        setSelectedCurriculumId(sessionData.curriculum_id || null);
        setSelectedCurriculumLevelId(sessionData.curriculum_level_id || null);

        // Populate form data with proper arrays
        setFormData({
          name: sessionData.name,
          description: sessionData.description || "",
          subject: sessionData.subject,
          batch_name: sessionData.batch_name || "",
          session_type: sessionData.session_type,
          max_students: sessionData.max_students,
          start_date: sessionData.start_date.split("T")[0],
          end_date: sessionData.end_date.split("T")[0],
          fee_amount: sessionData.fee_amount,
          fee_currency: sessionData.fee_currency,
          curriculum_id: sessionData.curriculum_id,
          curriculum_level_id: sessionData.curriculum_level_id,
          prerequisites: prerequisites,
          learning_outcomes: learningOutcomes,
          curriculum: curriculumData,
        });

        // Populate schedule configs
        if (sessionData.schedule_configs) {
          setScheduleConfigs(sessionData.schedule_configs);
        }
      }

      await fetchTutorCurriculums();
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load session details");
    } finally {
      setLoading(false);
      setLoadingCurriculums(false);
    }
  };

  const fetchTutorCurriculums = async () => {
    try {
      // Fetch all curriculums
      const curriculumsResponse = await tutorApi.getCurriculums();

      if (curriculumsResponse.success && curriculumsResponse.data) {
        setAllCurriculums(curriculumsResponse.data);

        // Fetch tutor's curriculums from the tutor_curriculums table
        const tutorCurriculumsResponse = await tutorApi.getTutorCurriculums();

        if (tutorCurriculumsResponse.success && tutorCurriculumsResponse.data) {
          // Filter curriculums that the tutor is qualified to teach
          const qualifiedCurriculums = curriculumsResponse.data.filter(
            (curriculum) =>
              tutorCurriculumsResponse.data.some(
                (tc) => tc.curriculum_id === curriculum.id,
              ),
          );
          setTutorCurriculums(qualifiedCurriculums);
        } else {
          // If no tutor curriculums found, show all curriculums (fallback)
          console.log("No tutor curriculums found, showing all curriculums");
          setTutorCurriculums(curriculumsResponse.data);
        }
      }

      // Fetch tutor level
      const profileResponse = await tutorApi.getTutorProfile();
      if (profileResponse.success && profileResponse.data.tutor_level_id) {
        const levelsResponse = await tutorApi.getTutorLevels();
        if (levelsResponse.success && levelsResponse.data) {
          const level = levelsResponse.data.find(
            (l) => l.id === profileResponse.data.tutor_level_id,
          );
          setTutorLevel(level || null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch tutor curriculums:", error);
    }
  };

  const getAvailableLevels = () => {
    const curriculum = allCurriculums.find(
      (c) => c.id === selectedCurriculumId,
    );
    return curriculum?.levels || [];
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "max_students" || name === "fee_amount"
          ? Number(value)
          : value,
    }));
  };

  const handleCurriculumChange = (value: number | null) => {
    setSelectedCurriculumId(value);
    setFormData((prev) => ({
      ...prev,
      curriculum_id: value || undefined,
      curriculum_level_id: undefined,
    }));
    setSelectedCurriculumLevelId(null);
  };

  const handleCurriculumLevelChange = (value: number | null) => {
    setSelectedCurriculumLevelId(value);
    setFormData((prev) => ({
      ...prev,
      curriculum_level_id: value || undefined,
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()],
      }));
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }));
  };

  const addLearningOutcome = () => {
    if (newOutcome.trim()) {
      setFormData((prev) => ({
        ...prev,
        learning_outcomes: [...prev.learning_outcomes, newOutcome.trim()],
      }));
      setNewOutcome("");
    }
  };

  const removeLearningOutcome = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      learning_outcomes: prev.learning_outcomes.filter((_, i) => i !== index),
    }));
  };

  const addCurriculumWeek = () => {
    const weekNumber = formData.curriculum.length + 1;
    setFormData((prev) => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        {
          week: weekNumber,
          topic: "",
          objectives: [],
          materials: [],
        },
      ],
    }));
  };

  const updateCurriculum = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newCurriculum = [...prev.curriculum];
      newCurriculum[index] = { ...newCurriculum[index], [field]: value };
      return { ...prev, curriculum: newCurriculum };
    });
  };

  const removeCurriculumWeek = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum
        .filter((_, i) => i !== index)
        .map((week, idx) => ({ ...week, week: idx + 1 })),
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.name.trim()) {
      toast.error("Please enter a session name");
      return false;
    }

    if (!formData.start_date) {
      toast.error("Please select a start date");
      return false;
    }

    if (!formData.end_date) {
      toast.error("Please select an end date");
      return false;
    }

    if (scheduleConfigs.length === 0) {
      toast.error("Please add at least one class schedule");
      return false;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return false;
    }

    // Check if any schedule configs would actually generate classes
    let hasValidClasses = false;
    scheduleConfigs.forEach((config) => {
      const current = new Date(startDate);
      while (current <= endDate) {
        if (current.getDay() === config.day_of_week) {
          hasValidClasses = true;
          break;
        }
        current.setDate(current.getDate() + 1);
      }
    });

    if (!hasValidClasses) {
      toast.error(
        "No classes will be generated with the current schedule and date range.",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Build update data - send as arrays to pass validation
      const updateData: any = {
        name: formData.name,
        description: formData.description || null,
        batch_name: formData.batch_name || null,
        session_type: formData.session_type,
        max_students: formData.max_students,
        start_date: formData.start_date,
        end_date: formData.end_date,
        fee_amount: formData.fee_amount,
        fee_currency: formData.fee_currency,
        curriculum_id: formData.curriculum_id || null,
        curriculum_level_id: formData.curriculum_level_id || null,
        prerequisites: formData.prerequisites || [], // Send as array
        learning_outcomes: formData.learning_outcomes || [], // Send as array
      };

      // Handle curriculum - send as array of objects
      if (formData.curriculum && formData.curriculum.length > 0) {
        updateData.curriculum = formData.curriculum.map((week) => ({
          week: week.week,
          topic: week.topic,
          objectives: week.objectives || [],
          materials: week.materials || [],
        }));
      } else {
        updateData.curriculum = []; // Send as empty array
      }

      console.log("=== UPDATE DATA (as arrays) ===");
      console.log(JSON.stringify(updateData, null, 2));

      const response = await tutorApi.updateSession(sessionId, updateData);

      if (response && response.success) {
        toast.success("Session updated successfully!");
        router.push(`/tutor/sessions/${sessionId}`);
      } else {
        // Fix: response doesn't have message property, use a default error message
        toast.error("Failed to update session. Please try again.");
      }
    } catch (error: any) {
      console.error("Update session error:", error);
      toast.error(
        error.message || "Failed to update session. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!session) return;

    try {
      const response = await tutorApi.deleteSession(sessionId);
      if (response.success) {
        toast.success("Session deleted successfully");
        router.push("/tutor/sessions");
      } else {
        toast.error("Failed to delete session");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete session");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ongoing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "waiting_list":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "closed":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "completed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-main/20 border-t-main rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-main animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Session Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The session you're trying to edit doesn't exist or has been deleted.
          </p>
          <Link
            href="/tutor/sessions"
            className="inline-flex items-center px-6 py-3 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Sessions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header with Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link
              href="/tutor/dashboard"
              className="hover:text-main transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/tutor/sessions"
              className="hover:text-main transition-colors"
            >
              Sessions
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/tutor/sessions/${sessionId}`}
              className="hover:text-main transition-colors"
            >
              {session.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Edit</span>
          </div>

          {/* Title and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <Link
                href={`/tutor/sessions/${sessionId}`}
                className="p-2 hover:bg-white rounded-xl transition-colors group"
                title="Back to Session"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-main transition-colors" />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-2xl font-semibold text-gray-900">
                    Edit Session
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.session_status)}`}
                    >
                      {session.session_status.charAt(0).toUpperCase() +
                        session.session_status.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getEnrollmentStatusColor(session.enrollment_status)}`}
                    >
                      {session.enrollment_status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(session.start_date)} -{" "}
                    {formatDate(session.end_date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    {session.session_code}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href={`/tutor/sessions/${sessionId}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
              >
                <X className="w-4 h-4" />
                Cancel
              </Link>

              <button
                type="submit"
                form="edit-session-form"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2.5 bg-white text-red-600 rounded-xl border border-red-200 hover:bg-red-50 transition-all shadow-sm hover:shadow-md"
                title="Delete Session"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Actions Menu */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200"
              >
                <span className="font-medium">Actions</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${isActionsMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isActionsMenuOpen && (
                <div className="absolute right-0 left-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
                  <div className="p-2 space-y-1">
                    <Link
                      href={`/tutor/sessions/${sessionId}`}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsActionsMenuOpen(false)}
                    >
                      <X className="w-5 h-5 text-gray-600" />
                      <span>Cancel</span>
                    </Link>

                    <button
                      type="submit"
                      form="edit-session-form"
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-main/5 rounded-lg transition-colors"
                      onClick={() => setIsActionsMenuOpen(false)}
                    >
                      <Save className="w-5 h-5 text-main" />
                      <span>Save Changes</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setIsActionsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash className="w-5 h-5 text-red-600" />
                      <span>Delete Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50/50">
            <nav className="flex overflow-x-auto hide-scrollbar">
              {[
                { id: "basic", label: "Basic Information", icon: Info },
                { id: "schedule", label: "Schedule", icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-main text-main bg-main/5"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            <form id="edit-session-form" onSubmit={handleSubmit}>
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  {/* Session Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      placeholder="e.g., January 2024 Batch"
                      required
                    />
                  </div>

                  {/* Subject - Read Only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Subject cannot be changed after session creation
                    </p>
                  </div>

                  {/* Curriculum Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Curriculum{" "}
                        <span className="text-gray-400 text-xs font-normal">
                          (Optional)
                        </span>
                      </label>
                      {loadingCurriculums ? (
                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                          <div className="animate-pulse flex items-center gap-2">
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            <div className="h-4 w-32 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      ) : (
                        <select
                          value={selectedCurriculumId || ""}
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseInt(e.target.value)
                              : null;
                            handleCurriculumChange(value);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        >
                          <option value="">
                            {tutorCurriculums.length === 0
                              ? "No curriculums available"
                              : "Select curriculum (optional)"}
                          </option>
                          {tutorCurriculums.map((curriculum) => (
                            <option key={curriculum.id} value={curriculum.id}>
                              {curriculum.name} ({curriculum.code})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {selectedCurriculumId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Curriculum Level{" "}
                          <span className="text-gray-400 text-xs font-normal">
                            (Optional)
                          </span>
                        </label>
                        <select
                          value={selectedCurriculumLevelId || ""}
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseInt(e.target.value)
                              : null;
                            handleCurriculumLevelChange(value);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        >
                          <option value="">Select level</option>
                          {getAvailableLevels().map((level) => (
                            <option key={level.id} value={level.id}>
                              {level.name} ({level.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Session Type and Batch */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Type
                      </label>
                      <select
                        name="session_type"
                        value={formData.session_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      >
                        <option value="group">Group Session</option>
                        <option value="one_on_one">One-on-One</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Batch Name{" "}
                        <span className="text-gray-400 text-xs font-normal">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="batch_name"
                        value={formData.batch_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        placeholder="e.g., Morning Batch"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description{" "}
                      <span className="text-gray-400 text-xs font-normal">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      placeholder="Additional details about this session..."
                    />
                  </div>

                  {/* Prerequisites */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prerequisites{" "}
                      <span className="text-gray-400 text-xs font-normal">
                        (Optional)
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPrerequisite}
                        onChange={(e) => setNewPrerequisite(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        placeholder="Add a prerequisite (e.g., Basic algebra knowledge)..."
                      />
                      <button
                        type="button"
                        onClick={addPrerequisite}
                        className="px-4 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Add any requirements students should have before joining
                    </p>

                    {formData.prerequisites.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {formData.prerequisites.map((prereq, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span>{prereq}</span>
                            <button
                              type="button"
                              onClick={() => removePrerequisite(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Learning Outcomes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Learning Outcomes{" "}
                      <span className="text-gray-400 text-xs font-normal">
                        (Optional)
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newOutcome}
                        onChange={(e) => setNewOutcome(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        placeholder="Add a learning outcome (e.g., Master quadratic equations)..."
                      />
                      <button
                        type="button"
                        onClick={addLearningOutcome}
                        className="px-4 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      What students will be able to do after completing this
                      session
                    </p>

                    {formData.learning_outcomes.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {formData.learning_outcomes.map((outcome, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span>{outcome}</span>
                            <button
                              type="button"
                              onClick={() => removeLearningOutcome(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Weekly Curriculum */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Weekly Curriculum{" "}
                          <span className="text-gray-400 text-xs font-normal">
                            (Optional)
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Break down the session into weekly topics and
                          materials
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addCurriculumWeek}
                        className="px-4 py-2 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Add Week
                      </button>
                    </div>

                    {formData.curriculum.length === 0 && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-sm">
                          No weekly curriculum added yet. Click "Add Week" to
                          create a structured curriculum.
                        </p>
                      </div>
                    )}

                    {formData.curriculum.map((week, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 mb-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            Week {week.week}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeCurriculumWeek(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Topic <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={week.topic}
                            onChange={(e) =>
                              updateCurriculum(index, "topic", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            placeholder="Week topic..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Objectives{" "}
                              <span className="text-gray-400 text-xs font-normal">
                                (Optional)
                              </span>
                            </label>
                            <input
                              type="text"
                              value={week.objectives?.join(", ") || ""}
                              onChange={(e) =>
                                updateCurriculum(
                                  index,
                                  "objectives",
                                  e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                              placeholder="Understand X, Learn Y, Master Z"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Materials{" "}
                              <span className="text-gray-400 text-xs font-normal">
                                (Optional)
                              </span>
                            </label>
                            <input
                              type="text"
                              value={week.materials?.join(", ") || ""}
                              onChange={(e) =>
                                updateCurriculum(
                                  index,
                                  "materials",
                                  e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                              placeholder="Textbook, Slides, Video"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Session Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        required
                        min={formData.start_date}
                      />
                    </div>
                  </div>

                  {/* Capacity & Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Students
                      </label>
                      <input
                        type="number"
                        name="max_students"
                        value={formData.max_students}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Maximum number of students allowed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Fee ({formData.fee_currency})
                      </label>
                      <input
                        type="number"
                        name="fee_amount"
                        value={formData.fee_amount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === "schedule" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-main" />
                      Class Schedule Configuration{" "}
                      <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Configure recurring class times for this session. Changes
                      to the schedule will affect future classes.
                    </p>

                    <ScheduleConfig
                      value={scheduleConfigs}
                      onChange={setScheduleConfigs}
                      startDate={formData.start_date}
                      endDate={formData.end_date}
                    />
                  </div>

                  {/* Schedule Summary */}
                  {scheduleConfigs.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Schedule Summary
                      </h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <p>• Total configurations: {scheduleConfigs.length}</p>
                        <p>
                          • Date range: {formatDate(formData.start_date)} -{" "}
                          {formatDate(formData.end_date)}
                        </p>
                        <p>
                          • Classes will be generated for each configured day of
                          week within the date range
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Form Actions - Mobile/Tablet */}
          <div className="border-t border-gray-200 bg-gray-50/50 p-4 lg:hidden">
            <div className="flex gap-3">
              <Link
                href={`/tutor/sessions/${sessionId}`}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                form="edit-session-form"
                disabled={saving}
                className="flex-1 px-4 py-3 bg-main text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Editing Tips
          </h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>
              Changes to basic information will update the session immediately
            </li>
            <li>
              Schedule changes will affect future classes based on the new
              configuration
            </li>
            <li>
              You can add multiple time slots for the same day (e.g., Monday
              morning AND afternoon)
            </li>
            <li>
              Duration is automatically calculated from start and end times
            </li>
            <li>
              Make sure your date range includes at least one instance of each
              scheduled day
            </li>
            <li className="text-amber-700">
              Subject cannot be changed after session creation
            </li>
          </ul>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Delete Session
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete "{session?.name}"? This action
              cannot be undone and will affect all associated data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
