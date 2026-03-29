// src/app/tutor/sessions/create/CreateSessionContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import tutorApi, {
  CreateSessionData,
  Curriculum,
  TutorLevelInfo,
} from "@/lib/api/tutor";
import ScheduleConfig from "./components/ScheduleConfig";
import { GraduationCap, BookOpen } from "lucide-react";

// Simple utility functions
const formatTimeForApi = (timeString: string): string => {
  if (!timeString) return timeString;
  if (timeString.includes(":")) {
    const parts = timeString.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
  }
  return timeString;
};

const parseApiError = (error: any): string => {
  console.log("Parsing error:", error);

  if (typeof error === "string") return error;

  const errorMessage = error?.message || error?.error || error?.toString();

  if (!errorMessage) return "An unknown error occurred";

  if (errorMessage.includes("Validation failed")) {
    const matches = errorMessage.match(
      /"([^"]+)" with value "([^"]+)" fails to match/,
    );
    if (matches) {
      const field = matches[1];
      const value = matches[2];
      return `Invalid format for ${field}: "${value}". Please use HH:MM format.`;
    }

    const parts = errorMessage.split("Validation failed: ");
    if (parts.length > 1) {
      const errors = parts[1].split(", ");
      return errors[0].replace(/"/g, "'");
    }
  }

  return errorMessage;
};

export default function CreateSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [scheduleConfigs, setScheduleConfigs] = useState<
    Array<{
      day_of_week: number;
      start_time: string;
      end_time: string;
    }>
  >([]);

  // Curriculum and tutor level state
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

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject: "",
    curriculum_id: undefined as number | undefined,
    curriculum_level_id: undefined as number | undefined,
    prerequisites: [] as string[],
    learning_outcomes: [] as string[],
    curriculum: [] as Array<{
      week: number;
      topic: string;
      objectives: string[];
      materials: string[];
    }>,
    batch_name: "",
    session_type: "group" as "one_on_one" | "group",
    max_students: 25,
    start_date: "",
    end_date: "",
    fee_amount: 0,
    fee_currency: "KES",
  });

  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newOutcome, setNewOutcome] = useState("");

  useEffect(() => {
    fetchTutorData();
  }, []);

  const fetchTutorData = async () => {
    try {
      setLoadingCurriculums(true);

      // Fetch tutor profile to get tutor_id
      const profileResponse = await tutorApi.getTutorProfile();

      if (profileResponse.success && profileResponse.data) {
        // Fetch all curriculums
        const curriculumsResponse = await tutorApi.getCurriculums();

        if (curriculumsResponse.success && curriculumsResponse.data) {
          setAllCurriculums(curriculumsResponse.data);

          // Fetch tutor's curriculums from the tutor_curriculums table
          const tutorCurriculumsResponse = await tutorApi.getTutorCurriculums();

          if (
            tutorCurriculumsResponse.success &&
            tutorCurriculumsResponse.data
          ) {
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
        if (profileResponse.data.tutor_level_id) {
          const levelsResponse = await tutorApi.getTutorLevels();
          if (levelsResponse.success && levelsResponse.data) {
            const level = levelsResponse.data.find(
              (l) => l.id === profileResponse.data.tutor_level_id,
            );
            setTutorLevel(level || null);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch tutor data:", error);
      toast.error("Failed to load curriculum data");
    } finally {
      setLoadingCurriculums(false);
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

    if (!formData.subject || !formData.subject.trim()) {
      toast.error("Please enter a subject");
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return false;
    }

    if (startDate < today) {
      toast.error("Start date must be in the future");
      return false;
    }

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
        "No classes will be generated with the current schedule and date range. Please adjust your schedule or date range.",
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

    setLoading(true);

    try {
      const formattedScheduleConfigs = scheduleConfigs.map((config) => ({
        day_of_week: config.day_of_week,
        start_time: formatTimeForApi(config.start_time),
        end_time: formatTimeForApi(config.end_time),
      }));

      const finalData: CreateSessionData = {
        name: formData.name,
        description: formData.description || undefined,
        subject: formData.subject,
        curriculum_id: formData.curriculum_id,
        curriculum_level_id: formData.curriculum_level_id,
        prerequisites:
          formData.prerequisites.length > 0
            ? formData.prerequisites
            : undefined,
        learning_outcomes:
          formData.learning_outcomes.length > 0
            ? formData.learning_outcomes
            : undefined,
        curriculum:
          formData.curriculum.length > 0 ? formData.curriculum : undefined,
        batch_name: formData.batch_name || undefined,
        session_type: formData.session_type,
        max_students: formData.max_students,
        start_date: formData.start_date,
        end_date: formData.end_date,
        fee_amount: formData.fee_amount || undefined,
        fee_currency: formData.fee_currency,
        schedule_configs: formattedScheduleConfigs,
      };

      console.log("Submitting session creation with data:", finalData);

      const response = await tutorApi.createSession(finalData);

      console.log("Create session response:", response);

      if (response.success) {
        const totalClasses = scheduleConfigs.reduce((total, config) => {
          const start = new Date(formData.start_date);
          const end = new Date(formData.end_date);
          let count = 0;
          const current = new Date(start);
          while (current <= end) {
            if (current.getDay() === config.day_of_week) {
              count++;
            }
            current.setDate(current.getDate() + 1);
          }
          return total + count;
        }, 0);

        toast.success(
          `Session created successfully with ${scheduleConfigs.length} schedule configuration${scheduleConfigs.length !== 1 ? "s" : ""} and ${totalClasses} total classes!`,
          {
            duration: 5000,
            position: "top-center",
          },
        );

        router.push(`/tutor/sessions/${response.data.uuid}`);
      } else {
        toast.error("Failed to create session. Please try again.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error: any) {
      console.error("Create session error details:", {
        message: error.message,
        response: error.response,
        stack: error.stack,
        error: error,
      });

      const errorMessage = parseApiError(error);
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Schedule New Session
        </h1>
        <p className="text-gray-600 mt-2">
          Set up a new teaching session with flexible class schedules,
          curriculum alignment, and learning materials
        </p>
      </div>

      {/* Tutor Level Display */}
      {tutorLevel && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800">
                Your Tutor Level
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                <span className="font-medium">{tutorLevel.level_name}</span>
                {tutorLevel.level_description &&
                  ` - ${tutorLevel.level_description}`}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                This session will be associated with your tutor level. Students
                can filter sessions by tutor level.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="e.g., KCSE Mathematics Revision - April Intake"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="e.g., Mathematics, Physics, English"
                required
              />
            </div>
          </div>

          {/* Curriculum Selection - Only shows curriculums the tutor is qualified for */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum {loadingCurriculums && "(Loading...)"}
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
                  disabled={tutorCurriculums.length === 0}
                >
                  <option value="">
                    {tutorCurriculums.length === 0
                      ? "No curriculums available - complete tutor qualification first"
                      : "Select curriculum (optional)"}
                  </option>
                  {tutorCurriculums.map((curriculum) => (
                    <option key={curriculum.id} value={curriculum.id}>
                      {curriculum.name} ({curriculum.code})
                    </option>
                  ))}
                </select>
              )}
              {tutorCurriculums.length === 0 && !loadingCurriculums && (
                <p className="mt-2 text-xs text-amber-600">
                  You need to be qualified in at least one curriculum before
                  creating sessions. Please complete your tutor profile with
                  your qualifications.
                </p>
              )}
            </div>

            {selectedCurriculumId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curriculum Level
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
                Batch Name (Optional)
              </label>
              <input
                type="text"
                name="batch_name"
                value={formData.batch_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="e.g., Morning Batch, Weekend Class"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              placeholder="Additional details about this session..."
            />
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prerequisites (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="Add a prerequisite..."
              />
              <button
                type="button"
                onClick={addPrerequisite}
                className="px-4 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>

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
              Learning Outcomes (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newOutcome}
                onChange={(e) => setNewOutcome(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="Add a learning outcome..."
              />
              <button
                type="button"
                onClick={addLearningOutcome}
                className="px-4 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>

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
              <label className="block text-sm font-medium text-gray-700">
                Weekly Curriculum (Optional)
              </label>
              <button
                type="button"
                onClick={addCurriculumWeek}
                className="px-4 py-2 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Add Week
              </button>
            </div>

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
                    Topic
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
                      Objectives (comma separated)
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
                      Materials (comma separated)
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
                min={new Date().toISOString().split("T")[0]}
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

          {/* Schedule Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Class Schedule Configuration
            </h3>

            <ScheduleConfig
              value={scheduleConfigs}
              onChange={setScheduleConfigs}
              startDate={formData.start_date}
              endDate={formData.end_date}
            />
          </div>

          {/* Capacity & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Students (between 1 - 30)
              </label>
              <input
                type="number"
                name="max_students"
                value={formData.max_students}
                onChange={handleChange}
                min="1"
                max="30"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Maximum number of students allowed in this session
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Session Fee ({formData.fee_currency})
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

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-main to-purple-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-main transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
              disabled={loading || tutorCurriculums.length === 0}
              title={
                tutorCurriculums.length === 0
                  ? "You need to be qualified in at least one curriculum before creating sessions"
                  : ""
              }
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Session with Schedule"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          💡 About Flexible Scheduling
        </h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>
            Add multiple time slots for the same day (e.g., Monday morning AND
            afternoon)
          </li>
          <li>
            Different days can have different times (e.g., Monday 8am-10am,
            Wednesday 2pm-4pm)
          </li>
          <li>Duration is automatically calculated from start and end times</li>
          <li>
            The system will generate individual classes for each scheduled time
            between your start and end dates
          </li>
          <li>You can view and manage all generated classes after creation</li>
          <li>
            Add prerequisites, learning outcomes, and weekly curriculum to
            structure your session
          </li>
          <li>
            Select a curriculum and level to help students find your session
          </li>
          <li className="text-amber-700">
            Only curriculums you're qualified for are shown. Complete your tutor
            profile to add more qualifications.
          </li>
        </ul>
      </div>
    </div>
  );
}
