// src/app/tutor/courses/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi, { TutorCourse } from "@/lib/api/tutor";

const levels = [
  { value: "primary", label: "Primary School" },
  { value: "junior_high", label: "Junior High" },
  { value: "senior_high", label: "Senior High" },
  { value: "university", label: "University" },
  { value: "adult", label: "Adult Education" },
];

const modes = [
  { value: "virtual", label: "Virtual" },
  { value: "in_person", label: "In-Person" },
  { value: "hybrid", label: "Hybrid" },
];

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<TutorCourse | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    level: "senior_high" as const,
    total_weeks: 4,
    classes_per_week: 1,
    class_duration_minutes: 120,
    mode: "virtual" as const,
    max_students_per_session: 10,
    total_price: 0,
    currency: "KES",
    thumbnail_url: "",
    syllabus_url: "",
    prerequisites: [] as string[],
    learning_outcomes: [] as string[],
    curriculum: [] as Array<{
      week: number;
      topic: string;
      objectives: string[];
      materials: string[];
    }>,
    requires_approval: true,
  });

  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newOutcome, setNewOutcome] = useState("");

  // Fetch course data on mount
  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await tutorApi.getCourse(parseInt(courseId));

      if (response.success && response.data) {
        const courseData = response.data["0"] || response.data;
        setCourse(courseData);
        // console.log(
        //   "Fetched requries approval val:",
        //   courseData.requires_approval,
        //   );

        const requiresApproval =
          courseData.requires_approval === 1 ||
          courseData.requires_approval === true;
        // Populate form with course data
        setFormData({
          title: courseData.title || "",
          description: courseData.description || "",
          subject: courseData.subject || "",
          level: courseData.level || "senior_high",
          total_weeks: courseData.total_weeks || 4,
          classes_per_week: courseData.classes_per_week || 1,
          class_duration_minutes: courseData.class_duration_minutes || 120,
          mode: courseData.mode || "virtual",
          max_students_per_session: courseData.max_students_per_session || 10,
          total_price: courseData.total_price || 0,
          currency: courseData.currency || "KES",
          thumbnail_url: courseData.thumbnail_url || "",
          syllabus_url: courseData.syllabus_url || "",
          prerequisites: courseData.prerequisites || [],
          learning_outcomes: courseData.learning_outcomes || [],
          curriculum: courseData.curriculum || [],
          //   requires_approval: courseData.requires_approval ?? true,
          requires_approval: requiresApproval,
        });
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (fieldName: string) => {
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });

    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
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
        name === "total_weeks" ||
        name === "classes_per_week" ||
        name === "class_duration_minutes" ||
        name === "max_students_per_session" ||
        name === "total_price"
          ? Number(value)
          : value,
    }));
    clearFieldError(name);
    setApiError(null);
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
        .map((week, idx) => ({ ...week, week: idx + 1 })), // Renumber weeks
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Course title is required";
    } else if (formData.title.length < 5) {
      errors.title = "Course title must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Course description is required";
    } else if (formData.description.length < 20) {
      errors.description = "Course description must be at least 20 characters";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (formData.total_price < 0) {
      errors.total_price = "Price cannot be negative";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSaving(true);
    setApiError(null);
    setFieldErrors({});

    try {
      const submissionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject.trim(),
        level: formData.level,
        total_weeks: Number(formData.total_weeks),
        classes_per_week: Number(formData.classes_per_week),
        class_duration_minutes: Number(formData.class_duration_minutes),
        mode: formData.mode,
        max_students_per_session: Number(formData.max_students_per_session),
        total_price: Number(formData.total_price),
        currency: formData.currency,
        thumbnail_url: formData.thumbnail_url?.trim() || undefined,
        syllabus_url: formData.syllabus_url?.trim() || undefined,
        prerequisites: formData.prerequisites.filter((p) => p.trim() !== ""),
        learning_outcomes: formData.learning_outcomes.filter(
          (o) => o.trim() !== "",
        ),
        curriculum: formData.curriculum
          .filter((week) => week.topic?.trim() !== "")
          .map((week, index) => ({
            week: index + 1,
            topic: week.topic.trim(),
            objectives: week.objectives?.filter((o) => o?.trim() !== "") || [],
            materials: week.materials?.filter((m) => m?.trim() !== "") || [],
          })),
        requires_approval: formData.requires_approval,
      };

      const response = await tutorApi.updateCourse(
        parseInt(courseId),
        submissionData,
      );

      if (response.success) {
        toast.success("Course updated successfully!");
        router.push(`/tutor/courses/${courseId}`);
      }
    } catch (error: any) {
      console.error("Update course error:", error);

      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
        toast.error("Please check the form for errors");
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        const errorMessage = error.message || "Failed to update course";
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <Link href="/tutor/courses" className="text-main hover:underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  // Check if course can be edited
  const canEdit = ["draft", "published"].includes(course.status);
  if (!canEdit) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Cannot Edit Course
          </h2>
          <p className="text-yellow-700 mb-4">
            This course has status "{course.status}" and cannot be edited. Only
            draft or published courses can be modified.
          </p>
          <Link
            href={`/tutor/courses/${courseId}`}
            className="inline-block px-6 py-3 bg-main text-white rounded-lg hover:bg-purple-700"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/tutor/courses/${courseId}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Course</h1>
          <p className="text-gray-600 mt-2">Update your course information</p>
        </div>
      </div>

      {/* Global API Error Alert */}
      {apiError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-red-700 hover:text-red-900"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-main focus:border-transparent ${
                    formErrors.title || fieldErrors.title
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="e.g., Calculus 101"
                />
                {(formErrors.title || fieldErrors.title) && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.title || fieldErrors.title?.[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-main focus:border-transparent ${
                    formErrors.subject || fieldErrors.subject
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="e.g., Mathematics"
                />
                {(formErrors.subject || fieldErrors.subject) && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.subject || fieldErrors.subject?.[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-main focus:border-transparent ${
                  formErrors.description || fieldErrors.description
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Describe what students will learn in this course..."
              />
              {(formErrors.description || fieldErrors.description) && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.description || fieldErrors.description?.[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                >
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Mode
                </label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                >
                  {modes.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Price ({formData.currency})
                </label>
                <input
                  type="number"
                  name="total_price"
                  value={formData.total_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-main focus:border-transparent ${
                    formErrors.total_price || fieldErrors.total_price
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {(formErrors.total_price || fieldErrors.total_price) && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.total_price || fieldErrors.total_price?.[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Course Structure */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Course Structure
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Weeks
                </label>
                <input
                  type="number"
                  name="total_weeks"
                  value={formData.total_weeks}
                  onChange={handleChange}
                  min="1"
                  max="52"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classes per Week
                </label>
                <input
                  type="number"
                  name="classes_per_week"
                  value={formData.classes_per_week}
                  onChange={handleChange}
                  min="1"
                  max="7"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Duration (minutes)
                </label>
                <input
                  type="number"
                  name="class_duration_minutes"
                  value={formData.class_duration_minutes}
                  onChange={handleChange}
                  min="30"
                  max="300"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Students per Session
                </label>
                <input
                  type="number"
                  name="max_students_per_session"
                  value={formData.max_students_per_session}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Prerequisites
            </h2>
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
              <div className="space-y-2">
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
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Learning Outcomes
            </h2>
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
              <div className="space-y-2">
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

          {/* Curriculum */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Curriculum
              </h2>
              <button
                type="button"
                onClick={addCurriculumWeek}
                className="px-4 py-2 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Week
              </button>
            </div>

            {formErrors.curriculum && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{formErrors.curriculum}</p>
              </div>
            )}

            {formData.curriculum.map((week, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
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
                    Topic *
                  </label>
                  <input
                    type="text"
                    value={week.topic}
                    onChange={(e) =>
                      updateCurriculum(index, "topic", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-main focus:border-transparent ${
                      fieldErrors[`curriculum.${index}.topic`]
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Week topic..."
                  />
                  {fieldErrors[`curriculum.${index}.topic`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors[`curriculum.${index}.topic`][0]}
                    </p>
                  )}
                </div>

                {/* Optional: Add objectives and materials inputs */}
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

          {/* Media URLs */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Course Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Syllabus URL
                </label>
                <input
                  type="url"
                  name="syllabus_url"
                  value={formData.syllabus_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="https://example.com/syllabus.pdf"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Additional Settings
            </h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requires_approval"
                name="requires_approval"
                checked={formData.requires_approval}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requires_approval: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-main focus:ring-main border-gray-300 rounded"
              />
              <label
                htmlFor="requires_approval"
                className="ml-2 block text-sm text-gray-700"
              >
                Require approval for student enrollment
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href={`/tutor/courses/${courseId}`}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={saving}
            >
              {saving ? (
                <>
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
