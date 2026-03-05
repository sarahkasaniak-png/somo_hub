// src/app/tutor/sessions/create/CreateSessionContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import tutorApi from "@/lib/api/tutor";
import ScheduleConfig from "./components/ScheduleConfig";

// Simple utility functions directly in the component to avoid import issues
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
  const courseId = searchParams.get("courseId");

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [scheduleConfigs, setScheduleConfigs] = useState<
    Array<{
      day_of_week: number;
      start_time: string;
      end_time: string;
    }>
  >([]);

  const [formData, setFormData] = useState({
    tutor_course_id: courseId ? parseInt(courseId) : 0,
    name: "",
    description: "",
    batch_name: "",
    session_type: "group" as "one_on_one" | "group",
    max_students: 10,
    start_date: "",
    end_date: "",
    fee_amount: 0,
    fee_currency: "KES",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await tutorApi.getMyCourses({ status: "published" });
      if (response.success) {
        setCourses(response.data.courses);
        if (courseId) {
          const selectedCourse = response.data.courses.find(
            (c: any) => c.id === parseInt(courseId),
          );
          if (selectedCourse) {
            setFormData((prev) => ({
              ...prev,
              tutor_course_id: selectedCourse.id,
            }));
          }
        } else if (response.data.courses.length > 0) {
          setFormData((prev) => ({
            ...prev,
            tutor_course_id: response.data.courses[0].id,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Failed to load courses");
    }
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
        name === "tutor_course_id" ||
        name === "max_students" ||
        name === "fee_amount"
          ? Number(value)
          : value,
    }));
  };

  const validateForm = () => {
    if (!formData.tutor_course_id) {
      toast.error("Please select a course");
      return false;
    }

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

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    let hasValidClasses = false;

    scheduleConfigs.forEach((config) => {
      const current = new Date(start);
      while (current <= end) {
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

      const finalData = {
        ...formData,
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

        router.push(`/tutor/sessions/${response.data.id}`);
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
          Set up a new session for your course with flexible class schedules
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course *
            </label>

            {courseId ? (
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                {courses.find((c) => c.id === parseInt(courseId))?.title ||
                  "Loading course..."}
                (
                {courses.find((c) => c.id === parseInt(courseId))?.subject ||
                  ""}
                )
              </div>
            ) : (
              <select
                name="tutor_course_id"
                value={formData.tutor_course_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                required
                disabled={courses.length === 0}
              >
                <option value={0}>Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.subject})
                  </option>
                ))}
              </select>
            )}

            {courseId && (
              <input
                type="hidden"
                name="tutor_course_id"
                value={formData.tutor_course_id}
              />
            )}

            {courses.length === 0 && !courseId && (
              <p className="mt-2 text-sm text-amber-600">
                No published courses found. Please create and publish a course
                first.
              </p>
            )}
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Name *
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
          </div>

          {/* Batch Name */}
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

          {/* Session Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
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
                End Date *
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
                Maximum number of students allowed in this session
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
              disabled={loading || (courses.length === 0 && !courseId)}
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
        </ul>
      </div>
    </div>
  );
}
