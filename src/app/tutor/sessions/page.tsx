// src/app/tutor/sessions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi, { TutorSession } from "@/lib/api/tutor";
import { CalendarPlus } from "lucide-react";

export default function TutorSessionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");

  // Get course ID from URL params
  const courseIdParam = searchParams.get("courseId");

  useEffect(() => {
    fetchCourses();
  }, []);

  // Set selected course from URL param once courses are loaded
  useEffect(() => {
    if (courses.length > 0 && courseIdParam) {
      const courseExists = courses.some(
        (course) => course.id === parseInt(courseIdParam),
      );
      if (courseExists) {
        setSelectedCourseId(courseIdParam);
      }
    }
  }, [courses, courseIdParam]);

  // Fetch sessions when filter or selectedCourseId changes
  useEffect(() => {
    fetchSessions();
  }, [filter, selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const response = await tutorApi.getMyCourses();
      if (response.success) {
        console.log("Fetched courses:", response.data.courses);
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 20,
        status: filter !== "all" ? filter : undefined,
        tutor_course_id:
          selectedCourseId !== "all" ? parseInt(selectedCourseId) : undefined,
      };

      const response = await tutorApi.getSessions(params);
      if (response.success) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);

    // Update URL with the selected course ID
    const params = new URLSearchParams(searchParams.toString());
    if (courseId !== "all") {
      params.set("courseId", courseId);
    } else {
      params.delete("courseId");
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.push(newUrl);
  };

  const handleDelete = async (sessionId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this session? This action cannot be undone.",
      )
    )
      return;

    try {
      const response = await tutorApi.deleteSession(sessionId);
      if (response.success) {
        toast.success("Session deleted successfully!");
        setSessions(sessions.filter((session) => session.id !== sessionId));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete session");
    }
  };

  const handleEnrollmentStatus = async (
    sessionId: number,
    newStatus: string,
  ) => {
    try {
      const response = await tutorApi.updateSession(sessionId, {
        enrollment_status: newStatus as any,
      });
      if (response.success) {
        toast.success(`Enrollment ${newStatus} successfully!`);
        fetchSessions(); // Refresh list
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update enrollment status");
    }
  };

  const handleJoinSession = async (sessionId: number) => {
    try {
      const response = await tutorApi.joinSession(sessionId);
      if (response.success && response.data.meeting_link) {
        window.open(response.data.meeting_link, "_blank");
      } else {
        toast.error("Meeting link not available");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to join session");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "waiting_list":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCourseTitle = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : `Course #${courseId}`;
  };

  const getSessionTypeLabel = (type: string) => {
    return type === "one_on_one" ? "One-on-One" : "Group";
  };

  // Get current course name for display
  const getCurrentCourseName = () => {
    if (selectedCourseId !== "all") {
      const course = courses.find((c) => c.id === parseInt(selectedCourseId));
      return course?.title;
    }
    return null;
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto ">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-2">
            {selectedCourseId !== "all" ? (
              <>
                Managing sessions for:{" "}
                <span className="font-medium text-main">
                  {getCurrentCourseName()}
                </span>
              </>
            ) : (
              "Manage and track all your course sessions"
            )}
          </p>
        </div>
        <Link
          href={
            selectedCourseId !== "all"
              ? `/tutor/sessions/create?courseId=${selectedCourseId}`
              : "/tutor/sessions/create"
          }
          className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-main to-purple-600 text-white text-sm sm:text-base font-medium rounded-xl hover:from-purple-700 hover:to-main transition-all duration-200 shadow-lg shadow-main/25 hover:shadow-xl hover:shadow-main/30 transform hover:-translate-y-0.5"
        >
          <CalendarPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Schedule New Session
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>

            {/* Clear filter button - only show when a specific course is selected */}
            {selectedCourseId !== "all" && (
              <button
                onClick={() => handleCourseChange("all")}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <span>✕</span> Clear course filter
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              {["all", "scheduled", "ongoing", "completed", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-2 rounded-lg font-medium capitalize ${
                      filter === status
                        ? "bg-main text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all" ? "All" : status}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {session.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getSessionTypeLabel(session.session_type)}
                          {session.batch_name && ` • ${session.batch_name}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getCourseTitle(session.tutor_course_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(session.start_date)} -{" "}
                      {formatDate(session.end_date)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Starts: {formatTime(session.start_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEnrollmentStatusColor(session.enrollment_status)}`}
                      >
                        {session.enrollment_status}
                      </span>
                      <span className="text-sm text-gray-600">
                        {session.current_enrollment}/{session.max_students}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}
                    >
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/tutor/sessions/${session.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>

                      {session.status === "scheduled" && (
                        <>
                          {session.enrollment_status === "open" ? (
                            <button
                              onClick={() =>
                                handleEnrollmentStatus(session.id, "closed")
                              }
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Close
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleEnrollmentStatus(session.id, "open")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Reopen
                            </button>
                          )}
                        </>
                      )}

                      {session.status === "scheduled" &&
                        session.current_enrollment === 0 && (
                          <button
                            onClick={() => handleDelete(session.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sessions.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedCourseId === "all"
                ? "Create a session to get started"
                : "No sessions for this course yet"}
            </p>
            <Link
              href={
                selectedCourseId !== "all"
                  ? `/tutor/sessions/create?courseId=${selectedCourseId}`
                  : "/tutor/sessions/create"
              }
              className="px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors inline-block"
            >
              Schedule First Session
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <p className="text-2xl font-bold mt-2">{sessions.length}</p>
            </div>
            <span className="text-2xl">📅</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold mt-2">
                {sessions.filter((s) => s.status === "scheduled").length}
              </p>
            </div>
            <span className="text-2xl">⏰</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold mt-2">
                {sessions.reduce(
                  (sum, session) => sum + session.current_enrollment,
                  0,
                )}
              </p>
            </div>
            <span className="text-2xl">👥</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Open Enrollment</p>
              <p className="text-2xl font-bold mt-2">
                {sessions.filter((s) => s.enrollment_status === "open").length}
              </p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </div>
      </div>
    </div>
  );
}
