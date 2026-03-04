// src/app/tutor/courses/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import tutorApi from "@/lib/api/tutor";

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

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Add state for form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Add state for API error
  const [apiError, setApiError] = useState<string | null>(null);

  // Add state for field-specific API errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

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

  // Clear errors when user starts typing
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

    // Clear error for this field
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
      clearFieldError("prerequisites");
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
      clearFieldError("learning_outcomes");
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
    clearFieldError("curriculum");
  };

  const updateCurriculum = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newCurriculum = [...prev.curriculum];
      newCurriculum[index] = { ...newCurriculum[index], [field]: value };
      return { ...prev, curriculum: newCurriculum };
    });
    clearFieldError(`curriculum.${index}.${field}`);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      errors.title = "Course title is required";
    } else if (formData.title.length < 5) {
      errors.title = "Course title must be at least 5 characters";
    } else if (formData.title.length > 191) {
      errors.title = "Course title cannot exceed 191 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Course description is required";
    } else if (formData.description.length < 20) {
      errors.description = "Course description must be at least 20 characters";
    } else if (formData.description.length > 2000) {
      errors.description = "Course description cannot exceed 2000 characters";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    // Price validation
    if (formData.total_price < 0) {
      errors.total_price = "Price cannot be negative";
    }

    // Curriculum validation
    if (formData.total_weeks > 0) {
      if (formData.curriculum.length === 0) {
        errors.curriculum = "Please add at least one week to your curriculum";
      } else {
        const incompleteWeeks = formData.curriculum.filter(
          (week) => !week.topic?.trim(),
        );

        if (incompleteWeeks.length > 0) {
          errors.curriculum = `Week ${incompleteWeeks[0].week} is missing a topic`;
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update the handleSubmit section around line 282

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setApiError(null);
    setFieldErrors({});

    // Run validation first
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      // Clean the data before sending
      const submissionData = {
        // Basic Information
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject.trim(),
        level: formData.level,

        // Course Structure
        total_weeks: Number(formData.total_weeks) || 4,
        classes_per_week: Number(formData.classes_per_week) || 1,
        class_duration_minutes: Number(formData.class_duration_minutes) || 120,
        mode: formData.mode,
        max_students_per_session:
          Number(formData.max_students_per_session) || 10,

        // Pricing
        total_price: Number(formData.total_price) || 0,
        currency: formData.currency || "KES",

        // Media
        thumbnail_url: formData.thumbnail_url?.trim() || undefined,
        syllabus_url: formData.syllabus_url?.trim() || undefined,

        // Course Content
        prerequisites: formData.prerequisites.filter((p) => p.trim() !== ""),
        learning_outcomes: formData.learning_outcomes.filter(
          (o) => o.trim() !== "",
        ),

        // Curriculum
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

      console.log("Submitting course data:", submissionData);

      const response = await tutorApi.createCourse(submissionData);

      // ✅ FIXED: Check response structure
      if (response.success && response.data) {
        toast.success("Course created successfully!");
        console.log("course created:", response.data);
        router.push(`/tutor/courses/${response.data.id}`);
      } else {
        // ✅ FIXED: response doesn't have message property
        const errorMessage = "Failed to create course";
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Create course error:", error);

      // Handle different error formats
      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle validation errors array
        if (errorData.errors) {
          setFieldErrors(errorData.errors);

          // Set first error as form error
          const firstField = Object.keys(errorData.errors)[0];
          if (firstField) {
            setFormErrors((prev) => ({
              ...prev,
              [firstField]: errorData.errors[firstField][0],
            }));
          }

          toast.error("Please check the form for errors");
        }
        // Handle single message
        else if (errorData.message) {
          setApiError(errorData.message);

          // Check for specific error messages
          if (errorData.message.includes("tutor not found")) {
            toast.error("You need to complete your tutor profile first");
            router.push("/tutor/application");
          } else {
            toast.error(errorData.message);
          }
        }
        // Handle other error formats
        else {
          const errorMessage = "Failed to create course";
          setApiError(errorMessage);
          toast.error(errorMessage);
        }
      }
      // Handle Joi validation error string
      else if (error.message?.includes("Validation failed")) {
        setApiError(error.message);
        toast.error(error.message);
      }
      // Handle generic error
      else {
        const errorMessage =
          error.message || "Failed to create course. Please try again.";
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Create New Course
        </h1>
        <p className="text-gray-600 mt-2">
          Design your course and set up all the details
        </p>
      </div>

      {/* Global API Error Alert */}
      {apiError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setApiError(null)}
                className="text-red-700 hover:text-red-900"
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
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
                {/* Field error message */}
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
                  Total Price (KES)
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

            {/* Prerequisites field error */}
            {fieldErrors.prerequisites && (
              <p className="text-sm text-red-600">
                {fieldErrors.prerequisites[0]}
              </p>
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

            {/* Learning outcomes field error */}
            {fieldErrors.learning_outcomes && (
              <p className="text-sm text-red-600">
                {fieldErrors.learning_outcomes[0]}
              </p>
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

            {/* Curriculum error message */}
            {(formErrors.curriculum || fieldErrors.curriculum) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">
                  {formErrors.curriculum || fieldErrors.curriculum?.[0]}
                </p>
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
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        curriculum: prev.curriculum.filter(
                          (_, i) => i !== index,
                        ),
                      }));
                    }}
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
              </div>
            ))}
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
              className="px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
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
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Course</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
