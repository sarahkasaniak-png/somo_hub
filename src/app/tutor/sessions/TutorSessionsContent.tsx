// src/app/tutor/sessions/TutorSessionsContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import tutorApi, { TutorSession } from "@/lib/api/tutor";
import { CalendarPlus } from "lucide-react";

export default function TutorSessionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 20,
        status: filter !== "all" ? filter : undefined,
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

  const handleDelete = async (sessionUuid: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this session? This action cannot be undone.",
      )
    )
      return;

    try {
      const response = await tutorApi.deleteSession(sessionUuid);
      if (response.success) {
        toast.success("Session deleted successfully!");
        setSessions(sessions.filter((session) => session.uuid !== sessionUuid));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete session");
    }
  };

  const handleEnrollmentStatus = async (
    sessionUuid: string,
    newStatus: string,
  ) => {
    try {
      const response = await tutorApi.updateSession(sessionUuid, {
        enrollment_status: newStatus,
      } as any);
      if (response.success) {
        toast.success(`Enrollment ${newStatus} successfully!`);
        fetchSessions();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update enrollment status");
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

  const getSessionTypeLabel = (type: string) => {
    return type === "one_on_one" ? "One-on-One" : "Group";
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all your course sessions
          </p>
        </div>
        <Link
          href="/tutor/sessions/create"
          className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-main to-purple-600 text-white text-sm sm:text-base font-medium rounded-xl hover:from-purple-700 hover:to-main transition-all duration-200 shadow-lg shadow-main/25 hover:shadow-xl hover:shadow-main/30 transform hover:-translate-y-0.5"
        >
          <CalendarPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Schedule New Session
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
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
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curriculum
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
                <tr key={session.uuid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {session.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getSessionTypeLabel(session.session_type)}
                        {session.batch_name && ` • ${session.batch_name}`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {session.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {session.curriculum_name || "Not specified"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {session.curriculum_level_name || ""}
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
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.session_status)}`}
                    >
                      {session.session_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/tutor/sessions/${session.uuid}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>

                      {session.session_status === "scheduled" && (
                        <>
                          {session.enrollment_status === "open" ? (
                            <button
                              onClick={() =>
                                handleEnrollmentStatus(session.uuid, "closed")
                              }
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Close
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleEnrollmentStatus(session.uuid, "open")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Reopen
                            </button>
                          )}
                        </>
                      )}

                      {session.session_status === "scheduled" &&
                        session.current_enrollment === 0 && (
                          <button
                            onClick={() => handleDelete(session.uuid)}
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
              Create a session to get started
            </p>
            <Link
              href="/tutor/sessions/create"
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
                {
                  sessions.filter((s) => s.session_status === "scheduled")
                    .length
                }
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
