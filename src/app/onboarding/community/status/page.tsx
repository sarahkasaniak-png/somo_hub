// src/app/onboarding/tutor/status/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApplicationStatus, ApplicationData } from "@/lib/api/tutor";
import Link from "next/link";

type ApplicationStatus = "draft" | "pending" | "approved" | "rejected";

export default function ApplicationStatusPage() {
  const [status, setStatus] = useState<ApplicationStatus>("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setIsLoading(true);
      const data = await getApplicationStatus();

      if (!data.hasApplication || !data.application) {
        router.push("/onboarding/tutor");
        return;
      }

      setApplication(data.application);
      const appStatus = data.application
        .application_status as ApplicationStatus;
      setStatus(appStatus);
    } catch (error) {
      console.error("Failed to load status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          title: "Application Under Review",
          description: "Your application is being reviewed by our team.",
          icon: "⏳",
          color: "bg-yellow-100 text-yellow-800",
          message:
            "We'll notify you via email once a decision has been made. This usually takes 2-3 business days.",
        };
      case "approved":
        return {
          title: "Application Approved! 🎉",
          description: "Welcome to the tutor community!",
          icon: "✅",
          color: "bg-green-100 text-green-800",
          message:
            "You can now access your tutor dashboard and start accepting students.",
        };
      case "rejected":
        return {
          title: "Application Not Approved",
          description:
            "We were unable to approve your application at this time.",
          icon: "❌",
          color: "bg-red-100 text-red-800",
          message:
            application?.admin_notes ||
            "Please contact support for more information.",
        };
      default:
        return {
          title: "Application in Progress",
          description: "Please complete your application.",
          icon: "📝",
          color: "bg-blue-100 text-blue-800",
          message: "You have a draft application. Click below to continue.",
        };
    }
  };

  const statusConfig = getStatusConfig();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${statusConfig.color} text-4xl mb-6`}
          >
            {statusConfig.icon}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {statusConfig.title}
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            {statusConfig.description}
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-gray-700">{statusConfig.message}</p>
          </div>

          <div className="space-y-4">
            {status === "pending" && (
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-purple-600 h-2.5 rounded-full w-1/2"></div>
                </div>
                <p className="text-sm text-gray-500">Review in progress...</p>
              </div>
            )}

            {status === "approved" && (
              <div className="space-y-4">
                <Link
                  href="/tutor/dashboard"
                  className="inline-block px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Go to Tutor Dashboard
                </Link>
                <p className="text-sm text-gray-500">
                  Check your email for detailed onboarding instructions
                </p>
              </div>
            )}

            {status === "rejected" && (
              <div className="space-y-4">
                <button
                  onClick={() => router.push("/onboarding/tutor")}
                  className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Reapply with Updated Information
                </button>
                <p className="text-sm text-gray-500">
                  You can submit a new application after 30 days
                </p>
              </div>
            )}

            {status === "draft" && (
              <button
                onClick={() => router.push("/onboarding/tutor")}
                className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continue Application
              </button>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Application Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center mr-4">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Application Submitted
                  </p>
                  <p className="text-sm text-gray-500">
                    {application?.created_at
                      ? new Date(application.created_at).toLocaleDateString()
                      : "Today"}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    status === "pending" ||
                    status === "approved" ||
                    status === "rejected"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Under Review</p>
                  <p className="text-sm text-gray-500">
                    Our team is reviewing your application
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    status === "approved" || status === "rejected"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Decision Made</p>
                  <p className="text-sm text-gray-500">
                    {status === "approved"
                      ? "Approved"
                      : status === "rejected"
                      ? "Not Approved"
                      : "Pending decision"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
