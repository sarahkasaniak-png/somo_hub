// // src/app/onboarding/tutor/status/page.tsx (Server Component)
// import { Suspense } from "react";
// import StatusContent from "./StatusContent";

// export default function StatusPage() {

//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//         </div>
//       }
//     >
//       <StatusContent />
//     </Suspense>
//   );
// }
// src/app/onboarding/tutor/status/page.tsx
// src/app/onboarding/tutor/status/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getApplicationStatus, ApplicationData } from "@/lib/api/tutor";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

type ApplicationStatus =
  | "draft"
  | "pending"
  | "under_review"
  | "approved"
  | "rejected";

export default function ApplicationStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationStatus>("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use refs to prevent multiple loads
  const hasLoadedData = useRef<boolean>(false);
  const loadAttempts = useRef<number>(0);

  useEffect(() => {
    // Load status only once
    if (!hasLoadedData.current) {
      hasLoadedData.current = true;
      loadStatus();
    }
  }, []);

  const loadStatus = async () => {
    // Prevent excessive retries
    loadAttempts.current += 1;
    if (loadAttempts.current > 3) {
      setError("Unable to load application status after multiple attempts.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getApplicationStatus();

      if (!data.hasApplication || !data.application) {
        // No application found, redirect to onboarding
        router.push("/onboarding/tutor");
        return;
      }

      setApplication(data.application);
      setStatus(data.application.application_status as ApplicationStatus);
    } catch (error) {
      console.error("Failed to load status:", error);
      setError("Failed to load application status. Please refresh the page.");

      // Show error toast only once
      toast.error("Failed to load application status", {
        id: "status-load-error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "rejected":
        return <XCircle className="w-16 h-16 text-red-500" />;
      case "pending":
      case "under_review":
        return <Clock className="w-16 h-16 text-yellow-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "approved":
        return "Application Approved! 🎉";
      case "rejected":
        return "Application Not Approved";
      case "pending":
        return "Application Pending Review";
      case "under_review":
        return "Application Under Review";
      default:
        return "Application Status";
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "approved":
        return "Congratulations! Your application has been approved. You can now access your tutor dashboard and start creating courses.";
      case "rejected":
        return (
          application?.admin_notes ||
          "We were unable to approve your application at this time. You can submit a new application after 30 days."
        );
      case "pending":
        return "Your application has been submitted and is waiting to be reviewed by our team. This usually takes 2-3 business days.";
      case "under_review":
        return "Your application is currently being reviewed by our team. We'll notify you via email once a decision has been made.";
      default:
        return "Your application is being processed.";
    }
  };

  const getNextSteps = () => {
    switch (status) {
      case "approved":
        return (
          <div className="space-y-2">
            <p className="font-medium">Next Steps:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Set up your tutor profile</li>
              <li>Create your first course</li>
              <li>Set your availability schedule</li>
              <li>Start accepting students</li>
            </ul>
          </div>
        );
      case "rejected":
        return (
          <div className="space-y-2">
            <p className="font-medium">What you can do:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Review the feedback provided</li>
              <li>Update your qualifications</li>
              <li>Submit a new application after 30 days</li>
              <li>Contact support for more information</li>
            </ul>
          </div>
        );
      case "pending":
      case "under_review":
        return (
          <div className="space-y-2">
            <p className="font-medium">What happens next:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Our team reviews your application</li>
              <li>We verify your documents and qualifications</li>
              <li>You'll receive an email with the decision</li>
              <li>Process typically takes 2-3 business days</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={loadStatus}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="block px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No application found.</p>
          <Link
            href="/onboarding/tutor"
            className="mt-4 inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Start Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`p-8 text-center border-b ${getStatusColor()}`}>
            <div className="flex justify-center mb-4">{getStatusIcon()}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getStatusTitle()}
            </h1>
            <p className="text-gray-600">Application #{application.id}</p>
          </div>

          {/* Application Details */}
          <div className="p-8 space-y-6">
            {/* Status Message */}
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700">{getStatusMessage()}</p>
            </div>

            {/* Application Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Personal Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Name:</span>{" "}
                    <span className="font-medium">
                      {application.official_first_name}{" "}
                      {application.official_last_name}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Tutor Level:</span>{" "}
                    <span className="font-medium capitalize">
                      {application.tutor_level?.replace(/_/g, " ")}
                    </span>
                  </p>
                  {application.tsc_number && (
                    <p>
                      <span className="text-gray-500">TSC Number:</span>{" "}
                      <span className="font-medium">
                        {application.tsc_number}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Education</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Highest Education:</span>{" "}
                    <span className="font-medium capitalize">
                      {application.highest_education_level}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Institution:</span>{" "}
                    <span className="font-medium">
                      {application.university_name}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-purple-50 rounded-xl p-6">{getNextSteps()}</div>

            {/* Timeline */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">
                      Application Submitted
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(application.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      status === "pending" ||
                      status === "under_review" ||
                      status === "approved" ||
                      status === "rejected"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">Under Review</p>
                    <p className="text-sm text-gray-500">
                      {status === "under_review" ||
                      status === "approved" ||
                      status === "rejected"
                        ? "In progress"
                        : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      status === "approved" || status === "rejected"
                        ? status === "approved"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    3
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">Decision Made</p>
                    <p className="text-sm text-gray-500">
                      {status === "approved"
                        ? "Approved"
                        : status === "rejected"
                          ? "Not Approved"
                          : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {status === "approved" && (
                <Link
                  href="/tutor/dashboard"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors text-center"
                >
                  Go to Tutor Dashboard
                </Link>
              )}

              {status === "rejected" && (
                <Link
                  href="/onboarding/tutor"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors text-center"
                >
                  Start New Application
                </Link>
              )}

              {(status === "pending" || status === "under_review") && (
                <button
                  onClick={loadStatus}
                  className="flex-1 px-6 py-3 border border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Status
                </button>
              )}

              <Link
                href="/"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Return to Home
              </Link>
            </div>

            {/* Support Info */}
            <p className="text-xs text-gray-500 text-center pt-4">
              Questions about your application?{" "}
              <Link href="/contact" className="text-purple-600 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
