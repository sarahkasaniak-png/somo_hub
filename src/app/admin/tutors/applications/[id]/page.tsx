// src/app/admin/tutors/applications/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  Briefcase,
  FileText,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-hot-toast";
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
  date_of_birth: string;
  national_id_number: string;
  national_id_front_url: string;
  national_id_back_url: string;
  highest_education_level: string;
  university_name: string;
  admission_letter_url: string;
  admission_number: string;
  certificates: any[];
  has_teaching_experience: boolean;
  tsc_number: string;
  teaching_experience_years: number;
  previous_institutions: string[];
  professional_experience: string;
  subjects: string[];
  levels: string[];
  hourly_rate: number;
  portfolio_url: string;
  payment_reference: string;
  payment_status: string;
  payment_amount: number;
  admin_notes: string;
  verified_by: number;
  verified_at: string;
  created_at: string;
  updated_at: string;
  email: string;
  phone: string;
  tutor_level?: string;
}

export default function TutorApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const [application, setApplication] = useState<TutorApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // Handle params properly for Next.js 15+
  useEffect(() => {
    const unwrapParams = async () => {
      try {
        // Check if params is a Promise (Next.js 15+)
        const unwrappedParams =
          params instanceof Promise ? await params : params;
        const id = unwrappedParams?.id;

        if (id) {
          console.log("Application ID from params:", id);
          setApplicationId(id);
        } else {
          console.error("No ID found in params:", unwrappedParams);
          toast.error("Invalid application ID");
        }
      } catch (error) {
        console.error("Error unwrapping params:", error);
        toast.error("Failed to load application ID");
      }
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    if (!applicationId) return;

    setLoading(true);
    try {
      console.log(`Fetching application with ID: ${applicationId}`);
      const response = await client.get<{
        success: boolean;
        data: TutorApplication;
      }>(`/admin/tutors/applications/${applicationId}`);

      console.log("API Response:", response);

      if (response.success && response.data) {
        setApplication(response.data);
        setAdminNotes(response.data.admin_notes || "");
      } else {
        toast.error("Failed to load application");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!applicationId) return;

    setActionLoading(true);
    try {
      const response = await client.put<{ success: boolean; message: string }>(
        `/admin/tutors/applications/${applicationId}/review`,
        {
          status,
          admin_notes: adminNotes,
          rejection_reason: status === "rejected" ? rejectReason : undefined,
        },
      );

      if (response.success) {
        toast.success(`Application ${status} successfully`);
        setShowRejectModal(false);
        fetchApplication();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!applicationId) return;

    setActionLoading(true);
    try {
      const response = await client.put<{ success: boolean; message: string }>(
        `/admin/tutors/applications/${applicationId}/notes`,
        { admin_notes: adminNotes },
      );

      if (response.success) {
        toast.success("Notes saved successfully");
      } else {
        toast.error(response.message || "Failed to save notes");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Application not found</p>
        <Link
          href="/admin/tutors/applications"
          className="text-purple-600 hover:underline mt-2 inline-block"
        >
          Back to applications
        </Link>
      </div>
    );
  }

  const getStatusBadge = () => {
    const badges = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      under_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return badges[application.application_status] || badges.pending;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/tutors/applications"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to applications
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {application.official_first_name} {application.official_last_name}
            </h1>
            <p className="text-gray-600 mt-1">Tutor Application</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()}`}
          >
            {application.application_status.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Same as before */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Personal Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="font-medium text-gray-900">
                    {application.official_first_name}{" "}
                    {application.official_last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{application.email}</p>
                  </div>
                </div>
                {application.phone && (
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{application.phone}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-500">Date of Birth</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">
                      {application.date_of_birth
                        ? new Date(
                            application.date_of_birth,
                          ).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">National ID</label>
                  <p className="text-gray-900">
                    {application.national_id_number || "Not provided"}
                  </p>
                </div>
              </div>

              {/* National ID Images */}
              {(application.national_id_front_url ||
                application.national_id_back_url) && (
                <div className="mt-4">
                  <label className="text-sm text-gray-500 mb-2 block">
                    ID Documents
                  </label>
                  <div className="flex gap-4">
                    {application.national_id_front_url && (
                      <a
                        href={application.national_id_front_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
                      >
                        <FileText className="w-4 h-4" />
                        Front Side
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {application.national_id_back_url && (
                      <a
                        href={application.national_id_back_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
                      >
                        <FileText className="w-4 h-4" />
                        Back Side
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Education</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">
                    Highest Education Level
                  </label>
                  <p className="text-gray-900">
                    {application.highest_education_level
                      ?.replace("_", " ")
                      .toUpperCase() || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    University/Institution
                  </label>
                  <p className="text-gray-900">
                    {application.university_name || "Not provided"}
                  </p>
                </div>
                {application.admission_number && (
                  <div>
                    <label className="text-sm text-gray-500">
                      Admission Number
                    </label>
                    <p className="text-gray-900">
                      {application.admission_number}
                    </p>
                  </div>
                )}
              </div>

              {application.admission_letter_url && (
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">
                    Admission Letter
                  </label>
                  <a
                    href={application.admission_letter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
                  >
                    <FileText className="w-4 h-4" />
                    View Document
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {application.certificates &&
                application.certificates.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">
                      Certificates
                    </label>
                    <div className="space-y-2">
                      {application.certificates.map((cert, index) => (
                        <a
                          key={index}
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mr-4"
                        >
                          <Award className="w-4 h-4" />
                          {cert.name || `Certificate ${index + 1}`}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Professional Experience Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Professional Experience
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Tutor Level</label>
                  <p className="text-gray-900">
                    {application.tutor_level?.replace("_", " ").toUpperCase() ||
                      "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    Teaching Experience
                  </label>
                  <p className="text-gray-900">
                    {application.has_teaching_experience
                      ? `${application.teaching_experience_years || 0} years`
                      : "No teaching experience"}
                  </p>
                </div>
                {application.tsc_number && (
                  <div>
                    <label className="text-sm text-gray-500">TSC Number</label>
                    <p className="text-gray-900">{application.tsc_number}</p>
                  </div>
                )}
              </div>

              {application.previous_institutions &&
                application.previous_institutions.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">
                      Previous Institutions
                    </label>
                    <ul className="list-disc list-inside space-y-1">
                      {application.previous_institutions.map((inst, index) => (
                        <li key={index} className="text-gray-900">
                          {inst}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {application.professional_experience && (
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">
                    Professional Experience
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {application.professional_experience}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Subjects & Specialization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Subjects & Specialization
              </h2>
            </div>
            <div className="p-6">
              {application.subjects && application.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {application.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No subjects specified</p>
              )}

              {application.levels && application.levels.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm text-gray-500 mb-2 block">
                    Teaching Levels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {application.levels.map((level) => (
                      <span
                        key={level}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {level.replace("_", " ").toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {application.hourly_rate && (
                <div className="mt-4">
                  <label className="text-sm text-gray-500">Hourly Rate</label>
                  <p className="text-gray-900 font-medium">
                    KES {application.hourly_rate.toLocaleString()}
                  </p>
                </div>
              )}

              {application.portfolio_url && (
                <div className="mt-4">
                  <label className="text-sm text-gray-500 mb-2 block">
                    Portfolio
                  </label>
                  <a
                    href={application.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
                  >
                    <Briefcase className="w-4 h-4" />
                    View Portfolio
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              {application.application_status === "pending" && (
                <>
                  <button
                    onClick={() => handleStatusChange("under_review")}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    Mark as Under Review
                  </button>
                  <button
                    onClick={() => handleStatusChange("approved")}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Application
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Application
                  </button>
                </>
              )}

              {application.application_status === "under_review" && (
                <>
                  <button
                    onClick={() => handleStatusChange("approved")}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Application
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Application
                  </button>
                </>
              )}

              {(application.application_status === "approved" ||
                application.application_status === "rejected") && (
                <button
                  onClick={() => handleStatusChange("pending")}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  Reopen Application
                </button>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Admin Notes</h2>
            </div>
            <div className="p-6">
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Add notes about this application..."
              />
              <button
                onClick={handleSaveNotes}
                disabled={actionLoading}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Save Notes
              </button>
            </div>
          </div>

          {/* Application Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Application Info</h2>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div>
                <label className="text-gray-500">Application ID</label>
                <p className="text-gray-900 font-mono">#{application.id}</p>
              </div>
              <div>
                <label className="text-gray-500">Submitted On</label>
                <p className="text-gray-900">
                  {new Date(application.created_at).toLocaleString()}
                </p>
              </div>
              {application.verified_at && (
                <div>
                  <label className="text-gray-500">Reviewed On</label>
                  <p className="text-gray-900">
                    {new Date(application.verified_at).toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <label className="text-gray-500">Payment Status</label>
                <p className="text-gray-900">
                  {application.payment_status?.toUpperCase() || "Not paid"}
                </p>
              </div>
              {application.payment_amount && (
                <div>
                  <label className="text-gray-500">Payment Amount</label>
                  <p className="text-gray-900">
                    KES {application.payment_amount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reject Application
            </h2>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this application. This will
              be sent to the applicant.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mb-4"
              placeholder="Reason for rejection..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange("rejected")}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Reject Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
