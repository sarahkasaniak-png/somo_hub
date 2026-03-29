// src/app/admin/tutors/applications/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import client from "@/lib/api/client";

interface TutorApplication {
  id: number;
  user_id: number;
  application_status:
    | "draft"
    | "pending"
    | "under_review"
    | "approved"
    | "rejected";
  current_step: number;
  official_first_name: string;
  official_last_name: string;
  email: string;
  phone: string;
  tutor_level: string;
  highest_education_level: string;
  university_name: string;
  subjects: string[];
  created_at: string;
  updated_at: string;
}

export default function TutorApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, pagination.page]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await client.get<{
        success: boolean;
        data: {
          applications: TutorApplication[];
          total: number;
          page: number;
          totalPages: number;
        };
      }>("/admin/tutors/applications", {
        status: statusFilter,
        page: pagination.page,
        limit: 20,
      });

      if (response.success && response.data) {
        setApplications(response.data.applications);
        setPagination({
          page: response.data.page,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
      } else {
        console.error("Failed to load applications:", response);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      under_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
      case "under_review":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "draft":
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      (app.official_first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        app.official_last_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || app.application_status === statusFilter),
  );

  // Status counts for display
  const statusCounts = {
    draft: applications.filter((app) => app.application_status === "draft")
      .length,
    pending: applications.filter((app) => app.application_status === "pending")
      .length,
    under_review: applications.filter(
      (app) => app.application_status === "under_review",
    ).length,
    approved: applications.filter(
      (app) => app.application_status === "approved",
    ).length,
    rejected: applications.filter(
      (app) => app.application_status === "rejected",
    ).length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tutor Applications
        </h1>
        <p className="text-gray-600 mt-1">
          Review and manage tutor applications
        </p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`p-3 rounded-xl border transition-all ${
              statusFilter === status
                ? "border-purple-500 bg-purple-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase">
                {status.replace("_", " ")}
              </span>
              <span
                className={`text-lg font-bold ${
                  statusFilter === status ? "text-purple-600" : "text-gray-700"
                }`}
              >
                {count}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "draft",
              "pending",
              "under_review",
              "approved",
              "rejected",
              "all",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status.replace("_", " ").toUpperCase()}
                {status !== "all" && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white/20 text-white">
                    {statusCounts[status as keyof typeof statusCounts]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No applications found</p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="mt-2 text-purple-600 hover:text-purple-700 text-sm"
              >
                View all applications
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() =>
                  router.push(`/admin/tutors/applications/${app.id}`)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">
                        {app.official_first_name} {app.official_last_name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadge(
                          app.application_status,
                        )}`}
                      >
                        {getStatusIcon(app.application_status)}
                        {app.application_status === "draft"
                          ? "DRAFT"
                          : app.application_status
                              .replace("_", " ")
                              .toUpperCase()}
                      </span>
                      {app.application_status === "draft" && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          Step {app.current_step}/4
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        {app.email}
                      </div>
                      {app.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {app.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        {app.tutor_level?.replace("_", " ").toUpperCase() ||
                          "Not specified"}
                      </div>
                      <div className="text-gray-500">
                        Applied: {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {app.subjects && app.subjects.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {app.subjects.slice(0, 3).map((subject) => (
                          <span
                            key={subject}
                            className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                          >
                            {subject}
                          </span>
                        ))}
                        {app.subjects.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{app.subjects.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
